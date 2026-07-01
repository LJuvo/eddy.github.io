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
  List,
  Avatar,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  TeamOutlined,
  ApartmentOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { speciesList } from '@/mock';

const { Option } = Select;

// 模拟群落结构数据
const communityData = [
  {
    id: 'C1',
    name: '核心区水生群落',
    type: '水生群落',
    location: '核心区',
    area: 15.2,
    speciesCount: 28,
    biodiversityIndex: 3.42,
    dominantSpecies: '大鲵、岩原鲤',
    status: 'healthy',
    waterQuality: '优',
    description: '水质清澈，物种多样性高，是保护区核心栖息地',
  },
  {
    id: 'C2',
    name: '涪阳镇河段群落',
    type: '河流群落',
    location: '涪阳镇-诺江镇',
    area: 22.8,
    speciesCount: 35,
    biodiversityIndex: 3.18,
    dominantSpecies: '岩原鲤、中华鲟',
    status: 'good',
    waterQuality: '良',
    description: '河段较长，物种丰富，需注意人为干扰',
  },
  {
    id: 'C3',
    name: '空山乡溪流群落',
    type: '溪流群落',
    location: '空山乡河段',
    area: 12.5,
    speciesCount: 18,
    biodiversityIndex: 2.89,
    dominantSpecies: '水獭、溪流鱼类',
    status: 'good',
    waterQuality: '优',
    description: '水流清澈，两岸植被良好',
  },
  {
    id: 'C4',
    name: '澌滩河湿群落',
    type: '湿生群落',
    location: '澌滩河流域',
    area: 18.6,
    speciesCount: 42,
    biodiversityIndex: 3.65,
    dominantSpecies: '金线鲃、水生植物',
    status: 'warning',
    waterQuality: '中',
    description: '近年来水质有所下降，需加强保护',
  },
  {
    id: 'C5',
    name: '缓冲区林草群落',
    type: '林草群落',
    location: '缓冲区',
    area: 45.3,
    speciesCount: 86,
    biodiversityIndex: 4.12,
    dominantSpecies: '鸟类、兽类',
    status: 'healthy',
    waterQuality: '优',
    description: '植被覆盖率高，野生动物栖息环境良好',
  },
];

// 物种组成数据
const speciesCompositionData = [
  { category: '鱼类', count: 45, percentage: 38.1, color: '#1B5E8C' },
  { category: '两栖类', count: 12, percentage: 10.2, color: '#2D7D46' },
  { category: '爬行类', count: 8, percentage: 6.8, color: '#faad14' },
  { category: '鸟类', count: 35, percentage: 29.7, color: '#722ed1' },
  { category: '哺乳类', count: 10, percentage: 8.5, color: '#eb2f96' },
  { category: '无脊椎动物', count: 8, percentage: 6.8, color: '#13c2c2' },
];

// 垂直结构数据
const verticalStructureData = [
  { layer: '乔木层', coverage: 65, height: '>8m', description: '主要树种包括杉木、柏木等' },
  { layer: '灌木层', coverage: 45, height: '1-8m', description: '主要物种有杜鹃、荆棘等' },
  { layer: '草本层', coverage: 80, height: '<1m', description: '物种丰富，包括蕨类、草本植物' },
  { layer: '地被层', coverage: 55, height: '<0.3m', description: '苔藓、地衣等' },
  { layer: '水生层', coverage: 35, height: '水下', description: '沉水植物、浮水植物' },
];

interface Community {
  id: string;
  name: string;
  type: string;
  location: string;
  area: number;
  speciesCount: number;
  biodiversityIndex: number;
  dominantSpecies: string;
  status: 'healthy' | 'good' | 'warning' | 'critical';
  waterQuality: string;
  description: string;
}

