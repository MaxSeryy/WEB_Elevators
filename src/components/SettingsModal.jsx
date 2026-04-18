import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    setForm(settings);
    setMessage('');
  }, [settings, isOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    if (form.maxFloor < 2 || form.maxFloor > 20) {
      setMessage('Максимальний поверх має бути між 2 та 20.');
      setMessageType('error');
      return;
    }

    if (form.updateInterval < 500 || form.updateInterval > 5000) {
      setMessage('Інтервал має бути від 500 до 5000 мс.');
      setMessageType('error');
      return;
    }

    onSave(form);
    setMessage('Налаштування збережено.');
    setMessageType('success');
  }

  return (
    <div className={`settings-modal ${isOpen ? 'open' : ''}`} aria-hidden={isOpen ? 'false' : 'true'}>
      <div className="settings-modal-backdrop" onClick={onClose} />
      <div className="settings-modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="brand-normal">Налаштування</h2>
          <button
            className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-400 dark:hover:bg-slate-600 transition duration-300"
            aria-label="Закрити"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="device-name" className="brand-small block mb-2">Назва системи:</label>
            <input
              id="device-name"
              type="text"
              value={form.deviceName}
              onChange={(event) => setForm((prev) => ({ ...prev, deviceName: event.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-300 border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="max-floor" className="brand-small block mb-2">Максимальний поверх:</label>
            <input
              id="max-floor"
              type="number"
              min="2"
              max="20"
              value={form.maxFloor}
              onChange={(event) => setForm((prev) => ({ ...prev, maxFloor: Number(event.target.value) }))}
              className="w-full px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="update-interval" className="brand-small block mb-2">Інтервал оновлення (мс):</label>
            <input
              id="update-interval"
              type="number"
              min="500"
              max="5000"
              step="100"
              value={form.updateInterval}
              onChange={(event) => setForm((prev) => ({ ...prev, updateInterval: Number(event.target.value) }))}
              className="w-full px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-400 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {message ? (
            <div className={`text-center brand-small ${messageType === 'success' ? 'settings-success' : 'settings-error'}`}>
              {message}
            </div>
          ) : null}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Зберегти
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-slate-400 dark:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-500 transition font-medium"
              onClick={onClose}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
