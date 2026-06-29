import React, { useState } from 'react';
import { Shield, Key, Eye, Lock, Unlock, HelpCircle, Trophy, CheckCircle, RefreshCw, Terminal, Search, ExternalLink, BookOpen, Server, Crosshair } from 'lucide-react';
import { CtfChallenge } from '../types';
import { CTF_WRITEUPS, PLATFORM_ACTIVITY } from '../data';

interface CtfTabProps {
  challenges: CtfChallenge[];
  onSolve: (challengeId: string, points: number, flag: string) => void;
}

export default function CtfTab({ challenges, onSolve }: CtfTabProps) {
  const [ctfView, setCtfView] = useState<'challenges' | 'activity'>('challenges');
  const [selectedChallId, setSelectedChallId] = useState<string>('sqli_login');
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [rotValue, setRotValue] = useState<number>(0);
  const [showCookies, setShowCookies] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ [key: string]: { success: boolean; msg: string } }>({});

  const activeChall = challenges.find(c => c.id === selectedChallId) || challenges[0];

  const applyRot = (str: string, shift: number) => {
    return str.replace(/[A-Za-z]/g, (char) => {
      const code = char.charCodeAt(0);
      const start = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - start + shift) % 26) + start);
    });
  };

  const handleInputChange = (challId: string, val: string) => {
    setInputs(prev => ({ ...prev, [challId]: val }));
  };

  const [sqliUser, setSqliUser] = useState<string>('');
  const [sqliPass, setSqliPass] = useState<string>('');
  const [sqliResult, setSqliResult] = useState<string>('');

  const [keygenInput, setKeygenInput] = useState<string>('');
  const [keygenResult, setKeygenResult] = useState<string>('');

  const handleSqliLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = sqliUser.trim().toLowerCase();
    if (user.includes("' or") || user.includes("'or") || user.includes('" or') || user.includes('"or')) {
      setSqliResult(
        `[+] SQL Query: SELECT * FROM users WHERE username = '${sqliUser}' AND password = '${sqliPass}'\n` +
        `[+] Result: Bypassed successfully! Logged in as "Administrator".\n` +
        `[+] Flag: FLAG{sql_injection_master_4123}`
      );
    } else {
      setSqliResult(
        `[-] SQL Query: SELECT * FROM users WHERE username = '${sqliUser}' AND password = '${sqliPass}'\n` +
        `[-] Auth Error: Username or password does not match. Handshake rejected.`
      );
    }
  };

  const handleKeygenVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const key = parseInt(keygenInput.trim());
    if (key === 100) {
      setKeygenResult(
        `[+] Executing verify_key(100)...\n` +
        `[+] (100 * 5) - 13 = 487\n` +
        `[+] Logic check evaluates to TRUE.\n` +
        `[+] SUCCESS: Activation serial matches root criteria!\n` +
        `[+] Flag: FLAG{rev_eng_wizard_99}`
      );
    } else if (isNaN(key)) {
      setKeygenResult(`[-] Error: Input serial key must be a valid numerical value.`);
    } else {
      setKeygenResult(
        `[+] Executing verify_key(${key})...\n` +
        `[+] (${key} * 5) - 13 = ${(key * 5) - 13}\n` +
        `[-] Logic check evaluates to FALSE. Activation rejected.`
      );
    }
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitted = inputs[activeChall.id] || '';
    const cleanSub = submitted.trim();

    if (cleanSub === activeChall.flag) {
      setSubmissionFeedback(prev => ({
        ...prev,
        [activeChall.id]: { success: true, msg: 'CORRECT FLAG! Handshake accepted. +Points added.' }
      }));
      onSolve(activeChall.id, activeChall.points, activeChall.flag);
    } else {
      setSubmissionFeedback(prev => ({
        ...prev,
        [activeChall.id]: { success: false, msg: 'INVALID FLAG. Try analyzing the payload or using hints.' }
      }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tab navigation */}
      <div className="flex border-b border-term-border gap-2 pb-2">
        <button
          onClick={() => setCtfView('challenges')}
          className={`px-3 py-1.5 rounded transition-all text-xs font-bold border flex items-center gap-1.5 ${
            ctfView === 'challenges'
              ? 'bg-term-green text-term-bg border-term-green'
              : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
          }`}
        >
          <Crosshair size={12} /> [ INTERACTIVE CHALLENGES ]
        </button>
        <button
          onClick={() => setCtfView('activity')}
          className={`px-3 py-1.5 rounded transition-all text-xs font-bold border flex items-center gap-1.5 ${
            ctfView === 'activity'
              ? 'bg-term-green text-term-bg border-term-green'
              : 'border-term-border text-term-lightgray hover:border-term-green hover:text-term-green'
          }`}
        >
          <BookOpen size={12} /> [ HTB / WRITEUPS ]
        </button>
      </div>

      {/* Interactive Challenges View */}
      {ctfView === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="border border-term-border p-4 rounded bg-term-bg/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-term-lightgray font-bold text-sm uppercase flex items-center gap-1.5">
                  <Trophy size={14} /> [ ACTIVE CHALLENGES ]
                </h2>
                <span className="text-[10px] text-term-green font-mono">JEOPARDY STYLE</span>
              </div>

              <div className="flex flex-col gap-2">
                {challenges.map((chall) => (
                  <button
                    key={chall.id}
                    onClick={() => {
                      setSelectedChallId(chall.id);
                      setShowCookies(false);
                    }}
                    className={`text-left p-3 rounded border transition-all text-xs flex flex-col gap-1.5 ${
                      chall.id === selectedChallId
                        ? 'border-term-green bg-term-darkgreen/40 text-term-green'
                        : 'border-term-border text-term-lightgray hover:border-term-green/50 hover:text-term-green bg-term-bg/10'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">{chall.title}</span>
                      {chall.solved ? (
                        <span className="text-[10px] text-term-green bg-term-darkgreen/40 border border-term-green px-1.5 py-0.5 rounded font-mono font-bold">
                          SOLVED
                        </span>
                      ) : (
                        <span className="text-[10px] text-yellow-500 font-mono">
                          {chall.points} pts
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-term-lightgray/70">
                      <span>Category: {chall.category}</span>
                      {chall.id === selectedChallId && <span className="text-term-green font-mono font-bold">&gt;&gt;</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-term-border pb-2">
                <h3 className="text-term-green font-bold text-sm tracking-wide">
                  {activeChall.title}
                </h3>
                <span className="text-[10px] text-term-lightgray font-mono uppercase">
                  {activeChall.points} PTS | {activeChall.category}
                </span>
              </div>

              <p className="text-xs text-term-lightgray leading-relaxed bg-term-bg p-3 border border-term-border/40 rounded">
                {activeChall.description}
              </p>

              <div className="border border-term-border rounded bg-term-gray/20 p-3">
                <span className="text-[10px] text-term-green font-bold uppercase tracking-wider block mb-2 font-mono">
                  [ INTERACTIVE CHALLENGE PANEL ]
                </span>

                {activeChall.type === 'sqli' && (
                  <div className="flex flex-col gap-3">
                    <form onSubmit={handleSqliLogin} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="text-term-lightgray font-bold">Username</label>
                        <input
                          type="text"
                          value={sqliUser}
                          onChange={(e) => setSqliUser(e.target.value)}
                          placeholder="admin' OR '1'='1"
                          className="bg-term-bg border border-term-border text-term-green rounded p-1.5 focus:outline-none focus:border-term-green"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-term-lightgray font-bold">Password</label>
                        <input
                          type="password"
                          value={sqliPass}
                          onChange={(e) => setSqliPass(e.target.value)}
                          placeholder="anything"
                          className="bg-term-bg border border-term-border text-term-green rounded p-1.5 focus:outline-none focus:border-term-green"
                        />
                      </div>
                      <button
                        type="submit"
                        className="md:col-span-2 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors py-1.5 px-3 rounded font-bold"
                      >
                        Bypass Login Query
                      </button>
                    </form>

                    {sqliResult && (
                      <pre className="bg-term-bg border border-term-border rounded p-2 text-[10px] font-mono text-term-lightgray overflow-auto">
                        {sqliResult}
                      </pre>
                    )}
                  </div>
                )}

                {activeChall.type === 'crypto' && (
                  <div className="flex flex-col gap-3">
                    <div className="text-xs text-term-lightgray flex flex-col gap-1.5">
                      <span className="font-bold">Original:</span>
                      <div className="bg-term-bg p-2 border border-term-border rounded text-center text-yellow-300 font-mono tracking-wider">
                        SYNT{'{'}pelcgb_vf_rnfl_naq_sha{'}'}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-term-lightgray font-bold">Caesar Slider (Shift Count)</span>
                        <span className="text-term-green font-bold">+{rotValue} ROT</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={rotValue}
                        onChange={(e) => setRotValue(parseInt(e.target.value))}
                        className="w-full accent-term-green"
                      />
                    </div>

                    <div className="text-xs text-term-lightgray flex flex-col gap-1.5">
                      <span className="font-bold">Decrypted preview:</span>
                      <div className="bg-term-bg p-2 border border-term-green/40 rounded text-center text-term-green font-mono tracking-wider font-bold">
                        {applyRot('SYNT{pelcgb_vf_rnfl_naq_sha}', rotValue)}
                      </div>
                    </div>
                  </div>
                )}

                {activeChall.type === 'reverse' && (
                  <div className="flex flex-col gap-3">
                    <form onSubmit={handleKeygenVerify} className="flex gap-2 text-xs">
                      <input
                        type="text"
                        value={keygenInput}
                        onChange={(e) => setKeygenInput(e.target.value)}
                        placeholder="Enter calculated numerical key..."
                        className="bg-term-bg border border-term-border text-term-green rounded p-1.5 flex-grow focus:outline-none focus:border-term-green"
                      />
                      <button
                        type="submit"
                        className="border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors py-1.5 px-4 rounded font-bold"
                      >
                        Submit Key
                      </button>
                    </form>

                    {keygenResult && (
                      <pre className="bg-term-bg border border-term-border rounded p-2 text-[10px] font-mono text-term-lightgray overflow-auto">
                        {keygenResult}
                      </pre>
                    )}
                  </div>
                )}

                {activeChall.type === 'cookie' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowCookies(!showCookies)}
                      className="border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors text-xs py-1.5 px-3 rounded font-bold flex items-center justify-center gap-1.5"
                    >
                      <Eye size={12} /> {showCookies ? 'Hide Cookie Jar' : 'Inspect Virtual Cookie Jar'}
                    </button>

                    {showCookies && (
                      <div className="border border-term-border bg-term-bg rounded p-2.5 overflow-x-auto text-[10px]">
                        <table className="w-full text-left font-mono text-term-lightgray divide-y divide-term-border/40">
                          <thead>
                            <tr className="text-term-green font-bold">
                              <th className="pb-1.5 pr-2">Name</th>
                              <th className="pb-1.5 pr-2">Value</th>
                              <th className="pb-1.5 pr-2">Domain</th>
                              <th className="pb-1.5 pr-2">Secure</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-term-border/20">
                            <tr>
                              <td className="py-1.5 pr-2 text-emerald-400">auth_session</td>
                              <td className="py-1.5 pr-2">guest_temp_92813</td>
                              <td className="py-1.5 pr-2">aditya.portfolio</td>
                              <td className="py-1.5 pr-2">False</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 pr-2 text-emerald-400">secure_flag_token</td>
                              <td className="py-1.5 pr-2 text-yellow-300 font-bold select-all">{"FLAG{cookie_monster_loves_tokens}"}</td>
                              <td className="py-1.5 pr-2">aditya.portfolio</td>
                              <td className="py-1.5 pr-2">True</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 pr-2 text-emerald-400">user_locale</td>
                              <td className="py-1.5 pr-2">en-IN</td>
                              <td className="py-1.5 pr-2">aditya.portfolio</td>
                              <td className="py-1.5 pr-2">False</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto border-t border-term-border/40 pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-term-lightgray">
                  <HelpCircle size={14} className="text-term-green" />
                  <span>Hint: <span className="italic">{activeChall.hint}</span></span>
                </div>

                <form onSubmit={handleFlagSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputs[activeChall.id] || ''}
                    onChange={(e) => handleInputChange(activeChall.id, e.target.value)}
                    placeholder="Submit flag format: FLAG{your_found_value}..."
                    disabled={activeChall.solved}
                    className="bg-term-bg border border-term-border text-term-green text-xs rounded px-3 py-2 flex-grow focus:outline-none focus:border-term-green disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={activeChall.solved}
                    className="bg-term-green hover:bg-term-green/80 text-term-bg disabled:bg-term-gray disabled:text-term-lightgray/50 font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed"
                  >
                    Submit Flag
                  </button>
                </form>

                {submissionFeedback[activeChall.id] && (
                  <div
                    className={`text-xs p-2.5 rounded flex items-center gap-2 border ${
                      submissionFeedback[activeChall.id].success
                        ? 'border-term-green bg-term-darkgreen/20 text-term-green'
                        : 'border-red-900 bg-red-950/20 text-red-400'
                    }`}
                  >
                    {submissionFeedback[activeChall.id].success ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                    <span>{submissionFeedback[activeChall.id].msg}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity & Writeups View */}
      {ctfView === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Platform Stats */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {PLATFORM_ACTIVITY.map((platform) => (
              <div key={platform.id} className="border border-term-border p-4 rounded bg-term-bg/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-term-green font-bold text-xs uppercase flex items-center gap-1.5">
                    <Server size={14} /> {platform.platform}
                  </h3>
                  {platform.profileUrl && (
                    <a
                      href={platform.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-term-green hover:underline flex items-center gap-1"
                    >
                      Profile <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-term-lightgray leading-relaxed mb-3">
                  {platform.stats}
                </p>
                {platform.machines && platform.machines.length > 0 && (
                  <div>
                    <span className="text-[10px] text-term-green font-bold uppercase tracking-wider block mb-1.5">
                      MACHINES COMPLETED
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {platform.machines.map((machine, idx) => (
                        <span key={idx} className="text-[10px] bg-term-darkgreen/30 border border-term-green/40 text-term-green px-2 py-0.5 rounded font-mono font-bold">
                          {machine}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="border border-term-border p-4 rounded bg-term-bg/50 text-xs text-term-lightgray leading-relaxed">
              <span className="text-term-green font-bold block mb-1.5 uppercase">[ METHODOLOGY ]</span>
              Every writeup follows a structured approach: reconnaissance, enumeration, exploitation, and post-exploitation. Emphasis on documenting dead ends and pivots — not just the winning path.
            </div>
          </div>

          {/* Writeups */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="border border-term-border p-4 rounded bg-term-bg/50">
              <h2 className="text-term-lightgray font-bold text-sm uppercase flex items-center gap-1.5 mb-3">
                <BookOpen size={14} /> [ PUBLISHED WRITEUPS ]
              </h2>
              <p className="text-[10px] text-term-lightgray/70 mb-3">
                Technical walkthroughs published on Medium documenting penetration testing labs and challenge solutions.
              </p>
            </div>

            {CTF_WRITEUPS.map((writeup) => (
              <div key={writeup.id} className="border border-term-border p-4 rounded bg-term-bg/50 flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-term-green font-bold text-xs leading-relaxed flex-grow">
                    {writeup.title}
                  </h3>
                  <a
                    href={writeup.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1"
                  >
                    Read <ExternalLink size={10} />
                  </a>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-term-green border border-term-green/40 px-1.5 py-0.5 rounded font-mono font-bold bg-term-darkgreen/20">
                    {writeup.platform}
                  </span>
                  {writeup.machine && (
                    <span className="text-yellow-400 font-mono font-bold">
                      Machine: {writeup.machine}
                    </span>
                  )}
                </div>

                <p className="text-xs text-term-lightgray leading-relaxed">
                  {writeup.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-term-border/30">
                  {writeup.topics.map((topic, idx) => (
                    <span key={idx} className="text-[9px] bg-term-gray border border-term-border text-term-lightgray px-1.5 py-0.5 rounded font-mono">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
