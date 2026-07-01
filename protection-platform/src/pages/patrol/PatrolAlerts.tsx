import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  Descriptions,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Badge,
  message,
  Tabs,
  Steps,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  AlertOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  BellOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  patrolAlerts,
  patrolPersonnel,
} from '@/mock';
import type { PatrolAlert } from '@/types';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const PatrolAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PatrolAlert[]>(patrolAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<PatrolAlert[]>(patrolAlerts);
  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<PatrolAlert | null>(null);
  const [handleForm] = Form.useForm();

  // 筛选告警
  React.useEffect(() => {
    let result = alerts;
    if (searchText) {
      result = result.filter(
        alert =>
          alert.location.toLowerCase().includes(searchText.toLowerCase()) ||
          alert.id.toLowerCase().includes(searchText.toLowerCase()) ||
          alert.reporter.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (severityFilter) {
      result = result.filter(alert => alert.severity === severityFilter);
    }
    if (statusFilter) {
      result = result.filter(alert => alert.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter(alert => alert.type === typeFilter);
    }
    setFilteredAlerts(result);
  }, [alerts, searchText, severityFilter, statusFilter, typeFilter]);

  // 告警类型映射
  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      illegal_fishing: '非法捕捞',
      illegal_mining: '非法采砂',
      pollution: '污水排放',
      other: '其他异常',
    };
    return typeMap[type] || type;
  };

  // 告警类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'illegal_fishing':
        return <AlertOutlined style={{ color: '#faad14' }} />;
      case 'illegal_mining':
        return <AlertOutlined style={{ color: '#ff4d4f' }} />;
      case 'pollution':
        return <WarningOutlined style={{ color: '#ff7a00' }} />;
      default:
        return <AlertOutlined style={{ color: '#1890ff' }} />;
    }
  };

  // 严重程度映射
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

  // 状态映射
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'warning', text: '待处理' },
      processing: { color: 'processing', text: '处理中' },
      resolved: { color: 'success', text: '已解决' },
      closed: { color: 'default', text: '已关闭' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取告警图标
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />;
      case 'high':
        return <WarningOutlined style={{ color: '#ff7a00', fontSize: 20 }} />;
      case 'medium':
        return <AlertOutlined style={{ color: '#faad14', fontSize: 18 }} />;
      default:
        return <AlertOutlined style={{ color: '#1890ff', fontSize: 16 }} />;
    }
  };

  // 表格列定义
  const columns: ColumnsType<PatrolAlert> = [
    {
      title: '告警编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Space>
          {getTypeIcon(type)}
          <span>{getTypeText(type)}</span>
        </Space>
      ),
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => getSeverityTag(severity),
      sorter: (a, b) => {
        const order = ['critical', 'high', 'medium', 'low'];
        return order.indexOf(a.severity) - order.indexOf(b.severity);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '发生位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: '上报人',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 100,
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      width: 160,
      sorter: (a, b) => dayjs(a.reportTime).unix() - dayjs(b.reportTime).unix(),
    },
    {
      title: '处理人',
      key: 'handler',
      width: 100,
      render: (_, record) => {
        if (record.status === 'pending') return '-';
        return patrolPersonnel.find(p => p.name === record.reporter)?.name || '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
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
            查看
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              type="primary"
              onClick={() => {
                setSelectedAlert(record);
                handleForm.setFieldsValue({ handler: patrolPersonnel[0]?.name });
                setHandleModalVisible(true);
              }}
            >
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理告警
  const handleAlert = () => {
    handleForm.validateFields().then(values => {
      if (selectedAlert) {
        setAlerts(
          alerts.map(alert =>
            alert.id === selectedAlert.id
              ? { ...alert, status: 'resolved' as const }
              : alert
          )
        );
        setHandleModalVisible(false);
        handleForm.resetFields();
        message.success('处理成功');
      }
    });
  };

  // 统计卡片数据
  const statsData = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    processing: alerts.filter(a => a.status === 'processing').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
  };

  // 当前告警列表（待处理 + 处理中）
  const activeAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'processing');

  return (
    <div className="patrol-alerts-page fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">异常事件上报</h1>
        </div>
        <div className="page-header-actions">
          <Button
            type="primary"
            danger
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedAlert(null);
              setDetailModalVisible(true);
            }}
          >
            上报异常
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="告警总数"
              value={statsData.total}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="待处理"
              value={statsData.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="处理中"
              value={statsData.processing}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="紧急告警"
              value={statsData.critical}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 告警列表 */}
      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab={`全部 (${alerts.length})`} key="all">
            {/* 筛选区域 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]} align="middle">
                <Col xs={24} sm={8}>
                  <Input
                    placeholder="搜索位置或上报人"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={12} sm={5}>
                  <Select
                    placeholder="严重程度"
                    value={severityFilter}
                    onChange={setSeverityFilter}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="critical">紧急</Option>
                    <Option value="high">高危</Option>
                    <Option value="medium">中危</Option>
                    <Option value="low">低危</Option>
                  </Select>
                </Col>
                <Col xs={12} sm={5}>
                  <Select
                    placeholder="处理状态"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="pending">待处理</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="resolved">已解决</Option>
                    <Option value="closed">已关闭</Option>
                  </Select>
                </Col>
                <Col xs={12} sm={6}>
                  <Select
                    placeholder="告警类型"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="illegal_fishing">非法捕捞</Option>
                    <Option value="illegal_mining">非法采砂</Option>
                    <Option value="pollution">污水排放</Option>
                    <Option value="other">其他异常</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            <Table
              columns={columns}
              dataSource={filteredAlerts}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab={`待处理 (${statsData.pending})`} key="pending">
            <Table
              columns={columns}
              dataSource={alerts.filter(a => a.status === 'pending')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab={`处理中 (${statsData.processing})`} key="processing">
            <Table
              columns={columns}
              dataSource={alerts.filter(a => a.status === 'processing')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab={`已解决 (${statsData.resolved})`} key="resolved">
            <Table
              columns={columns}
              dataSource={alerts.filter(a => a.status === 'resolved')}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 告警详情弹窗 */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#faad14' }} />
            <span>告警详情</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            {selectedAlert?.status === 'pending' && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  setDetailModalVisible(false);
                  setHandleModalVisible(true);
                }}
              >
                立即处理
              </Button>
            )}
            {selectedAlert?.status === 'resolved' && (
              <Popconfirm
                title="确认关闭"
                description="确定要关闭这个告警吗？"
                onConfirm={() => {
                  if (selectedAlert) {
                    setAlerts(
                      alerts.map(alert =>
                        alert.id === selectedAlert.id
                          ? { ...alert, status: 'closed' as const }
                          : alert
                      )
                    );
                    setDetailModalVisible(false);
                    message.success('已关闭');
                  }
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button>关闭告警</Button>
              </Popconfirm>
            )}
          </Space>
        }
        width={700}
      >
        {selectedAlert && (
          <>
            <div style={{
              padding: '12px 16px',
              background: selectedAlert.severity === 'critical' ? '#fff1f0' :
                         selectedAlert.severity === 'high' ? '#fff7e6' :
                         selectedAlert.severity === 'medium' ? '#fffbe6' : '#e6f7ff',
              borderRadius: 4,
              marginBottom: 16,
              borderLeft: `4px solid ${
                selectedAlert.severity === 'critical' ? '#ff4d4f' :
                selectedAlert.severity === 'high' ? '#ff7a00' :
                selectedAlert.severity === 'medium' ? '#faad14' : '#1890ff'
              }`,
            }}>
              <Space>
                {getAlertIcon(selectedAlert.severity)}
                <span style={{ fontWeight: 500, fontSize: 16 }}>
                  {getTypeText(selectedAlert.type)}
                </span>
                {getSeverityTag(selectedAlert.severity)}
                {getStatusTag(selectedAlert.status)}
              </Space>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="告警编号">{selectedAlert.id}</Descriptions.Item>
              <Descriptions.Item label="发生位置">{selectedAlert.location}</Descriptions.Item>
              <Descriptions.Item label="上报人">{selectedAlert.reporter}</Descriptions.Item>
              <Descriptions.Item label="上报时间">{selectedAlert.reportTime}</Descriptions.Item>
              <Descriptions.Item label="巡护路线" span={2}>
                {selectedAlert.location.split('-')[0] || selectedAlert.location}
              </Descriptions.Item>
              <Descriptions.Item label="详细描述" span={2}>
                {selectedAlert.description}
              </Descriptions.Item>
            </Descriptions>

            {selectedAlert.images && selectedAlert.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>现场图片</div>
                <Row gutter={[8, 8]}>
                  {selectedAlert.images.map((img, index) => (
                    <Col span={8} key={index}>
                      <div style={{
                        width: '100%',
                        height: 100,
                        background: '#f0f0f0',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                      }}>
                        图片{index + 1}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* 处理告警弹窗 */}
      <Modal
        title="处理告警"
        open={handleModalVisible}
        onCancel={() => {
          setHandleModalVisible(false);
          handleForm.resetFields();
        }}
        onOk={handleAlert}
        okText="确认处理"
        cancelText="取消"
      >
        <Form
          form={handleForm}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="告警编号">{selectedAlert?.id}</Descriptions.Item>
            <Descriptions.Item label="告警类型">
              {selectedAlert && getTypeText(selectedAlert.type)}
            </Descriptions.Item>
            <Descriptions.Item label="严重程度">
              {selectedAlert && getSeverityTag(selectedAlert.severity)}
            </Descriptions.Item>
            <Descriptions.Item label="发生位置">{selectedAlert?.location}</Descriptions.Item>
            <Descriptions.Item label="详细描述" span={2}>
              {selectedAlert?.description}
            </Descriptions.Item>
          </Descriptions>

          <Form.Item
            name="handler"
            label="处理人"
            rules={[{ required: true, message: '请选择处理人' }]}
          >
            <Select placeholder="请选择处理人">
              {patrolPersonnel.map(p => (
                <Option key={p.id} value={p.name}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="handleResult"
            label="处理结果"
            rules={[{ required: true, message: '请输入处理结果' }]}
          >
            <TextArea rows={4} placeholder="请详细描述处理过程和结果" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatrolAlerts;
