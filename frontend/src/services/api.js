// frontend/src/services/api.js

import axios from 'axios';

// Backend base URL
const API = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Converts frontend query object into URL params
function serialize(query) {
  const q = {};

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // Convert arrays → comma-separated strings
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      q[key] = value.join(',');
      return;
    }

    // Normal value
    q[key] = value;
  });

  return new URLSearchParams(q).toString();
}

// Fetch sales
async function getSales(query = {}) {
  const params = serialize(query);
  const res = await API.get(`/sales?${params}`);
  return res.data; // { total, items, page, ... }
}

export default { getSales };
