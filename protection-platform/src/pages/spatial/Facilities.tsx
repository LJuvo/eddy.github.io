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
  DatePicker,
  message,
  Popconfirm,
  Image,
  Drawer,
  Descriptions,
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
  BuildOutlined,
  CameraOutlined,
  SettingOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import { facilitiesData } from '@/mock';
import dayjs from 'dayjs';

interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  builtYear: number;
  status: string;
  area?: string;
  capacity?: string;
  staffCount?: number;
  equipment?: string[];
  contactPerson?: string;
  contactPhone?: string;
  remarks?: string;
}

const Facilities: React.FC = () => {
  const [facilityList] = useState<Facility[]>([
    {
      id: 'F001',
      name: '空山管护站',
      type: '管护站',
      location: '空山乡',
      builtYear: 2018,
      status: '正常',
      area: '500m²',
      capacity: '10人',
      staffCount: 4,
      equipment: ['巡护车辆', '对讲机', 'GPS定位仪', '红外相机'],
      contactPerson: '李站长',
      contactPhone: '138****1234',
      remarks: '负责空山乡区域巡护工作',
    },
    {
      id: 'F002',
      name: '涪阳管护站',
      type: '管护站',
      location: '涪阳镇',
      builtYear: 2019,
      status: '正常',
      area: '600m²',
      capacity: '12人',
      staffCount: 5,
      equipment: ['巡护车辆', '对讲机', 'GPS定位仪', '水质检测仪'],
      contactPerson: '王站长',
      contactPhone: '139****5678',
      remarks: '负责涪阳镇区域巡护工作',
    },
    {
      id: 'F003',
      name: '诺江管护站',
      type: '管护站',
      location: '诺江镇',
      builtYear: 2017,
      status: '正常',
      area: '800m²',
      capacity: '15人',
      staffCount: 6,
      equipment: ['巡护车辆', '对讲机', 'GPS定位仪', '无人机'],
      contactPerson: '张站长',
      contactPhone: '137****9012',
      remarks: '管理局所在地',
    },
    {
      id: 'F004',
      name: '水质自动监测站',
      type: '监测站',
      location: '核心区',
      builtYear: 2020,
      status: '正常',
      equipment: ['水质传感器', '流量计', '数据采集仪', '太阳能供电系统'],
      contactPerson: '陈技术员',
      contactPhone: '136****3456',
      remarks: '24小时实时监测水质',
    },
    {
      id: 'F005',
      name: '气象观测站-空山乡',
      type: '监测站',
      location: '空山乡',
      builtYear: 2019,
      status: '正常',
      equipment: ['气象传感器', '温湿度计', '风速风向仪', '降雨量计'],
      contactPerson: '赵技术员',
      contactPhone: '135****7890',
      remarks: '气象数据采集',
    },
    {
      id: 'F006',
      name: '界碑-001',
      type: '标识牌',
      location: '诺江镇入口',
      builtYear: 2016,
      status: '正常',
      remarks: '保护区边界标识',
    },
    {
      id: 'F007',
      name: '界碑-002',
      type: '标识牌',
      location: '空山乡入口',
      builtYear: 2016,
      status: '正常',
      remarks: '保护区边界标识',
    },
    {
      id: 'F008',
      name: '警示牌-001',
      type: '标识牌',
      location: '涪阳镇河段',
      builtYear: 2021,
      status: '正常',
      remarks: '禁止捕捞警示',
    },
    {
      id: 'F009',
      name: '视频监控点-1',
      type: '监控设备',
      location: '诺水河干流-涪阳镇',
      builtYear: 2020,
      status: '在线',
      equipment: ['高清摄像头', '夜视功能', '云台控制'],
      contactPerson: '孙值班',
      contactPhone: '134****1234',
    },
    {
      id: 'F010',
      name: '视频监控点-2',
      type: '监控设备',
      location: '诺水河干流-诺江镇',
      builtYear: 2020,
      status: '离线',
      equipment: ['高清摄像头', '夜视功能'],
      contactPerson: '孙值班',
      contactPhone: '134****1234',
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [form] = Form.useForm();

  const typeIconMap: Record<string, React.ReactNode> = {
    '管护站': <BuildOutlined />,
    '监测站': <SettingOutlined />,
    '标识牌': <FlagOutlined />,
    '监控设备': <CameraOutlined />,
  };

  const typeColorMap: Record<string, string> = {
    '管护站': 'blue',
    '监测站': 'cyan',
    '标识牌': 'orange',
    '监控设备': 'purple',
  };

  const columns: ColumnsType<Facility> = [
    {
      title: '设施名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Facility) => (
        <Space>
          <span style={{ color: typeColorMap[record.type] || '#1890ff' }}>
            {typeIconMap[record.type] || <SettingOutlined />}
          </span>
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={typeColorMap[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      ellipsis: true,
    },
    {
      title: '建成年份',
      dataIndex: 'builtYear',
      key: 'builtYear',
      width: 100,
      sorter: (a, b) => a.builtYear - b.builtYear,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '正常': 'success',
          '在线': 'success',
          '离线': 'error',
          '维修中': 'warning',
          '停用': 'default',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedFacility(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => {
            setSelectedFacility(record);
            form.setFieldsValue(record);
            setCreateVisible(true);
          }}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除此设施？"
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

  const filteredData = facilityList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !filterType || item.type === filterType;
    return matchSearch && matchType;
  });

  const statsData = [
    { title: '管护站', value: facilityList.filter(f => f.type === '管护站').length, icon: <BuildOutlined />, color: '#1890ff' },
    { title: '监测站', value: facilityList.filter(f => f.type === '监测站').length, icon: <SettingOutlined />, color: '#13c2c2' },
    { title: '标识牌', value: facilityList.filter(f => f.type === '标识牌').length, icon: <FlagOutlined />, color: '#faad14' },
    { title: '监控设备', value: facilityList.filter(f => f.type === '监控设备').length, icon: <CameraOutlined />, color: '#722ed1' },
  ];

  const handleCreate = () => {
    setSelectedFacility(null);
    form.resetFields();
    setCreateVisible(true);
  };

  const handleSubmit = () => {
    setCreateVisible(false);
    message.success('保存成功');
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">基础设施管理</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            添加设施
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card size="small">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="搜索设施名称或位置"
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
              <Select.Option value="管护站">管护站</Select.Option>
              <Select.Option value="监测站">监测站</Select.Option>
              <Select.Option value="标识牌">标识牌</Select.Option>
              <Select.Option value="监控设备">监控设备</Select.Option>
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
        title="设施详情"
        placement="right"
        width={500}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {selectedFacility && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, background: '#f0f0f0', borderRadius: 8 }}>
                <div style={{ fontSize: 48, color: typeColorMap[selectedFacility.type], marginBottom: 8 }}>
                  {typeIconMap[selectedFacility.type]}
                </div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedFacility.name}</div>
                <Tag color={typeColorMap[selectedFacility.type]} style={{ marginTop: 8 }}>
                  {selectedFacility.type}
                </Tag>
              </div>
            </Card>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="设施名称" span={2}>{selectedFacility.name}</Descriptions.Item>
              <Descriptions.Item label="设施类型">
                <Tag color={typeColorMap[selectedFacility.type]}>{selectedFacility.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedFacility.status === '正常' || selectedFacility.status === '在线' ? 'success' : 'error'}>
                  {selectedFacility.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="地理位置" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {selectedFacility.location}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="建成年份">{selectedFacility.builtYear}</Descriptions.Item>
              <Descriptions.Item label="使用年限">
                {dayjs().year() - selectedFacility.builtYear} 年
              </Descriptions.Item>
              {selectedFacility.area && (
                <Descriptions.Item label="占地面积">{selectedFacility.area}</Descriptions.Item>
              )}
              {selectedFacility.capacity && (
                <Descriptions.Item label="容量">{selectedFacility.capacity}</Descriptions.Item>
              )}
              {selectedFacility.staffCount && (
                <Descriptions.Item label="工作人员">
                  {selectedFacility.staffCount} 人
                </Descriptions.Item>
              )}
              {selectedFacility.contactPerson && (
                <Descriptions.Item label="负责人">{selectedFacility.contactPerson}</Descriptions.Item>
              )}
              {selectedFacility.contactPhone && (
                <Descriptions.Item label="联系电话">{selectedFacility.contactPhone}</Descriptions.Item>
              )}
              {selectedFacility.remarks && (
                <Descriptions.Item label="备注" span={2}>{selectedFacility.remarks}</Descriptions.Item>
              )}
            </Descriptions>

            {selectedFacility.equipment && selectedFacility.equipment.length > 0 && (
              <Card title="配套设备" size="small" style={{ marginTop: 16 }}>
                <Row gutter={[8, 8]}>
                  {selectedFacility.equipment.map((item, index) => (
                    <Col span={12} key={index}>
                      <Tag color="blue">{item}</Tag>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        title={selectedFacility ? '编辑设施' : '添加设施'}
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="设施名称" name="name" rules={[{ required: true, message: '请输入设施名称' }]}>
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设施类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择类型">
                  <Select.Option value="管护站">管护站</Select.Option>
                  <Select.Option value="监测站">监测站</Select.Option>
                  <Select.Option value="标识牌">标识牌</Select.Option>
                  <Select.Option value="监控设备">监控设备</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="地理位置" name="location" rules={[{ required: true, message: '请输入地理位置' }]}>
                <Input placeholder="请输入地理位置" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="建成年份" name="builtYear">
                <DatePicker picker="year" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="占地面积" name="area">
                <Input placeholder="如: 500m²" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="容量" name="capacity">
                <Input placeholder="如: 10人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工作人员" name="staffCount">
                <Input type="number" placeholder="请输入人数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status">
                <Select>
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="维修中">维修中</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
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

export default Facilities;