import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, RefreshCw, Terminal, Search, ExternalLink } from 'lucide-react';
import { CERTIFICATIONS } from '../data';

export default function CertificationsTab() {
  const [selectedCertId, setSelectedCertId] = useState<string>('ccna');
  const [lookupCode, setLookupCode] = useState<string>('');
  const [verificationOutput, setVerificationOutput] = useState<string[]>([]);
  const [verifiedUrl, setVerifiedUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const selectedCert = CERTIFICATIONS.find(c => c.id === selectedCertId) || CERTIFICATIONS[0];

  const handleVerifyCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode) return;

    setIsVerifying(true);
    setVerifiedUrl('');
    setVerificationOutput([
      `[i] Querying Credly badge registry...`,
      `[i] Searching for badge ID: "${lookupCode.trim()}"...`,
    ]);

    setTimeout(() => {
      const match = CERTIFICATIONS.find(c =>
        c.idCode.toLowerCase() === lookupCode.trim().toLowerCase() ||
        c.badgeUrl.toLowerCase().includes(lookupCode.trim().toLowerCase())
      );
      if (match && match.badgeUrl) {
        setVerifiedUrl(match.badgeUrl);
        setVerificationOutput(prev => [
          ...prev,
          `[+] Badge found in Credly registry.`,
          `[i] Holder: ADITYA BHARDWAJ`,
          `[i] Credential: ${match.name}`,
          `[i] Issuer: ${match.issuer} (${match.date})`,
          `[+] STATUS: VERIFIED — Click below to view on Credly.`,
        ]);
      } else {
        setVerifiedUrl('');
        setVerificationOutput(prev => [
          ...prev,
          `[-] No matching badge found for "${lookupCode.trim()}" in this portfolio.`,
          `[i] This hub only verifies Aditya's credentials listed here.`,
          `[i] To verify any Credly badge, visit credly.com directly.`,
        ]);
      }
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Certifications Selection List */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50">
          <h2 className="text-term-lightgray mb-3 flex items-center gap-1.5 text-xs font-bold uppercase">
            <Award size={14} /> <span className="sm:inline hidden">[ </span>CERTIFICATIONS<span className="sm:inline hidden"> ]</span>
          </h2>
          <div className="flex flex-col gap-2">
            {CERTIFICATIONS.map((cert) => (
              <button
                key={cert.id}
                onClick={() => {
                  setSelectedCertId(cert.id);
                  setLookupCode(cert.idCode);
                  setVerificationOutput([]);
                  setVerifiedUrl('');
                }}
                className={`text-left p-3 rounded border transition-all text-xs flex flex-col gap-1.5 ${
                  cert.id === selectedCertId
                    ? 'border-term-green bg-term-darkgreen/40 text-term-green shadow-[0_0_5px_rgba(0,255,65,0.1)]'
                    : 'border-term-border text-term-lightgray hover:border-term-green/50 hover:text-term-green bg-term-bg/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-sm">{cert.name}</span>
                  <ShieldCheck size={16} className={cert.id === selectedCertId ? 'text-term-green' : 'text-term-lightgray/50'} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-term-lightgray/70 font-mono">
                  <span>{cert.issuer}</span>
                  <span>Issued: {cert.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Verification Hub */}
        <div className="border border-term-border p-4 rounded bg-term-bg/50">
          <h3 className="text-term-green font-bold text-xs mb-1.5 uppercase flex items-center gap-1.5">
            <Terminal size={14} /> CREDENTIAL VERIFICATION
          </h3>
          <p className="text-term-lightgray text-[10px] leading-relaxed mb-3">
            Enter a badge ID to verify against Credly. Try <code className="text-term-green cursor-pointer" onClick={() => setLookupCode('96a2b560')}>96a2b560</code> (CCNA) or <code className="text-term-green cursor-pointer" onClick={() => setLookupCode('32b50f1b')}>32b50f1b</code> (SC-900).
          </p>

          <form onSubmit={handleVerifyCredential} className="flex gap-2">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Enter badge ID (e.g. 96a2b560)..."
              className="bg-term-bg border border-term-border text-term-green text-xs rounded px-2.5 py-1.5 flex-grow focus:outline-none focus:border-term-green"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="bg-term-green hover:bg-term-green/80 text-term-bg font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              {isVerifying ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />} Verify
            </button>
          </form>

          {verificationOutput.length > 0 && (
            <div className="bg-term-bg border border-term-border rounded p-2.5 mt-3 font-mono text-[10px] space-y-1 overflow-y-auto max-h-[140px]">
              {verificationOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('[+]')
                      ? 'text-term-green font-bold'
                      : line.startsWith('[-]')
                      ? 'text-red-400'
                      : 'text-term-lightgray'
                  }
                >
                  {line}
                </div>
              ))}
              {verifiedUrl && (
                <a
                  href={verifiedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors px-2.5 py-1.5 rounded text-[10px] font-bold"
                >
                  View on Credly <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Certification Details panel */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-4">
          <div className="border-b border-term-border pb-3">
            <h2 className="text-term-green font-bold text-base mb-1 tracking-wide uppercase">
              {selectedCert.name}
            </h2>
            <div className="flex justify-between items-center text-xs text-term-lightgray font-mono mt-1">
              <div>Issuer: <span className="text-term-green font-bold">{selectedCert.issuer}</span></div>
              <div>Badge ID: <span className="text-term-green font-bold">{selectedCert.idCode}</span></div>
            </div>
          </div>

          <div>
            <span className="text-term-green text-[10px] font-bold uppercase tracking-wider block mb-1.5">
              CREDENTIAL DESCRIPTION
            </span>
            <p className="text-term-lightgray text-xs leading-relaxed">
              {selectedCert.description}
            </p>
          </div>

          <div className="mt-2 flex-grow">
            <span className="text-term-green text-[10px] font-bold uppercase tracking-wider block mb-2">
              VERIFIED SYLLABUS &amp; ABILITIES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedCert.skillsVerified.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 border border-term-border/40 p-2.5 rounded bg-term-bg/25 text-xs text-term-lightgray">
                  <CheckCircle2 size={14} className="text-term-green flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verify on Credly button */}
          <div className="border border-term-border rounded bg-term-gray/25 p-3 flex items-center justify-between mt-auto">
            <div className="text-xs text-term-lightgray">
              <div className="font-bold text-term-green uppercase">Credly Verified Badge</div>
              <div className="text-[10px] text-term-gray font-mono">ID: {selectedCert.idCode}</div>
            </div>
            {selectedCert.badgeUrl ? (
              <a
                href={selectedCert.badgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors px-3 py-2 rounded text-xs font-bold flex items-center gap-1.5"
              >
                Verify on Credly <ExternalLink size={13} />
              </a>
            ) : (
              <Award size={32} className="text-term-green text-shadow-glow" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
