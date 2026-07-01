import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { MainLayout } from '@/layouts';
import routes from '@/router';

// 加载中组件
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

// 懒加载包装组件
const LazyRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => (
  <Suspense fallback={<LoadingFallback />}>
    {element}
  </Suspense>
);

function App() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.element ? (
              React.isValidElement(route.element) ? (
                <LazyRoute element={route.element} />
              ) : (
                route.element
              )
            ) : null
          }
        >
          {route.children?.map((child, childIndex) => (
            <Route
              key={childIndex}
              index={child.index}
              path={child.path}
              element={
                child.element ? (
                  React.isValidElement(child.element) ? (
                    <LazyRoute element={child.element} />
                  ) : (
                    child.element
                  )
                ) : child.index ? (
                  <Navigate to={child.path || '/dashboard'} replace />
                ) : null
              }
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
}

export default App;
