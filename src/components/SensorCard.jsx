import React from 'react';

export default function SensorCard({ label, value, unit, isDanger = false }) {
  return (
    <article className="card">
      <h3 className="brand-normal text-xl mb-2">{label}</h3>
      <p className={`text-3xl font-semibold ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-brand-accent'}`}>
        {value} {unit}
      </p>
    </article>
  );
}
