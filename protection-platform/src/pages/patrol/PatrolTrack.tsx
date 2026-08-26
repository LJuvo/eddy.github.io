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
  Timeline,
  Avatar,
  Badge,
  List,
  Popconfirm,
  message,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  StopOutlined,
  AimOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  patrolTasks,
  patrolPersonnel,
} from '@/mock';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 巡护轨迹记录类型
interface PatrolTrackRecord {
  id: string;
  taskId: string;
  taskName: string;
  patrolName: string;
  startTime: string;
  endTime: string;
  duration: number;
  distance: number;
  route: string;
  location: string;
  status: 'normal' | 'abnormal';
  findings?: string;
  points: { lng: number; lat: number; time: string }[];
}

const PatrolTrack: React.FC = () => {
  const [tracks, setTracks] = useState<PatrolTrackRecord[]>([
    {
      id: 'TR001',
      taskId: 'PT001',
      taskName: '诺水河干流日常巡护',
      patrolName: '李建国',
      startTime: '2024-01-15 08:00',
      endTime: '2024-01-15 17:00',
      duration: 540,
      distance: 12.5,
      route: '诺水河干流-涪阳镇至诺江镇段',
      location: '诺水河干流',
      status: 'normal',
      findings: '巡护区域一切正常，未发现异常情况',
      points: [
        { lng: 107.012, lat: 31.923, time: '2024-01-15 08:00' },
        { lng: 107.015, lat: 31.926, time: '2024-01-15 09:30' },
        { lng: 107.018, lat: 31.929, time: '2024-01-15 11:00' },
        { lng: 107.022, lat: 31.932, time: '2024-01-15 14:00' },
        { lng: 107.025, lat: 31.935, time: '2024-01-15 17:00' },
      ],
    },
    {
      id: 'TR002',
      taskId: 'PT004',
      taskName: '缓冲区例行巡护',
      patrolName: '赵伟',
      startTime: '2024-01-14 08:00',
      endTime: '2024-01-14 16:00',
      duration: 480,
      distance: 10.2,
      route: '缓冲区-空山乡至两河口乡',
      location: '空山乡至两河口乡',
      status: 'normal',
      findings: '缓冲区基础设施完好，标识牌清晰',
      points: [
        { lng: 107.105, lat: 31.856, time: '2024-01-14 08:00' },
        { lng: 107.108, lat: 31.860, time: '2024-01-14 10:00' },
        { lng: 107.112, lat: 31.865, time: '2024-01-14 14:00' },
        { lng: 107.115, lat: 31.870, time: '2024-01-14 16:00' },
      ],
    },
    {
      id: 'TR003',
      taskId: 'PT003',
      taskName: '水质异常排查',
      patrolName: '李建国',
      startTime: '2024-01-13 14:00',
      endTime: '2024-01-13 18:00',
      duration: 240,
      distance: 5.8,
      route: '诺水河支流-澌滩河',
      location: '澌滩河流域',
      status: 'abnormal',
      findings: '发现不明污水排入口，已拍照取证并上报',
      points: [
        { lng: 107.205, lat: 31.756, time: '2024-01-13 14:00' },
        { lng: 107.210, lat: 31.760, time: '2024-01-13 15:30' },
        { lng: 107.215, lat: 31.765, time: '2024-01-13 18:00' },
      ],
    },
  ]);

  const [filteredTracks, setFilteredTracks] = useState<PatrolTrackRecord[]>(tracks);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<PatrolTrackRecord | null>(null);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 筛选轨迹记录
  React.useEffect(() => {
    let result = tracks;
    if (searchText) {
      result = result.filter(
        track =>
          track.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
          track.patrolName.toLowerCase().includes(searchText.toLowerCase()) ||
          track.route.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter(track => track.status === statusFilter);
    }
    if (dateRange) {
      result = result.filter(track => {
        const trackDate = dayjs(track.startTime);
        return trackDate.isAfter(dateRange[0]) && trackDate.isBefore(dateRange[1]);
      });
    }
    setFilteredTracks(result);
  }, [tracks, searchText, statusFilter, dateRange]);

  // 格式化时长
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins > 0 ? `${mins}分钟` : ''}` : `${mins}分钟`;
  };

  // 表格列定义
  const columns: ColumnsType<PatrolTrackRecord> = [
    {
      title: '记录编号',
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
      title: '巡护人员',
      dataIndex: 'patrolName',
      key: 'patrolName',
      width: 100,
    },
    {
      title: '巡护路线',
      dataIndex: 'route',
      key: 'route',
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
    },
    {
      title: '巡护时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => (
        <span style={{ color: '#666' }}>{formatDuration(duration)}</span>
      ),
    },
    {
      title: '巡护距离',
      dataIndex: 'distance',
      key: 'distance',
      width: 100,
      render: (distance: number) => `${distance} km`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'success' : 'warning'}>
          {status === 'normal' ? '正常' : '异常'}
        </Tag>
      ),
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
              setSelectedTrack(record);
              setDetailModalVisible(true);
            }}
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条轨迹记录吗？"
            onConfirm={() => {
              setTracks(tracks.filter(t => t.id !== record.id));
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

  // 统计卡片数据
  const statsData = {
    totalRecords: tracks.length,
    totalDistance: tracks.reduce((sum, t) => sum + t.distance, 0).toFixed(1),
    totalDuration: tracks.reduce((sum, t) => sum + t.duration, 0),
    abnormalCount: tracks.filter(t => t.status === 'abnormal').length,
  };

  return (
    <div className="patrol-track-page fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">巡护轨迹记录</h1>
        </div>
        <div className="page-header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setRecordModalVisible(true);
            }}
          >
            记录轨迹
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="轨迹记录数"
              value={statsData.totalRecords}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="总巡护里程"
              value={statsData.totalDistance}
              suffix="km"
              prefix={<AimOutlined />}
              valueStyle={{ color: '#2D7D46' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="总巡护时长"
              value={formatDuration(statsData.totalDuration)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="异常记录"
              value={statsData.abnormalCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: statsData.abnormalCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索任务名称或巡护人员"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={5}>
            <Select
              placeholder="巡护状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="normal">正常</Option>
              <Option value="abnormal">异常</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={5}>
            <Button onClick={() => {
              setSearchText('');
              setStatusFilter(undefined);
              setDateRange(null);
            }}>
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 轨迹列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTracks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 轨迹详情弹窗 */}
      <Modal
        title="轨迹详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            <Button icon={<PlayCircleOutlined />}>轨迹回放</Button>
          </Space>
        }
        width={800}
      >
        {selectedTrack && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="记录编号">{selectedTrack.id}</Descriptions.Item>
              <Descriptions.Item label="关联任务">{selectedTrack.taskName}</Descriptions.Item>
              <Descriptions.Item label="巡护人员">{selectedTrack.patrolName}</Descriptions.Item>
              <Descriptions.Item label="巡护区域">{selectedTrack.location}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{selectedTrack.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{selectedTrack.endTime}</Descriptions.Item>
              <Descriptions.Item label="巡护时长">
                {formatDuration(selectedTrack.duration)}
              </Descriptions.Item>
              <Descriptions.Item label="巡护距离">
                {selectedTrack.distance} km
              </Descriptions.Item>
              <Descriptions.Item label="巡护路线" span={2}>{selectedTrack.route}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedTrack.status === 'normal' ? 'success' : 'warning'}>
                  {selectedTrack.status === 'normal' ? '正常' : '异常'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="巡护发现">
                {selectedTrack.findings || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Card size="small" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>轨迹点位（共{selectedTrack.points.length}个）</div>
              <Timeline>
                {selectedTrack.points.map((point, index) => (
                  <Timeline.Item key={index} color={index === 0 ? 'green' : index === selectedTrack.points.length - 1 ? 'red' : 'blue'}>
                    <div>
                      <div>时间：{point.time}</div>
                      <div>坐标：{point.lng.toFixed(3)}, {point.lat.toFixed(3)}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </>
        )}
      </Modal>

      {/* 记录轨迹弹窗 */}
      <Modal
        title="记录轨迹"
        open={recordModalVisible}
        onCancel={() => {
          setRecordModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taskId"
                label="关联任务"
                rules={[{ required: true, message: '请选择关联任务' }]}
              >
                <Select placeholder="请选择关联任务">
                  {patrolTasks.filter(t => t.status === 'completed' || t.status === 'in_progress').map(task => (
                    <Option key={task.id} value={task.id}>{task.title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="patrolName"
                label="巡护人员"
                rules={[{ required: true, message: '请输入巡护人员' }]}
              >
                <Select placeholder="请选择巡护人员">
                  {patrolPersonnel.map(p => (
                    <Option key={p.id} value={p.name}>{p.name}</Option>
                  ))}
                </Select>
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
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="route"
                label="巡护路线"
                rules={[{ required: true, message: '请输入巡护路线' }]}
              >
                <Input placeholder="请输入巡护路线" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="distance"
                label="巡护距离(km)"
                rules={[{ required: true, message: '请输入巡护距离' }]}
              >
                <Input type="number" placeholder="请输入巡护距离" suffix="km" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="巡护状态"
                rules={[{ required: true, message: '请选择巡护状态' }]}
              >
                <Select placeholder="请选择巡护状态">
                  <Option value="normal">正常</Option>
                  <Option value="abnormal">异常</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="findings"
                label="巡护发现"
              >
                <TextArea rows={3} placeholder="请输入巡护发现" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setRecordModalVisible(false);
                  form.resetFields();
                }}>
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    form.validateFields().then(values => {
                      const duration = dayjs(values.endTime).diff(dayjs(values.startTime), 'minute');
                      const newRecord: PatrolTrackRecord = {
                        id: `TR${String(tracks.length + 1).padStart(3, '0')}`,
                        taskId: values.taskId,
                        taskName: patrolTasks.find(t => t.id === values.taskId)?.title || '',
                        patrolName: values.patrolName,
                        startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
                        endTime: values.endTime.format('YYYY-MM-DD HH:mm'),
                        duration,
                        distance: values.distance,
                        route: values.route,
                        location: values.route.split('-')[0] || values.route,
                        status: values.status,
                        findings: values.findings,
                        points: [],
                      };
                      setTracks([newRecord, ...tracks]);
                      setRecordModalVisible(false);
                      form.resetFields();
                      message.success('记录成功');
                    });
                  }}
                >
                  提交记录
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PatrolTrack;
