import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { reserveInfo, speciesList } from '@/mock';

// 诺水河保护区中心坐标
const CENTER: [number, number] = [107.15, 32.05];

// AMap JSAPI 加载
const loadAMapScript = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve((window as any).AMap);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&plugin=AMap.Scale,AMap.ToolBar';
    script.async = true;
    script.onload = () => {
      if ((window as any).AMap) {
        resolve((window as any).AMap);
      } else {
        reject(new Error('AMap 加载失败'));
      }
    };
    script.onerror = () => reject(new Error('AMap 脚本加载错误'));
    document.head.appendChild(script);
  });
};

// 高德瓦片图层 URL
const SATELLITE_TILE_URL = 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
const ROAD_TILE_URL = 'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

// 专题章节数据
interface Waypoint {
  name: string;
  desc: string;
  lng: number;
  lat: number;
}

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  route: [number, number][];
  waypoints: Waypoint[];
  icon: string;
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: '诺水河之源',
    subtitle: '千里嘉陵，水脉同源',
    description:
      '诺水河发源于陕西省南郑县米仓山南麓，自北向南流经通江全境，是嘉陵江重要支流。保护区内河道全长约 85 公里，流域面积 1200 余平方公里，孕育了丰富的水生生物资源。',
    color: '#4FC3F7',
    route: [
      [106.90, 33.00], [106.95, 32.80], [107.00, 32.60],
      [107.05, 32.40], [107.10, 32.20], [107.15, 32.05],
      [107.20, 31.90], [107.25, 31.75], [107.30, 31.60],
    ],
    waypoints: [
      { name: '源头', desc: '米仓山南麓，海拔 1600 米', lng: 106.90, lat: 33.00 },
      { name: '上游峡谷', desc: '水流湍急，河床深切', lng: 106.98, lat: 32.70 },
      { name: '核心区河段', desc: '大鲵栖息地，水质优良', lng: 107.12, lat: 32.15 },
      { name: '中游湿地', desc: '浅滩沙洲，水鸟聚集', lng: 107.22, lat: 31.85 },
      { name: '下游出口', desc: '汇入嘉陵江支流', lng: 107.30, lat: 31.60 },
    ],
    icon: '💧',
  },
  {
    id: 2,
    title: '珍稀生灵',
    subtitle: '水中精灵，国宝家园',
    description:
      '保护区内栖息着大鲵、岩原鲤、中华鲟、水獭等多种国家重点保护野生动物。大鲵——世界上最大的两栖动物，被称为"水中大熊猫"；岩原鲤——长江上游特有珍稀鱼类，是淡水生态系统的重要旗舰物种。',
    color: '#81C784',
    route: [
      [107.05, 32.20], [107.08, 32.15], [107.10, 32.10],
      [107.12, 32.05], [107.15, 32.00], [107.18, 31.95],
      [107.20, 31.90],
    ],
    waypoints: [
      { name: '大鲵栖息地', desc: '核心区，水质清澈的溶洞', lng: 107.08, lat: 32.18 },
      { name: '岩原鲤产卵场', desc: '水流平缓的卵石河滩', lng: 107.12, lat: 32.08 },
      { name: '中华鲟洄游通道', desc: '保护区核心河段', lng: 107.15, lat: 32.02 },
      { name: '水獭活动区', desc: '沿岸带，食物丰富', lng: 107.18, lat: 31.95 },
      { name: '金线鲃栖息', desc: '喀斯特地下溶洞水域', lng: 107.20, lat: 31.92 },
    ],
    icon: '🐟',
  },
  {
    id: 3,
    title: '守护之路',
    subtitle: '巡护网络，全天候守护',
    description:
      '保护区构建了"空天地一体化"巡护体系：空中无人机遥感监测，地面巡护员日常巡查，水下声呐视频监控。2023 年累计巡护里程达 12,500 公里，查处非法行为 35 起，有效保护了保护区生态安全。',
    color: '#FFB74D',
    route: [
      [107.00, 32.15], [107.05, 32.12], [107.10, 32.10],
      [107.15, 32.08], [107.20, 32.05], [107.25, 32.02],
      [107.30, 32.00],
    ],
    waypoints: [
      { name: '空山管护站', desc: '北部巡护起点，监控覆盖', lng: 107.00, lat: 32.15 },
      { name: '核心区监控点', desc: '24 小时视频监控', lng: 107.08, lat: 32.11 },
      { name: '水质自动监测站', desc: '实时监测水质参数', lng: 107.13, lat: 32.09 },
      { name: '涪阳管护站', desc: '中部巡护枢纽', lng: 107.20, lat: 32.06 },
      { name: '诺江管护站', desc: '南部巡护终点', lng: 107.30, lat: 32.00 },
    ],
    icon: '🛡️',
  },
  {
    id: 4,
    title: '功能区划',
    subtitle: '三区划分，科学保护',
    description:
      '保护区划分为核心区、缓冲区和实验区三大功能区。核心区 8,200 公顷，是绝对保护区域；缓冲区 12,400 公顷，作为生态过渡带；实验区 6,500 公顷，开展科研监测和生态体验活动。',
    color: '#BA68C8',
    route: [
      [107.05, 32.25], [107.08, 32.20], [107.10, 32.15],
      [107.12, 32.10], [107.15, 32.05], [107.18, 32.00],
      [107.20, 31.95], [107.25, 31.90],
    ],
    waypoints: [
      { name: '核心区北界', desc: '绝对保护区起点', lng: 107.05, lat: 32.25 },
      { name: '核心区中心', desc: '大鲵核心栖息地', lng: 107.10, lat: 32.15 },
      { name: '缓冲区中心', desc: '生态缓冲过渡带', lng: 107.15, lat: 32.05 },
      { name: '实验区中心', desc: '科研监测活动区', lng: 107.20, lat: 31.95 },
      { name: '核心区南界', desc: '保护区最南端', lng: 107.25, lat: 31.90 },
    ],
    icon: '🗺️',
  },
  {
    id: 5,
    title: '未来展望',
    subtitle: '科技赋能，永续发展',
    description:
      '展望未来，保护区将深化智慧保护体系建设：AI 智能识别野生动物、区块链记录保护数据、卫星遥感宏观监测。让绿水青山真正成为金山银山，让子孙后代能继续欣赏诺水河的清澈与生机。',
    color: '#F06292',
    route: [
      [107.00, 32.30], [107.05, 32.20], [107.10, 32.10],
      [107.15, 32.00], [107.20, 31.90], [107.25, 31.80],
      [107.30, 31.70], [107.35, 31.60],
    ],
    waypoints: [
      { name: '生态科普基地', desc: '环境教育与生态体验', lng: 107.00, lat: 32.30 },
      { name: 'AI 监测中心', desc: '智能识别与预警', lng: 107.10, lat: 32.10 },
      { name: '种质资源库', desc: '珍稀物种基因保存', lng: 107.18, lat: 31.92 },
      { name: '生态旅游区', desc: '可持续生态体验', lng: 107.28, lat: 31.72 },
      { name: '未来示范区', desc: '智慧保护样板', lng: 107.35, lat: 31.60 },
    ],
    icon: '🌿',
  },
];

