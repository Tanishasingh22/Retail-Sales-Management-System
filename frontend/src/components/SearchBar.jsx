import React, { useEffect, useState } from 'react';
export default function SearchBar({ value, onSearch }){
  const [v, setV] = useState(value || '');
  useEffect(()=>{
    const t = setTimeout(()=>{ onSearch(v); }, 300);
    return ()=> clearTimeout(t);
  }, [v]);
  function submit(e){
    e.preventDefault();
    onSearch(v);
  }
  return (
    <form className="searchBar" onSubmit={submit}>
      <input placeholder="Name, Phone no." value={v} onChange={e=> setV(e.target.value)} />
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  )
}
