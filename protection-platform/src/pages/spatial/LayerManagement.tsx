import React, { useState } from 'react';
import {
  Card,
  Tree,
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
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  BorderOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  opacity: number;
  children?: LayerItem[];
}

const LayerManagement: React.FC = () => {
  const [layers, setLayers] = useState<LayerItem[]>([
    {
      id: 'base',
      name: '底图',
      type: 'folder',
      visible: true,
      opacity: 1,
      children: [
        { id: 'base-tianditu', name: '天地图', type: 'base', visible: true, opacity: 1 },
        { id: 'base-gaode', name: '高德地图', type: 'base', visible: false, opacity: 1 },
        { id: 'base-satellite', name: '卫星影像', type: 'base', visible: false, opacity: 1 },
      ],
    },
    {
      id: 'overlay',
      name: '叠加图层',
      type: 'folder',
      visible: true,
      opacity: 1,
      children: [
        { id: 'overlay-boundary', name: '保护区边界', type: 'overlay', visible: true, opacity: 0.8 },
        { id: 'overlay-zoning', name: '功能区划', type: 'overlay', visible: true, opacity: 0.6 },
        { id: 'overlay-species', name: '物种分布', type: 'overlay', visible: false, opacity: 0.7 },
      ],
    },
    {
      id: 'vector',
      name: '矢量数据',
      type: 'folder',
      visible: true,
      opacity: 1,
      children: [
        { id: 'vector-facilities', name: '基础设施', type: 'vector', visible: true, opacity: 1 },
        { id: 'vector-patrollers', name: '巡护人员', type: 'vector', visible: true, opacity: 1 },
        { id: 'vector-communities', name: '社区分布', type: 'vector', visible: false, opacity: 1 },
      ],
    },
    {
      id: 'raster',
      name: '栅格数据',
      type: 'folder',
      visible: true,
      opacity: 1,
      children: [
        { id: 'raster-dtm', name: '数字高程模型', type: 'raster', visible: false, opacity: 0.9 },
        { id: 'raster-slope', name: '坡度分析', type: 'raster', visible: false, opacity: 0.9 },
        { id: 'raster-landuse', name: '土地利用', type: 'raster', visible: false, opacity: 0.8 },
      ],
    },
  ]);

  const [layerVisible, setLayerVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['base', 'overlay', 'vector', 'raster']);
  const [form] = Form.useForm();

  const toggleVisibility = (key: string) => {
    const toggleLayer = (items: LayerItem[]): LayerItem[] => {
      return items.map(item => {
        if (item.id === key) {
          return { ...item, visible: !item.visible };
        }
        if (item.children) {
          return { ...item, children: toggleLayer(item.children) };
        }
        return item;
      });
    };
    setLayers(toggleLayer(layers));
    message.success('显示状态已更新');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'base':
        return <BorderOutlined style={{ color: '#1890ff' }} />;
      case 'overlay':
        return <BorderOutlined style={{ color: '#52c41a' }} />;
      case 'vector':
        return <BorderOutlined style={{ color: '#722ed1' }} />;
      case 'raster':
        return <BorderOutlined style={{ color: '#faad14' }} />;
      default:
        return <BorderOutlined />;
    }
  };

  const convertToTreeData = (items: LayerItem[]): DataNode[] => {
    return items.map(item => ({
      key: item.id,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getTypeIcon(item.type)}
          <span>{item.name}</span>
          {!item.children && (
            <Tag color={item.visible ? 'success' : 'default'} style={{ marginLeft: 8 }}>
              {item.visible ? '可见' : '隐藏'}
            </Tag>
          )}
        </div>
      ),
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  const treeData = convertToTreeData(layers);

  const handleAdd = () => {
    setSelectedLayer(null);
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
          <h1 className="page-title">图层管理</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加图层
          </Button>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="图层树"
            extra={
              <Space>
                <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => message.info('显示所有图层')} />
                <Button type="text" size="small" icon={<EyeInvisibleOutlined />} onClick={() => message.info('隐藏所有图层')} />
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Tree
              checkable
              defaultExpandAll
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys)}
              treeData={treeData}
              style={{ minHeight: 400 }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="图层配置" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              {layers.map(group => (
                group.children?.map(layer => (
                  <Col span={8} key={layer.id}>
                    <Card
                      size="small"
                      style={{
                        borderColor: layer.visible ? '#52c41a' : '#d9d9d9',
                        cursor: 'pointer',
                      }}
                      bodyStyle={{ padding: 12 }}
                      onClick={() => {
                        setSelectedLayer(layer);
                        setDetailVisible(true);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{layer.name}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            透明度: {Math.round(layer.opacity * 100)}%
                          </div>
                        </div>
                        <Switch
                          size="small"
                          checked={layer.visible}
                          onChange={(checked) => {
                            checked ? message.success(`${layer.name} 已显示`) : message.info(`${layer.name} 已隐藏`);
                          }}
                          onClick={(checked, e) => e.stopPropagation()}
                        />
                      </div>
                    </Card>
                  </Col>
                ))
              ))}
            </Row>
          </Card>

          <Card title="样式配置">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="默认透明度">
                    <Slider defaultValue={80} marks={{ 0: '0%', 50: '50%', 100: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="图层分组">
                    <Select defaultValue="overlay" style={{ width: '100%' }}>
                      <Select.Option value="base">底图</Select.Option>
                      <Select.Option value="overlay">叠加图层</Select.Option>
                      <Select.Option value="vector">矢量数据</Select.Option>
                      <Select.Option value="raster">栅格数据</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="符号样式">
                <Input.TextArea rows={3} placeholder="输入GeoJSON样式配置..." />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title={selectedLayer ? '编辑图层' : '添加图层'}
        open={layerVisible}
        onCancel={() => setLayerVisible(false)}
        onOk={handleEdit}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="图层名称" name="name" rules={[{ required: true, message: '请输入图层名称' }]}>
            <Input placeholder="请输入图层名称" />
          </Form.Item>
          <Form.Item label="图层类型" name="type">
            <Select>
              <Select.Option value="base">底图</Select.Option>
              <Select.Option value="overlay">叠加图层</Select.Option>
              <Select.Option value="vector">矢量数据</Select.Option>
              <Select.Option value="raster">栅格数据</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="服务地址" name="url">
            <Input placeholder="请输入WMTS/WMS服务地址" />
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
        title="图层详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailVisible(false);
              setSelectedLayer(selectedLayer);
              form.setFieldsValue(selectedLayer);
              setLayerVisible(true);
            }}
          >
            编辑
          </Button>,
        ]}
      >
        {selectedLayer && (
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>图层名称</div>
                <div>{selectedLayer.name}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>图层类型</div>
                <Tag>{selectedLayer.type}</Tag>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>透明度</div>
                <div>{Math.round(selectedLayer.opacity * 100)}%</div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>显示状态</div>
                <Tag color={selectedLayer.visible ? 'success' : 'default'}>
                  {selectedLayer.visible ? '可见' : '隐藏'}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LayerManagement;