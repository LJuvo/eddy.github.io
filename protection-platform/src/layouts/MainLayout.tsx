import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const FULLSCREEN_ROUTES = ['/thematic/showcase'];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    // 进入全屏模式时自动收起侧边栏
    if (isFullscreen) {
      setCollapsed(true);
    }
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Header collapsed={collapsed} />
      <main 
        className="main-content"
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
