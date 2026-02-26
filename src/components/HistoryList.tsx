import type { Record } from '../types';

interface Props {
  records: Record[];
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export default function HistoryList({ records, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="card empty-state">
        <p>まだ記録がありません。</p>
        <p>「＋ 記録」タブから最初の記録を追加しましょう！</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm('この記録を削除しますか？')) {
      onDelete(id);
    }
  };

  return (
    <div className="card">
      <h2>履歴 <span className="count-badge">{records.length}件</span></h2>
      <ul className="record-list">
        {records.map((r) => (
          <li key={r.id} className="record-item">
            <div className="record-info">
              <span className="record-date">{formatDate(r.date)}</span>
              {r.time && <span className="record-time">🕐 {r.time}</span>}
              {r.notes && <p className="record-notes">📝 {r.notes}</p>}
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(r.id)}
              aria-label="削除"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