const ThematicShowcase: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const amapRef = useRef<any>(null);
  const baseOverlaysRef = useRef<any[]>([]);
  const chapterOverlaysRef = useRef<any[]>([]);
  const satelliteLayerRef = useRef<any>(null);
  const roadLayerRef = useRef<any>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [layerMode, setLayerMode] = useState<'satellite' | 'road' | 'hybrid'>('hybrid');
  const [zoomLevel, setZoomLevel] = useState(10);
  const AMapRef = useRef<any>(null);

  // 添加基础覆盖物（边界+功能区）
  const addBaseOverlays = useCallback((amap: any, AMap: any) => {
    // 清除旧的基础覆盖物
    baseOverlaysRef.current.forEach((o) => amap.remove(o));
    baseOverlaysRef.current = [];

    // 保护区边界
    const boundaryCoords = [
      [106.95, 32.35], [107.10, 32.40], [107.30, 32.30],
      [107.40, 32.10], [107.35, 31.85], [107.20, 31.70],
      [107.00, 31.80], [106.90, 32.00], [106.88, 32.20],
      [106.95, 32.35],
    ];
    const boundaryPolygon = new AMap.Polygon({
      path: boundaryCoords,
      strokeColor: '#4FC3F7',
      strokeWeight: 3,
      strokeOpacity: 0.7,
      fillColor: '#4FC3F7',
      fillOpacity: 0.08,
      zIndex: 50,
    });
    amap.add(boundaryPolygon);
    baseOverlaysRef.current.push(boundaryPolygon);

    // 功能区分区
    const zones = [
      {
        coords: [[107.02, 32.22], [107.12, 32.25], [107.18, 32.15], [107.15, 32.00], [107.05, 32.02], [107.00, 32.12]],
        color: '#ef5350',
      },
      {
        coords: [[106.95, 32.30], [107.30, 32.35], [107.35, 32.10], [107.25, 31.85], [106.95, 31.90], [106.90, 32.10]],
        color: '#fbc02d',
      },
      {
        coords: [[106.88, 32.35], [107.42, 32.38], [107.45, 31.80], [107.30, 31.65], [106.85, 31.75], [106.82, 32.15]],
        color: '#66bb6a',
      },
    ];

    zones.forEach((zone) => {
      const polygon = new AMap.Polygon({
        path: zone.coords,
        strokeColor: zone.color,
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: zone.color,
        fillOpacity: 0.12,
        zIndex: 40,
      });
      amap.add(polygon);
      baseOverlaysRef.current.push(polygon);
    });
  }, []);

  // 加载章节
  const loadChapter = useCallback((index: number) => {
    const chapter = chapters[index];
    const amap = amapRef.current;
    const AMap = AMapRef.current;
    if (!chapter || !amap || !AMap) return;

    // 移除章节相关覆盖物
    chapterOverlaysRef.current.forEach((o) => amap.remove(o));
    chapterOverlaysRef.current = [];

    // 添加路线（带发光效果）
    const routePath = chapter.route.map((c: [number, number]) => new AMap.LngLat(c[0], c[1]));

    // 外层发光路线
    const glowPolyline = new AMap.Polyline({
      path: routePath,
      strokeColor: chapter.color,
      strokeWeight: 16,
      strokeOpacity: 0.2,
      strokeLinecap: 'round',
      showDir: false,
      zIndex: 60,
    });
    amap.add(glowPolyline);
    chapterOverlaysRef.current.push(glowPolyline);

    // 主路线
    const mainPolyline = new AMap.Polyline({
      path: routePath,
      strokeColor: chapter.color,
      strokeWeight: 4,
      strokeOpacity: 0.95,
      strokeLinecap: 'round',
      showDir: false,
      zIndex: 61,
    });
    amap.add(mainPolyline);
    chapterOverlaysRef.current.push(mainPolyline);

    // 航点
    chapter.waypoints.forEach((wp, idx) => {
      // 外圈光晕
      const glowMarker = new AMap.CircleMarker({
        center: [wp.lng, wp.lat],
        radius: 14,
        strokeColor: chapter.color,
        strokeOpacity: 0.4,
        strokeWeight: 4,
        fillColor: chapter.color,
        fillOpacity: 0.2,
        zIndex: 70,
      });
      amap.add(glowMarker);
      chapterOverlaysRef.current.push(glowMarker);

      // 内部实心标记
      const marker = new AMap.CircleMarker({
        center: [wp.lng, wp.lat],
        radius: 10,
        strokeColor: '#ffffff',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: chapter.color,
        fillOpacity: 0.9,
        zIndex: 71,
      });
      amap.add(marker);
      chapterOverlaysRef.current.push(marker);

      // 标签
      const label = new AMap.Text({
        text: `<div style="color:#fff;font-size:12px;font-weight:600;background:rgba(0,0,0,0.5);padding:2px 6px;border-radius:3px;white-space:nowrap;">${idx + 1}. ${wp.name}</div>`,
        position: [wp.lng + 0.01, wp.lat],
        anchor: 'left-center',
        zIndex: 72,
      });
      amap.add(label);
      chapterOverlaysRef.current.push(label);
    });

    // 缩放到路线范围
    const lngs = chapter.route.map((r) => r[0]);
    const lats = chapter.route.map((r) => r[1]);
    const bounds = new AMap.Bounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)]
    );
    amap.setBounds(bounds, false, [80, 80, 80, 80]);
  }, []);

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let cancelled = false;

    loadAMapScript()
      .then((AMap) => {
        if (cancelled) return;
        AMapRef.current = AMap;

        const amap = new AMap.Map(mapContainerRef.current, {
          center: CENTER,
          zoom: 10,
          viewMode: '2D',
          mapStyle: 'normal',
        });

        amapRef.current = amap;

        amap.on('complete', () => {
          if (cancelled) return;

          // 移除默认图层，使用自定义瓦片
          try {
            amap.removeLayer('default');
          } catch (e) {
            // 忽略移除失败
          }

          // 添加卫星影像图层
          const satelliteLayer = new AMap.TileLayer({
            zIndex: 10,
            tileSize: 256,
            getTileUrl: function(x: number, y: number, z: number) {
              const s = (x + y) % 4 + 1;
              return SATELLITE_TILE_URL.replace('{s}', String(s))
                .replace('{x}', String(x))
                .replace('{y}', String(y))
                .replace('{z}', String(z));
            },
          });
          amap.add(satelliteLayer);
          satelliteLayerRef.current = satelliteLayer;

          // 添加路网注记图层
          const roadLayer = new AMap.TileLayer({
            zIndex: 20,
            tileSize: 256,
            getTileUrl: function(x: number, y: number, z: number) {
              const s = (x + y) % 4 + 1;
              return ROAD_TILE_URL.replace('{s}', String(s))
                .replace('{x}', String(x))
                .replace('{y}', String(y))
                .replace('{z}', String(z));
            },
          });
          amap.add(roadLayer);
          roadLayerRef.current = roadLayer;

          // 添加比例尺控件
          const scale = new AMap.Scale({
            position: 'LB',
          });
          amap.addControl(scale);

          // 监听缩放事件更新缩放级别
          amap.on('zoomend', () => {
            setZoomLevel(Math.round(amap.getZoom()));
          });

          setMapReady(true);
          addBaseOverlays(amap, AMap);
          loadChapter(0);
        });
      })
      .catch((err) => {
        console.error('AMap 加载失败:', err);
      });

    return () => {
      cancelled = true;
      if (amapRef.current) {
        amapRef.current.destroy();
        amapRef.current = null;
      }
    };
  }, [addBaseOverlays, loadChapter]);

  // 切换章节
  const handleChapterChange = useCallback(
    (index: number) => {
      if (index === currentChapter) return;
      setCurrentChapter(index);
      loadChapter(index);
    },
    [currentChapter, loadChapter]
  );

  // 切换图层模式
  const handleLayerModeChange = useCallback(
    (mode: 'satellite' | 'road' | 'hybrid') => {
      setLayerMode(mode);
      const satelliteLayer = satelliteLayerRef.current;
      const roadLayer = roadLayerRef.current;
      if (!satelliteLayer || !roadLayer) return;

      if (mode === 'satellite') {
        satelliteLayer.show();
        roadLayer.hide();
      } else if (mode === 'road') {
        satelliteLayer.hide();
        roadLayer.show();
      } else {
        // hybrid
        satelliteLayer.show();
        roadLayer.show();
      }
    },
    []
  );

  // 缩放控制
  const handleZoomIn = useCallback(() => {
    const amap = amapRef.current;
    if (amap) {
      amap.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    const amap = amapRef.current;
    if (amap) {
      amap.zoomOut();
    }
  }, []);

  const activeChapter = chapters[currentChapter];

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleChapterChange(Math.min(currentChapter + 1, chapters.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleChapterChange(Math.max(currentChapter - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, handleChapterChange]);

  return (
    <div style={containerStyle}>
      {/* 背景地图 - 卫星影像 + 路网注记 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', pointerEvents: 'auto' }} />
      </div>

      {/* 渐变遮罩层 */}
      <div style={overlayStyle} />

      {/* 顶部导航栏 */}
      <div style={topBarStyle}>
        <div style={topBarLeftStyle}>
          <span style={backIconStyle}>‹</span>
          <span style={topBarTitleStyle}>专题地图</span>
        </div>
        <div style={topBarCenterStyle}>
          <span style={reserveNameStyle}>{reserveInfo.name}</span>
        </div>
        <div style={topBarRightStyle}>
          <span style={reserveAreaStyle}>总面积 {reserveInfo.area.toLocaleString()} 公顷</span>
        </div>
      </div>

      {/* 左侧内容面板 */}
      <div style={leftPanelStyle}>
        <div style={chapterNumberStyle}>
          <span style={{ color: activeChapter.color }}>
            {String(activeChapter.id).padStart(2, '0')}
          </span>
          <span style={chapterTotalStyle}> / {String(chapters.length).padStart(2, '0')}</span>
        </div>

        <div style={titleBlockStyle}>
          <div style={subtitleStyle}>{activeChapter.subtitle}</div>
          <h1 style={{ ...mainTitleStyle, color: activeChapter.color }}>{activeChapter.title}</h1>
        </div>

        <div style={descriptionStyle}>{activeChapter.description}</div>

        {/* 物种信息卡片 */}
        {activeChapter.id === 2 && (
          <div style={speciesCardsStyle}>
            {speciesList.slice(0, 4).map((species) => (
              <div key={species.id} style={speciesCardStyle}>
                <div style={{ ...speciesIconStyle, background: activeChapter.color }}>
                  {species.name.charAt(0)}
                </div>
                <div style={speciesInfoStyle}>
                  <div style={speciesNameStyle}>{species.name}</div>
                  <div style={speciesLatinStyle}>{species.latinName}</div>
                  <div style={speciesCategoryStyle}>{species.category}</div>
                </div>
                <div
                  style={{
                    ...protectionBadgeStyle,
                    background:
                      species.protectionLevel === '1'
                        ? 'rgba(255, 77, 79, 0.9)'
                        : 'rgba(250, 173, 20, 0.9)',
                  }}
                >
                  {species.protectionLevel === '1' ? '国家一级' : '国家二级'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 统计数据 */}
        {activeChapter.id === 3 && (
          <div style={statsContainerStyle}>
            {[
              { label: '累计巡护里程', value: '12,500', unit: 'km' },
              { label: '巡护站点', value: '8', unit: '个' },
              { label: '监测设备', value: '35', unit: '台' },
              { label: '查处案件', value: '35', unit: '起' },
            ].map((stat, idx) => (
              <div key={idx} style={statItemStyle}>
                <div style={{ ...statValueStyle, color: activeChapter.color }}>
                  {stat.value}
                  <span style={statUnitStyle}>{stat.unit}</span>
                </div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 航点列表 */}
        <div style={waypointsListStyle}>
          {activeChapter.waypoints.map((wp, idx) => (
            <div
              key={idx}
              style={{
                ...waypointItemStyle,
                borderLeftColor: activeChapter.color,
              }}
            >
              <div style={{ ...waypointNumberStyle, background: activeChapter.color }}>
                {idx + 1}
              </div>
              <div style={waypointContentStyle}>
                <div style={waypointNameStyle}>{wp.name}</div>
                <div style={waypointDescStyle}>{wp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧章节导航 */}
      <div style={rightNavStyle}>
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.id}
            style={{
              ...navItemStyle,
              opacity: idx === currentChapter ? 1 : 0.5,
            }}
            onMouseDown={(e) => { e.preventDefault(); handleChapterChange(idx); }}
          >
            <div
              style={{
                ...navCircleStyle,
                background: idx === currentChapter ? chapter.color : 'transparent',
                borderColor: idx <= currentChapter ? chapter.color : 'rgba(255,255,255,0.3)',
                color: idx === currentChapter ? '#000' : idx < currentChapter ? chapter.color : '#fff',
              }}
            >
              {chapter.id}
            </div>
            {idx < chapters.length - 1 && (
              <div
                style={{
                  ...navLineStyle,
                  background:
                    idx < currentChapter
                      ? `linear-gradient(180deg, ${chapter.color}, ${chapters[idx + 1].color})`
                      : 'rgba(255,255,255,0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 底部指示器 */}
      <div style={bottomIndicatorStyle}>
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.id}
            style={{
              ...indicatorItemStyle,
              background: idx === currentChapter ? chapter.color : 'rgba(255,255,255,0.2)',
            }}
            onMouseDown={(e) => { e.preventDefault(); handleChapterChange(idx); }}
          />
        ))}
      </div>

      {/* 左下角章节计数器 */}
      <div style={chapterCounterStyle}>
        <span style={{ color: activeChapter.color, fontSize: 48, fontWeight: 700 }}>
          {String(activeChapter.id).padStart(2, '0')}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 24, marginLeft: 8 }}>
          / {String(chapters.length).padStart(2, '0')}
        </span>
      </div>

      {/* 右下角图层切换工具 */}
      <div style={layerSwitcherStyle}>
        <div
          style={{
            ...layerItemStyle,
            background: layerMode === 'hybrid' ? 'rgba(79, 195, 247, 0.9)' : 'rgba(255,255,255,0.1)',
            color: layerMode === 'hybrid' ? '#fff' : 'rgba(255,255,255,0.7)',
          }}
          onMouseDown={(e) => { e.preventDefault(); handleLayerModeChange('hybrid'); }}
        >
          <span style={layerIconStyle}>🛰️</span>
          <span style={layerLabelStyle}>影像</span>
          <span style={layerSubLabelStyle}>+路网</span>
        </div>
        <div
          style={{
            ...layerItemStyle,
            background: layerMode === 'satellite' ? 'rgba(79, 195, 247, 0.9)' : 'rgba(255,255,255,0.1)',
            color: layerMode === 'satellite' ? '#fff' : 'rgba(255,255,255,0.7)',
          }}
          onMouseDown={(e) => { e.preventDefault(); handleLayerModeChange('satellite'); }}
        >
          <span style={layerIconStyle}>🛰️</span>
          <span style={layerLabelStyle}>卫星</span>
        </div>
        <div
          style={{
            ...layerItemStyle,
            background: layerMode === 'road' ? 'rgba(79, 195, 247, 0.9)' : 'rgba(255,255,255,0.1)',
            color: layerMode === 'road' ? '#fff' : 'rgba(255,255,255,0.7)',
          }}
          onMouseDown={(e) => { e.preventDefault(); handleLayerModeChange('road'); }}
        >
          <span style={layerIconStyle}>🗺️</span>
          <span style={layerLabelStyle}>路网</span>
        </div>
      </div>

      {/* 缩放控件 */}
      <div style={zoomControlStyle}>
        <div style={zoomLevelDisplayStyle}>{zoomLevel}</div>
        <div
          style={zoomButtonStyle}
          onMouseDown={(e) => { e.preventDefault(); handleZoomIn(); }}
        >
          <span style={zoomIconStyle}>+</span>
        </div>
        <div
          style={{ ...zoomButtonStyle, borderTop: '1px solid rgba(255,255,255,0.15)' }}
          onMouseDown={(e) => { e.preventDefault(); handleZoomOut(); }}
        >
          <span style={zoomIconStyle}>−</span>
        </div>
      </div>

      {/* 加载提示 */}
      {!mapReady && (
        <div style={loadingStyle}>
          <div style={loadingSpinnerStyle} />
          <span style={{ color: '#fff', marginTop: 16 }}>地图加载中...</span>
        </div>
      )}
    </div>
  );
};

// 样式常量
const containerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  background: '#0a1628',
};

const overlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'radial-gradient(ellipse at center, #030b0d00 28%, #030b0d57 51%, #030b0dd1 76%, #030b0d)',
  pointerEvents: 'none',
  zIndex: 1,
  transition: 'opacity .5s ease',
};

const topBarStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
  zIndex: 999,
  background: 'linear-gradient(180deg, rgba(5,15,35,0.8) 0%, rgba(5,15,35,0) 100%)',
};

const topBarLeftStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const backIconStyle: CSSProperties = { fontSize: 36, color: '#fff', cursor: 'pointer', fontWeight: 300, lineHeight: 1 };
const topBarTitleStyle: CSSProperties = { color: '#fff', fontSize: 15, fontWeight: 500, letterSpacing: 2 };
const topBarCenterStyle: CSSProperties = { display: 'flex', alignItems: 'center' };
const reserveNameStyle: CSSProperties = { color: 'rgba(255,255,255,0.85)', fontSize: 14, letterSpacing: 4, fontWeight: 500 };
const topBarRightStyle: CSSProperties = { display: 'flex', alignItems: 'center' };
const reserveAreaStyle: CSSProperties = { color: 'rgba(255,255,255,0.6)', fontSize: 13 };

const leftPanelStyle: CSSProperties = {
  position: 'absolute',
  top: 80,
  left: 48,
  width: 420,
  maxHeight: 'calc(100vh - 200px)',
  overflowY: 'auto',
  zIndex: 999,
  paddingRight: 16,
};

const chapterNumberStyle: CSSProperties = { fontSize: 18, fontWeight: 300, letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'baseline' };
const chapterTotalStyle: CSSProperties = { color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontSize: 14 };
const titleBlockStyle: CSSProperties = { marginBottom: 24 };
const subtitleStyle: CSSProperties = { color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: 2, marginBottom: 12, fontWeight: 300 };
const mainTitleStyle: CSSProperties = { fontSize: 52, fontWeight: 700, lineHeight: 1.1, letterSpacing: 4, margin: 0, textShadow: '0 0 40px rgba(255,255,255,0.2)' };
const descriptionStyle: CSSProperties = { color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.8, marginBottom: 28, paddingLeft: 20, borderLeft: '2px solid rgba(255,255,255,0.2)' };

const waypointsListStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 28 };
const waypointItemStyle: CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '10px 0 10px 16px', borderLeft: '2px solid', marginLeft: 8 };
const waypointNumberStyle: CSSProperties = { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 2 };
const waypointContentStyle: CSSProperties = { flex: 1 };
const waypointNameStyle: CSSProperties = { color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 2 };
const waypointDescStyle: CSSProperties = { color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.5 };

const rightNavStyle: CSSProperties = { position: 'absolute', top: '50%', right: 48, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 999, pointerEvents: 'auto' };
const navItemStyle: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease' };
const navCircleStyle: CSSProperties = { width: 36, height: 36, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, transition: 'all 0.3s ease', marginBottom: 8 };
const navLineStyle: CSSProperties = { width: 2, height: 40, marginBottom: 8, transition: 'all 0.3s ease' };

const bottomIndicatorStyle: CSSProperties = { position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 999 };
const indicatorItemStyle: CSSProperties = { width: 40, height: 3, borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease' };

const chapterCounterStyle: CSSProperties = { position: 'absolute', bottom: 60, left: 48, display: 'flex', alignItems: 'baseline', zIndex: 999, fontFamily: 'Georgia, serif' };

// 图层切换工具样式
const layerSwitcherStyle: CSSProperties = {
  position: 'absolute',
  bottom: 60,
  right: 48,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 999,
};

const layerItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  borderRadius: 20,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  minWidth: 90,
};

const layerIconStyle: CSSProperties = { fontSize: 14 };
const layerLabelStyle: CSSProperties = { fontSize: 13 };
const layerSubLabelStyle: CSSProperties = { fontSize: 11, opacity: 0.7 };

// 缩放控件样式
const zoomControlStyle: CSSProperties = {
  position: 'absolute',
  bottom: 280,
  right: 48,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  zIndex: 999,
};

const zoomLevelDisplayStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  backdropFilter: 'blur(10px)',
};

const zoomButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
};

const zoomIconStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  lineHeight: 1,
};

const loadingStyle: CSSProperties = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1628', zIndex: 200 };
const loadingSpinnerStyle: CSSProperties = { width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#4FC3F7', borderRadius: '50%', animation: 'spin 1s linear infinite' };

const speciesCardsStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 };
const speciesCardStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' };
const speciesIconStyle: CSSProperties = { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700, flexShrink: 0 };
const speciesInfoStyle: CSSProperties = { flex: 1 };
const speciesNameStyle: CSSProperties = { color: '#fff', fontSize: 14, fontWeight: 600 };
const speciesLatinStyle: CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontStyle: 'italic' };
const speciesCategoryStyle: CSSProperties = { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 };
const protectionBadgeStyle: CSSProperties = { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 600 };

const statsContainerStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 };
const statItemStyle: CSSProperties = { padding: '14px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' };
const statValueStyle: CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 4 };
const statUnitStyle: CSSProperties = { fontSize: 12, fontWeight: 400, marginLeft: 4, color: 'rgba(255,255,255,0.5)' };
const statLabelStyle: CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: 12 };

export default ThematicShowcase;
