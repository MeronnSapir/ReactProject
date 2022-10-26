import React from 'react'
import './ReportOrders.css'
import OrderForm from '../components/OrderForm'
import OrdersTable from '../components/OrdersTable'

function ReportOrders() {
  return (
    <div className="report_orders">
    <div className="form_page_side">
      <div className="form_title">Enter new orders</div>
      <OrderForm></OrderForm>
    </div>
    <div className="table_page_side">
    <div className="form_title">Reported Orders</div>
      <OrdersTable></OrdersTable>
    </div>
    </div>

  )
}

export default ReportOrders