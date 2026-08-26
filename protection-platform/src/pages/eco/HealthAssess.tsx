import React, { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Select,
  Progress,
  Modal,
  Descriptions,
  Tabs,
  Statistic,
  Timeline,
  Alert,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  HeartOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BellOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { speciesList, monitorDataList } from '@/mock';

const { Option } = Select;

// 健康评估指标类型
interface HealthIndicator {
  name: string;
  value: number;
  score: number;
  status: 'normal' | 'warning' | 'critical';
  description: string;
}

// 生态系统健康评估数据
const ecosystemHealthData: EcosystemHealth[] = [
  {
    id: 'EH1',
    name: '诺水河干流生态系统',
    type: '河流生态系统',
    location: '涪阳镇-诺江镇',
    overallScore: 78,
    level: 'good',
    waterEnvironment: { score: 82, status: 'normal' as const },
    biodiversity: { score: 75, status: 'normal' as const },
    habitatQuality: { score: 80, status: 'normal' as const },
    socialSupport: { score: 72, status: 'warning' as const },
    lastAssessment: '2024-01-15',
    trend: 'stable',
    description: '河流生态系统整体健康，水质良好，物种多样性处于正常水平',
  },
  {
    id: 'EH2',
    name: '核心区大鲵栖息地生态系统',
    type: '淡水生态系统',
    location: '核心区',
    overallScore: 88,
    level: 'excellent',
    waterEnvironment: { score: 92, status: 'normal' as const },
    biodiversity: { score: 85, status: 'normal' as const },
    habitatQuality: { score: 90, status: 'normal' as const },
    socialSupport: { score: 82, status: 'normal' as const },
    lastAssessment: '2024-01-10',
    trend: 'increase',
    description: '核心区生态系统健康状况优良，水质清澈，适合珍稀物种栖息',
  },
  {
    id: 'EH3',
    name: '澌滩河流域生态系统',
    type: '湿地生态系统',
    location: '澌滩河流域',
    overallScore: 58,
    level: 'warning',
    waterEnvironment: { score: 48, status: 'critical' as const },
    biodiversity: { score: 62, status: 'warning' as const },
    habitatQuality: { score: 65, status: 'warning' as const },
    socialSupport: { score: 55, status: 'warning' as const },
    lastAssessment: '2024-01-08',
    trend: 'decrease',
    description: '部分河段水质较差，富营养化趋势，需要重点治理',
  },
];

// 物种健康评估数据
const speciesHealthData: SpeciesHealth[] = [
  {
    id: 'SH1',
    speciesId: '1',
    speciesName: '大鲵',
    populationHealth: 85,
    habitatHealth: 90,
    geneticDiversity: 78,
    diseaseRisk: 'low',
    overallScore: 84,
    level: 'excellent',
    trend: 'increase',
    lastAssessment: '2024-01-15',
    remarks: '种群数量稳定增长，繁殖成功率高',
  },
  {
    id: 'SH2',
    speciesId: '2',
    speciesName: '岩原鲤',
    populationHealth: 75,
    habitatHealth: 72,
    geneticDiversity: 70,
    diseaseRisk: 'medium',
    overallScore: 72,
    level: 'good',
    trend: 'increase',
    lastAssessment: '2024-01-12',
    remarks: '资源恢复中，但仍需保护',
  },
  {
    id: 'SH3',
    speciesId: '3',
    speciesName: '中华鲟',
    populationHealth: 35,
    habitatHealth: 45,
    geneticDiversity: 40,
    diseaseRisk: 'high',
    overallScore: 40,
    level: 'critical',
    trend: 'stable',
    lastAssessment: '2024-01-10',
    remarks: '野生种群数量极少，处于极危状态',
  },
  {
    id: 'SH4',
    speciesId: '4',
    speciesName: '水獭',
    populationHealth: 80,
    habitatHealth: 85,
    geneticDiversity: 75,
    diseaseRisk: 'low',
    overallScore: 80,
    level: 'good',
    trend: 'increase',
    lastAssessment: '2024-01-12',
    remarks: '种群数量持续增长',
  },
  {
    id: 'SH5',
    speciesId: '5',
    speciesName: '金线鲃',
    populationHealth: 55,
    habitatHealth: 48,
    geneticDiversity: 60,
    diseaseRisk: 'medium',
    overallScore: 54,
    level: 'warning',
    trend: 'decrease',
    lastAssessment: '2024-01-08',
    remarks: '受水质影响较大，需关注水质变化',
  },
];

interface EcosystemHealth {
  id: string;
  name: string;
  type: string;
  location: string;
  overallScore: number;
  level: 'excellent' | 'good' | 'warning' | 'critical';
  waterEnvironment: { score: number; status: 'normal' | 'warning' | 'critical' };
  biodiversity: { score: number; status: 'normal' | 'warning' | 'critical' };
  habitatQuality: { score: number; status: 'normal' | 'warning' | 'critical' };
  socialSupport: { score: number; status: 'normal' | 'warning' | 'critical' };
  lastAssessment: string;
  trend: 'increase' | 'stable' | 'decrease';
  description: string;
}

interface SpeciesHealth {
  id: string;
  speciesId: string;
  speciesName: string;
  populationHealth: number;
  habitatHealth: number;
  geneticDiversity: number;
  diseaseRisk: 'low' | 'medium' | 'high';
  overallScore: number;
  level: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'increase' | 'stable' | 'decrease';
  lastAssessment: string;
  remarks: string;
}

const HealthAssess: React.FC = () => {
  const [selectedEcosystem, setSelectedEcosystem] = useState<EcosystemHealth | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesHealth | null>(null);
  const [ecosystemDetailVisible, setEcosystemDetailVisible] = useState(false);
  const [speciesDetailVisible, setSpeciesDetailVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ecosystem');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // 获取等级信息
  const getLevelInfo = (level: string) => {
    const map: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      excellent: { color: 'green', text: '优秀', icon: <CheckCircleOutlined /> },
      good: { color: 'cyan', text: '良好', icon: <CheckCircleOutlined /> },
      warning: { color: 'orange', text: '预警', icon: <WarningOutlined /> },
      critical: { color: 'red', text: '危急', icon: <CloseCircleOutlined /> },
    };
    return map[level] || { color: 'default', text: level, icon: null };
  };

  // 获取疾病风险标签
  const getDiseaseRiskInfo = (risk: string) => {
    const map: Record<string, { color: string; text: string }> = {
      low: { color: 'green', text: '低风险' },
      medium: { color: 'orange', text: '中风险' },
      high: { color: 'red', text: '高风险' },
    };
    return map[risk] || { color: 'default', text: risk };
  };

  // 生态系统表格列
  const ecosystemColumns: ColumnsType<EcosystemHealth> = [
    {
      title: '生态系统名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 140,
    },
    {
      title: '综合得分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 120,
      sorter: (a, b) => a.overallScore - b.overallScore,
      render: (value, record) => {
        const { color } = getLevelInfo(record.level);
        return (
          <div>
            <span style={{ fontWeight: 700, fontSize: 18, color }}>{value}</span>
            <span style={{ color: '#999' }}>/100</span>
          </div>
        );
      },
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level) => {
        const { color, text, icon } = getLevelInfo(level);
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: '水质环境',
      dataIndex: ['waterEnvironment', 'score'],
      key: 'waterEnvironment',
      width: 90,
      render: (value, record) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={record.waterEnvironment.status === 'normal' ? '#52c41a' : record.waterEnvironment.status === 'warning' ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '生物多样性',
      dataIndex: ['biodiversity', 'score'],
      key: 'biodiversity',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '栖息地质量',
      dataIndex: ['habitatQuality', 'score'],
      key: 'habitatQuality',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '社会支撑',
      dataIndex: ['socialSupport', 'score'],
      key: 'socialSupport',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '评估日期',
      dataIndex: 'lastAssessment',
      key: 'lastAssessment',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedEcosystem(record);
            setEcosystemDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 物种健康表格列
  const speciesHealthColumns: ColumnsType<SpeciesHealth> = [
    {
      title: '物种名称',
      dataIndex: 'speciesName',
      key: 'speciesName',
      width: 120,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '综合得分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 120,
      sorter: (a, b) => a.overallScore - b.overallScore,
      render: (value, record) => {
        const { color } = getLevelInfo(record.level);
        return (
          <div>
            <span style={{ fontWeight: 700, fontSize: 18, color }}>{value}</span>
            <span style={{ color: '#999' }}>/100</span>
          </div>
        );
      },
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level) => {
        const { color, text, icon } = getLevelInfo(level);
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: '种群健康度',
      dataIndex: 'populationHealth',
      key: 'populationHealth',
      width: 100,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 70, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '栖息地健康度',
      dataIndex: 'habitatHealth',
      key: 'habitatHealth',
      width: 100,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 70, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '遗传多样性',
      dataIndex: 'geneticDiversity',
      key: 'geneticDiversity',
      width: 100,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 70 ? '#52c41a' : value >= 50 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 70, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '疾病风险',
      dataIndex: 'diseaseRisk',
      key: 'diseaseRisk',
      width: 100,
      render: (risk) => {
        const { color, text } = getDiseaseRiskInfo(risk);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '变化趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: (trend) => (
        <Tag color={
          trend === 'increase' ? 'green' : trend === 'decrease' ? 'red' : 'default'
        }>
          {trend === 'increase' ? '↑ 上升' : trend === 'decrease' ? '↓ 下降' : '→ 稳定'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedSpecies(record);
            setSpeciesDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 生态系统健康雷达图
  const ecosystemRadarOption = {
    tooltip: {},
    legend: {
      data: ['评估指标'],
      bottom: 0,
    },
    radar: {
      indicator: [
        { name: '水质环境', max: 100 },
        { name: '生物多样性', max: 100 },
        { name: '栖息地质量', max: 100 },
        { name: '社会支撑', max: 100 },
      ],
      radius: '60%',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: selectedEcosystem ? [{
          value: [
            selectedEcosystem.waterEnvironment.score,
            selectedEcosystem.biodiversity.score,
            selectedEcosystem.habitatQuality.score,
            selectedEcosystem.socialSupport.score,
          ],
          name: '评估指标',
          lineStyle: { color: '#2D7D46' },
          areaStyle: { color: 'rgba(45, 125, 70, 0.3)' },
          itemStyle: { color: '#2D7D46' },
        }] : [],
      },
    ],
  };

  // 物种健康评估雷达图
  const speciesHealthRadarOption = {
    tooltip: {},
    legend: {
      data: ['健康评估'],
      bottom: 0,
    },
    radar: {
      indicator: [
        { name: '种群健康度', max: 100 },
        { name: '栖息地健康度', max: 100 },
        { name: '遗传多样性', max: 100 },
      ],
      radius: '60%',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: selectedSpecies ? [{
          value: [
            selectedSpecies.populationHealth,
            selectedSpecies.habitatHealth,
            selectedSpecies.geneticDiversity,
          ],
          name: '健康评估',
          lineStyle: { color: '#1B5E8C' },
          areaStyle: { color: 'rgba(27, 94, 140, 0.3)' },
          itemStyle: { color: '#1B5E8C' },
        }] : [],
      },
    ],
  };

  // 健康等级分布统计
  const levelStats = [
    { label: '优秀', count: ecosystemHealthData.filter(e => e.level === 'excellent').length + speciesHealthData.filter(s => s.level === 'excellent').length, color: '#52c41a' },
    { label: '良好', count: ecosystemHealthData.filter(e => e.level === 'good').length + speciesHealthData.filter(s => s.level === 'good').length, color: '#13c2c2' },
    { label: '预警', count: ecosystemHealthData.filter(e => e.level === 'warning').length + speciesHealthData.filter(s => s.level === 'warning').length, color: '#faad14' },
    { label: '危急', count: ecosystemHealthData.filter(e => e.level === 'critical').length + speciesHealthData.filter(s => s.level === 'critical').length, color: '#ff4d4f' },
  ];

  // 过滤数据
  const filteredEcosystemData = ecosystemHealthData.filter(e => levelFilter === 'all' || e.level === levelFilter);
  const filteredSpeciesHealthData = speciesHealthData.filter(s => levelFilter === 'all' || s.level === levelFilter);

  return (
    <div className="health-assess fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <HeartOutlined style={{ marginRight: 8 }} />
            健康评估
          </h1>
          <p className="page-subtitle">生态系统与物种健康状况评估</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />}>新建评估</Button>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
        </div>
      </div>

      {/* 预警提示 */}
      {ecosystemHealthData.some(e => e.level === 'warning' || e.level === 'critical') && (
        <Alert
          message="健康预警"
          description={`当前有 ${ecosystemHealthData.filter(e => e.level === 'warning' || e.level === 'critical').length} 个生态系统需要关注，其中澌滩河流域生态系统处于预警状态，请相关人员加强监测。`}
          type="warning"
          showIcon
          icon={<BellOutlined />}
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="link" onClick={() => setLevelFilter('warning')}>
              查看详情
            </Button>
          }
        />
      )}

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="生态系统"
              value={ecosystemHealthData.length}
              prefix={<ExperimentOutlined style={{ color: '#2D7D46' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="评估物种"
              value={speciesHealthData.length}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="平均得分"
              value={Math.round(
                [...ecosystemHealthData, ...speciesHealthData].reduce((sum, e) => sum + ('overallScore' in e ? e.overallScore : 0), 0) / 
                [...ecosystemHealthData, ...speciesHealthData].filter(e => 'overallScore' in e).length
              )}
              suffix="/100"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="预警数量"
              value={ecosystemHealthData.filter(e => e.level === 'warning' || e.level === 'critical').length + 
                     speciesHealthData.filter(s => s.level === 'warning' || s.level === 'critical').length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 健康等级分布 */}
      <Card title="健康等级分布" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {levelStats.map((stat, index) => (
            <Col xs={12} sm={6} key={index}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 700, 
                  color: stat.color,
                }}>
                  {stat.count}
                </div>
                <div style={{ color: '#666' }}>{stat.label}</div>
                <Progress
                  percent={(stat.count / (ecosystemHealthData.length + speciesHealthData.length)) * 100}
                  showInfo={false}
                  strokeColor={stat.color}
                  style={{ marginTop: 8 }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 评估列表 */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              type="card"
              style={{ marginBottom: 0 }}
              items={[
                { key: 'ecosystem', label: '生态系统健康' },
                { key: 'species', label: '物种健康评估' },
              ]}
            />
            <Select value={levelFilter} onChange={setLevelFilter} style={{ width: 120 }}>
              <Option value="all">全部等级</Option>
              <Option value="excellent">优秀</Option>
              <Option value="good">良好</Option>
              <Option value="warning">预警</Option>
              <Option value="critical">危急</Option>
            </Select>
          </div>
        }
        headStyle={{ paddingBottom: 0 }}
      >
        {activeTab === 'ecosystem' && (
          <Table
            columns={ecosystemColumns}
            dataSource={filteredEcosystemData}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        )}
        {activeTab === 'species' && (
          <Table
            columns={speciesHealthColumns}
            dataSource={filteredSpeciesHealthData}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        )}
      </Card>

      {/* 生态系统详情弹窗 */}
      <Modal
        title="生态系统健康评估详情"
        open={ecosystemDetailVisible}
        onCancel={() => setEcosystemDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setEcosystemDetailVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
        width={800}
      >
        {selectedEcosystem && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="生态系统名称" span={2}>
                      <span style={{ fontWeight: 600 }}>{selectedEcosystem.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="类型">{selectedEcosystem.type}</Descriptions.Item>
                    <Descriptions.Item label="位置">{selectedEcosystem.location}</Descriptions.Item>
                    <Descriptions.Item label="综合得分">
                      <span style={{ fontWeight: 700, fontSize: 18, color: getLevelInfo(selectedEcosystem.level).color }}>
                        {selectedEcosystem.overallScore}
                      </span>
                      <span style={{ color: '#999' }}>/100</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="健康等级">
                      <Tag color={getLevelInfo(selectedEcosystem.level).color} icon={getLevelInfo(selectedEcosystem.level).icon}>
                        {getLevelInfo(selectedEcosystem.level).text}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="变化趋势">
                      <Tag color={
                        selectedEcosystem.trend === 'increase' ? 'green' : 
                        selectedEcosystem.trend === 'decrease' ? 'red' : 'default'
                      }>
                        {selectedEcosystem.trend === 'increase' ? '↑ 上升' : 
                         selectedEcosystem.trend === 'decrease' ? '↓ 下降' : '→ 稳定'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="评估日期">
                      {selectedEcosystem.lastAssessment}
                    </Descriptions.Item>
                    <Descriptions.Item label="生态系统描述" span={2}>
                      {selectedEcosystem.description}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'indicators',
                label: '评估指标',
                children: (
                  <Row gutter={16}>
                    <Col span={24}>
                      <ReactECharts option={ecosystemRadarOption} style={{ height: 280 }} />
                    </Col>
                    {[
                      { label: '水质环境', data: selectedEcosystem.waterEnvironment },
                      { label: '生物多样性', data: selectedEcosystem.biodiversity },
                      { label: '栖息地质量', data: selectedEcosystem.habitatQuality },
                      { label: '社会支撑', data: selectedEcosystem.socialSupport },
                    ].map((item, index) => (
                      <Col span={12} key={index} style={{ marginBottom: 16 }}>
                        <Card size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span>{item.label}</span>
                            <Tag color={item.data.status === 'normal' ? 'green' : item.data.status === 'warning' ? 'orange' : 'red'}>
                              {item.data.status === 'normal' ? '正常' : item.data.status === 'warning' ? '预警' : '危急'}
                            </Tag>
                          </div>
                          <div style={{ fontSize: 24, fontWeight: 700 }}>
                            {item.data.score}
                            <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>/100</span>
                          </div>
                          <Progress
                            percent={item.data.score}
                            strokeColor={item.data.status === 'normal' ? '#52c41a' : item.data.status === 'warning' ? '#faad14' : '#ff4d4f'}
                            style={{ marginTop: 8 }}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              },
            ]}
          />
        )}
      </Modal>

      {/* 物种健康详情弹窗 */}
      <Modal
        title="物种健康评估详情"
        open={speciesDetailVisible}
        onCancel={() => setSpeciesDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setSpeciesDetailVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
        width={700}
      >
        {selectedSpecies && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="物种名称" span={2}>
                      <span style={{ fontWeight: 600 }}>{selectedSpecies.speciesName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="综合得分">
                      <span style={{ fontWeight: 700, fontSize: 18, color: getLevelInfo(selectedSpecies.level).color }}>
                        {selectedSpecies.overallScore}
                      </span>
                      <span style={{ color: '#999' }}>/100</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="健康等级">
                      <Tag color={getLevelInfo(selectedSpecies.level).color} icon={getLevelInfo(selectedSpecies.level).icon}>
                        {getLevelInfo(selectedSpecies.level).text}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="疾病风险">
                      <Tag color={getDiseaseRiskInfo(selectedSpecies.diseaseRisk).color}>
                        {getDiseaseRiskInfo(selectedSpecies.diseaseRisk).text}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="变化趋势">
                      <Tag color={
                        selectedSpecies.trend === 'increase' ? 'green' : 
                        selectedSpecies.trend === 'decrease' ? 'red' : 'default'
                      }>
                        {selectedSpecies.trend === 'increase' ? '↑ 上升' : 
                         selectedSpecies.trend === 'decrease' ? '↓ 下降' : '→ 稳定'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="评估日期">
                      {selectedSpecies.lastAssessment}
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={2}>
                      {selectedSpecies.remarks}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'indicators',
                label: '健康指标',
                children: (
                  <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      {[
                        { label: '种群健康度', value: selectedSpecies.populationHealth, key: 'population' },
                        { label: '栖息地健康度', value: selectedSpecies.habitatHealth, key: 'habitat' },
                        { label: '遗传多样性', value: selectedSpecies.geneticDiversity, key: 'genetic' },
                      ].map((item, index) => (
                        <Col span={8} key={index}>
                          <Card size="small">
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>
                              {item.value}
                              <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>/100</span>
                            </div>
                            <Progress
                              percent={item.value}
                              strokeColor={item.value >= 70 ? '#52c41a' : item.value >= 50 ? '#faad14' : '#ff4d4f'}
                              style={{ marginTop: 8 }}
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <ReactECharts option={speciesHealthRadarOption} style={{ height: 250 }} />
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default HealthAssess;