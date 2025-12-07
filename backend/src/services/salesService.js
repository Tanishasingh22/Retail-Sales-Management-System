const fs = require('fs');
const readline = require('readline');
const path = require('path');

const jsonlPath = path.join(__dirname, '..', '..', 'data', 'sales.jsonl');

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
function parseList(x) {
  if (!x) return [];
  return String(x).split(',').map(s => s.trim()).filter(s => s);
}
function toNumber(v) {
  if (!v) return null;
  const n = Number(String(v).replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

let cache = null;
let loading = null;
const filterCache = new Map();
const MAX_FILTER_CACHE = 100;
const trigramIndex = new Map();
const bigramIndex = new Map();

function trigrams(s) {
  const out = [];
  if (!s) return out;
  const str = String(s).toLowerCase();
  if (str.length < 3) return out;
  for (let i = 0; i <= str.length - 3; i++) out.push(str.slice(i, i + 3));
  return out;
}
function bigrams(s) {
  const out = [];
  if (!s) return out;
  const str = String(s).toLowerCase();
  if (str.length < 2) return out;
  for (let i = 0; i <= str.length - 2; i++) out.push(str.slice(i, i + 2));
  return out;
}

async function loadAll() {
  if (cache) return cache;
  if (loading) return loading;
  loading = new Promise(async (resolve) => {
    const rows = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(jsonlPath),
      crlfDelay: Infinity
    });
    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        const row = JSON.parse(line);
        row.__name = String(row['Customer Name'] || '').toLowerCase();
        row.__phone = String(row['Phone Number'] || '').toLowerCase();
        const d = parseDate(row['Date']);
        row.__dateTs = d ? d.getTime() : 0;
        row.__qty = toNumber(row['Quantity']) || 0;

        const keys = new Set([
          ...trigrams(row.__name),
          ...trigrams(row.__phone)
        ]);
        for (const key of keys) {
          let list = trigramIndex.get(key);
          if (!list) {
            list = [];
            trigramIndex.set(key, list);
          }
          list.push(row);
        }
        const keys2 = new Set([
          ...bigrams(row.__name),
          ...bigrams(row.__phone)
        ]);
        for (const key of keys2) {
          let list = bigramIndex.get(key);
          if (!list) {
            list = [];
            bigramIndex.set(key, list);
          }
          list.push(row);
        }
        rows.push(row);
      } catch {}
    }
    cache = rows;
    loading = null;
    resolve(cache);
  });
  return loading;
}

// Search and filter match
function rowMatches(row, q) {
  const search = q.search?.toLowerCase() || '';

  if (search) {
    const name = row.__name || '';
    const phone = row.__phone || '';
    if (!name.includes(search) && !phone.includes(search)) return false;
  }

  const regions = parseList(q.regions);
  if (regions.length && !regions.includes(row['Customer Region'])) return false;

  const genders = parseList(q.genders);
  if (genders.length && !genders.includes(row['Gender'])) return false;

  const categories = parseList(q.categories);
  if (categories.length &&
      !categories.includes(row['Product Category'])) return false;

  const tags = parseList(q.tags);
  if (tags.length && !tags.includes(row['Tags'])) return false;

  const payments = parseList(q.payments);
  if (payments.length && !payments.includes(row['Payment Method'])) return false;

  const ageMin = q.ageMin ? Number(q.ageMin) : null;
  const ageMax = q.ageMax ? Number(q.ageMax) : null;
  const age = toNumber(row['Age']);

  if (age !== null) {
    if (ageMin !== null && age < ageMin) return false;
    if (ageMax !== null && age > ageMax) return false;
  }

  const date = parseDate(row['Date']);
  const dateFrom = parseDate(q.dateFrom);
  const dateTo = parseDate(q.dateTo);

  if (dateFrom && (!date || date < dateFrom)) return false;
  if (dateTo && (!date || date > dateTo)) return false;

  return true;
}

async function querySales(q) {
  const data = await loadAll();
  const key = JSON.stringify({
    search: q.search || '',
    regions: q.regions || '',
    genders: q.genders || '',
    categories: q.categories || '',
    tags: q.tags || '',
    payments: q.payments || '',
    ageMin: q.ageMin || '',
    ageMax: q.ageMax || '',
    dateFrom: q.dateFrom || '',
    dateTo: q.dateTo || ''
  });

  let base = filterCache.get(key);
  if (!base) {
    let candidates = data;
    const s = (q.search || '').toLowerCase();
    if (s && s.length >= 2) {
      const parts = s.length >= 3 ? trigrams(s) : bigrams(s);
      if (parts.length) {
        let current = null;
        for (const p of parts) {
          const list = (s.length >= 3 ? trigramIndex : bigramIndex).get(p);
          if (!list) { current = []; break; }
          if (current === null) {
            current = new Set(list);
          } else {
            const next = new Set();
            for (const r of list) if (current.has(r)) next.add(r);
            current = next;
          }
        }
        candidates = current ? Array.from(current) : [];
      }
    }
    const filtered = [];
    for (const row of candidates) {
      if (rowMatches(row, q)) filtered.push(row);
    }
    // LRU update
    filterCache.set(key, filtered);
    if (filterCache.size > MAX_FILTER_CACHE) {
      const firstKey = filterCache.keys().next().value;
      filterCache.delete(firstKey);
    }
    base = filtered;
  } else {
    // Move key to the end to update recency
    filterCache.delete(key);
    filterCache.set(key, base);
  }

  const results = base.slice();
  const total = base.length;

  // Sorting
  const sortBy = q.sortBy || 'Date';
  const sortOrder = q.sortOrder === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    if (sortBy === 'Date') {
      return (a.__dateTs - b.__dateTs) * sortOrder;
    }
    if (sortBy === 'Quantity') {
      return (a.__qty - b.__qty) * sortOrder;
    }
    if (sortBy === 'Customer Name') {
      return String(a['Customer Name']).localeCompare(
             String(b['Customer Name'])) * sortOrder;
    }
    return 0;
  });

  // Pagination
  const page = q.page ? Number(q.page) : 1;
  const pageSize = 10;

  const paginated = results.slice((page - 1) * pageSize, page * pageSize);

  return {
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    pageSize,
    items: paginated
  };
}

async function warmup() { await loadAll(); }

module.exports = { querySales, warmup };
