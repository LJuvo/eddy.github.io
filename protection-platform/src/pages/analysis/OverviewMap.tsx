import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { CSSProperties } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Switch,
  Slider,
  Select,
  Tag,
  Checkbox,
  Collapse,
  Divider,
  Modal,
  message,
  Statistic,
} from 'antd';
import {
  GlobalOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SafetyOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Scene, ImageLayer, PointLayer, LineLayer, PolygonLayer, GaodeMap } from '@antv/l7';
import {
  mapLayers,
  facilitiesData,
  patrolPersonnel,
  speciesDistributionData,
  administrativeZones,
} from '@/mock';

const { Panel } = Collapse;

// 诺水河保护区坐标范围
const CENTER: [number, number] = [107.15, 32.05];

// 模拟地图数据
const mapData = {
  // 功能区边界数据（模拟）
  zones: [
    {
      id: 'core',
      name: '核心区',
      coordinates: [
        [[107.05, 32.10], [107.10, 32.15], [107.15, 32.12], [107.12, 32.08], [107.05, 32.10]],
      ],
      color: '#ffcdd2',
      borderColor: '#ef5350',
    },
    {
      id: 'buffer',
      name: '缓冲区',
      coordinates: [
        [[107.10, 32.08], [107.20, 32.12], [107.25, 32.05], [107.18, 32.00], [107.10, 32.08]],
      ],
      color: '#fff9c4',
      borderColor: '#fbc02d',
    },
    {
      id: 'experiment',
      name: '实验区',
      coordinates: [
        [[107.20, 32.00], [107.30, 32.05], [107.35, 31.95], [107.25, 31.90], [107.20, 32.00]],
      ],
      color: '#c8e6c9',
      borderColor: '#66bb6a',
    },
  ],
  // 河流数据（模拟）
  river: {
    path: [
      [107.05, 32.18],
      [107.10, 32.15],
      [107.15, 32.12],
      [107.20, 32.08],
      [107.25, 32.02],
      [107.30, 31.95],
    ],
  },
  // 设施点数据
  facilities: facilitiesData.map(f => ({
    id: f.id,
    name: f.name,
    lng: 107.10 + Math.random() * 0.2,
    lat: 32.00 + Math.random() * 0.1,
    type: 'facility',
  })),
  // 监测设备
  monitors: [
    { id: 'm1', name: '水质站-1', lng: 107.18, lat: 32.08, type: 'water' },
    { id: 'm2', name: '水质站-2', lng: 107.12, lat: 32.02, type: 'water' },
    { id: 'm3', name: '气象站', lng: 107.15, lat: 32.05, type: 'weather' },
  ],
  // 巡护人员位置
  patrollers: patrolPersonnel.map(p => ({
    id: p.id,
    name: p.name,
    lng: 107.12 + Math.random() * 0.15,
    lat: 32.02 + Math.random() * 0.08,
    type: 'patrol',
    status: p.status,
  })),
  // 物种分布点
  species: [
    { id: 's1', name: '大鲵', lng: 107.12, lat: 32.08, count: 48, type: 'species' },
    { id: 's2', name: '岩原鲤', lng: 107.20, lat: 32.05, count: 156, type: 'species' },
    { id: 's3', name: '水獭', lng: 107.08, lat: 32.10, count: 12, type: 'species' },
  ],
};

interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  opacity: number;
}

const OverviewMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const layerRef = useRef<Map<string, any>>(new Map());
  
  const [mapReady, setMapReady] = useState(false);
  const [layers, setLayers] = useState<LayerItem[]>(mapLayers.map(l => ({ ...l })));
  const [baseMapType, setBaseMapType] = useState<string>('gaode');
  const [selectedTool, setSelectedTool] = useState<string>('pan');
  const [legendVisible, setLegendVisible] = useState(true);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(11);

  const baseLayerOptions = [
    { value: 'gaode', label: '高德地图' },
    { value: 'gaode_satellite', label: '高德卫星' },
    { value: 'dark', label: '深色底图' },
  ];

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Scene({
      id: containerRef.current,
      map: new GaodeMap({
        center: CENTER,
        zoom: zoomLevel,
        style: baseMapType === 'dark' ? 'dark' : 'light',
      }),
      logoVisible: false,
    });

    scene.on('loaded', () => {
      sceneRef.current = scene;
      setMapReady(true);
      
      // 添加底图
      addBaseLayer(scene, baseMapType);
      
      // 添加功能区图层
      addZoneLayers(scene);
      
      // 添加河流图层
      addRiverLayer(scene);
      
      // 添加设施点
      addFacilityLayer(scene);
      
      // 添加监测点
      addMonitorLayer(scene);
      
      // 添加巡护人员
      addPatrollerLayer(scene);
      
      // 添加物种分布
      addSpeciesLayer(scene);
    });

    return () => {
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  // 添加底图图层
  const addBaseLayer = (scene: Scene, type: string) => {
    let url = '';
    if (type === 'gaode') {
      url = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
    } else if (type === 'gaode_satellite') {
      url = 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
    }

    if (url) {
      const baseLayer = new ImageLayer({
        zIndex: 0,
      }).source(url, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });
      scene.addLayer(baseLayer);
      layerRef.current.set('base', baseLayer);
    }
  };

  // 添加功能区图层
  const addZoneLayers = (scene: Scene) => {
    mapData.zones.forEach(zone => {
      const layer = new PolygonLayer({
        zIndex: 1,
      }).source({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: { name: zone.name, color: zone.color },
          geometry: {
            type: 'Polygon',
            coordinates: zone.coordinates,
          },
        }],
      }, {
        parser: { type: 'geojson' },
      }).shape('fill').color(zone.color).style({ opacity: 0.6 });
      
      scene.addLayer(layer);
      layerRef.current.set(`zone_${zone.id}`, layer);
    });
  };

  // 添加河流图层
  const addRiverLayer = (scene: Scene) => {
    const riverData = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: '诺水河' },
        geometry: {
          type: 'LineString',
          coordinates: mapData.river.path,
        },
      }],
    };

    const layer = new LineLayer({
      zIndex: 2,
    }).source(riverData, {
      parser: { type: 'geojson' },
    }).shape('line').size(3).color('#1890ff').style({
      opacity: 0.8,
      dashArray: [10, 5],
    });

    scene.addLayer(layer);
    layerRef.current.set('river', layer);
  };

  // 添加设施点图层
  const addFacilityLayer = (scene: Scene) => {
    const layer = new PointLayer({
      zIndex: 10,
    }).source(mapData.facilities, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    }).shape('square').size(16).color('#722ed1').style({
      opacity: 0.9,
      strokeWidth: 2,
      stroke: '#fff',
    });

    scene.addLayer(layer);
    layerRef.current.set('facilities', layer);
  };

  // 添加监测点图层
  const addMonitorLayer = (scene: Scene) => {
    const layer = new PointLayer({
      zIndex: 11,
    }).source(mapData.monitors, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    }).shape('circle').size(12).color('#52c41a').style({
      opacity: 0.9,
      strokeWidth: 2,
      stroke: '#fff',
    });

    scene.addLayer(layer);
    layerRef.current.set('monitors', layer);
  };

  // 添加巡护人员图层
  const addPatrollerLayer = (scene: Scene) => {
    const layer = new PointLayer({
      zIndex: 12,
    }).source(mapData.patrollers, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    }).shape('circle').size(14).color('#1890ff').style({
      opacity: 0.9,
      strokeWidth: 2,
      stroke: '#fff',
    });

    scene.addLayer(layer);
    layerRef.current.set('patrollers', layer);
  };

  // 添加物种分布图层
  const addSpeciesLayer = (scene: Scene) => {
    const layer = new PointLayer({
      zIndex: 13,
    }).source(mapData.species, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    }).shape('circle').size(18).color('#ff4d4f').style({
      opacity: 0.8,
      strokeWidth: 2,
      stroke: '#c62828',
    });

    scene.addLayer(layer);
    layerRef.current.set('species', layer);
  };

  // 切换底图
  const handleBaseMapChange = useCallback((type: string) => {
    setBaseMapType(type);
    if (sceneRef.current) {
      const oldBase = layerRef.current.get('base');
      if (oldBase) {
        sceneRef.current.removeLayer(oldBase);
      }
      addBaseLayer(sceneRef.current, type);
      if (type === 'dark') {
        sceneRef.current.setMapStyle('dark');
      } else {
        sceneRef.current.setMapStyle('light');
      }
    }
  }, [mapReady]);

  // 图层可见性控制
  const handleLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, visible } : l));
    
    const layer = layerRef.current.get(layerId);
    if (layer) {
      if (visible) {
        layer.show();
      } else {
        layer.hide();
      }
    }
  }, []);

  // 图层透明度控制
  const handleLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, opacity: opacity / 100 } : l));
    
    const layer = layerRef.current.get(layerId);
    if (layer) {
      layer.style({ opacity: opacity / 100 });
    }
  }, []);

  // 地图缩放
  const handleZoomIn = useCallback(() => {
    if (sceneRef.current) {
      const newZoom = Math.min(sceneRef.current.getZoom() + 1, 18);
      sceneRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  }, [mapReady]);

  const handleZoomOut = useCallback(() => {
    if (sceneRef.current) {
      const newZoom = Math.max(sceneRef.current.getZoom() - 1, 3);
      sceneRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  }, [mapReady]);

  // 重置视图
  const handleResetView = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.setCenter(CENTER);
      sceneRef.current.setZoom(11);
      setZoomLevel(11);
      message.success('视图已重置');
    }
  }, [mapReady]);

  // 全屏切换
  const handleFullscreen = useCallback(() => {
    setFullscreen(!fullscreen);
  }, [fullscreen]);

  // 工具配置
  const tools = [
    { id: 'pan', icon: <GlobalOutlined />, name: '平移' },
    { id: 'select', icon: <AppstoreOutlined />, name: '选择' },
    { id: 'measure', icon: <BarsOutlined />, name: '测量' },
  ];

  // 处理要素点击
  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(feature);
    setInfoPanelVisible(true);
  };

  const containerStyle: CSSProperties = fullscreen ? {
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
          <Statistic 
            title="当前缩放" 
            value={zoomLevel} 
            suffix="级" 
            style={{ marginRight: 24 }}
            valueStyle={{ fontSize: 16 }}
          />
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
                <BarsOutlined style={{ color: '#1890ff' }} />
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
            <Collapse defaultActiveKey={['base', 'zones', 'features']} ghost>
              <Panel header="底图设置" key="base">
                <div style={{ padding: '8px 16px' }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 8 }}>底图选择</label>
                    <Select 
                      value={baseMapType} 
                      onChange={handleBaseMapChange}
                      style={{ width: '100%' }} 
                      size="small"
                    >
                      {baseLayerOptions.map(opt => (
                        <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Panel>
              <Panel header="功能区图层" key="zones">
                <div style={{ padding: '8px 16px' }}>
                  {mapData.zones.map(zone => (
                    <div key={zone.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ 
                          width: 16, 
                          height: 16, 
                          background: zone.color, 
                          border: `1px solid ${zone.borderColor}`,
                          borderRadius: 2 
                        }} />
                        <span style={{ fontSize: 13 }}>{zone.name}</span>
                      </div>
                      <Switch
                        size="small"
                        defaultChecked
                        onChange={(checked) => handleLayerVisibility(`zone_${zone.id}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel header="要素图层" key="features">
                <div style={{ padding: '8px 16px' }}>
                  {[
                    { id: 'river', name: '河流水系', color: '#1890ff' },
                    { id: 'facilities', name: '基础设施', color: '#722ed1' },
                    { id: 'monitors', name: '监测站点', color: '#52c41a' },
                    { id: 'patrollers', name: '巡护人员', color: '#1890ff' },
                    { id: 'species', name: '物种分布', color: '#ff4d4f' },
                  ].map(layer => (
                    <div key={layer.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ 
                          width: 16, 
                          height: 16, 
                          background: layer.color, 
                          borderRadius: layer.id === 'river' ? 0 : '50%',
                          border: '1px solid #fff',
                        }} />
                        <span style={{ fontSize: 13 }}>{layer.name}</span>
                      </div>
                      <Switch
                        size="small"
                        defaultChecked
                        onChange={(checked) => handleLayerVisibility(layer.id, checked)}
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
              <Button 
                icon={<PlusOutlined />} 
                size="small" 
                onClick={handleZoomIn} 
                title="放大" 
                style={{ width: 36, height: 36, padding: 0 }} 
              />
              <Button 
                icon={<MinusOutlined />} 
                size="small" 
                onClick={handleZoomOut} 
                title="缩小" 
                style={{ width: 36, height: 36, padding: 0 }} 
              />
            </div>

            {/* L7 地图容器 */}
            <div
              ref={containerRef}
              style={{
                height: '100%',
                width: '100%',
                position: 'relative',
              }}
            />

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
              zIndex: 10,
            }}>
              中心点: {CENTER[0].toFixed(2)}°E, {CENTER[1].toFixed(2)}°N
            </div>

            {/* 图例 */}
            {legendVisible && (
              <div style={{
                position: 'absolute',
                bottom: 10,
                left: 60,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: 12,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: 12,
                zIndex: 10,
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
                    <div style={{ width: 16, height: 4, background: '#1890ff' }} />
                    <span>河流</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, background: '#ff4d4f', borderRadius: '50%' }} />
                    <span>物种分布</span>
                  </div>
                </div>
              </div>
            )}
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
              {selectedFeature.status && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#666', width: 80 }}>状态:</span>
                  <Tag color={selectedFeature.status === '巡护中' ? 'success' : 'default'}>
                    {selectedFeature.status}
                  </Tag>
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