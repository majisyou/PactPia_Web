import Home from './pages/Home';
import Login from './pages/Login';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import RegisterUsers from './pages/RegisterUsers';
import Unions from './pages/Unions';
import Buildings from './pages/Buildings';
import Shops from './pages/Shops';
import ShopAdd from './pages/ShopAdd';
import UserAdd from './pages/UserAdd';
import UnionAdd from './pages/UnionAdd';
import RegisterUserAdd from './pages/RegisterUserAdd';
import JobAdd from './pages/JobAdd';
import BuildingAdd from './pages/BuildingAdd';
import ShopDetail from './pages/ShopDetail';
import UnionDetail from './pages/UnionDetail';
import RegisterUserDetail from './pages/RegisterUserDetail';
import JobDetail from './pages/JobDetail';
import BuildingDetail from './pages/BuildingDetail';
import Jobs from './pages/Jobs';
import Others from './pages/Others';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './Component/ErrorBoundary';

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<UserAdd />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/registered_users" element={<RegisterUsers />} />
            <Route path="/registered_users/add" element={<RegisterUserAdd />} />
            <Route path="/unions" element={<Unions />} />
            <Route path="/unions/add" element={<UnionAdd />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/buildings/add" element={<BuildingAdd />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/shops/add" element={<ShopAdd />} />
            <Route path="/shops/:id" element={<ShopDetail />} />
            <Route path="/unions/:id" element={<UnionDetail />} />
            <Route path="/registered_users/:id" element={<RegisterUserDetail />} />
            <Route path="/jobs/add" element={<JobAdd />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/buildings/:id" element={<BuildingDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/others" element={<Others />} />
          </Routes>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
