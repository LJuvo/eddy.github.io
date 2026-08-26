import type {
  User,
  DashboardStats,
  PatrolTask,
  PatrolAlert,
  Species,
  MonitorDevice,
  MonitorData,
  Reserve,
  MapLayer,
  ThematicTopic,
} from '@/types';

// 当前登录用户
export const currentUser: User = {
  id: '1',
  username: 'admin',
  name: '张三',
  role: 'admin',
  department: '综合管理部',
};

// 保护区基本信息
export const reserveInfo: Reserve = {
  id: '1',
  name: '四川诺水河珍稀水生动物国家级自然保护区',
  level: 'national',
  area: 27100,
  establishedDate: '2006-08-01',
  location: '四川省巴中市通江县',
  description: '主要保护对象为大鲵、岩原鲤等珍稀水生动物及其栖息环境',
};

// 仪表盘统计数据
export const dashboardStats: DashboardStats = {
  patrolCoverage: 87.5,
  alertCount: 12,
  speciesCount: 156,
  deviceOnlineRate: 94.2,
  todayPatrolCount: 8,
  pendingTaskCount: 5,
  abnormalEventsCount: 2,
};

// 地图图层配置
export const mapLayers: MapLayer[] = [
  { id: 'base-tianditu', name: '天地图', type: 'base', visible: true, opacity: 1 },
  { id: 'base-gaode', name: '高德地图', type: 'base', visible: false, opacity: 1 },
  { id: 'base-satellite', name: '卫星影像', type: 'base', visible: false, opacity: 1 },
  { id: 'overlay-boundary', name: '保护区边界', type: 'overlay', visible: true, opacity: 0.8 },
  { id: 'overlay-zoning', name: '功能区划', type: 'overlay', visible: true, opacity: 0.6 },
  { id: 'overlay-species', name: '物种分布', type: 'overlay', visible: false, opacity: 0.7 },
  { id: 'overlay-facilities', name: '基础设施', type: 'vector', visible: true, opacity: 1 },
  { id: 'overlay-patrollers', name: '巡护人员', type: 'vector', visible: true, opacity: 1 },
];

// 物种数据
export const speciesList: Species[] = [
  {
    id: '1',
    name: '大鲵',
    latinName: 'Andrias davidianus',
    category: '两栖纲 有尾目 大鲵科',
    protectionLevel: '1',
    status: 'critically_endangered',
    description: '世界上最大的两栖动物，国家一级重点保护野生动物',
  },
  {
    id: '2',
    name: '岩原鲤',
    latinName: 'Rupicola désodonta',
    category: '鱼纲 鲤形目 鲤科',
    protectionLevel: '2',
    status: 'endangered',
    description: '长江上游特有鱼类，国家二级重点保护野生动物',
  },
  {
    id: '3',
    name: '中华鲟',
    latinName: 'Acipenser sinensis',
    category: '鱼纲 鲟形目 鲟科',
    protectionLevel: '1',
    status: 'critically_endangered',
    description: '长江特有的古老珍稀鱼类，国家一级重点保护野生动物',
  },
  {
    id: '4',
    name: '水獭',
    latinName: 'Lutra lutra',
    category: '哺乳纲 食肉目 鼬科',
    protectionLevel: '2',
    status: 'vulnerable',
    description: '国家二级重点保护野生动物',
  },
  {
    id: '5',
    name: '金线鲃',
    latinName: 'Sinocyclocheilus grahami',
    category: '鱼纲 鲤形目 鲤科',
    protectionLevel: '2',
    status: 'endangered',
    description: '云南特有鱼类',
  },
];

