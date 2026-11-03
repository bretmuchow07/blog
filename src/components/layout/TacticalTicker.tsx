import React from 'react';

export default function TacticalTicker() {
  const tickerItems = [
    { label: 'STATUS', value: 'ONLINE // ESSAYS, NOTES & IDEAS', alert: true },
    { label: 'TARGET SUBDOMAIN', value: 'BLOG.BRETMUCHONI.DEV', alert: false },
    { label: 'SPECTRUM', value: 'ENGINEERING • DESIGN • CULTURE • IDEAS • ESSAYS • LIFE', alert: false },
    { label: 'FEED', value: 'ZERO TRACKERS // ZERO BLOAT // PURE SEMANTIC WRITING', alert: true },
    { label: 'AUTHOR', value: 'BRET MUCHONI // PERSONAL PUBLICATION', alert: false },
  ];

  return (
    <div className="w-full bg-[var(--panel-black)] border-b-2 border-[var(--panel-border-color)] overflow-hidden select-none">
      <div className="caution-strip" />
      <div className="py-1.5 overflow-hidden whitespace-nowrap">
        <div className="ticker-track flex items-center font-mono text-xs">
          {/* Double array for infinite seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="inline-flex items-center gap-2 mx-4 text-[var(--paper)]">
                {item.alert ? (
                  <span className="text-[var(--magenta)] font-bold font-pixel">
                    [{item.label}]
                  </span>
                ) : (
                  <span className="text-[var(--cyan)] font-semibold">
                    {item.label}:
                  </span>
                )}
                <span className="text-[var(--paper)] opacity-90">{item.value}</span>
              </span>
              <span className="text-[var(--muted-label)]">//</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="caution-strip" />
    </div>
  );
}
