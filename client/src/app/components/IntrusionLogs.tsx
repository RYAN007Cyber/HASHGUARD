'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';

export default function IntrusionLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/logs/intrusion');
      if (!res.ok) throw new Error(await res.json().then(data => data.error));
      const result = await res.json();
      setLogs(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("logs", logs);
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-lg shadow p-6 text-red-600">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <h2 className="text-xl font-semibold">Error Loading Logs</h2>
      </div>
      <p className="mt-2">{error}</p>
      <button 
        onClick={fetchLogs}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <FaSync className="mr-2" /> Retry
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FaExclamationTriangle className="mr-2 text-yellow-500" />
          Intrusion Attempts
        </h2>
        <button
          onClick={fetchLogs}
          className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaSync className="mr-1" /> Refresh
        </button>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="border-l-4 border-yellow-400 pl-4 py-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{log.event}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                {log.details}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No intrusion attempts detected</p>
      )}
    </div>
  );
}