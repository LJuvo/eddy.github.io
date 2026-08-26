import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Scene, ImageLayer, PointLayer, LineLayer, PolygonLayer, GaodeMap } from '@antv/l7';
import type { ILayer } from '@antv/l7';

// 诺水河保护区中心坐标
const CENTER_COORDS: [number, number] = [107.15, 32.05];

// 地图配置
interface L7MapProps {
  style?: React.CSSProperties;
  className?: string;
  center?: [number, number];
  zoom?: number;
  mapStyle?: string; // 'dark' | 'light' | 'normal'
  onSceneReady?: (scene: Scene) => void;
  onMapClick?: (lnglat: { lng: number; lat: number }) => void;
  showMarker?: boolean;
  markers?: Array<{ id: string; lng: number; lat: number; title: string; type?: string }>;
  layers?: Array<{
    id: string;
    type: 'point' | 'line' | 'polygon';
    data: any;
    visible?: boolean;
    color?: string;
  }>;
}

// 图层颜色映射
const TYPE_COLORS: Record<string, string> = {
  species: '#52c41a',
  patrol: '#1890ff',
  facility: '#faad14',
  alert: '#ff4d4f',
  water: '#13c2c2',
  default: '#722ed1',
};

const L7Map: React.FC<L7MapProps> = ({
  style,
  className,
  center = CENTER_COORDS,
  zoom = 10,
  mapStyle = 'light',
  onSceneReady,
  onMapClick,
  showMarker = false,
  markers = [],
  layers = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const layerMapRef = useRef<Map<string, ILayer>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new Scene({
      id: containerRef.current,
      map: new GaodeMap({
        center: center,
        zoom: zoom,
        style: mapStyle,
      }),
      logoVisible: false,
    });

    scene.on('loaded', () => {
      sceneRef.current = scene;
      setMapReady(true);
      
      // 添加底图图层（高德瓦片）
      const baseLayer = new ImageLayer({
        zIndex: 0,
      }).source(
        'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
            zoomOffset: 0,
          },
        },
      );
      scene.addLayer(baseLayer);

      // 回调
      if (onSceneReady) {
        onSceneReady(scene);
      }
    });

    // 地图点击事件
    if (onMapClick) {
      scene.on('click', (e: any) => {
        onMapClick({ lng: e.lnglat.lng, lat: e.lnglat.lat });
      });
    }

    // 清理
    return () => {
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  // 更新地图视图
  useEffect(() => {
    if (sceneRef.current && mapReady) {
      sceneRef.current.setCenter(center);
      sceneRef.current.setZoom(zoom);
    }
  }, [center, zoom, mapReady]);

  // 更新地图样式
  useEffect(() => {
    if (sceneRef.current && mapReady) {
      sceneRef.current.setMapStyle(mapStyle);
    }
  }, [mapStyle, mapReady]);

  // 添加标注点
  useEffect(() => {
    if (!sceneRef.current || !mapReady) return;

    // 清除旧的标注图层
    const oldMarkerLayer = layerMapRef.current.get('markers');
    if (oldMarkerLayer) {
      sceneRef.current.removeLayer(oldMarkerLayer);
      layerMapRef.current.delete('markers');
    }

    if (markers.length > 0) {
      const markerData = markers.map(m => ({
        lng: m.lng,
        lat: m.lat,
        title: m.title,
        type: m.type || 'default',
        id: m.id,
      }));

      const markerLayer = new PointLayer({ zIndex: 10 })
        .source(markerData, {
          parser: { type: 'json', x: 'lng', y: 'lat' },
        })
        .shape('circle')
        .size(12)
        .color('type', (type: string) => TYPE_COLORS[type] || TYPE_COLORS.default)
        .style({
          opacity: 0.8,
          strokeWidth: 2,
          stroke: '#fff',
        });

      sceneRef.current.addLayer(markerLayer);
      layerMapRef.current.set('markers', markerLayer);

      // 添加 tooltip
      markerLayer.on('click', (e: any) => {
        const feature = e.feature;
        if (feature) {
          sceneRef.current?.setCenter([feature.lng, feature.lat]);
        }
      });
    }
  }, [markers, mapReady]);

  // 添加自定义图层
  useEffect(() => {
    if (!sceneRef.current || !mapReady) return;

    // 清除旧的自定义图层
    layers.forEach(layerConfig => {
      const oldLayer = layerMapRef.current.get(layerConfig.id);
      if (oldLayer) {
        sceneRef.current?.removeLayer(oldLayer);
      }
    });

    // 添加新图层
    layers.forEach(layerConfig => {
      let newLayer: ILayer;

      if (layerConfig.type === 'point') {
        newLayer = new PointLayer({ zIndex: 5 })
          .source(layerConfig.data, {
            parser: { type: 'json', x: 'lng', y: 'lat' },
          })
          .shape('circle')
          .size(8)
          .color(layerConfig.color || TYPE_COLORS.default)
          .style({ opacity: 0.7 });
      } else if (layerConfig.type === 'line') {
        newLayer = new LineLayer({ zIndex: 4 })
          .source(layerConfig.data, {
            parser: { type: 'json', coordinates: 'path' },
          })
          .shape('line')
          .size(2)
          .color(layerConfig.color || '#1890ff')
          .style({ opacity: 0.8 });
      } else if (layerConfig.type === 'polygon') {
        newLayer = new PolygonLayer({ zIndex: 3 })
          .source(layerConfig.data, {
            parser: { type: 'json', coordinates: 'coordinates' },
          })
          .shape('fill')
          .color(layerConfig.color || '#52c41a')
          .style({ opacity: 0.5 });
      } else {
        return;
      }

      if (layerConfig.visible !== false) {
        sceneRef.current?.addLayer(newLayer);
      }

      layerMapRef.current.set(layerConfig.id, newLayer);
    });
  }, [layers, mapReady]);

  // 设置图层可见性
  const setLayerVisible = useCallback((layerId: string, visible: boolean) => {
    const layer = layerMapRef.current.get(layerId);
    if (layer) {
      if (visible) {
        layer.show();
      } else {
        layer.hide();
      }
    }
  }, []);

  // 获取场景实例
  const getScene = useCallback(() => sceneRef.current, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        ...style,
      }}
    />
  );
};

export default L7Map;

// 导出工具函数和类型
export { Scene, ImageLayer, PointLayer, LineLayer, PolygonLayer, GaodeMap };
export type { L7MapProps };