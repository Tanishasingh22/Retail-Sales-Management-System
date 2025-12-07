import React from 'react'

export default function LeftNav(){
  return (
    <aside className="leftNav">
      <div className="brand">Vault</div>
      <div className="section">
        <div className="sectionTitle">Dashboard</div>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Nexus</a>
          <a href="#">Intake</a>
        </nav>
      </div>
      <div className="section">
        <div className="sectionTitle">Services</div>
        <nav>
          <a href="#">Pre-active</a>
          <a href="#">Active</a>
          <a href="#">Blocked</a>
          <a href="#">Closed</a>
        </nav>
      </div>
      <div className="section">
        <div className="sectionTitle">Invoices</div>
        <nav>
          <a href="#">Proforma Invoices</a>
          <a href="#">Final Invoices</a>
        </nav>
      </div>
    </aside>
  )
}
