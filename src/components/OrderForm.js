import { React, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import 'antd/dist/antd.min.css'
import TextField from '@mui/material/TextField';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./OrderForm.css"
import {backendServer, ordersPrefix, reportOrderRoute} from '../config'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const OrderForm = (props) => {
    const [user, loading, error] = useAuthState(auth);
    const [marketType, setMarketType] = useState('stock_market')
    const [ticker, setTicker] = useState()
    const [orderType, setOrderType] = useState()
    const [shares, setShares] = useState()
    const [orderPrice, setOrderPrice] = useState()
    const [orderDate, setOrderDate] = useState(dayjs('2014-08-18T21:11:54'))
    const [reason, setReason] = useState()
    const [openAlert, setOpenAlert] = useState(false)
    const [orderData, setOrderData] = useState()
    const [orderResponse, setOrderResponse] = useState('')
    const navigate = useNavigate();

    const orderUserMessages = {
      'Acknowledged': 'The order was succesfully added!',
      'Not acknowledged': 'Failed to add the order, contact us',
      'Failed to update': 'Failed to add the order, contact us',
      'Document already exists': 'The order was already added'
    }

    const isTickerExists = (ticker) => {
      return true
    }

    const postOrder = () => {
      var shouldRequest = true
      const data = {
        'user': user.displayName,
        'ticker': ticker,
        'market_type': marketType,
        'order_type': orderType,
        'shares': shares,
        'date': orderDate,
        'order_price': orderPrice,
        'reason': reason
        }
      console.log("That's my data - ", data)
      setOrderData(data)
      console.log('orderData - ', orderData)
      const dataKeys = Object.keys(data)
      for (const key of dataKeys) {
        if (!data[key] && key !== 'reason') {
          alert((key) + ' is a required input')
          var shouldRequest = false
          console.log(shouldRequest)
        }
      }
      if (shouldRequest == true) {
        console.log('inside')
        console.log(shouldRequest)
        axios.post(backendServer + ordersPrefix + reportOrderRoute, data, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => (handleReportResponse(response, data))
        )}
      }
  
    
    const handleReportResponse = (response, data) => {
      console.log('response - ', response)
      setOrderResponse(response.data)
      setOpenAlert(true)
      if (response.data === 'Acknowledged') {
        console.log('200 - ', props)
        console.log('Order Data - ', orderData)
        const keyNum = props.orders.length
        const newOrderData = {
          ...data,
          key: keyNum,
          date: orderDate.toISOString()
        }
        console.log('Order data after change - ', newOrderData)
        props.addOrders([newOrderData])
        console.log('Redux state after function', props.orders)
      }
      else {
        alert('Something did not work with the order report')
      }
    }
  

    const handleCloseAlert = () => {
      setOpenAlert(false)
      setOrderResponse('')
    }

    useEffect(() => {
        if (!user) {
            // maybe trigger a loading screen
            <Alert message="You need to log in in order to use the website" type="warning" />
            navigate("/")
            return;
        }
        // console.log('orderDaraReRender')
        // console.log('Redux state at render - ', props.orders)
              }, [orderData]);
  return (
    <div>
        <div className="order_form"> 
        <div className="form_object">
            <button className={orderType==='buy' ? 'clicked_buy_button' : 'buy_button'} onClick={() => setOrderType('buy')}>Buy</button>
            <button className={orderType==='sell' ? 'clicked_sell_button' : 'sell_button'} onClick={() => setOrderType('sell')}>Sell</button>
          </div>
          <div className="form_object">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Market Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={marketType}
              label="Market Type"
              onChange={(e) => setMarketType(e.target.value)}
            >
              <MenuItem value={'stock_market'}>Stock Market</MenuItem>
              <MenuItem value={'crypto'}>Crypto Market</MenuItem>
            </Select>
          </FormControl>
          </div>
          <div className="form_object">
            <TextField id="outlined-basic" required label="Ticker" variant="outlined" onChange={(e) => setTicker(e.target.value)}/> 
          </div>
          <div className="form_object">
          <TextField className="shares" required id="outlined-basic" label="Shares" variant="outlined" onChange={(e) => setShares(e.target.value)}/>
          </div>
          <div className="form_object">
          <TextField className="order_price" required id="outlined-basic" label="Order Price" variant="outlined" onChange={(e) => setOrderPrice(e.target.value)}/>
          </div>
          <div className="form_object">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                label="Order Date"
                inputFormat="MM/DD/YYYY"
                onChange={(e) => setOrderDate(e.target.value)}
                value={orderDate}
                renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          </div>
          <div className="form_object">
              <TextField
              id="outlined-helperText"
              label="Reason"
              helperText="not required"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="form_object">
          <Button className="submit_button" type="primary" onClick={() => postOrder()} >Submit</Button>
          </div>
        </div>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={orderResponse === 'Acknowledged' ? 'success' : 'error'} sx={{ width: '100%' }}>
            {orderUserMessages[orderResponse]}
          </Alert>
      </Snackbar>
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log('statee', state.orders)
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);