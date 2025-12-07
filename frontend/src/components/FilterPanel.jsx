import React from 'react';
// Multi-select via comma-separated input for simplicity. Tags are RAW string matching.
export default function FilterPanel({ query, onChange }){
  function handleChange(k, e){
    const val = e.target.value;
    if(['regions','genders','categories','tags','payments'].includes(k)){
      onChange({ [k]: val.split(',').map(s=>s.trim()).filter(s=>s) });
    } else {
      onChange({ [k]: val });
    }
  }
  return (
    <aside className="filters">
      <h3>Filters</h3>
      <label>Regions (comma separated)
        <input value={query.regions.join(',')} onChange={e=> handleChange('regions', e)} />
      </label>
      <label>Genders (comma separated)
        <input value={query.genders.join(',')} onChange={e=> handleChange('genders', e)} />
      </label>
      <label>Categories (comma separated)
        <input value={query.categories.join(',')} onChange={e=> handleChange('categories', e)} />
      </label>
      <label>Tags (comma separated)  (RAW string matching)
        <input value={query.tags.join(',')} onChange={e=> handleChange('tags', e)} />
      </label>
      <label>Payment Methods (comma separated)
        <input value={query.payments.join(',')} onChange={e=> handleChange('payments', e)} />
      </label>
      <label>Age Min
        <input type="number" value={query.ageMin} onChange={e=> handleChange('ageMin', e)} />
      </label>
      <label>Age Max
        <input type="number" value={query.ageMax} onChange={e=> handleChange('ageMax', e)} />
      </label>
      <label>Date From
        <input type="date" value={query.dateFrom} onChange={e=> handleChange('dateFrom', e)} />
      </label>
      <label>Date To
        <input type="date" value={query.dateTo} onChange={e=> handleChange('dateTo', e)} />
      </label>
      <div style={{marginTop:10}}>
        <button className="btn btn-outline" onClick={(e)=>{ e.preventDefault(); onChange({
          search:'', regions:[], genders:[], categories:[], tags:[], payments:[],
          ageMin:'', ageMax:'', dateFrom:'', dateTo:'', page:1
        })}}>Reset Filters</button>
      </div>
    </aside>
  )
}
