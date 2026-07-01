import React, { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Button,
  Switch,
  Slider,
  Select,
  Tree,
  Tag,
  Space,
  Checkbox,
  Collapse,
  Divider,
  Modal,
  message,
} from 'antd';
import {
  GlobalOutlined,
  AppstoreOutlined,
  LayersOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SafetyOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import {
  mapLayers,
  facilitiesData,
  patrolPersonnel,
  speciesDistributionData,
  administrativeZones,
} from '@/mock';

const { Panel } = Collapse;

interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  opacity: number;
}

const OverviewMap: React.FC = () => {
  const [layers, setLayers] = useState<LayerItem[]>(mapLayers.map(l => ({ ...l })));
  const [selectedTool, setSelectedTool] = useState<string>('pan');
  const [measurementMode, setMeasurementMode] = useState<string | null>(null);
  const [legendVisible, setLegendVisible] = useState(true);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const baseLayerOptions = [
    { value: 'tianditu', label: '天地图' },
    { value: 'gaode', label: '高德地图' },
    { value: 'satellite', label: '卫星影像' },
    { value: 'none', label: '无底图' },
  ];

  const handleLayerVisibility = (layerId: string, visible: boolean) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible } : layer
      )
    );
  };

  const handleLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, opacity: opacity / 100 } : layer
      )
    );
  };

  const handleZoomIn = () => message.info('地图放大');
  const handleZoomOut = () => message.info('地图缩小');
  const handleResetView = () => message.info('重置视图');
  const handleFullscreen = () => setFullscreen(!fullscreen);

  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(feature);
    setInfoPanelVisible(true);
  };

  // 模拟地图配置
  const mapOption = {
    backgroundColor: '#e6f7ff',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#1890ff',
      textStyle: { color: '#333' },
    },
    geo: {
      map: 'nuoshuhe',
      roam: true,
      zoom: 1.2,
      center: [106.5, 32.2],
      itemStyle: {
        areaColor: '#c8e6c9',
        borderColor: '#2D7D46',
        borderWidth: 2,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#a5d6a7',
          borderColor: '#1B5E8C',
          borderWidth: 3,
        },
      },
      regions: [
        {
          name: '核心区',
          itemStyle: { areaColor: '#ffcdd2', borderColor: '#ef5350' },
          label: { show: true, color: '#c62828', fontWeight: 'bold' },
        },
        {
          name: '缓冲区',
          itemStyle: { areaColor: '#fff9c4', borderColor: '#fbc02d' },
          label: { show: true, color: '#f57f17', fontWeight: 'bold' },
        },
        {
          name: '实验区',
          itemStyle: { areaColor: '#c8e6c9', borderColor: '#66bb6a' },
          label: { show: true, color: '#2e7d32', fontWeight: 'bold' },
        },
      ],
    },
    series: [
      // 巡护轨迹
      {
        type: 'lines',
        zlevel: 2,
        effect: { show: true, period: 6, trailLength: 0.3, symbol: 'circle', symbolSize: 4 },
        lineStyle: { color: '#1890ff', width: 3, opacity: 0.6, curveness: 0.2 },
        data: [
          { coords: [[106.4, 32.25], [106.5, 32.2], [106.55, 32.15]] },
          { coords: [[106.3, 32.15], [106.45, 32.18], [106.5, 32.22]] },
        ],
      },
      // 巡护人员
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 3,
        symbol: 'circle',
        symbolSize: 14,
        itemStyle: { color: '#1890ff', borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 10,
          color: '#333',
        },
        data: [
          { name: '李建国', value: [106.45, 32.22] },
          { name: '王强', value: [106.38, 32.18] },
          { name: '孙磊', value: [106.52, 32.16] },
        ],
      },
      // 设施点
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 4,
        symbol: 'rect',
        symbolSize: [12, 12],
        itemStyle: { color: '#722ed1', borderColor: '#fff', borderWidth: 1 },
        data: [
          { name: '空山管护站', value: [106.35, 32.28] },
          { name: '涪阳管护站', value: [106.42, 32.2] },
          { name: '诺江管护站', value: [106.55, 32.1] },
        ],
      },
      // 监测设备
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 5,
        rippleEffect: { brushType: 'stroke', scale: 3 },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: { color: '#52c41a', shadowBlur: 10, shadowColor: '#52c41a' },
        data: [
          { name: '水质站-1', value: [106.48, 32.25] },
          { name: '水质站-2', value: [106.32, 32.12] },
          { name: '气象站', value: [106.4, 32.15] },
        ],
      },
      // 物种分布
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 6,
        symbol: 'path://M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        symbolSize: 16,
        itemStyle: { color: '#ff4d4f' },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 10,
          color: '#c62828',
        },
        data: [
          { name: '大鲵', value: [106.4, 32.25] },
          { name: '岩原鲤', value: [106.5, 32.18] },
        ],
      },
    ],
  };

  // 工具配置
  const tools = [
    { id: 'pan', icon: <GlobalOutlined />, name: '平移' },
    { id: 'select', icon: <AppstoreOutlined />, name: '选择' },
    { id: 'measure', icon: <LayersOutlined />, name: '测量' },
    { id: 'draw', icon: <AppstoreOutlined />, name: '绘制' },
  ];

  // 图层树形数据
  const layerTreeData = [
    {
      title: '底图',
      key: 'base',
      children: [
        { title: '天地图', key: 'base-tianditu' },
        { title: '高德地图', key: 'base-gaode' },
        { title: '卫星影像', key: 'base-satellite' },
      ],
    },
    {
      title: '规划图层',
      key: 'planning',
      children: [
        { title: '保护区边界', key: 'overlay-boundary' },
        { title: '功能区划', key: 'overlay-zoning' },
      ],
    },
    {
      title: '专题图层',
      key: 'thematic',
      children: [
        { title: '物种分布', key: 'overlay-species' },
        { title: '基础设施', key: 'overlay-facilities' },
        { title: '巡护人员', key: 'overlay-patrollers' },
      ],
    },
  ];

  const containerStyle = fullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    background: '#fff',
  } : {};

  return (
    <div className="overview-map fade-in" style={containerStyle}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">综合一张图</h1>
        </div>
        <div className="page-header-actions">
          <Button icon={<ReloadOutlined />} onClick={handleResetView}>
            重置视图
          </Button>
          <Button icon={<FullscreenOutlined />} onClick={handleFullscreen}>
            {fullscreen ? '退出全屏' : '全屏'}
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ height: fullscreen ? 'calc(100vh - 100px)' : 'calc(100vh - 180px)' }}>
        {/* 左侧图层控制面板 */}
        <Col span={6}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LayersOutlined style={{ color: '#1890ff' }} />
                <span>图层控制</span>
              </div>
            }
            extra={
              <Checkbox checked={legendVisible} onChange={(e) => setLegendVisible(e.target.checked)}>
                显示图例
              </Checkbox>
            }
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0, height: 'calc(100% - 60px)', overflow: 'auto' }}
          >
            <Collapse defaultActiveKey={['base', 'planning', 'thematic']} ghost>
              <Panel header="底图设置" key="base">
                <div style={{ padding: '8px 16px' }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 8 }}>底图选择</label>
                    <Select defaultValue="tianditu" style={{ width: '100%' }} size="small">
                      {baseLayerOptions.map(opt => (
                        <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Panel>
              <Panel header="规划图层" key="planning">
                <div style={{ padding: '8px 16px' }}>
                  {layers.filter(l => l.type === 'overlay').map(layer => (
                    <div key={layer.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Switch
                          size="small"
                          checked={layer.visible}
                          onChange={(checked) => handleLayerVisibility(layer.id, checked)}
                        />
                        <span style={{ fontSize: 13 }}>{layer.name}</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        value={layer.opacity * 100}
                        onChange={(value) => handleLayerOpacity(layer.id, value)}
                        style={{ width: 80 }}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel header="专题图层" key="thematic">
                <div style={{ padding: '8px 16px' }}>
                  {layers.filter(l => l.type === 'vector').map(layer => (
                    <div key={layer.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Switch
                          size="small"
                          checked={layer.visible}
                          onChange={(checked) => handleLayerVisibility(layer.id, checked)}
                        />
                        <span style={{ fontSize: 13 }}>{layer.name}</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        value={layer.opacity * 100}
                        onChange={(value) => handleLayerOpacity(layer.id, value)}
                        style={{ width: 80 }}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* 中央地图区域 */}
        <Col span={12}>
          <Card
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0, height: 'calc(100% - 60px)', position: 'relative' }}
          >
            {/* 地图工具栏 */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 8,
              padding: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              {tools.map(tool => (
                <Button
                  key={tool.id}
                  type={selectedTool === tool.id ? 'primary' : 'default'}
                  icon={tool.icon}
                  size="small"
                  onClick={() => setSelectedTool(tool.id)}
                  style={{ width: 36, height: 36, padding: 0 }}
                  title={tool.name}
                />
              ))}
              <Divider style={{ margin: '8px 0' }} />
              <Button icon={<GlobalOutlined />} size="small" onClick={handleZoomIn} title="放大" style={{ width: 36, height: 36, padding: 0 }} />
              <Button icon={<GlobalOutlined />} size="small" onClick={handleZoomOut} title="缩小" style={{ width: 36, height: 36, padding: 0 }} />
            </div>

            {/* 地图 */}
            <div style={{
              height: '100%',
              background: '#e6f7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* 模拟地图底图 */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%)',
                borderRadius: 8,
              }}>
                {/* 模拟区域 */}
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  left: '20%',
                  width: '25%',
                  height: '35%',
                  background: 'rgba(255, 205, 210, 0.6)',
                  border: '2px solid #ef5350',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: '#c62828', fontWeight: 'bold', fontSize: 12 }}>核心区</span>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '35%',
                  width: '30%',
                  height: '40%',
                  background: 'rgba(255, 249, 196, 0.6)',
                  border: '2px solid #fbc02d',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: '#f57f17', fontWeight: 'bold', fontSize: 12 }}>缓冲区</span>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '55%',
                  left: '50%',
                  width: '35%',
                  height: '35%',
                  background: 'rgba(200, 230, 201, 0.6)',
                  border: '2px solid #66bb6a',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 12 }}>实验区</span>
                </div>
                {/* 模拟河流 */}
                <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                  <path
                    d="M 50 80 Q 150 200 300 250 Q 450 300 550 400"
                    fill="none"
                    stroke="#1890ff"
                    strokeWidth="6"
                    strokeDasharray="10,5"
                  />
                </svg>
                {/* 模拟设施点 */}
                <div style={{
                  position: 'absolute',
                  top: '25%',
                  left: '30%',
                  width: 20,
                  height: 20,
                  background: '#722ed1',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }} title="空山管护站">
                  <SafetyOutlined style={{ color: '#fff', fontSize: 12 }} />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '45%',
                  width: 20,
                  height: 20,
                  background: '#722ed1',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }} title="涪阳管护站">
                  <SafetyOutlined style={{ color: '#fff', fontSize: 12 }} />
                </div>
                {/* 模拟监测点 */}
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '55%',
                  width: 16,
                  height: 16,
                  background: '#52c41a',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #52c41a',
                  cursor: 'pointer',
                }} title="水质监测站" />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '35%',
                  width: 16,
                  height: 16,
                  background: '#52c41a',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #52c41a',
                  cursor: 'pointer',
                }} title="气象监测站" />
                {/* 巡护人员 */}
                <div style={{
                  position: 'absolute',
                  top: '35%',
                  left: '40%',
                  width: 24,
                  height: 24,
                  background: '#1890ff',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(24, 144, 255, 0.5)',
                }} title="李建国 - 巡护中">
                  <TeamOutlined style={{ color: '#fff', fontSize: 12 }} />
                </div>
              </div>

              {/* 坐标显示 */}
              <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                color: '#666',
              }}>
                中心点: 106.500°E, 32.200°N | 比例尺: 1:50000
              </div>

              {/* 图例 */}
              {legendVisible && (
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: 12,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: 12,
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>图例</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#ffcdd2', border: '1px solid #ef5350', borderRadius: 2 }} />
                      <span>核心区</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#fff9c4', border: '1px solid #fbc02d', borderRadius: 2 }} />
                      <span>缓冲区</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#c8e6c9', border: '1px solid #66bb6a', borderRadius: 2 }} />
                      <span>实验区</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#722ed1', borderRadius: 2 }} />
                      <span>管护站</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#52c41a', borderRadius: '50%' }} />
                      <span>监测站</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: '#1890ff', borderRadius: '50%' }} />
                      <span>巡护人员</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧信息面板 */}
        <Col span={6}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
                <span>信息查询</span>
              </div>
            }
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0, height: 'calc(100% - 60px)', overflow: 'auto' }}
          >
            <Collapse defaultActiveKey={['facilities', 'personnel', 'species']} ghost>
              <Panel header="基础设施" key="facilities">
                <div style={{ padding: '0 16px' }}>
                  {facilitiesData.slice(0, 5).map((facility, index) => (
                    <div
                      key={index}
                      onClick={() => handleFeatureClick(facility)}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <SafetyOutlined style={{ color: '#722ed1' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{facility.name}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{facility.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel header="巡护人员" key="personnel">
                <div style={{ padding: '0 16px' }}>
                  {patrolPersonnel.map((person, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <TeamOutlined style={{ color: '#1890ff' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{person.name}</div>
                        <Tag
                          color={person.status === '巡护中' ? 'success' : person.status === '待命' ? 'processing' : 'default'}
                          style={{ fontSize: 10, marginTop: 2 }}
                        >
                          {person.status}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel header="物种分布" key="species">
                <div style={{ padding: '0 16px' }}>
                  {speciesDistributionData.map((species, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{species.name}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>数量: {species.count} | 位置: {species.location}</div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel header="行政区划" key="zones">
                <div style={{ padding: '0 16px' }}>
                  {administrativeZones.map((zone, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <EnvironmentOutlined style={{ color: '#52c41a' }} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{zone.name}</span>
                        <Tag style={{ fontSize: 10 }}>{zone.type}</Tag>
                      </div>
                      <div style={{ fontSize: 11, color: '#999', marginLeft: 24 }}>
                        面积: {zone.area}km² | 人口: {zone.population.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>

      {/* 详细信息弹窗 */}
      <Modal
        title="详细信息"
        open={infoPanelVisible}
        onCancel={() => setInfoPanelVisible(false)}
        footer={null}
        width={500}
      >
        {selectedFeature && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              {selectedFeature.name || selectedFeature.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedFeature.type && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>类型:</span>
                  <span>{selectedFeature.type}</span>
                </div>
              )}
              {selectedFeature.location && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>位置:</span>
                  <span>{selectedFeature.location}</span>
                </div>
              )}
              {selectedFeature.role && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>角色:</span>
                  <span>{selectedFeature.role}</span>
                </div>
              )}
              {selectedFeature.status && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>状态:</span>
                  <Tag color={selectedFeature.status === '巡护中' ? 'success' : selectedFeature.status === 'online' ? 'success' : 'default'}>
                    {selectedFeature.status}
                  </Tag>
                </div>
              )}
              {selectedFeature.builtYear && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>建设年份:</span>
                  <span>{selectedFeature.builtYear}</span>
                </div>
              )}
              {selectedFeature.phone && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>联系电话:</span>
                  <span>{selectedFeature.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OverviewMap;
