import React, { useState, useEffect } from 'react';
import { Terminal, Github, Trophy, Shield, Award, Server } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  category: string;
  status: string;
  error: string | null;
}

interface SentinelData {
  status: string;
  automation: string;
  version: string;
  providers: Provider[];
}

interface ActivityEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  priority: number;
  source: string;
  icon: string;
  url: string | null;
}

interface Envelope<T> {
  schemaVersion: number;
  generatedAt: string;
  data: T;
}

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  terminal: Terminal,
  github: Github,
  trophy: Trophy,
  shield: Shield,
  certificate: Award,
  server: Server,
};

// Human-readable timestamp for the log date column.
// Recent events get relative format; older events get DD MMM [YY] format.
function logDate(dateStr: string): string {
  const base = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00Z`;
  const diffMs  = Date.now() - new Date(base).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr  = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin  < 1)  return 'now';
  if (diffMin  < 60) return `${diffMin}m ago`;
  if (diffHr   < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay  <  7) return `${diffDay}d ago`;

  const d = new Date(base);
  const dd  = d.getUTCDate().toString().padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const yr  = d.getUTCFullYear();
  const currentYear = new Date().getFullYear();
  return yr === currentYear ? `${dd} ${mon}` : `${dd} ${mon} ${String(yr).slice(-2)}`;
}


export default function SentinelStatus() {
  const [sentinel, setSentinel]   = useState<SentinelData | null>(null);
  const [activity, setActivity]   = useState<ActivityEvent[]>([]);
  const [loading,  setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/sentinel.json').then(r => r.json() as Promise<Envelope<SentinelData>>),
      fetch('/data/activity.json').then(r => r.json() as Promise<Envelope<ActivityEvent[]>>),
    ])
      .then(([sentEnv, actEnv]) => {
        if (sentEnv?.data && typeof sentEnv.data === 'object') {
          setSentinel(sentEnv.data as SentinelData);
        }
        if (Array.isArray(actEnv?.data)) {
          setActivity(actEnv.data as ActivityEvent[]);
        }
      })
      .catch(() => { /* leave sentinel null → Initializing... */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel flex flex-col gap-3">
      <h2 className="text-term-lightgray text-xs font-bold uppercase tracking-wider">
        [ BLACKBOX SENTINEL ]
      </h2>

      {loading || !sentinel ? (
        <p className="text-term-lightgray text-xs font-mono italic">Initializing...</p>
      ) : (
        <>
          {/* ── RECENT OPERATIONS (primary) ─────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <span className="text-term-lightgray text-[10px] font-bold uppercase tracking-wider">
              [ Recent Operations ]
            </span>

            <div className="overflow-y-auto max-h-[160px] flex flex-col pr-0.5">
              {activity.length === 0 ? (
                <span className="text-term-lightgray/50 text-[10px] font-mono italic py-1">
                  No operations recorded.
                </span>
              ) : (
                activity.map(event => {
                  const Icon = ICON_COMPONENTS[event.icon] ?? Terminal;
                  const row = (
                    <div className="flex items-start gap-2 py-1.5 border-b border-term-border/20 last:border-0">
                      <span className="w-[62px] flex-shrink-0 text-[10px] font-mono text-term-lightgray/50 leading-tight pt-px">
                        {logDate(event.date)}
                      </span>
                      <div className="flex items-start gap-1.5 min-w-0 flex-1">
                        <Icon size={9} className="flex-shrink-0 mt-[2px] text-term-green" />
                        <span className="text-[10px] text-term-lightgray leading-tight break-words min-w-0">
                          {event.title}
                        </span>
                      </div>
                    </div>
                  );

                  return event.url ? (
                    <a
                      key={event.id}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-term-darkgreen/30 -mx-1 px-1 rounded transition-colors"
                    >
                      {row}
                    </a>
                  ) : (
                    <div key={event.id}>{row}</div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── SENTINEL STATUS (supporting) ────────────────────── */}
          <div className="flex flex-col gap-2 pt-2 border-t border-term-border/60">
            <span className="text-term-lightgray text-[10px] font-bold uppercase tracking-wider">
              [ Sentinel Status ]
            </span>

            {(sentinel.providers ?? []).map(provider => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    provider.status === 'ONLINE'
                      ? 'bg-term-green shadow-[0_0_4px_#00FF41] animate-pulse'
                      : provider.status === 'DEGRADED'
                      ? 'bg-yellow-400'
                      : 'bg-red-500/70'
                  }`} />
                  <span className="text-term-lightgray text-[10px]">{provider.name}</span>
                </div>
                <span className={`text-[10px] font-bold font-mono ${
                  provider.status === 'ONLINE'   ? 'text-term-green'  :
                  provider.status === 'DEGRADED' ? 'text-yellow-400'  :
                  'text-red-400'
                }`}>{provider.status}</span>
              </div>
            ))}

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px] mt-1 pt-1.5 border-t border-term-border/40">
              <span className="text-term-lightgray/60">Automation</span>
              <span className="text-term-lightgray">{sentinel.automation}</span>
              <span className="text-term-lightgray/60">Version</span>
              <span className="text-term-green font-mono">v{sentinel.version}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
