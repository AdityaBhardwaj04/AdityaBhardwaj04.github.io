import React, { useState } from 'react';
import { Folder, Shield, AlertTriangle, CheckCircle, RefreshCw, Layers, Cpu, Terminal, ExternalLink, Star } from 'lucide-react';
import { PROJECTS_DATA } from '../data';

export default function ProjectsTab() {
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [demoInput, setDemoInput] = useState<string>('');
  const [demoOutput, setDemoOutput] = useState<string>('');
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  const selectedProject = PROJECTS_DATA.find(p => p.id === activeProjectId) || PROJECTS_DATA[0];

  const handleRunDemo = (option: string) => {
    if (!selectedProject.demoScenario) return;
    setIsDemoRunning(true);
    setDemoInput(option);
    setDemoOutput('[i] Spin-up local sandbox microcontainer...\n[i] Establishing virtual runtime binding...');

    setTimeout(() => {
      if (option === selectedProject.demoScenario?.correctInput) {
        setDemoOutput(selectedProject.demoScenario?.successOutput);
      } else {
        setDemoOutput(
          `[!] CRITICAL SYSTEM ALERT!\n[!] Vulnerability Triggered / Misbehavior log:\n    An unsanitized execution occurred or spoof was successful.\n[i] Result: Attempt BLOCKED by secure sandbox policies.`
        );
      }
      setIsDemoRunning(false);
    }, 1200);
  };

  const renderArchitectureDiagram = (projectId: string) => {
    switch (projectId) {
      case 'cipherchat':
        return (
          <svg viewBox="0 0 440 120" className="w-full h-24 text-term-green stroke-term-green" fill="none" strokeWidth="1">
            <rect x="5" y="10" width="75" height="45" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="42" y="27" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">React Web</text>
            <text x="42" y="40" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">Firebase Auth</text>
            <text x="42" y="50" textAnchor="middle" fontSize="4" className="fill-term-lightgray font-mono">Web Crypto API</text>
            <rect x="5" y="65" width="75" height="45" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="42" y="82" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">CLI Client</text>
            <text x="42" y="95" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">.pem import</text>
            <text x="42" y="105" textAnchor="middle" fontSize="4" className="fill-term-lightgray font-mono">Inquirer+Chalk</text>
            <path d="M80 32 H100" />
            <path d="M80 87 H100 V68" />
            <rect x="100" y="25" width="80" height="70" rx="3" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="140" y="42" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">HYBRID ENCRYPT</text>
            <text x="140" y="56" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">AES-256-GCM</text>
            <text x="140" y="67" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">key wrapped by</text>
            <text x="140" y="78" textAnchor="middle" fontSize="5" className="fill-yellow-400 font-mono">RSA-2048-OAEP</text>
            <text x="140" y="90" textAnchor="middle" fontSize="4" className="fill-term-green/60 font-mono">IndexedDB keys</text>
            <path d="M180 60 H210" />
            <polygon points="210,60 206,57 206,63" className="fill-term-green" />
            <text x="195" y="52" textAnchor="middle" fontSize="4" className="fill-red-400 font-mono">ciphertext</text>
            <rect x="210" y="20" width="110" height="80" rx="4" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="265" y="38" textAnchor="middle" fontSize="8" className="fill-term-green font-bold font-mono">RELAY SERVER</text>
            <text x="265" y="53" textAnchor="middle" fontSize="6" className="fill-term-lightgray font-mono">Express+Socket.IO</text>
            <text x="265" y="68" textAnchor="middle" fontSize="5" className="fill-red-400 font-bold font-mono">ZERO KNOWLEDGE</text>
            <text x="265" y="80" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">forward-only</text>
            <text x="265" y="92" textAnchor="middle" fontSize="4" className="fill-term-green/60 font-mono">Firestore 2x encrypted</text>
            <path d="M320 60 H360" strokeDasharray="3,3" />
            <polygon points="360,60 356,57 356,63" className="fill-term-green" />
            <rect x="360" y="30" width="70" height="60" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="395" y="50" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">Recipient</text>
            <text x="395" y="63" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">RSA unwrap</text>
            <text x="395" y="75" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">AES decrypt</text>
          </svg>
        );
      case 'reconforges':
        return (
          <svg viewBox="0 0 440 100" className="w-full h-20 text-term-green stroke-term-green" fill="none" strokeWidth="1">
            <rect x="5" y="30" width="60" height="40" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="35" y="50" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">CLI Input</text>
            <text x="35" y="62" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">Domain</text>
            <path d="M65 50 H85" />
            <polygon points="85,50 81,47 81,53" className="fill-term-green" />
            <rect x="85" y="25" width="55" height="50" rx="3" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="112" y="42" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">Subdomain</text>
            <text x="112" y="52" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">Discovery</text>
            <text x="112" y="65" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">Subfinder+Amass</text>
            <path d="M140 50 H155" />
            <polygon points="155,50 151,47 151,53" className="fill-term-green" />
            <rect x="155" y="30" width="50" height="40" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="180" y="47" textAnchor="middle" fontSize="6" className="fill-term-lightgray font-bold font-mono">httpx</text>
            <text x="180" y="58" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">Live Hosts</text>
            <path d="M205 50 H220" />
            <polygon points="220,50 216,47 216,53" className="fill-term-green" />
            <rect x="220" y="25" width="55" height="50" rx="3" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="247" y="42" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">Scan &amp;</text>
            <text x="247" y="52" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">Crawl</text>
            <text x="247" y="65" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">Nmap+Katana</text>
            <path d="M275 50 H290" />
            <polygon points="290,50 286,47 286,53" className="fill-term-green" />
            <rect x="290" y="30" width="55" height="40" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="317" y="47" textAnchor="middle" fontSize="6" className="fill-term-lightgray font-bold font-mono">Nuclei</text>
            <text x="317" y="58" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">Vuln Scan</text>
            <path d="M345 50 H360" />
            <polygon points="360,50 356,47 356,53" className="fill-term-green" />
            <rect x="360" y="25" width="70" height="50" rx="3" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="395" y="42" textAnchor="middle" fontSize="6" className="fill-term-green font-bold font-mono">Reports</text>
            <text x="395" y="55" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">JSON+HTML</text>
            <text x="395" y="65" textAnchor="middle" fontSize="5" className="fill-term-lightgray font-mono">+Graph</text>
          </svg>
        );
      case 'medinv':
        return (
          <svg viewBox="0 0 400 100" className="w-full h-20 text-term-green stroke-term-green" fill="none" strokeWidth="1">
            <rect x="10" y="25" width="80" height="50" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="50" y="47" textAnchor="middle" fontSize="8" className="fill-term-lightgray font-bold font-mono">React SPA</text>
            <text x="50" y="60" textAnchor="middle" fontSize="6" className="fill-term-green font-mono">Barcode Scanner</text>
            <path d="M90 50 H150" strokeDasharray="3,3" />
            <polygon points="150,50 145,47 145,53" className="fill-term-green" />
            <rect x="150" y="15" width="100" height="70" rx="4" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="200" y="35" textAnchor="middle" fontSize="9" className="fill-term-green font-bold font-mono">Flask API</text>
            <text x="200" y="50" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-mono">Flask-RESTful</text>
            <text x="200" y="65" textAnchor="middle" fontSize="6" className="fill-term-green/80 font-mono">Billing + Analytics</text>
            <text x="200" y="78" textAnchor="middle" fontSize="5" className="fill-yellow-400 font-mono">CORS Enabled</text>
            <path d="M250 50 H310" />
            <polygon points="310,50 305,47 305,53" className="fill-term-green" />
            <rect x="310" y="25" width="80" height="50" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="350" y="47" textAnchor="middle" fontSize="8" className="fill-term-lightgray font-bold font-mono">MongoDB</text>
            <text x="350" y="60" textAnchor="middle" fontSize="6" className="fill-term-green font-mono">Atlas Cloud</text>
          </svg>
        );
      case 'accordly':
        return (
          <svg viewBox="0 0 400 100" className="w-full h-20 text-term-green stroke-term-green" fill="none" strokeWidth="1">
            <rect x="10" y="30" width="70" height="40" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="45" y="47" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">User Input</text>
            <text x="45" y="60" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">NDA Params</text>
            <path d="M80 50 H110" />
            <polygon points="110,50 106,47 106,53" className="fill-term-green" />
            <rect x="110" y="10" width="120" height="80" rx="4" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="170" y="30" textAnchor="middle" fontSize="9" className="fill-term-green font-bold font-mono">FastAPI</text>
            <text x="170" y="48" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-mono">RAG Pipeline</text>
            <text x="170" y="62" textAnchor="middle" fontSize="6" className="fill-yellow-400 font-mono">Vector Store</text>
            <text x="170" y="78" textAnchor="middle" fontSize="6" className="fill-term-green/80 font-mono">OpenAI GPT</text>
            <path d="M230 50 H270" strokeDasharray="3,3" />
            <polygon points="270,50 265,47 265,53" className="fill-term-green" />
            <rect x="270" y="25" width="120" height="50" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="330" y="45" textAnchor="middle" fontSize="8" className="fill-term-lightgray font-bold font-mono">Document Export</text>
            <text x="330" y="60" textAnchor="middle" fontSize="6" className="fill-term-green font-mono">DOCX + PDF</text>
          </svg>
        );
      case 'heartdisease':
        return (
          <svg viewBox="0 0 400 100" className="w-full h-20 text-term-green stroke-term-green" fill="none" strokeWidth="1">
            <rect x="10" y="30" width="80" height="40" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="50" y="47" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">React UI</text>
            <text x="50" y="60" textAnchor="middle" fontSize="5" className="fill-term-green font-mono">Patient Form</text>
            <path d="M90 50 H130" />
            <polygon points="130,50 126,47 126,53" className="fill-term-green" />
            <rect x="130" y="15" width="110" height="70" rx="4" className="fill-term-darkgreen/20 stroke-term-green" />
            <text x="185" y="33" textAnchor="middle" fontSize="9" className="fill-term-green font-bold font-mono">FastAPI</text>
            <text x="185" y="50" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-mono">Model Serving</text>
            <text x="185" y="65" textAnchor="middle" fontSize="6" className="fill-term-green/80 font-mono">REST Endpoints</text>
            <text x="185" y="78" textAnchor="middle" fontSize="5" className="fill-yellow-400 font-mono">Train + Predict</text>
            <path d="M240 50 H280" strokeDasharray="3,3" />
            <polygon points="280,50 275,47 275,53" className="fill-term-green" />
            <rect x="280" y="25" width="110" height="50" rx="3" className="fill-term-bg stroke-term-border" />
            <text x="335" y="45" textAnchor="middle" fontSize="7" className="fill-term-lightgray font-bold font-mono">scikit-learn</text>
            <text x="335" y="60" textAnchor="middle" fontSize="6" className="fill-term-green font-mono">Classification Model</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50">
          <h2 className="text-term-lightgray mb-3 flex items-center gap-2">
            <Folder size={14} /> [ SELECT PROJECT ]
          </h2>
          <div className="flex flex-col gap-2">
            {PROJECTS_DATA.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id);
                  setDemoOutput('');
                  setDemoInput('');
                }}
                className={`text-left p-3 rounded border transition-all text-xs flex flex-col gap-1 group ${
                  project.id === activeProjectId
                    ? 'border-term-green bg-term-darkgreen/40 text-term-green shadow-[0_0_5px_rgba(0,255,65,0.2)]'
                    : 'border-term-border text-term-lightgray hover:border-term-green/50 hover:text-term-green bg-term-bg/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-sm truncate group-hover:text-shadow-glow">
                    {project.name}
                  </span>
                  <span className="font-mono text-[10px] text-term-green">[+]</span>
                </div>
                <p className="text-[10px] text-term-lightgray/70 truncate">
                  {project.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between border-b border-term-border pb-2 mb-2">
              <h2 className="text-term-green font-bold text-base tracking-wide flex items-center gap-2">
                <Layers size={16} /> {selectedProject.name}
              </h2>
              <div className="flex items-center gap-2">
                {selectedProject.repository && (
                  <a
                    href={selectedProject.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1"
                  >
                    GitHub <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedProject.tags.map((tag, idx) => (
                <span key={idx} className="text-[9px] bg-term-gray border border-term-border text-term-green px-2 py-0.5 rounded font-mono font-bold">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-term-lightgray text-xs leading-relaxed mb-4">
              {selectedProject.longDescription}
            </p>
          </div>

          {/* Architecture Diagram or Text List */}
          <div className="border border-term-border rounded bg-term-bg/80 p-3 flex flex-col gap-1.5">
            <span className="text-[10px] text-term-green font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={12} /> ARCHITECTURE
            </span>
            {renderArchitectureDiagram(selectedProject.id) ? (
              <div className="flex justify-center items-center bg-term-bg p-2 border border-term-border/40 rounded overflow-x-auto">
                {renderArchitectureDiagram(selectedProject.id)}
              </div>
            ) : (
              <div className="bg-term-bg p-2.5 border border-term-border/40 rounded space-y-1.5">
                {selectedProject.architecture.map((layer, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-term-lightgray">
                    <span className="text-term-green font-mono font-bold mt-0.5">&gt;</span>
                    <span>{layer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Highlights */}
          {selectedProject.highlights && selectedProject.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-xs">
              {selectedProject.highlights.map((highlight, index) => (
                <div key={index} className="border border-term-border rounded bg-term-darkgreen/5 p-3 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-term-green font-bold">
                    <Star size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{highlight.title}</span>
                  </div>
                  <p className="text-term-lightgray text-[10px] leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Demo Scenario (if present) */}
          {selectedProject.demoScenario && (
            <div className="border border-term-border rounded p-3 bg-term-bg/40 flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-term-border/30 pb-1.5">
                <span className="text-[10px] text-term-green font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal size={12} /> INTERACTIVE DEMO
                </span>
              </div>
              <p className="text-xs text-term-lightgray italic">
                {selectedProject.demoScenario.prompt}
              </p>

              <div className="flex gap-2">
                {selectedProject.demoScenario.inputs.map((inp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunDemo(inp)}
                    disabled={isDemoRunning}
                    className={`border text-xs px-3 py-1.5 rounded transition-all font-mono font-bold ${
                      demoInput === inp
                        ? 'bg-term-green text-term-bg border-term-green'
                        : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
                    }`}
                  >
                    Run: "{inp}"
                  </button>
                ))}
              </div>

              <div className="bg-term-bg border border-term-border rounded p-2.5 font-mono text-[10px] min-h-[90px] flex flex-col justify-end">
                {isDemoRunning ? (
                  <div className="flex justify-center items-center gap-2 py-4 text-term-green">
                    <RefreshCw size={12} className="animate-spin" /> RUNNING DEMO SEQUENCE...
                  </div>
                ) : demoOutput ? (
                  <pre className="text-term-lightgray leading-normal whitespace-pre-wrap">
                    {demoOutput}
                  </pre>
                ) : (
                  <div className="text-term-gray italic text-center py-4">
                    Select an input button above to run the demo.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
