import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Tree,
  Checkbox,
  Row,
  Col,
  message,
  Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  KeyOutlined,
  SearchOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { rolesData } from '@/mock';

const { Search } = Input;
const { DirectoryTree } = Tree;

interface Permission {
  id: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'data';
  parentId?: string;
  description?: string;
}

// 模拟权限数据
const permissionData: Permission[] = [
  {
    id: 'P001',
    name: '系统管理',
    code: 'system',
    type: 'menu',
    description: '系统管理模块',
  },
  {
    id: 'P001-1',
    name: '用户管理',
    code: 'system:user',
    type: 'menu',
    parentId: 'P001',
    description: '用户管理菜单',
  },
  {
    id: 'P001-1-1',
    name: '查看用户',
    code: 'system:user:view',
    type: 'button',
    parentId: 'P001-1',
  },
  {
    id: 'P001-1-2',
    name: '新建用户',
    code: 'system:user:create',
    type: 'button',
    parentId: 'P001-1',
  },
  {
    id: 'P001-1-3',
    name: '编辑用户',
    code: 'system:user:edit',
    type: 'button',
    parentId: 'P001-1',
  },
  {
    id: 'P001-1-4',
    name: '删除用户',
    code: 'system:user:delete',
    type: 'button',
    parentId: 'P001-1',
  },
  {
    id: 'P001-2',
    name: '角色管理',
    code: 'system:role',
    type: 'menu',
    parentId: 'P001',
    description: '角色管理菜单',
  },
  {
    id: 'P001-2-1',
    name: '查看角色',
    code: 'system:role:view',
    type: 'button',
    parentId: 'P001-2',
  },
  {
    id: 'P001-2-2',
    name: '新建角色',
    code: 'system:role:create',
    type: 'button',
    parentId: 'P001-2',
  },
  {
    id: 'P001-2-3',
    name: '编辑角色',
    code: 'system:role:edit',
    type: 'button',
    parentId: 'P001-2',
  },
  {
    id: 'P001-2-4',
    name: '删除角色',
    code: 'system:role:delete',
    type: 'button',
    parentId: 'P001-2',
  },
  {
    id: 'P001-2-5',
    name: '配置权限',
    code: 'system:role:permission',
    type: 'button',
    parentId: 'P001-2',
  },
  {
    id: 'P001-3',
    name: '权限管理',
    code: 'system:permission',
    type: 'menu',
    parentId: 'P001',
  },
  {
    id: 'P001-4',
    name: '组织架构',
    code: 'system:org',
    type: 'menu',
    parentId: 'P001',
  },
  {
    id: 'P001-5',
    name: '操作日志',
    code: 'system:log',
    type: 'menu',
    parentId: 'P001',
  },
  {
    id: 'P002',
    name: '巡护管理',
    code: 'patrol',
    type: 'menu',
    description: '巡护管理模块',
  },
  {
    id: 'P002-1',
    name: '巡护任务',
    code: 'patrol:task',
    type: 'menu',
    parentId: 'P002',
  },
  {
    id: 'P002-2',
    name: '巡护轨迹',
    code: 'patrol:track',
    type: 'menu',
    parentId: 'P002',
  },
  {
    id: 'P002-3',
    name: '异常事件',
    code: 'patrol:alert',
    type: 'menu',
    parentId: 'P002',
  },
  {
    id: 'P002-4',
    name: '巡护人员',
    code: 'patrol:personnel',
    type: 'menu',
    parentId: 'P002',
  },
  {
    id: 'P003',
    name: '监测预警',
    code: 'monitor',
    type: 'menu',
    description: '监测预警模块',
  },
  {
    id: 'P003-1',
    name: '设备管理',
    code: 'monitor:device',
    type: 'menu',
    parentId: 'P003',
  },
  {
    id: 'P003-2',
    name: '数据监测',
    code: 'monitor:data',
    type: 'menu',
    parentId: 'P003',
  },
  {
    id: 'P003-3',
    name: '视频监控',
    code: 'monitor:video',
    type: 'menu',
    parentId: 'P003',
  },
  {
    id: 'P003-4',
    name: '告警管理',
    code: 'monitor:alert',
    type: 'menu',
    parentId: 'P003',
  },
  {
    id: 'P004',
    name: '生态数据',
    code: 'eco',
    type: 'menu',
    description: '生态数据模块',
  },
  {
    id: 'P004-1',
    name: '物种档案',
    code: 'eco:species',
    type: 'menu',
    parentId: 'P004',
  },
  {
    id: 'P004-2',
    name: '群落结构',
    code: 'eco:community',
    type: 'menu',
    parentId: 'P004',
  },
  {
    id: 'P004-3',
    name: '生境适宜性',
    code: 'eco:habitat',
    type: 'menu',
    parentId: 'P004',
  },
  {
    id: 'P004-4',
    name: '健康评估',
    code: 'eco:health',
    type: 'menu',
    parentId: 'P004',
  },
  {
    id: 'P004-5',
    name: '种群监测',
    code: 'eco:population',
    type: 'menu',
    parentId: 'P004',
  },
  {
    id: 'P005',
    name: '空间信息',
    code: 'spatial',
    type: 'menu',
    description: '空间信息模块',
  },
  {
    id: 'P005-1',
    name: '地图管理',
    code: 'spatial:map',
    type: 'menu',
    parentId: 'P005',
  },
  {
    id: 'P005-2',
    name: '图层管理',
    code: 'spatial:layer',
    type: 'menu',
    parentId: 'P005',
  },
  {
    id: 'P005-3',
    name: '遥感影像',
    code: 'spatial:remote',
    type: 'menu',
    parentId: 'P005',
  },
  {
    id: 'P005-4',
    name: 'UAV任务',
    code: 'spatial:uav',
    type: 'menu',
    parentId: 'P005',
  },
  {
    id: 'P006',
    name: '数据分析',
    code: 'analysis',
    type: 'menu',
    description: '数据分析模块',
  },
  {
    id: 'P006-1',
    name: '数据报表',
    code: 'analysis:report',
    type: 'menu',
    parentId: 'P006',
  },
  {
    id: 'P006-2',
    name: '数据导出',
    code: 'analysis:export',
    type: 'menu',
    parentId: 'P006',
  },
];

