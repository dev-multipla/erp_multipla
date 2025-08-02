import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Header  from '../components/Header';

export default function PrivateLayout() {
  return (
    <div className="private-container" style={{ display: 'flex' }}>
      <SideBar />
      <div className="main-content" style={{ flex: 1 }}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
