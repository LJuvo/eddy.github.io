import React, { useState } from 'react';
import {
  Card,
  Tree,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Tag,
  Breadcrumb,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApartmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import { orgStructureData } from '@/mock';

const { DirectoryTree } = Tree;
const { Option } = Select;

interface OrgNode {
  id: string;
  name: string;
  type: string;
  leader?: string;
  staffCount?: number;
  children?: OrgNode[];
}

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
}

const OrgStructure: React.FC = () => {
  const [treeData, setTreeData] = useState<OrgNode[]>(orgStructureData);
  const [selectedOrg, setSelectedOrg] = useState<OrgNode | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['ORG001']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrgNode | null>(null);
  const [viewingOrg, setViewingOrg] = useState<OrgNode | null>(null);
  const [form] = Form.useForm();

  // 模拟部门人员数据
  const staffData: Staff[] = [
    { id: 'S001', name: '张三', role: '部门主管', phone: '138****0001', email: 'zhangsan@nuoshu.cn', department: '综合管理部' },
    { id: 'S002', name: '李四', role: '文员', phone: '139****0002', email: 'lisi@nuoshu.cn', department: '综合管理部' },
    { id: 'S003', name: '王五', role: '人事专员', phone: '137****0003', email: 'wangwu@nuoshu.cn', department: '综合管理部' },
    { id: 'S004', name: '陈科研', role: '部门主管', phone: '137****0001', email: 'chenke@nuoshu.cn', department: '科研监测部' },
    { id: 'S005', name: '赵研究', role: '研究员', phone: '136****0001', email: 'zhaoyan@nuoshu.cn', department: '科研监测部' },
    { id: 'S006', name: '刘管理', role: '部门主管', phone: '136****0001', email: 'liugl@nuoshu.cn', department: '巡护执法部' },
    { id: 'S007', name: '李巡护', role: '巡护员', phone: '135****0001', email: 'lipatrol@nuoshu.cn', department: '巡护执法部' },
    { id: 'S008', name: '张巡护', role: '巡护员', phone: '134****0001', email: 'zhangpatrol@nuoshu.cn', department: '巡护执法部' },
    { id: 'S009', name: '孙技术', role: '部门主管', phone: '135****0001', email: 'sunjishu@nuoshu.cn', department: '信息管理中心' },
    { id: 'S010', name: '周技术', role: '技术员', phone: '133****0001', email: 'zhouji@nuoshu.cn', department: '信息管理中心' },
  ];

  // 模拟获取部门下的人员
  const getDepartmentStaff = (departmentName: string) => {
    return staffData.filter((s) => s.department === departmentName);
  };

  // 树节点点击
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const findNode = (nodes: OrgNode[], key: string): OrgNode | null => {
        for (const node of nodes) {
          if (node.id === key) return node;
          if (node.children) {
            const found = findNode(node.children, key);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(treeData, selectedKeys[0] as string);
      setSelectedOrg(node);
    }
  };

  // 打开新建/编辑弹窗
  const openModal = (org?: OrgNode, parentId?: string) => {
    if (org) {
      setEditingOrg(org);
      form.setFieldsValue(org);
    } else {
      setEditingOrg(null);
      form.resetFields();
      if (parentId) {
        form.setFieldsValue({ parentId });
      }
    }
    setIsModalVisible(true);
  };

  // 保存组织
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingOrg) {
        // 编辑
        const updateNode = (nodes: OrgNode[]): OrgNode[] => {
          return nodes.map((node) => {
            if (node.id === editingOrg.id) {
              return { ...node, ...values };
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) };
            }
            return node;
          });
        };
        setTreeData(updateNode(treeData));
        message.success('组织信息已更新');
      } else {
        // 新建
        const newOrg: OrgNode = {
          id: `ORG${Date.now()}`,
          ...values,
          type: '部门',
        };
        if (values.parentId) {
          const addChild = (nodes: OrgNode[]): OrgNode[] => {
            return nodes.map((node) => {
              if (node.id === values.parentId) {
                return {
                  ...node,
                  children: [...(node.children || []), newOrg],
                };
              }
              if (node.children) {
                return { ...node, children: addChild(node.children) };
              }
              return node;
            });
          };
          setTreeData(addChild(treeData));
        } else {
          setTreeData([...treeData, newOrg]);
        }
        message.success('组织创建成功');
      }
      setIsModalVisible(false);
    });
  };

  // 删除组织
  const handleDelete = (id: string) => {
    const deleteNode = (nodes: OrgNode[]): OrgNode[] => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? deleteNode(node.children) : undefined,
        }));
    };
    setTreeData(deleteNode(treeData));
    if (selectedOrg?.id === id) {
      setSelectedOrg(null);
    }
    message.success('组织已删除');
  };

  // 查看详情
  const handleView = (org: OrgNode) => {
    setViewingOrg(org);
    setIsDetailVisible(true);
  };

  // 计算总人数
  const countStaff = (node: OrgNode): number => {
    let count = node.staffCount || 0;
    if (node.children) {
      node.children.forEach((child) => {
        count += countStaff(child);
      });
    }
    return count;
  };

  // 渲染树节点
  const renderTreeNodes = (data: OrgNode[]) => {
    return data.map((item) => (
      <Tree.TreeNode
        key={item.id}
        title={
          <span>
            <ApartmentOutlined style={{ marginRight: 6, color: '#1890ff' }} />
            {item.name}
            <Tag style={{ marginLeft: 8 }}>{item.type}</Tag>
            {item.staffCount ? (
              <Tag style={{ marginLeft: 4 }} icon={<UserOutlined />}>
                {item.staffCount}人
              </Tag>
            ) : null}
          </span>
        }
        icon={<ContactsOutlined />}
      >
        {item.children && item.children.length > 0 && renderTreeNodes(item.children)}
      </Tree.TreeNode>
    ));
  };

  // 人员表格列
  const staffColumns: ColumnsType<Staff> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <span style={{ fontWeight: 500 }}>
          <UserOutlined style={{ marginRight: 6 }} />
          {name}
        </span>
      ),
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div className="org-structure fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <ApartmentOutlined style={{ marginRight: 8 }} />
            组织架构管理
          </h1>
          <p className="page-subtitle">管理保护区组织架构、部门及人员信息</p>
        </div>
        <div className="page-header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新建部门
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* 左侧组织树 */}
        <Col xs={24} lg={8}>
          <Card
            title="组织架构"
            extra={
              <Space>
                <Button
                  size="small"
                  onClick={() => setExpandedKeys(['ORG001'])}
                >
                  展开全部
                </Button>
                <Button
                  size="small"
                  onClick={() => setExpandedKeys([])}
                >
                  收起全部
                </Button>
              </Space>
            }
          >
            <DirectoryTree
              showIcon
              selectedKeys={selectedOrg ? [selectedOrg.id] : []}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              onSelect={handleTreeSelect}
            >
              {renderTreeNodes(treeData)}
            </DirectoryTree>
          </Card>
        </Col>

        {/* 右侧详情 */}
        <Col xs={24} lg={16}>
          <Card
            title={selectedOrg ? `部门详情 - ${selectedOrg.name}` : '部门详情'}
            extra={
              selectedOrg ? (
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal(undefined, selectedOrg.id)}
                  >
                    添加子部门
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => openModal(selectedOrg)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该部门？"
                    onConfirm={() => handleDelete(selectedOrg.id)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              ) : null
            }
          >
            {!selectedOrg ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <ApartmentOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>请在左侧选择要查看的部门</p>
              </div>
            ) : (
              <>
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="部门名称" span={2}>
                    <span style={{ fontWeight: 500 }}>{selectedOrg.name}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="部门类型">
                    <Tag>{selectedOrg.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="部门负责人">
                    {selectedOrg.leader || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="部门人数">
                    {selectedOrg.staffCount || 0} 人
                  </Descriptions.Item>
                  <Descriptions.Item label="子部门数" span={2}>
                    {selectedOrg.children?.length || 0} 个
                  </Descriptions.Item>
                </Descriptions>

                {/* 子部门 */}
                {selectedOrg.children && selectedOrg.children.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4>子部门</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selectedOrg.children.map((child) => (
                        <Tag
                          key={child.id}
                          icon={<ApartmentOutlined />}
                          style={{ padding: '4px 12px', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedOrg(child);
                            setExpandedKeys([...expandedKeys, selectedOrg.id]);
                          }}
                        >
                          {child.name} ({child.staffCount || 0}人)
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* 部门人员 */}
                <div style={{ marginTop: 16 }}>
                  <h4>部门人员</h4>
                  <Table
                    columns={staffColumns}
                    dataSource={getDepartmentStaff(selectedOrg.name)}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingOrg ? '编辑部门' : '新建部门'}
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
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="leader" label="部门负责人">
            <Input placeholder="请输入部门负责人" />
          </Form.Item>
          <Form.Item name="staffCount" label="部门人数">
            <Input type="number" placeholder="请输入部门人数" />
          </Form.Item>
          <Form.Item name="type" label="部门类型" initialValue="部门">
            <Select>
              <Option value="部门">部门</Option>
              <Option value="科室">科室</Option>
              <Option value="管护站">管护站</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="部门详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsDetailVisible(false)}>关闭</Button>
            <Button
              type="primary"
              onClick={() => {
                setIsDetailVisible(false);
                if (viewingOrg) openModal(viewingOrg);
              }}
            >
              编辑
            </Button>
          </Space>
        }
        width={600}
      >
        {viewingOrg && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 20 }}>
              <Descriptions.Item label="部门名称" span={2}>
                <span style={{ fontWeight: 500 }}>{viewingOrg.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="部门类型">
                <Tag>{viewingOrg.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="部门负责人">
                {viewingOrg.leader || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="部门人数">
                {viewingOrg.staffCount || 0} 人
              </Descriptions.Item>
              <Descriptions.Item label="子部门数" span={2}>
                {viewingOrg.children?.length || 0} 个
              </Descriptions.Item>
            </Descriptions>
            {viewingOrg.children && viewingOrg.children.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>子部门列表</h4>
                <Table
                  dataSource={viewingOrg.children}
                  columns={[
                    { title: '名称', dataIndex: 'name', key: 'name' },
                    { title: '类型', dataIndex: 'type', key: 'type' },
                    { title: '负责人', dataIndex: 'leader', key: 'leader' },
                    { title: '人数', dataIndex: 'staffCount', key: 'staffCount' },
                  ]}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrgStructure;