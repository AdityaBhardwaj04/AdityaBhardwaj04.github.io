import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  House, User, Terminal, Folder, Crosshair, ShieldCheck, Mail, Lock, Unlock,
  Wifi, Cpu, Layers, Send, Play, Check, Shield, CircleAlert, Code, Linkedin, Github,
  Menu, X
} from 'lucide-react';

import { CTF_CHALLENGES } from './data';
import { CtfChallenge, TerminalLine } from './types';

import StartupScreen from './components/StartupScreen';
import AboutTab from './components/AboutTab';
import SkillsTab from './components/SkillsTab';
import ProjectsTab from './components/ProjectsTab';
import CtfTab from './components/CtfTab';
import CertificationsTab from './components/CertificationsTab';
import ContactTab from './components/ContactTab';

export default function App() {
  const [booted, setBooted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'skills' | 'projects' | 'ctf' | 'certs' | 'contact'>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    if (tab === 'home') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, 0));
      });
    }
  };
  
  // CTF state shared with global App context
  const [ctfChallenges, setCtfChallenges] = useState<CtfChallenge[]>(CTF_CHALLENGES);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [flagsCaptured, setFlagsCaptured] = useState<number>(0);

  // Dynamic system monitor load fluctuations
  const [cpuUsage, setCpuUsage] = useState<number>(42);
  const [memUsage, setMemUsage] = useState<number>(68);
  const [netActivity, setNetActivity] = useState<number>(35);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MED' | 'HIGH'>('LOW');

  // Dynamic live activity feed log
  const [activityLogs, setActivityLogs] = useState<string[]>([
    'Port scan completed on 10.10.10.10',
    'Vulnerability found: CVE-2021-44228',
    'Exploit successful',
    'Privilege escalation achieved',
    'Flags captured: 0'
  ]);

  // Terminal CLI input state for Home tab
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: 'Portfolio system terminal v1.0.4 initialized.', type: 'info' },
    { text: 'Type "help" to list available system directives.', type: 'info' }
  ]);
  
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Toast notification state
  const [toast, setToast] = useState<string>('');
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Fluctuating metric updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(10, Math.min(95, prev + delta));
      });
      setMemUsage(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(50, Math.min(90, prev + delta));
      });
      setNetActivity(prev => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(15, Math.min(99, prev + delta));
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Sync flags captured stat inside activity logs
  useEffect(() => {
    setActivityLogs(prev => {
      const filtered = prev.filter(l => !l.startsWith('Flags captured:'));
      return [...filtered, `Flags captured: ${flagsCaptured} (${totalScore} pts)`];
    });
  }, [flagsCaptured, totalScore]);

  // Scroll to bottom of terminal whenever line length changes
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines, activeTab]);

  // Append new log to activity feed
  const appendActivityLog = (message: string) => {
    setActivityLogs(prev => {
      const filtered = prev.filter(l => l !== message);
      // Limit to max 6 logs
      if (filtered.length >= 6) {
        return [...filtered.slice(1), message];
      }
      return [...filtered, message];
    });
  };

  // Solve callback from CtfTab
  const handleSolveChallenge = (challId: string, points: number, flag: string) => {
    let alreadySolved = false;
    setCtfChallenges(prev => 
      prev.map(c => {
        if (c.id === challId) {
          if (c.solved) alreadySolved = true;
          return { ...c, solved: true };
        }
        return c;
      })
    );

    if (!alreadySolved) {
      setTotalScore(prev => prev + points);
      setFlagsCaptured(prev => prev + 1);
      appendActivityLog(`Captured flag for: ${challId}! (+${points} pts)`);
      
      // Also write directly to Home terminal lines if active
      setTerminalLines(prev => [
        ...prev,
        { text: `[!] ALERT: Security flag captured via CTF!`, type: 'success' },
        { text: `  -> Challenge ID: ${challId}`, type: 'success' },
        { text: `  -> Reward: +${points} points added to credential profile.`, type: 'success' }
      ]);
    }
  };

  // Run terminal commands inside home view
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const command = terminalInput.trim();
    const args = command.split(' ');
    const baseCommand = args[0].toLowerCase();

    setTerminalLines(prev => [...prev, { text: `root@aditya:~# ${command}`, type: 'input' }]);

    setTimeout(() => {
      switch (baseCommand) {
        case 'help':
          setTerminalLines(prev => [
            ...prev,
            { text: 'Available directory files / commands:', type: 'info' },
            { text: '  whoami             - Query identity description sheet', type: 'info' },
            { text: '  skills             - Inspect loaded core competencies', type: 'info' },
            { text: '  projects           - List engineered secure applications', type: 'info' },
            { text: '  ctf                - Review interactive jeopardy score board', type: 'info' },
            { text: '  certs              - View verified certification traces', type: 'info' },
            { text: '  contact            - Query communication pathways', type: 'info' },
            { text: '  resume             - Download Aditya\'s security resume (PDF)', type: 'info' },
            { text: '  ping <host>        - Diagnose connection latency', type: 'info' },
            { text: '  nmap localhost     - Inspect local virtual services and ports', type: 'info' },
            { text: '  clear              - Wipe terminal lines from active cache', type: 'info' }
          ]);
          break;
        case 'whoami':
          setTerminalLines(prev => [
            ...prev,
            { text: '> Security enthusiast. CTF player. Lifelong learner.', type: 'output' },
            { text: 'Role: Cybersecurity Analyst | Offensive Specialist', type: 'output' }
          ]);
          appendActivityLog('Terminal lookup: whoami');
          break;
        case 'skills':
          setTerminalLines(prev => [
            ...prev,
            { text: '[+] Core Disciplines:', type: 'success' },
            { text: '  - Network Security (IDS/IPS, Snort, pfSense)', type: 'output' },
            { text: '  - Web Exploitation (OWASP Top 10, manual bypasses)', type: 'output' },
            { text: '  - Penetration Testing (Active Directory, reporting)', type: 'output' },
            { text: '  - Privilege Escalation (Linux SUID, windows DLL)', type: 'output' }
          ]);
          setActiveTab('skills');
          appendActivityLog('Navigated to: SKILLS (CLI)');
          break;
        case 'projects':
          setTerminalLines(prev => [
            ...prev,
            { text: '[+] Custom Engineered Secure Code Projects:', type: 'success' },
            { text: '  1. Medicine Inventory Management System (.exe)', type: 'output' },
            { text: '  2. Materials Data Retrieval App (.streamlit)', type: 'output' },
            { text: '  3. Facial Recognition Auth System (OpenCV/TF)', type: 'output' }
          ]);
          setActiveTab('projects');
          appendActivityLog('Navigated to: PROJECTS (CLI)');
          break;
        case 'ctf':
          setTerminalLines(prev => [
            ...prev,
            { text: `[+] Active CTF Scoreboard status:`, type: 'success' },
            { text: `  - Total flags captured: ${flagsCaptured} / 4`, type: 'output' },
            { text: `  - Accumulative score: ${totalScore} points`, type: 'output' },
            { text: `  - Rank: ${flagsCaptured === 4 ? 'Root Admin' : flagsCaptured >= 2 ? 'Exploiter' : 'Neophyte'}`, type: 'output' }
          ]);
          setActiveTab('ctf');
          appendActivityLog('Navigated to: CTF (CLI)');
          break;
        case 'certs':
          setTerminalLines(prev => [
            ...prev,
            { text: '[+] Accredited Credentials Checked:', type: 'success' },
            { text: '  - OSCP (Offensive Security Certified Professional)', type: 'output' },
            { text: '  - CEH (Certified Ethical Hacker)', type: 'output' },
            { text: '  - Security+ (CompTIA Baseline Ops)', type: 'output' }
          ]);
          setActiveTab('certs');
          appendActivityLog('Navigated to: CERTS (CLI)');
          break;
        case 'contact':
          setTerminalLines(prev => [
            ...prev,
            { text: '[i] Secure handshake conduits are standing by.', type: 'info' },
            { text: 'Type "python3 send_message.py" or open the CONTACT panel.', type: 'output' }
          ]);
          setActiveTab('contact');
          appendActivityLog('Navigated to: CONTACT (CLI)');
          break;
        case 'resume': {
          setTerminalLines(prev => [
            ...prev,
            { text: '[+] Locating resume artifact: Security_Resume.pdf ...', type: 'info' },
            { text: '[+] Download initiated. Check your browser downloads.', type: 'success' }
          ]);
          const link = document.createElement('a');
          link.href = '/Security_Resume.pdf';
          link.download = 'Aditya_Bhardwaj_Security_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('Resume download started');
          appendActivityLog('Resume downloaded via CLI');
          break;
        }
        case 'ping':
          const host = args[1] || '127.0.0.1';
          setTerminalLines(prev => [
            ...prev,
            { text: `PING ${host} (56 data bytes)...`, type: 'info' },
            { text: `64 bytes from ${host}: icmp_seq=1 ttl=64 time=1.42 ms`, type: 'output' },
            { text: `64 bytes from ${host}: icmp_seq=2 ttl=64 time=1.19 ms`, type: 'output' },
            { text: `--- ${host} ping statistics ---`, type: 'info' },
            { text: '2 packets transmitted, 2 received, 0% packet loss', type: 'output' }
          ]);
          appendActivityLog(`Dispatched ping target: ${host}`);
          break;
        case 'nmap':
          setTerminalLines(prev => [
            ...prev,
            { text: 'Starting Nmap 7.92 ( https://nmap.org ) at local time...', type: 'info' },
            { text: 'Nmap scan report for localhost (127.0.0.1)', type: 'info' },
            { text: 'PORT     STATE SERVICE', type: 'info' },
            { text: '22/tcp   open  ssh (OpenSSH 8.9)', type: 'output' },
            { text: '80/tcp   open  http (Nginx 1.18)', type: 'output' },
            { text: '443/tcp  open  https (Nginx 1.18 - TLS 1.3)', type: 'output' },
            { text: '3000/tcp open  react-vite (Development Portfolio)', type: 'output' },
            { text: 'Nmap done: 1 IP address scanned in 0.88 seconds', type: 'success' }
          ]);
          appendActivityLog('Nmap audit local scan completed');
          break;
        case 'clear':
          setTerminalLines([]);
          break;
        default:
          // Check if user submitted a valid flag format directly in CLI
          if (command.startsWith('FLAG{') && command.endsWith('}')) {
            const matchedChall = ctfChallenges.find(c => c.flag === command);
            if (matchedChall) {
              handleSolveChallenge(matchedChall.id, matchedChall.points, matchedChall.flag);
            } else {
              setTerminalLines(prev => [...prev, { text: '[-] Error: Non-matching signature. Flag rejected by local oracle.', type: 'error' }]);
            }
          } else {
            setTerminalLines(prev => [
              ...prev,
              { text: `bash: ${baseCommand}: command not found. Type "help" to list valid targets.`, type: 'error' }
            ]);
          }
          break;
      }
    }, 300);

    setTerminalInput('');
  };

  // Custom utility to render text block progress bars
  const renderProgressBlocks = (percent: number) => {
    const totalBlocks = 15;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return (
      <span className="font-mono text-term-green select-none">
        {'█'.repeat(filledBlocks)}
        <span className="text-term-gray">{'█'.repeat(emptyBlocks)}</span>
      </span>
    );
  };

  return (
    <LayoutGroup>
    <div className="min-h-screen p-4 text-sm antialiased text-term-green selection:bg-term-green selection:text-term-bg overflow-x-hidden font-mono flex flex-col justify-between relative">
      {/* Startup Loading Screen */}
      <AnimatePresence>
        {!booted && (
          <StartupScreen onComplete={() => setBooted(true)} />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-term-green text-term-bg px-4 py-2.5 rounded shadow-[0_0_15px_rgba(0,255,65,0.4)] text-xs font-bold flex items-center gap-2 animate-fade-in">
          <span className="text-base">&#10003;</span>
          <span>{toast}</span>
        </div>
      )}
      {/* Top Bar Header */}
      <header className={`flex flex-col md:flex-row justify-between items-center mb-4 text-term-lightgray pb-2.5 border-b border-term-border gap-2 transition-opacity duration-500 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <span className="text-term-green font-bold">&gt;_</span>
          <span>root@aditya:~#</span>
        </div>
        <motion.div
          layoutId="secure-status"
          className="flex items-center gap-2 text-term-green font-bold text-shadow-glow"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Lock size={14} className="animate-pulse" />
          <span>SECURE CONNECTION ESTABLISHED</span>
        </motion.div>
        <div className="flex items-center gap-4 text-term-lightgray text-xs">
          <span>&gt;[ 127.0.0.1 ]</span>
          <span>[ PORT: 443 ]</span>
          <span>[ PROTOCOL: HTTPS ]</span>
          <Wifi size={16} className="text-term-green animate-pulse" />
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className={`main-grid gap-4 flex-grow transition-opacity duration-500 ${booted ? 'opacity-100' : 'opacity-0'} ${activeTab !== 'home' && activeTab !== 'about' ? 'workspace' : ''}`}>
        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="panel w-full flex items-center justify-between px-4 py-2.5"
          >
            <div className="flex items-center gap-2 text-term-green font-bold text-xs">
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
              <span>[ NAVIGATION ]</span>
            </div>
            <span className="text-term-lightgray text-[10px] font-mono uppercase">
              {activeTab}
            </span>
          </button>

          {mobileNavOpen && (
            <nav className="panel mt-1 flex flex-col gap-1 border-term-green/30">
              {([
                { id: 'home', label: '01. HOME', icon: <House size={14} /> },
                { id: 'about', label: '02. ABOUT', icon: <User size={14} /> },
                { id: 'skills', label: '03. SKILLS', icon: <Terminal size={14} /> },
                { id: 'projects', label: '04. PROJECTS', icon: <Folder size={14} /> },
                { id: 'ctf', label: '05. CTF & WRITEUPS', icon: <Crosshair size={14} /> },
                { id: 'certs', label: '06. CERTIFICATIONS', icon: <ShieldCheck size={14} /> },
                { id: 'contact', label: '07. CONTACT', icon: <Mail size={14} /> },
              ] as const).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 font-bold rounded text-left transition-all border text-xs ${
                    activeTab === item.id
                      ? 'bg-term-green text-term-bg border-term-green'
                      : 'border-transparent text-term-lightgray hover:text-term-green'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Left Navigation Sidebar (desktop only) */}
        <aside className="hidden lg:flex flex-col gap-4 min-w-0">
          <nav aria-label="Main Navigation" className="panel flex flex-col gap-2 shadow-[0_0_10px_rgba(13,43,38,0.1)]">
            <h2 className="text-term-lightgray mb-2 text-xs font-bold uppercase tracking-wider">[ NAVIGATION ]</h2>

            {([
              { id: 'home', label: '01. HOME', icon: <House size={16} /> },
              { id: 'about', label: '02. ABOUT', icon: <User size={16} /> },
              { id: 'skills', label: '03. SKILLS', icon: <Terminal size={16} /> },
              { id: 'projects', label: '04. PROJECTS', icon: <Folder size={16} /> },
              { id: 'ctf', label: '05. CTF & WRITEUPS', icon: <Crosshair size={16} /> },
              { id: 'certs', label: '06. CERTIFICATIONS', icon: <ShieldCheck size={16} /> },
              { id: 'contact', label: '07. CONTACT', icon: <Mail size={16} /> },
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2 font-bold rounded text-left transition-all border ${
                  activeTab === item.id
                    ? 'bg-term-green text-term-bg border-term-green shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                    : 'border-transparent text-term-lightgray hover:bg-term-darkgreen/20 hover:text-term-green'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* System Status Panel */}
          <div className="panel flex flex-col gap-2">
            <h2 className="text-term-lightgray mb-2 text-xs font-bold uppercase tracking-wider">[ SYSTEM STATUS ]</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              <span className="text-term-lightgray">USER:</span>
              <span className="text-term-green font-bold">aditya</span>

              <span className="text-term-lightgray">ROLE:</span>
              <span className="text-term-lightgray leading-tight">Cybersecurity Analyst</span>

              <span className="text-term-lightgray">LOCATION:</span>
              <span className="text-term-lightgray">India</span>

              <span className="text-term-lightgray">CLEARANCE:</span>
              <span className="text-term-green font-bold">Level 7</span>

              <span className="text-term-lightgray">STATUS:</span>
              <div className="flex items-center gap-1.5">
                <span>Online</span>
                <div className="w-2 h-2 bg-term-green rounded-full animate-pulse shadow-[0_0_5px_#00FF41]"></div>
              </div>
            </div>
          </div>

          {/* Simulated Active Matrix rain block */}
          <div className="panel flex-grow relative overflow-hidden border-term-gray border opacity-40 hover:opacity-60 transition-opacity min-h-[140px]">
            <h2 className="text-term-lightgray mb-2 absolute top-2 left-2 bg-term-bg px-1 z-10 text-[10px] uppercase font-bold">[ MATRIX.TXT ]</h2>
            <div aria-hidden="true" className="absolute inset-0 pt-8 px-2 overflow-hidden text-[8px] leading-none text-term-darkgreen break-all opacity-40 font-mono">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="mb-0.5">
                  {Math.random().toString(2).substring(2, 45)}
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-term-lightgray">
              &gt; Stay curious. Stay secure.
            </div>
          </div>
        </aside>

        {/* Center Panel Container */}
        <section className="flex flex-col gap-4 min-w-0">
          {activeTab === 'home' && (
            <div className="panel flex-grow flex flex-col h-full min-h-[450px]">
              {/* Boot Sequence */}
              <div className="text-term-green mb-5 text-xs font-mono space-y-0.5 leading-relaxed">
                <div>Initializing portfolio.exe ............</div>
                <div className="flex items-center gap-2">
                  Loading modules {renderProgressBlocks(100)} 100%..!!
                </div>
                <div>Establishing secure connection ........ <span className="text-term-green font-bold">Done</span></div>
              </div>

              {/* Header Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-shadow-glow">
                Hi, I'm Aditya.<span className="animate-blink bg-term-green inline-block w-3 h-8 ml-1 align-middle"></span>
              </h1>
              
              <p className="text-term-lightgray text-base md:text-lg mb-4 border-b border-term-border pb-3 inline-block pr-12 leading-relaxed">
                Cybersecurity Analyst | Ethical Hacker | Problem Solver
              </p>

              {/* Profile Intro Bio */}
              <p className="mb-5 text-term-lightgray text-xs md:text-sm leading-relaxed">
                I break down systems to build stronger defenses.<br />
                Passionate about offensive security, threat analysis,<br />
                and secure software development models.
              </p>

              {/* Whoami command prompt */}
              <div className="mb-4 text-xs font-mono">
                <div className="text-term-lightgray"><span className="text-term-green font-bold">root@aditya:~#</span> whoami</div>
                <div className="text-term-lightgray/85 pl-1.5 mt-0.5">&gt; Security enthusiast. CTF player. Lifelong learner.</div>
              </div>

              {/* cat mission prompt */}
              <div className="mb-2 text-xs font-mono">
                <div className="text-term-lightgray"><span className="text-term-green font-bold">root@aditya:~#</span> cat mission.txt</div>
              </div>

              {/* Abstract Map Box / Mission box */}
              <div className="border border-term-border rounded p-4 relative overflow-hidden mb-5 bg-term-bg/40">
                <div aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 w-44 h-20 select-none">
                  <svg className="w-full h-full text-term-green" fill="currentColor" viewBox="0 0 100 50">
                    <path d="M10,20 h2 v2 h-2 z M14,18 h4 v4 h-4 z M20,22 h2 v2 h-2 z M24,16 h6 v8 h-6 z M32,18 h4 v4 h-4 z M40,12 h10 v12 h-10 z M52,14 h8 v10 h-8 z M64,20 h4 v4 h-4 z M70,16 h6 v6 h-6 z M78,22 h2 v2 h-2 z M82,18 h4 v4 h-4 z M16,24 h2 v4 h-2 z M22,26 h4 v6 h-4 z M28,26 h2 v2 h-2 z M42,26 h6 v6 h-6 z M50,26 h4 v4 h-4 z M60,26 h2 v2 h-2 z M72,24 h2 v4 h-2 z M24,34 h2 v4 h-2 z M44,34 h4 v4 h-4 z M50,32 h2 v2 h-2 z M54,30 h2 v2 h-2 z"></path>
                  </svg>
                </div>
                <p className="relative z-10 max-w-sm text-term-lightgray text-xs leading-relaxed font-mono">
                  My mission is to secure systems,<br />
                  protect data, and stay one step<br />
                  ahead of threat actors.
                </p>
              </div>

              {/* Interactive Local Terminal input box */}
              <div className="flex-grow flex flex-col justify-end">
                <div className="border border-term-border rounded bg-term-bg p-3 flex flex-col font-mono text-xs min-h-[160px] max-h-[220px]">
                  <div className="overflow-y-auto flex-grow mb-2 space-y-1 pr-1 border-b border-term-border/30 pb-2">
                    {terminalLines.map((line, idx) => (
                      <div 
                        key={idx} 
                        className={
                          line.type === 'input' 
                            ? 'text-yellow-400 font-bold' 
                            : line.type === 'error' 
                            ? 'text-red-400 font-bold' 
                            : line.type === 'success' 
                            ? 'text-term-green font-bold' 
                            : line.type === 'info' 
                            ? 'text-term-lightgray/60 italic' 
                            : 'text-term-lightgray'
                        }
                      >
                        {line.text}
                      </div>
                    ))}
                    <div ref={terminalBottomRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                    <span className="text-term-green font-bold select-none">root@aditya:~#</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type a command (e.g. 'help', 'whoami', 'nmap localhost')..."
                      className="bg-transparent text-term-green flex-grow outline-none caret-term-green font-mono text-xs focus:ring-0 focus:outline-none border-none p-0"
                    />
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <AboutTab />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <SkillsTab />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <ProjectsTab />
            </div>
          )}

          {activeTab === 'ctf' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <CtfTab challenges={ctfChallenges} onSolve={handleSolveChallenge} />
            </div>
          )}

          {activeTab === 'certs' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <CertificationsTab />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="panel flex-grow flex flex-col min-h-[450px]">
              <ContactTab onMessageSent={appendActivityLog} />
            </div>
          )}
        </section>

        {/* Right Status / Monitor Sidebar */}
        <aside className="right-panel flex flex-col gap-4 min-w-0">
          {/* System Monitor */}
          <div className="panel flex flex-col gap-4">
            <h2 className="text-term-lightgray text-xs font-bold uppercase tracking-wider">[ SYSTEM MONITOR ]</h2>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-term-lightgray w-24">CPU Usage</span>
                <div className="flex-grow flex gap-1 font-mono">
                  {renderProgressBlocks(cpuUsage)}
                </div>
                <span className="text-term-green w-8 text-right font-bold">{cpuUsage}%</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-term-lightgray w-24">Memory Usage</span>
                <div className="flex-grow flex gap-1 font-mono">
                  {renderProgressBlocks(memUsage)}
                </div>
                <span className="text-term-green w-8 text-right font-bold">{memUsage}%</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-term-lightgray w-24">Net Traffic</span>
                <div className="flex-grow flex gap-1 font-mono">
                  {renderProgressBlocks(netActivity)}
                </div>
                <span className="text-term-green w-8 text-right font-bold">{netActivity}%</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-term-lightgray w-24">Threat Level</span>
                <div className="flex-grow flex gap-1 font-mono">
                  {renderProgressBlocks(threatLevel === 'HIGH' ? 85 : threatLevel === 'MED' ? 50 : 20)}
                </div>
                <span className={`w-8 text-right font-bold ${threatLevel === 'HIGH' ? 'text-red-400' : 'text-term-green'}`}>
                  {threatLevel}
                </span>
              </div>
            </div>

            {/* Active Processes table */}
            <div>
              <h3 className="text-term-lightgray text-xs border-b border-term-border pb-1 font-bold uppercase tracking-wide">ACTIVE PROCESSES</h3>
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 text-xs mt-2">
                <span className="text-term-lightgray">PID</span>
                <span className="text-term-lightgray">NAME</span>
                <span className="text-term-lightgray text-right">STATUS</span>
                
                <span className="text-term-gray">1337</span>
                <span className="text-term-lightgray">recon.exe</span>
                <span className="text-term-green text-right">running</span>
                
                <span className="text-term-gray">2345</span>
                <span className="text-term-lightgray">exploit.py</span>
                <span className="text-term-green text-right">running</span>
                
                <span className="text-term-gray">3456</span>
                <span className="text-term-lightgray">analyze.log</span>
                <span className="text-term-green text-right">running</span>
                
                <span className="text-term-gray">4567</span>
                <span className="text-term-lightgray">secure.sh</span>
                <span className="text-term-green text-right">running</span>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="panel flex-grow flex flex-col gap-2 text-xs">
            <h2 className="text-term-lightgray mb-2 text-xs font-bold uppercase tracking-wider">[ ACTIVITY FEED ]</h2>
            <div className="flex flex-col gap-2.5 flex-grow">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex gap-2 text-term-green text-[11px] leading-tight items-start">
                  <span className="font-bold select-none">[+]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="mt-auto pt-4 text-term-green/75 border-t border-term-border/30 text-center font-bold">
                &gt; Keep hacking, keep learning.
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Section */}
      <footer className={`grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 mt-4 border-t border-term-border pt-4 transition-opacity duration-500 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Secure Channel trigger */}
        <div className="panel flex flex-col justify-center gap-2">
          <h2 className="text-term-lightgray text-xs font-bold uppercase tracking-wider">[ SECURE CHANNEL ]</h2>
          <p className="text-term-lightgray text-xs leading-tight">Let's connect and build the future securely.</p>
          <button 
            onClick={() => {
              setActiveTab('contact');
              appendActivityLog('Initiated connection handshake.');
            }}
            className="mt-1 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-all py-2 px-4 rounded flex items-center justify-between font-bold w-full max-w-xs group cursor-pointer shadow-[0_0_5px_rgba(0,255,65,0.1)]"
          >
            <span>&gt; Initiate Connection</span>
            <Lock size={14} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Contact Info Social Bar */}
        <div className="panel flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="text-term-lightgray text-xs flex-grow">
            <div><span className="text-term-green font-bold">root@aditya:~#</span> connect --secure</div>
            <div>Establishing secure channel ......... <span className="text-term-green font-bold">Done</span></div>
            <div>Send a message via the contact terminal.</div>
            <div><span className="text-term-green font-bold">root@aditya:~#</span> <span className="animate-blink bg-term-green w-1.5 h-3 inline-block align-middle"></span></div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <a
              className="flex items-center gap-2 group cursor-pointer"
              href="mailto:abd.aditya10@outlook.com"
              onClick={() => appendActivityLog('Clicked email hyperlink')}
            >
              <Mail size={20} className="text-term-green group-hover:text-shadow-glow transition-all" />
              <div className="text-xs">
                <div className="text-term-green font-bold uppercase tracking-wider text-[10px]">Email</div>
                <div className="text-term-lightgray group-hover:text-term-green transition-colors font-mono">abd.aditya10@outlook.com</div>
              </div>
            </a>

            <a
              className="flex items-center gap-2 group cursor-pointer"
              href="https://www.linkedin.com/in/abhardwaj28"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => appendActivityLog('Clicked LinkedIn hyperlink')}
            >
              <Linkedin size={20} className="text-term-green group-hover:text-shadow-glow transition-all" />
              <div className="text-xs">
                <div className="text-term-green font-bold uppercase tracking-wider text-[10px]">LinkedIn</div>
                <div className="text-term-lightgray group-hover:text-term-green transition-colors font-mono">linkedin.com/in/abhardwaj28</div>
              </div>
            </a>

            <a
              className="flex items-center gap-2 group cursor-pointer"
              href="https://github.com/AdityaBhardwaj04"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => appendActivityLog('Clicked GitHub hyperlink')}
            >
              <Github size={20} className="text-term-green group-hover:text-shadow-glow transition-all" />
              <div className="text-xs">
                <div className="text-term-green font-bold uppercase tracking-wider text-[10px]">GitHub</div>
                <div className="text-term-lightgray group-hover:text-term-green transition-colors font-mono">github.com/AdityaBhardwaj04</div>
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
    </LayoutGroup>
  );
}
