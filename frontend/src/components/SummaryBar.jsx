import React from 'react'
export default function SummaryBar({ total, page, totalPages }){
  return (
    <div className="summaryBar">
      <div className="stat">
        <div className="statLabel">Total Results</div>
        <div className="statValue">{total}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Page</div>
        <div className="statValue">{page} / {totalPages}</div>
      </div>
    </div>
  )
}
