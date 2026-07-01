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
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Tabs,
  Timeline,
  Avatar,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  patrolTasks,
  patrolPersonnel,
  patrolAlerts,
} from '@/mock';
import type { PatrolTask } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PatrolTasks: React.FC = () => {
  const [tasks, setTasks] = useState<PatrolTask[]>(patrolTasks);
  const [filteredTasks, setFilteredTasks] = useState<PatrolTask[]>(patrolTasks);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PatrolTask | null>(null);
  const [form] = Form.useForm();

  // 筛选任务
  React.useEffect(() => {
    let result = tasks;
    if (searchText) {
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          task.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter(task => task.type === typeFilter);
    }
    setFilteredTasks(result);
  }, [tasks, searchText, statusFilter, typeFilter]);

  // 任务类型映射
  const getTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      routine: { color: 'blue', text: '日常巡护' },
      special: { color: 'purple', text: '专项巡护' },
      emergency: { color: 'red', text: '紧急巡护' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 任务状态映射
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待派发' },
      assigned: { color: 'processing', text: '已派发' },
      in_progress: { color: 'blue', text: '进行中' },
      completed: { color: 'success', text: '已完成' },
      cancelled: { color: 'default', text: '已取消' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<PatrolTask> = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '执行人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 100,
    },
    {
      title: '计划路线',
      dataIndex: 'route',
      key: 'route',
      ellipsis: true,
    },
    {
      title: '计划日期',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 120,
    },
    {
      title: '计划时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (startTime: string, record: PatrolTask) =>
        record.endTime ? `${startTime} - ${record.endTime}` : startTime,
    },
    {
      title: '派发人',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTask(record);
              setDetailModalVisible(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTask(record);
              form.setFieldsValue({
                ...record,
                scheduledDate: dayjs(record.scheduledDate),
                startTime: dayjs(record.startTime),
                endTime: record.endTime ? dayjs(record.endTime) : undefined,
              });
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个任务吗？"
            onConfirm={() => {
              setTasks(tasks.filter(t => t.id !== record.id));
              message.success('删除成功');
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 创建任务
  const handleCreateTask = () => {
    form.validateFields().then(values => {
      const newTask: PatrolTask = {
        id: `PT${String(tasks.length + 1).padStart(3, '0')}`,
        title: values.title,
        type: values.type,
        status: 'pending',
        assignedTo: values.assignedTo,
        assignedBy: values.assignedBy || '王管理员',
        route: values.route,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
        endTime: values.endTime?.format('YYYY-MM-DD HH:mm'),
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        remarks: values.remarks,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      };
      setTasks([newTask, ...tasks]);
      setCreateModalVisible(false);
      form.resetFields();
      message.success('创建成功');
    });
  };

  // 统计卡片数据
  const statsData = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="patrol-tasks-page fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">巡护任务管理</h1>
        </div>
        <div className="page-header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setSelectedTask(null);
              setCreateModalVisible(true);
            }}
          >
            创建任务
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="任务总数"
              value={statsData.total}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="待派发"
              value={statsData.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="进行中"
              value={statsData.inProgress}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="已完成"
              value={statsData.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索任务名称或编号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={5}>
            <Select
              placeholder="任务状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="pending">待派发</Option>
              <Option value="assigned">已派发</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Col>
          <Col xs={12} sm={5}>
            <Select
              placeholder="任务类型"
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="routine">日常巡护</Option>
              <Option value="special">专项巡护</Option>
              <Option value="emergency">紧急巡护</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Button onClick={() => {
              setSearchText('');
              setStatusFilter(undefined);
              setTypeFilter(undefined);
            }}>
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 创建/编辑任务弹窗 */}
      <Modal
        title={selectedTask ? '编辑任务' : '创建任务'}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={handleCreateTask}
        width={700}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="任务名称"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="任务类型"
                rules={[{ required: true, message: '请选择任务类型' }]}
              >
                <Select placeholder="请选择任务类型">
                  <Option value="routine">日常巡护</Option>
                  <Option value="special">专项巡护</Option>
                  <Option value="emergency">紧急巡护</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="执行人"
                rules={[{ required: true, message: '请选择执行人' }]}
              >
                <Select placeholder="请选择执行人">
                  {patrolPersonnel.map(p => (
                    <Option key={p.id} value={p.name}>{p.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="route"
                label="计划路线"
                rules={[{ required: true, message: '请输入计划路线' }]}
              >
                <Input placeholder="请输入计划路线" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scheduledDate"
                label="计划日期"
                rules={[{ required: true, message: '请选择计划日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignedBy"
                label="派发人"
              >
                <Input placeholder="请输入派发人" defaultValue="王管理员" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="结束时间"
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 任务详情弹窗 */}
      <Modal
        title="任务详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            {selectedTask?.status === 'pending' && (
              <Button type="primary">派发任务</Button>
            )}
            {selectedTask?.status === 'assigned' && (
              <Button type="primary">开始执行</Button>
            )}
            {selectedTask?.status === 'in_progress' && (
              <Button type="primary" danger>结束任务</Button>
            )}
          </Space>
        }
        width={700}
      >
        {selectedTask && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="任务编号">{selectedTask.id}</Descriptions.Item>
            <Descriptions.Item label="任务名称">{selectedTask.title}</Descriptions.Item>
            <Descriptions.Item label="任务类型">
              {getTypeTag(selectedTask.type)}
            </Descriptions.Item>
            <Descriptions.Item label="任务状态">
              {getStatusTag(selectedTask.status)}
            </Descriptions.Item>
            <Descriptions.Item label="执行人">{selectedTask.assignedTo}</Descriptions.Item>
            <Descriptions.Item label="派发人">{selectedTask.assignedBy}</Descriptions.Item>
            <Descriptions.Item label="计划路线" span={2}>{selectedTask.route}</Descriptions.Item>
            <Descriptions.Item label="计划日期">{selectedTask.scheduledDate}</Descriptions.Item>
            <Descriptions.Item label="计划时长">
              {selectedTask.endTime
                ? `${dayjs(selectedTask.endTime).diff(dayjs(selectedTask.startTime), 'hour')}小时`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{selectedTask.createdAt}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {selectedTask.remarks || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PatrolTasks;
