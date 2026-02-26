import { useState } from 'react';
import type { Record } from '../types';

interface Props {
  onAdd: (record: Record) => void;
}

export default function RecordForm({ onAdd }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: Record = {
      id: crypto.randomUUID(),
      date,
      time: time || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    onAdd(record);
    setTime('');
    setNotes('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="card">
      <h2>新しい記録を追加</h2>
      {submitted && <p className="success-msg">✅ 記録しました！</p>}
      <form onSubmit={handleSubmit} className="record-form">
        <div className="form-group">
          <label htmlFor="date">日付</label>
          <input
            id="date"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">時刻（任意）</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">メモ（任意）</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="自由にメモを入力..."
            rows={3}
            maxLength={200}
          />
          <small>{notes.length}/200</small>
        </div>

        <button type="submit" className="btn-primary">
          記録する
        </button>
      </form>
    </div>
  );
}
