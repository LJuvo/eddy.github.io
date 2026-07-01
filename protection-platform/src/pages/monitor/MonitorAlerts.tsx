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
  Timeline,
  List,
  Avatar,
  Typography,
  Statistic,
  message,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AlertOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  BellOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
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

// 告警类型定义
type AlertType = 'water_level' | 'water_quality' | 'equipment' | 'environment';
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
type AlertStatus = 'pending' | 'processing' | 'resolved' | 'closed';

// 告警数据
const alertData = [
  {
    id: 'ALERT001',
    type: 'water_quality' as AlertType,
    severity: 'high' as AlertSeverity,
    title: '澌滩河氨氮浓度超标',
    content: '澌滩河水质监测站检测到氨氮浓度达到0.45mg/L，超过一级水质标准(0.2mg/L)',
    location: '澌滩河-永安镇',
    deviceId: 'DEV005',
    deviceName: '澌滩河水质监测站',
    value: { ammonia: 0.45, threshold: 0.2 },
    status: 'processing' as AlertStatus,
    reportTime: '2024-01-15 14:28:42',
    handler: '张值班',
    handleTime: '2024-01-15 14:35:00',
    resolveTime: null,
    remarks: '已安排人员现场排查',
  },
  {
    id: 'ALERT002',
    type: 'water_level' as AlertType,
    severity: 'medium' as AlertSeverity,
    title: '诺水河干流水位异常下降',
    content: '大鲵栖息地监测站检测到水位异常下降，当前水位1.25m，较昨日同时段下降0.3m',
    location: '诺水河干流-涪阳镇',
    deviceId: 'DEV002',
    deviceName: '大鲵栖息地水质监测站',
    value: { waterLevel: 1.25, normalLevel: 1.55, change: -0.3 },
    status: 'pending' as AlertStatus,
    reportTime: '2024-01-15 10:15:00',
    handler: null,
    handleTime: null,
    resolveTime: null,
    remarks: null,
  },
  {
    id: 'ALERT003',
    type: 'equipment' as AlertType,
    severity: 'critical' as AlertSeverity,
    title: '诺水河干流监控点-2设备离线',
    content: '诺水河干流监控点-2设备已离线超过2小时，最后在线时间2024-01-15 12:15:33',
    location: '诺水河干流-诺江镇',
    deviceId: 'DEV004',
    deviceName: '诺水河干流监控点-2',
    value: { offlineDuration: 2.5 },
    status: 'pending' as AlertStatus,
    reportTime: '2024-01-15 14:30:00',
    handler: null,
    handleTime: null,
    resolveTime: null,
    remarks: null,
  },
  {
    id: 'ALERT004',
    type: 'water_quality' as AlertType,
    severity: 'medium' as AlertSeverity,
    title: '澌滩河溶解氧偏低',
    content: '澌滩河水质监测站检测到溶解氧浓度为6.2mg/L，略低于正常范围(7.0mg/L)',
    location: '澌滩河-永安镇',
    deviceId: 'DEV005',
    deviceName: '澌滩河水质监测站',
    value: { dissolvedOxygen: 6.2, threshold: 7.0 },
    status: 'resolved' as AlertStatus,
    reportTime: '2024-01-14 08:20:00',
    handler: '李值班',
    handleTime: '2024-01-14 08:30:00',
    resolveTime: '2024-01-14 10:15:00',
    remarks: '经排查为上游农田退水导致，已恢复正常',
  },
  {
    id: 'ALERT005',
    type: 'equipment' as AlertType,
    severity: 'low' as AlertSeverity,
    title: '气象监测站-澌滩乡进入维护模式',
    content: '气象监测站-澌滩乡设备进入维护模式，计划维护时间2024-01-15 08:00至18:00',
    location: '澌滩乡气象站',
    deviceId: 'DEV006',
    deviceName: '气象监测站-澌滩乡',
    value: { maintenanceMode: true },
    status: 'closed' as AlertStatus,
    reportTime: '2024-01-15 08:00:00',
    handler: '王技术',
    handleTime: '2024-01-15 08:00:00',
    resolveTime: '2024-01-15 17:30:00',
    remarks: '设备维护已完成',
  },
  {
    id: 'ALERT006',
    type: 'water_quality' as AlertType,
    severity: 'high' as AlertSeverity,
    title: '诺水河干流pH值异常',
    content: '诺水河干流监控点-1检测到pH值为6.3，低于正常范围(6.5-8.5)',
    location: '诺水河干流-涪阳镇',
    deviceId: 'DEV001',
    deviceName: '诺水河干流监控点-1',
    value: { ph: 6.3, lowerThreshold: 6.5 },
    status: 'pending' as AlertStatus,
    reportTime: '2024-01-15 09:45:00',
    handler: null,
    handleTime: null,
    resolveTime: null,
    remarks: null,
  },
];

