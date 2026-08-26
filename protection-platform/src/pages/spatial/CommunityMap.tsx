import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Image,
  List,
  Avatar,
  Drawer,
  Descriptions,
  Popconfirm,
  Statistic,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { administrativeZones } from '@/mock';

interface Community {
  id: string;
  name: string;
  type: string;
  location: string;
  population: number;
  households: number;
  mainEthnicity: string;
  mainIndustry: string;
  distanceToReserve: string;
  hasBorderFlag: boolean;
  contactPerson: string;
  contactPhone: string;
  status: string;
}

const CommunityMap: React.FC = () => {
  const [communityList] = useState<Community[]>([
    {
      id: 'C001',
      name: '空山乡社区',
      type: '乡',
      location: '空山乡',
      population: 8200,
      households: 2100,
      mainEthnicity: '汉族',
      mainIndustry: '农业、旅游',
      distanceToReserve: '0km',
      hasBorderFlag: true,
      contactPerson: '李村长',
      contactPhone: '138****1234',
      status: '正常',
    },
    {
      id: 'C002',
      name: '涪阳镇社区',
      type: '镇',
      location: '涪阳镇',
      population: 15600,
      households: 4200,
      mainEthnicity: '汉族',
      mainIndustry: '农业、商贸',
      distanceToReserve: '2km',
      hasBorderFlag: true,
      contactPerson: '王镇长',
      contactPhone: '139****5678',
      status: '正常',
    },
    {
      id: 'C003',
      name: '诺江镇社区',
      type: '镇',
      location: '诺江镇',
      population: 28500,
      households: 7800,
      mainEthnicity: '汉族',
      mainIndustry: '工业、服务业',
      distanceToReserve: '5km',
      hasBorderFlag: false,
      contactPerson: '张镇长',
      contactPhone: '137****9012',
      status: '正常',
    },
    {
      id: 'C004',
      name: '永安镇社区',
      type: '镇',
      location: '永安镇',
      population: 12800,
      households: 3500,
      mainEthnicity: '汉族',
      mainIndustry: '农业、养殖',
      distanceToReserve: '3km',
      hasBorderFlag: true,
      contactPerson: '赵镇长',
      contactPhone: '136****3456',
      status: '正常',
    },
    {
      id: 'C005',
      name: '两河口乡社区',
      type: '乡',
      location: '两河口乡',
      population: 6800,
      households: 1800,
      mainEthnicity: '汉族',
      mainIndustry: '农业',
      distanceToReserve: '1km',
      hasBorderFlag: true,
      contactPerson: '孙村长',
      contactPhone: '135****7890',
      status: '正常',
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Community> = [
    {
      title: '社区名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Community) => (
        <Space>
          <HomeOutlined style={{ color: '#1890ff' }} />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '人口',
      dataIndex: 'population',
      key: 'population',
      width: 100,
      sorter: (a, b) => a.population - b.population,
      render: (population: number) => population.toLocaleString(),
    },
    {
      title: '户数',
      dataIndex: 'households',
      key: 'households',
      width: 80,
    },
    {
      title: '距保护区',
      dataIndex: 'distanceToReserve',
      key: 'distanceToReserve',
      width: 100,
    },
    {
      title: '界碑标识',
      dataIndex: 'hasBorderFlag',
      key: 'hasBorderFlag',
      width: 100,
      render: (hasBorderFlag: boolean) => (
        <Tag color={hasBorderFlag ? 'success' : 'warning'}>
          {hasBorderFlag ? '已设置' : '未设置'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedCommunity(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => {
            setSelectedCommunity(record);
            form.setFieldsValue(record);
            setCreateVisible(true);
          }}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除此社区？"
            onConfirm={() => message.success('删除成功')}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = communityList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !filterType || item.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = () => {
    setSelectedCommunity(null);
    form.resetFields();
    setCreateVisible(true);
  };

  const handleSubmit = () => {
    setCreateVisible(false);
    message.success('保存成功');
  };

  const totalPopulation = communityList.reduce((sum, item) => sum + item.population, 0);
  const totalHouseholds = communityList.reduce((sum, item) => sum + item.households, 0);
  const borderFlagCount = communityList.filter(item => item.hasBorderFlag).length;

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">社区分布</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            添加社区
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="社区总数"
              value={communityList.length}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="总人口"
              value={totalPopulation}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="总户数"
              value={totalHouseholds}
              suffix="户"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="已设界碑"
              value={borderFlagCount}
              suffix={`/ ${communityList.length}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="搜索社区名称或位置"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="筛选类型"
              allowClear
              style={{ width: '100%' }}
              value={filterType}
              onChange={setFilterType}
            >
              <Select.Option value="乡">乡</Select.Option>
              <Select.Option value="镇">镇</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button onClick={() => {
              setSearchText('');
              setFilterType(null);
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

      <Drawer
        title="社区详情"
        placement="right"
        width={500}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {selectedCommunity && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, background: '#f0f0f0', borderRadius: 8 }}>
                <Image
                  width="100%"
                  height={200}
                  src="https://via.placeholder.com/400x200?text=Community+Map"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  style={{ borderRadius: 4 }}
                />
              </div>
            </Card>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="社区名称" span={2}>
                <Space>
                  <HomeOutlined />
                  {selectedCommunity.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag>{selectedCommunity.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedCommunity.status === '正常' ? 'success' : 'error'}>
                  {selectedCommunity.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="地理位置">
                <Space>
                  <EnvironmentOutlined />
                  {selectedCommunity.location}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="距保护区">
                {selectedCommunity.distanceToReserve}
              </Descriptions.Item>
              <Descriptions.Item label="常住人口">
                {selectedCommunity.population.toLocaleString()} 人
              </Descriptions.Item>
              <Descriptions.Item label="总户数">
                {selectedCommunity.households} 户
              </Descriptions.Item>
              <Descriptions.Item label="主要民族">
                {selectedCommunity.mainEthnicity}
              </Descriptions.Item>
              <Descriptions.Item label="主要产业" span={2}>
                {selectedCommunity.mainIndustry}
              </Descriptions.Item>
              <Descriptions.Item label="界碑标识">
                <Tag color={selectedCommunity.hasBorderFlag ? 'success' : 'warning'}>
                  {selectedCommunity.hasBorderFlag ? '已设置' : '未设置'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="负责人">
                {selectedCommunity.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={2}>
                {selectedCommunity.contactPhone}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      <Modal
        title={selectedCommunity ? '编辑社区' : '添加社区'}
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="社区名称" name="name" rules={[{ required: true, message: '请输入社区名称' }]}>
                <Input placeholder="请输入社区名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择类型">
                  <Select.Option value="乡">乡</Select.Option>
                  <Select.Option value="镇">镇</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="地理位置" name="location" rules={[{ required: true, message: '请输入地理位置' }]}>
                <Input placeholder="请输入地理位置" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="距保护区距离" name="distanceToReserve">
                <Input placeholder="如: 2km" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="常住人口" name="population">
                <Input type="number" placeholder="请输入人口数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总户数" name="households">
                <Input type="number" placeholder="请输入户数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="主要民族" name="mainEthnicity">
                <Input placeholder="请输入主要民族" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="主要产业" name="mainIndustry">
                <Input placeholder="请输入主要产业" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="界碑标识" name="hasBorderFlag" valuePropName="checked">
                <Select placeholder="是否设置界碑">
                  <Select.Option value={true}>已设置</Select.Option>
                  <Select.Option value={false}>未设置</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="负责人" name="contactPerson">
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="contactPhone">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CommunityMap;