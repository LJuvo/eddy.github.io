import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Steps,
  Progress,
  message,
  Popconfirm,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface UAVTask {
  id: string;
  taskName: string;
  taskType: string;
  area: string;
  status: string;
  droneModel: string;
  pilot: string;
  plannedDate: string;
  actualDate?: string;
  coverage?: number;
  images?: number;
  progress?: number;
}

const UAVTask: React.FC = () => {
  const [taskList] = useState<UAVTask[]>([
    {
      id: 'UAV001',
      taskName: '诺水河干流航测',
      taskType: '常规航测',
      area: '诺水河干流-涪阳镇至诺江镇',
      status: 'completed',
      droneModel: 'DJI M300RTK',
      pilot: '张机长',
      plannedDate: '2024-01-10',
      actualDate: '2024-01-10',
      coverage: 100,
      images: 1250,
      progress: 100,
    },
    {
      id: 'UAV002',
      taskName: '核心区精细航测',
      taskType: '精细航测',
      area: '核心区-大鲵栖息地',
      status: 'in_progress',
      droneModel: 'DJI M210RTK',
      pilot: '李机长',
      plannedDate: '2024-01-15',
      coverage: 65,
      images: 820,
      progress: 65,
    },
    {
      id: 'UAV003',
      taskName: '缓冲区正射影像采集',
      taskType: '正射影像',
      area: '缓冲区-空山乡至两河口',
      status: 'pending',
      droneModel: 'DJI P4RTK',
      pilot: '王机长',
      plannedDate: '2024-01-18',
      coverage: 0,
      images: 0,
      progress: 0,
    },
    {
      id: 'UAV004',
      taskName: '澌滩河流域航测',
      taskType: '常规航测',
      area: '澌滩河流域',
      status: 'pending',
      droneModel: 'DJI M300RTK',
      pilot: '张机长',
      plannedDate: '2024-01-20',
      coverage: 0,
      images: 0,
      progress: 0,
    },
    {
      id: 'UAV005',
      taskName: '实验区热红外航测',
      taskType: '热红外航测',
      area: '实验区-各管护站',
      status: 'draft',
      droneModel: 'DJI M300RTK+XT2',
      pilot: '待安排',
      plannedDate: '2024-01-22',
      coverage: 0,
      images: 0,
      progress: 0,
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<UAVTask | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<UAVTask> = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 120,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          '常规航测': 'blue',
          '精细航测': 'purple',
          '正射影像': 'cyan',
          '热红外航测': 'orange',
        };
        return <Tag color={typeMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: '航测区域',
      dataIndex: 'area',
      key: 'area',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          draft: { color: 'default', text: '草稿', icon: <EditOutlined /> },
          pending: { color: 'warning', text: '待执行', icon: <PauseCircleOutlined /> },
          in_progress: { color: 'processing', text: '执行中', icon: <PlayCircleOutlined /> },
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
        };
        const config = statusMap[status] || { color: 'default', text: status, icon: null };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '计划日期',
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 120,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: UAVTask) => (
        <Progress
          percent={progress}
          size="small"
          status={record.status === 'completed' ? 'success' : record.status === 'in_progress' ? 'active' : 'normal'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedTask(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          {record.status === 'draft' || record.status === 'pending' ? (
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedTask(record);
              form.setFieldsValue(record);
              setCreateVisible(true);
            }}>
              编辑
            </Button>
          ) : null}
          {record.status === 'pending' && (
            <Popconfirm
              title="确认开始执行此任务？"
              onConfirm={() => message.success('任务已开始执行')}
            >
              <Button type="link" size="small" icon={<PlayCircleOutlined />} style={{ color: '#52c41a' }}>
                开始
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = taskList.filter(item => {
    const matchSearch = item.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.area.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    setSelectedTask(null);
    form.resetFields();
    setCreateVisible(true);
  };

  const handleSubmit = () => {
    setCreateVisible(false);
    message.success('保存成功');
  };

  const getStepItems = (task: UAVTask) => {
    const steps = [
      { title: '任务创建', description: task.plannedDate },
      { title: '任务审批', description: task.status !== 'draft' ? '2024-01-09' : '待审批' },
      { title: '航线规划', description: task.status === 'draft' ? '待规划' : '已完成' },
      { title: '现场执行', description: task.actualDate || '待执行' },
      { title: '数据处理', description: task.status === 'completed' ? '已完成' : '待处理' },
      { title: '成果验收', description: task.status === 'completed' ? '已通过' : '待验收' },
    ];
    return steps;
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">航测任务管理</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建任务
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="搜索任务名称或区域"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="pending">待执行</Select.Option>
              <Select.Option value="in_progress">执行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button onClick={() => {
              setSearchText('');
              setFilterStatus(null);
            }}>
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="任务详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          <Space>
            <Button key="close" onClick={() => setDetailVisible(false)}>
              关闭
            </Button>
            {selectedTask?.status === 'pending' && (
              <Button key="start" type="primary" icon={<PlayCircleOutlined />}>
                开始执行
              </Button>
            )}
          </Space>
        }
        width={800}
      >
        {selectedTask && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="任务编号">{selectedTask.id}</Descriptions.Item>
              <Descriptions.Item label="任务类型">
                <Tag>{selectedTask.taskType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="任务名称" span={2}>{selectedTask.taskName}</Descriptions.Item>
              <Descriptions.Item label="航测区域" span={2}>{selectedTask.area}</Descriptions.Item>
              <Descriptions.Item label="飞行器型号">{selectedTask.droneModel}</Descriptions.Item>
              <Descriptions.Item label="飞行员">{selectedTask.pilot}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{selectedTask.plannedDate}</Descriptions.Item>
              <Descriptions.Item label="实际日期">{selectedTask.actualDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="覆盖面积">
                {selectedTask.coverage ? `${selectedTask.coverage}%` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="影像数量">
                {selectedTask.images || 0} 张
              </Descriptions.Item>
              <Descriptions.Item label="执行进度" span={2}>
                <Progress percent={selectedTask.progress || 0} status={
                  selectedTask.status === 'completed' ? 'success' :
                  selectedTask.status === 'in_progress' ? 'active' : 'normal'
                } />
              </Descriptions.Item>
            </Descriptions>

            <Card title="任务流程" size="small" style={{ marginTop: 16 }}>
              <Steps
                current={
                  selectedTask.status === 'draft' ? 0 :
                  selectedTask.status === 'pending' ? 1 :
                  selectedTask.status === 'in_progress' ? 3 :
                  5
                }
                items={getStepItems(selectedTask)}
              />
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        title={selectedTask ? '编辑任务' : '新建任务'}
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="任务类型" name="taskType" rules={[{ required: true, message: '请选择任务类型' }]}>
                <Select placeholder="请选择任务类型">
                  <Select.Option value="常规航测">常规航测</Select.Option>
                  <Select.Option value="精细航测">精细航测</Select.Option>
                  <Select.Option value="正射影像">正射影像</Select.Option>
                  <Select.Option value="热红外航测">热红外航测</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="航测区域" name="area" rules={[{ required: true, message: '请输入航测区域' }]}>
                <Input.TextArea rows={2} placeholder="请输入航测区域描述" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="飞行器型号" name="droneModel">
                <Select placeholder="请选择飞行器型号">
                  <Select.Option value="DJI M300RTK">DJI M300RTK</Select.Option>
                  <Select.Option value="DJI M210RTK">DJI M210RTK</Select.Option>
                  <Select.Option value="DJI P4RTK">DJI P4RTK</Select.Option>
                  <Select.Option value="DJI M300RTK+XT2">DJI M300RTK+XT2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="飞行员" name="pilot">
                <Select placeholder="请选择飞行员">
                  <Select.Option value="张机长">张机长</Select.Option>
                  <Select.Option value="李机长">李机长</Select.Option>
                  <Select.Option value="王机长">王机长</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="计划日期" name="plannedDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="任务状态" name="status">
                <Select>
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="pending">待执行</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name="remarks">
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UAVTask;