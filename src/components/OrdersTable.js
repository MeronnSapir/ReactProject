import { Checkbox, Divider, Radio, Table } from 'antd';
import axios from 'axios';
import { Button } from 'antd'
import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { backendServer, getOrdersRoute, ordersPrefix, deleteOrdersRoute } from '../config';
import { auth } from '../firebase';
import { connect } from 'react-redux'
import './OrdersTable.css'
import { DeleteTwoTone } from '@ant-design/icons';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const columns = [
  {
    title: 'Ticker',
    dataIndex: 'ticker',
    align: 'center',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Market',
    dataIndex: 'market_type',
    align: 'center'
  },
  {
    title: 'Shares',
    dataIndex: 'shares',
    align: 'center'
  },
  {
    title: 'Price',
    dataIndex: 'order_price',
    align: 'center'
  },
  {
    title: 'Date',
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: 'Order',
    dataIndex: 'order_type',
    align: 'center'
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
]; // rowSelection object indicates the need for row selection

const OrdersTable = (props) => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selected, setSelected] = useState([]); 
  const [user] = useAuthState(auth)
  const [orders, setOrders] = useState(null)
  const [orderResponse, setOrderResponse] = useState('')
  const [openAlert, setOpenAlert] = useState(false)

  const undeletedOrderMessage = 'Acknowledged, but'
  const orderUserMessages = {
    'Acknowledged': 'The order was succesfully deleted!',
    'Not acknowledged': 'Failed to delete the order, contact us',
    'Failed to update': 'Failed to delete the order, contact us'
    }

  const getOrders = () => {
    const params = {'user': user.displayName}
    axios.post(backendServer + ordersPrefix + getOrdersRoute, params, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {return response.data}
      ).then(data => {
        setOrders(data)
        console.log('DATA - ', data)
        console.log('Orders - ', orders)
        props.addOrders(data)
        console.log('STATY STATE - ', props.orders)
      })
    }

  const extractIds = () => {
    const ids = selected.map(item => item.id)
    console.log('selected', ids)
    return selected
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelected(selectedRows)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      return selectedRows
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const deleteOrders = () => {
    const idsToRemove = selected.map(item => {
      console.log(item)
      console.log(orders)
      return item._id
    })
    const params = {'orders': selected, 'user': user.displayName}
    console.log('Ids to remove', idsToRemove)
    axios.post(backendServer + ordersPrefix + deleteOrdersRoute, params, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      (handleDeleteResponse(response))
    }
    )}

  const handleDeleteResponse = (response) => {
    setOrderResponse(response.data)
    setOpenAlert(true)
    if (response.data.includes('Acknowledged')) {
      const orders = props.orders
      props.removeOrders(selected)
      console.log('after', props.orders)
    }

  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setOrderResponse('')
  }
  

  const handleDeleteButton = () => {
    if (selected) {
      deleteOrders()
    }
    else {
      alert('No orders selected')
    }
  }

  useEffect(() => {
    // console.log('ran', props.orders)
      if (!orders) {
        console.log('useEffect state orders', props.orders)
        if (props.orders != []) {
        getOrders()
        }
      }
    }, [selected]);
  
  return (
    <div className="ordersTable">
      <Divider />
      <div className="buttonsBar">
      <Button danger className="deleteButton"  onClick={() => handleDeleteButton()} >
        Delete<DeleteTwoTone twoToneColor="red"/>
        </Button>
      </div>
      <Table
        style={{textAlign: 'center'}}
        rowSelection={{
          type: Checkbox,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.orders}
      />
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
      { orderResponse.includes(undeletedOrderMessage) ?
        <Alert onClose={handleCloseAlert} severity='warning' sx={{ width: '100%' }}>
            {orderResponse}
        </Alert> :
        <Alert onClose={handleCloseAlert} severity={orderResponse == 'Acknowledged' ? 'success' : 'error'} sx={{ width: '100%' }}>
            {orderUserMessages[orderResponse]}
        </Alert>}
      </Snackbar>
    </div>
    
  );
};

const mapStateToProps = (state) => {
    return {
        orders: state.orders
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeOrders: (orders) => { dispatch({type: 'REMOVE_ORDERS', orders: orders }) },
        addOrders: (orders) => { dispatch({type: 'ADD_ORDERS', orders: orders }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);