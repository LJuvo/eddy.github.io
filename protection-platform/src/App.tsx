import React, { Suspense, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import routes from '@/router';

const LoadingFallback: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: '#f5f7fa'
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

const LazyRoute: React.FC<{ element: ReactNode }> = ({ element }) => (
  <Suspense fallback={<LoadingFallback />}>
    {element}
  </Suspense>
);

function App() {
  const renderRoutes = (routeList: typeof routes) => {
    return routeList.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={route.element}
      >
        {route.children?.map((child, childIndex) => (
          <Route
            key={childIndex}
            index={child.index}
            path={child.path}
            element={
              child.element ? (
                <LazyRoute element={child.element} />
              ) : undefined
            }
          />
        ))}
      </Route>
    ));
  };

  return (
    <Routes>
      {renderRoutes(routes)}
    </Routes>
  );
}

export default App;