// 巡护任务数据
export const patrolTasks: PatrolTask[] = [
  {
    id: 'PT001',
    title: '诺水河干流日常巡护',
    type: 'routine',
    status: 'in_progress',
    assignedTo: '李巡护',
    assignedBy: '王管理员',
    route: '诺水河干流-涪阳镇至诺江镇段',
    startTime: '2024-01-15 08:00',
    endTime: '2024-01-15 17:00',
    scheduledDate: '2024-01-15',
    remarks: '重点关注非法捕捞行为',
    createdAt: '2024-01-10 09:00',
  },
  {
    id: 'PT002',
    title: '核心区专项巡护',
    type: 'special',
    status: 'pending',
    assignedTo: '张巡护',
    assignedBy: '王管理员',
    route: '核心区-大鲵栖息地',
    startTime: '2024-01-16 06:00',
    scheduledDate: '2024-01-16',
    remarks: '繁殖季节重点巡护',
    createdAt: '2024-01-12 10:00',
  },
  {
    id: 'PT003',
    title: '水质异常排查',
    type: 'emergency',
    status: 'assigned',
    assignedTo: '李巡护',
    assignedBy: '王管理员',
    route: '诺水河支流-澌滩河',
    startTime: '2024-01-15 14:00',
    scheduledDate: '2024-01-15',
    remarks: '接群众举报，水质异常',
    createdAt: '2024-01-15 13:30',
  },
  {
    id: 'PT004',
    title: '缓冲区例行巡护',
    type: 'routine',
    status: 'completed',
    assignedTo: '赵巡护',
    assignedBy: '王管理员',
    route: '缓冲区-空山乡至两河口乡',
    startTime: '2024-01-14 08:00',
    endTime: '2024-01-14 16:00',
    scheduledDate: '2024-01-14',
    createdAt: '2024-01-10 09:00',
  },
  {
    id: 'PT005',
    title: '实验区基础设施检查',
    type: 'routine',
    status: 'pending',
    assignedTo: '孙巡护',
    assignedBy: '王管理员',
    route: '实验区-各管护站点',
    startTime: '2024-01-17 09:00',
    scheduledDate: '2024-01-17',
    remarks: '检查标识牌和监测设备',
    createdAt: '2024-01-14 15:00',
  },
];

// 异常事件数据
export const patrolAlerts: PatrolAlert[] = [
  {
    id: 'AL001',
    type: 'illegal_fishing',
    severity: 'high',
    location: '诺水河干流-涪阳镇段',
    reportTime: '2024-01-15 10:30',
    reporter: '李巡护',
    status: 'processing',
    description: '发现有人在河道内使用渔网捕鱼，已拍照取证',
  },
  {
    id: 'AL002',
    type: 'pollution',
    severity: 'critical',
    location: '澌滩河-永安镇下游500米',
    reportTime: '2024-01-15 08:45',
    reporter: '张村民',
    status: 'pending',
    description: '发现不明污水排入河道，水质发黑有异味',
  },
  {
    id: 'AL003',
    type: 'illegal_mining',
    severity: 'medium',
    location: '空山乡-后坝村',
    reportTime: '2024-01-14 16:20',
    reporter: '赵巡护',
    status: 'resolved',
    description: '发现疑似非法采砂作业，现场制止并上报',
  },
  {
    id: 'AL004',
    type: 'illegal_fishing',
    severity: 'low',
    location: '实验区-两河口乡',
    reportTime: '2024-01-13 14:15',
    reporter: '孙巡护',
    status: 'closed',
    description: '发现废弃地笼，已清理',
  },
];

// 监测设备数据
export const monitorDevices: MonitorDevice[] = [
  {
    id: 'DEV001',
    name: '诺水河干流监控点-1',
    type: 'camera',
    location: '诺水河干流-涪阳镇',
    status: 'online',
    lastUpdate: '2024-01-15 14:30:25',
  },
  {
    id: 'DEV002',
    name: '大鲵栖息地水质监测站',
    type: 'water_sensor',
    location: '核心区-大鲵栖息地',
    status: 'online',
    lastUpdate: '2024-01-15 14:29:58',
  },
  {
    id: 'DEV003',
    name: '气象监测站-空山乡',
    type: 'weather_station',
    location: '空山乡气象站',
    status: 'online',
    lastUpdate: '2024-01-15 14:30:00',
  },
  {
    id: 'DEV004',
    name: '诺水河干流监控点-2',
    type: 'camera',
    location: '诺水河干流-诺江镇',
    status: 'offline',
    lastUpdate: '2024-01-15 12:15:33',
  },
  {
    id: 'DEV005',
    name: '澌滩河水质监测站',
    type: 'water_sensor',
    location: '澌滩河-永安镇',
    status: 'online',
    lastUpdate: '2024-01-15 14:28:42',
  },
  {
    id: 'DEV006',
    name: '气象监测站-澌滩乡',
    type: 'air_sensor',
    location: '澌滩乡气象站',
    status: 'maintenance',
    lastUpdate: '2024-01-15 10:00:00',
  },
];