const MonitorAlerts: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<typeof alertData[0] | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [alertType, setAlertType] = useState<string>('all');
  const [alertSeverity, setAlertSeverity] = useState<string>('all');
  const [alertStatus, setAlertStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 统计
  const alertStats = {
    total: alertData.length,
    pending: alertData.filter(a => a.status === 'pending').length,
    processing: alertData.filter(a => a.status === 'processing').length,
    resolved: alertData.filter(a => a.status === 'resolved').length,
    critical: alertData.filter(a => a.severity === 'critical').length,
  };

  // 过滤告警
  const filteredAlerts = alertData.filter(alert => {
    const matchType = alertType === 'all' || alert.type === alertType;
    const matchSeverity = alertSeverity === 'all' || alert.severity === alertSeverity;
    const matchStatus = alertStatus === 'all' || alert.status === alertStatus;
    const matchSearch = searchText === '' ||
      alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.content.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchText.toLowerCase());
    return matchType && matchSeverity && matchStatus && matchSearch;
  });

  // 获取告警类型图标
  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'water_level':
        return <WarningOutlined style={{ color: '#1B5E8C' }} />;
      case 'water_quality':
        return <AlertOutlined style={{ color: '#2D7D46' }} />;
      case 'equipment':
        return <SettingOutlined style={{ color: '#722ed1' }} />;
      case 'environment':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <AlertOutlined />;
    }
  };

  // 获取告警类型名称
  const getAlertTypeName = (type: AlertType) => {
    const typeMap: Record<AlertType, string> = {
      water_level: '水位告警',
      water_quality: '水质告警',
      equipment: '设备告警',
      environment: '环境告警',
    };
    return typeMap[type] || type;
  };

  // 获取严重程度标签
  const getSeverityTag = (severity: AlertSeverity) => {
    const severityMap: Record<AlertSeverity, { color: string; text: string }> = {
      critical: { color: 'red', text: '紧急' },
      high: { color: 'orange', text: '高危' },
      medium: { color: 'gold', text: '中危' },
      low: { color: 'blue', text: '低危' },
    };
    const config = severityMap[severity] || { color: 'default', text: severity };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = (status: AlertStatus) => {
    const statusMap: Record<AlertStatus, { color: string; text: string; icon: React.ReactNode }> = {
      pending: { color: 'warning', text: '待处理', icon: <ClockCircleOutlined /> },
      processing: { color: 'processing', text: '处理中', icon: <SyncOutlined spin /> },
      resolved: { color: 'success', text: '已解决', icon: <CheckCircleOutlined /> },
      closed: { color: 'default', text: '已关闭', icon: <CloseCircleOutlined /> },
    };
    const config = statusMap[status] || { color: 'default', text: status, icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 告警趋势图
  const alertTrendOption = {
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
      data: ['1月10日', '1月11日', '1月12日', '1月13日', '1月14日', '1月15日'],
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
        name: '告警数量',
        type: 'bar',
        data: [2, 3, 1, 4, 2, 3],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff4d4f' },
            { offset: 1, color: '#ff7875' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  // 告警类型分布
  const alertTypeOption = {
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
          { value: 3, name: '水质告警', itemStyle: { color: '#2D7D46' } },
          { value: 1, name: '水位告警', itemStyle: { color: '#1B5E8C' } },
          { value: 2, name: '设备告警', itemStyle: { color: '#722ed1' } },
        ],
      },
    ],
  };

  // 处理告警
  const handleAlert = (alert: typeof alertData[0]) => {
    setSelectedAlert(alert);
    setHandleModalVisible(true);
  };

  const submitHandle = (result: 'resolve' | 'close', remarks: string) => {
    message.success(`告警已${result === 'resolve' ? '处理完成' : '关闭'}`);
    setHandleModalVisible(false);
  };

  // 表格列定义
  const columns: ColumnsType<typeof alertData[0]> = [
    {
      title: '告警信息',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title: string, record) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Avatar
            size="small"
            style={{
              background: record.severity === 'critical' ? '#ff4d4f' :
                         record.severity === 'high' ? '#ff7a00' :
                         record.severity === 'medium' ? '#faad14' : '#1890ff',
              marginTop: 2,
            }}
            icon={getAlertTypeIcon(record.type)}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: AlertType) => (
        <Tag icon={getAlertTypeIcon(type)}>
          {getAlertTypeName(type)}
        </Tag>
      ),
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: AlertSeverity) => getSeverityTag(severity),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AlertStatus) => getStatusTag(status),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: '发生时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
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
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAlert(record);
              setDetailModalVisible(true);
            }}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleAlert(record)}
            >
              处理
            </Button>
          )}
          {record.status === 'processing' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleAlert(record)}
            >
              办结
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="monitor-alerts fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">监测告警</h1>
          <span className="page-subtitle">实时告警监控与处理</span>
        </div>
        <div className="page-header-actions">
          <Badge count={alertStats.pending} style={{ backgroundColor: '#faad14' }}>
            <Button icon={<BellOutlined />}>
              待处理 ({alertStats.pending})
            </Button>
          </Badge>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="告警总数"
              value={alertStats.total}
              prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="紧急告警"
              value={alertStats.critical}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="处理中"
              value={alertStats.processing}
              prefix={<SyncOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="已解决"
              value={alertStats.resolved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="告警趋势">
            <ReactECharts option={alertTrendOption} style={{ height: 240 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="告警类型分布">
            <ReactECharts option={alertTypeOption} style={{ height: 240 }} />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="搜索告警信息"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              value={alertType}
              onChange={setAlertType}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">全部类型</Option>
              <Option value="water_level">水位告警</Option>
              <Option value="water_quality">水质告警</Option>
              <Option value="equipment">设备告警</Option>
              <Option value="environment">环境告警</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              value={alertSeverity}
              onChange={setAlertSeverity}
              style={{ width: '100%' }}
            >
              <Option value="all">全部程度</Option>
              <Option value="critical">紧急</Option>
              <Option value="high">高危</Option>
              <Option value="medium">中危</Option>
              <Option value="low">低危</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              value={alertStatus}
              onChange={setAlertStatus}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="resolved">已解决</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 告警列表 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertOutlined style={{ color: '#ff4d4f' }} />
            <span>告警列表</span>
            <Badge count={filteredAlerts.length} style={{ backgroundColor: '#ff4d4f' }} />
          </div>
        }
        extra={
          <Space>
            <Badge status={alertStats.pending > 0 ? 'error' : 'success'} />
            <Text>
              {alertStats.pending > 0 ? `当前有 ${alertStats.pending} 条待处理告警` : '暂无待处理告警'}
            </Text>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredAlerts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          loading={loading}
          size="middle"
          rowClassName={(record) => {
            if (record.severity === 'critical') return 'alert-critical';
            if (record.severity === 'high') return 'alert-high';
            return '';
          }}
        />
      </Card>

      {/* 告警详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedAlert && getAlertTypeIcon(selectedAlert.type)}
            <span>告警详情</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            {selectedAlert?.status === 'pending' && (
              <Button type="primary" onClick={() => {
                setDetailModalVisible(false);
                handleAlert(selectedAlert);
              }}>
                立即处理
              </Button>
            )}
            {selectedAlert?.status === 'processing' && (
              <Button type="primary" onClick={() => {
                setDetailModalVisible(false);
                handleAlert(selectedAlert);
              }}>
                办结
              </Button>
            )}
          </Space>
        }
        width={700}
      >
        {selectedAlert && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="告警编号">{selectedAlert.id}</Descriptions.Item>
              <Descriptions.Item label="告警类型">
                <Tag icon={getAlertTypeIcon(selectedAlert.type)}>
                  {getAlertTypeName(selectedAlert.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="严重程度">
                {getSeverityTag(selectedAlert.severity)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedAlert.status)}
              </Descriptions.Item>
              <Descriptions.Item label="发生位置" span={2}>
                {selectedAlert.location}
              </Descriptions.Item>
              <Descriptions.Item label="监测设备">
                {selectedAlert.deviceName}
              </Descriptions.Item>
              <Descriptions.Item label="设备编号">
                {selectedAlert.deviceId}
              </Descriptions.Item>
              <Descriptions.Item label="发生时间">
                {selectedAlert.reportTime}
              </Descriptions.Item>
              {selectedAlert.handler && (
                <Descriptions.Item label="处理人">
                  {selectedAlert.handler}
                </Descriptions.Item>
              )}
              {selectedAlert.handleTime && (
                <Descriptions.Item label="处理时间">
                  {selectedAlert.handleTime}
                </Descriptions.Item>
              )}
              {selectedAlert.resolveTime && (
                <Descriptions.Item label="解决时间">
                  {selectedAlert.resolveTime}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="告警标题" span={2}>
                {selectedAlert.title}
              </Descriptions.Item>
              <Descriptions.Item label="告警内容" span={2}>
                {selectedAlert.content}
              </Descriptions.Item>
              {selectedAlert.remarks && (
                <Descriptions.Item label="处理备注" span={2}>
                  {selectedAlert.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 告警数值信息 */}
            {selectedAlert.value && (
              <Card size="small" style={{ marginTop: 16 }} bodyStyle={{ padding: 12 }}>
                <h4 style={{ marginBottom: 8 }}>告警数据</h4>
                <Row gutter={[16, 8]}>
                  {Object.entries(selectedAlert.value).map(([key, value]) => (
                    <Col key={key} span={12}>
                      <Text type="secondary">{key}: </Text>
                      <Text strong>{String(value)}</Text>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* 处理告警弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>处理告警 - {selectedAlert?.id}</span>
          </div>
        }
        open={handleModalVisible}
        onCancel={() => setHandleModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedAlert && (
          <div style={{ marginTop: 16 }}>
            <Card size="small" bodyStyle={{ padding: 12 }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="告警标题">{selectedAlert.title}</Descriptions.Item>
                <Descriptions.Item label="告警类型">
                  <Tag icon={getAlertTypeIcon(selectedAlert.type)}>
                    {getAlertTypeName(selectedAlert.type)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="严重程度">
                  {getSeverityTag(selectedAlert.severity)}
                </Descriptions.Item>
                <Descriptions.Item label="发生位置">{selectedAlert.location}</Descriptions.Item>
              </Descriptions>
            </Card>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 12 }}>处理操作</h4>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button
                    block
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => submitHandle('resolve', '已处理完成')}
                  >
                    处理完成
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    block
                    icon={<CloseCircleOutlined />}
                    onClick={() => submitHandle('close', '已关闭')}
                  >
                    关闭告警
                  </Button>
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8 }}>处理建议</h4>
              {selectedAlert.type === 'water_quality' && (
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                  <li>立即安排人员现场核查水质情况</li>
                  <li>检查上游是否有排污行为</li>
                  <li>增加监测频率，持续关注水质变化</li>
                  <li>必要时向上级部门报告</li>
                </ul>
              )}
              {selectedAlert.type === 'water_level' && (
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                  <li>检查是否有异常取水行为</li>
                  <li>关注天气变化，排查自然因素</li>
                  <li>联系下游相关单位协调</li>
                </ul>
              )}
              {selectedAlert.type === 'equipment' && (
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                  <li>联系设备维护人员</li>
                  <li>检查设备电源和网络连接</li>
                  <li>如设备故障，准备更换或维修</li>
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 样式 */}
      <style>{`
        .alert-critical {
          background-color: #fff2f0;
        }
        .alert-high {
          background-color: #fff7e6;
        }
      `}</style>
    </div>
  );
};

export default MonitorAlerts;
