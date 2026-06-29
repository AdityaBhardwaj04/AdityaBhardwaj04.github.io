import React, { useState } from 'react';
import { Send, Key, ShieldAlert, CheckCircle, RefreshCw, Terminal, Inbox, Trash2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  hash: string;
}

interface ContactTabProps {
  onMessageSent: (message: string) => void;
}

export default function ContactTab({ onMessageSent }: ContactTabProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [msgText, setMsgText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendingLogs, setSendingLogs] = useState<string[]>([]);
  const [localMessages, setLocalMessages] = useState<ContactMessage[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msgText) return;

    setIsSending(true);
    setSendingLogs([
      `root@aditya:~# python3 contact_agent.py --target aditya --sender "${name}"`,
      `[i] Initializing secure channel handshake with core server...`,
    ]);

    // Animate secure handshake
    setTimeout(() => {
      setSendingLogs(prev => [
        ...prev,
        `[i] Exchanging DH keys (Curve25519) - Shared secret established.`,
        `[i] Encrypting message body with AES-256-GCM (Nonce: ${Math.random().toString(16).slice(2, 10)})...`,
      ]);

      setTimeout(() => {
        const mockHash = 'SHA256-' + Math.random().toString(16).slice(2, 10).toUpperCase();
        const newMessage: ContactMessage = {
          id: Date.now().toString(),
          name,
          email,
          message: msgText,
          timestamp: new Date().toLocaleTimeString(),
          hash: mockHash
        };

        setLocalMessages(prev => [newMessage, ...prev]);
        setSendingLogs(prev => [
          ...prev,
          `[+] Packet dispatch completed. Block size: ${msgText.length} bytes.`,
          `[+] Verification checksum match: ${mockHash}`,
          `[+] SUCCESS: Message safely pushed to secure queue!`
        ]);
        
        onMessageSent(`Message from ${name} successfully transmitted over AES secure channel.`);
        setIsSending(false);
        
        // Reset fields
        setName('');
        setEmail('');
        setMsgText('');
      }, 1500);
    }, 1000);
  };

  const handleClearInbox = () => {
    setLocalMessages([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Contact Form Terminal */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-term-border pb-2">
            <h2 className="text-term-green font-bold text-sm uppercase flex items-center gap-1.5 font-mono">
              <Terminal size={14} /> [ SECURE TRANSMISSION CHANNEL ]
            </h2>
            <span className="text-[10px] text-yellow-500 font-mono">ECC-GCM SECURED</span>
          </div>

          <form onSubmit={handleSendMessage} className="flex flex-col gap-3 text-xs text-term-lightgray">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[10px] text-term-green">SENDER_NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  required
                  disabled={isSending}
                  className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[10px] text-term-green">SENDER_EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com..."
                  required
                  disabled={isSending}
                  className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] text-term-green">CIPHERTEXT_MESSAGE_PAYLOAD</label>
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Type your message securely here..."
                required
                rows={4}
                disabled={isSending}
                className="bg-term-bg border border-term-border text-term-green p-2 rounded focus:outline-none focus:border-term-green resize-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="mt-1 border border-term-green text-term-green hover:bg-term-green hover:text-term-bg transition-colors py-2 px-4 rounded flex items-center justify-between font-bold w-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <span>Exchanging keys &amp; dispatching packets...</span>
                  <RefreshCw size={14} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>&gt; Initiate Handshake &amp; Transmit</span>
                  <Key size={14} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Secure Transmission Logs */}
          {sendingLogs.length > 0 && (
            <div className="bg-term-bg border border-term-border rounded p-3 font-mono text-[10px] flex flex-col justify-end mt-2 min-h-[100px]">
              <div className="text-term-lightgray/50 mb-1.5 border-b border-term-border/30 pb-0.5 text-[9px] uppercase tracking-wider">
                TRANSMITTER STDOUT
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px]">
                {sendingLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('[+]')
                        ? 'text-term-green font-bold'
                        : log.startsWith('root@')
                        ? 'text-yellow-400 font-bold'
                        : 'text-term-lightgray'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local Received Messages Side Panel */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <div className="border border-term-border p-4 rounded bg-term-bg/50 flex-grow flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-term-border pb-1.5">
            <h3 className="text-term-lightgray font-bold text-xs uppercase flex items-center gap-1.5 font-mono">
              <Inbox size={14} /> [ DISPATCHED QUEUE ]
            </h3>
            {localMessages.length > 0 && (
              <button
                onClick={handleClearInbox}
                className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 size={10} /> Clear
              </button>
            )}
          </div>

          <p className="text-[10px] text-term-lightgray leading-relaxed mb-1">
            Sent transmissions are encrypted locally and added to your outbox queue for testing.
          </p>

          <div className="overflow-y-auto max-h-[290px] space-y-2 flex-grow pr-1">
            {localMessages.length === 0 ? (
              <div className="text-term-gray italic text-center py-10 text-xs border border-dashed border-term-border/40 rounded flex flex-col items-center justify-center gap-2">
                <ShieldAlert size={20} />
                <span>Queue is currently empty.</span>
              </div>
            ) : (
              localMessages.map((msg) => (
                <div key={msg.id} className="border border-term-border rounded p-2.5 bg-term-bg text-[11px] flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] border-b border-term-border/30 pb-1">
                    <span className="text-term-green font-bold">{msg.name}</span>
                    <span className="text-term-gray">{msg.timestamp}</span>
                  </div>
                  <div className="text-term-gray text-[9px] font-mono select-all">
                    BLOCK_ID: <span className="text-yellow-500">{msg.hash}</span>
                  </div>
                  <p className="text-term-lightgray leading-relaxed italic break-all mt-1">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
