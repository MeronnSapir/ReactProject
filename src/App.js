import './App.css';
import Appbar from './components/AppBar';
import Login from './components/Login';
import Register from './components/Register';
import Reset from './components/Reset';
import Dashboard from './components/Dashboard';
import Overview from './pages/Overview';
import ReportOrders from './pages/ReportOrders';
import Insights from './pages/Insights';
import Updates from './pages/Updates';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { Report } from '@mui/icons-material';


function App() {
  return (
    <div className="App">
      <Router>
      <Appbar/>
        <Routes path="/" elememt={<Login />}>
          <Route exact path="/" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/reset" element={<Reset />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/overview" element={<Overview />}/>
          <Route path="report_orders" element={<ReportOrders />}/>
          <Route path="updates" element={<Updates />}/>
          <Route path="insights" element={<Insights />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
