import type { Record } from '../types';

interface Props {
  records: Record[];
}

interface MonthStat {
  label: string;
  count: number;
}

function getMonthlyStats(records: Record[]): MonthStat[] {
  const map: { [key: string]: number } = {};
  for (const r of records) {
    const ym = r.date.slice(0, 7); // "YYYY-MM"
    map[ym] = (map[ym] || 0) + 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([ym, count]) => {
      const [year, month] = ym.split('-');
      return { label: `${year}年${parseInt(month)}月`, count };
    });
}

function getYearlyStats(records: Record[]): { year: string; count: number }[] {
  const map: { [key: string]: number } = {};
  for (const r of records) {
    const year = r.date.slice(0, 4);
    map[year] = (map[year] || 0) + 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, count]) => ({ year: `${year}年`, count }));
}

function getStreak(records: Record[]): number {
  if (records.length === 0) return 0;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = new Date(today);
  for (const r of sorted) {
    const rDate = new Date(r.date + 'T00:00:00');
    const diff = Math.round(
      (current.getTime() - rDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0 || diff === 1) {
      streak++;
      current = rDate;
    } else {
      break;
    }
  }
  return streak;
}

export default function Statistics({ records }: Props) {
  if (records.length === 0) {
    return (
      <div className="card empty-state">
        <p>まだ記録がありません。</p>
        <p>記録を追加すると統計が表示されます。</p>
      </div>
    );
  }

  const monthlyStats = getMonthlyStats(records);
  const yearlyStats = getYearlyStats(records);
  const maxMonthly = Math.max(...monthlyStats.map((s) => s.count), 1);
  const streak = getStreak(records);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount =
    records.filter((r) => r.date.startsWith(thisMonth)).length;

  const thisYear = new Date().getFullYear().toString();
  const thisYearCount =
    records.filter((r) => r.date.startsWith(thisYear)).length;

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{records.length}</span>
          <span className="stat-label">累計</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{thisMonthCount}</span>
          <span className="stat-label">今月</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{thisYearCount}</span>
          <span className="stat-label">今年</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{streak}</span>
          <span className="stat-label">連続日数</span>
        </div>
      </div>

      <div className="card">
        <h2>月別統計（直近12ヶ月）</h2>
        <div className="bar-chart">
          {monthlyStats.map((s) => (
            <div key={s.label} className="bar-row">
              <span className="bar-label">{s.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(s.count / maxMonthly) * 100}%` }}
                />
              </div>
              <span className="bar-value">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>年別統計</h2>
        <table className="stats-table">
          <thead>
            <tr>
              <th>年</th>
              <th>回数</th>
            </tr>
          </thead>
          <tbody>
            {yearlyStats.map((s) => (
              <tr key={s.year}>
                <td>{s.year}</td>
                <td>{s.count}回</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
