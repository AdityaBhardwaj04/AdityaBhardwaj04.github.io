import React, { useState } from 'react';
import {
  Shield, Globe, Crosshair, CornerRightUp, Terminal, Code, Zap, Activity,
  Play, Send, RefreshCw, Search, CheckCircle, AlertTriangle
} from 'lucide-react';
import { SKILLS_DATA } from '../data';
import { Skill } from '../types';

export default function SkillsTab() {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('netsec');

  const [webPayload, setWebPayload] = useState<string>('');
  const [webOutput, setWebOutput] = useState<string[]>([]);

  const [pythonScript, setPythonScript] = useState<string>('port_scanner');
  const [pythonOutput, setPythonOutput] = useState<string[]>([]);
  const [isPythonRunning, setIsPythonRunning] = useState<boolean>(false);

  const [burpHeaders, setBurpHeaders] = useState<string>(
    "GET /admin HTTP/1.1\nHost: internal-portal.corp\nUser-Agent: Mozilla/5.0\nCookie: session=guest_temp"
  );
  const [burpResponse, setBurpResponse] = useState<string>('Click "Forward Request" to intercept responses.');

  const [wiresharkFilter, setWiresharkFilter] = useState<string>('');
  const [wiresharkPackets] = useState<{
    id: number;
    protocol: string;
    source: string;
    dest: string;
    info: string;
    payload: string;
  }[]>([
    { id: 1, protocol: 'TCP', source: '10.10.10.5', dest: '10.10.10.100', info: 'SYN [Seq=0 Win=64240]', payload: 'Empty segment' },
    { id: 2, protocol: 'TCP', source: '10.10.10.100', dest: '10.10.10.5', info: 'SYN, ACK [Seq=0 Ack=1 Win=65535]', payload: 'Empty segment' },
    { id: 3, protocol: 'HTTP', source: '10.10.10.5', dest: '10.10.10.100', info: 'GET /login HTTP/1.1', payload: 'User-Agent: Mozilla/5.0' },
    { id: 4, protocol: 'HTTP', source: '10.10.10.100', dest: '10.10.10.5', info: 'HTTP/1.1 200 OK (text/html)', payload: '<html>...</html>' },
    { id: 5, protocol: 'HTTP', source: '10.10.10.5', dest: '10.10.10.100', info: 'POST /login HTTP/1.1 (application/x-www-form-urlencoded)', payload: 'user=admin&pass=hidden_flag_credential_inside_cookie_jar_99' },
    { id: 6, protocol: 'DNS', source: '10.10.10.5', dest: '8.8.8.8', info: 'Standard query 0x12a3 A external.c2server.net', payload: 'Domain name lookup' },
  ]);
  const [selectedPacket, setSelectedPacket] = useState<any>(null);

  const selectedSkill = SKILLS_DATA.find(s => s.id === selectedSkillId) || SKILLS_DATA[0];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return Shield;
      case 'Globe': return Globe;
      case 'Crosshair': return Crosshair;
      case 'CornerRightUp': return CornerRightUp;
      case 'Terminal': return Terminal;
      case 'Code': return Code;
      case 'Zap': return Zap;
      case 'Activity': return Activity;
      default: return Terminal;
    }
  };

  const handleTestPayload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webPayload) return;

    let logs: string[] = [`[i] Parsing input: "${webPayload}"`];
    const normalized = webPayload.toLowerCase();

    if (normalized.includes('<script>') || normalized.includes('onerror=') || normalized.includes('onload=')) {
      logs.push('[!] CRITICAL: Cross-Site Scripting (XSS) Pattern Detected!');
      logs.push('[i] Input matches standard script tags or image handlers.');
      logs.push('[+] SIMULATING FIREWALL REACTION: Packet BLOCKED by WAF rule #4041.');
    } else if (normalized.includes("' or") || normalized.includes('" or') || normalized.includes('union select')) {
      logs.push('[!] CRITICAL: SQL Injection Pattern Detected!');
      logs.push('[i] Detected quotes followed by logical operations.');
      logs.push('[+] SIMULATING DATABASE ENGINE: Query aborted. Malformed string escape flagged.');
    } else {
      logs.push('[+] Input Sanitized. No active exploit payload detected.');
      logs.push(`[i] Safely rendered output text: ${webPayload.replace(/</g, '&lt;')}`);
    }

    setWebOutput(logs);
  };

  const handleRunPython = () => {
    setIsPythonRunning(true);
    setPythonOutput(['[i] Launching virtual Python engine...', `[i] Loading script: ${pythonScript}.py`]);

    setTimeout(() => {
      if (pythonScript === 'port_scanner') {
        setPythonOutput(prev => [
          ...prev,
          '[+] Multi-threading enabled (16 threads). Scanning host 10.10.10.42...',
          '  [+] Port 22/tcp (ssh) - OPEN',
          '  [+] Port 80/tcp (http) - OPEN',
          '  [+] Port 443/tcp (https) - OPEN',
          '  [+] Port 8080/tcp (http-proxy) - OPEN',
          '[+] Scan completed. 4 ports discovered open.'
        ]);
      } else {
        setPythonOutput(prev => [
          ...prev,
          '[+] Initializing ARP Poisoning sequence...',
          '[i] Selected Network Interface: eth0',
          '[i] Spoofing Gateway 10.10.10.1 -> Target 10.10.10.55',
          '[i] Spoofing Target 10.10.10.55 -> Gateway 10.10.10.1',
          '[+] MITM successfully established. Diverting packets through eth0...'
        ]);
      }
      setIsPythonRunning(false);
    }, 1500);
  };

  const handleForwardBurp = () => {
    if (burpHeaders.includes('session=admin')) {
      setBurpResponse(
        "HTTP/1.1 200 OK\nServer: CustomSecureAPI/1.0\nContent-Type: application/json\n\n{\n  \"status\": \"authenticated\",\n  \"user\": \"admin\",\n  \"secret_flag\": \"FLAG{burp_smuggler_session_ok}\",\n  \"logs\": \"Audit service active\"\n}"
      );
    } else if (burpHeaders.includes('/admin')) {
      setBurpResponse(
        "HTTP/1.1 403 Forbidden\nServer: CustomSecureAPI/1.0\nContent-Type: text/plain\n\nError: Access denied. Current session 'guest_temp' does not carry administrative authorization level."
      );
    } else {
      setBurpResponse(
        "HTTP/1.1 200 OK\nServer: CustomSecureAPI/1.0\nContent-Type: text/html\n\n<html>\n  <body>\n    <h1>Welcome to Internal Portal</h1>\n  </body>\n</html>"
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="border border-term-border p-4 rounded bg-term-bg/50">
          <h2 className="text-term-lightgray mb-3"><span className="sm:inline hidden">[ </span>CORE &amp; TOOL SKILLS<span className="sm:inline hidden"> ]</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 text-center text-xs">
            {SKILLS_DATA.map((skill) => {
              const Icon = getIconComponent(skill.icon);
              const isSelected = skill.id === selectedSkillId;
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`flex flex-col items-center gap-2 border rounded p-2.5 transition-all group ${
                    isSelected
                      ? 'border-term-green bg-term-darkgreen/40 text-term-green shadow-[0_0_5px_rgba(0,255,65,0.2)]'
                      : 'border-term-border text-term-lightgray hover:border-term-green/50 hover:text-term-green bg-term-bg/10'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-shadow-glow' : ''} />
                  <span className="font-bold tracking-wide text-[10px] sm:text-xs">
                    {skill.name}
                  </span>
                  <div className="w-full bg-term-gray h-1 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-term-green h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-term-border p-4 rounded bg-term-bg/50">
          <h3 className="text-term-green font-bold text-sm mb-2 uppercase flex items-center gap-2">
            <span>&gt;_ DETAILED AUDIT: {selectedSkill.name}</span>
          </h3>
          <p className="text-term-lightgray text-xs mb-3 leading-relaxed">
            {selectedSkill.description}
          </p>
          <div className="space-y-2 mt-2">
            <span className="text-term-green text-[10px] font-bold tracking-wider uppercase border-b border-term-border pb-1 block">
              VERIFIED ABILITIES
            </span>
            <ul className="text-xs text-term-lightgray space-y-1.5 list-none pl-1">
              {selectedSkill.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-1.5">
                  <span className="text-term-green font-mono font-bold mt-0.5">&gt;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col min-h-[350px]">
          <h2 className="text-term-lightgray mb-3 flex items-center justify-between border-b border-term-border pb-2">
            <span><span className="sm:inline hidden">[ </span>SIMULATED INTERACTIVE SANDBOX<span className="sm:inline hidden"> ]</span></span>
            <span className="text-[10px] text-term-green px-1.5 py-0.5 border border-term-green rounded animate-pulse font-bold">
              ACTIVE NODE
            </span>
          </h2>

          {selectedSkillId === 'webexplo' ? (
            <div className="flex flex-col gap-3 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-term-green font-bold flex items-center gap-1.5">
                  <Globe size={14} /> Web Security Payload Sandbox
                </span>
                <span className="text-[10px] text-term-lightgray">WAF Audit Console</span>
              </div>
              <p className="text-xs text-term-lightgray">
                Test web application input defenses. Type a raw input or try a payload. Try standard inputs or common exploits like <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> or <code>' OR 1=1 --</code>.
              </p>

              <form onSubmit={handleTestPayload} className="flex gap-2">
                <input
                  type="text"
                  value={webPayload}
                  onChange={(e) => setWebPayload(e.target.value)}
                  placeholder="Enter custom payload string..."
                  className="bg-term-gray/50 border border-term-border text-term-green text-xs rounded px-3 py-2 flex-grow focus:outline-none focus:border-term-green"
                />
                <button
                  type="submit"
                  className="bg-term-green hover:bg-term-green/80 text-term-bg font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
                >
                  <Send size={12} /> Test
                </button>
              </form>

              <div className="bg-term-gray/20 border border-term-border rounded p-3 font-mono text-xs flex-grow flex flex-col justify-end">
                <div className="text-term-lightgray/50 mb-2 border-b border-term-border/40 pb-1 text-[10px]">
                  SANDBOX STDOUT LOGS
                </div>
                {webOutput.length === 0 ? (
                  <div className="text-term-gray italic text-center py-6">
                    Enter payload above and click Test to capture event feedback logs.
                  </div>
                ) : (
                  <div className="space-y-1 overflow-y-auto max-h-[160px]">
                    {webOutput.map((log, index) => (
                      <div
                        key={index}
                        className={
                          log.startsWith('[!]')
                            ? 'text-red-400'
                            : log.startsWith('[+]')
                            ? 'text-term-green'
                            : 'text-term-lightgray'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : selectedSkillId === 'python' ? (
            <div className="flex flex-col gap-3 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-term-green font-bold flex items-center gap-1.5">
                  <Code size={14} /> Python Script Execution Hub
                </span>
                <span className="text-[10px] text-term-lightgray">vPython 3.10.4 Engine</span>
              </div>
              <p className="text-xs text-term-lightgray">
                Execute custom-engineered security scripts built by Aditya to audit network hosts or test defenses.
              </p>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-term-lightgray">
                  <input
                    type="radio"
                    name="pyScript"
                    checked={pythonScript === 'port_scanner'}
                    onChange={() => {
                      setPythonScript('port_scanner');
                      setPythonOutput([]);
                    }}
                    className="accent-term-green"
                  />
                  <span>port_scanner.py</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-term-lightgray">
                  <input
                    type="radio"
                    name="pyScript"
                    checked={pythonScript === 'arp_poisoner'}
                    onChange={() => {
                      setPythonScript('arp_poisoner');
                      setPythonOutput([]);
                    }}
                    className="accent-term-green"
                  />
                  <span>arp_poisoner.py</span>
                </label>
              </div>

              <div className="flex-grow flex flex-col">
                <button
                  onClick={handleRunPython}
                  disabled={isPythonRunning}
                  className={`border border-term-green hover:bg-term-green hover:text-term-bg text-term-green font-bold text-xs py-2 px-4 rounded flex items-center justify-center gap-1.5 transition-colors mb-3 ${
                    isPythonRunning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isPythonRunning ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> RUNNING SCRIPT...
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" /> EXECUTE PYTHON SCRIPT
                    </>
                  )}
                </button>

                <div className="bg-term-bg/90 border border-term-border rounded p-3 font-mono text-xs flex-grow flex flex-col justify-end">
                  <div className="text-term-lightgray/50 mb-2 border-b border-term-border/40 pb-1 text-[10px]">
                    TERMINAL PYTHON SHELL
                  </div>
                  {pythonOutput.length === 0 ? (
                    <div className="text-term-gray italic text-center py-6">
                      Click the execute button to compile and run the Python daemon.
                    </div>
                  ) : (
                    <div className="space-y-1 overflow-y-auto max-h-[140px]">
                      {pythonOutput.map((log, index) => (
                        <div
                          key={index}
                          className={
                            log.startsWith('[!]')
                              ? 'text-yellow-400 font-bold'
                              : log.startsWith('[+]')
                              ? 'text-term-green'
                              : log.startsWith('  [+]')
                              ? 'text-term-green/80 font-bold pl-3'
                              : 'text-term-lightgray'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : selectedSkillId === 'burpsuite' ? (
            <div className="flex flex-col gap-3 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-term-green font-bold flex items-center gap-1.5">
                  <Zap size={14} /> Burp Suite HTTP Proxy Interceptor
                </span>
                <span className="text-[10px] text-yellow-400 px-1.5 py-0.5 border border-yellow-400 rounded font-bold animate-pulse">
                  INTERCEPT IS ON
                </span>
              </div>
              <p className="text-xs text-term-lightgray">
                Inspect and tamper with outgoing client headers. Modify the <code>Cookie</code> parameter below from <code>guest_temp</code> to <code>session=admin</code> to compromise secure pathways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] text-term-lightgray font-bold">OUTGOING REQUEST HEADERS</div>
                  <textarea
                    value={burpHeaders}
                    onChange={(e) => setBurpHeaders(e.target.value)}
                    rows={5}
                    className="bg-term-gray/30 border border-term-border text-term-green text-xs font-mono rounded p-2 focus:outline-none focus:border-term-green w-full resize-none flex-grow"
                  />
                  <button
                    onClick={handleForwardBurp}
                    className="bg-term-green hover:bg-term-green/80 text-term-bg font-bold text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors mt-1"
                  >
                    <Send size={12} /> Forward Request
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] text-term-lightgray font-bold">PROXY SERVER RESPONSE</div>
                  <pre className="bg-term-bg/90 border border-term-border text-term-lightgray text-[10px] font-mono rounded p-2 overflow-auto resize-none flex-grow max-h-[160px]">
                    {burpResponse}
                  </pre>
                </div>
              </div>
            </div>
          ) : selectedSkillId === 'wireshark' ? (
            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-term-green font-bold flex items-center gap-1.5">
                  <Activity size={14} /> Wireshark Live Traffic Capture
                </span>
                <span className="text-[10px] text-term-lightgray">6 packets captured</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search size={12} className="absolute left-2.5 top-2.5 text-term-lightgray" />
                  <input
                    type="text"
                    value={wiresharkFilter}
                    onChange={(e) => setWiresharkFilter(e.target.value)}
                    placeholder="Apply Wireshark display filter (e.g. 'HTTP', 'TCP', '10.10.10.5')..."
                    className="bg-term-gray/50 border border-term-border text-term-green text-xs rounded pl-8 pr-3 py-1.5 w-full focus:outline-none focus:border-term-green"
                  />
                </div>
              </div>

              <div className="border border-term-border rounded overflow-hidden flex-grow flex flex-col text-[10px] bg-term-bg">
                <div className="grid grid-cols-12 bg-term-gray/30 p-1 border-b border-term-border text-term-lightgray font-bold">
                  <div className="col-span-1">No.</div>
                  <div className="col-span-2">Protocol</div>
                  <div className="col-span-3">Source</div>
                  <div className="col-span-3">Destination</div>
                  <div className="col-span-3">Info</div>
                </div>

                <div className="overflow-y-auto max-h-[110px] divide-y divide-term-border/40 flex-grow">
                  {wiresharkPackets
                    .filter(p => {
                      if (!wiresharkFilter) return true;
                      const f = wiresharkFilter.toLowerCase();
                      return (
                        p.protocol.toLowerCase().includes(f) ||
                        p.source.toLowerCase().includes(f) ||
                        p.dest.toLowerCase().includes(f) ||
                        p.info.toLowerCase().includes(f)
                      );
                    })
                    .map(packet => (
                      <div
                        key={packet.id}
                        onClick={() => setSelectedPacket(packet)}
                        className={`grid grid-cols-12 p-1 cursor-pointer transition-colors ${
                          selectedPacket?.id === packet.id
                            ? 'bg-term-green text-term-bg font-bold'
                            : packet.protocol === 'HTTP'
                            ? 'hover:bg-term-darkgreen/40 text-emerald-400'
                            : 'hover:bg-term-gray/20 text-term-lightgray'
                        }`}
                      >
                        <div className="col-span-1">{packet.id}</div>
                        <div className="col-span-2">{packet.protocol}</div>
                        <div className="col-span-3">{packet.source}</div>
                        <div className="col-span-3">{packet.dest}</div>
                        <div className="col-span-3 truncate">{packet.info}</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-term-gray/20 border border-term-border rounded p-2 text-[10px] font-mono h-[70px] overflow-y-auto">
                {selectedPacket ? (
                  <div>
                    <div className="font-bold text-term-green border-b border-term-border/30 pb-0.5 mb-1">
                      FRAME DETAIL INTERROGATION (No. {selectedPacket.id})
                    </div>
                    <div>Source Mac: 00:0c:29:fc:32:0d | Dest Mac: 00:50:56:c0:00:08</div>
                    <div className="text-term-lightgray break-all">
                      Payload Data: <span className="text-yellow-300 font-bold">{selectedPacket.payload}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-term-gray italic text-center py-2">
                    Click a packet row above to inspect hexadecimal &amp; ASCII plaintext payloads.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-grow justify-center items-center text-center p-6">
              <Shield size={48} className="text-term-green mb-2 text-shadow-glow animate-pulse" />
              <h3 className="text-term-green font-bold text-sm">SECURITY HARNESS ACTIVATED</h3>
              <p className="text-term-lightgray text-xs max-w-sm leading-relaxed">
                Aditya uses advanced proprietary analysis tools to secure clients. Click on other skills (like <span className="text-term-green font-bold cursor-pointer underline" onClick={() => setSelectedSkillId('webexplo')}>Web Exploitation</span>, <span className="text-term-green font-bold cursor-pointer underline" onClick={() => setSelectedSkillId('python')}>Python</span>, <span className="text-term-green font-bold cursor-pointer underline" onClick={() => setSelectedSkillId('burpsuite')}>Burp Suite</span>, or <span className="text-term-green font-bold cursor-pointer underline" onClick={() => setSelectedSkillId('wireshark')}>Wireshark</span>) to operate live interactive sandboxes!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
