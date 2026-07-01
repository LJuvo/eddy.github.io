import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Modal,
  Descriptions,
  Select,
  Input,
  Tag,
  Badge,
  Tooltip,
  message,
  Empty,
} from 'antd';
import {
  VideoCameraOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  StopOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

// 视频监控点数据
const videoDevices = [
  {
    id: 'CAM001',
    name: '诺水河干流监控点-1',
    location: '诺水河干流-涪阳镇',
    status: 'online' as const,
    lastUpdate: '2024-01-15 14:30:25',
    resolution: '1920×1080',
    streamUrl: 'rtsp://192.168.1.101:554/stream1',
    hasPTZ: true,
    recordStatus: 'recording',
  },
  {
    id: 'CAM002',
    name: '诺水河干流监控点-2',
    location: '诺水河干流-诺江镇',
    status: 'offline' as const,
    lastUpdate: '2024-01-15 12:15:33',
    resolution: '1920×1080',
    streamUrl: 'rtsp://192.168.1.102:554/stream1',
    hasPTZ: true,
    recordStatus: 'stopped',
  },
  {
    id: 'CAM003',
    name: '大鲵栖息地监控点',
    location: '核心区-大鲵栖息地',
    status: 'online' as const,
    lastUpdate: '2024-01-15 14:29:00',
    resolution: '2560×1440',
    streamUrl: 'rtsp://192.168.1.103:554/stream1',
    hasPTZ: false,
    recordStatus: 'recording',
  },
  {
    id: 'CAM004',
    name: '澌滩河监控点',
    location: '澌滩河-永安镇',
    status: 'online' as const,
    lastUpdate: '2024-01-15 14:28:00',
    resolution: '1920×1080',
    streamUrl: 'rtsp://192.168.1.104:554/stream1',
    hasPTZ: true,
    recordStatus: 'recording',
  },
  {
    id: 'CAM005',
    name: '空山乡入口监控',
    location: '空山乡入口',
    status: 'online' as const,
    lastUpdate: '2024-01-15 14:30:00',
    resolution: '1920×1080',
    streamUrl: 'rtsp://192.168.1.105:554/stream1',
    hasPTZ: true,
    recordStatus: 'recording',
  },
  {
    id: 'CAM006',
    name: '缓冲区入口监控',
    location: '两河口乡入口',
    status: 'maintenance' as const,
    lastUpdate: '2024-01-15 10:00:00',
    resolution: '1920×1080',
    streamUrl: 'rtsp://192.168.1.106:554/stream1',
    hasPTZ: true,
    recordStatus: 'stopped',
  },
];

// 模拟视频画面
const VideoPanel: React.FC<{
  device: typeof videoDevices[0];
  isPlaying: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onMute: () => void;
  onFullscreen: () => void;
  onClick: () => void;
}> = ({ device, isPlaying, isFullscreen, isMuted, onPlayPause, onMute, onFullscreen, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : 200,
        background: device.status === 'online' ? '#1a1a2e' : '#2d2d2d',
        borderRadius: isFullscreen ? 0 : 8,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {device.status === 'online' ? (
        <>
          {/* 模拟视频画面 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
          >
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <VideoCameraOutlined style={{ fontSize: 48, opacity: 0.5 }} />
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                {isPlaying ? '正在播放' : '已暂停'}
              </div>
            </div>
          </div>

          {/* 叠加信息 */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Tag color="green" style={{ margin: 0 }}>LIVE</Tag>
              <span style={{ marginLeft: 8, color: '#fff', fontSize: 12 }}>
                {device.resolution}
              </span>
            </div>
            {device.hasPTZ && (
              <Tag icon={<RetweetOutlined />} style={{ margin: 0 }}>
                云台
              </Tag>
            )}
          </div>

          {/* 时间戳 */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              color: '#fff',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            {new Date().toLocaleTimeString()}
          </div>

          {/* 录制指示 */}
          {device.recordStatus === 'recording' && (
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ff4d4f',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <span style={{ color: '#fff', fontSize: 11 }}>REC</span>
            </div>
          )}

          {/* 控制栏 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '8px 12px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title={isPlaying ? '暂停' : '播放'}>
              <Button
                type="text"
                size="small"
                icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                style={{ color: '#fff' }}
                onClick={onPlayPause}
              />
            </Tooltip>
            <Tooltip title={isMuted ? '开启声音' : '静音'}>
              <Button
                type="text"
                size="small"
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                style={{ color: '#fff' }}
                onClick={onMute}
              />
            </Tooltip>
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <Button
                type="text"
                size="small"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                style={{ color: '#fff' }}
                onClick={onFullscreen}
              />
            </Tooltip>
          </div>
        </>
      ) : device.status === 'offline' ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}
        >
          <StopOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <div>设备离线</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{device.lastUpdate}</div>
        </div>
      ) : (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#faad14',
          }}
        >
          <LoadingOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <div>设备维护中</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{device.lastUpdate}</div>
        </div>
      )}
    </div>
  );
};

const VideoMonitor: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<typeof videoDevices[0] | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [playingDevices, setPlayingDevices] = useState<Set<string>>(new Set(['CAM001']));
  const [mutedDevices, setMutedDevices] = useState<Set<string>>(new Set());
  const [fullscreenDevice, setFullscreenDevice] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(4);

  // 过滤设备
  const filteredDevices = videoDevices.filter(device => {
    const matchLocation = locationFilter === 'all' || device.location.includes(locationFilter);
    const matchStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchSearch = searchText === '' ||
      device.name.toLowerCase().includes(searchText.toLowerCase()) ||
      device.location.toLowerCase().includes(searchText.toLowerCase());
    return matchLocation && matchStatus && matchSearch;
  });

  // 统计数据
  const deviceStats = {
    total: videoDevices.length,
    online: videoDevices.filter(d => d.status === 'online').length,
    offline: videoDevices.filter(d => d.status === 'offline').length,
    maintenance: videoDevices.filter(d => d.status === 'maintenance').length,
    recording: videoDevices.filter(d => d.recordStatus === 'recording').length,
  };

  // 播放/暂停
  const togglePlay = (deviceId: string) => {
    setPlayingDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  // 静音/取消静音
  const toggleMute = (deviceId: string) => {
    setMutedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  // 全屏切换
  const toggleFullscreen = (deviceId: string) => {
    setFullscreenDevice(prev => (prev === deviceId ? null : deviceId));
  };

  // 控制命令
  const handleControl = (action: string) => {
    if (!selectedDevice) return;
    message.success(`已发送${action}指令到 ${selectedDevice.name}`);
    setControlModalVisible(false);
  };

  // 批量添加全部播放
  const playAll = () => {
    setPlayingDevices(new Set(videoDevices.filter(d => d.status === 'online').map(d => d.id)));
    message.success('已全部开始播放');
  };

  const stopAll = () => {
    setPlayingDevices(new Set());
    message.success('已全部停止播放');
  };

  return (
    <div className="video-monitor fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">视频监控</h1>
          <span className="page-subtitle">实时视频监控与录像回放</span>
        </div>
        <div className="page-header-actions">
          <Button onClick={stopAll} disabled={playingDevices.size === 0}>
            全部停止
          </Button>
          <Button type="primary" onClick={playAll}>
            全部播放
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="监控点总数"
              value={deviceStats.total}
              prefix={<VideoCameraOutlined style={{ color: '#1B5E8C' }} />}
              valueStyle={{ color: '#1B5E8C' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="在线"
              value={deviceStats.online}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="离线"
              value={deviceStats.offline}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="录像中"
              value={deviceStats.recording}
              prefix={<VideoCameraOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="搜索监控点"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              value={locationFilter}
              onChange={setLocationFilter}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">全部位置</Option>
              <Option value="涪阳镇">涪阳镇</Option>
              <Option value="诺江镇">诺江镇</Option>
              <Option value="空山乡">空山乡</Option>
              <Option value="永安镇">永安镇</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <Space>
              <span style={{ color: '#666' }}>网格布局:</span>
              <Select value={gridSize} onChange={setGridSize} style={{ width: 100 }}>
                <Option value={2}>2×2</Option>
                <Option value={3}>3×3</Option>
                <Option value={4}>4×4</Option>
              </Select>
              <Badge status="processing" text={`${playingDevices.size}路播放中`} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 视频网格 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {filteredDevices.map(device => (
          <Col key={device.id} xs={24} sm={12} md={24 / gridSize}>
            <Card
              bodyStyle={{ padding: 8 }}
              style={{ borderRadius: 8 }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <VideoCameraOutlined style={{ color: '#1B5E8C' }} />
                  <span style={{ fontSize: 13 }}>{device.name}</span>
                </div>
              }
              extra={
                <Space size="small">
                  <Tag color={device.status === 'online' ? 'success' : device.status === 'offline' ? 'error' : 'warning'} style={{ margin: 0 }}>
                    {device.status === 'online' ? '在线' : device.status === 'offline' ? '离线' : '维护'}
                  </Tag>
                  <Button
                    type="text"
                    size="small"
                    icon={<SettingOutlined />}
                    onClick={() => {
                      setSelectedDevice(device);
                      setControlModalVisible(true);
                    }}
                  />
                </Space>
              }
            >
              <VideoPanel
                device={device}
                isPlaying={playingDevices.has(device.id)}
                isFullscreen={fullscreenDevice === device.id}
                isMuted={mutedDevices.has(device.id)}
                onPlayPause={() => togglePlay(device.id)}
                onMute={() => toggleMute(device.id)}
                onFullscreen={() => toggleFullscreen(device.id)}
                onClick={() => {
                  setSelectedDevice(device);
                  setDetailModalVisible(true);
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 设备列表 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined style={{ color: '#1B5E8C' }} />
            <span>监控点列表</span>
            <Badge count={filteredDevices.length} style={{ backgroundColor: '#1B5E8C' }} />
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {filteredDevices.map(device => (
            <Col key={device.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                size="small"
                hoverable
                onClick={() => {
                  setSelectedDevice(device);
                  setDetailModalVisible(true);
                }}
                style={{ cursor: 'pointer' }}
                bodyStyle={{ padding: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: device.status === 'online' ? '#52c41a' : device.status === 'offline' ? '#ff4d4f' : '#faad14',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 18,
                    }}
                  >
                    <VideoCameraOutlined />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{device.name}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{device.location}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 设备详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined style={{ color: '#1B5E8C' }} />
            <span>监控点详情</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            <Button type="primary" icon={<VideoCameraOutlined />}>录像回放</Button>
            <Button icon={<SettingOutlined />} onClick={() => {
              setDetailModalVisible(false);
              setControlModalVisible(true);
            }}>
              设备控制
            </Button>
          </Space>
        }
        width={700}
      >
        {selectedDevice && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="设备编号">{selectedDevice.id}</Descriptions.Item>
              <Descriptions.Item label="设备名称">{selectedDevice.name}</Descriptions.Item>
              <Descriptions.Item label="安装位置" span={2}>
                {selectedDevice.location}
              </Descriptions.Item>
              <Descriptions.Item label="设备状态">
                <Tag color={selectedDevice.status === 'online' ? 'success' : selectedDevice.status === 'offline' ? 'error' : 'warning'}>
                  {selectedDevice.status === 'online' ? '在线' : selectedDevice.status === 'offline' ? '离线' : '维护中'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="录像状态">
                <Tag color={selectedDevice.recordStatus === 'recording' ? 'error' : 'default'}>
                  {selectedDevice.recordStatus === 'recording' ? '录像中' : '已停止'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="分辨率">{selectedDevice.resolution}</Descriptions.Item>
              <Descriptions.Item label="云台控制">
                {selectedDevice.hasPTZ ? (
                  <Tag icon={<RetweetOutlined />}>支持</Tag>
                ) : (
                  <Tag>不支持</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="流地址" span={2}>
                <Input value={selectedDevice.streamUrl} disabled size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="最后更新" span={2}>
                {selectedDevice.lastUpdate}
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Button block icon={<PlayCircleOutlined />} onClick={() => {
                  setPlayingDevices(prev => new Set([...prev, selectedDevice.id]));
                  message.success('已开始播放');
                }}>
                  开始播放
                </Button>
              </Col>
              <Col span={12}>
                <Button block icon={<VideoCameraOutlined />}>
                  录像回放
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 设备控制弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined style={{ color: '#1B5E8C' }} />
            <span>设备控制 - {selectedDevice?.name}</span>
          </div>
        }
        open={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedDevice && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="设备状态">
                <Tag color={selectedDevice.status === 'online' ? 'success' : selectedDevice.status === 'offline' ? 'error' : 'warning'}>
                  {selectedDevice.status === 'online' ? '在线' : selectedDevice.status === 'offline' ? '离线' : '维护中'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="录像状态">
                <Tag color={selectedDevice.recordStatus === 'recording' ? 'error' : 'default'}>
                  {selectedDevice.recordStatus === 'recording' ? '录像中' : '已停止'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 12 }}>云台控制</h4>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Button block icon={<RetweetOutlined />} disabled={!selectedDevice.hasPTZ} onClick={() => handleControl('云台上')}>
                    上
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<RetweetOutlined />} disabled={!selectedDevice.hasPTZ} onClick={() => handleControl('云台下')}>
                    下
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<RetweetOutlined />} disabled={!selectedDevice.hasPTZ} onClick={() => handleControl('云台左')}>
                    左
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<RetweetOutlined />} disabled={!selectedDevice.hasPTZ} onClick={() => handleControl('云台右')}>
                    右
                  </Button>
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 12 }}>录像控制</h4>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Button
                    block
                    type={selectedDevice.recordStatus === 'recording' ? 'primary' : 'default'}
                    danger={selectedDevice.recordStatus === 'recording'}
                    onClick={() => handleControl(selectedDevice.recordStatus === 'recording' ? '停止录像' : '开始录像')}
                  >
                    {selectedDevice.recordStatus === 'recording' ? '停止录像' : '开始录像'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block onClick={() => handleControl('抓图')}>
                    抓图
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      {/* CSS动画 */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VideoMonitor;
