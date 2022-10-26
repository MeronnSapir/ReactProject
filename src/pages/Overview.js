import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, Statistic, Spin, Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { backendServer, dataPrefix, getBalanceRoute, getPortfolioPieDataRoute, getMarketPieDataRoute, getMoversRoute } from '../config'
import './Overview.css'
import {CanvasJSChart} from 'canvasjs-react-charts'



function Overview() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [balance, setBalance] = useState()
    const [portfolioPieData, setPortfolioPieData] = useState()
    const [marketPieData, setMarketPieData] = useState()
    const [moversData, setMoversData] = useState()
    const alertLogin = () => <Alert message="You need to log in in order to use the website" type="warning"/>

    const tickerSegmentationOptions = {
        exportEnabled: true,
        animationEnabled: true,
        height: 350,
        fontFamily: "tahoma",
        title: {
            text: "Portfolio Segmentation"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{ticker}</b>: {y}%",
            showInLegend: "true",
            legendText: "{ticker}",
            indexLabelFontSize: 14,
            indexLabel: "{ticker} - {y}%",
            dataPoints: portfolioPieData
        }]
    }

    const marketSegmentationOptions = {
        exportEnabled: true,
        animationEnabled: true,
        height: 350,
        fontFamily: "tahoma",
        title: {
            text: "Market Segmentation"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{market_type}</b>: {y}%",
            showInLegend: "true",
            legendText: "{market_type}",
            indexLabelFontSize: 14,
            indexLabel: "{market_type} - {y}%",
            dataPoints: marketPieData
        }]
    }

    const moversColumns = [
        {
          title: 'Ticker',
          dataIndex: 'ticker',
          key: 'ticker',
          align: 'center'
        },
        {
            title: 'Move',
            dataIndex: 'move',
            key: 'move',
            align: 'center',
            render: (move) => <Statistic
            title=""
            value={move}
            precision={2}
            valueStyle={ move > 0 ? { color: 'green' } : { color: 'red' }}
            prefix={move > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
          },
        {
          title: 'Current Price',
          dataIndex: 'current_price',
          key: 'current_price',
          align: 'center'
        },
      ];

    const getBalance = () => {
        axios.get(backendServer + dataPrefix + getBalanceRoute, { params: { user: user.displayName}})
        .then(response => {
            setBalance(response.data)
        })
    }

    const getPortfolioPieData = () => {
        axios.get(backendServer + dataPrefix + getPortfolioPieDataRoute, { params: { user: user.displayName}})
        .then(response => {
            console.log(response)
            setPortfolioPieData(response.data)
        })
    }

    const getMarketPieData = () => {
        axios.get(backendServer + dataPrefix + getMarketPieDataRoute, { params: { user: user.displayName}})
        .then(response => {
            console.log(response)
            setMarketPieData(response.data)
        })
    }

    const getMoversData = () => {
        axios.get(backendServer + dataPrefix + getMoversRoute, { params: { user: user.displayName, time_back: '5d'}})
        .then(response => {
            console.log(response)
            setMoversData(response.data)
        })
    }

    useEffect(() => {
        if (!user) {
            // maybe trigger a loading screen
            alertLogin();
            navigate("/");
            return;
        }
        if (!balance) {
            getBalance()
            getPortfolioPieData()
            getMarketPieData()
            getMoversData()
        }
        }, [user, loading]);
    return (
        <div className="overviewPage">
            <div className="overviewFirstLine">
                <div className="totalBalance">
                    <div className="balanceTitle">
                        { balance ? <Statistic className="Balance" title="Balance" valueStyle={{fontSize: 50}} value={balance} /> : 
                        <div>
                            <Statistic className="Balance" title="Balance" style={{fontSize: 50}} value={' '} /> 
                            <Spin size="large" />
                            </div>}
                    </div>
                </div>
                <div className="balanceGraph"></div>
            </div>
            <div className="overviewSecondLine">
                <div className="holdingsPie">
                   { portfolioPieData ? <CanvasJSChart options = {tickerSegmentationOptions}/> : <Spin size="large" />}
                </div>
                <div className="marketPie">
                    { marketPieData ? <CanvasJSChart options = {marketSegmentationOptions}/> : <Spin size="large" />}
                </div>
                <div className="moversList">
                    <div className="moversTitle"> Top Movers </div>
                    { moversData ? <Table dataSource={moversData} columns={moversColumns} /> : <Spin size="large" />}
                </div>
            </div>
        </div>
        
    )
}

export default Overview