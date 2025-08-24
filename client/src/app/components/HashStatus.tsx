'use client';

import { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaUpload, FaSync } from 'react-icons/fa';

export default function HashStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStoring, setIsStoring] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hash');
      if (!res.ok) throw new Error(await res.json().then(data => data.error));
      const result = await res.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const storeHash = async () => {
    try {
      setIsStoring(true);
      const res = await fetch('/api/hash/store', { method: 'POST' });
      if (!res.ok) throw new Error(await res.json().then(data => data.error));
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStoring(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-lg shadow p-6 text-red-600">
      <div className="flex items-center">
        <FaTimesCircle className="mr-2" />
        <h2 className="text-xl font-semibold">Error Loading Data</h2>
      </div>
      <p className="mt-2">{error}</p>
      <button 
        onClick={fetchData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <FaSync className="mr-2" /> Retry
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FaShieldAlt className="mr-2 text-blue-500" />
          System Integrity Status
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaSync className="mr-1" /> Refresh
          </button>
          <button
            onClick={storeHash}
            disabled={isStoring}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            <FaUpload className="mr-1" /> {isStoring ? 'Storing...' : 'Store Hash'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <span className="font-medium mr-2 mt-1">Current Hash:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all flex-1">
            {data?.currentHash || 'Not available'}
          </code>
        </div>
        
        <div className="flex items-start">
          <span className="font-medium mr-2 mt-1">Stored Hash:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all flex-1">
            {data?.storedHash || 'None'}
          </code>
        </div>
        
        <div className={`flex items-center text-lg ${data?.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {data?.isValid ? (
            <>
              <FaCheckCircle className="mr-2" />
              <span>System integrity verified</span>
            </>
          ) : (
            <>
              <FaTimesCircle className="mr-2" />
              <span>Integrity violation detected!</span>
            </>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          Last checked: {new Date(data?.lastChecked).toLocaleString()}
        </div>
      </div>
    </div>
  );
}