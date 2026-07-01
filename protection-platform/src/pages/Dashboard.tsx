import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Statistic, 
  Progress,
  Timeline,
  List,
  Avatar,
  Badge,
  Tabs,
  Modal,
  Descriptions,
  Input,
  Select,
  DatePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SafetyOutlined,
  AlertOutlined,
  TeamOutlined,
  ApiOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  RightOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  dashboardStats,
  patrolTasks,
  patrolAlerts,
  speciesList,
  monitorDevices,
  patrolPersonnel,
  patrolTrendData,
  alertTrendData,
} from '@/mock';
import type { PatrolTask, PatrolAlert, Species, MonitorDevice } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<PatrolAlert | null>(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  // 统计数据卡片
  const statsCards = [
    {
      title: '巡护覆盖率',
      value: dashboardStats.patrolCoverage,
      suffix: '%',
      icon: <SafetyOutlined />,
      color: '#2D7D46',
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: '今日告警数',
      value: dashboardStats.alertCount,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      title: '物种数量',
      value: dashboardStats.speciesCount,
      icon: <TeamOutlined />,
      color: '#1B5E8C',
      trend: '+12',
      trendUp: true,
    },
    {
      title: '设备在线率',
      value: dashboardStats.deviceOnlineRate,
      suffix: '%',
      icon: <ApiOutlined />,
      color: '#faad14',
      trend: '+1.5%',
      trendUp: true,
    },
  ];

  // 巡护任务表格列
  const taskColumns: ColumnsType<PatrolTask> = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          routine: { color: 'blue', text: '日常巡护' },
          special: { color: 'purple', text: '专项巡护' },
          emergency: { color: 'red', text: '紧急巡护' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'default', text: '待派发' },
          assigned: { color: 'processing', text: '已派发' },
          in_progress: { color: 'blue', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
          cancelled: { color: 'default', text: '已取消' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '执行人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 100,
    },
    {
      title: '计划日期',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAlert(null);
              setTaskModalVisible(true);
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 告警列表
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />;
      case 'high':
        return <WarningOutlined style={{ color: '#ff7a00', fontSize: 20 }} />;
      case 'medium':
        return <AlertOutlined style={{ color: '#faad14', fontSize: 20 }} />;
      default:
        return <AlertOutlined style={{ color: '#1890ff', fontSize: 20 }} />;
    }
  };

  const getSeverityTag = (severity: string) => {
    const severityMap: Record<string, { color: string; text: string }> = {
      critical: { color: 'red', text: '紧急' },
      high: { color: 'orange', text: '高危' },
      medium: { color: 'gold', text: '中危' },
      low: { color: 'blue', text: '低危' },
    };
    const config = severityMap[severity] || { color: 'default', text: severity };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 巡护趋势图表配置
  const patrolTrendOption = {
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
      data: patrolTrendData.map(item => item.month),
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
        name: '巡护次数',
        type: 'bar',
        data: patrolTrendData.map(item => item.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2D7D46' },
            { offset: 1, color: '#3a9a59' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  // 告警趋势图表配置
  const alertTrendOption = {
    tooltip: {
      trigger: 'axis',
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
      data: alertTrendData.map(item => item.month),
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
        name: '告警次数',
        type: 'line',
        data: alertTrendData.map(item => item.count),
        smooth: true,
        lineStyle: { color: '#ff4d4f', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,77,79,0.3)' },
            { offset: 1, color: 'rgba(255,77,79,0)' },
          ]),
        },
        itemStyle: { color: '#ff4d4f' },
      },
    ],
  };

  // 设备状态饼图配置
  const deviceStatusOption = {
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
        radius: ['50%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        data: [
          { value: 32, name: '在线', itemStyle: { color: '#52c41a' } },
          { value: 3, name: '离线', itemStyle: { color: '#ff4d4f' } },
          { value: 2, name: '维护中', itemStyle: { color: '#faad14' } },
        ],
      },
    ],
  };

  // 实时巡护人员
  const onDutyPersonnel = patrolPersonnel.filter(p => p.status === '巡护中');

  return (
    <div className="dashboard fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">首页总览</h1>
        </div>
        <div className="page-header-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/patrol/tasks')}
          >
            新建任务
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{stat.title}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>
                    {stat.value}{stat.suffix || ''}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {stat.trendUp ? (
                      <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
                    )}
                    <span style={{ 
                      color: stat.trendUp ? '#52c41a' : '#ff4d4f', 
                      fontSize: 12 
                    }}>
                      {stat.trend}
                    </span>
                    <span style={{ color: '#999', fontSize: 12, marginLeft: 4 }}>较上月</span>
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    fontSize: 22,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 左侧主区域 */}
        <Col xs={24} lg={16}>
          {/* 巡护任务 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyOutlined style={{ color: '#2D7D46' }} />
                <span>巡护任务</span>
                <Badge 
                  count={dashboardStats.pendingTaskCount} 
                  style={{ backgroundColor: '#faad14' }} 
                />
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/patrol/tasks')}>
                查看全部 <RightOutlined />
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={taskColumns}
              dataSource={patrolTasks}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>

          {/* 图表区域 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="巡护趋势">
                <ReactECharts option={patrolTrendOption} style={{ height: 220 }} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="告警趋势">
                <ReactECharts option={alertTrendOption} style={{ height: 220 }} />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 右侧侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 异常告警 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertOutlined style={{ color: '#ff4d4f' }} />
                <span>异常告警</span>
                <Badge 
                  count={patrolAlerts.filter(a => a.status === 'pending').length} 
                  style={{ backgroundColor: '#ff4d4f' }} 
                />
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/patrol/alerts')}>
                查看全部 <RightOutlined />
              </Button>
            }
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {patrolAlerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    setAlertModalVisible(true);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    borderLeft: `3px solid ${
                      alert.severity === 'critical' ? '#ff4d4f' :
                      alert.severity === 'high' ? '#ff7a00' :
                      alert.severity === 'medium' ? '#faad14' : '#1890ff'
                    }`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {getAlertIcon(alert.severity)}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        {alert.type === 'illegal_fishing' ? '非法捕捞' :
                         alert.type === 'illegal_mining' ? '非法采砂' :
                         alert.type === 'pollution' ? '污水排放' : '其他异常'}
                      </div>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                        {alert.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getSeverityTag(alert.severity)}
                        <Tag color={
                          alert.status === 'pending' ? 'warning' :
                          alert.status === 'processing' ? 'processing' :
                          alert.status === 'resolved' ? 'success' : 'default'
                        }>
                          {alert.status === 'pending' ? '待处理' :
                           alert.status === 'processing' ? '处理中' :
                           alert.status === 'resolved' ? '已解决' : '已关闭'}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 设备状态 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ApiOutlined style={{ color: '#1B5E8C' }} />
                <span>设备状态</span>
              </div>
            }
            extra={
              <Button type="link" onClick={() => navigate('/monitor/devices')}>
                查看全部 <RightOutlined />
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <ReactECharts option={deviceStatusOption} style={{ height: 200 }} />
          </Card>

          {/* 巡护人员 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TeamOutlined style={{ color: '#2D7D46' }} />
                <span>巡护人员</span>
                <Badge count={onDutyPersonnel.length} style={{ backgroundColor: '#52c41a' }} />
              </div>
            }
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={patrolPersonnel}
              renderItem={(person) => (
                <List.Item
                  style={{ padding: '12px 16px' }}
                  onClick={() => navigate('/patrol/personnel')}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          background: person.status === '巡护中' ? '#2D7D46' : '#999',
                        }}
                      >
                        {person.name.charAt(0)}
                      </Avatar>
                    }
                    title={person.name}
                    description={
                      <div>
                        <div style={{ fontSize: 12, color: '#666' }}>{person.role}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{person.location}</div>
                      </div>
                    }
                  />
                  <Tag color={person.status === '巡护中' ? 'success' : person.status === '待命' ? 'processing' : 'default'}>
                    {person.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 物种概览 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EnvironmentOutlined style={{ color: '#1B5E8C' }} />
            <span>重点保护物种</span>
          </div>
        }
        extra={
          <Button type="link" onClick={() => navigate('/eco/species')}>
            查看全部 <RightOutlined />
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Row gutter={[16, 16]}>
          {speciesList.slice(0, 5).map(species => (
            <Col xs={24} sm={12} md={8} lg={5} key={species.id}>
              <Card 
                size="small"
                style={{ 
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                bodyStyle={{ padding: 16 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => navigate('/eco/species')}
              >
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={48} 
                    style={{ 
                      background: species.protectionLevel === '1' ? '#ff4d4f' : '#faad14',
                      marginBottom: 8,
                    }}
                  >
                    {species.name.charAt(0)}
                  </Avatar>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{species.name}</div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>
                    {species.latinName}
                  </div>
                  <Tag color={species.protectionLevel === '1' ? 'red' : 'orange'}>
                    {species.protectionLevel === '1' ? '一级保护' : '二级保护'}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 告警详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertOutlined style={{ color: '#ff4d4f' }} />
            <span>告警详情</span>
          </div>
        }
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setAlertModalVisible(false)}>关闭</Button>
            {selectedAlert?.status === 'pending' && (
              <Button type="primary" danger>立即处理</Button>
            )}
          </Space>
        }
        width={600}
      >
        {selectedAlert && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="告警编号">{selectedAlert.id}</Descriptions.Item>
            <Descriptions.Item label="告警类型">
              {selectedAlert.type === 'illegal_fishing' ? '非法捕捞' :
               selectedAlert.type === 'illegal_mining' ? '非法采砂' :
               selectedAlert.type === 'pollution' ? '污水排放' : '其他异常'}
            </Descriptions.Item>
            <Descriptions.Item label="严重程度">
              {getSeverityTag(selectedAlert.severity)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                selectedAlert.status === 'pending' ? 'warning' :
                selectedAlert.status === 'processing' ? 'processing' :
                selectedAlert.status === 'resolved' ? 'success' : 'default'
              }>
                {selectedAlert.status === 'pending' ? '待处理' :
                 selectedAlert.status === 'processing' ? '处理中' :
                 selectedAlert.status === 'resolved' ? '已解决' : '已关闭'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发生位置" span={2}>
              {selectedAlert.location}
            </Descriptions.Item>
            <Descriptions.Item label="上报时间" span={2}>
              {selectedAlert.reportTime}
            </Descriptions.Item>
            <Descriptions.Item label="上报人">
              {selectedAlert.reporter}
            </Descriptions.Item>
            <Descriptions.Item label="详细描述" span={2}>
              {selectedAlert.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 任务详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyOutlined style={{ color: '#2D7D46' }} />
            <span>任务详情</span>
          </div>
        }
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setTaskModalVisible(false)}>关闭</Button>
            <Button type="primary">编辑任务</Button>
          </Space>
        }
        width={700}
      >
        <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="任务编号">PT001</Descriptions.Item>
          <Descriptions.Item label="任务类型">
            <Tag color="blue">日常巡护</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="任务状态">
            <Tag color="processing">进行中</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="执行人">李建国</Descriptions.Item>
          <Descriptions.Item label="计划路线" span={2}>
            诺水河干流-涪阳镇至诺江镇段
          </Descriptions.Item>
          <Descriptions.Item label="计划时间">
            2024-01-15 08:00 - 17:00
          </Descriptions.Item>
          <Descriptions.Item label="计划时长">
            9小时
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            2024-01-10 09:00
          </Descriptions.Item>
          <Descriptions.Item label="派发人">
            王管理员
          </Descriptions.Item>
          <Descriptions.Item label="任务描述" span={2}>
            重点关注河道内是否存在非法捕捞行为，发现异常及时上报。
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default Dashboard;