// 监测数据
export const monitorDataList: MonitorData[] = [
  {
    id: 'MD001',
    deviceId: 'DEV002',
    deviceName: '大鲵栖息地水质监测站',
    timestamp: '2024-01-15 14:29:58',
    waterLevel: 1.25,
    waterQuality: {
      ph: 7.2,
      dissolvedOxygen: 8.5,
      turbidity: 12.3,
      cod: 15.2,
      ammonia: 0.15,
    },
  },
  {
    id: 'MD002',
    deviceId: 'DEV003',
    deviceName: '气象监测站-空山乡',
    timestamp: '2024-01-15 14:30:00',
    temperature: 8.5,
    humidity: 72,
  },
  {
    id: 'MD003',
    deviceId: 'DEV005',
    deviceName: '澌滩河水质监测站',
    timestamp: '2024-01-15 14:28:42',
    waterLevel: 0.85,
    waterQuality: {
      ph: 6.8,
      dissolvedOxygen: 6.2,
      turbidity: 25.6,
      cod: 28.5,
      ammonia: 0.45,
    },
  },
];

// 巡护人员列表
export const patrolPersonnel = [
  { id: 'P001', name: '李建国', role: '巡护管理员', phone: '138****1234', status: '巡护中', location: '诺水河干流' },
  { id: 'P002', name: '张明', role: '巡护员', phone: '139****5678', status: '待命', location: '管护站' },
  { id: 'P003', name: '王强', role: '巡护员', phone: '137****9012', status: '巡护中', location: '核心区' },
  { id: 'P004', name: '赵伟', role: '巡护员', phone: '136****3456', status: '休息', location: '家中' },
  { id: 'P005', name: '孙磊', role: '巡护员', phone: '135****7890', status: '巡护中', location: '缓冲区' },
];

// 统计数据 - 巡护趋势
export const patrolTrendData = [
  { month: '2023-08', count: 45 },
  { month: '2023-09', count: 52 },
  { month: '2023-10', count: 48 },
  { month: '2023-11', count: 55 },
  { month: '2023-12', count: 62 },
  { month: '2024-01', count: 58 },
];

// 统计数据 - 告警趋势
export const alertTrendData = [
  { month: '2023-08', count: 8 },
  { month: '2023-09', count: 12 },
  { month: '2023-10', count: 9 },
  { month: '2023-11', count: 15 },
  { month: '2023-12', count: 11 },
  { month: '2024-01', count: 12 },
];

// 统计数据 - 物种分布
export const speciesDistributionData = [
  { name: '大鲵', count: 3, location: '核心区' },
  { name: '岩原鲤', count: 8, location: '涪阳镇至诺江镇' },
  { name: '中华鲟', count: 1, location: '诺水河下游' },
  { name: '水獭', count: 2, location: '空山乡河段' },
  { name: '金线鲃', count: 5, location: '澌滩河流域' },
];

// 统计数据 - 设备状态
export const deviceStatusData = [
  { status: '在线', count: 32, color: '#52c41a' },
  { status: '离线', count: 3, color: '#ff4d4f' },
  { status: '维护中', count: 2, color: '#faad14' },
];

