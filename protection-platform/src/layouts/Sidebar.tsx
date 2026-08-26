import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  ApiOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  PictureOutlined,
  RocketOutlined,
  FileTextOutlined,
  TeamOutlined,
  CloudServerOutlined,
  BuildOutlined,
  AlertOutlined,
  WarningOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  UserOutlined,
  LockOutlined,
  BankOutlined,
  FileDoneOutlined,
  RobotOutlined,
  CompassOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: '首页总览',
    },
    {
      key: 'spatial',
      icon: <GlobalOutlined />,
      label: '空间基础数据',
      children: [
        {
          key: '/spatial/map',
          label: '底图管理',
          icon: <EnvironmentOutlined />,
        },
        {
          key: '/spatial/layers',
          label: '图层管理',
          icon: <PictureOutlined />,
        },
        {
          key: '/spatial/rs/list',
          label: '遥感影像列表',
          icon: <RocketOutlined />,
        },
        {
          key: '/spatial/rs/compare',
          label: '影像对比',
          icon: <AppstoreOutlined />,
        },
        {
          key: '/spatial/uav',
          label: '航测任务管理',
          icon: <RocketOutlined />,
        },
        {
          key: '/spatial/survey',
          label: '地面调查记录',
          icon: <FileTextOutlined />,
        },
        {
          key: '/spatial/reserve',
          label: '保护区档案',
          icon: <BankOutlined />,
        },
        {
          key: '/spatial/community',
          label: '社区分布',
          icon: <TeamOutlined />,
        },
        {
          key: '/spatial/facilities',
          label: '基础设施管理',
          icon: <BuildOutlined />,
        },
      ],
    },
    {
      key: 'eco',
      icon: <ExperimentOutlined />,
      label: '生态专题数据',
      children: [
        {
          key: '/eco/species',
          label: '物种档案',
          icon: <TeamOutlined />,
        },
        {
          key: '/eco/population',
          label: '种群监测数据',
          icon: <LineChartOutlined />,
        },
        {
          key: '/eco/community',
          label: '群落结构分析',
          icon: <BarChartOutlined />,
        },
        {
          key: '/eco/habitat',
          label: '生境适宜性评价',
          icon: <EnvironmentOutlined />,
        },
        {
          key: '/eco/health',
          label: '健康评估',
          icon: <SafetyOutlined />,
        },
      ],
    },
    {
      key: 'patrol',
      icon: <SafetyOutlined />,
      label: '巡护业务数据',
      children: [
        {
          key: '/patrol/tasks',
          label: '巡护任务管理',
          icon: <FileDoneOutlined />,
        },
        {
          key: '/patrol/track',
          label: '巡护轨迹记录',
          icon: <GlobalOutlined />,
        },
        {
          key: '/patrol/alerts',
          label: '异常事件上报',
          icon: <AlertOutlined />,
        },
        {
          key: '/patrol/personnel',
          label: '巡护人员管理',
          icon: <TeamOutlined />,
        },
      ],
    },
    {
      key: 'monitor',
      icon: <ApiOutlined />,
      label: '物联监测数据',
      children: [
        {
          key: '/monitor/devices',
          label: '设备列表',
          icon: <CloudServerOutlined />,
        },
        {
          key: '/monitor/water',
          label: '水质监测',
          icon: <ApiOutlined />,
        },
        {
          key: '/monitor/video',
          label: '视频监控',
          icon: <ApiOutlined />,
        },
        {
          key: '/monitor/alerts',
          label: '监测告警',
          icon: <WarningOutlined />,
        },
      ],
    },
    {
      key: 'analysis',
      icon: <BarChartOutlined />,
      label: '分析决策与可视化',
      children: [
        {
          key: '/analysis/screen',
          label: '数据总览大屏',
          icon: <BarChartOutlined />,
        },
        {
          key: '/analysis/map',
          label: '综合一张图',
          icon: <GlobalOutlined />,
        },
        {
          key: '/analysis/buffer',
          label: '缓冲区分析',
          icon: <AppstoreOutlined />,
        },
        {
          key: '/analysis/overlay',
          label: '叠加分析',
          icon: <AppstoreOutlined />,
        },
        {
          key: '/analysis/report',
          label: '报告生成',
          icon: <FileDoneOutlined />,
        },
      ],
    },
    {
      key: 'thematic',
      icon: <CompassOutlined />,
      label: '专题展示',
      children: [
        {
          key: '/thematic/showcase',
          label: '自然保护区专题',
          icon: <GlobalOutlined />,
        },
        {
          key: '/thematic/management',
          label: '专题管理',
          icon: <EditOutlined />,
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          label: '用户管理',
          icon: <UserOutlined />,
        },
        {
          key: '/system/roles',
          label: '角色管理',
          icon: <LockOutlined />,
        },
        {
          key: '/system/permissions',
          label: '权限配置',
          icon: <LockOutlined />,
        },
        {
          key: '/system/org',
          label: '组织架构管理',
          icon: <BankOutlined />,
        },
        {
          key: '/system/logs',
          label: '操作日志',
          icon: <FileTextOutlined />,
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (!e.key.includes('/')) return;
    navigate(e.key);
  };

  const getSelectedKeys = (): string[] => {
    const path = location.pathname;
    return [path];
  };

  const getOpenKeys = (): string[] => {
    const path = location.pathname;
    const openKeys: string[] = [];
    menuItems.forEach(item => {
      if (item && 'children' in item && item.children) {
        if (item.children.some((child: any) => child?.key === path)) {
          openKeys.push(item.key as string);
        }
      }
    });
    return openKeys;
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: collapsed ? 80 : 260,
        height: '100vh',
        background: '#1f2d3d',
        transition: 'width 0.2s ease',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo区域 */}
      <div
        style={{
          height: 60,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #2D7D46, #3a9a59)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          诺
        </div>
        {!collapsed && (
          <div style={{ marginLeft: 12, color: 'white', overflow: 'hidden' }}>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
              诺水河保护区
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
              综合管理平台
            </div>
          </div>
        )}
      </div>

      {/* 菜单 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 0,
          }}
        />
      </div>

      {/* 折叠按钮 */}
      <div
        style={{
          flexShrink: 0,
          padding: '16px 0',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          onClick={() => onCollapse(!collapsed)}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
