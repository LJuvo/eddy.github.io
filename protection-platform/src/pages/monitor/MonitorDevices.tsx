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
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApiOutlined,
  VideoCameraOutlined,
  AlertOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  monitorDevices,
  monitorDataList,
} from '@/mock';
import type { MonitorDevice, MonitorData } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MonitorDevices: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<MonitorDevice | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [deviceType, setDeviceType] = useState<string>('all');
  const [deviceStatus, setDeviceStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 设备类型图标
  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <VideoCameraOutlined style={{ fontSize: 20, color: '#1B5E8C' }} />;
      case 'water_sensor':
        return <AlertOutlined style={{ fontSize: 20, color: '#2D7D46' }} />;
      case 'air_sensor':
        return <AlertOutlined style={{ fontSize: 20, color: '#faad14' }} />;
      case 'weather_station':
        return <ApiOutlined style={{ fontSize: 20, color: '#722ed1' }} />;
      default:
        return <ApiOutlined style={{ fontSize: 20, color: '#666' }} />;
    }
  };

  // 设备类型名称
  const getDeviceTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      camera: '视频监控',
      water_sensor: '水质监测站',
      air_sensor: '空气监测站',
      weather_station: '气象监测站',
    };
    return typeMap[type] || type;
  };

  // 状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      online: { color: 'success', text: '在线', icon: <CheckCircleOutlined /> },
      offline: { color: 'error', text: '离线', icon: <StopOutlined /> },
      maintenance: { color: 'warning', text: '维护中', icon: <ToolOutlined /> },
    };
    const config = statusMap[status] || { color: 'default', text: status, icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 设备统计数据
  const deviceStats = {
    total: monitorDevices.length,
    online: monitorDevices.filter(d => d.status === 'online').length,
    offline: monitorDevices.filter(d => d.status === 'offline').length,
    maintenance: monitorDevices.filter(d => d.status === 'maintenance').length,
  };

  // 过滤设备
  const filteredDevices = monitorDevices.filter(device => {
    const matchType = deviceType === 'all' || device.type === deviceType;
    const matchStatus = deviceStatus === 'all' || device.status === deviceStatus;
    const matchSearch = searchText === '' || 
      device.name.toLowerCase().includes(searchText.toLowerCase()) ||
      device.location.toLowerCase().includes(searchText.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  // 表格列定义
  const columns: ColumnsType<MonitorDevice> = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string, record: MonitorDevice) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getDeviceTypeIcon(record.type)}
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag>{getDeviceTypeName(type)}</Tag>
      ),
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
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelectedDevice(record);
              setDetailModalVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => {
              setSelectedDevice(record);
              setControlModalVisible(true);
            }}
          >
            控制
          </Button>
        </Space>
      ),
    },
  ];

  // 设备状态分布图
  const statusDistributionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: [
          { value: deviceStats.online, name: '在线', itemStyle: { color: '#52c41a' } },
          { value: deviceStats.offline, name: '离线', itemStyle: { color: '#ff4d4f' } },
          { value: deviceStats.maintenance, name: '维护中', itemStyle: { color: '#faad14' } },
        ],
      },
    ],
  };

  // 设备类型分布图
  const typeDistributionOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['视频监控', '水质监测站', '空气监测站', '气象监测站'],
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
        name: '设备数量',
        type: 'bar',
        data: [
          monitorDevices.filter(d => d.type === 'camera').length,
          monitorDevices.filter(d => d.type === 'water_sensor').length,
          monitorDevices.filter(d => d.type === 'air_sensor').length,
          monitorDevices.filter(d => d.type === 'weather_station').length,
        ],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1B5E8C' },
            { offset: 1, color: '#2a7eb8' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  // 获取设备最新数据
  const getDeviceLatestData = (deviceId: string): MonitorData | undefined => {
    return monitorDataList.find(data => data.deviceId === deviceId);
  };

  // 刷新设备状态
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('设备状态已刷新');
    }, 1000);
  };

  // 控制设备
  const handleDeviceControl = (action: string) => {
    message.success(`已发送${action}指令到设备 ${selectedDevice?.name}`);
    setControlModalVisible(false);
  };

  return (
    <div className="monitor-devices fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">设备列表</h1>
          <span className="page-subtitle">监测设备管理与状态监控</span>
        </div>
        <div className="page-header-actions">
          <Button icon={<SyncOutlined />} onClick={handleRefresh} loading={loading}>
            刷新状态
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="设备总数"
              value={deviceStats.total}
              prefix={<ApiOutlined style={{ color: '#1B5E8C' }} />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="在线设备"
              value={deviceStats.online}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="离线设备"
              value={deviceStats.offline}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="维护中"
              value={deviceStats.maintenance}
              prefix={<ToolOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="设备状态分布">
            <ReactECharts option={statusDistributionOption} style={{ height: 240 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="设备类型分布">
            <ReactECharts option={typeDistributionOption} style={{ height: 240 }} />
          </Card>
        </Col>
      </Row>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="搜索设备名称或位置"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="设备类型"
              value={deviceType}
              onChange={setDeviceType}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">全部类型</Option>
              <Option value="camera">视频监控</Option>
              <Option value="water_sensor">水质监测站</Option>
              <Option value="air_sensor">空气监测站</Option>
              <Option value="weather_station">气象监测站</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="设备状态"
              value={deviceStatus}
              onChange={setDeviceStatus}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Badge status={loading ? 'processing' : 'success'} />
              <span style={{ color: '#666', fontSize: 13 }}>
                {loading ? '刷新中...' : `最后更新: ${dayjs().format('HH:mm:ss')}`}
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 设备列表表格 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ApiOutlined style={{ color: '#1B5E8C' }} />
            <span>设备列表</span>
            <Badge count={filteredDevices.length} style={{ backgroundColor: '#1B5E8C' }} />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDevices}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          loading={loading}
          size="middle"
        />
      </Card>

      {/* 设备详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedDevice && getDeviceTypeIcon(selectedDevice.type)}
            <span>设备详情</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            <Button type="primary" icon={<SettingOutlined />} onClick={() => {
              setDetailModalVisible(false);
              setControlModalVisible(true);
            }}>
              设备控制
            </Button>
          </Space>
        }
        width={700}
      >
        {selectedDevice && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="设备编号">{selectedDevice.id}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{selectedDevice.name}</Descriptions.Item>
              <Descriptions.Item label="设备类型">
                <Tag>{getDeviceTypeName(selectedDevice.type)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="设备状态">
                {getStatusTag(selectedDevice.status)}
              </Descriptions.Item>
              <Descriptions.Item label="安装位置" span={2}>
                {selectedDevice.location}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新时间" span={2}>
                {selectedDevice.lastUpdate}
              </Descriptions.Item>
            </Descriptions>

            {/* 设备最新监测数据 */}
            {getDeviceLatestData(selectedDevice.id) && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>最新监测数据</h4>
                <Card size="small" bodyStyle={{ padding: 12 }}>
                  {(() => {
                    const data = getDeviceLatestData(selectedDevice.id);
                    if (!data) return null;
                    if (data.waterLevel !== undefined) {
                      return (
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Statistic title="水位 (m)" value={data.waterLevel} />
                          </Col>
                          {data.waterQuality && (
                            <>
                              <Col span={12}>
                                <Statistic title="pH值" value={data.waterQuality.ph} />
                              </Col>
                              <Col span={12}>
                                <Statistic title="溶解氧 (mg/L)" value={data.waterQuality.dissolvedOxygen} />
                              </Col>
                              <Col span={12}>
                                <Statistic title="浊度 (NTU)" value={data.waterQuality.turbidity} />
                              </Col>
                              <Col span={12}>
                                <Statistic title="COD (mg/L)" value={data.waterQuality.cod} />
                              </Col>
                              <Col span={12}>
                                <Statistic title="氨氮 (mg/L)" value={data.waterQuality.ammonia} />
                              </Col>
                            </>
                          )}
                        </Row>
                      );
                    }
                    if (data.temperature !== undefined) {
                      return (
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Statistic title="温度 (°C)" value={data.temperature} />
                          </Col>
                          <Col span={12}>
                            <Statistic title="湿度 (%)" value={data.humidity} />
                          </Col>
                        </Row>
                      );
                    }
                    return null;
                  })()}
                  <div style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
                    数据更新时间: {getDeviceLatestData(selectedDevice.id)?.timestamp}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 设备控制弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined style={{ color: '#1B5E8C' }} />
            <span>设备控制 - {selectedDevice?.name}</span>
          </div>
        }
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedDevice && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleDeviceControl('重启')}
                  disabled={selectedDevice.status === 'offline'}
                >
                  重启设备
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  icon={<SyncOutlined />}
                  onClick={() => handleDeviceControl('校准')}
                  disabled={selectedDevice.status === 'offline'}
                >
                  校准传感器
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  icon={<AlertOutlined />}
                  onClick={() => handleDeviceControl('数据采集')}
                  disabled={selectedDevice.status === 'offline'}
                >
                  立即采集数据
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  icon={<ToolOutlined />}
                  onClick={() => handleDeviceControl('进入维护')}
                >
                  进入维护模式
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8 }}>设备信息</h4>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
                <Descriptions.Item label="设备类型">{getDeviceTypeName(selectedDevice.type)}</Descriptions.Item>
                <Descriptions.Item label="当前状态">{getStatusTag(selectedDevice.status)}</Descriptions.Item>
                <Descriptions.Item label="安装位置">{selectedDevice.location}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonitorDevices;
