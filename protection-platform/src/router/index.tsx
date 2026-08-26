import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MapManagement = lazy(() => import('@/pages/spatial/MapManagement'));
const LayerManagement = lazy(() => import('@/pages/spatial/LayerManagement'));
const RemoteSensingList = lazy(() => import('@/pages/spatial/RemoteSensingList'));
const RemoteSensingCompare = lazy(() => import('@/pages/spatial/RemoteSensingCompare'));
const UAVTask = lazy(() => import('@/pages/spatial/UAVTask'));
const SurveyRecords = lazy(() => import('@/pages/spatial/SurveyRecords'));
const ReserveProfile = lazy(() => import('@/pages/spatial/ReserveProfile'));
const CommunityMap = lazy(() => import('@/pages/spatial/CommunityMap'));
const Facilities = lazy(() => import('@/pages/spatial/Facilities'));
const SpeciesArchive = lazy(() => import('@/pages/eco/SpeciesArchive'));
const PopulationMonitoring = lazy(() => import('@/pages/eco/PopulationMonitoring'));
const CommunityStructure = lazy(() => import('@/pages/eco/CommunityStructure'));
const HabitatSuitability = lazy(() => import('@/pages/eco/HabitatSuitability'));
const HealthAssess = lazy(() => import('@/pages/eco/HealthAssess'));
const PatrolTasks = lazy(() => import('@/pages/patrol/PatrolTasks'));
const PatrolTrack = lazy(() => import('@/pages/patrol/PatrolTrack'));
const PatrolAlerts = lazy(() => import('@/pages/patrol/PatrolAlerts'));
const PatrolPersonnel = lazy(() => import('@/pages/patrol/PatrolPersonnel'));
const MonitorDevices = lazy(() => import('@/pages/monitor/MonitorDevices'));
const WaterMonitoring = lazy(() => import('@/pages/monitor/WaterMonitoring'));
const VideoMonitor = lazy(() => import('@/pages/monitor/VideoMonitor'));
const MonitorAlerts = lazy(() => import('@/pages/monitor/MonitorAlerts'));
const DataScreen = lazy(() => import('@/pages/analysis/DataScreen'));
const OverviewMap = lazy(() => import('@/pages/analysis/OverviewMap'));
const BufferAnalysis = lazy(() => import('@/pages/analysis/BufferAnalysis'));
const OverlayAnalysis = lazy(() => import('@/pages/analysis/OverlayAnalysis'));
const ReportGeneration = lazy(() => import('@/pages/analysis/ReportGeneration'));
const UserManagement = lazy(() => import('@/pages/system/UserManagement'));
const RoleManagement = lazy(() => import('@/pages/system/RoleManagement'));
const PermissionConfig = lazy(() => import('@/pages/system/PermissionConfig'));
const OrgStructure = lazy(() => import('@/pages/system/OrgStructure'));
const OperationLogs = lazy(() => import('@/pages/system/OperationLogs'));
const ThematicShowcase = lazy(() => import('@/pages/thematic/ThematicShowcase'));
const ThematicManagement = lazy(() => import('@/pages/thematic/ThematicManagement'));

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // 空间基础数据
      {
        path: 'spatial/map',
        element: <MapManagement />,
      },
      {
        path: 'spatial/layers',
        element: <LayerManagement />,
      },
      {
        path: 'spatial/rs/list',
        element: <RemoteSensingList />,
      },
      {
        path: 'spatial/rs/compare',
        element: <RemoteSensingCompare />,
      },
      {
        path: 'spatial/uav',
        element: <UAVTask />,
      },
      {
        path: 'spatial/survey',
        element: <SurveyRecords />,
      },
      {
        path: 'spatial/reserve',
        element: <ReserveProfile />,
      },
      {
        path: 'spatial/community',
        element: <CommunityMap />,
      },
      {
        path: 'spatial/facilities',
        element: <Facilities />,
      },
      // 生态专题数据
      {
        path: 'eco/species',
        element: <SpeciesArchive />,
      },
      {
        path: 'eco/population',
        element: <PopulationMonitoring />,
      },
      {
        path: 'eco/community',
        element: <CommunityStructure />,
      },
      {
        path: 'eco/habitat',
        element: <HabitatSuitability />,
      },
      {
        path: 'eco/health',
        element: <HealthAssess />,
      },
      // 巡护业务数据
      {
        path: 'patrol/tasks',
        element: <PatrolTasks />,
      },
      {
        path: 'patrol/track',
        element: <PatrolTrack />,
      },
      {
        path: 'patrol/alerts',
        element: <PatrolAlerts />,
      },
      {
        path: 'patrol/personnel',
        element: <PatrolPersonnel />,
      },
      // 物联监测数据
      {
        path: 'monitor/devices',
        element: <MonitorDevices />,
      },
      {
        path: 'monitor/water',
        element: <WaterMonitoring />,
      },
      {
        path: 'monitor/video',
        element: <VideoMonitor />,
      },
      {
        path: 'monitor/alerts',
        element: <MonitorAlerts />,
      },
      // 分析决策与可视化
      {
        path: 'analysis/screen',
        element: <DataScreen />,
      },
      {
        path: 'analysis/map',
        element: <OverviewMap />,
      },
      {
        path: 'analysis/buffer',
        element: <BufferAnalysis />,
      },
      {
        path: 'analysis/overlay',
        element: <OverlayAnalysis />,
      },
      {
        path: 'analysis/report',
        element: <ReportGeneration />,
      },
      // 系统管理
      {
        path: 'system/users',
        element: <UserManagement />,
      },
      {
        path: 'system/roles',
        element: <RoleManagement />,
      },
      {
        path: 'system/permissions',
        element: <PermissionConfig />,
      },
      {
        path: 'system/org',
        element: <OrgStructure />,
      },
      {
        path: 'system/logs',
        element: <OperationLogs />,
      },
      // 专题展示
      {
        path: 'thematic/showcase',
        element: <ThematicShowcase />,
      },
      {
        path: 'thematic/management',
        element: <ThematicManagement />,
      },
    ],
  },
];

export default routes;
