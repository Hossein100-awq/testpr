import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Battleground, CreateBattle, Battle, Home, JoinBattle } from './page';
import Login from './page/Login';
import { GlobalContextProvider } from './context';
import { hasDemoAccess } from './utils/demoAccess';
import './index.css';

const RequireDemoAccess = () => {
  const location = useLocation();
  return hasDemoAccess()
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireDemoAccess />}>
          <Route path="/home" element={<Home />} />
          <Route path="/battleground" element={<Battleground />} />
          <Route path="/battle/:battleName" element={<Battle />} />
          <Route path="/create-battle" element={<CreateBattle />} />
          <Route path="/join-battle" element={<JoinBattle />} />
        </Route>
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter>,
);
