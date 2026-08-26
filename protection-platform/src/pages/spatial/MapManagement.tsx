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
  Slider,
  Switch,
  message,
  Popconfirm,
  Row,
  Col,
  Radio,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { mapLayers } from '@/mock';

interface BaseMapItem {
  id: string;
  name: string;
  type: string;
  url: string;
  visible: boolean;
  opacity: number;
  thumbnail?: string;
}

const MapManagement: React.FC = () => {
  const [baseMapList] = useState<BaseMapItem[]>([
    { id: '1', name: '天地图', type: 'tianditu', url: 'https://t0.tianditu.gov.cn/img_w/wmts?', visible: true, opacity: 1, thumbnail: '' },
    { id: '2', name: '高德地图', type: 'gaode', url: 'https://webst0{s}.is.autonavi.com/map', visible: false, opacity: 1, thumbnail: '' },
    { id: '3', name: '高德卫星', type: 'gaode_satellite', url: 'https://webst0{s}.is.autonavi.com/map', visible: false, opacity: 1, thumbnail: '' },
    { id: '4', name: 'ArcGIS在线', type: 'arcgis', url: 'https://services.arcgisonline.com/ArcGIS/rest/services/', visible: false, opacity: 1, thumbnail: '' },
    { id: '5', name: 'Google卫星', type: 'google_satellite', url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', visible: false, opacity: 1, thumbnail: '' },
  ]);

  const [layerVisible, setLayerVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMap, setSelectedMap] = useState<BaseMapItem | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<BaseMapItem> = [
    {
      title: '底图名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          tianditu: { color: 'blue', text: '天地图' },
          gaode: { color: 'green', text: '高德地图' },
          gaode_satellite: { color: 'cyan', text: '高德卫星' },
          arcgis: { color: 'purple', text: 'ArcGIS' },
          google_satellite: { color: 'orange', text: 'Google卫星' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '透明度',
      dataIndex: 'opacity',
      key: 'opacity',
      render: (opacity: number) => `${Math.round(opacity * 100)}%`,
    },
    {
      title: '显示状态',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible: boolean) => (
        <Tag color={visible ? 'success' : 'default'}>
          {visible ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMap(record);
              setDetailVisible(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedMap(record);
              form.setFieldsValue(record);
              setLayerVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后无法恢复，确定要删除吗？"
            onConfirm={() => {
              message.success('删除成功');
            }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedMap(null);
    form.resetFields();
    setLayerVisible(true);
  };

  const handleEdit = () => {
    setLayerVisible(false);
    message.success('保存成功');
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">底图管理</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加底图
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" style={{ background: '#f0f0f0', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600 }}>天地图</div>
              <div style={{ fontSize: 12, color: '#666' }}>当前启用</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600 }}>高德地图</div>
              <div style={{ fontSize: 12, color: '#666' }}>点击切换</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600 }}>高德卫星</div>
              <div style={{ fontSize: 12, color: '#666' }}>点击切换</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600 }}>Google卫星</div>
              <div style={{ fontSize: 12, color: '#666' }}>点击切换</div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="底图列表">
        <Table
          columns={columns}
          dataSource={baseMapList}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={selectedMap ? '编辑底图' : '添加底图'}
        open={layerVisible}
        onCancel={() => setLayerVisible(false)}
        onOk={handleEdit}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="底图名称" name="name" rules={[{ required: true, message: '请输入底图名称' }]}>
            <Input placeholder="请输入底图名称" />
          </Form.Item>
          <Form.Item label="底图类型" name="type">
            <Select>
              <Select.Option value="tianditu">天地图</Select.Option>
              <Select.Option value="gaode">高德地图</Select.Option>
              <Select.Option value="gaode_satellite">高德卫星</Select.Option>
              <Select.Option value="arcgis">ArcGIS在线</Select.Option>
              <Select.Option value="google_satellite">Google卫星</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="服务地址" name="url" rules={[{ required: true, message: '请输入服务地址' }]}>
            <Input placeholder="请输入WMTS/TMS服务地址" />
          </Form.Item>
          <Form.Item label="透明度" name="opacity">
            <Slider min={0} max={1} step={0.1} marks={{ 0: '0%', 0.5: '50%', 1: '100%' }} />
          </Form.Item>
          <Form.Item label="启用状态" name="visible" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="底图详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button
            key="setActive"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => {
              setDetailVisible(false);
              message.success('已设置为当前底图');
            }}
          >
            设为当前底图
          </Button>,
        ]}
      >
        {selectedMap && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>底图名称</div>
                <div>{selectedMap.name}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>底图类型</div>
                <div>{selectedMap.type}</div>
              </Col>
              <Col span={24}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>服务地址</div>
                <div style={{ wordBreak: 'break-all', fontSize: 12, color: '#666' }}>
                  {selectedMap.url}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>透明度</div>
                <div>{Math.round(selectedMap.opacity * 100)}%</div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>启用状态</div>
                <Tag color={selectedMap.visible ? 'success' : 'default'}>
                  {selectedMap.visible ? '已启用' : '已禁用'}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapManagement;