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
  Rate,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EnvironmentOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { speciesList } from '@/mock';

const { Option } = Select;

// 生境适宜性评估数据
const habitatData = [
  {
    id: 'H1',
    name: '核心区大鲵栖息地',
    species: '大鲵',
    suitability: 92,
    level: 'excellent',
    area: 15.2,
    waterQuality: 95,
    foodSupply: 88,
    shelter: 94,
    disturbance: 8,
    location: '核心区',
    assessment: '2024-01-15',
    evaluator: '陈科研',
    description: '水质清澈，水温适宜，洞穴资源丰富，食物充足，是大鲵理想的栖息繁殖场所',
    suggestions: ['继续加强水质保护', '减少人为干扰', '保护自然洞穴'],
  },
  {
    id: 'H2',
    name: '涪阳镇岩原鲤栖息地',
    species: '岩原鲤',
    suitability: 78,
    level: 'good',
    area: 22.8,
    waterQuality: 82,
    foodSupply: 75,
    shelter: 80,
    disturbance: 25,
    location: '涪阳镇-诺江镇',
    assessment: '2024-01-10',
    evaluator: '张科研',
    description: '河段环境良好，食物资源丰富，需注意防洪和人为捕捞压力',
    suggestions: ['加强渔政执法', '恢复河岸植被', '控制人为干扰'],
  },
  {
    id: 'H3',
    name: '空山乡水獭栖息地',
    species: '水獭',
    suitability: 85,
    level: 'good',
    area: 12.5,
    waterQuality: 90,
    foodSupply: 80,
    shelter: 85,
    disturbance: 15,
    location: '空山乡河段',
    assessment: '2024-01-12',
    evaluator: '陈科研',
    description: '水质优良，鱼类资源丰富，河岸陡峭提供良好庇护所',
    suggestions: ['保护水质', '维护河岸生态', '监测鱼类资源'],
  },
  {
    id: 'H4',
    name: '澌滩河金线鲃栖息地',
    species: '金线鲃',
    suitability: 62,
    level: 'moderate',
    area: 18.6,
    waterQuality: 55,
    foodSupply: 65,
    shelter: 70,
    disturbance: 42,
    location: '澌滩河流域',
    assessment: '2024-01-08',
    evaluator: '王科研',
    description: '近年水质有所下降，部分河段富营养化，需重点治理',
    suggestions: ['治理水体污染', '削减农业面源污染', '加强监测'],
  },
  {
    id: 'H5',
    name: '缓冲区鸟类栖息地',
    species: '鸟类',
    suitability: 88,
    level: 'excellent',
    area: 45.3,
    waterQuality: 85,
    foodSupply: 90,
    shelter: 88,
    disturbance: 12,
    location: '缓冲区',
    assessment: '2024-01-05',
    evaluator: '李科研',
    description: '植被覆盖率高，物种多样性丰富，是鸟类重要的觅食和繁殖场所',
    suggestions: ['保护森林植被', '减少开发活动', '发展生态旅游'],
  },
];

// 评估指标配置
const indicatorConfig = [
  { key: 'waterQuality', label: '水质状况', weight: 0.3, maxScore: 100 },
  { key: 'foodSupply', label: '食物供给', weight: 0.25, maxScore: 100 },
  { key: 'shelter', label: '庇护条件', weight: 0.25, maxScore: 100 },
  { key: 'disturbance', label: '人为干扰', weight: 0.2, maxScore: 100, inverse: true },
];

interface Habitat {
  id: string;
  name: string;
  species: string;
  suitability: number;
  level: 'excellent' | 'good' | 'moderate' | 'poor';
  area: number;
  waterQuality: number;
  foodSupply: number;
  shelter: number;
  disturbance: number;
  location: string;
  assessment: string;
  evaluator: string;
  description: string;
  suggestions: string[];
}