// 空间数据 - 行政区划
export const administrativeZones = [
  { id: 'Z001', name: '空山乡', type: '乡', area: 156, population: 8200 },
  { id: 'Z002', name: '涪阳镇', type: '镇', area: 98, population: 15600 },
  { id: 'Z003', name: '诺江镇', type: '镇', area: 120, population: 28500 },
  { id: 'Z004', name: '永安镇', type: '镇', area: 85, population: 12800 },
  { id: 'Z005', name: '两河口乡', type: '乡', area: 72, population: 6800 },
];

// 空间数据 - 基础设施
export const facilitiesData = [
  { id: 'F001', name: '空山管护站', type: '管护站', location: '空山乡', builtYear: 2018 },
  { id: 'F002', name: '涪阳管护站', type: '管护站', location: '涪阳镇', builtYear: 2019 },
  { id: 'F003', name: '诺江管护站', type: '管护站', location: '诺江镇', builtYear: 2017 },
  { id: 'F004', name: '水质自动监测站', type: '监测站', location: '核心区', builtYear: 2020 },
  { id: 'F005', name: '气象观测站', type: '监测站', location: '空山乡', builtYear: 2019 },
  { id: 'F006', name: '界碑-001', type: '标识牌', location: '诺江镇入口', builtYear: 2016 },
  { id: 'F007', name: '界碑-002', type: '标识牌', location: '空山乡入口', builtYear: 2016 },
  { id: 'F008', name: '警示牌-001', type: '标识牌', location: '涪阳镇河段', builtYear: 2021 },
];

// 用户管理数据
export const usersData = [
  { id: 'U001', username: 'admin', name: '系统管理员', role: '系统管理员', phone: '138****0001', email: 'admin@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 14:30' },
  { id: 'U002', username: 'leader', name: '王领导', role: '决策领导', phone: '139****0001', email: 'leader@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 10:20' },
  { id: 'U003', username: 'researcher', name: '陈科研', role: '科研人员', phone: '137****0001', email: 'researcher@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 09:15' },
  { id: 'U004', username: 'patrol_mgr', name: '刘管理', role: '巡护管理员', phone: '136****0001', email: 'patrol_mgr@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 08:45' },
  { id: 'U005', username: 'patrol01', name: '李巡护', role: '巡护员', phone: '135****0001', email: 'patrol01@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 07:30' },
  { id: 'U006', username: 'patrol02', name: '张巡护', role: '巡护员', phone: '134****0001', email: 'patrol02@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 06:00' },
  { id: 'U007', username: 'monitor', name: '赵值班', role: '监控值班员', phone: '133****0001', email: 'monitor@nuoshu.cn', status: '正常', lastLogin: '2024-01-15 08:00' },
  { id: 'U008', username: 'old_user', name: '离职人员', role: '巡护员', phone: '132****0001', email: 'old@nuoshu.cn', status: '停用', lastLogin: '2023-12-01 15:30' },
];

// 角色数据
export const rolesData = [
  { id: 'R001', name: '系统管理员', code: 'admin', description: '系统全权管理', userCount: 1, permissionCount: 45, status: '正常' },
  { id: 'R002', name: '决策领导', code: 'leader', description: '查看数据、分析报告、决策支持', userCount: 2, permissionCount: 18, status: '正常' },
  { id: 'R003', name: '科研人员', code: 'researcher', description: '数据查询、空间分析、专题制图', userCount: 3, permissionCount: 25, status: '正常' },
  { id: 'R004', name: '巡护管理员', code: 'patrol_manager', description: '巡护任务管理、轨迹监控、异常审批', userCount: 2, permissionCount: 22, status: '正常' },
  { id: 'R005', name: '巡护员', code: 'patroller', description: '任务执行、数据采集、异常上报', userCount: 8, permissionCount: 15, status: '正常' },
  { id: 'R006', name: '监控值班员', code: 'monitor', description: '视频监控、告警处理、工单派发', userCount: 4, permissionCount: 12, status: '正常' },
];

