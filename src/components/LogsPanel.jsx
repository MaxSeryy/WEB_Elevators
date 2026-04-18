import React from 'react';

export default function LogsPanel({ logs }) {
  return (
    <section className="mb-12">
      <h2 className="brand-normal mb-6 mt-6">Журнал подій</h2>
      <div className="bg-slate-300 dark:bg-slate-800 rounded-3xl p-6 logs-container-scroll shadow-sm" id="logs-container">
        {logs.length === 0 ? (
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">Логи подій будуть тут</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="log-entry">
              <span className="log-timestamp">{log.time}</span>
              <span className={`log-${log.type}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
