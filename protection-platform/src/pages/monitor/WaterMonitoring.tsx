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
  Modal,
  Descriptions,
  Select,
  DatePicker,
  Input,
  Badge,
  Statistic,
  Tabs,
  List,
  Avatar,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApiOutlined,
  AlertOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FilterOutlined,
  LineChartOutlined,
  BankOutlined,
  CloudOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  monitorDevices,
  monitorDataList,
} from '@/mock';
import type { MonitorDevice, MonitorData } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// 水质监测站点数据
const waterStations = [
  {
    id: 'WS001',
    name: '大鲵栖息地水质监测站',
    location: '核心区-大鲵栖息地',
    river: '诺水河干流',
    status: 'online' as const,
    lastData: {
      timestamp: '2024-01-15 14:29:58',
      waterLevel: 1.25,
      ph: 7.2,
      dissolvedOxygen: 8.5,
      turbidity: 12.3,
      cod: 15.2,
      ammonia: 0.15,
    },
  },
  {
    id: 'WS002',
    name: '澌滩河水质监测站',
    location: '澌滩河-永安镇',
    river: '澌滩河',
    status: 'online' as const,
    lastData: {
      timestamp: '2024-01-15 14:28:42',
      waterLevel: 0.85,
      ph: 6.8,
      dissolvedOxygen: 6.2,
      turbidity: 25.6,
      cod: 28.5,
      ammonia: 0.45,
    },
  },
  {
    id: 'WS003',
    name: '涪阳镇断面监测点',
    location: '诺水河干流-涪阳镇',
    river: '诺水河干流',
    status: 'online' as const,
    lastData: {
      timestamp: '2024-01-15 14:25:00',
      waterLevel: 1.8,
      ph: 7.5,
      dissolvedOxygen: 7.8,
      turbidity: 15.2,
      cod: 18.5,
      ammonia: 0.22,
    },
  },
  {
    id: 'WS004',
    name: '诺江镇断面监测点',
    location: '诺水河干流-诺江镇',
    river: '诺水河干流',
    status: 'offline' as const,
    lastData: {
      timestamp: '2024-01-15 12:15:33',
      waterLevel: 2.1,
      ph: 7.3,
      dissolvedOxygen: 7.2,
      turbidity: 18.5,
      cod: 20.1,
      ammonia: 0.28,
    },
  },
];

// 历史数据
const generateHistoricalData = (days: number = 7) => {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    data.push({
      date,
      ph: 6.8 + Math.random() * 0.8,
      dissolvedOxygen: 6.5 + Math.random() * 2.5,
      turbidity: 10 + Math.random() * 20,
      cod: 15 + Math.random() * 15,
      ammonia: 0.1 + Math.random() * 0.4,
      waterLevel: 0.8 + Math.random() * 1.5,
    });
  }
  return data;
};

const historicalData = generateHistoricalData(30);

