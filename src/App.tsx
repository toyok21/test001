import { useState, useEffect } from 'react';
import type { Record } from './types';
import { loadRecords, addRecord, deleteRecord } from './storage';
import RecordForm from './components/RecordForm';
import HistoryList from './components/HistoryList';
import Statistics from './components/Statistics';
import './App.css';

type Tab = 'record' | 'history' | 'stats';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [tab, setTab] = useState<Tab>('record');

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const handleAdd = (record: Record) => {
    setRecords(addRecord(record));
    setTab('history');
  };

  const handleDelete = (id: string) => {
    setRecords(deleteRecord(id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>❤️ 親密度ログ</h1>
        <p className="subtitle">記録・統計管理アプリ</p>
      </header>

      <nav className="tab-nav">
        <button
          className={tab === 'record' ? 'active' : ''}
          onClick={() => setTab('record')}
        >
          ＋ 記録
        </button>
        <button
          className={tab === 'history' ? 'active' : ''}
          onClick={() => setTab('history')}
        >
          📋 履歴
        </button>
        <button
          className={tab === 'stats' ? 'active' : ''}
          onClick={() => setTab('stats')}
        >
          📊 統計
        </button>
      </nav>

      <main className="app-main">
        {tab === 'record' && <RecordForm onAdd={handleAdd} />}
        {tab === 'history' && (
          <HistoryList records={records} onDelete={handleDelete} />
        )}
        {tab === 'stats' && <Statistics records={records} />}
      </main>
    </div>
  );
}

export default App;
