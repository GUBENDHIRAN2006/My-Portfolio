document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // Typewriter Effect (Hero Title)
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const roles = ["AI & ML Developer", "Python Architect", "Full Stack Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function handleTypewriter() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Deleting is faster
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100; // Typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentRole.length) {
            // Completed typing word - pause before delete
            isDeleting = true;
            typeDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            // Completed deleting word - move to next
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // Small break before typing next
        }

        setTimeout(handleTypewriter, typeDelay);
    }

    if (typewriterElement) {
        handleTypewriter();
    }

    // ==========================================================================
    // Navigation & Mobile Menu Menu Toggle
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon menu / x
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // Highlighting active nav link based on scroll section
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // Scroll Reveal (Entrance Fade-ins)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // Projects, Achievements, and Internships Rendering Engine
    // ==========================================================================
    const defaultProjects = [
        {
            title: "Real-Time Object Detection & Tracking",
            category: "ai-ml",
            description: "A highly optimized computer vision pipeline built with PyTorch, YOLOv8, and OpenCV. Capable of multi-object classification and tracking on dynamic video feeds with integrated GPU scheduling.",
            tech: ["Python", "PyTorch", "YOLOv8", "OpenCV", "CUDA"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        },
        {
            title: "Predictive Health Classification Engine",
            category: "ai-ml",
            description: "Developed machine learning predictive models implementing supervised training (Random Forests, Gradient Boosting) for complex analytical metrics. Achieved high accuracy with robust feature engineering.",
            tech: ["Python", "Scikit-Learn", "Matplotlib", "Seaborn", "Pandas"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        },
        {
            title: "High-Performance GPU Computing Core",
            category: "python",
            description: "Custom GPU simulation matrices programmed using PyCUDA. Designed to execute massive numerical computations and matrix operations, maximizing thread efficiency and memory access speeds.",
            tech: ["Python", "CUDA", "GPU Programming", "Jupyter"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        },
        {
            title: "Automated Data Ingestion & ETL Pipeline",
            category: "python",
            description: "A robust data scraping and processing crawler utilizing BeautifulSoup. Formulates dynamic relational datasets, performs validation, and ingestion into secure localized database setups.",
            tech: ["Python", "BeautifulSoup", "SQLite", "Git", "Docker"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        },
        {
            title: "Neural Canvas - Generative Image Platform",
            category: "fullstack",
            description: "Full-stack application presenting real-time generative models. Integrated PyTorch model hosting behind a responsive Flask backend, backed by structured SQLite data caching layers.",
            tech: ["Python", "Flask", "PyTorch", "SQLite", "HTML/CSS/JS"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        },
        {
            title: "Predictive Task Automation Dashboard",
            category: "fullstack",
            description: "An interactive workflow planner incorporating historical task data to estimate delivery dates. Features highly aesthetic data visualizations, relational SQLite tracking, and structured user permissions.",
            tech: ["HTML5", "CSS3", "JavaScript", "Flask", "MySQL", "Seaborn"],
            codeLink: "https://github.com",
            liveLink: "https://github.com"
        }
    ];

    const projectGrid = document.getElementById('project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    function getActiveProjects() {
        if (isLocal) {
            const stored = localStorage.getItem('portfolio_draft_projects');
            if (stored) return JSON.parse(stored);
        }
        return typeof portfolioProjects !== 'undefined' ? portfolioProjects : defaultProjects;
    }

    function saveLocalProject(proj) {
        const current = getActiveProjects();
        current.push(proj);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_projects', JSON.stringify(current));
        }
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderProjects(activeFilter);
        renderAdminProjects();
        updateSaveStatus(true);
    }

    function deleteLocalProject(index) {
        const current = getActiveProjects();
        current.splice(index, 1);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_projects', JSON.stringify(current));
        }
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderProjects(activeFilter);
        renderAdminProjects();
        updateSaveStatus(true);
    }

    function renderProjects(filterValue) {
        if (!projectGrid) return;

        projectGrid.innerHTML = '';
        const combined = getActiveProjects();

        const filteredProjects = filterValue === 'all'
            ? combined
            : combined.filter(p => p.category === filterValue);

        filteredProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card premium-card';

            let categoryDisplayName = 'Python';
            if (project.category === 'ai-ml') categoryDisplayName = 'AI & ML';
            if (project.category === 'fullstack') categoryDisplayName = 'Full Stack';

            const techBadges = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

            card.innerHTML = `
                <span class="project-tag">${categoryDisplayName}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech-used">
                    ${techBadges}
                </div>
                <div class="project-actions">
                    <a href="${project.codeLink}" target="_blank" class="project-link">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                        </svg> Code
                    </a>
                    <a href="${project.liveLink}" target="_blank" class="project-link">
                        <i data-lucide="external-link"></i> Live Demo
                    </a>
                </div>
            `;
            projectGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderProjects(button.getAttribute('data-filter'));
        });
    });

    // Achievements Data & Persistence
    const defaultAchievements = [
        {
            title: "Academic Excellence Honor Roll",
            icon: "trophy",
            description: "Maintained a robust average CGPA of 8.1 throughout the B.Tech in AI & Data Science coursework, ranking among the top students in technical classes."
        },
        {
            title: "Hackathon Technical Finalist",
            icon: "code",
            description: "Successfully conceptualized and integrated custom machine learning and vision pipelines under tight deadlines during inter-collegiate technical challenges."
        }
    ];

    function getActiveAchievements() {
        if (isLocal) {
            const stored = localStorage.getItem('portfolio_draft_achievements');
            if (stored) return JSON.parse(stored);
        }
        return typeof portfolioAchievements !== 'undefined' ? portfolioAchievements : defaultAchievements;
    }

    function saveLocalAchievement(ach) {
        const current = getActiveAchievements();
        current.push(ach);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_achievements', JSON.stringify(current));
        }
        renderAchievements();
        renderAdminAchievements();
        updateSaveStatus(true);
    }

    function deleteLocalAchievement(index) {
        const current = getActiveAchievements();
        current.splice(index, 1);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_achievements', JSON.stringify(current));
        }
        renderAchievements();
        renderAdminAchievements();
        updateSaveStatus(true);
    }

    function renderAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        achievementsList.innerHTML = '';

        const combined = getActiveAchievements();

        combined.forEach(ach => {
            const item = document.createElement('div');
            item.className = 'achievement-item premium-card';

            let iconMarkup = '<i data-lucide="trophy"></i>';
            if (ach.icon === 'code') iconMarkup = '<i data-lucide="code"></i>';
            else if (ach.icon === 'award') iconMarkup = '<i data-lucide="award"></i>';

            item.innerHTML = `
                <div class="achievement-icon">${iconMarkup}</div>
                <div class="achievement-info">
                    <h4>${ach.title}</h4>
                    <p>${ach.description}</p>
                </div>
            `;
            achievementsList.appendChild(item);
        });
        lucide.createIcons();
    }

    // Internships Data & Persistence
    const defaultInternships = [
        {
            title: "LearnFlu",
            company: "AI & Machine Learning Internship",
            duration: "Jun 2025 – Sep 2025",
            location: "Bengaluru, India (Remote/Hybrid)",
            bullets: [
                "Acquired comprehensive, hands-on experience in building and thoroughly evaluating machine learning models using Python for real-world analytical tasks.",
                "Implemented custom preprocessing pipelines, handled missing data, and developed predictive architectures using standard scientific libraries.",
                "Employed regression, classification, and validation methods to improve reliability and model outputs."
            ]
        }
    ];

    function getActiveInternships() {
        if (isLocal) {
            const stored = localStorage.getItem('portfolio_draft_internships');
            if (stored) return JSON.parse(stored);
        }
        return typeof portfolioInternships !== 'undefined' ? portfolioInternships : defaultInternships;
    }

    function saveLocalInternship(intern) {
        const current = getActiveInternships();
        current.push(intern);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_internships', JSON.stringify(current));
        }
        renderInternships();
        renderAdminInternships();
        updateSaveStatus(true);
    }

    function deleteLocalInternship(index) {
        const current = getActiveInternships();
        current.splice(index, 1);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_internships', JSON.stringify(current));
        }
        renderInternships();
        renderAdminInternships();
        updateSaveStatus(true);
    }

    function renderInternships() {
        const internshipContainer = document.getElementById('internship-container');
        if (!internshipContainer) return;
        internshipContainer.innerHTML = '';

        const combined = getActiveInternships();

        combined.forEach(intern => {
            const card = document.createElement('div');
            card.className = 'internship-card premium-card';

            const bulletItems = intern.bullets.map(b => `<li>${b}</li>`).join('');

            let actionMarkup = '';
            if (intern.fileData) {
                actionMarkup = `
                    <div class="internship-actions" style="margin-top: 20px; border-top: 1px solid var(--border-light); padding-top: 16px;">
                        <a href="${intern.fileData}" class="project-link view-doc-btn" data-title="${intern.title} Certificate" data-filename="${intern.fileName || ''}">
                            <i data-lucide="file-text"></i> View Certificate
                        </a>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="internship-badge">Valuable Experience</div>
                <div class="internship-header">
                    <div class="company-logo">
                        <i data-lucide="briefcase"></i>
                    </div>
                    <div class="internship-title-group">
                        <h3>${intern.title}</h3>
                        <h4>${intern.company}</h4>
                    </div>
                    <div class="internship-meta">
                        <span class="meta-item"><i data-lucide="calendar"></i> ${intern.duration}</span>
                        <span class="meta-item"><i data-lucide="map-pin"></i> ${intern.location}</span>
                    </div>
                </div>
                <div class="internship-details">
                    <h5>About the Role & Responsibilities:</h5>
                    <ul class="internship-bullets">
                        ${bulletItems}
                    </ul>
                </div>
                ${actionMarkup}
            `;
            internshipContainer.appendChild(card);
        });
        lucide.createIcons();
    }

    // ==========================================================================
    // Local-Only Settings & Certificates Logic (Admin Panel)
    // ==========================================================================
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    const adminSettingsContainer = document.getElementById('admin-settings-container');
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminCloseBtn = document.getElementById('admin-close-btn');
    const addCertificateForm = document.getElementById('add-certificate-form');
    const adminCertList = document.getElementById('admin-cert-list');
    const certificatesGrid = document.getElementById('certificates-grid');

    // Profile Photo Rendering Engine
    function getActiveProfilePhoto() {
        if (isLocal) {
            const stored = localStorage.getItem('portfolio_draft_profile_photo');
            if (stored !== null) return stored;
        }
        return typeof portfolioProfilePhoto !== 'undefined' ? portfolioProfilePhoto : "";
    }

    function renderProfilePhoto() {
        const heroVisualContainer = document.getElementById('hero-visual-container');
        if (!heroVisualContainer) return;

        const storedPhoto = getActiveProfilePhoto();
        if (storedPhoto) {
            heroVisualContainer.innerHTML = `
                <div class="custom-avatar-wrapper">
                    <img src="${storedPhoto}" class="custom-avatar-img" alt="Gubendhiran J">
                </div>
            `;
        } else {
            heroVisualContainer.innerHTML = `
                <div class="avatar-ring" id="default-hero-avatar">
                    <div class="ring-core">
                        <i data-lucide="cpu" class="visual-core-icon"></i>
                    </div>
                    <div class="orbit orbit-1">
                        <div class="orbit-node node-python"><i data-lucide="code-2"></i></div>
                    </div>
                    <div class="orbit orbit-2">
                        <div class="orbit-node node-ai"><i data-lucide="brain-circuit"></i></div>
                    </div>
                    <div class="orbit orbit-3">
                        <div class="orbit-node node-web"><i data-lucide="globe"></i></div>
                    </div>
                </div>
            `;
        }
        lucide.createIcons();
    }

    // Initial Hardcoded Certificates
    const defaultCertificates = [
        {
            title: "AI & Machine Learning Internship Certificate",
            issuer: "LearnFlu Training Academy",
            description: "Granted upon successful completion of hands-on ML model design, evaluation pipelines, and Python scripting for practical deployment.",
            link: "https://learnflu.com",
            fileName: "LearnFlu_Internship.pdf"
        }
    ];

    function getActiveCertificates() {
        if (isLocal) {
            const stored = localStorage.getItem('portfolio_draft_certificates');
            if (stored) return JSON.parse(stored);
        }
        return typeof portfolioCertificates !== 'undefined' ? portfolioCertificates : defaultCertificates;
    }

    function saveLocalCertificate(cert) {
        const current = getActiveCertificates();
        current.push(cert);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_certificates', JSON.stringify(current));
        }
        renderAllCertificates();
        renderAdminList();
        updateSaveStatus(true);
    }

    function deleteLocalCertificate(index) {
        const current = getActiveCertificates();
        current.splice(index, 1);
        if (isLocal) {
            localStorage.setItem('portfolio_draft_certificates', JSON.stringify(current));
        }
        renderAllCertificates();
        renderAdminList();
        updateSaveStatus(true);
    }

    function renderAllCertificates() {
        if (!certificatesGrid) return;
        certificatesGrid.innerHTML = '';

        const combined = getActiveCertificates();

        combined.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'certificate-card premium-card';

            const fileUrl = cert.fileData ? cert.fileData : cert.link;

            card.innerHTML = `
                <h4>${cert.title}</h4>
                <div class="certificate-issuer">Issued by ${cert.issuer}</div>
                <p>${cert.description}</p>
                <a href="${fileUrl}" class="project-link view-doc-btn" data-title="${cert.title}" data-filename="${cert.fileName || ''}" ${!cert.fileData ? 'target="_blank"' : ''}>
                    <i data-lucide="file-text"></i> View Credentials (${cert.fileName || 'Verification Link'})
                </a>
            `;
            certificatesGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    function renderAdminList() {
        if (!adminCertList) return;
        adminCertList.innerHTML = '';
        const activeCerts = getActiveCertificates();

        if (activeCerts.length === 0) {
            adminCertList.innerHTML = '<li class="admin-info-note">No certificates. Add one above!</li>';
            return;
        }

        activeCerts.forEach((cert, index) => {
            const li = document.createElement('li');
            li.className = 'admin-cert-item';
            li.innerHTML = `
                <div class="admin-cert-info">
                    <h5>${cert.title}</h5>
                    <span>${cert.issuer} (${cert.fileName || 'Link'})</span>
                </div>
                <button class="admin-cert-delete btn-danger" data-index="${index}" title="Remove Certificate">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            adminCertList.appendChild(li);
        });

        const deleteButtons = adminCertList.querySelectorAll('.admin-cert-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                deleteLocalCertificate(idx);
            });
        });

        lucide.createIcons();
    }

    // Render Admin List for Projects
    function renderAdminProjects() {
        const adminProjList = document.getElementById('admin-proj-list');
        if (!adminProjList) return;
        adminProjList.innerHTML = '';
        const activeProjs = getActiveProjects();

        if (activeProjs.length === 0) {
            adminProjList.innerHTML = '<li class="admin-info-note">No projects. Add one above!</li>';
            return;
        }

        activeProjs.forEach((proj, index) => {
            const li = document.createElement('li');
            li.className = 'admin-cert-item';
            li.innerHTML = `
                <div class="admin-cert-info">
                    <h5>${proj.title}</h5>
                    <span>${proj.category}</span>
                </div>
                <button class="admin-proj-delete btn-danger" data-index="${index}" title="Remove Project">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            adminProjList.appendChild(li);
        });

        const deleteButtons = adminProjList.querySelectorAll('.admin-proj-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                deleteLocalProject(idx);
            });
        });

        lucide.createIcons();
    }

    // Render Admin List for Internships
    function renderAdminInternships() {
        const adminInternList = document.getElementById('admin-intern-list');
        if (!adminInternList) return;
        adminInternList.innerHTML = '';
        const activeInterns = getActiveInternships();

        if (activeInterns.length === 0) {
            adminInternList.innerHTML = '<li class="admin-info-note">No internships. Add one above!</li>';
            return;
        }

        activeInterns.forEach((intern, index) => {
            const li = document.createElement('li');
            li.className = 'admin-cert-item';
            li.innerHTML = `
                <div class="admin-cert-info">
                    <h5>${intern.title}</h5>
                    <span>${intern.company}</span>
                </div>
                <button class="admin-intern-delete btn-danger" data-index="${index}" title="Remove Internship">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            adminInternList.appendChild(li);
        });

        const deleteButtons = adminInternList.querySelectorAll('.admin-intern-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                deleteLocalInternship(idx);
            });
        });

        lucide.createIcons();
    }

    // Render Admin List for Achievements
    function renderAdminAchievements() {
        const adminAchieveList = document.getElementById('admin-achieve-list');
        if (!adminAchieveList) return;
        adminAchieveList.innerHTML = '';
        const activeAchs = getActiveAchievements();

        if (activeAchs.length === 0) {
            adminAchieveList.innerHTML = '<li class="admin-info-note">No achievements. Add one above!</li>';
            return;
        }

        activeAchs.forEach((ach, index) => {
            const li = document.createElement('li');
            li.className = 'admin-cert-item';
            li.innerHTML = `
                <div class="admin-cert-info">
                    <h5>${ach.title}</h5>
                    <span>${ach.icon}</span>
                </div>
                <button class="admin-achieve-delete btn-danger" data-index="${index}" title="Remove Achievement">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            adminAchieveList.appendChild(li);
        });

        const deleteButtons = adminAchieveList.querySelectorAll('.admin-achieve-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                deleteLocalAchievement(idx);
            });
        });

        lucide.createIcons();
    }

    // Save indicator / server synchronization functions
    let isServerConnected = false;
    const serverUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (window.location.port === '3000' ? '' : 'http://localhost:3000')
        : 'http://localhost:3000';

    function checkServerConnection() {
        const dot = document.getElementById('server-status-dot');
        const text = document.getElementById('server-status-text');
        const autoSaveBtn = document.getElementById('btn-auto-save');

        if (!dot || !text) return;

        dot.style.background = '#9ca3af';
        text.textContent = 'Checking local server connection...';
        if (autoSaveBtn) autoSaveBtn.disabled = true;

        fetch(`${serverUrl}/api/status`)
            .then(res => res.json())
            .then(data => {
                if (data && data.running) {
                    isServerConnected = true;
                    dot.style.background = '#10b981';
                    text.innerHTML = '<strong>Local Server Connected</strong> (Running on port 3000)';
                    if (autoSaveBtn) autoSaveBtn.disabled = false;
                } else {
                    throw new Error('Not running');
                }
            })
            .catch(err => {
                isServerConnected = false;
                dot.style.background = '#ef4444';
                text.innerHTML = '<strong>Local Server Disconnected</strong> (Run <code>node server.js</code>)';
                if (autoSaveBtn) autoSaveBtn.disabled = true;
            });
    }

    function hasUnsavedChanges() {
        return localStorage.getItem('portfolio_draft_projects') !== null ||
            localStorage.getItem('portfolio_draft_achievements') !== null ||
            localStorage.getItem('portfolio_draft_internships') !== null ||
            localStorage.getItem('portfolio_draft_certificates') !== null ||
            localStorage.getItem('portfolio_draft_profile_photo') !== null;
    }

    function updateSaveStatus(hasChanges) {
        const saveTabBtn = document.querySelector('.admin-tab-btn[data-tab="tab-save"]');
        if (saveTabBtn) {
            if (hasChanges) {
                saveTabBtn.innerHTML = '<i data-lucide="save"></i> Save to Code <span class="unsaved-badge" style="background:#db2777; width:8px; height:8px; border-radius:50%; display:inline-block; margin-left:4px;" title="Unsaved changes"></span>';
            } else {
                saveTabBtn.innerHTML = '<i data-lucide="save"></i> Save to Code';
            }
            lucide.createIcons();
        }
    }

    function handleAutoSave() {
        const autoSaveBtn = document.getElementById('btn-auto-save');
        const originalText = autoSaveBtn.innerHTML;
        autoSaveBtn.disabled = true;
        autoSaveBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon animate-spin" style="animation: spin 1s linear infinite;"></i> Saving...';
        lucide.createIcons();

        const payload = {
            profilePhoto: getActiveProfilePhoto(),
            projects: getActiveProjects(),
            achievements: getActiveAchievements(),
            internships: getActiveInternships(),
            certificates: getActiveCertificates()
        };

        fetch(`${serverUrl}/api/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save');
                return res.json();
            })
            .then(data => {
                alert('Successfully saved changes directly to project files!');
                localStorage.removeItem('portfolio_draft_projects');
                localStorage.removeItem('portfolio_draft_achievements');
                localStorage.removeItem('portfolio_draft_internships');
                localStorage.removeItem('portfolio_draft_certificates');
                localStorage.removeItem('portfolio_draft_profile_photo');
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert('Failed to save to local server. Make sure node server.js is running.');
                autoSaveBtn.disabled = false;
                autoSaveBtn.innerHTML = originalText;
                lucide.createIcons();
            });
    }

    function handleManualDownload() {
        const profilePhoto = getActiveProfilePhoto();
        const projects = getActiveProjects();
        const achievements = getActiveAchievements();
        const internships = getActiveInternships();
        const certificates = getActiveCertificates();

        const content = `// This file contains the portfolio data. Do not edit directly unless you know what you are doing.
const portfolioProfilePhoto = ${JSON.stringify(profilePhoto, null, 4)};

const portfolioProjects = ${JSON.stringify(projects, null, 4)};

const portfolioAchievements = ${JSON.stringify(achievements, null, 4)};

const portfolioInternships = ${JSON.stringify(internships, null, 4)};

const portfolioCertificates = ${JSON.stringify(certificates, null, 4)};
`;

        const blob = new Blob([content], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        a.click();
        URL.revokeObjectURL(url);

        alert('Your updated "data.js" file is downloading!\n\nPlease save it in your project directory (overwriting the existing one), then click "Reset Draft" to sync and reload.');
    }

    function handleResetDraft() {
        if (confirm('Are you sure you want to discard your local staging changes and reload the data from your project files?')) {
            localStorage.removeItem('portfolio_draft_projects');
            localStorage.removeItem('portfolio_draft_achievements');
            localStorage.removeItem('portfolio_draft_internships');
            localStorage.removeItem('portfolio_draft_certificates');
            localStorage.removeItem('portfolio_draft_profile_photo');
            window.location.reload();
        }
    }

    if (isLocal) {
        if (adminSettingsContainer) {
            adminSettingsContainer.classList.remove('hidden');
        }

        if (adminToggleBtn) {
            adminToggleBtn.addEventListener('click', () => {
                adminModal.classList.remove('hidden');
                renderAdminList();
            });
        }

        if (adminCloseBtn) {
            adminCloseBtn.addEventListener('click', () => {
                adminModal.classList.add('hidden');
            });
        }

        if (adminModal) {
            adminModal.addEventListener('click', (e) => {
                if (e.target === adminModal) {
                    adminModal.classList.add('hidden');
                }
            });
        }

        // Tab switching logic
        const tabButtons = document.querySelectorAll('.admin-tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.add('hidden'));

                btn.classList.add('active');
                const targetTab = document.getElementById(btn.getAttribute('data-tab'));
                if (targetTab) {
                    targetTab.classList.remove('hidden');
                }

                const tabId = btn.getAttribute('data-tab');
                if (tabId === 'tab-projects') renderAdminProjects();
                if (tabId === 'tab-internships') renderAdminInternships();
                if (tabId === 'tab-achievements') renderAdminAchievements();
                if (tabId === 'tab-certificates') renderAdminList();
                if (tabId === 'tab-save') checkServerConnection();
            });
        });

        // Profile photo handlers
        const profilePhotoForm = document.getElementById('profile-photo-form');
        const clearProfilePhotoBtn = document.getElementById('clear-profile-photo-btn');

        if (profilePhotoForm) {
            profilePhotoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('profile-photo-file');
                const file = fileInput.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        const max_size = 600;
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);

                        try {
                            localStorage.setItem('portfolio_draft_profile_photo', compressedBase64);
                            renderProfilePhoto();
                            profilePhotoForm.reset();
                            adminModal.classList.add('hidden');
                            updateSaveStatus(true);
                        } catch (error) {
                            console.error("Storage error:", error);
                            alert("Storage quota exceeded. Please select a smaller photo.");
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        if (clearProfilePhotoBtn) {
            clearProfilePhotoBtn.addEventListener('click', () => {
                localStorage.setItem('portfolio_draft_profile_photo', "");
                renderProfilePhoto();
                adminModal.classList.add('hidden');
                updateSaveStatus(true);
            });
        }

        // Add Project Form
        const addProjectForm = document.getElementById('add-project-form');
        if (addProjectForm) {
            addProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('proj-title').value;
                const category = document.getElementById('proj-category').value;
                const description = document.getElementById('proj-desc').value;
                const techStr = document.getElementById('proj-tech').value;
                const codeLink = document.getElementById('proj-code').value;
                const liveLink = document.getElementById('proj-live').value || codeLink;

                const tech = techStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

                saveLocalProject({
                    title,
                    category,
                    description,
                    tech,
                    codeLink,
                    liveLink
                });
                addProjectForm.reset();
            });
        }

        // Add Internship Form
        const addInternshipForm = document.getElementById('add-internship-form');
        if (addInternshipForm) {
            addInternshipForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('intern-title').value;
                const company = document.getElementById('intern-company').value;
                const duration = document.getElementById('intern-duration').value;
                const location = document.getElementById('intern-location').value;
                const bulletText = document.getElementById('intern-bullets').value;
                const fileInput = document.getElementById('intern-file');

                const bullets = bulletText.split('\n').map(b => b.trim()).filter(b => b.length > 0);
                const file = fileInput ? fileInput.files[0] : null;

                const newInternship = {
                    title,
                    company,
                    duration,
                    location,
                    bullets
                };

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        newInternship.fileData = event.target.result;
                        newInternship.fileName = file.name;
                        saveLocalInternship(newInternship);
                        addInternshipForm.reset();
                    };
                    reader.readAsDataURL(file);
                } else {
                    saveLocalInternship(newInternship);
                    addInternshipForm.reset();
                }
            });
        }

        // Add Achievement Form
        const addAchievementForm = document.getElementById('add-achievement-form');
        if (addAchievementForm) {
            addAchievementForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('achieve-title').value;
                const icon = document.getElementById('achieve-icon').value;
                const description = document.getElementById('achieve-desc').value;

                saveLocalAchievement({
                    title,
                    icon,
                    description
                });
                addAchievementForm.reset();
            });
        }

        // Add Certificate Form
        if (addCertificateForm) {
            addCertificateForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const title = document.getElementById('cert-title').value;
                const issuer = document.getElementById('cert-issuer').value;
                const description = document.getElementById('cert-desc').value;
                const link = document.getElementById('cert-link').value;
                const fileInput = document.getElementById('cert-file');

                const file = fileInput.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    const fileData = event.target.result;
                    const newCertificate = {
                        title,
                        issuer,
                        description,
                        link,
                        fileData,
                        fileName: file.name
                    };

                    saveLocalCertificate(newCertificate);
                    addCertificateForm.reset();
                };

                reader.readAsDataURL(file);
            });
        }

        // Save Tab Button Listeners
        const reconnectBtn = document.getElementById('btn-reconnect-server');
        if (reconnectBtn) {
            reconnectBtn.addEventListener('click', checkServerConnection);
        }

        const autoSaveBtn = document.getElementById('btn-auto-save');
        if (autoSaveBtn) {
            autoSaveBtn.addEventListener('click', handleAutoSave);
        }

        const manualDownloadBtn = document.getElementById('btn-manual-download');
        if (manualDownloadBtn) {
            manualDownloadBtn.addEventListener('click', handleManualDownload);
        }

        const resetDraftBtn = document.getElementById('btn-reset-draft');
        if (resetDraftBtn) {
            resetDraftBtn.addEventListener('click', handleResetDraft);
        }

        // Initialize status
        checkServerConnection();
        updateSaveStatus(hasUnsavedChanges());
    }

    renderProjects('all');
    renderAllCertificates();
    renderProfilePhoto();
    renderAchievements();
    renderInternships();

    // ==========================================================================
    // Contact Form Logic & Real Gmail Sending
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon animate-spin" style="animation: spin 1s linear infinite;"></i> Sending Message...';
            lucide.createIcons();

            // Extract input values
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Submit using FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/gubendhiran0710@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            })
                .then(response => {
                    if (!response.ok) {
                        // Attempt to parse json error, or throw generic error
                        return response.json().then(errData => {
                            throw new Error(errData.message || "Failed to submit form.");
                        }).catch(() => {
                            throw new Error("HTTP error " + response.status);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    lucide.createIcons();

                    if (data.success === "true" || data.success === true) {
                        formFeedback.textContent = "Thank you! Your message has been sent successfully to gubendhiran0710@gmail.com.";
                        formFeedback.className = "form-feedback success";
                        formFeedback.classList.remove('hidden');
                        contactForm.reset();
                    } else {
                        formFeedback.textContent = data.message || "Submission failed. Please try again.";
                        formFeedback.className = "form-feedback error";
                        formFeedback.classList.remove('hidden');
                    }

                    setTimeout(() => {
                        formFeedback.classList.add('hidden');
                    }, 8000);
                })
                .catch(err => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    lucide.createIcons();
                    console.error("FormSubmit Error:", err);

                    formFeedback.textContent = err.message || "Submission failed. Please check your connection and try again.";
                    formFeedback.className = "form-feedback error";
                    formFeedback.classList.remove('hidden');

                    setTimeout(() => {
                        formFeedback.classList.add('hidden');
                    }, 8000);
                });
        });
    }

    // ==========================================================================
    // Document Viewer Modal Lightbox Logic
    // ==========================================================================
    function showDocumentInModal(title, dataUri, filename) {
        const modal = document.getElementById('doc-viewer-modal');
        const modalTitle = document.getElementById('doc-viewer-title');
        const modalBody = document.getElementById('doc-viewer-body');
        if (!modal || !modalBody) return;

        modalTitle.textContent = title;
        modalBody.innerHTML = '';

        if (dataUri.startsWith('data:image/')) {
            const img = document.createElement('img');
            img.src = dataUri;
            img.className = 'doc-viewer-img';
            img.alt = title;
            modalBody.appendChild(img);
        } else if (dataUri.startsWith('data:application/pdf;')) {
            const iframe = document.createElement('iframe');
            iframe.src = dataUri;
            iframe.className = 'doc-viewer-pdf';
            modalBody.appendChild(iframe);
        } else {
            modalBody.innerHTML = `
                <div class="doc-viewer-fallback">
                    <p>This file type cannot be displayed directly in the browser.</p>
                    <a href="${dataUri}" download="${filename || 'document'}" class="btn btn-primary">
                        <i data-lucide="download"></i> Download Document
                    </a>
                </div>
            `;
            lucide.createIcons();
        }

        modal.classList.remove('hidden');
    }

    // Modal Close listeners
    const docViewerModal = document.getElementById('doc-viewer-modal');
    const docViewerClose = document.getElementById('doc-viewer-close');
    if (docViewerClose && docViewerModal) {
        docViewerClose.addEventListener('click', () => {
            docViewerModal.classList.add('hidden');
        });
        docViewerModal.addEventListener('click', (e) => {
            if (e.target === docViewerModal) {
                docViewerModal.classList.add('hidden');
            }
        });
    }

    // Intercept View Document Button Clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-doc-btn');
        if (btn) {
            const href = btn.getAttribute('href');
            const title = btn.getAttribute('data-title');
            const filename = btn.getAttribute('data-filename');

            if (href && href.startsWith('data:')) {
                e.preventDefault();
                showDocumentInModal(title, href, filename);
            }
        }
    });
});