// 组织架构数据
export const orgStructureData = [
  {
    id: 'ORG001',
    name: '诺水河保护区管理局',
    type: '部门',
    leader: '王领导',
    staffCount: 20,
    children: [
      { id: 'ORG001-1', name: '综合管理部', type: '部门', leader: '张三', staffCount: 5 },
      { id: 'ORG001-2', name: '科研监测部', type: '部门', leader: '陈科研', staffCount: 4 },
      { id: 'ORG001-3', name: '巡护执法部', type: '部门', leader: '刘管理', staffCount: 8 },
      { id: 'ORG001-4', name: '信息管理中心', type: '部门', leader: '孙技术', staffCount: 3 },
    ],
  },
];

// 操作日志数据
export const operationLogsData = [
  { id: 'LOG001', user: '李巡护', action: '登录系统', module: '系统', ip: '192.168.1.101', time: '2024-01-15 14:30:25', status: '成功' },
  { id: 'LOG002', user: '李巡护', action: '提交巡护记录', module: '巡护管理', ip: '192.168.1.101', time: '2024-01-15 16:45:30', status: '成功' },
  { id: 'LOG003', user: '王管理员', action: '创建巡护任务', module: '巡护管理', ip: '192.168.1.10', time: '2024-01-15 09:15:00', status: '成功' },
  { id: 'LOG004', user: '陈科研', action: '导出物种数据', module: '生态数据', ip: '192.168.1.20', time: '2024-01-15 11:30:45', status: '成功' },
  { id: 'LOG005', user: '系统', action: '设备告警触发', module: '监测预警', ip: '系统', time: '2024-01-15 08:45:12', status: '告警' },
  { id: 'LOG006', user: '刘管理', action: '审批异常事件', module: '巡护管理', ip: '192.168.1.15', time: '2024-01-15 10:20:33', status: '成功' },
  { id: 'LOG007', user: 'admin', action: '修改用户权限', module: '系统管理', ip: '192.168.1.1', time: '2024-01-14 16:30:00', status: '成功' },
  { id: 'LOG008', user: '赵值班', action: '处理告警工单', module: '监测预警', ip: '192.168.1.30', time: '2024-01-14 15:10:20', status: '成功' },
];

// 地面调查数据
export const surveyRecordsData = [
  { id: 'SR001', title: '2024年春季鱼类多样性调查', surveyor: '陈科研', surveyDate: '2024-01-10', location: '诺水河干流', speciesCount: 15, status: '已完成', remarks: '数据已录入' },
  { id: 'SR002', title: '大鲵栖息地专项调查', surveyor: '张科研', surveyDate: '2024-01-08', location: '核心区', speciesCount: 3, status: '已完成', remarks: '发现幼鲵个体' },
  { id: 'SR003', title: '水生植物群落调查', surveyor: '陈科研', surveyDate: '2024-01-12', location: '澌滩河流域', speciesCount: 8, status: '进行中', remarks: '采样中' },
  { id: 'SR004', title: '冬季鸟类同步调查', surveyor: '李科研', surveyDate: '2024-01-05', location: '缓冲区', speciesCount: 22, status: '已完成', remarks: '记录黑鹳种群' },
];

// 遥感影像数据
export const remoteSensingData = [
  { id: 'RS001', name: 'GF1-2024-01-10', satellite: '高分一号', date: '2024-01-10', resolution: '16m', cloudCover: '5%', status: '已入库' },
  { id: 'RS002', name: 'GF2-2024-01-05', satellite: '高分二号', date: '2024-01-05', resolution: '1m', cloudCover: '8%', status: '已入库' },
  { id: 'RS003', name: 'ZY3-2023-12-20', satellite: '资源三号', date: '2023-12-20', resolution: '2.5m', cloudCover: '3%', status: '已入库' },
  { id: 'RS004', name: 'GF1-2023-12-15', satellite: '高分一号', date: '2023-12-15', resolution: '16m', cloudCover: '12%', status: '已处理' },
];