const CommunityStructure: React.FC = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 过滤后的数据
  const filteredData = communityData.filter(item => {
    const matchType = typeFilter === 'all' || item.type.includes(typeFilter);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchType && matchStatus;
  });

  // 获取状态标签
  const getStatusInfo = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      healthy: { color: 'green', text: '健康' },
      good: { color: 'cyan', text: '良好' },
      warning: { color: 'orange', text: '预警' },
      critical: { color: 'red', text: '危急' },
    };
    return map[status] || { color: 'default', text: status };
  };

  // 表格列定义
  const columns: ColumnsType<Community> = [
    {
      title: '群落名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => <Tag icon={<ApartmentOutlined />}>{type}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 140,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      render: (area) => `${area} km²`,
    },
    {
      title: '物种数',
      dataIndex: 'speciesCount',
      key: 'speciesCount',
      width: 90,
      sorter: (a, b) => a.speciesCount - b.speciesCount,
    },
    {
      title: '生物多样性指数',
      dataIndex: 'biodiversityIndex',
      key: 'biodiversityIndex',
      width: 140,
      render: (index) => (
        <span style={{ fontWeight: 600, color: index > 3.5 ? '#52c41a' : index > 3.0 ? '#1B5E8C' : '#faad14' }}>
          {index.toFixed(2)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const { color, text } = getStatusInfo(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '水质',
      dataIndex: 'waterQuality',
      key: 'waterQuality',
      width: 80,
      render: (quality) => (
        <Tag color={quality === '优' ? 'green' : quality === '良' ? 'cyan' : 'orange'}>
          {quality}
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
            setSelectedCommunity(record);
            setDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 物种组成饼图配置
  const compositionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}种 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: speciesCompositionData.map(item => ({
          value: item.count,
          name: `${item.category} ${item.percentage}%`,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  // 群落面积对比图
  const areaComparisonOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
    xAxis: {
      type: 'value',
      name: '面积 (km²)',
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'category',
      data: communityData.map(c => c.name),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: communityData.map(c => c.area),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#2D7D46' },
            { offset: 1, color: '#1B5E8C' },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
        barWidth: 20,
        label: { show: true, position: 'right', formatter: '{c} km²' },
      },
    ],
  };

  // 垂直结构雷达图配置
  const verticalStructureOption = {
    tooltip: {},
    radar: {
      indicator: verticalStructureData.map(item => ({
        name: item.layer,
        max: 100,
      })),
      radius: '65%',
      splitNumber: 4,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: verticalStructureData.map(item => item.coverage),
            name: '覆盖度 (%)',
            areaStyle: { color: 'rgba(45, 125, 70, 0.3)' },
            lineStyle: { color: '#2D7D46' },
            itemStyle: { color: '#2D7D46' },
          },
        ],
      },
    ],
  };

  return (
    <div className="community-structure fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <TeamOutlined style={{ marginRight: 8 }} />
            群落结构分析
          </h1>
          <p className="page-subtitle">保护区生态群落类型、结构和功能分析</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />}>新增群落</Button>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="群落总数"
              value={communityData.length}
              prefix={<TeamOutlined style={{ color: '#2D7D46' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="总物种数"
              value={118}
              suffix="种"
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="平均多样性指数"
              value={3.45}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="健康群落"
              value={communityData.filter(c => c.status === 'healthy' || c.status === 'good').length}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧列表区域 */}
        <Col xs={24} lg={16}>
          <Card
            title="群落列表"
            extra={
              <Space>
                <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 130 }}>
                  <Option value="all">全部类型</Option>
                  <Option value="水生">水生群落</Option>
                  <Option value="河流">河流群落</Option>
                  <Option value="溪流">溪流群落</Option>
                  <Option value="湿生">湿生群落</Option>
                  <Option value="林草">林草群落</Option>
                </Select>
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 110 }}>
                  <Option value="all">全部状态</Option>
                  <Option value="healthy">健康</Option>
                  <Option value="good">良好</Option>
                  <Option value="warning">预警</Option>
                  <Option value="critical">危急</Option>
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

          {/* 面积对比图 */}
          <Card title="各群落面积对比" style={{ marginTop: 16 }}>
            <ReactECharts option={areaComparisonOption} style={{ height: 280 }} />
          </Card>
        </Col>

        {/* 右侧统计区域 */}
        <Col xs={24} lg={8}>
          <Card title="物种组成" style={{ marginBottom: 16 }}>
            <ReactECharts option={compositionOption} style={{ height: 300 }} />
          </Card>

          <Card title="物种分类统计">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {speciesCompositionData.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: 2, 
                        background: item.color,
                        display: 'inline-block',
                      }} />
                      {item.category}
                    </span>
                    <span style={{ fontWeight: 500 }}>{item.count}种</span>
                  </div>
                  <Progress
                    percent={item.percentage}
                    showInfo={false}
                    strokeColor={item.color}
                    trailColor="#f0f0f0"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 群落结构分析 */}
      <Card title="垂直结构分析" style={{ marginTop: 16 }}>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <ReactECharts option={verticalStructureOption} style={{ height: 300 }} />
          </Col>
          <Col xs={24} lg={12}>
            <List
              dataSource={verticalStructureData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          background: item.layer.includes('乔木') ? '#2D7D46' : 
                                     item.layer.includes('灌木') ? '#1B5E8C' :
                                     item.layer.includes('草本') ? '#faad14' :
                                     item.layer.includes('地被') ? '#722ed1' : '#13c2c2',
                        }}
                      >
                        {item.layer.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <span>
                        {item.layer}
                        <Tag style={{ marginLeft: 8 }}>{item.height}</Tag>
                      </span>
                    }
                    description={
                      <div>
                        <div>{item.description}</div>
                        <div style={{ marginTop: 4 }}>
                          覆盖度: <Progress 
                            percent={item.coverage} 
                            size="small" 
                            style={{ width: 200, display: 'inline-block' }}
                          />
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="群落详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
        width={700}
      >
        {selectedCommunity && (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="群落名称" span={2}>
                      <span style={{ fontWeight: 600 }}>{selectedCommunity.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="类型">{selectedCommunity.type}</Descriptions.Item>
                    <Descriptions.Item label="位置">{selectedCommunity.location}</Descriptions.Item>
                    <Descriptions.Item label="面积">{selectedCommunity.area} km²</Descriptions.Item>
                    <Descriptions.Item label="物种数量">{selectedCommunity.speciesCount} 种</Descriptions.Item>
                    <Descriptions.Item label="生物多样性指数" span={2}>
                      <span style={{ fontWeight: 600, color: '#52c41a' }}>
                        {selectedCommunity.biodiversityIndex.toFixed(2)}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="主要物种" span={2}>
                      {selectedCommunity.dominantSpecies}
                    </Descriptions.Item>
                    <Descriptions.Item label="群落状态">
                      <Tag color={getStatusInfo(selectedCommunity.status).color}>
                        {getStatusInfo(selectedCommunity.status).text}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="水质状况">
                      <Tag color={selectedCommunity.waterQuality === '优' ? 'green' : selectedCommunity.waterQuality === '良' ? 'cyan' : 'orange'}>
                        {selectedCommunity.waterQuality}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="描述" span={2}>
                      {selectedCommunity.description}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'species',
                label: '物种组成',
                children: (
                  <List
                    size="small"
                    header={<div>主要物种</div>}
                    bordered
                    dataSource={selectedCommunity.dominantSpecies.split('、')}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default CommunityStructure;