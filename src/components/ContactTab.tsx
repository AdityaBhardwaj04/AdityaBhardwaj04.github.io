import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Key, ShieldAlert, CheckCircle, RefreshCw, Terminal, XCircle } from 'lucide-react';

type LineType = 'command' | 'ok' | 'error' | 'pending' | 'bar';
type TransmitPhase = 'idle' | 'transmitting' | 'success' | 'failed';

interface StatusLine {
  id: number;
  text: string;
  type: LineType;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactTabProps {
  onMessageSent: (message: string) => void;
}

function ProgressBar() {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setFilled(true));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
      <div className="w-36 h-1.5 bg-term-gray rounded-sm overflow-hidden">
        <div
          className="h-full bg-term-green rounded-sm"
          style={{ width: filled ? '100%' : '0%', transition: 'width 550ms ease-out' }}
        />
      </div>
      <span className={`text-term-green transition-opacity duration-300 ${filled ? 'opacity-100' : 'opacity-0'}`}>
        100%
      </span>
    </div>
  );
}

export default function ContactTab({ onMessageSent }: ContactTabProps) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [msgText, setMsgText] = useState('');
  const [errors, setErrors]   = useState<FormErrors>({});
  const [phase, setPhase]     = useState<TransmitPhase>('idle');
  const [statusLines, setStatusLines] = useState<StatusLine[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addLine = (type: LineType, text: string) => {
    setStatusLines(prev => [...prev, { id: Date.now() + Math.random(), type, text }]);
  };

  const schedule = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim())                      e.name    = 'SENDER_NAME cannot be empty.';
    if (!email.trim())                     e.email   = 'SENDER_EMAIL cannot be empty.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                           e.email   = 'Invalid email address format.';
    if (!msgText.trim())                   e.message = 'MESSAGE_PAYLOAD cannot be empty.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (phase === 'transmitting') return;

    setPhase('transmitting');
    setStatusLines([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Fire EmailJS immediately — we'll await the result at the end of the sequence
    const emailPromise = emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { from_name: name, from_email: email, message: msgText },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    schedule(0,    () => addLine('command', '> Initializing secure channel...'));
    schedule(450,  () => addLine('ok',      '✓ ECC-GCM session established'));
    schedule(750,  () => addLine('command', '> Encrypting payload...'));
    schedule(800,  () => addLine('bar',     ''));
    schedule(1500, () => addLine('command', '> Verifying message integrity...'));
    schedule(1900, () => addLine('ok',      '✓ Signature verified'));
    schedule(2150, () => addLine('command', '> Routing secure transmission...'));
    schedule(2200, () => addLine('bar',     ''));
    schedule(2900, () => addLine('pending', '> Awaiting acknowledgement...'));

    schedule(2900, () => {
      emailPromise
        .then(() => {
          addLine('ok', '✓ Delivery confirmed.');
          setPhase('success');
          onMessageSent('Secure transmission completed.');
          setName('');
          setEmail('');
          setMsgText('');
          setErrors({});
        })
        .catch(() => {
          addLine('error', '✗ Transmission failed.');
          setPhase('failed');
        });
    });
  };

  const isBusy = phase === 'transmitting';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Contact Form */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-term-border pb-2">
            <h2 className="text-term-green font-bold text-sm uppercase flex items-center gap-1.5 font-mono">
              <Terminal size={14} /> [ SECURE TRANSMISSION CHANNEL ]
            </h2>
            <span className="text-[10px] text-yellow-500 font-mono">ECC-GCM SECURED</span>
          </div>

          <form onSubmit={handleSendMessage} noValidate className="flex flex-col gap-3 text-xs text-term-lightgray">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[10px] text-term-green">SENDER_NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                  placeholder="Enter your name..."
                  disabled={isBusy || phase === 'success'}
                  className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green disabled:opacity-50"
                />
                {errors.name && <span className="text-red-400 text-[10px] font-mono">[-] {errors.name}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[10px] text-term-green">SENDER_EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                  placeholder="your.email@example.com..."
                  disabled={isBusy || phase === 'success'}
                  className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green disabled:opacity-50"
                />
                {errors.email && <span className="text-red-400 text-[10px] font-mono">[-] {errors.email}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] text-term-green">CIPHERTEXT_MESSAGE_PAYLOAD</label>
              <textarea
                value={msgText}
                onChange={(e) => { setMsgText(e.target.value); setErrors(prev => ({ ...prev, message: undefined })); }}
                placeholder="Type your message securely here..."
                rows={4}
                disabled={isBusy || phase === 'success'}
                className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green resize-none disabled:opacity-50"
              />
              {errors.message && <span className="text-red-400 text-[10px] font-mono">[-] {errors.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isBusy || phase === 'success'}
              className="mt-1 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors py-2 px-4 rounded flex items-center justify-between font-bold w-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <span>Establishing secure channel...</span>
                  <RefreshCw size={14} className="animate-spin" />
                </>
              ) : phase === 'success' ? (
                <>
                  <span>Transmission complete</span>
                  <CheckCircle size={14} />
                </>
              ) : (
                <>
                  <span>&gt; Initiate Handshake &amp; Transmit</span>
                  <Key size={14} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Transmission Status Panel */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-3">
          <div className="border-b border-term-border pb-1.5">
            <h3 className="text-term-lightgray font-bold text-xs uppercase flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} /> [ TRANSMISSION STATUS ]
            </h3>
          </div>

          <div className="flex-grow flex flex-col font-mono text-[10px] min-h-[200px]">
            {phase === 'idle' && (
              <div className="flex flex-col gap-2 h-full justify-center items-center text-center">
                <div className="text-term-gray text-[10px] italic">
                  Awaiting transmission...
                </div>
                <div className="text-term-gray/50 text-[9px]">
                  Fill the form and initiate handshake.
                </div>
              </div>
            )}

            {(phase === 'transmitting' || phase === 'success' || phase === 'failed') && (
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[260px] pr-1">
                {statusLines.map(line => (
                  <div key={line.id} className="log-entry">
                    {line.type === 'bar' ? (
                      <ProgressBar />
                    ) : (
                      <span className={
                        line.type === 'ok'      ? 'text-term-green font-bold' :
                        line.type === 'error'   ? 'text-red-400 font-bold' :
                        line.type === 'pending' ? 'text-term-lightgray/60 italic' :
                        'text-term-lightgray'
                      }>
                        {line.text}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {phase === 'success' && (
              <div className="mt-4 pt-3 border-t border-term-border/40 flex flex-col gap-1 text-[10px]">
                <span className="text-term-green font-bold">Transmission Complete.</span>
                <span className="text-term-lightgray">Secure message delivered successfully.</span>
                <span className="text-term-lightgray">Operator has been notified.</span>
                <span className="text-term-lightgray/60 mt-1">Thank you for reaching out.</span>
              </div>
            )}

            {phase === 'failed' && (
              <div className="mt-4 pt-3 border-t border-term-border/40 flex flex-col gap-1 text-[10px]">
                <span className="text-red-400 font-bold">Transmission Failed.</span>
                <span className="text-term-lightgray">Unable to establish secure delivery.</span>
                <span className="text-term-lightgray/60">Please retry in a few moments.</span>
                <button
                  onClick={() => { setPhase('idle'); setStatusLines([]); }}
                  className="mt-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-term-bg transition-colors px-3 py-1 rounded text-[10px] font-bold w-fit"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
