import React from 'react';
export default function TransactionTable({ data, onPageChange, refresh, loading }){
  const items = data.items || [];
  if (loading) {
    return <div>Loading...</div>
  }
  if(items.length === 0){
    return <div>No results found.</div>
  }
  return (
    <div>
      <table className="table sticky">
        <thead>
          <tr>
            <th>Date</th><th>Customer</th><th>Phone</th><th>Category</th><th>Product</th><th>Qty</th><th>Final Amount</th><th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx)=>(
            <tr key={idx}>
              <td>{it['Date'] || it.date || ''}</td>
              <td>{it['Customer Name'] || it['Customer name'] || ''}</td>
              <td>{it['Phone Number'] || it['Phone'] || ''}</td>
              <td>{it['Product Category'] || it['Product category'] || ''}</td>
              <td>{it['Product Name'] || it['Product name'] || ''}</td>
              <td>{it['Quantity'] || it['quantity'] || ''}</td>
              <td>{it['Final Amount'] || it['Final amount'] || ''}</td>
              <td>{it['Tags'] || it['tags'] || ''}</td>
            </tr>
          ))}
          {loading && Array.from({length: 5}).map((_,i)=> (
            <tr className="skeleton" key={`s-${i}`}>
              <td colSpan={8}>Loading...</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="btn" disabled={loading || data.page <= 1} onClick={()=> onPageChange(data.page - 1)}>Previous</button>
        {Array.from({length: Math.min(data.totalPages, 7)}).map((_,i)=>{
          const p = i + 1;
          return (
            <button key={p} className={`btn btn-page ${p===data.page ? 'active' : ''}`} disabled={loading} onClick={()=> onPageChange(p)}>{p}</button>
          )
        })}
        <button className="btn" disabled={loading || data.page >= data.totalPages} onClick={()=> onPageChange(data.page + 1)}>Next</button>
      </div>
    </div>
  )
}
