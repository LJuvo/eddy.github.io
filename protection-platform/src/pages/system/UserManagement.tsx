import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { usersData, rolesData } from '@/mock';

const { Option } = Select;
const { Search } = Input;

interface UserItem {
  id: string;
  username: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [data, setData] = useState<UserItem[]>(usersData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // 过滤数据
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchText === '' ||
      item.name.includes(searchText) ||
      item.username.includes(searchText) ||
      item.phone.includes(searchText);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesRole = roleFilter === 'all' || item.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // 打开新建/编辑弹窗
  const openModal = (user?: UserItem) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue(user);
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 保存用户
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        setData(
          data.map((item) =>
            item.id === editingUser.id ? { ...item, ...values } : item
          )
        );
        message.success('用户信息已更新');
      } else {
        const newUser: UserItem = {
          id: `U${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          status: '正常',
          lastLogin: '-',
        };
        setData([...data, newUser]);
        message.success('用户创建成功');
      }
      setIsModalVisible(false);
    });
  };

  // 删除用户
  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    message.success('用户已删除');
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    setData(data.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success(`已删除 ${selectedRowKeys.length} 个用户`);
  };

  // 查看详情
  const handleView = (user: UserItem) => {
    setViewingUser(user);
    setIsDetailVisible(true);
  };

  // 分配角色
  const handleAssignRole = (user: UserItem) => {
    setEditingUser(user);
    roleForm.setFieldsValue({ userId: user.id, userName: user.name, role: user.role });
    setIsRoleModalVisible(true);
  };

  // 保存角色分配
  const handleSaveRole = () => {
    roleForm.validateFields().then((values) => {
      setData(
        data.map((item) =>
          item.id === editingUser?.id ? { ...item, role: values.role } : item
        )
      );
      message.success('角色分配成功');
      setIsRoleModalVisible(false);
    });
  };

  // 表格列定义
  const columns: ColumnsType<UserItem> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (username) => (
        <span style={{ fontWeight: 500 }}>
          <UserOutlined style={{ marginRight: 6 }} />
          {username}
        </span>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => {
        const colorMap: Record<string, string> = {
          '系统管理员': 'red',
          '决策领导': 'purple',
          '科研人员': 'blue',
          '巡护管理员': 'green',
          '巡护员': 'cyan',
          '监控值班员': 'orange',
        };
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>;
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => (
        <Badge
          status={status === '正常' ? 'success' : 'error'}
          text={status}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<LockOutlined />}
            onClick={() => handleAssignRole(record)}
          >
            角色
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户？"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <div className="user-management fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <UserOutlined style={{ marginRight: 8 }} />
            用户管理
          </h1>
          <p className="page-subtitle">管理系统用户账号、角色分配和权限管理</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新建用户
          </Button>
          <Popconfirm
            title={`确认删除选中的 ${selectedRowKeys.length} 个用户？`}
            onConfirm={handleBatchDelete}
            okText="确认"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* 筛选区域 */}
      <Card bodyStyle={{ padding: 16, marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索用户名、姓名或手机号"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select value={roleFilter} onChange={setRoleFilter} style={{ width: '100%' }}>
              <Option value="all">全部角色</Option>
              {rolesData.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: '100%' }}>
              <Option value="all">全部状态</Option>
              <Option value="正常">正常</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} md={8}>
            <Space>
              <span style={{ color: '#666' }}>
                共 <strong>{filteredData.length}</strong> 个用户
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 用户列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新建/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {rolesData.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请输入初始密码' }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsDetailVisible(false)}>关闭</Button>
            <Button
              type="primary"
              onClick={() => {
                setIsDetailVisible(false);
                if (viewingUser) openModal(viewingUser);
              }}
            >
              编辑
            </Button>
          </Space>
        }
        width={600}
      >
        {viewingUser && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="用户名">{viewingUser.username}</Descriptions.Item>
            <Descriptions.Item label="姓名">{viewingUser.name}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color="blue">{viewingUser.role}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge status={viewingUser.status === '正常' ? 'success' : 'error'} text={viewingUser.status} />
            </Descriptions.Item>
            <Descriptions.Item label="手机号">{viewingUser.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{viewingUser.email}</Descriptions.Item>
            <Descriptions.Item label="最后登录" span={2}>
              {viewingUser.lastLogin}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 角色分配弹窗 */}
      <Modal
        title="分配角色"
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleSaveRole}
        okText="保存"
        cancelText="取消"
        width={450}
      >
        <Form form={roleForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="userName" label="用户">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {rolesData.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;