// 构建树形数据
const buildTreeData = (data: Permission[]): any[] => {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  data.forEach((item) => {
    map[item.id] = {
      key: item.id,
      title: item.name,
      code: item.code,
      type: item.type,
      children: [],
    };
  });

  data.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
};

const treeData = buildTreeData(permissionData);

const PermissionConfig: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['P001', 'P002', 'P003', 'P004', 'P005', 'P006']);
  const [searchText, setSearchText] = useState('');
  const [isConfigVisible, setIsConfigVisible] = useState(false);

  // 过滤树节点
  const filterTreeData = (data: any[], keyword: string): any[] => {
    if (!keyword) return data;
    const result: any[] = [];
    data.forEach((item) => {
      if (item.title.includes(keyword) || item.code.includes(keyword)) {
        result.push(item);
      } else if (item.children && item.children.length > 0) {
        const filteredChildren = filterTreeData(item.children, keyword);
        if (filteredChildren.length > 0) {
          result.push({ ...item, children: filteredChildren });
        }
      }
    });
    return result;
  };

  const displayTreeData = filterTreeData(treeData, searchText);

  // 选中角色
  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
    // 模拟加载该角色的权限
    const role = rolesData.find((r) => r.id === roleId);
    if (role) {
      // 模拟已分配的权限
      const assignedPermissions = permissionData
        .filter((p) => p.code.startsWith('system:') || p.code.startsWith('patrol:'))
        .map((p) => p.id);
      setSelectedPermissions(assignedPermissions);
    }
  };

  // 权限选择变化
  const handlePermissionChange = (checked: any, e: any) => {
    console.log('Permission changed:', checked, e);
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPermissions(permissionData.map((p) => p.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  // 保存权限配置
  const handleSave = () => {
    if (!selectedRole) {
      message.warning('请先选择要配置的角色');
      return;
    }
    message.success('权限配置已保存');
    setIsConfigVisible(false);
  };

  // 获取权限类型标签
  const getTypeTag = (type: string) => {
    const map: Record<string, { color: string; text: string }> = {
      menu: { color: 'blue', text: '菜单' },
      button: { color: 'green', text: '按钮' },
      data: { color: 'purple', text: '数据' },
    };
    const tag = map[type] || { color: 'default', text: type };
    return <Tag color={tag.color}>{tag.text}</Tag>;
  };

  // 获取已选角色的信息
  const selectedRoleInfo = rolesData.find((r) => r.id === selectedRole);

  return (
    <div className="permission-config fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <KeyOutlined style={{ marginRight: 8 }} />
            权限配置
          </h1>
          <p className="page-subtitle">管理系统权限、角色权限分配</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<SafetyOutlined />} onClick={() => setIsConfigVisible(true)}>
            权限配置
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* 左侧角色列表 */}
        <Col xs={24} lg={6}>
          <Card title="角色列表" bodyStyle={{ padding: 0 }}>
            <div style={{ padding: 12 }}>
              <Search
                placeholder="搜索角色"
                prefix={<SearchOutlined />}
                allowClear
              />
            </div>
            <div
              style={{
                maxHeight: 500,
                overflow: 'auto',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              {rolesData.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedRole === role.id ? '#e6f7ff' : 'transparent',
                    borderLeft: selectedRole === role.id ? '3px solid #1890ff' : '3px solid transparent',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{role.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {role.userCount} 用户 | {role.permissionCount} 权限
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 中间权限树 */}
        <Col xs={24} lg={10}>
          <Card
            title="权限列表"
            extra={
              <Space>
                <Checkbox onChange={(e) => handleSelectAll(e.target.checked)}>
                  全选
                </Checkbox>
              </Space>
            }
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ padding: 12 }}>
              <Search
                placeholder="搜索权限名称或编码"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            <div
              style={{
                maxHeight: 450,
                overflow: 'auto',
                padding: '0 12px 12px',
              }}
            >
              {displayTreeData.length === 0 ? (
                <Alert
                  message="未找到匹配的权限"
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              ) : (
                <DirectoryTree
                  checkable
                  selectable={false}
                  expandedKeys={expandedKeys}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  checkedKeys={selectedPermissions}
                  onCheck={handlePermissionChange}
                  treeData={displayTreeData}
                  defaultExpandAll
                />
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧已选权限详情 */}
        <Col xs={24} lg={8}>
          <Card title="已选权限">
            {!selectedRole ? (
              <Alert message="请先选择左侧角色" type="info" showIcon />
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Tag color="blue">{selectedRoleInfo?.name}</Tag>
                  <span style={{ color: '#666', marginLeft: 8 }}>
                    已选择 {selectedPermissions.length} 项权限
                  </span>
                </div>
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                  {selectedPermissions.length === 0 ? (
                    <Alert message="该角色暂无权限配置" type="warning" showIcon />
                  ) : (
                    <Table
                      dataSource={permissionData
                        .filter((p) => selectedPermissions.includes(p.id))
                        .map((p) => ({ ...p, key: p.id }))}
                      columns={[
                        {
                          title: '权限名称',
                          dataIndex: 'name',
                          key: 'name',
                          render: (name, record) => (
                            <span>
                              {name}
                              {getTypeTag(record.type)}
                            </span>
                          ),
                        },
                        {
                          title: '编码',
                          dataIndex: 'code',
                          key: 'code',
                          render: (code) => <Tag>{code}</Tag>,
                        },
                      ]}
                      pagination={false}
                      size="small"
                    />
                  )}
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* 权限配置弹窗 */}
      <Modal
        title="权限配置"
        open={isConfigVisible}
        onCancel={() => setIsConfigVisible(false)}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={900}
      >
        <Alert
          message="配置说明"
          description="在左侧选择角色，中间权限树中勾选需要分配的权限，右侧显示已选权限列表。权限分为菜单权限、按钮权限和数据权限三种类型。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Row gutter={16}>
          <Col span={8}>
            <Card title="选择角色" size="small">
              {rolesData.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: selectedRole === role.id ? '#e6f7ff' : 'transparent',
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                >
                  {role.name}
                </div>
              ))}
            </Card>
          </Col>
          <Col span={16}>
            <Card title="配置权限" size="small" bodyStyle={{ maxHeight: 400, overflow: 'auto' }}>
              <DirectoryTree
                checkable
                selectable={false}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                checkedKeys={selectedPermissions}
                onCheck={handlePermissionChange}
                treeData={displayTreeData}
                defaultExpandAll
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default PermissionConfig;