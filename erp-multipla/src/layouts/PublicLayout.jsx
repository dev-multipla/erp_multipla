import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="public-container">
      {/* aqui você pode colocar cabeçalho público, logo etc */}
      <Outlet />
    </div>
  );
}
