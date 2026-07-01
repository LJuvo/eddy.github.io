import React, { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Checkbox,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message,
  Progress,
  Statistic,
  Tabs,
  List,
  Avatar,
  Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApartmentOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  ExportOutlined,
  ClearOutlined,
  SyncOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

interface LayerItem {
  id: string;
  name: string;
  type: string;
  checked: boolean;
  opacity: number;
  visible: boolean;
}

interface OverlayResult {
  id: string;
  name: string;
  inputLayers: string[];
  operation: string;
  resultArea: number;
  overlapArea: number;
  overlapRate: number;
  createTime: string;
}

interface AnalysisConfig {
  layer1: string;
  layer2: string;
  operation: string;
  outputName: string;
}

const OverlayAnalysis: React.FC = () => {
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: 'boundary', name: '保护区边界', type: 'polygon', checked: true, opacity: 0.8, visible: true },
    { id: 'zoning', name: '功能区划', type: 'polygon', checked: true, opacity: 0.6, visible: true },
    { id: 'species', name: '物种分布', type: 'point', checked: true, opacity: 0.7, visible: true },
    { id: 'facilities', name: '基础设施', type: 'point', checked: false, opacity: 1, visible: false },
    { id: 'water', name: '水系分布', type: 'line', checked: false, opacity: 0.9, visible: false },
    { id: 'village', name: '社区分布', type: 'polygon', checked: false, opacity: 0.5, visible: false },
    { id: 'elevation', name: '高程数据', type: 'raster', checked: false, opacity: 0.7, visible: false },
    { id: 'landuse', name: '土地利用', type: 'raster', checked: false, opacity: 0.6, visible: false },
  ]);

  const [overlayResults, setOverlayResults] = useState<OverlayResult[]>([
    {
      id: 'OR001',
      name: '物种-区划叠加分析',
      inputLayers: ['物种分布', '功能区划'],
      operation: '相交',
      resultArea: 125.6,
      overlapArea: 45.2,
      overlapRate: 36.0,
      createTime: '2024-01-15 14:30',
    },
    {
      id: 'OR002',
      name: '设施-边界叠加分析',
      inputLayers: ['基础设施', '保护区边界'],
      operation: '包含',
      resultArea: 28.4,
      overlapArea: 18.6,
      overlapRate: 65.5,
      createTime: '2024-01-14 10:15',
    },
    {
      id: 'OR003',
      name: '水系-区划叠加分析',
      inputLayers: ['水系分布', '功能区划'],
      operation: '相交',
      resultArea: 89.3,
      overlapArea: 67.8,
      overlapRate: 75.9,
      createTime: '2024-01-13 16:45',
    },
  ]);

  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<OverlayResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const [form] = Form.useForm();

  // 操作类型
  const operationOptions = [
    { value: 'intersect', label: '相交(Intersect)' },
    { value: 'union', label: '合并(Union)' },
    { value: 'erase', label: '擦除(Erase)' },
    { value: 'identity', label: '标识(Identity)' },
    { value: 'symdiff', label: '对称差(Symmetrical Difference)' },
  ];

  // 处理图层选择
  const handleLayerCheck = (layerId: string, checked: boolean) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, checked, visible: checked } : layer
      )
    );
  };

  // 执行叠加分析
  const handleRunAnalysis = () => {
    const checkedLayers = layers.filter(l => l.checked);
    if (checkedLayers.length < 2) {
      message.warning('请至少选择2个图层进行叠加分析');
      return;
    }

    const values = form.getFieldsValue();
    if (!values.outputName) {
      message.warning('请输入输出图层名称');
      return;
    }

    setAnalysisModalVisible(true);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // 模拟分析进度
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          generateAnalysisResult(values.outputName, checkedLayers.map(l => l.name), values.operation);
          return 100;
        }
        return prev + 8;
      });
    }, 400);
  };

  // 生成分析结果
  const generateAnalysisResult = (name: string, inputLayers: string[], operation: string) => {
    const result: OverlayResult = {
      id: `OR${String(overlayResults.length + 1).padStart(3, '0')}`,
      name,
      inputLayers,
      operation: operationOptions.find(o => o.value === operation)?.label || operation,
      resultArea: parseFloat((Math.random() * 150 + 20).toFixed(2)),
      overlapArea: 0,
      overlapRate: 0,
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    result.overlapArea = parseFloat((result.resultArea * (Math.random() * 0.5 + 0.2)).toFixed(2));
    result.overlapRate = parseFloat(((result.overlapArea / result.resultArea) * 100).toFixed(1));

    setOverlayResults(prev => [result, ...prev]);
    setSelectedResult(result);

    setTimeout(() => {
      setAnalysisModalVisible(false);
      setResultModalVisible(true);
    }, 500);
  };

  // 保存分析结果
  const handleSaveResult = () => {
    message.success('分析结果已保存');
  };

  // 导出分析报告
  const handleExportReport = () => {
    message.success('分析报告已导出');
  };

  // 清除分析结果
  const handleClearResults = () => {
    setOverlayResults([]);
    message.info('历史结果已清除');
  };

  // 结果表格列
  const resultColumns: ColumnsType<OverlayResult> = [
    {
      title: '结果名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <Avatar
            size="small"
            style={{
              background: record.operation === '相交' ? '#1890ff' :
                         record.operation === '合并' ? '#52c41a' :
                         record.operation === '擦除' ? '#ff4d4f' : '#722ed1',
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '输入图层',
      dataIndex: 'inputLayers',
      key: 'inputLayers',
      render: (layers: string[]) => (
        <Space wrap>
          {layers.map(l => (
            <Tag key={l} color="blue">{l}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '运算类型',
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      render: (op: string) => <Tag color="purple">{op}</Tag>,
    },
    {
      title: '结果面积(km²)',
      dataIndex: 'resultArea',
      key: 'resultArea',
      width: 130,
      render: (area: number) => area.toFixed(2),
    },
    {
      title: '重叠面积(km²)',
      dataIndex: 'overlapArea',
      key: 'overlapArea',
      width: 130,
      render: (area: number) => area.toFixed(2),
    },
    {
      title: '重叠率',
      dataIndex: 'overlapRate',
      key: 'overlapRate',
      width: 100,
      render: (rate: number) => (
        <span style={{ color: rate > 50 ? '#ff4d4f' : rate > 20 ? '#faad14' : '#52c41a', fontWeight: 600 }}>
          {rate.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => {
            setSelectedResult(record);
            setResultModalVisible(true);
          }}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => message.info('可视化展示')}>
            可视化
          </Button>
        </Space>
      ),
    },
  ];

  // 已选图层统计
  const selectedLayerCount = layers.filter(l => l.checked).length;

  // 叠加分析统计图配置
  const overlayStatsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['结果面积', '重叠面积'],
      top: '5%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: overlayResults.slice(0, 5).map(r => r.name),
      axisLabel: { rotate: 15, fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        name: '面积(km²)',
        axisLabel: { color: '#666' },
      },
    ],
    series: [
      {
        name: '结果面积',
        type: 'bar',
        data: overlayResults.slice(0, 5).map(r => r.resultArea),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '重叠面积',
        type: 'bar',
        data: overlayResults.slice(0, 5).map(r => r.overlapArea),
        itemStyle: { color: '#52c41a' },
      },
    ],
  };

  // 重叠率统计图配置
  const overlapRateOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 11,
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        data: overlayResults.slice(0, 4).map((r, i) => ({
          value: r.overlapRate,
          name: r.name.substring(0, 6),
          itemStyle: {
            color: ['#1890ff', '#52c41a', '#faad14', '#722ed1'][i % 4],
          },
        })),
      },
    ],
  };

  return (
    <div className="overlay-analysis fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">叠加分析</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            form.resetFields();
            setAnalysisModalVisible(true);
          }}>
            新建分析
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExportReport}>
            导出报告
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleClearResults}>
            清除历史
          </Button>
        </div>
      </div>

      {/* 分析参数设置 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ApartmentOutlined style={{ color: '#1890ff' }} />
            <span>叠加分析配置</span>
          </div>
        }
        extra={
          <span style={{ color: '#666', fontSize: 13 }}>
            已选择 {selectedLayerCount} 个图层
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[24, 16]}>
          <Col span={16}>
            <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>选择参与叠加分析的图层：</div>
            <Row gutter={[12, 12]}>
              {layers.map(layer => (
                <Col span={6} key={layer.id}>
                  <Card
                    size="small"
                    style={{
                      borderColor: layer.checked ? '#1890ff' : '#d9d9d9',
                      background: layer.checked ? 'rgba(24, 144, 255, 0.05)' : '#fafafa',
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Checkbox
                        checked={layer.checked}
                        onChange={(e) => handleLayerCheck(layer.id, e.target.checked)}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{layer.name}</div>
                        <Tag style={{ fontSize: 10, marginTop: 4 }}>{layer.type}</Tag>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>运算类型</div>
                <Select defaultValue="intersect" style={{ width: '100%' }}>
                  {operationOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>输出设置</div>
                <Select defaultValue="shp" style={{ width: '100%' }}>
                  <Select.Option value="shp">Shapefile</Select.Option>
                  <Select.Option value="gdb">GeoDatabase</Select.Option>
                  <Select.Option value="json">GeoJSON</Select.Option>
                </Select>
              </div>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                block
                onClick={() => {
                  form.resetFields();
                  setAnalysisModalVisible(true);
                }}
              >
                执行分析
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 分析结果展示 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: (
              <span>
                <PieChartOutlined />
                分析结果
              </span>
            ),
            children: (
              <Card>
                <Table
                  columns={resultColumns}
                  dataSource={overlayResults}
                  rowKey="id"
                  pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                />
              </Card>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <BarChartOutlined />
                统计分析
              </span>
            ),
            children: (
              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <Card title="叠加分析面积统计">
                    <ReactECharts option={overlayStatsOption} style={{ height: 300 }} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="重叠率分布">
                    <ReactECharts option={overlapRateOption} style={{ height: 300 }} />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            label: (
              <span>
                <LineChartOutlined />
                历史记录
              </span>
            ),
            children: (
              <Card>
                <List
                  dataSource={overlayResults}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button key="detail" type="link" onClick={() => {
                          setSelectedResult(item);
                          setResultModalVisible(true);
                        }}>详情</Button>,
                        <Button key="export" type="link">导出</Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              background: '#1890ff',
                            }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                        }
                        title={item.name}
                        description={
                          <Space>
                            <Tag>{item.operation}</Tag>
                            <span style={{ color: '#999', fontSize: 12 }}>
                              {item.createTime}
                            </span>
                          </Space>
                        }
                      />
                      <div>
                        <div style={{ fontSize: 13, color: '#666' }}>
                          重叠率: <span style={{ color: '#1890ff', fontWeight: 600 }}>{item.overlapRate}%</span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty description="暂无历史记录" /> }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* 新建分析弹窗 */}
      <Modal
        title="新建叠加分析"
        open={analysisModalVisible}
        onCancel={() => setAnalysisModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="layer1"
            label="第一图层"
            rules={[{ required: true, message: '请选择第一图层' }]}
          >
            <Select placeholder="请选择第一图层">
              {layers.filter(l => l.type !== 'raster').map(l => (
                <Select.Option key={l.id} value={l.id}>{l.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="layer2"
            label="第二图层"
            rules={[{ required: true, message: '请选择第二图层' }]}
          >
            <Select placeholder="请选择第二图层">
              {layers.filter(l => l.type !== 'raster').map(l => (
                <Select.Option key={l.id} value={l.id}>{l.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="operation"
            label="运算类型"
            initialValue="intersect"
            rules={[{ required: true, message: '请选择运算类型' }]}
          >
            <Select placeholder="请选择运算类型">
              {operationOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="outputName"
            label="输出图层名称"
            rules={[{ required: true, message: '请输入输出图层名称' }]}
          >
            <Input placeholder="请输入输出图层名称" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setAnalysisModalVisible(false)}>取消</Button>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? '分析中...' : '执行分析'}
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 分析进度 */}
        {isAnalyzing && (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <Progress percent={analysisProgress} status="active" />
            <div style={{ marginTop: 8, color: '#666' }}>
              正在进行叠加分析，请稍候...
            </div>
          </div>
        )}
      </Modal>

      {/* 结果详情弹窗 */}
      <Modal
        title="叠加分析结果详情"
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setResultModalVisible(false)}>关闭</Button>
            <Button type="primary" onClick={handleSaveResult}>
              保存结果
            </Button>
          </Space>
        }
        width={700}
      >
        {selectedResult && (
          <div>
            <Card size="small" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="结果面积"
                    value={selectedResult.resultArea}
                    suffix="km²"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="重叠面积"
                    value={selectedResult.overlapArea}
                    suffix="km²"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="重叠率"
                    value={selectedResult.overlapRate}
                    suffix="%"
                    valueStyle={{ color: selectedResult.overlapRate > 50 ? '#ff4d4f' : '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="运算类型"
                    value={selectedResult.operation}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
              </Row>
            </Card>

            <Divider>输入图层</Divider>
            <Space wrap>
              {selectedResult.inputLayers.map(l => (
                <Tag key={l} color="blue" style={{ padding: '4px 12px' }}>{l}</Tag>
              ))}
            </Space>

            <Divider>结果可视化</Divider>
            <div style={{
              height: 250,
              background: '#f5f5f5',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <svg width="90%" height="90%" viewBox="0 0 400 250">
                {/* 模拟叠加效果 */}
                <rect x="50" y="50" width="150" height="150" fill="rgba(24,144,255,0.3)" stroke="#1890ff" strokeWidth="2" />
                <rect x="150" y="80" width="150" height="150" fill="rgba(82,196,26,0.3)" stroke="#52c41a" strokeWidth="2" />
                {/* 重叠区域 */}
                <rect x="150" y="80" width="50" height="50" fill="rgba(255,77,79,0.5)" stroke="#ff4d4f" strokeWidth="2" />
                {/* 图例 */}
                <rect x="320" y="30" width="15" height="15" fill="rgba(24,144,255,0.3)" stroke="#1890ff" />
                <text x="340" y="42" fontSize="10" fill="#333">第一图层</text>
                <rect x="320" y="55" width="15" height="15" fill="rgba(82,196,26,0.3)" stroke="#52c41a" />
                <text x="340" y="67" fontSize="10" fill="#333">第二图层</text>
                <rect x="320" y="80" width="15" height="15" fill="rgba(255,77,79,0.5)" stroke="#ff4d4f" />
                <text x="340" y="92" fontSize="10" fill="#333">重叠区域</text>
              </svg>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <Button icon={<CheckCircleOutlined />} style={{ flex: 1 }}>
                导出矢量结果
              </Button>
              <Button icon={<InfoCircleOutlined />} style={{ flex: 1 }}>
                导出统计报告
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OverlayAnalysis;