const WaterMonitoring: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<typeof waterStations[0] | null>(null);
  const [stationModalVisible, setStationModalVisible] = useState(false);
  const [selectedRiver, setSelectedRiver] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // 获取水质监测设备
  const waterDevices = monitorDevices.filter(d => d.type === 'water_sensor');

  // 过滤站点
  const filteredStations = waterStations.filter(station => {
    const matchRiver = selectedRiver === 'all' || station.river === selectedRiver;
    return matchRiver;
  });

  // 水质等级评估
  const getWaterQualityLevel = (data: typeof waterStations[0]['lastData']) => {
    const { ph, dissolvedOxygen, turbidity, cod, ammonia } = data;
    let score = 100;
    let level = '优秀';
    let levelColor = '#52c41a';

    // pH评分
    if (ph < 6 || ph > 9) {
      score -= 30;
      level = '较差';
      levelColor = '#ff4d4f';
    } else if (ph < 6.5 || ph > 8.5) {
      score -= 15;
      level = '一般';
      levelColor = '#faad14';
    }

    // 溶解氧评分
    if (dissolvedOxygen < 5) {
      score -= 30;
      level = '较差';
      levelColor = '#ff4d4f';
    } else if (dissolvedOxygen < 7) {
      score -= 15;
      if (level !== '较差') {
        level = '一般';
        levelColor = '#faad14';
      }
    }

    // 氨氮评分
    if (ammonia > 0.5) {
      score -= 25;
      level = '较差';
      levelColor = '#ff4d4f';
    } else if (ammonia > 0.2) {
      score -= 10;
      if (level !== '较差') {
        level = '一般';
        levelColor = '#faad14';
      }
    }

    if (score >= 90) {
      level = '优秀';
      levelColor = '#52c41a';
    } else if (score >= 70) {
      level = '良好';
      levelColor = '#1890ff';
    } else if (score >= 50) {
      level = '一般';
      levelColor = '#faad14';
    } else {
      level = '较差';
      levelColor = '#ff4d4f';
    }

    return { score, level, levelColor };
  };

  // pH趋势图
  const phTrendOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: historicalData.map(d => d.date),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: 'pH',
      min: 5,
      max: 9,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        name: 'pH',
        type: 'line',
        data: historicalData.map(d => d.ph.toFixed(1)),
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2 },
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24,144,255,0.3)' },
            { offset: 1, color: 'rgba(24,144,255,0)' },
          ]),
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#faad14', type: 'dashed' },
          data: [
            { yAxis: 6, name: '下限' },
            { yAxis: 9, name: '上限' },
          ],
        },
      },
    ],
  };

  // 溶解氧趋势图
  const dissolvedOxygenOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: historicalData.map(d => d.date),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: 'DO (mg/L)',
      min: 0,
      max: 12,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        name: '溶解氧',
        type: 'line',
        data: historicalData.map(d => d.dissolvedOxygen.toFixed(1)),
        smooth: true,
        lineStyle: { color: '#52c41a', width: 2 },
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82,196,26,0.3)' },
            { offset: 1, color: 'rgba(82,196,26,0)' },
          ]),
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          data: [{ yAxis: 5, name: '最低标准' }],
        },
      },
    ],
  };

  // 氨氮趋势图
  const ammoniaOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: historicalData.map(d => d.date),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: '氨氮 (mg/L)',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        name: '氨氮',
        type: 'bar',
        data: historicalData.map(d => d.ammonia.toFixed(2)),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#722ed1' },
            { offset: 1, color: '#9254de' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#faad14', type: 'dashed' },
          data: [{ yAxis: 0.2, name: '一级标准' }, { yAxis: 0.5, name: '二级标准' }],
        },
      },
    ],
  };

  // 多站点对比图
  const comparisonOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['大鲵栖息地', '澌滩河', '涪阳镇'],
      bottom: 0,
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
      data: ['pH', '溶解氧', '浊度', 'COD', '氨氮'],
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        name: '大鲵栖息地',
        type: 'radar',
        data: [
          [7.2, 8.5, 12.3, 15.2, 0.15].map(v => v / 10),
        ],
        lineStyle: { color: '#52c41a' },
        areaStyle: { color: 'rgba(82,196,26,0.2)' },
      },
      {
        name: '澌滩河',
        type: 'radar',
        data: [
          [6.8, 6.2, 25.6, 28.5, 0.45].map(v => v / 10),
        ],
        lineStyle: { color: '#ff4d4f' },
        areaStyle: { color: 'rgba(255,77,79,0.2)' },
      },
      {
        name: '涪阳镇',
        type: 'radar',
        data: [
          [7.5, 7.8, 15.2, 18.5, 0.22].map(v => v / 10),
        ],
        lineStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24,144,255,0.2)' },
      },
    ],
  };

  // 水位趋势图
  const waterLevelOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: historicalData.map(d => d.date),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: '水位 (m)',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      {
        name: '水位',
        type: 'line',
        data: historicalData.map(d => d.waterLevel.toFixed(2)),
        smooth: true,
        lineStyle: { color: '#1B5E8C', width: 2 },
        itemStyle: { color: '#1B5E8C' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(27,94,140,0.4)' },
            { offset: 1, color: 'rgba(27,94,140,0)' },
          ]),
        },
      },
    ],
  };

  // 站点列表列定义
  const stationColumns: ColumnsType<typeof waterStations[0]> = [
    {
      title: '监测站点',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar
            size="small"
            style={{ background: record.status === 'online' ? '#52c41a' : '#ff4d4f' }}
            icon={<CloudOutlined />}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '所属河流',
      dataIndex: 'river',
      key: 'river',
      render: (river) => <Tag color="blue">{river}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'online' ? 'success' : 'error'}>
          {status === 'online' ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '最新数据时间',
      dataIndex: ['lastData', 'timestamp'],
      key: 'timestamp',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setSelectedStation(record);
            setStationModalVisible(true);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="water-monitoring fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">水质监测</h1>
          <span className="page-subtitle">水质数据实时监测与分析</span>
        </div>
        <div className="page-header-actions">
          <Button icon={<SyncOutlined />}>
            数据同步
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="监测站点总数"
              value={waterStations.length}
              prefix={<BankOutlined style={{ color: '#1B5E8C' }} />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="在线站点"
              value={waterStations.filter(s => s.status === 'online').length}
              prefix={<AlertOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="监测指标数"
              value={5}
              prefix={<LineChartOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="pH值趋势">
            <ReactECharts option={phTrendOption} style={{ height: 280 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="溶解氧趋势">
            <ReactECharts option={dissolvedOxygenOption} style={{ height: 280 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="氨氮浓度趋势">
            <ReactECharts option={ammoniaOption} style={{ height: 280 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="水位变化趋势">
            <ReactECharts option={waterLevelOption} style={{ height: 280 }} />
          </Card>
        </Col>
      </Row>

      {/* 多站点对比 */}
      <Card title="多站点水质对比" style={{ marginBottom: 24 }}>
        <ReactECharts option={comparisonOption} style={{ height: 350 }} />
      </Card>

      {/* 监测站点列表 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BankOutlined style={{ color: '#1B5E8C' }} />
            <span>监测站点列表</span>
            <Badge count={filteredStations.length} style={{ backgroundColor: '#1B5E8C' }} />
          </div>
        }
        extra={
          <Space>
            <Select
              placeholder="选择河流"
              value={selectedRiver}
              onChange={setSelectedRiver}
              style={{ width: 150 }}
            >
              <Option value="all">全部河流</Option>
              <Option value="诺水河干流">诺水河干流</Option>
              <Option value="澌滩河">澌滩河</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            />
          </Space>
        }
      >
        <Table
          columns={stationColumns}
          dataSource={filteredStations}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 站点详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BankOutlined style={{ color: '#1B5E8C' }} />
            <span>站点详情 - {selectedStation?.name}</span>
          </div>
        }
        open={stationModalVisible}
        onCancel={() => setStationModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setStationModalVisible(false)}>关闭</Button>
            <Button type="primary" icon={<LineChartOutlined />}>
              查看历史曲线
            </Button>
          </Space>
        }
        width={800}
      >
        {selectedStation && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="站点编号">{selectedStation.id}</Descriptions.Item>
              <Descriptions.Item label="所属河流">
                <Tag color="blue">{selectedStation.river}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="安装位置" span={2}>
                {selectedStation.location}
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={selectedStation.status === 'online' ? 'success' : 'error'}>
                  {selectedStation.status === 'online' ? '在线' : '离线'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="数据更新时间">
                {selectedStation.lastData.timestamp}
              </Descriptions.Item>
            </Descriptions>

            {/* 水质评估 */}
            <Card size="small" style={{ marginTop: 16 }} bodyStyle={{ padding: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={6}>
                  <Statistic
                    title="水质等级"
                    value={getWaterQualityLevel(selectedStation.lastData).level}
                    valueStyle={{
                      color: getWaterQualityLevel(selectedStation.lastData).levelColor,
                      fontWeight: 'bold',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="综合评分"
                    value={getWaterQualityLevel(selectedStation.lastData).score}
                    suffix="分"
                    valueStyle={{ color: '#1B5E8C' }}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>水质评价</div>
                    <div style={{ fontSize: 14 }}>
                      {getWaterQualityLevel(selectedStation.lastData).level === '优秀' && '各项指标均符合国家地表水环境质量标准。'}
                      {getWaterQualityLevel(selectedStation.lastData).level === '良好' && '各项指标基本达标，水质良好。'}
                      {getWaterQualityLevel(selectedStation.lastData).level === '一般' && '部分指标略有超标，建议关注。'}
                      {getWaterQualityLevel(selectedStation.lastData).level === '较差' && '多项指标超标，需要重点关注并采取治理措施。'}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 最新监测数据 */}
            <Card size="small" style={{ marginTop: 16 }} bodyStyle={{ padding: 16 }}>
              <h4 style={{ marginBottom: 12 }}>最新监测数据</h4>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="水位 (m)"
                    value={selectedStation.lastData.waterLevel}
                    valueStyle={{ color: '#1B5E8C' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="pH值"
                    value={selectedStation.lastData.ph}
                    valueStyle={{ color: selectedStation.lastData.ph < 6 || selectedStation.lastData.ph > 9 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="溶解氧 (mg/L)"
                    value={selectedStation.lastData.dissolvedOxygen}
                    valueStyle={{ color: selectedStation.lastData.dissolvedOxygen < 5 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="浊度 (NTU)"
                    value={selectedStation.lastData.turbidity}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="COD (mg/L)"
                    value={selectedStation.lastData.cod}
                    valueStyle={{ color: selectedStation.lastData.cod > 20 ? '#faad14' : '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="氨氮 (mg/L)"
                    value={selectedStation.lastData.ammonia}
                    valueStyle={{ color: selectedStation.lastData.ammonia > 0.2 ? '#faad14' : '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WaterMonitoring;
