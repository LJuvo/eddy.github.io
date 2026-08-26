import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reserveInfo, speciesList, thematicTopicsData } from '@/mock';

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

const ThematicShowcase: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  // 获取当前专题
  const currentTopicId = searchParams.get('topic');
  const publishedTopics = useMemo(
    () => thematicTopicsData.filter(t => t.status === 'published'),
    []
  );
  
  const currentTopic = useMemo(() => {
    if (currentTopicId) {
      const found = thematicTopicsData.find(t => t.id === currentTopicId);
      if (found) return found;
    }
    // 默认取第一个已发布的专题
    return publishedTopics.find(t => t.isDefault) || publishedTopics[0] || thematicTopicsData[0];
  }, [currentTopicId, publishedTopics]);

  const chapters = currentTopic?.chapters || [];

  // 切换专题
  const handleSwitchTopic = (topicId: string) => {
    setSearchParams({ topic: topicId });
    setCurrentChapter(0);
    setShowTopicSelector(false);
  };

  // 添加基础覆盖物（边界+功能区）
  const addBaseOverlays = useCallback((amap: any, AMap: any) => {
    try {
      // 清除旧的基础覆盖物
      baseOverlaysRef.current.forEach((o) => {
        try { amap.remove(o); } catch {}
      });
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
        try {
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
        } catch (err) {
          console.error('功能区覆盖物创建失败:', err);
        }
      });
    } catch (err) {
      console.error('基础覆盖物加载失败:', err);
    }
  }, []);

  // 加载章节
  const loadChapter = useCallback((index: number) => {
    const chapter = chapters[index];
    const amap = amapRef.current;
    const AMap = AMapRef.current;
    if (!chapter || !amap || !AMap) return;

    try {
      // 移除章节相关覆盖物
      chapterOverlaysRef.current.forEach((o) => {
        try { amap.remove(o); } catch {}
      });
      chapterOverlaysRef.current = [];

      // 检查是否有有效的路线数据
      const hasRoute = chapter.route && chapter.route.length >= 2;

      if (hasRoute) {
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
      }

      // 航点
      chapter.waypoints
        .filter((wp) => typeof wp.lng === 'number' && typeof wp.lat === 'number' && !isNaN(wp.lng) && !isNaN(wp.lat))
        .forEach((wp, idx) => {
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

      // 缩放到路线范围（仅当有有效路线时）
      if (hasRoute) {
        const lngs = chapter.route.map((r) => r[0]);
        const lats = chapter.route.map((r) => r[1]);
        if (lngs.length > 0 && lats.length > 0) {
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          // 验证 bounds 有效性
          if (isFinite(minLng) && isFinite(maxLng) && isFinite(minLat) && isFinite(maxLat) &&
              minLng !== maxLng && minLat !== maxLat) {
            const bounds = new AMap.Bounds([minLng, minLat], [maxLng, maxLat]);
            amap.setBounds(bounds, false, [80, 80, 80, 80]);
          }
        }
      }
    } catch (err) {
      console.error('加载章节失败:', err);
    }
  }, [chapters]);

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 检查容器是否有有效尺寸
    const rect = mapContainerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      // 容器尚无尺寸，延迟一帧重试
      const retryId = requestAnimationFrame(() => {
        // 触发重新执行（通过设置一个状态来强制重渲染 effect）
        setMapReady((prev) => prev);
      });
      return () => cancelAnimationFrame(retryId);
    }

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

          try {
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
          } catch (err) {
            console.error('地图初始化失败:', err);
          }
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

  const activeChapter = chapters[currentChapter] || chapters[0];

  // 键盘导航
  useEffect(() => {
    if (chapters.length === 0) return;
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
  }, [currentChapter, handleChapterChange, chapters.length]);

  // 当专题切换时重置状态
  const prevTopicIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevTopicIdRef.current === currentTopicId) return;
    prevTopicIdRef.current = currentTopicId;
    setCurrentChapter(0);
    if (mapReady && amapRef.current) {
      loadChapter(0);
    }
  }, [currentTopicId, loadChapter, mapReady]);

  // 如果没有可用章节，显示加载状态
  if (!activeChapter || chapters.length === 0) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ ...loadingSpinnerStyle, margin: '0 auto 16px' }} />
          <div>正在加载专题内容...</div>
        </div>
      </div>
    );
  }

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
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 20,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onClick={() => setShowTopicSelector(!showTopicSelector)}
            >
              <span style={{ fontSize: 18 }}>{currentTopic?.icon || '🏞️'}</span>
              <span style={reserveNameStyle}>
                {currentTopic?.name || reserveInfo.name}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>▼</span>
            </div>
            {showTopicSelector && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: 'rgba(31, 45, 61, 0.98)',
                  borderRadius: 12,
                  padding: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  zIndex: 1000,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 280,
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '8px 12px', marginBottom: 4 }}>
                  选择专题
                </div>
                {publishedTopics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => handleSwitchTopic(topic.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: currentTopic?.id === topic.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                      transition: 'background 0.2s',
                      marginBottom: 4,
                    }}
                    onMouseEnter={e => {
                      if (currentTopic?.id !== topic.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (currentTopic?.id !== topic.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${topic.coverColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {topic.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
                        {topic.name}
                        {topic.isDefault && (
                          <span style={{ color: topic.coverColor, fontSize: 11, marginLeft: 6 }}>默认</span>
                        )}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>
                        {topic.description.slice(0, 40)}...
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      {topic.chapters.length} 章节
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={topBarRightStyle}>
          <span style={reserveAreaStyle}>
            {currentTopic ? `${currentTopic.chapters.length} 个章节 · ` : ''}
            总面积 {reserveInfo.area.toLocaleString()} 公顷
          </span>
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
        {activeChapter.speciesIds && activeChapter.speciesIds.length > 0 && (
          <div style={speciesCardsStyle}>
            {activeChapter.speciesIds.map(speciesId => {
              const species = speciesList.find(s => s.id === speciesId);
              if (!species) return null;
              return (
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
              );
            })}
          </div>
        )}

        {/* 统计数据 */}
        {activeChapter.stats && activeChapter.stats.length > 0 && (
          <div style={statsContainerStyle}>
            {activeChapter.stats.map((stat, idx) => (
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
