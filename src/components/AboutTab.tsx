import React, { useState } from 'react';
import { User, Calendar, Terminal, Shield, Award } from 'lucide-react';

export default function AboutTab() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'timeline' | 'ethos'>('profile');

  const timelineEvents = [
    {
      year: 'Jul 2025 – Present',
      role: 'Systems Engineer – Application Security Testing',
      company: 'Tata Consultancy Services (TCS)',
      desc: 'Conducting security testing for 10+ non-PCI applications on the Experian engagement — web apps, APIs, and network components. Performed retesting and remediation validation for 20+ PCI and non-PCI applications. Utilizing Burp Suite, Nmap, Wireshark, and Postman to identify vulnerabilities.'
    },
    {
      year: 'Mar 2025 – Apr 2025',
      role: 'Security Testing Intern',
      company: 'Tata Consultancy Services (TCS)',
      desc: 'Assisted in enterprise web application and API security testing workflows. Supported vulnerability discovery using Burp Suite and network scanning tools. Participated in vulnerability validation and remediation verification processes.'
    },
    {
      year: '2021 – 2025',
      role: 'B.Tech Computer Science & Engineering',
      company: 'KIIT, Bhubaneswar',
      desc: 'Graduated with 8.21 CGPA. Active on HackTheBox and TryHackMe (Top 15%, 46+ rooms). Built security projects including ReconForges and a Facial Recognition Auth System.'
    }
  ];

  const methodologies = [
    {
      title: 'Application Security Testing',
      icon: Terminal,
      details: 'Web application and API security testing, vulnerability assessment, retesting, and remediation validation using Burp Suite, Nmap, and Wireshark.'
    },
    {
      title: 'Offensive Security & CTF',
      icon: Shield,
      details: 'Active HackTheBox and TryHackMe participant. Penetration testing labs, privilege escalation challenges, and publishing technical writeups on Medium.'
    },
    {
      title: 'Security Automation & Tooling',
      icon: Award,
      details: 'Building Python-based recon automation frameworks (ReconForges) integrating Subfinder, Amass, httpx, Katana, Nuclei, and custom scripts.'
    }
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex border-b border-term-border gap-2 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-1.5 rounded transition-all text-xs font-bold border ${
            activeSubTab === 'profile'
              ? 'bg-term-green text-term-bg border-term-green'
              : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
          }`}
        >
          [ PROFILE ]
        </button>
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-3 py-1.5 rounded transition-all text-xs font-bold border ${
            activeSubTab === 'timeline'
              ? 'bg-term-green text-term-bg border-term-green'
              : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
          }`}
        >
          [ TIMELINE ]
        </button>
        <button
          onClick={() => setActiveSubTab('ethos')}
          className={`px-3 py-1.5 rounded transition-all text-xs font-bold border ${
            activeSubTab === 'ethos'
              ? 'bg-term-green text-term-bg border-term-green'
              : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
          }`}
        >
          [ SECURITY ETHOS ]
        </button>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {activeSubTab === 'profile' && (
          <div className="flex flex-col gap-4">
            <div className="border border-term-border p-4 rounded bg-term-bg/50">
              <h3 className="text-term-green text-base font-bold mb-2 flex items-center gap-2">
                <User size={16} /> SECURITY PROFILE SHEET
              </h3>
              <p className="text-term-lightgray leading-relaxed text-sm">
                Cybersecurity Engineer at TCS with hands-on experience in web application security testing, vulnerability assessment, and security automation. Currently working on Experian security testing engagements. Active on HackTheBox and TryHackMe, with published penetration testing writeups on Medium.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-term-border text-xs">
                <div>
                  <span className="text-term-green font-bold">Focus Areas:</span>
                  <ul className="list-disc list-inside mt-1 text-term-lightgray space-y-1">
                    <li>Web Application & API Security Testing</li>
                    <li>Vulnerability Assessment & Remediation</li>
                    <li>Penetration Testing Labs (HTB / THM)</li>
                    <li>Security Automation & Recon Frameworks</li>
                  </ul>
                </div>
                <div>
                  <span className="text-term-green font-bold">Core Toolkit:</span>
                  <ul className="list-disc list-inside mt-1 text-term-lightgray space-y-1">
                    <li>Burp Suite, Nmap, Wireshark, Postman</li>
                    <li>Subfinder, Amass, httpx, Katana, Nuclei</li>
                    <li>Python, JavaScript, C/C++, SQL</li>
                    <li>Linux, Git</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {methodologies.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="border border-term-border p-3 rounded hover:border-term-green/50 transition-colors bg-term-bg/30">
                    <div className="flex items-center gap-2 text-term-green font-bold mb-1.5 text-xs">
                      <Icon size={14} />
                      <span>{method.title}</span>
                    </div>
                    <p className="text-term-lightgray text-xs leading-relaxed">
                      {method.details}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'timeline' && (
          <div className="flex flex-col gap-3">
            <div className="border border-term-border p-4 rounded bg-term-bg/50">
              <h3 className="text-term-green text-base font-bold mb-4 flex items-center gap-2">
                <Calendar size={16} /> PROFESSIONAL JOURNEY
              </h3>
              <div className="relative border-l-2 border-term-border ml-3 pl-6 space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative group">
                    <span className="absolute -left-[31px] top-1 bg-term-bg border-2 border-term-green rounded-full w-4.5 h-4.5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_5px_#00FF41]">
                      <span className="bg-term-green rounded-full w-1.5 h-1.5"></span>
                    </span>
                    <span className="text-term-green text-xs font-bold font-mono tracking-wide">
                      {event.year}
                    </span>
                    <h4 className="text-term-lightgray text-sm font-bold mt-0.5">
                      {event.role} <span className="text-term-green font-normal">@ {event.company}</span>
                    </h4>
                    <p className="text-term-lightgray text-xs mt-1.5 leading-relaxed max-w-3xl">
                      {event.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'ethos' && (
          <div className="border border-term-border p-4 rounded bg-term-bg/50 flex flex-col gap-3">
            <h3 className="text-term-green text-base font-bold mb-2 flex items-center gap-2">
              <Terminal size={16} /> ADITYA'S HACKER ETHOS
            </h3>
            <p className="text-term-lightgray text-sm leading-relaxed">
              "Breaking systems is not about destruction — it is the ultimate form of understanding. To design bulletproof software, we must possess the capacity to examine it through the lens of an adversary. We must question assumptions, analyze protocols, probe edges, and eliminate reliance on passive trust models. Only when we actively challenge defenses can we establish genuine resilience."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-term-border pt-4">
              <div className="flex flex-col gap-2">
                <span className="text-term-green font-bold text-xs">[ PRINCIPLE 01: ZERO TRUST ]</span>
                <p className="text-term-lightgray text-xs leading-relaxed">
                  Never assume input parameter sanity or client-side integrity. All boundaries must authenticate, validate, and enforce complete containment natively.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-term-green font-bold text-xs">[ PRINCIPLE 02: KNOWLEDGE SHARING ]</span>
                <p className="text-term-lightgray text-xs leading-relaxed">
                  Participating in CTF events, hosting walkthrough workshops, and releasing remediation writeups makes the entire web ecosystem safer.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
