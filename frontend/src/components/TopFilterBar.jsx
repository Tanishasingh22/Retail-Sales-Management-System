import React from 'react'

export default function TopFilterBar({ query, onChange }){
  function setArray(k, v){ onChange({ [k]: v ? [v] : [] }); }
  function setVal(k, v){ onChange({ [k]: v }); }

  return (
    <div className="topFilters twoRows">
      <div className="row">
        <div className="pill">
        <span>Customer Region</span>
        <select value={query.regions[0] || ''} onChange={e=> setArray('regions', e.target.value)}>
          <option value="">All</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
          <option>Central</option>
        </select>
        </div>
        <div className="pill">
        <span>Gender</span>
        <select value={query.genders[0] || ''} onChange={e=> setArray('genders', e.target.value)}>
          <option value="">All</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        </div>
        <div className="pill">
        <span>Age Range</span>
        <input type="number" placeholder="Min" value={query.ageMin} onChange={e=> setVal('ageMin', e.target.value)} />
        <input type="number" placeholder="Max" value={query.ageMax} onChange={e=> setVal('ageMax', e.target.value)} />
        </div>
        <div className="pill">
        <span>Product Category</span>
        <select value={query.categories[0] || ''} onChange={e=> setArray('categories', e.target.value)}>
          <option value="">All</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Beauty</option>
        </select>
        </div>
        <div className="pill">
        <span>Tags</span>
        <input placeholder="e.g. wireless" value={query.tags[0] || ''} onChange={e=> setArray('tags', e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="pill">
        <span>Payment Method</span>
        <select value={query.payments[0] || ''} onChange={e=> setArray('payments', e.target.value)}>
          <option value="">All</option>
          <option>UPI</option>
          <option>Wallet</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
          <option>Cash</option>
        </select>
        </div>
        <div className="pill">
        <span>Date</span>
        <input type="date" value={query.dateFrom} onChange={e=> setVal('dateFrom', e.target.value)} />
        <span style={{opacity:.6}}>-</span>
        <input type="date" value={query.dateTo} onChange={e=> setVal('dateTo', e.target.value)} />
        </div>
        <div className="pill">
        <span>Sort by</span>
        <select value={query.sortBy} onChange={e=> setVal('sortBy', e.target.value)}>
          <option>Date</option>
          <option>Quantity</option>
          <option>Customer Name</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={()=> onChange({ sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc' })}>
          {query.sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>
        </div>
        <div className="pill">
        <button className="btn btn-outline btn-sm" onClick={(e)=>{ e.preventDefault(); onChange({
          search:'', regions:[], genders:[], categories:[], tags:[], payments:[],
          ageMin:'', ageMax:'', dateFrom:'', dateTo:'', page:1
        })}}>Clear</button>
        </div>
      </div>
    </div>
  )
}
