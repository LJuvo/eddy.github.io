import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  List,
  Avatar,
  Badge,
  Tag,
  Progress,
} from 'antd';
import {
  EnvironmentOutlined,
  SafetyOutlined,
  AlertOutlined,
  TeamOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  HeartOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  dashboardStats,
  patrolTasks,
  patrolAlerts,
  speciesList,
  monitorDevices,
  patrolPersonnel,
  patrolTrendData,
  alertTrendData,
  deviceStatusData,
  monitorDataList,
} from '@/mock';

interface RealtimeData {
  waterLevel: number;
  dissolvedOxygen: number;
  temperature: number;
  alerts: number;
  patrollers: number;
}

const DataScreen: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    waterLevel: 1.25,
    dissolvedOxygen: 8.5,
    temperature: 12.3,
    alerts: 3,
    patrollers: 5,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setRealtimeData(prev => ({
        ...prev,
        waterLevel: prev.waterLevel + (Math.random() - 0.5) * 0.1,
        dissolvedOxygen: prev.dissolvedOxygen + (Math.random() - 0.5) * 0.2,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.3,
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // 左侧KPI指标卡片
  const leftKPIs = [
    {
      title: '巡护覆盖率',
      value: dashboardStats.patrolCoverage,
      suffix: '%',
      icon: <SafetyOutlined />,
      color: '#00f5ff',
      bgColor: 'rgba(0, 245, 255, 0.1)',
      trend: '+5.2%',
    },
    {
      title: '今日告警数',
      value: dashboardStats.alertCount,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
      bgColor: 'rgba(255, 77, 79, 0.1)',
      trend: '-3.1%',
    },
    {
      title: '物种数量',
      value: dashboardStats.speciesCount,
      icon: <TeamOutlined />,
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)',
      trend: '+12',
    },
    {
      title: '设备在线率',
      value: dashboardStats.deviceOnlineRate,
      suffix: '%',
      icon: <ApiOutlined />,
      color: '#faad14',
      bgColor: 'rgba(250, 173, 20, 0.1)',
      trend: '+1.5%',
    },
  ];

  // 右侧实时监控数据
  const rightMonitors = [
    {
      title: '水位监测',
      value: `${realtimeData.waterLevel.toFixed(2)}m`,
      icon: <GlobalOutlined />,
      color: '#1890ff',
      status: '正常',
    },
    {
      title: '溶解氧',
      value: `${realtimeData.dissolvedOxygen.toFixed(1)} mg/L`,
      icon: <HeartOutlined />,
      color: '#52c41a',
      status: '正常',
    },
    {
      title: '水温',
      value: `${realtimeData.temperature.toFixed(1)}°C`,
      icon: <ThunderboltOutlined />,
      color: '#ff7a00',
      status: '正常',
    },
    {
      title: '今日巡护',
      value: `${dashboardStats.todayPatrolCount}次`,
      icon: <EnvironmentOutlined />,
      color: '#722ed1',
      status: '进行中',
    },
  ];

  // 巡护趋势图配置
  const patrolTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 20, 40, 0.9)',
      borderColor: '#00f5ff',
      textStyle: { color: '#fff' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: patrolTrendData.map(item => item.month.slice(5)),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
      axisLabel: { color: '#94a3b8' },
    },
    series: [
      {
        name: '巡护次数',
        type: 'bar',
        data: patrolTrendData.map(item => item.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00f5ff' },
            { offset: 1, color: '#0066cc' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '50%',
      },
    ],
  };

  // 告警趋势图配置
  const alertTrendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 20, 40, 0.9)',
      borderColor: '#ff4d4f',
      textStyle: { color: '#fff' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: alertTrendData.map(item => item.month.slice(5)),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
      axisLabel: { color: '#94a3b8' },
    },
    series: [
      {
        name: '告警次数',
        type: 'line',
        data: alertTrendData.map(item => item.count),
        smooth: true,
        lineStyle: { color: '#ff4d4f', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 79, 0.4)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0)' },
          ]),
        },
        itemStyle: { color: '#ff4d4f' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };

  // 设备状态饼图配置
  const deviceStatusOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 20, 40, 0.9)',
      borderColor: '#00f5ff',
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#94a3b8' },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' },
        },
        data: deviceStatusData,
      },
    ],
  };

  // 保护区地图模拟配置
  const mapOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 20, 40, 0.9)',
      borderColor: '#00f5ff',
      textStyle: { color: '#fff' },
    },
    geo: {
      map: 'reserve',
      roam: true,
      zoom: 1.2,
      center: [106.5, 32.2],
      itemStyle: {
        areaColor: 'rgba(0, 100, 150, 0.3)',
        borderColor: '#00f5ff',
        borderWidth: 2,
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(0, 200, 200, 0.4)',
        },
      },
      data: [
        { name: '核心区', value: [106.5, 32.25], itemStyle: { areaColor: '#ff4d4f40' } },
        { name: '缓冲区', value: [106.4, 32.15], itemStyle: { areaColor: '#faad1440' } },
        { name: '实验区', value: [106.6, 32.1], itemStyle: { areaColor: '#52c41a40' } },
      ],
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 3,
        rippleEffect: { brushType: 'stroke', scale: 4 },
        symbol: 'circle',
        symbolSize: 12,
        itemStyle: { color: '#00f5ff', shadowBlur: 10, shadowColor: '#00f5ff' },
        data: [
          { name: '监测站-1', value: [106.45, 32.28] },
          { name: '监测站-2', value: [106.55, 32.18] },
          { name: '监测站-3', value: [106.38, 32.12] },
        ],
      },
    ],
  };

  // 紧急告警列表
  const criticalAlerts = patrolAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5);

  // 巡护人员状态
  const onDutyPersonnel = patrolPersonnel.filter(p => p.status === '巡护中');

  return (
    <div className="data-screen" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1929 0%, #0d1b2a 50%, #1b263b 100%)',
      padding: 0,
      margin: 0,
      overflow: 'hidden',
    }}>
      {/* 顶部标题栏 */}
      <div style={{
        height: 80,
        background: 'linear-gradient(180deg, rgba(0,245,255,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(0,245,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 8,
            height: 40,
            background: 'linear-gradient(180deg, #00f5ff, #0066cc)',
            borderRadius: 4,
          }} />
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            textShadow: '0 0 20px rgba(0,245,255,0.5)',
          }}>
            四川诺水河保护区数据总览
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#00f5ff',
          fontSize: 16,
        }}>
          <ClockCircleOutlined />
          <span style={{ fontFamily: 'monospace', letterSpacing: 2 }}>
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 140px)',
        padding: '16px 20px',
        gap: 16,
      }}>
        {/* 左侧数据面板 */}
        <div style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* KPI指标卡片 */}
          <div style={{
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: 16,
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#00f5ff',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <EyeOutlined />
              核心KPI指标
            </div>
            <Row gutter={[12, 12]}>
              {leftKPIs.map((kpi, index) => (
                <Col span={12} key={index}>
                  <div style={{
                    background: kpi.bgColor,
                    borderRadius: 8,
                    padding: 12,
                    border: `1px solid ${kpi.color}30`,
                    transition: 'transform 0.3s',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.title}</span>
                      <span style={{ color: kpi.color, fontSize: 16 }}>{kpi.icon}</span>
                    </div>
                    <div style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: kpi.color,
                      textShadow: `0 0 10px ${kpi.color}50`,
                    }}>
                      {kpi.value}{kpi.suffix || ''}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: kpi.trend.startsWith('+') ? '#52c41a' : '#ff4d4f',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      {kpi.trend.startsWith('+') ? <RiseOutlined /> : <FallOutlined />}
                      {kpi.trend} 较上月
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* 实时监测数据 */}
          <div style={{
            flex: 1,
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: 16,
            overflow: 'auto',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#00f5ff',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <ThunderboltOutlined />
              实时监测数据
            </div>
            {rightMonitors.map((monitor, index) => (
              <div key={index} style={{
                background: 'rgba(0, 245, 255, 0.05)',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                border: '1px solid rgba(0, 245, 255, 0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: monitor.color }}>{monitor.icon}</span>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>{monitor.title}</span>
                  </div>
                  <Tag color={monitor.status === '正常' ? 'success' : 'warning'} style={{ margin: 0 }}>
                    {monitor.status}
                  </Tag>
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: monitor.color,
                  textShadow: `0 0 8px ${monitor.color}50`,
                }}>
                  {monitor.value}
                </div>
              </div>
            ))}
          </div>

          {/* 紧急告警 */}
          <div style={{
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(255, 77, 79, 0.3)',
            padding: 16,
            maxHeight: 200,
            overflow: 'auto',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#ff4d4f',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertOutlined />
              紧急告警
              <Badge count={criticalAlerts.length} style={{ backgroundColor: '#ff4d4f' }} />
            </div>
            {criticalAlerts.map((alert, index) => (
              <div key={index} style={{
                background: 'rgba(255, 77, 79, 0.1)',
                borderRadius: 6,
                padding: 10,
                marginBottom: 8,
                borderLeft: `3px solid ${alert.severity === 'critical' ? '#ff4d4f' : '#ff7a00'}`,
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 4,
                }}>
                  {alert.type === 'illegal_fishing' ? '非法捕捞' :
                   alert.type === 'illegal_mining' ? '非法采砂' :
                   alert.type === 'pollution' ? '污水排放' : '其他异常'}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{alert.location}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{alert.reportTime}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 中央地图区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* 地图 */}
          <div style={{
            flex: 1,
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: 16,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              display: 'flex',
              gap: 12,
            }}>
              <div style={{
                background: 'rgba(255, 77, 79, 0.3)',
                border: '1px solid #ff4d4f',
                borderRadius: 4,
                padding: '4px 12px',
                fontSize: 12,
                color: '#fff',
              }}>
                核心区
              </div>
              <div style={{
                background: 'rgba(250, 173, 20, 0.3)',
                border: '1px solid #faad14',
                borderRadius: 4,
                padding: '4px 12px',
                fontSize: 12,
                color: '#fff',
              }}>
                缓冲区
              </div>
              <div style={{
                background: 'rgba(82, 196, 26, 0.3)',
                border: '1px solid #52c41a',
                borderRadius: 4,
                padding: '4px 12px',
                fontSize: 12,
                color: '#fff',
              }}>
                实验区
              </div>
            </div>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                title: {
                  text: '诺水河保护区GIS地图',
                  textStyle: { color: '#00f5ff', fontSize: 16 },
                  left: 'center',
                  top: 10,
                },
                tooltip: {
                  trigger: 'item',
                  backgroundColor: 'rgba(0, 20, 40, 0.9)',
                  borderColor: '#00f5ff',
                  textStyle: { color: '#fff' },
                },
                geo: {
                  map: 'china',
                  roam: true,
                  zoom: 0.8,
                  center: [105, 33],
                  itemStyle: {
                    areaColor: 'rgba(0, 100, 150, 0.2)',
                    borderColor: '#334155',
                    borderWidth: 1,
                  },
                  emphasis: {
                    itemStyle: {
                      areaColor: 'rgba(0, 200, 200, 0.3)',
                    },
                  },
                },
                series: [
                  {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 3,
                    rippleEffect: { brushType: 'stroke', scale: 4 },
                    symbol: 'circle',
                    symbolSize: 14,
                    itemStyle: { color: '#00f5ff', shadowBlur: 10, shadowColor: '#00f5ff' },
                    data: [
                      { name: '监测站-1', value: [106.5, 32.3] },
                      { name: '监测站-2', value: [106.3, 32.1] },
                      { name: '监测站-3', value: [106.6, 32.2] },
                    ],
                  },
                  {
                    type: 'lines',
                    zlevel: 2,
                    effect: { show: true, period: 4, trailLength: 0.3, symbol: 'circle', symbolSize: 3 },
                    lineStyle: { color: '#00f5ff', width: 2, opacity: 0.6, curveness: 0.2 },
                    data: [
                      { coords: [[106.5, 32.3], [106.3, 32.1]], },
                      { coords: [[106.3, 32.1], [106.6, 32.2]], },
                    ],
                  },
                ],
              }}
              style={{ height: '100%', width: '100%' }}
            />
          </div>

          {/* 底部图表区域 */}
          <div style={{
            height: 220,
            display: 'flex',
            gap: 16,
          }}>
            <div style={{
              flex: 1,
              background: 'rgba(0, 20, 40, 0.6)',
              borderRadius: 12,
              border: '1px solid rgba(0, 245, 255, 0.2)',
              padding: 12,
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#00f5ff',
                marginBottom: 8,
              }}>
                月度巡护趋势
              </div>
              <ReactECharts option={patrolTrendOption} style={{ height: 160 }} />
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(0, 20, 40, 0.6)',
              borderRadius: 12,
              border: '1px solid rgba(255, 77, 79, 0.2)',
              padding: 12,
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#ff4d4f',
                marginBottom: 8,
              }}>
                月度告警趋势
              </div>
              <ReactECharts option={alertTrendOption} style={{ height: 160 }} />
            </div>
            <div style={{
              width: 280,
              background: 'rgba(0, 20, 40, 0.6)',
              borderRadius: 12,
              border: '1px solid rgba(0, 245, 255, 0.2)',
              padding: 12,
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#00f5ff',
                marginBottom: 8,
              }}>
                设备状态分布
              </div>
              <ReactECharts option={deviceStatusOption} style={{ height: 160 }} />
            </div>
          </div>
        </div>

        {/* 右侧数据面板 */}
        <div style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* 巡护任务进度 */}
          <div style={{
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: 16,
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#00f5ff',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <SafetyOutlined />
              巡护任务状态
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>今日任务完成率</span>
                <span style={{ color: '#52c41a', fontWeight: 600 }}>87.5%</span>
              </div>
              <Progress
                percent={87.5}
                showInfo={false}
                strokeColor={{
                  '0%': '#00f5ff',
                  '100%': '#0066cc',
                }}
                trailColor="rgba(0, 245, 255, 0.1)"
              />
            </div>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <div style={{
                  background: 'rgba(82, 196, 26, 0.1)',
                  borderRadius: 6,
                  padding: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>
                    {patrolTasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>已完成</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{
                  background: 'rgba(24, 144, 255, 0.1)',
                  borderRadius: 6,
                  padding: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
                    {patrolTasks.filter(t => t.status === 'in_progress').length}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>进行中</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{
                  background: 'rgba(250, 173, 20, 0.1)',
                  borderRadius: 6,
                  padding: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#faad14' }}>
                    {patrolTasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>待执行</div>
                </div>
              </Col>
            </Row>
          </div>

          {/* 巡护人员在线 */}
          <div style={{
            flex: 1,
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: 16,
            overflow: 'auto',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#00f5ff',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <TeamOutlined />
              巡护人员状态
              <Badge count={onDutyPersonnel.length} style={{ backgroundColor: '#52c41a' }} />
            </div>
            <List
              dataSource={patrolPersonnel}
              renderItem={(person) => (
                <div style={{
                  background: 'rgba(0, 245, 255, 0.05)',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  border: '1px solid rgba(0, 245, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <Avatar
                    style={{
                      background: person.status === '巡护中' ? '#2D7D46' : '#64748b',
                      boxShadow: person.status === '巡护中' ? '0 0 10px rgba(82, 196, 26, 0.5)' : 'none',
                    }}
                  >
                    {person.name.charAt(0)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{person.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{person.role}</div>
                  </div>
                  <Tag color={person.status === '巡护中' ? 'success' : person.status === '待命' ? 'processing' : 'default'}>
                    {person.status}
                  </Tag>
                </div>
              )}
            />
          </div>

          {/* 重点物种监测 */}
          <div style={{
            background: 'rgba(0, 20, 40, 0.6)',
            borderRadius: 12,
            border: '1px solid rgba(82, 196, 26, 0.3)',
            padding: 16,
            maxHeight: 200,
            overflow: 'auto',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#52c41a',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <EnvironmentOutlined />
              重点保护物种
            </div>
            {speciesList.slice(0, 4).map((species, index) => (
              <div key={index} style={{
                background: 'rgba(82, 196, 26, 0.05)',
                borderRadius: 6,
                padding: 10,
                marginBottom: 8,
                borderLeft: `3px solid ${species.protectionLevel === '1' ? '#ff4d4f' : '#faad14'}`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{species.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{species.latinName}</div>
                  </div>
                  <Tag color={species.protectionLevel === '1' ? 'red' : 'orange'} style={{ margin: 0 }}>
                    {species.protectionLevel === '1' ? '一级' : '二级'}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部时间轴 */}
      <div style={{
        height: 60,
        background: 'rgba(0, 20, 40, 0.8)',
        borderTop: '1px solid rgba(0, 245, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '0 40px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: '#00f5ff',
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#52c41a',
            boxShadow: '0 0 10px #52c41a',
          }} />
          <span style={{ fontSize: 13 }}>系统运行正常</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: '#94a3b8',
        }}>
          <span style={{ fontSize: 13 }}>今日在线设备: 32台</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: '#94a3b8',
        }}>
          <span style={{ fontSize: 13 }}>数据更新: {formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default DataScreen;
