import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Descriptions,
  Row,
  Col,
  Statistic,
  Avatar,
  Badge,
  List,
  Popconfirm,
  message,
  Tabs,
  DatePicker,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  patrolPersonnel as initialPersonnel,
} from '@/mock';

const { Option } = Select;
const { TextArea } = Input;

// 巡护人员类型扩展
interface PatrolPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: string;
  location: string;
  avatar?: string;
  joinDate?: string;
  patrolCount?: number;
  lastPatrolTime?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  certifications?: string[];
  remarks?: string;
}

const PatrolPersonnel: React.FC = () => {
  const [personnel, setPersonnel] = useState<PatrolPerson[]>(initialPersonnel);
  const [filteredPersonnel, setFilteredPersonnel] = useState<PatrolPerson[]>(initialPersonnel);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PatrolPerson | null>(null);
  const [form] = Form.useForm();

  // 筛选人员
  React.useEffect(() => {
    let result = personnel;
    if (searchText) {
      result = result.filter(
        person =>
          person.name.toLowerCase().includes(searchText.toLowerCase()) ||
          person.phone.includes(searchText) ||
          person.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter(person => person.status === statusFilter);
    }
    if (roleFilter) {
      result = result.filter(person => person.role === roleFilter);
    }
    setFilteredPersonnel(result);
  }, [personnel, searchText, statusFilter, roleFilter]);

  // 状态映射
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      '巡护中': { color: 'success', text: '巡护中' },
      '待命': { color: 'processing', text: '待命' },
      '休息': { color: 'default', text: '休息' },
      '请假': { color: 'warning', text: '请假' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 角色映射
  const getRoleTag = (role: string) => {
    const roleMap: Record<string, { color: string }> = {
      '巡护管理员': { color: 'purple' },
      '巡护员': { color: 'blue' },
    };
    const config = roleMap[role] || { color: 'default' };
    return <Tag color={config.color}>{role}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<PatrolPerson> = [
    {
      title: '人员编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name: string, record: PatrolPerson) => (
        <Space>
          <Avatar
            style={{
              background: record.status === '巡护中' ? '#2D7D46' : '#999',
            }}
            icon={<UserOutlined />}
          />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => getRoleTag(role),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '当前位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: '巡护次数',
      dataIndex: 'patrolCount',
      key: 'patrolCount',
      width: 100,
      sorter: (a, b) => (a.patrolCount || 0) - (b.patrolCount || 0),
    },
    {
      title: '最后巡护',
      dataIndex: 'lastPatrolTime',
      key: 'lastPatrolTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPerson(record);
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
              setSelectedPerson(record);
              form.setFieldsValue({
                ...record,
                joinDate: record.joinDate ? dayjs(record.joinDate) : undefined,
              });
              setCreateModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个巡护人员吗？"
            onConfirm={() => {
              setPersonnel(personnel.filter(p => p.id !== record.id));
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

  // 创建/编辑人员
  const handleSavePerson = () => {
    form.validateFields().then(values => {
      if (selectedPerson) {
        // 编辑
        setPersonnel(
          personnel.map(p =>
            p.id === selectedPerson.id
              ? {
                  ...p,
                  ...values,
                  joinDate: values.joinDate?.format('YYYY-MM-DD'),
                }
              : p
          )
        );
        message.success('修改成功');
      } else {
        // 新增
        const newPerson: PatrolPerson = {
          id: `P${String(personnel.length + 1).padStart(3, '0')}`,
          name: values.name,
          role: values.role,
          phone: values.phone,
          status: '待命',
          location: values.location || '管护站',
          joinDate: values.joinDate?.format('YYYY-MM-DD'),
          patrolCount: 0,
          emergencyContact: values.emergencyContact,
          emergencyPhone: values.emergencyPhone,
          certifications: values.certifications,
          remarks: values.remarks,
        };
        setPersonnel([newPerson, ...personnel]);
        message.success('添加成功');
      }
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  // 更新人员状态
  const updatePersonStatus = (id: string, newStatus: string) => {
    setPersonnel(
      personnel.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      )
    );
    message.success(`已将状态更新为"${newStatus}"`);
  };

  // 统计卡片数据
  const statsData = {
    total: personnel.length,
    onDuty: personnel.filter(p => p.status === '巡护中').length,
    onStandby: personnel.filter(p => p.status === '待命').length,
    onRest: personnel.filter(p => p.status === '休息').length,
  };

  // 当前巡护人员
  const onDutyPersonnel = personnel.filter(p => p.status === '巡护中');

  return (
    <div className="patrol-personnel-page fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">巡护人员管理</h1>
        </div>
        <div className="page-header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setSelectedPerson(null);
              setCreateModalVisible(true);
            }}
          >
            添加人员
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="人员总数"
              value={statsData.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="巡护中"
              value={statsData.onDuty}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="待命"
              value={statsData.onStandby}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="休息"
              value={statsData.onRest}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧人员列表 */}
        <Col xs={24} lg={16}>
          {/* 筛选区域 */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 8]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="搜索姓名或联系电话"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} sm={5}>
                <Select
                  placeholder="人员状态"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Option value="巡护中">巡护中</Option>
                  <Option value="待命">待命</Option>
                  <Option value="休息">休息</Option>
                  <Option value="请假">请假</Option>
                </Select>
              </Col>
              <Col xs={12} sm={5}>
                <Select
                  placeholder="角色"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Option value="巡护管理员">巡护管理员</Option>
                  <Option value="巡护员">巡护员</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6}>
                <Button
                  onClick={() => {
                    setSearchText('');
                    setStatusFilter(undefined);
                    setRoleFilter(undefined);
                  }}
                >
                  重置筛选
                </Button>
              </Col>
            </Row>
          </Card>

          {/* 人员列表 */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredPersonnel}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
              }}
              scroll={{ x: 1100 }}
            />
          </Card>
        </Col>

        {/* 右侧实时状态 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: '#2D7D46' }} />
                <span>当前巡护人员</span>
                <Badge count={onDutyPersonnel.length} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
          >
            <List
              dataSource={onDutyPersonnel}
              renderItem={(person) => (
                <List.Item
                  key={person.id}
                  actions={[
                    <Button
                      key="locate"
                      type="link"
                      size="small"
                      icon={<EnvironmentOutlined />}
                    >
                      定位
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ background: '#2D7D46' }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={person.name}
                    description={
                      <div>
                        <div style={{ fontSize: 12, color: '#666' }}>{person.role}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{person.location}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: '当前无巡护人员' }}
            />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12, fontWeight: 500 }}>快速操作</div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<CheckCircleOutlined />} onClick={() => message.info('批量签到功能开发中')}>
                批量签到
              </Button>
              <Button block icon={<TeamOutlined />} onClick={() => message.info('排班管理功能开发中')}>
                排班管理
              </Button>
              <Button block icon={<PhoneOutlined />} onClick={() => message.info('考勤记录功能开发中')}>
                考勤记录
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 创建/编辑人员弹窗 */}
      <Modal
        title={selectedPerson ? '编辑人员' : '添加人员'}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSavePerson}
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
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Option value="巡护管理员">巡护管理员</Option>
                  <Option value="巡护员">巡护员</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="入职日期"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergencyContact"
                label="紧急联系人"
              >
                <Input placeholder="请输入紧急联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emergencyPhone"
                label="紧急联系电话"
              >
                <Input placeholder="请输入紧急联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="location"
                label="常驻位置"
              >
                <Input placeholder="请输入常驻位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="certifications"
                label="资质证书"
              >
                <Select mode="tags" placeholder="请输入资质证书">
                  <Option value="巡护证">巡护证</Option>
                  <Option value="救援证">救援证</Option>
                  <Option value="红十字急救证">红十字急救证</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <TextArea rows={2} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 人员详情弹窗 */}
      <Modal
        title="人员详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            <Button
              type="primary"
              onClick={() => {
                setDetailModalVisible(false);
                if (selectedPerson) {
                  form.setFieldsValue({
                    ...selectedPerson,
                    joinDate: selectedPerson.joinDate ? dayjs(selectedPerson.joinDate) : undefined,
                  });
                  setCreateModalVisible(true);
                }
              }}
            >
              编辑信息
            </Button>
          </Space>
        }
        width={600}
      >
        {selectedPerson && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar
                size={80}
                style={{
                  background: selectedPerson.status === '巡护中' ? '#2D7D46' : '#999',
                }}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 500 }}>
                {selectedPerson.name}
              </div>
              <div style={{ marginTop: 4 }}>
                {getRoleTag(selectedPerson.role)}
                {getStatusTag(selectedPerson.status)}
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="人员编号">{selectedPerson.id}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedPerson.phone}</Descriptions.Item>
              <Descriptions.Item label="常驻位置">{selectedPerson.location}</Descriptions.Item>
              <Descriptions.Item label="入职日期">{selectedPerson.joinDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="巡护次数">{selectedPerson.patrolCount || 0}</Descriptions.Item>
              <Descriptions.Item label="最后巡护">{selectedPerson.lastPatrolTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="紧急联系人" span={2}>
                {selectedPerson.emergencyContact || '-'} {selectedPerson.emergencyPhone || ''}
              </Descriptions.Item>
              <Descriptions.Item label="资质证书" span={2}>
                {selectedPerson.certifications?.map((cert, index) => (
                  <Tag key={index} style={{ marginRight: 4 }}>{cert}</Tag>
                )) || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {selectedPerson.remarks || '-'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>状态操作</div>
              <Space wrap>
                <Button
                  size="small"
                  onClick={() => updatePersonStatus(selectedPerson.id, '巡护中')}
                  disabled={selectedPerson.status === '巡护中'}
                >
                  设为巡护中
                </Button>
                <Button
                  size="small"
                  onClick={() => updatePersonStatus(selectedPerson.id, '待命')}
                  disabled={selectedPerson.status === '待命'}
                >
                  设为待命
                </Button>
                <Button
                  size="small"
                  onClick={() => updatePersonStatus(selectedPerson.id, '休息')}
                  disabled={selectedPerson.status === '休息'}
                >
                  设为休息
                </Button>
                <Button
                  size="small"
                  onClick={() => updatePersonStatus(selectedPerson.id, '请假')}
                  disabled={selectedPerson.status === '请假'}
                >
                  设为请假
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PatrolPersonnel;
