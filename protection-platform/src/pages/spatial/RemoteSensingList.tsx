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
  Image,
  message,
  Drawer,
  Descriptions,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  CompareOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import { remoteSensingData } from '@/mock';
import dayjs from 'dayjs';

interface RemoteSensingItem {
  id: string;
  name: string;
  satellite: string;
  date: string;
  resolution: string;
  cloudCover: string;
  status: string;
  coverage?: string;
  size?: string;
}

const RemoteSensingList: React.FC = () => {
  const [dataList] = useState<RemoteSensingItem[]>([
    { id: 'RS001', name: 'GF1-2024-01-10', satellite: '高分一号', date: '2024-01-10', resolution: '16m', cloudCover: '5%', status: '已入库', coverage: '100%', size: '2.5GB' },
    { id: 'RS002', name: 'GF2-2024-01-05', satellite: '高分二号', date: '2024-01-05', resolution: '1m', cloudCover: '8%', status: '已入库', coverage: '100%', size: '8.2GB' },
    { id: 'RS003', name: 'ZY3-2023-12-20', satellite: '资源三号', date: '2023-12-20', resolution: '2.5m', cloudCover: '3%', status: '已处理', coverage: '95%', size: '4.1GB' },
    { id: 'RS004', name: 'GF1-2023-12-15', satellite: '高分一号', date: '2023-12-15', resolution: '16m', cloudCover: '12%', status: '已处理', coverage: '100%', size: '2.3GB' },
    { id: 'RS005', name: 'GF6-2023-12-10', satellite: '高分六号', date: '2023-12-10', resolution: '8m', cloudCover: '2%', status: '已入库', coverage: '100%', size: '5.6GB' },
    { id: 'RS006', name: 'GF1B-2023-11-28', satellite: '高分一号B', date: '2023-11-28', resolution: '16m', cloudCover: '15%', status: '处理中', coverage: '60%', size: '1.8GB' },
    { id: 'RS007', name: 'ZY02-2023-11-20', satellite: '资源二号', date: '2023-11-20', resolution: '3m', cloudCover: '6%', status: '已入库', coverage: '100%', size: '6.5GB' },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterSatellite, setFilterSatellite] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RemoteSensingItem | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<RemoteSensingItem> = [
    {
      title: '影像名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '卫星',
      dataIndex: 'satellite',
      key: 'satellite',
      width: 120,
      render: (satellite: string) => {
        const colorMap: Record<string, string> = {
          '高分一号': 'blue',
          '高分二号': 'green',
          '高分六号': 'cyan',
          '高分一号B': 'geekblue',
          '资源三号': 'purple',
          '资源二号': 'orange',
        };
        return <Tag color={colorMap[satellite] || 'default'}>{satellite}</Tag>;
      },
    },
    {
      title: '获取日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
      width: 100,
    },
    {
      title: '云量',
      dataIndex: 'cloudCover',
      key: 'cloudCover',
      width: 80,
      render: (cloudCover: string) => {
        const value = parseInt(cloudCover);
        return <span style={{ color: value > 10 ? '#ff4d4f' : '#52c41a' }}>{cloudCover}</span>;
      },
    },
    {
      title: '覆盖范围',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 120,
      render: (coverage: string) => <Progress percent={parseInt(coverage || '0')} size="small" />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          '已入库': { color: 'success', text: '已入库' },
          '已处理': { color: 'processing', text: '已处理' },
          '处理中': { color: 'warning', text: '处理中' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedItem(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" size="small" icon={<CompareOutlined />} onClick={() => {
            message.info('请在对比页面选择此影像');
          }}>
            对比
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = dataList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.satellite.toLowerCase().includes(searchText.toLowerCase());
    const matchSatellite = !filterSatellite || item.satellite === filterSatellite;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchSatellite && matchStatus;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">遥感影像列表</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />}>
            导入影像
          </Button>
          <Button icon={<CompareOutlined />} disabled={selectedRowKeys.length < 2}>
            影像对比
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="搜索影像名称或卫星"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="筛选卫星"
              allowClear
              style={{ width: '100%' }}
              value={filterSatellite}
              onChange={setFilterSatellite}
            >
              <Select.Option value="高分一号">高分一号</Select.Option>
              <Select.Option value="高分二号">高分二号</Select.Option>
              <Select.Option value="高分六号">高分六号</Select.Option>
              <Select.Option value="资源三号">资源三号</Select.Option>
              <Select.Option value="资源二号">资源二号</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="已入库">已入库</Select.Option>
              <Select.Option value="已处理">已处理</Select.Option>
              <Select.Option value="处理中">处理中</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button onClick={() => {
              setSearchText('');
              setFilterSatellite(null);
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
          rowSelection={rowSelection}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Drawer
        title="影像详情"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>下载</Button>
            <Button type="primary" icon={<CompareOutlined />}>添加到对比</Button>
          </Space>
        }
      >
        {selectedItem && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, background: '#f0f0f0', borderRadius: 8 }}>
                <Image
                  width={400}
                  height={300}
                  src="https://via.placeholder.com/400x300?text=Remote+Sensing+Image"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
            </Card>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="影像名称" span={2}>{selectedItem.name}</Descriptions.Item>
              <Descriptions.Item label="卫星">{selectedItem.satellite}</Descriptions.Item>
              <Descriptions.Item label="分辨率">{selectedItem.resolution}</Descriptions.Item>
              <Descriptions.Item label="获取日期">{selectedItem.date}</Descriptions.Item>
              <Descriptions.Item label="云量">
                <span style={{ color: parseInt(selectedItem.cloudCover) > 10 ? '#ff4d4f' : '#52c41a' }}>
                  {selectedItem.cloudCover}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="覆盖范围">{selectedItem.coverage}</Descriptions.Item>
              <Descriptions.Item label="文件大小">{selectedItem.size}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedItem.status === '已入库' ? 'success' : selectedItem.status === '处理中' ? 'warning' : 'processing'}>
                  {selectedItem.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title="波段信息" size="small" style={{ marginTop: 16 }}>
              <Row gutter={[8, 8]}>
                <Col span={6}><Tag color="blue">蓝光 Band1</Tag></Col>
                <Col span={6}><Tag color="green">绿光 Band2</Tag></Col>
                <Col span={6}><Tag color="red">红光 Band3</Tag></Col>
                <Col span={6}><Tag color="purple">近红外 Band4</Tag></Col>
              </Row>
            </Card>

            <Card title="处理进度" size="small" style={{ marginTop: 16 }}>
              <Row gutter={[16, 8]} align="middle">
                <Col span={20}>
                  <Progress percent={selectedItem.status === '处理中' ? 60 : 100} status={selectedItem.status === '处理中' ? 'active' : 'success'} />
                </Col>
                <Col span={4}>
                  <Tag color={selectedItem.status === '处理中' ? 'processing' : 'success'}>
                    {selectedItem.status}
                  </Tag>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RemoteSensingList;