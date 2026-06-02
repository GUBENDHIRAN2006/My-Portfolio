const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// MIME types lookup for static server
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Enable CORS to allow local cross-origin API calls if accessed via other local servers (e.g. VS Code Live Server)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    // API Route for status checking
    if (pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ running: true }));
        return;
    }

    // API Route for saving portfolio edits directly to disk
    if (pathname === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // Create uploads directory if it does not exist
                if (!fs.existsSync(UPLOADS_DIR)) {
                    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
                }

                // Helper function to save base64 data to files
                function saveBase64File(fileData, fileName, prefix = 'file') {
                    if (!fileData || !fileData.startsWith('data:')) {
                        return fileData; // Not a base64 string, keep as path
                    }

                    // Extract mime type and raw base64 bytes
                    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    if (!matches || matches.length !== 3) {
                        return fileData;
                    }

                    const mimeType = matches[1];
                    const base64Content = matches[2];
                    const buffer = Buffer.from(base64Content, 'base64');

                    let ext = 'bin';
                    if (fileName) {
                        const parsedExt = path.extname(fileName);
                        if (parsedExt) {
                            ext = parsedExt.substring(1); // remove leading dot
                        } else {
                            ext = mimeType.split('/')[1] || 'bin';
                        }
                    } else {
                        ext = mimeType.split('/')[1] || 'bin';
                    }

                    // Sanitize file name
                    let baseName = fileName
                        ? path.parse(fileName).name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
                        : `${prefix}_${Date.now()}`;
                    let safeName = `${baseName}.${ext}`;

                    // Resolve name conflicts by appending a counter
                    let targetPath = path.join(UPLOADS_DIR, safeName);
                    let counter = 1;
                    while (fs.existsSync(targetPath)) {
                        safeName = `${baseName}_${counter}.${ext}`;
                        targetPath = path.join(UPLOADS_DIR, safeName);
                        counter++;
                    }

                    fs.writeFileSync(targetPath, buffer);
                    return `uploads/${safeName}`;
                }

                // 1. Process profile photo
                if (data.profilePhoto && data.profilePhoto.startsWith('data:')) {
                    data.profilePhoto = saveBase64File(data.profilePhoto, 'profile_photo.jpg', 'profile');
                }

                // 2. Process internship certificates
                if (Array.isArray(data.internships)) {
                    data.internships = data.internships.map(intern => {
                        if (intern.fileData && intern.fileData.startsWith('data:')) {
                            intern.fileData = saveBase64File(intern.fileData, intern.fileName, 'internship');
                        }
                        return intern;
                    });
                }

                // 3. Process certificates
                if (Array.isArray(data.certificates)) {
                    data.certificates = data.certificates.map(cert => {
                        if (cert.fileData && cert.fileData.startsWith('data:')) {
                            cert.fileData = saveBase64File(cert.fileData, cert.fileName, 'certificate');
                        }
                        return cert;
                    });
                }

                // Write the updated state as code in data.js
                const dataJsContent = `// This file contains the portfolio data. Do not edit directly unless you know what you are doing.
const portfolioProfilePhoto = ${JSON.stringify(data.profilePhoto, null, 4)};

const portfolioProjects = ${JSON.stringify(data.projects, null, 4)};

const portfolioAchievements = ${JSON.stringify(data.achievements, null, 4)};

const portfolioInternships = ${JSON.stringify(data.internships, null, 4)};

const portfolioCertificates = ${JSON.stringify(data.certificates, null, 4)};
`;

                fs.writeFileSync(path.join(PUBLIC_DIR, 'data.js'), dataJsContent);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error('Error saving data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Serve static files
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Portfolio Admin Local Server is running!`);
    console.log(`👉 Access your site at: http://localhost:${PORT}`);
    console.log(`👉 Open settings and click 'Save to Code' to write edits to disk.`);
    console.log(`======================================================\n`);
});
