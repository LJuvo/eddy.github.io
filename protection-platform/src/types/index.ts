// 用户相关类型
export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department?: string;
}

export type UserRole = 
  | 'admin' 
  | 'leader' 
  | 'researcher' 
  | 'patrol_manager' 
  | 'patroller' 
  | 'monitor';

// 菜单相关类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  component?: React.ComponentType;
}

// 保护区相关类型
export interface Reserve {
  id: string;
  name: string;
  level: 'national' | 'provincial' | 'municipal';
  area: number;
  establishedDate: string;
  location: string;
  description?: string;
}

// 物种相关类型
export interface Species {
  id: string;
  name: string;
  latinName: string;
  category: string;
  protectionLevel: '1' | '2' | '3';
  status: 'critically_endangered' | 'endangered' | 'vulnerable' | 'near_threatened' | 'least_concern';
  description?: string;
  imageUrl?: string;
}

export interface SpeciesPopulation {
  id: string;
  speciesId: string;
  year: number;
  population: number;
  trend: 'increase' | 'stable' | 'decrease';
  location: string;
  remarks?: string;
}

// 巡护相关类型
export interface PatrolTask {
  id: string;
  title: string;
  type: 'routine' | 'special' | 'emergency';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  assignedBy: string;
  route: string;
  startTime: string;
  endTime?: string;
  scheduledDate: string;
  remarks?: string;
  createdAt: string;
}

export interface PatrolRecord {
  id: string;
  taskId: string;
  patrolId: string;
  patrolName: string;
  startTime: string;
  endTime: string;
  route: string;
  distance: number;
  duration: number;
  status: 'normal' | 'abnormal';
  findings?: string;
  location: string;
}

export interface PatrolAlert {
  id: string;
  type: 'illegal_fishing' | 'illegal_mining' | 'pollution' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportTime: string;
  reporter: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  description: string;
  images?: string[];
}

// 监测相关类型
export interface MonitorDevice {
  id: string;
  name: string;
  type: 'camera' | 'water_sensor' | 'air_sensor' | 'weather_station';
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  specifications?: Record<string, any>;
}

export interface MonitorData {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  waterLevel?: number;
  waterQuality?: {
    ph?: number;
    dissolvedOxygen?: number;
    turbidity?: number;
    cod?: number;
    ammonia?: number;
  };
  temperature?: number;
  humidity?: number;
}

// 统计相关类型
export interface DashboardStats {
  patrolCoverage: number;
  alertCount: number;
  speciesCount: number;
  deviceOnlineRate: number;
  todayPatrolCount: number;
  pendingTaskCount: number;
  abnormalEventsCount: number;
}

// 表格分页
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

// 地图相关类型
export interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay' | 'vector' | 'raster';
  visible: boolean;
  opacity: number;
  url?: string;
}

export interface MapPosition {
  lng: number;
  lat: number;
  zoom: number;
  heading?: number;
  pitch?: number;
}

// 表格筛选
export interface TableFilters {
  [key: string]: string | string[] | undefined;
}

// 表单数据
export interface FormValues {
  [key: string]: any;
}

// 专题展示相关类型
export interface ThematicWaypoint {
  name: string;
  desc: string;
  lng: number;
  lat: number;
}

export interface ThematicChapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  route: [number, number][];
  waypoints: ThematicWaypoint[];
  icon: string;
  // 可选的扩展内容
  speciesIds?: string[];      // 关联物种ID列表
  stats?: ThematicStat[];      // 统计数据展示
}

export interface ThematicStat {
  label: string;
  value: string;
  unit: string;
}

export interface ThematicTopic {
  id: string;
  name: string;                // 专题名称
  code: string;                // 专题编码
  description: string;          // 专题描述
  coverColor: string;          // 主题色
  icon: string;                // 图标 emoji
  status: 'published' | 'draft' | 'archived';  // 状态
  chapters: ThematicChapter[]; // 章节列表
  createdBy: string;           // 创建人
  createdAt: string;           // 创建时间
  updatedAt: string;           // 更新时间
  viewCount: number;           // 浏览次数
  isDefault?: boolean;         // 是否为默认专题
}

export type ThematicTopicInput = Omit<ThematicTopic, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>;

