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
  DatePicker,
  Modal,
  Descriptions,
 Statistic,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  LineChartOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { speciesList, speciesDistributionData } from '@/mock';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟种群监测数据
const populationData: PopulationRecord[] = [
  { id: '1', speciesId: '1', speciesName: '大鲵', year: 2024, quarter: 'Q1', population: 48, trend: 'increase', location: '核心区', waterQuality: '优', remarks: '繁殖成功' },
  { id: '2', speciesId: '1', speciesName: '大鲵', year: 2023, quarter: 'Q4', population: 45, trend: 'stable', location: '核心区', waterQuality: '优', remarks: '' },
  { id: '3', speciesId: '1', speciesName: '大鲵', year: 2023, quarter: 'Q3', population: 43, trend: 'stable', location: '核心区', waterQuality: '良', remarks: '' },
  { id: '4', speciesId: '2', speciesName: '岩原鲤', year: 2024, quarter: 'Q1', population: 156, trend: 'increase', location: '涪阳镇-诺江镇', waterQuality: '良', remarks: '资源恢复' },
  { id: '5', speciesId: '2', speciesName: '岩原鲤', year: 2023, quarter: 'Q4', population: 142, trend: 'increase', location: '涪阳镇-诺江镇', waterQuality: '良', remarks: '' },
  { id: '6', speciesId: '2', speciesName: '岩原鲤', year: 2023, quarter: 'Q3', population: 135, trend: 'stable', location: '涪阳镇-诺江镇', waterQuality: '良', remarks: '' },
  { id: '7', speciesId: '3', speciesName: '中华鲟', year: 2024, quarter: 'Q1', population: 3, trend: 'stable', location: '诺水河下游', waterQuality: '良', remarks: '野生个体' },
  { id: '8', speciesId: '4', speciesName: '水獭', year: 2024, quarter: 'Q1', population: 8, trend: 'increase', location: '空山乡河段', waterQuality: '优', remarks: '活动范围扩大' },
  { id: '9', speciesId: '5', speciesName: '金线鲃', year: 2024, quarter: 'Q1', population: 89, trend: 'decrease', location: '澌滩河流域', waterQuality: '中', remarks: '需关注水质' },
];

// 总体趋势数据
const trendData = {
  years: ['2019', '2020', '2021', '2022', '2023', '2024'],
  species: [
    { name: '大鲵', data: [32, 35, 38, 42, 45, 48] },
    { name: '岩原鲤', data: [98, 108, 120, 128, 142, 156] },
    { name: '水獭', data: [3, 4, 5, 6, 7, 8] },
    { name: '金线鲃', data: [120, 115, 108, 100, 95, 89] },
  ],
};

interface PopulationRecord {
  id: string;
  speciesId: string;
  speciesName: string;
  year: number;
  quarter: string;
  population: number;
  trend: 'increase' | 'stable' | 'decrease';
  location: string;
  waterQuality: string;
  remarks?: string;
}

