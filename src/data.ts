import { Skill, Project, CtfChallenge, Certification, CtfWriteup, PlatformActivity } from './types';

export const PROFILE_LINKS = {
  github: 'https://github.com/AdityaBhardwaj04',
  linkedin: 'https://www.linkedin.com/in/abhardwaj28',
  htb: 'https://app.hackthebox.com/public/users/3113017',
  email: 'abd.aditya10@outlook.com',
} as const;

export const SKILLS_DATA: Skill[] = [
  {
    id: 'netsec',
    name: 'Network Security',
    icon: 'ShieldAlert',
    level: 85,
    description: 'IDS/IPS configuration, firewall auditing, network segmentation, and protocol analysis.',
    category: 'core',
    details: [
      'Configuring and monitoring Snort IDS & Suricata IPS rules.',
      'Auditing complex Cisco and pfSense firewall rule configurations.',
      'Analyzing network-level protocol headers and packet behaviors.',
      'Conducting internal network penetration testing and segment isolation validations.'
    ]
  },
  {
    id: 'webexplo',
    name: 'Web Exploitation',
    icon: 'Globe',
    level: 90,
    description: 'OWASP Top 10 vulnerabilities, API security assessments, and custom exploit development.',
    category: 'core',
    details: [
      'Identifying and exploiting SQLi, XSS, CSRF, and SSRF flaws.',
      'Analyzing OAuth 2.0 authorization flows and authentication bypasses.',
      'Static & dynamic security code auditing for web applications.',
      'Automating vulnerability scanning with customized scripts.'
    ]
  },
  {
    id: 'pentest',
    name: 'Penetration Testing',
    icon: 'Crosshair',
    level: 88,
    description: 'Black-box and white-box assessments, Active Directory exploitation, and report generation.',
    category: 'core',
    details: [
      'Comprehensive external & internal network pentesting.',
      'Active Directory exploitation: Kerberoasting, AS-REP roasting, BloodHound analysis.',
      'Compiling structured pentest reports with CVSS risk metrics.',
      'Delivering post-remediation security validations.'
    ]
  },
  {
    id: 'privesc',
    name: 'Privilege Escalation',
    icon: 'CornerRightUp',
    level: 82,
    description: 'Exploiting Linux/Windows misconfigurations, unquoted service paths, and kernel exploits.',
    category: 'core',
    details: [
      'Exploiting Windows token manipulation, unquoted service paths, and DLL hijacking.',
      'Leveraging Linux SUID binaries, misconfigured sudo rules, and cron job exploits.',
      'Kernel level exploit customization and shell upgrade methodologies.',
      'Automated privilege escalation analysis (WinPEAS, LinPEAS).'
    ]
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: 'Terminal',
    level: 92,
    description: 'System administration, bash scripting, system hardening, and secure service hosting.',
    category: 'language',
    details: [
      'Advanced shell scripting (Bash, Sed, Awk) for automation.',
      'Hardening Linux systems: SSH security, PAM configurations, and SELinux/AppArmor.',
      'Docker security isolation audits and container runtime defense.',
      'Live forensic analysis and log auditing (auth.log, syslog).'
    ]
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'Code',
    level: 85,
    description: 'Custom security tools, socket programming, automated exploits, and data parsers.',
    category: 'language',
    details: [
      'Developing custom multi-threaded network port scanners.',
      'Writing automated exploit payloads and API fuzzers.',
      'Parsing binary structures, PCAPs, and CSV formats at scale.',
      'Scripting secure communications using cryptographic libraries (Cryptography, PyJWT).'
    ]
  },
  {
    id: 'burpsuite',
    name: 'Burp Suite',
    icon: 'Zap',
    level: 95,
    description: 'Advanced traffic manipulation, custom extensions, request smuggling, and web socket auditing.',
    category: 'tool',
    details: [
      'Customizing intruder payloads and matching complex regex extractors.',
      'Auditing WebSockets and CORS headers for misconfigurations.',
      'Developing Burp plugins in Python/Java to customize traffic parsing.',
      'Leveraging Turbo Intruder for race conditions and rate-limit bypasses.'
    ]
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    icon: 'Activity',
    level: 87,
    description: 'Deep packet inspection, custom filters, TLS decryption, and malware traffic analysis.',
    category: 'tool',
    details: [
      'Writing advanced Wireshark display filters to isolate anomalous packets.',
      'Reconstructing TCP/HTTP streams to recover transferred payloads.',
      'Decrypting TLS streams using pre-master secret key logs.',
      'Identifying command-and-control (C2) beaconing patterns.'
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'reconforges',
    name: 'ReconForges',
    description: 'Modular Python recon automation framework for penetration testing workflows.',
    longDescription: 'A modular, Python-based security automation tool that orchestrates industry-standard open-source tools into a structured reconnaissance pipeline — from subdomain discovery through vulnerability identification. Supports parallel processing via ThreadPoolExecutor, graceful degradation when tools are missing, and multiple output formats including JSON, HTML reports, and network graphs.',
    tags: ['Python', 'Subfinder', 'Amass', 'httpx', 'Katana', 'Nmap', 'WhatWeb', 'Nuclei'],
    architecture: [
      'CLI entry point parsing target domain and scan configuration flags.',
      'Modular pipeline stages: Subdomain Discovery → Host Verification → Web Crawling → Port Scanning → Tech Fingerprinting → Vulnerability Detection.',
      'ThreadPoolExecutor for concurrent scanning with rate limiting and scope controls.',
      'Output engine generating structured text, JSON, HTML reports, and networkx graph visualizations.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/ReconForges',
    highlights: [
      {
        title: 'Full Pipeline Automation',
        description: 'Single command takes a domain from initial subdomain discovery through vulnerability identification, feeding enriched endpoints (full scheme + host + path) into Nuclei for precise targeting.',
      },
      {
        title: 'Graceful Degradation',
        description: 'Each module checks tool availability at runtime and falls back to Python-based alternatives (e.g., built-in web crawler when Katana is unavailable), ensuring the pipeline never breaks.',
      }
    ],
  },
  {
    id: 'cipherchat',
    name: 'CipherChat',
    description: 'E2E encrypted messaging — the server never sees your plaintext.',
    longDescription: 'An end-to-end encrypted messaging platform using hybrid encryption: each message is encrypted with a random AES-256-GCM key, and that key is wrapped with the recipient\'s RSA-2048-OAEP public key. Private keys are generated in the browser via Web Crypto API and stored in IndexedDB. Messages are persisted to Firestore encrypted twice — once with the recipient\'s public key and once with your own. The server never sees plaintext. Includes a React web app (Vite + Firebase Auth) and a Node.js CLI client that imports keys via .pem export.',
    tags: ['AES-256-GCM', 'RSA-2048-OAEP', 'Web Crypto API', 'React', 'Firebase', 'Socket.IO', 'Node.js CLI'],
    architecture: [
      'Hybrid encryption: random AES-256-GCM session key per message, wrapped with recipient\'s RSA-2048-OAEP public key.',
      'Web Crypto API generates RSA key pairs in-browser; private keys stored in IndexedDB, public keys in Firestore.',
      'Express relay server + Socket.IO forwarding encrypted payloads — zero access to plaintext.',
      'Firestore stores messages encrypted twice (recipient + sender copy) for persistence.',
      'CLI client imports private key via .pem export from the web app for terminal-based messaging.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/CipherChat',
    highlights: [
      {
        title: 'Hybrid Encryption (AES-256 + RSA-2048)',
        description: 'Each message is encrypted with a random AES-256-GCM key, then that key is wrapped with the recipient\'s RSA-2048-OAEP public key — the same pattern used by PGP and Signal.',
      },
      {
        title: 'Zero-Knowledge Relay Server',
        description: 'The Express server and Firestore only ever handle ciphertext. Private keys never leave the client device — generated via Web Crypto API and stored in IndexedDB.',
      },
      {
        title: 'Bring Your Own Firebase',
        description: 'Users paste their own Firebase project config on first visit. No shared backend infrastructure — each deployment is fully isolated.',
      },
      {
        title: 'Web + CLI Clients',
        description: 'React web app for browser-based messaging plus a Node.js CLI client (Inquirer + Chalk) that imports the private key via .pem file export.',
      }
    ],
  },
  {
    id: 'medinv',
    name: 'Medicine Inventory Management System',
    description: 'Full-stack pharmacy management system built with Flask, React, and MongoDB.',
    longDescription: 'A comprehensive full-stack solution for pharmacies to manage stock tracking, patient billing with flexible discount options, and sales analytics. Features an admin dashboard for user account management and real-time stock monitoring, a billing module with per-item quantities and multiple payment methods, and a customer-facing barcode scanner for streamlined product lookup.',
    tags: ['Flask', 'React', 'MongoDB Atlas', 'Flask-RESTful', 'jsPDF', 'Barcode Scanner'],
    architecture: [
      'Python/Flask backend exposing RESTful API endpoints via Flask-RESTful.',
      'MongoDB Atlas for persistent medicine records, transactions, and user data.',
      'React SPA frontend with barcode scanning (react-barcode-reader) and PDF invoice generation (jsPDF).'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/medicine-inventory',
    highlights: [
      {
        title: 'Billing & Discount Engine',
        description: 'Creates itemized patient invoices supporting per-item quantities, percentage-based discounts, multiple payment methods, and automatic stock reduction on billing.',
      },
      {
        title: 'Sales Analytics',
        description: 'Generates transaction reports filtered by date ranges with earnings breakdown by payment type for pharmacy accounting.',
      }
    ],
  },
  {
    id: 'accordly',
    name: 'Accordly Backend',
    description: 'FastAPI backend using RAG and OpenAI GPT to generate customized NDA contracts.',
    longDescription: 'A FastAPI backend built with Python that uses Retrieval-Augmented Generation (RAG) and OpenAI GPT to generate customized Non-Disclosure Agreement contracts. Processes user-provided parameters, retrieves relevant legal clause templates, and produces tailored NDA documents exported as both DOCX and PDF.',
    tags: ['FastAPI', 'Python', 'OpenAI GPT', 'RAG', 'DOCX', 'PDF Generation'],
    architecture: [
      'FastAPI server handling contract generation requests and parameter validation.',
      'RAG pipeline retrieving relevant legal clause templates from a vector store.',
      'OpenAI GPT integration for natural language contract drafting and customization.',
      'Document export engine generating DOCX and PDF outputs.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/accordly-backend',
    highlights: [
      {
        title: 'RAG-Powered Contract Generation',
        description: 'Combines retrieval-augmented generation with GPT to produce legally-structured NDA documents tailored to user-specified parameters.',
      },
      {
        title: 'Multi-Format Export',
        description: 'Generated contracts are exported as both DOCX (editable) and PDF (distributable) formats for real-world legal workflow compatibility.',
      }
    ],
  },
  {
    id: 'heartdisease',
    name: 'Heart Disease Classifier',
    description: 'Full-stack ML application with FastAPI backend and React frontend for heart disease classification.',
    longDescription: 'A full-stack machine learning application that trains and serves a heart disease classification model end-to-end. The FastAPI backend handles model training, persistence, and prediction serving, while the React frontend provides an interactive interface for inputting patient data and viewing classification results.',
    tags: ['FastAPI', 'React', 'scikit-learn', 'Python', 'Machine Learning'],
    architecture: [
      'FastAPI backend serving trained classification model via REST endpoints.',
      'scikit-learn pipeline for model training, evaluation, and persistence.',
      'React frontend collecting patient parameters and displaying predictions.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/heart-disease-classifier',
    highlights: [
      {
        title: 'End-to-End ML Pipeline',
        description: 'Covers the full lifecycle from data ingestion and model training to serving predictions via API and rendering results in a web interface.',
      },
      {
        title: 'Full-Stack Architecture',
        description: 'Decoupled FastAPI backend (model serving) and React frontend (user interface) communicating over REST, demonstrating production-grade ML deployment patterns.',
      }
    ],
  },
  {
    id: 'chembot',
    name: 'ChemBot',
    description: 'Streamlit app for crystallographic data retrieval with interactive 3D molecular visualization.',
    longDescription: 'A Streamlit application that retrieves crystallographic and chemical data by entering a chemical formula, powered by the Materials Project API and PubChemPy. Features multi-step workflow from formula input to MP ID selection to results display, with automated crystal structure descriptions via robocrys and interactive 3D molecular visualization using RDKit and Plotly.',
    tags: ['Streamlit', 'Python', 'Materials Project API', 'RDKit', 'Plotly', 'PubChemPy'],
    architecture: [
      'Streamlit web interface handling multi-step user workflow (formula → MP ID selection → results).',
      'Materials Project API (mp-api) for crystallographic data retrieval.',
      'RDKit for 3D molecular structure generation, rendered interactively via Plotly.',
      'robocrys for automated crystal structure descriptions and PubChemPy for IUPAC name lookup.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/ChemBot',
    highlights: [
      {
        title: 'Interactive 3D Visualization',
        description: 'Generates 3D molecular structures using RDKit and renders them interactively in the browser via Plotly, allowing rotation and zoom.',
      },
      {
        title: 'Multi-Source Data Fusion',
        description: 'Combines data from Materials Project (crystallography), PubChem (chemical identity), and robocrys (structure descriptions) into a single unified view.',
      }
    ],
  },
  {
    id: 'studentpred',
    name: 'Student Performance Predictor',
    description: 'Streamlit ML app predicting student final grades using the UCI Student Performance dataset.',
    longDescription: 'A Streamlit-based web application that predicts a student\'s final grade (G3, scored out of 20) using a regression model trained on the UCI Student Performance dataset. Features an interactive 28-field form capturing demographics, family circumstances, study patterns, and prior academic performance, with automatic handling of missing data through imputation.',
    tags: ['Streamlit', 'Python', 'scikit-learn', 'pandas', 'Machine Learning'],
    architecture: [
      'Streamlit frontend presenting a 28-field interactive input form.',
      'scikit-learn regression model with variance-based feature selection.',
      'Label encoding for categorical variables and most-frequent imputation for incomplete values.',
      'Model persistence via joblib (student_performance_model.joblib).'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/StudentPrediction',
  },
  {
    id: 'otpverify',
    name: 'OTP Verification Flow',
    description: 'React + TypeScript two-step phone OTP verification component with analytics dashboard.',
    longDescription: 'A React and TypeScript interface presenting a two-step phone OTP verification flow with international country code selection (India, USA, UK, Japan, Australia), six-digit OTP validation, a celebratory animation on success, and a post-verification analytics dashboard built with Recharts.',
    tags: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Radix UI', 'Recharts'],
    architecture: [
      'React 19 SPA with TypeScript 5.7 for full type safety.',
      'Radix UI accessible components for dropdown and input primitives.',
      'Recharts 2 data visualization for the post-verification analytics dashboard.',
      'Simulated OTP flow (no carrier integration) for demonstration purposes.'
    ],
    repository: 'https://github.com/AdityaBhardwaj04/otp-verification',
  },
];

export const CTF_CHALLENGES: CtfChallenge[] = [
  {
    id: 'sqli_login',
    title: 'SQLi Bypasser',
    category: 'Web Exploitation',
    points: 100,
    description: 'A login page for the administrative panel seems to be poorly built. The SQL query structure is raw string formatting: `SELECT * FROM users WHERE username = \'{user}\' AND password = \'{pass}\'`. Bypass authentication without knowing the password to capture the flag!',
    hint: "Use a classic SQL injection payload in the username field like `' OR '1'='1`. You can enter anything in the password.",
    solved: false,
    type: 'sqli',
    flag: 'FLAG{sql_injection_master_4123}'
  },
  {
    id: 'rot13_cipher',
    title: 'Interstellar Cipher',
    category: 'Cryptography',
    points: 150,
    description: 'Our sensors intercepted an encrypted broadcast in a basic alpha-substitution cipher. Decrypt the following message to find the flag: "SYNT{pelcgb_vf_rnfl_naq_sha}". It looks like it is rotated by 13 positions!',
    hint: 'Use the decoder tool provided or manually shift letters back by 13 (ROT13). A becomes N, B becomes O, S becomes F, etc.',
    solved: false,
    type: 'crypto',
    flag: 'FLAG{crypto_is_easy_and_fun}'
  },
  {
    id: 'reverse_math',
    title: 'Keygen Challenge',
    category: 'Reverse Engineering',
    points: 200,
    description: 'You extracted a compiled validation subroutine. The pseudocode reveals: `bool verify_key(int key) { return (key * 5 - 13) == 487; }`. Find the correct numerical key and submit it to generate the flag!',
    hint: 'Solve the equation for key: key * 5 - 13 = 487. key * 5 = 500. Calculate the key value!',
    solved: false,
    type: 'reverse',
    flag: 'FLAG{rev_eng_wizard_99}'
  },
  {
    id: 'cookie_inspector',
    title: 'Cookie Jar',
    category: 'Steganography / Web',
    points: 100,
    description: 'Web applications store authentication state inside Cookies. Inspect this page\'s active virtual cookie jar and look for the administrative session token where the secret flag is stored!',
    hint: 'Click the "Inspect Cookie Jar" button below to open a simulated browser cookies explorer, and view the value of the "secure_flag_token" cookie.',
    solved: false,
    type: 'cookie',
    flag: 'FLAG{cookie_monster_loves_tokens}'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'ccna',
    name: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco',
    date: '2024',
    idCode: '96a2b560',
    badgeUrl: 'https://www.credly.com/badges/96a2b560-870d-4204-9969-99083dedc7d6/linked_in_profile',
    description: 'Industry-standard certification validating expertise in network fundamentals, IP connectivity, security fundamentals, and network automation. Covers routing, switching, wireless networking, and network programmability.',
    skillsVerified: ['Network Fundamentals', 'IP Connectivity & Routing', 'Security Fundamentals', 'Network Access & Switching', 'IP Services (DHCP, NAT, NTP)', 'Automation & Programmability']
  },
  {
    id: 'sc900',
    name: 'Microsoft SC-900: Security, Compliance, and Identity Fundamentals',
    issuer: 'Microsoft',
    date: '2024',
    idCode: '32b50f1b',
    badgeUrl: 'https://www.credly.com/badges/32b50f1b-4725-47d3-abd9-c1003f8d0a81/linked_in_profile',
    description: 'Foundational certification covering Microsoft security, compliance, and identity concepts across cloud-based and related services. Validates understanding of zero trust principles and the Microsoft security ecosystem.',
    skillsVerified: ['Security & Compliance Concepts', 'Identity & Access Management', 'Microsoft Entra ID', 'Microsoft Defender Services', 'Microsoft Purview Compliance', 'Azure Security Capabilities']
  },
];

export const CTF_WRITEUPS: CtfWriteup[] = [
  {
    id: 'writeup-facts',
    title: 'I Hit a Dead End Halfway Through This HTB Machine — Here\'s How I Got Root Anyway',
    platform: 'Hack The Box',
    machine: 'Facts',
    summary: 'Full root walkthrough exploiting mass assignment (CVE-2025-2304), arbitrary file read (CVE-2024-46987), SSH key extraction with passphrase cracking, and privilege escalation via facter misconfiguration.',
    topics: ['Mass Assignment', 'Arbitrary File Read', 'SSH Key Cracking', 'Privilege Escalation', 'Ruby Exploitation'],
    url: 'https://medium.com/@abd.aditya10/i-hit-a-dead-end-halfway-through-this-htb-machine-heres-how-i-got-root-anyway-531540e2845c'
  },
  {
    id: 'writeup-thetoppers',
    title: 'I Hacked an S3 Bucket in Under 10 Minutes — Here\'s Exactly How',
    platform: 'Hack The Box',
    machine: 'Thetoppers',
    summary: 'Demonstrated a complete attack chain against a misconfigured S3-compatible storage service — from subdomain enumeration to unauthenticated bucket access to webshell upload and reverse shell.',
    topics: ['S3 Bucket Misconfiguration', 'Subdomain Enumeration', 'Webshell Upload', 'Reverse Shell', 'AWS CLI'],
    url: 'https://medium.com/@abd.aditya10/i-hacked-an-s3-bucket-in-under-10-minutes-heres-exactly-how-55379107c45f'
  },
  {
    id: 'writeup-ine-hostbased',
    title: 'Exploiting Weak Credentials, WebDAV, and SMB Shares — An INE Host-Based Attacks Walkthrough',
    platform: 'INE Labs',
    summary: 'Walkthrough of a multi-target Windows penetration test chaining HTTP Basic Auth brute-forcing, WebDAV file upload for RCE via ASP webshell, and SMB share enumeration for lateral movement.',
    topics: ['Credential Brute-forcing', 'WebDAV Exploitation', 'ASP Webshell', 'SMB Enumeration', 'Windows Post-Exploitation'],
    url: 'https://medium.com/@abd.aditya10/exploiting-weak-credentials-webdav-and-smb-shares-an-ine-host-based-attacks-walkthrough-a6fecc4978a8'
  },
];

export const PLATFORM_ACTIVITY: PlatformActivity[] = [
  {
    id: 'htb',
    platform: 'Hack The Box',
    username: 'AdityaBhardwaj',
    stats: 'Active learner solving penetration testing labs. Season 7 participant.',
    profileUrl: PROFILE_LINKS.htb,
    machines: ['Reactor', 'Facts', 'Thetoppers'],
  },
  {
    id: 'thm',
    platform: 'TryHackMe',
    username: 'AdityaBhardwaj',
    stats: 'Top 15% ranking with 46+ rooms completed across offensive security, networking, and web exploitation paths.',
    profileUrl: '',
  },
];