const HabitatSuitability: React.FC = () => {
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // 过滤后的数据
  const filteredData = habitatData.filter(item => {
    const matchSpecies = speciesFilter === 'all' || item.species === speciesFilter;
    const matchLevel = levelFilter === 'all' || item.level === levelFilter;
    return matchSpecies && matchLevel;
  });

  // 获取等级信息
  const getLevelInfo = (level: string) => {
    const map: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      excellent: { color: 'green', text: '优秀', icon: <CheckCircleOutlined /> },
      good: { color: 'cyan', text: '良好', icon: <CheckCircleOutlined /> },
      moderate: { color: 'orange', text: '中等', icon: <ExclamationCircleOutlined /> },
      poor: { color: 'red', text: '较差', icon: <CloseCircleOutlined /> },
    };
    return map[level] || { color: 'default', text: level, icon: null };
  };

  // 表格列定义
  const columns: ColumnsType<Habitat> = [
    {
      title: '生境名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '目标物种',
      dataIndex: 'species',
      key: 'species',
      width: 100,
      render: (species) => <Tag color="blue">{species}</Tag>,
    },
    {
      title: '适宜性指数',
      dataIndex: 'suitability',
      key: 'suitability',
      width: 130,
      sorter: (a, b) => a.suitability - b.suitability,
      render: (value, record) => {
        const { color } = getLevelInfo(record.level);
        return (
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color }}>{value}</span>
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
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '水质',
      dataIndex: 'waterQuality',
      key: 'waterQuality',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '食物',
      dataIndex: 'foodSupply',
      key: 'foodSupply',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '庇护',
      dataIndex: 'shelter',
      key: 'shelter',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '干扰',
      dataIndex: 'disturbance',
      key: 'disturbance',
      width: 90,
      render: (value) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={value <= 20 ? '#52c41a' : value <= 40 ? '#faad14' : '#ff4d4f'}
          showInfo={false}
          style={{ width: 60, display: 'inline-block' }}
        />
      ),
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      render: (area) => `${area} km²`,
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
            setSelectedHabitat(record);
            setDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 适宜性等级分布
  const levelDistribution = [
    { level: '优秀', count: habitatData.filter(h => h.level === 'excellent').length, color: '#52c41a' },
    { level: '良好', count: habitatData.filter(h => h.level === 'good').length, color: '#13c2c2' },
    { level: '中等', count: habitatData.filter(h => h.level === 'moderate').length, color: '#faad14' },
    { level: '较差', count: habitatData.filter(h => h.level === 'poor').length, color: '#ff4d4f' },
  ];

  // 雷达图配置
  const radarOption = {
    tooltip: {},
    legend: {
      data: ['优秀标准', '当前评估'],
      bottom: 0,
    },
    radar: {
      indicator: indicatorConfig.map(ind => ({
        name: ind.label + (ind.inverse ? '(低优)' : ''),
        max: ind.maxScore,
      })),
      radius: '60%',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [95, 90, 90, 15],
            name: '优秀标准',
            lineStyle: { color: '#52c41a' },
            areaStyle: { color: 'rgba(82, 196, 26, 0.2)' },
            itemStyle: { color: '#52c41a' },
          },
          selectedHabitat ? {
            value: [
              selectedHabitat.waterQuality,
              selectedHabitat.foodSupply,
              selectedHabitat.shelter,
              selectedHabitat.disturbance,
            ],
            name: '当前评估',
            lineStyle: { color: '#1B5E8C' },
            areaStyle: { color: 'rgba(27, 94, 140, 0.2)' },
            itemStyle: { color: '#1B5E8C' },
          } : {},
        ].filter(Boolean),
      },
    ],
  };

  // 面积与适宜性关系图
  const areaSuitabilityOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}<br/>适宜性: ${params.value}%`,
    },
    grid: { left: '3%', right: '10%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      name: '面积 (km²)',
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: '适宜性指数',
      max: 100,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        type: 'scatter',
        data: habitatData.map(h => ({
          value: [h.area, h.suitability],
          name: h.name,
          itemStyle: {
            color: getLevelInfo(h.level).color,
          },
        })),
        symbolSize: (data: number[]) => Math.sqrt(data[0]) * 3,
        label: {
          show: true,
          formatter: (params: any) => params.name.split('-')[0],
          position: 'top',
          fontSize: 10,
        },
      },
    ],
  };

  // 平均指标雷达图
  const avgRadarOption = {
    tooltip: {},
    radar: {
      indicator: indicatorConfig.map(ind => ({
        name: ind.label,
        max: 100,
      })),
      radius: '55%',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              habitatData.reduce((sum, h) => sum + h.waterQuality, 0) / habitatData.length,
              habitatData.reduce((sum, h) => sum + h.foodSupply, 0) / habitatData.length,
              habitatData.reduce((sum, h) => sum + h.shelter, 0) / habitatData.length,
              habitatData.reduce((sum, h) => sum + h.disturbance, 0) / habitatData.length,
            ],
            name: '平均指标',
            lineStyle: { color: '#722ed1' },
            areaStyle: { color: 'rgba(114, 46, 209, 0.2)' },
            itemStyle: { color: '#722ed1' },
          },
        ],
      },
    ],
  };

  return (
    <div className="habitat-suitability fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            生境适宜性评价
          </h1>
          <p className="page-subtitle">保护区栖息地适宜性评估与分析</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />}>新增评估</Button>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="评估生境"
              value={habitatData.length}
              prefix={<EnvironmentOutlined style={{ color: '#2D7D46' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="平均适宜性"
              value={Math.round(habitatData.reduce((sum, h) => sum + h.suitability, 0) / habitatData.length)}
              suffix="/100"
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="优秀生境"
              value={habitatData.filter(h => h.level === 'excellent' || h.level === 'good').length}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="需改善生境"
              value={habitatData.filter(h => h.level === 'moderate' || h.level === 'poor').length}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧列表区域 */}
        <Col xs={24} lg={16}>
          <Card
            title="评估结果"
            extra={
              <Space>
                <Select value={speciesFilter} onChange={setSpeciesFilter} style={{ width: 130 }}>
                  <Option value="all">全部物种</Option>
                  {speciesList.slice(0, 5).map(s => (
                    <Option key={s.id} value={s.name}>{s.name}</Option>
                  ))}
                </Select>
                <Select value={levelFilter} onChange={setLevelFilter} style={{ width: 110 }}>
                  <Option value="all">全部等级</Option>
                  <Option value="excellent">优秀</Option>
                  <Option value="good">良好</Option>
                  <Option value="moderate">中等</Option>
                  <Option value="poor">较差</Option>
                </Select>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>

          {/* 面积与适宜性关系 */}
          <Card title="面积与适宜性关系" style={{ marginTop: 16 }}>
            <ReactECharts option={areaSuitabilityOption} style={{ height: 280 }} />
          </Card>
        </Col>

        {/* 右侧统计区域 */}
        <Col xs={24} lg={8}>
          <Card title="等级分布" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {levelDistribution.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 2, 
                        background: item.color,
                        display: 'inline-block',
                      }} />
                      {item.level}
                    </span>
                    <span style={{ fontWeight: 600 }}>{item.count} 个</span>
                  </div>
                  <Progress
                    percent={(item.count / habitatData.length) * 100}
                    showInfo={false}
                    strokeColor={item.color}
                    trailColor="#f0f0f0"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="平均指标">
            <ReactECharts option={avgRadarOption} style={{ height: 250 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细评估指标 */}
      <Card title="评估指标体系" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          {indicatorConfig.map((indicator, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card size="small" bodyStyle={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{indicator.label}</span>
                  <Tag color={indicator.inverse ? 'orange' : 'blue'}>
                    权重 {(indicator.weight * 100).toFixed(0)}%
                  </Tag>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1B5E8C' }}>
                  {(habitatData.reduce((sum, h) => sum + h[indicator.key as keyof Habitat] as number, 0) / habitatData.length).toFixed(1)}
                  <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>/100</span>
                </div>
                <Progress
                  percent={habitatData.reduce((sum, h) => sum + h[indicator.key as keyof Habitat] as number, 0) / habitatData.length}
                  showInfo={false}
                  strokeColor={indicator.inverse ? '#faad14' : '#2D7D46'}
                  style={{ marginTop: 8 }}
                />
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                  {indicator.inverse ? '越低越好' : '越高越好'}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="生境适宜性评估详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
        width={800}
      >
        {selectedHabitat && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="生境名称" span={2}>
                      <span style={{ fontWeight: 600 }}>{selectedHabitat.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="目标物种">
                      <Tag color="blue">{selectedHabitat.species}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="位置">
                      {selectedHabitat.location}
                    </Descriptions.Item>
                    <Descriptions.Item label="面积">
                      {selectedHabitat.area} km²
                    </Descriptions.Item>
                    <Descriptions.Item label="评估日期">
                      {selectedHabitat.assessment}
                    </Descriptions.Item>
                    <Descriptions.Item label="评估人">
                      {selectedHabitat.evaluator}
                    </Descriptions.Item>
                    <Descriptions.Item label="适宜性指数">
                      <span style={{ fontWeight: 700, fontSize: 18, color: getLevelInfo(selectedHabitat.level).color }}>
                        {selectedHabitat.suitability}
                      </span>
                      <span style={{ color: '#999' }}>/100</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="等级">
                      <Tag color={getLevelInfo(selectedHabitat.level).color} icon={getLevelInfo(selectedHabitat.level).icon}>
                        {getLevelInfo(selectedHabitat.level).text}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="生境描述" span={2}>
                      {selectedHabitat.description}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'indicators',
                label: '指标评估',
                children: (
                  <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      {[
                        { label: '水质状况', value: selectedHabitat.waterQuality, key: 'waterQuality' },
                        { label: '食物供给', value: selectedHabitat.foodSupply, key: 'foodSupply' },
                        { label: '庇护条件', value: selectedHabitat.shelter, key: 'shelter' },
                        { label: '人为干扰', value: selectedHabitat.disturbance, key: 'disturbance', inverse: true },
                      ].map((item, index) => (
                        <Col span={12} key={index} style={{ marginBottom: 16 }}>
                          <Card size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span>{item.label}</span>
                              <span style={{ fontWeight: 600 }}>{item.value}/100</span>
                            </div>
                            <Progress
                              percent={item.value}
                              strokeColor={item.inverse 
                                ? (item.value <= 20 ? '#52c41a' : item.value <= 40 ? '#faad14' : '#ff4d4f')
                                : (item.value >= 80 ? '#52c41a' : item.value >= 60 ? '#faad14' : '#ff4d4f')
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <ReactECharts option={radarOption} style={{ height: 300 }} />
                  </div>
                ),
              },
              {
                key: 'suggestions',
                label: '保护建议',
                children: (
                  <Card size="small">
                    <List
                      header={<div>保护建议</div>}
                      dataSource={selectedHabitat.suggestions}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Tag color="blue">{index + 1}</Tag>
                          {item}
                        </List.Item>
                      )}
                    />
                  </Card>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default HabitatSuitability;