const PopulationMonitoring: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<PopulationRecord | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // 过滤后的数据
  const filteredData = populationData.filter(item => {
    const matchSpecies = speciesFilter === 'all' || item.speciesId === speciesFilter;
    const matchYear = yearFilter === 'all' || item.year.toString() === yearFilter;
    return matchSpecies && matchYear;
  });

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increase':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'decrease':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <MinusOutlined style={{ color: '#999' }} />;
    }
  };

  // 获取趋势文字
  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'increase':
        return '上升';
      case 'decrease':
        return '下降';
      default:
        return '稳定';
    }
  };

  // 表格列定义
  const columns: ColumnsType<PopulationRecord> = [
    {
      title: '物种名称',
      dataIndex: 'speciesName',
      key: 'speciesName',
      width: 120,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '监测时间',
      key: 'monitorTime',
      width: 140,
      render: (_, record) => `${record.year}年 ${record.quarter}`,
    },
    {
      title: '种群数量',
      dataIndex: 'population',
      key: 'population',
      width: 120,
      sorter: (a, b) => a.population - b.population,
      render: (value) => <span style={{ fontWeight: 600, color: '#1B5E8C' }}>{value}</span>,
    },
    {
      title: '变化趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: (trend) => (
        <Space>
          {getTrendIcon(trend)}
          <span style={{ 
            color: trend === 'increase' ? '#52c41a' : trend === 'decrease' ? '#ff4d4f' : '#999' 
          }}>
            {getTrendText(trend)}
          </span>
        </Space>
      ),
    },
    {
      title: '分布区域',
      dataIndex: 'location',
      key: 'location',
      width: 160,
    },
    {
      title: '水质状况',
      dataIndex: 'waterQuality',
      key: 'waterQuality',
      width: 100,
      render: (quality) => (
        <Tag color={
          quality === '优' ? 'green' : quality === '良' ? 'cyan' : 'orange'
        }>
          {quality}
        </Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
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
            setSelectedRecord(record);
            setDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 种群趋势图配置
  const trendOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
    },
    legend: {
      data: trendData.species.map(s => s.name),
      bottom: 0,
      itemWidth: 16,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: trendData.years,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: '种群数量',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: trendData.species.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      lineStyle: { 
        width: 2,
        color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14'][index % 4],
      },
      itemStyle: { 
        color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14'][index % 4],
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14'][index % 4] + '40' },
            { offset: 1, color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14'][index % 4] + '05' },
          ],
        },
      },
    })),
  };

  // 物种构成饼图
  const compositionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: speciesList.slice(0, 5).map((s, index) => ({
          value: [48, 156, 3, 8, 89][index],
          name: s.name,
          itemStyle: {
            color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14', '#722ed1'][index],
          },
        })),
      },
    ],
  };

  // 各物种现状统计
  const speciesStats = speciesList.slice(0, 5).map((s, index) => {
    const populations = [48, 156, 3, 8, 89];
    const trends = ['increase', 'increase', 'stable', 'increase', 'decrease'];
    const data = trendData.species[index]?.data || [];
    const change = data.length >= 2 ? ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1) : '0';
    return {
      ...s,
      population: populations[index],
      trend: trends[index],
      change: parseFloat(change),
    };
  });

  return (
    <div className="population-monitoring fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <LineChartOutlined style={{ marginRight: 8 }} />
            种群监测数据
          </h1>
          <p className="page-subtitle">保护区重点物种种群数量变化追踪与分析</p>
        </div>
        <div className="page-header-actions">
          <Button icon={<DownloadOutlined />}>导出数据</Button>
        </div>
      </div>

      {/* 统计概览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="监测物种数"
              value={5}
              prefix={<LineChartOutlined style={{ color: '#2D7D46' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="总个体数"
              value={304}
              suffix="尾"
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="增长物种"
              value={3}
              suffix="种"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="下降物种"
              value={1}
              suffix="种"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧列表区域 */}
        <Col xs={24} lg={16}>
          <Card
            title="监测数据列表"
            extra={
              <Space>
                <Select
                  value={speciesFilter}
                  onChange={setSpeciesFilter}
                  style={{ width: 140 }}
                >
                  <Option value="all">全部物种</Option>
                  {speciesList.slice(0, 5).map(s => (
                    <Option key={s.id} value={s.id}>{s.name}</Option>
                  ))}
                </Select>
                <Select
                  value={yearFilter}
                  onChange={setYearFilter}
                  style={{ width: 100 }}
                >
                  <Option value="all">全部年份</Option>
                  <Option value="2024">2024年</Option>
                  <Option value="2023">2023年</Option>
                  <Option value="2022">2022年</Option>
                </Select>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              size="middle"
            />
          </Card>

          {/* 趋势分析图 */}
          <Card title="种群数量年度趋势" style={{ marginTop: 16 }}>
            <ReactECharts option={trendOption} style={{ height: 350 }} />
          </Card>
        </Col>

        {/* 右侧统计区域 */}
        <Col xs={24} lg={8}>
          <Card title="物种构成" style={{ marginBottom: 16 }}>
            <ReactECharts option={compositionOption} style={{ height: 280 }} />
          </Card>

          <Card title="各物种现状">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {speciesStats.map((stat, index) => (
                <Card key={stat.id} size="small" bodyStyle={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{stat.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        数量: <span style={{ fontWeight: 500, color: '#1B5E8C' }}>{stat.population}</span> 尾
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: stat.trend === 'increase' ? '#52c41a' : stat.trend === 'decrease' ? '#ff4d4f' : '#999',
                        gap: 4,
                      }}>
                        {getTrendIcon(stat.trend)}
                        <span>{getTrendText(stat.trend)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        较2019年 {stat.change > 0 ? '+' : ''}{stat.change}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    percent={Math.min(100, (stat.population / 200) * 100)}
                    showInfo={false}
                    strokeColor={['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14', '#722ed1'][index]}
                    trailColor="#f0f0f0"
                    style={{ marginTop: 8 }}
                  />
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详情弹窗 */}
      <Modal
        title="监测详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
        width={600}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="物种名称" span={2}>
              <span style={{ fontWeight: 600 }}>{selectedRecord.speciesName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="监测时间">
              {selectedRecord.year}年 {selectedRecord.quarter}
            </Descriptions.Item>
            <Descriptions.Item label="种群数量">
              <span style={{ fontWeight: 600, color: '#1B5E8C' }}>{selectedRecord.population}</span> 尾
            </Descriptions.Item>
            <Descriptions.Item label="变化趋势">
              <Space>
                {getTrendIcon(selectedRecord.trend)}
                <span>{getTrendText(selectedRecord.trend)}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="水质状况">
              <Tag color={
                selectedRecord.waterQuality === '优' ? 'green' : 
                selectedRecord.waterQuality === '良' ? 'cyan' : 'orange'
              }>
                {selectedRecord.waterQuality}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="分布区域" span={2}>
              {selectedRecord.location}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {selectedRecord.remarks || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PopulationMonitoring;