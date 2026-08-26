import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Select,
  Slider,
  Tag,
  Modal,
  message,
  Divider,
  Image,
  Switch,
} from 'antd';
import {
  SwapOutlined,
  PlusOutlined,
  SyncOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateRightOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { remoteSensingData } from '@/mock';

interface CompareImage {
  id: string;
  name: string;
  satellite: string;
  date: string;
  resolution: string;
  url?: string;
}

const RemoteSensingCompare: React.FC = () => {
  const [leftImage, setLeftImage] = useState<CompareImage | null>({
    id: 'RS001',
    name: 'GF1-2024-01-10',
    satellite: '高分一号',
    date: '2024-01-10',
    resolution: '16m',
  });
  const [rightImage, setRightImage] = useState<CompareImage | null>({
    id: 'RS003',
    name: 'ZY3-2023-12-20',
    satellite: '资源三号',
    date: '2023-12-20',
    resolution: '2.5m',
  });

  const [leftOpacity, setLeftOpacity] = useState(100);
  const [rightOpacity, setRightOpacity] = useState(100);
  const [syncZoom, setSyncZoom] = useState(true);
  const [compareMode, setCompareMode] = useState<'slider' | 'side-by-side' | 'overlay'>('slider');
  const [selectVisible, setSelectVisible] = useState(false);
  const [selectSide, setSelectSide] = useState<'left' | 'right'>('left');

  const imageList = remoteSensingData.map(item => ({
    id: item.id,
    name: item.name,
    satellite: item.satellite,
    date: item.date,
    resolution: item.resolution,
  }));

  const handleSelectImage = (side: 'left' | 'right') => {
    setSelectSide(side);
    setSelectVisible(true);
  };

  const confirmSelectImage = (imageId: string) => {
    const selected = imageList.find(img => img.id === imageId);
    if (selected) {
      if (selectSide === 'left') {
        setLeftImage(selected);
      } else {
        setRightImage(selected);
      }
    }
    setSelectVisible(false);
    message.success('影像已切换');
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">影像对比</h1>
        </div>
        <div className="page-header-actions">
          <Space>
            <span>对比模式:</span>
            <Select
              value={compareMode}
              onChange={setCompareMode}
              style={{ width: 140 }}
            >
              <Select.Option value="slider">滑块对比</Select.Option>
              <Select.Option value="side-by-side">并排对比</Select.Option>
              <Select.Option value="overlay">叠加对比</Select.Option>
            </Select>
            <Switch
              checkedChildren="同步缩放"
              unCheckedChildren="独立缩放"
              checked={syncZoom}
              onChange={setSyncZoom}
            />
          </Space>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            size="small"
            title={
              <Space>
                <span>左侧影像</span>
                {leftImage && (
                  <Tag color="blue">{leftImage.name}</Tag>
                )}
              </Space>
            }
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => handleSelectImage('left')}
              >
                切换影像
              </Button>
            }
          >
            <div style={{ height: 400, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Image
                width="100%"
                height="100%"
                src="https://via.placeholder.com/600x400?text=Left+Image"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                style={{ objectFit: 'contain', position: 'absolute' }}
              />
              {compareMode === 'slider' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${leftOpacity}%`,
                    width: 4,
                    background: '#1890ff',
                    cursor: 'ew-resize',
                    zIndex: 10,
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: -20,
                    transform: 'translateY(-50%)',
                    width: 44,
                    height: 44,
                    background: '#1890ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <SwapOutlined />
                  </div>
                </div>
              )}
            </div>
            {leftImage && (
              <div style={{ marginTop: 8 }}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>卫星: </span>
                    <span>{leftImage.satellite}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>分辨率: </span>
                    <span>{leftImage.resolution}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>日期: </span>
                    <span>{leftImage.date}</span>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            title={
              <Space>
                <span>右侧影像</span>
                {rightImage && (
                  <Tag color="green">{rightImage.name}</Tag>
                )}
              </Space>
            }
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => handleSelectImage('right')}
              >
                切换影像
              </Button>
            }
          >
            <div style={{ height: 400, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Image
                width="100%"
                height="100%"
                src="https://via.placeholder.com/600x400?text=Right+Image"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                style={{ objectFit: 'contain', position: 'absolute' }}
              />
            </div>
            {rightImage && (
              <div style={{ marginTop: 8 }}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>卫星: </span>
                    <span>{rightImage.satellite}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>分辨率: </span>
                    <span>{rightImage.resolution}</span>
                  </Col>
                  <Col span={12}>
                    <span style={{ color: '#666' }}>日期: </span>
                    <span>{rightImage.date}</span>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="对比操作">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title="左侧影像控制">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span>透明度: {leftOpacity}%</span>
                  <Slider value={leftOpacity} onChange={setLeftOpacity} />
                </div>
                <Space>
                  <Button icon={<ZoomInOutlined />}>放大</Button>
                  <Button icon={<ZoomOutOutlined />}>缩小</Button>
                  <Button icon={<RotateRightOutlined />}>旋转</Button>
                  <Button icon={<FullscreenOutlined />}>全屏</Button>
                </Space>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="右侧影像控制">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span>透明度: {rightOpacity}%</span>
                  <Slider value={rightOpacity} onChange={setRightOpacity} />
                </div>
                <Space>
                  <Button icon={<ZoomInOutlined />}>放大</Button>
                  <Button icon={<ZoomOutOutlined />}>缩小</Button>
                  <Button icon={<RotateRightOutlined />}>旋转</Button>
                  <Button icon={<FullscreenOutlined />}>全屏</Button>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button type="primary" icon={<SwapOutlined />}>
            左右互换
          </Button>
          <Button icon={<SyncOutlined />}>
            重置对比
          </Button>
          <Button icon={<PlusOutlined />}>
            添加到收藏
          </Button>
        </Space>
      </Card>

      <Card title="差异分析" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>95%</div>
                <div style={{ color: '#666' }}>几何匹配度</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>88%</div>
                <div style={{ color: '#666' }}>光谱相似度</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#faad14' }}>12</div>
                <div style={{ color: '#666' }}>变化图斑数量</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ff4d4f' }}>2.5km²</div>
                <div style={{ color: '#666' }}>变化区域面积</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title="选择影像"
        open={selectVisible}
        onCancel={() => setSelectVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {imageList.map(image => (
            <Card
              key={image.id}
              size="small"
              style={{
                marginBottom: 8,
                cursor: 'pointer',
                borderColor: (selectSide === 'left' ? leftImage?.id : rightImage?.id) === image.id ? '#1890ff' : undefined,
              }}
              bodyStyle={{ padding: 12 }}
              onClick={() => confirmSelectImage(image.id)}
            >
              <Row gutter={[16, 8]} align="middle">
                <Col span={16}>
                  <div style={{ fontWeight: 500 }}>{image.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {image.satellite} | {image.date} | {image.resolution}
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Tag color={(selectSide === 'left' ? leftImage?.id : rightImage?.id) === image.id ? 'blue' : 'default'}>
                    {(selectSide === 'left' ? leftImage?.id : rightImage?.id) === image.id ? '已选择' : '点击选择'}
                  </Tag>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default RemoteSensingCompare;