import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import SummaryBar from './components/SummaryBar';
import LeftNav from './components/LeftNav';
import TopFilterBar from './components/TopFilterBar';
import TransactionTable from './components/TransactionTable';

export default function App() {
  const [query, setQuery] = useState({
    search: '',
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    payments: [],
    ageMin: '',
    ageMax: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'Date',
    sortOrder: 'desc',
    page: 1
  });

  const [data, setData] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch data whenever the query changes
  useEffect(() => {
    fetchData();
  }, [query]);

  // Fetch sales from API and normalize response
  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.getSales(query);

      setData({
        items: res.items || [],
        page: res.page || 1,
        totalPages: res.totalPages || 1,
        total: res.total || 0
      });
    } catch (e) {
      console.error('Error fetching sales:', e);
      setData({ items: [], page: 1, totalPages: 1, total: 0 });
    }
    finally { setLoading(false); }
  }

  // Update query with new values and reset page if not explicitly set
  function updateQuery(changes) {
    setQuery(prev => ({
      ...prev,
      ...changes,
      page: changes.page !== undefined ? changes.page : 1
    }));
  }

  return (
    <div className="container">
      <div className="toolbar">
        <h1>Sales Management</h1>
        <div style={{flex:1}} />
        <SearchBar
          value={query.search}
          onSearch={v => updateQuery({ search: v })}
        />
      </div>

      <div className="mainGrid">
        <LeftNav />

        <div className="content">
          <TopFilterBar query={query} onChange={updateQuery} />
          <SummaryBar total={data.total} page={data.page} totalPages={data.totalPages} />
          <div className="controls">
            <label>
              Sort:
              <select
                value={query.sortBy}
                onChange={e => updateQuery({ sortBy: e.target.value })}
              >
                <option value="Date">Date (Newest First)</option>
                <option value="Quantity">Quantity</option>
                <option value="Customer Name">Customer Name (A–Z)</option>
              </select>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  updateQuery({
                    sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc'
                  })
                }
              >
                {query.sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </label>
          </div>

          <TransactionTable
            data={data}
            onPageChange={p => updateQuery({ page: p })}
            refresh={fetchData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
