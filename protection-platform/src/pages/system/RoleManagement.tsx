import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Statistic,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SafetyOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { rolesData } from '@/mock';

const { Search } = Input;

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissionCount: number;
  status: string;
}

const RoleManagement: React.FC = () => {
  const [data, setData] = useState<Role[]>(rolesData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isPermissionVisible, setIsPermissionVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 过滤数据
  const filteredData = data.filter(
    (item) =>
      searchText === '' ||
      item.name.includes(searchText) ||
      item.code.includes(searchText)
  );

  // 打开新建/编辑弹窗
  const openModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue(role);
    } else {
      setEditingRole(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 保存角色
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingRole) {
        setData(
          data.map((item) =>
            item.id === editingRole.id ? { ...item, ...values } : item
          )
        );
        message.success('角色信息已更新');
      } else {
        const newRole: Role = {
          id: `R${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          userCount: 0,
          permissionCount: 0,
          status: '正常',
        };
        setData([...data, newRole]);
        message.success('角色创建成功');
      }
      setIsModalVisible(false);
    });
  };

  // 删除角色
  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    message.success('角色已删除');
  };

  // 查看详情
  const handleView = (role: Role) => {
    setViewingRole(role);
    setIsDetailVisible(true);
  };

  // 配置权限
  const handlePermission = (role: Role) => {
    setEditingRole(role);
    setIsPermissionVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name) => (
        <span style={{ fontWeight: 500 }}>
          <SafetyOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {name}
        </span>
      ),
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (code) => <Tag>{code}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      sorter: (a, b) => a.userCount - b.userCount,
      render: (count) => (
        <span style={{ color: count > 0 ? '#1890ff' : '#999' }}>{count}</span>
      ),
    },
    {
      title: '权限数',
      dataIndex: 'permissionCount',
      key: 'permissionCount',
      width: 100,
      sorter: (a, b) => a.permissionCount - b.permissionCount,
      render: (count) => (
        <span style={{ color: count > 0 ? '#52c41a' : '#999' }}>{count}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
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
            icon={<SettingOutlined />}
            onClick={() => handlePermission(record)}
          >
            权限
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
            title="确认删除该角色？"
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
    <div className="role-management fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <SafetyOutlined style={{ marginRight: 8 }} />
            角色管理
          </h1>
          <p className="page-subtitle">管理系统角色、角色权限配置</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新建角色
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="角色总数"
              value={data.length}
              prefix={<SafetyOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="用户总数"
              value={data.reduce((sum, item) => sum + item.userCount, 0)}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="权限总数"
              value={data.reduce((sum, item) => sum + item.permissionCount, 0)}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="正常角色"
              value={data.filter((item) => item.status === '正常').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索区域 */}
      <Card bodyStyle={{ padding: 16, marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Search
              placeholder="搜索角色名称或编码"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <span style={{ color: '#666' }}>
                共 <strong>{filteredData.length}</strong> 个角色
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 角色列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 新建/编辑角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-z_]+$/, message: '编码只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="请输入角色编码，如 admin、user" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色详情弹窗 */}
      <Modal
        title="角色详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsDetailVisible(false)}>关闭</Button>
            <Button
              type="primary"
              onClick={() => {
                setIsDetailVisible(false);
                if (viewingRole) openModal(viewingRole);
              }}
            >
              编辑
            </Button>
            <Button onClick={() => {
              setIsDetailVisible(false);
              if (viewingRole) handlePermission(viewingRole);
            }}>
              配置权限
            </Button>
          </Space>
        }
        width={600}
      >
        {viewingRole && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 20 }}>
              <Descriptions.Item label="角色名称" span={2}>
                <span style={{ fontWeight: 500 }}>{viewingRole.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="角色编码">
                <Tag>{viewingRole.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={viewingRole.status === '正常' ? 'green' : 'red'}>
                  {viewingRole.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {viewingRole.description}
              </Descriptions.Item>
              <Descriptions.Item label="用户数">
                {viewingRole.userCount} 人
              </Descriptions.Item>
              <Descriptions.Item label="权限数">
                {viewingRole.permissionCount} 项
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 20 }}>
              <h4>权限概览</h4>
              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <Progress
                    type="circle"
                    percent={Math.round((viewingRole.permissionCount / 50) * 100)}
                    size={80}
                    format={(percent) => `${viewingRole.permissionCount}`}
                  />
                  <div style={{ textAlign: 'center', marginTop: 8 }}>已配置权限</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title={`权限配置 - ${editingRole?.name}`}
        open={isPermissionVisible}
        onCancel={() => setIsPermissionVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsPermissionVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                message.success('权限配置已保存');
                setIsPermissionVisible(false);
              }}
            >
              保存配置
            </Button>
          </Space>
        }
        width={800}
      >
        <div style={{ marginTop: 20 }}>
          <p style={{ color: '#666', marginBottom: 16 }}>
            为角色 <strong>{editingRole?.name}</strong> 配置系统权限
          </p>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            <p style={{ color: '#999', textAlign: 'center' }}>
              权限配置功能开发中...
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;