// 专题展示数据
export const thematicTopicsData: ThematicTopic[] = [
  {
    id: 'TT001',
    name: '诺水河自然保护区',
    code: 'NUOSHU_MAIN',
    description: '四川诺水河珍稀水生动物国家级自然保护区全景展示，涵盖水源、物种、巡护、功能区划与未来展望五大篇章。',
    coverColor: '#4FC3F7',
    icon: '🏞️',
    status: 'published',
    isDefault: true,
    createdBy: 'admin',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-15 14:30:00',
    viewCount: 1280,
    chapters: [
      {
        id: 1,
        title: '诺水河之源',
        subtitle: '千里嘉陵，水脉同源',
        description: '诺水河发源于陕西省南郑县米仓山南麓，自北向南流经通江全境，是嘉陵江重要支流。保护区内河道全长约 85 公里，流域面积 1200 余平方公里，孕育了丰富的水生生物资源。',
        color: '#4FC3F7',
        route: [
          [106.90, 33.00], [106.95, 32.80], [107.00, 32.60],
          [107.05, 32.40], [107.10, 32.20], [107.15, 32.05],
          [107.20, 31.90], [107.25, 31.75], [107.30, 31.60],
        ],
        waypoints: [
          { name: '源头', desc: '米仓山南麓，海拔 1600 米', lng: 106.90, lat: 33.00 },
          { name: '上游峡谷', desc: '水流湍急，河床深切', lng: 106.98, lat: 32.70 },
          { name: '核心区河段', desc: '大鲵栖息地，水质优良', lng: 107.12, lat: 32.15 },
          { name: '中游湿地', desc: '浅滩沙洲，水鸟聚集', lng: 107.22, lat: 31.85 },
          { name: '下游出口', desc: '汇入嘉陵江支流', lng: 107.30, lat: 31.60 },
        ],
        icon: '💧',
      },
      {
        id: 2,
        title: '珍稀生灵',
        subtitle: '水中精灵，国宝家园',
        description: '保护区内栖息着大鲵、岩原鲤、中华鲟、水獭等多种国家重点保护野生动物。大鲵——世界上最大的两栖动物，被称为"水中大熊猫"；岩原鲤——长江上游特有珍稀鱼类，是淡水生态系统的重要旗舰物种。',
        color: '#81C784',
        route: [
          [107.05, 32.20], [107.08, 32.15], [107.10, 32.10],
          [107.12, 32.05], [107.15, 32.00], [107.18, 31.95],
          [107.20, 31.90],
        ],
        waypoints: [
          { name: '大鲵栖息地', desc: '核心区，水质清澈的溶洞', lng: 107.08, lat: 32.18 },
          { name: '岩原鲤产卵场', desc: '水流平缓的卵石河滩', lng: 107.12, lat: 32.08 },
          { name: '中华鲟洄游通道', desc: '保护区核心河段', lng: 107.15, lat: 32.02 },
          { name: '水獭活动区', desc: '沿岸带，食物丰富', lng: 107.18, lat: 31.95 },
          { name: '金线鲃栖息', desc: '喀斯特地下溶洞水域', lng: 107.20, lat: 31.92 },
        ],
        icon: '🐟',
        speciesIds: ['1', '2', '3', '4', '5'],
      },
      {
        id: 3,
        title: '守护之路',
        subtitle: '巡护网络，全天候守护',
        description: '保护区构建了"空天地一体化"巡护体系：空中无人机遥感监测，地面巡护员日常巡查，水下声呐视频监控。2023 年累计巡护里程达 12,500 公里，查处非法行为 35 起，有效保护了保护区生态安全。',
        color: '#FFB74D',
        route: [
          [107.00, 32.15], [107.05, 32.12], [107.10, 32.10],
          [107.15, 32.08], [107.20, 32.05], [107.25, 32.02],
          [107.30, 32.00],
        ],
        waypoints: [
          { name: '空山管护站', desc: '北部巡护起点，监控覆盖', lng: 107.00, lat: 32.15 },
          { name: '核心区监控点', desc: '24 小时视频监控', lng: 107.08, lat: 32.11 },
          { name: '水质自动监测站', desc: '实时监测水质参数', lng: 107.13, lat: 32.09 },
          { name: '涪阳管护站', desc: '中部巡护枢纽', lng: 107.20, lat: 32.06 },
          { name: '诺江管护站', desc: '南部巡护终点', lng: 107.30, lat: 32.00 },
        ],
        icon: '🛡️',
        stats: [
          { label: '累计巡护里程', value: '12,500', unit: 'km' },
          { label: '巡护站点', value: '8', unit: '个' },
          { label: '监测设备', value: '35', unit: '台' },
          { label: '查处案件', value: '35', unit: '起' },
        ],
      },
      {
        id: 4,
        title: '功能区划',
        subtitle: '三区划分，科学保护',
        description: '保护区划分为核心区、缓冲区和实验区三大功能区。核心区 8,200 公顷，是绝对保护区域；缓冲区 12,400 公顷，作为生态过渡带；实验区 6,500 公顷，开展科研监测和生态体验活动。',
        color: '#BA68C8',
        route: [
          [107.05, 32.25], [107.08, 32.20], [107.10, 32.15],
          [107.12, 32.10], [107.15, 32.05], [107.18, 32.00],
          [107.20, 31.95], [107.25, 31.90],
        ],
        waypoints: [
          { name: '核心区北界', desc: '绝对保护区起点', lng: 107.05, lat: 32.25 },
          { name: '核心区中心', desc: '大鲵核心栖息地', lng: 107.10, lat: 32.15 },
          { name: '缓冲区中心', desc: '生态缓冲过渡带', lng: 107.15, lat: 32.05 },
          { name: '实验区中心', desc: '科研监测活动区', lng: 107.20, lat: 31.95 },
          { name: '核心区南界', desc: '保护区最南端', lng: 107.25, lat: 31.90 },
        ],
        icon: '🗺️',
      },
      {
        id: 5,
        title: '未来展望',
        subtitle: '科技赋能，永续发展',
        description: '展望未来，保护区将深化智慧保护体系建设：AI 智能识别野生动物、区块链记录保护数据、卫星遥感宏观监测。让绿水青山真正成为金山银山，让子孙后代能继续欣赏诺水河的清澈与生机。',
        color: '#F06292',
        route: [
          [107.00, 32.30], [107.05, 32.20], [107.10, 32.10],
          [107.15, 32.00], [107.20, 31.90], [107.25, 31.80],
          [107.30, 31.70], [107.35, 31.60],
        ],
        waypoints: [
          { name: '生态科普基地', desc: '环境教育与生态体验', lng: 107.00, lat: 32.30 },
          { name: 'AI 监测中心', desc: '智能识别与预警', lng: 107.10, lat: 32.10 },
          { name: '种质资源库', desc: '珍稀物种基因保存', lng: 107.18, lat: 31.92 },
          { name: '生态旅游区', desc: '可持续生态体验', lng: 107.28, lat: 31.72 },
          { name: '未来示范区', desc: '智慧保护样板', lng: 107.35, lat: 31.60 },
        ],
        icon: '🌿',
      },
    ],
  },
  {
    id: 'TT002',
    name: '大鲵保护专题',
    code: 'GIANT_SALAMANDER',
    description: '聚焦国家一级保护动物大鲵的生态习性、保护现状与科研进展，展示保护区在大鲵保护方面的重要成果。',
    coverColor: '#52C41A',
    icon: '🐸',
    status: 'published',
    createdBy: 'admin',
    createdAt: '2024-01-05 09:00:00',
    updatedAt: '2024-01-12 16:00:00',
    viewCount: 568,
    chapters: [
      {
        id: 1,
        title: '物种简介',
        subtitle: '水中大熊猫',
        description: '大鲵（Andrias davidianus）是世界上现存最大的两栖动物，被列为国家一级重点保护野生动物。它们生活在水质清澈、水温较低的山涧溪流中，对水环境要求极高。',
        color: '#52C41A',
        route: [
          [107.05, 32.20], [107.08, 32.18], [107.10, 32.15],
          [107.12, 32.12], [107.15, 32.08],
        ],
        waypoints: [
          { name: '核心栖息地', desc: '溶洞地下暗河，水质清澈', lng: 107.08, lat: 32.18 },
          { name: '产卵场', desc: '水流平缓的卵石河滩', lng: 107.10, lat: 32.15 },
          { name: '幼鲵活动区', desc: '浅滩水域，食物丰富', lng: 107.13, lat: 32.10 },
        ],
        icon: '🐸',
        speciesIds: ['1'],
      },
      {
        id: 2,
        title: '保护行动',
        subtitle: '科研与保护并重',
        description: '保护区建立了大鲵专项监测系统，包括水下声呐监测、红外相机监控和定期巡护调查。同时开展人工繁育研究，成功实现大鲵人工繁殖并进行野外放归。',
        color: '#1890FF',
        route: [
          [107.08, 32.18], [107.12, 32.15], [107.15, 32.12],
          [107.18, 32.08], [107.20, 32.05],
        ],
        waypoints: [
          { name: '科研监测站', desc: '24小时水下监控', lng: 107.10, lat: 32.16 },
          { name: '人工繁育基地', desc: '大鲵人工繁殖中心', lng: 107.14, lat: 32.12 },
          { name: '野外放归点', desc: '大鲵野化放归基地', lng: 107.18, lat: 32.07 },
        ],
        icon: '🔬',
        stats: [
          { label: '野生种群数量', value: '45', unit: '尾' },
          { label: '人工繁育', value: '120', unit: '尾' },
          { label: '监测站点', value: '15', unit: '个' },
        ],
      },
    ],
  },
  {
    id: 'TT003',
    name: '绿水青山生态之旅',
    code: 'ECO_TOURISM',
    description: '面向生态旅游和环境教育的体验专题，带领公众走进自然、认识自然、保护自然。',
    coverColor: '#FA8C16',
    icon: '🌄',
    status: 'draft',
    createdBy: 'leader',
    createdAt: '2024-01-10 14:00:00',
    updatedAt: '2024-01-14 11:20:00',
    viewCount: 0,
    chapters: [
      {
        id: 1,
        title: '生态体验路线',
        subtitle: '走进绿水青山',
        description: '精心设计的生态体验路线，让游客在欣赏自然风光的同时，了解自然保护区的生态保护价值。',
        color: '#FA8C16',
        route: [
          [107.00, 32.15], [107.05, 32.10], [107.10, 32.05],
          [107.15, 32.00], [107.20, 31.95], [107.25, 31.90],
        ],
        waypoints: [
          { name: '游客中心', desc: '生态科普与游客接待', lng: 107.00, lat: 32.15 },
          { name: '观景平台', desc: '俯瞰诺水河峡谷', lng: 107.08, lat: 32.08 },
          { name: '生态步道', desc: '森林中的体验步道', lng: 107.13, lat: 32.02 },
          { name: '科普基地', desc: '环境教育基地', lng: 107.20, lat: 31.95 },
        ],
        icon: '🌄',
      },
      {
        id: 2,
        title: '自然观察指南',
        subtitle: '探索身边的自然',
        description: '提供详细的自然观察指南，帮助游客识别保护区内常见的动植物种类。',
        color: '#13C2C2',
        route: [
          [107.05, 32.12], [107.10, 32.08], [107.15, 32.05],
          [107.20, 32.00],
        ],
        waypoints: [
          { name: '鸟类观察点', desc: '水鸟栖息湿地', lng: 107.07, lat: 32.10 },
          { name: '植物鉴赏区', desc: '珍稀植物展示区', lng: 107.13, lat: 32.04 },
          { name: '昆虫观察区', desc: '蝴蝶和昆虫聚集地', lng: 107.19, lat: 31.98 },
        ],
        icon: '🔍',
      },
    ],
  },
];
