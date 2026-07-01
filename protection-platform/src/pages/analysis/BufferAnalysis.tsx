import React, { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Input,
  InputNumber,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Divider,
  message,
  Progress,
 Statistic,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ExperimentOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  ExportOutlined,
  ClearOutlined,
  MapPinOutlined,
  SyncOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { facilitiesData, administrativeZones, speciesList } from '@/mock';

interface BufferFeature {
  id: string;
  name: string;
  type: string;
  location: string;
  distance: number;
  affectedArea: number;
  impactLevel: string;
}

interface AnalysisResult {
  featureId: string;
  featureName: string;
  bufferRadius: number;
  totalArea: number;
  coreArea: number;
  bufferArea: number;
  experimentalArea: number;
  affectedFacilities: number;
  affectedPopulation: number;
  speciesImpact: string[];
}

const BufferAnalysis: React.FC = () => {
  const [bufferFeatures, setBufferFeatures] = useState<BufferFeature[]>([
    {
      id: 'F001',
      name: '空山管护站',
      type: '管护站',
      location: '空山乡',
      distance: 500,
      affectedArea: 0.78,
      impactLevel: '低',
    },
    {
      id: 'F002',
      name: '涪阳管护站',
      type: '管护站',
      location: '涪阳镇',
      distance: 800,
      affectedArea: 2.01,
      impactLevel: '中',
    },
    {
      id: 'F003',
      name: '诺江管护站',
      type: '管护站',
      location: '诺江镇',
      distance: 1000,
      affectedArea: 3.14,
      impactLevel: '高',
    },
  ]);

  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [bufferRadius, setBufferRadius] = useState<number>(500);
  const [bufferUnit, setBufferUnit] = useState<string>('m');
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [form] = Form.useForm();

  // 缓冲区分析参数配置
  const bufferParams = [
    {
      key: 'radius',
      label: '缓冲半径',
      value: bufferRadius,
      onChange: setBufferRadius,
      min: 100,
      max: 5000,
      step: 100,
      unit: bufferUnit,
    },
  ];

  // 特征类型选择
  const featureTypeOptions = [
    { value: 'all', label: '全部' },
    { value: 'facility', label: '基础设施' },
    { value: 'species', label: '物种分布' },
    { value: 'village', label: '社区村落' },
    { value: 'water', label: '水系' },
  ];

  // 执行缓冲区分析
  const handleRunAnalysis = () => {
    if (selectedFeatures.length === 0) {
      message.warning('请选择要分析的地物');
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
          generateAnalysisResults();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // 生成分析结果
  const generateAnalysisResults = () => {
    const results: AnalysisResult[] = selectedFeatures.map((featureId, index) => {
      const feature = bufferFeatures.find(f => f.id === featureId);
      const radius = bufferRadius * (bufferUnit === 'km' ? 1000 : 1);
      const area = Math.PI * Math.pow(radius / 1000, 2);

      return {
        featureId,
        featureName: feature?.name || `地物${index + 1}`,
        bufferRadius: bufferRadius,
        totalArea: parseFloat((area * (1 + Math.random() * 0.5)).toFixed(2)),
        coreArea: parseFloat((area * 0.2 * Math.random()).toFixed(2)),
        bufferArea: parseFloat((area * 0.5 * Math.random()).toFixed(2)),
        experimentalArea: parseFloat((area * 0.3 * Math.random()).toFixed(2)),
        affectedFacilities: Math.floor(Math.random() * 5) + 1,
        affectedPopulation: Math.floor(Math.random() * 5000) + 1000,
        speciesImpact: speciesList.slice(0, Math.floor(Math.random() * 3) + 1).map(s => s.name),
      };
    });

    setAnalysisResults(results);
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
    setAnalysisResults([]);
    setSelectedFeatures([]);
    message.info('分析结果已清除');
  };

  // 表格列定义
  const columns: ColumnsType<BufferFeature> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '地物名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <MapPinOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '当前缓冲距离',
      dataIndex: 'distance',
      key: 'distance',
      width: 130,
      render: (distance: number) => `${distance}m`,
    },
    {
      title: '影响面积(km²)',
      dataIndex: 'affectedArea',
      key: 'affectedArea',
      width: 130,
      render: (area: number) => area.toFixed(2),
    },
    {
      title: '影响等级',
      dataIndex: 'impactLevel',
      key: 'impactLevel',
      width: 100,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          '低': 'green',
          '中': 'orange',
          '高': 'red',
        };
        return <Tag color={colorMap[level] || 'default'}>{level}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => {
            setSelectedResult({
              featureId: record.id,
              featureName: record.name,
              bufferRadius: record.distance,
              totalArea: record.affectedArea,
              coreArea: record.affectedArea * 0.2,
              bufferArea: record.affectedArea * 0.5,
              experimentalArea: record.affectedArea * 0.3,
              affectedFacilities: 3,
              affectedPopulation: 2500,
              speciesImpact: ['大鲵', '岩原鲤'],
            });
            setResultModalVisible(true);
          }}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 结果表格列
  const resultColumns: ColumnsType<AnalysisResult> = [
    {
      title: '地物名称',
      dataIndex: 'featureName',
      key: 'featureName',
    },
    {
      title: '缓冲半径',
      dataIndex: 'bufferRadius',
      key: 'bufferRadius',
      render: (radius: number) => `${radius}m`,
    },
    {
      title: '总面积(km²)',
      dataIndex: 'totalArea',
      key: 'totalArea',
      render: (area: number) => area.toFixed(2),
    },
    {
      title: '影响设施数',
      dataIndex: 'affectedFacilities',
      key: 'affectedFacilities',
    },
    {
      title: '影响人口',
      dataIndex: 'affectedPopulation',
      key: 'affectedPopulation',
      render: (pop: number) => pop.toLocaleString(),
    },
    {
      title: '影响物种',
      dataIndex: 'speciesImpact',
      key: 'speciesImpact',
      render: (species: string[]) => (
        <Space wrap>
          {species.map(s => (
            <Tag key={s} color="green">{s}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  // 区域分布饼图配置
  const areaDistributionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} km² ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        data: [
          { value: 0.8, name: '核心区', itemStyle: { color: '#ff4d4f' } },
          { value: 2.5, name: '缓冲区', itemStyle: { color: '#faad14' } },
          { value: 1.2, name: '实验区', itemStyle: { color: '#52c41a' } },
        ],
      },
    ],
  };

  // 影响分析柱状图配置
  const impactAnalysisOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['影响面积', '影响人口'],
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
      data: bufferFeatures.map(f => f.name),
      axisLabel: { rotate: 15 },
    },
    yAxis: [
      {
        type: 'value',
        name: '面积(km²)',
        axisLabel: { color: '#666' },
      },
      {
        type: 'value',
        name: '人口',
        axisLabel: { color: '#666' },
      },
    ],
    series: [
      {
        name: '影响面积',
        type: 'bar',
        data: bufferFeatures.map(f => f.affectedArea),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '影响人口',
        type: 'bar',
        yAxisIndex: 1,
        data: [1200, 2500, 4200],
        itemStyle: { color: '#722ed1' },
      },
    ],
  };

  return (
    <div className="buffer-analysis fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">缓冲区分析</h1>
        </div>
        <div className="page-header-actions">
          <Button icon={<SaveOutlined />} onClick={handleSaveResult}>
            保存
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExportReport}>
            导出报告
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleClearResults}>
            清除
          </Button>
        </div>
      </div>

      {/* 分析参数设置 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ExperimentOutlined style={{ color: '#1890ff' }} />
                <span>分析参数设置</span>
              </div>
            }
          >
            <Row gutter={[24, 16]} align="middle">
              <Col span={4}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>地物类型筛选</div>
                <Select defaultValue="all" style={{ width: '100%' }}>
                  {featureTypeOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={4}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>搜索地物</div>
                <Input placeholder="输入地物名称搜索" prefix={<MapPinOutlined />} />
              </Col>
              <Col span={6}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>缓冲半径设置</div>
                <Space>
                  <InputNumber
                    min={100}
                    max={5000}
                    value={bufferRadius}
                    onChange={(val) => setBufferRadius(val || 500)}
                    style={{ width: 120 }}
                  />
                  <Select
                    value={bufferUnit}
                    onChange={setBufferUnit}
                    style={{ width: 80 }}
                  >
                    <Select.Option value="m">米(m)</Select.Option>
                    <Select.Option value="km">公里(km)</Select.Option>
                  </Select>
                </Space>
              </Col>
              <Col span={4}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>分析模式</div>
                <Select defaultValue="intersect" style={{ width: '100%' }}>
                  <Select.Option value="intersect">相交分析</Select.Option>
                  <Select.Option value="contain">包含分析</Select.Option>
                  <Select.Option value="adjacent">邻接分析</Select.Option>
                </Select>
              </Col>
              <Col span={6}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>快速操作</div>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={handleRunAnalysis}
                  >
                    执行分析
                  </Button>
                  <Button icon={<SyncOutlined />}>
                    重置参数
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 分析结果展示 */}
      <Row gutter={[16, 16]}>
        {/* 地物列表 */}
        <Col span={14}>
          <Card
            title="缓冲区分析地物列表"
            extra={
              <span style={{ color: '#666', fontSize: 13 }}>
                已选择 {selectedFeatures.length} 个地物
              </span>
            }
          >
            <Table
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedFeatures,
                onChange: (keys) => setSelectedFeatures(keys as string[]),
              }}
              columns={columns}
              dataSource={bufferFeatures}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: true }}
              size="small"
            />
          </Card>
        </Col>

        {/* 统计分析图表 */}
        <Col span={10}>
          <Card
            title="影响分析统计"
            style={{ marginBottom: 16 }}
          >
            <ReactECharts option={impactAnalysisOption} style={{ height: 280 }} />
          </Card>
          <Card
            title="区域面积分布"
          >
            <ReactECharts option={areaDistributionOption} style={{ height: 220 }} />
          </Card>
        </Col>
      </Row>

      {/* 分析历史记录 */}
      <Card title="最近分析记录" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Statistic
              title="分析次数"
              value={156}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="覆盖地物"
              value={89}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均缓冲半径"
              value={650}
              suffix="m"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="累计分析面积"
              value={1256}
              suffix="km²"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 分析进度弹窗 */}
      <Modal
        title="缓冲区分析执行中"
        open={analysisModalVisible}
        footer={null}
        closable={false}
        width={400}
      >
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Progress
            type="circle"
            percent={analysisProgress}
            status="active"
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#52c41a',
            }}
          />
          <div style={{ marginTop: 20, color: '#666' }}>
            {isAnalyzing ? '正在计算缓冲区范围...' : '分析完成，正在生成报告...'}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
            已处理 {selectedFeatures.length} 个地物
          </div>
        </div>
      </Modal>

      {/* 分析结果详情弹窗 */}
      <Modal
        title="缓冲区分析结果详情"
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setResultModalVisible(false)}>关闭</Button>
            <Button type="primary" onClick={handleExportReport}>
              导出报告
            </Button>
          </Space>
        }
        width={700}
      >
        {selectedResult && (
          <div>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="分析地物" span={2}>
                <Space>
                  <MapPinOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontWeight: 600 }}>{selectedResult.featureName}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="缓冲半径">
                {selectedResult.bufferRadius}m
              </Descriptions.Item>
              <Descriptions.Item label="总面积">
                {selectedResult.totalArea.toFixed(2)} km²
              </Descriptions.Item>
              <Descriptions.Item label="核心区面积">
                {selectedResult.coreArea.toFixed(2)} km²
              </Descriptions.Item>
              <Descriptions.Item label="缓冲区面积">
                {selectedResult.bufferArea.toFixed(2)} km²
              </Descriptions.Item>
              <Descriptions.Item label="实验区面积">
                {selectedResult.experimentalArea.toFixed(2)} km²
              </Descriptions.Item>
              <Descriptions.Item label="影响设施数">
                {selectedResult.affectedFacilities} 个
              </Descriptions.Item>
              <Descriptions.Item label="影响人口">
                {selectedResult.affectedPopulation.toLocaleString()} 人
              </Descriptions.Item>
              <Descriptions.Item label="影响物种" span={2}>
                <Space wrap>
                  {selectedResult.speciesImpact.map(s => (
                    <Tag key={s} color="green">{s}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider>影响范围可视化</Divider>
            <div style={{
              height: 200,
              background: '#f5f5f5',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                {/* 核心区 */}
                <circle cx="200" cy="100" r="30" fill="rgba(255,77,79,0.3)" stroke="#ff4d4f" strokeWidth="2" />
                <text x="200" y="105" textAnchor="middle" fill="#c62828" fontSize="10">核心区</text>
                {/* 缓冲区 */}
                <circle cx="200" cy="100" r="60" fill="none" stroke="#faad14" strokeWidth="2" strokeDasharray="5,3" />
                <text x="200" y="170" textAnchor="middle" fill="#f57f17" fontSize="10">缓冲区</text>
                {/* 实验区 */}
                <circle cx="200" cy="100" r="90" fill="none" stroke="#52c41a" strokeWidth="2" strokeDasharray="3,5" />
                <text x="280" y="100" textAnchor="middle" fill="#2e7d32" fontSize="10">实验区</text>
                {/* 中心点 */}
                <circle cx="200" cy="100" r="8" fill="#1890ff" />
                <text x="200" y="55" textAnchor="middle" fill="#1890ff" fontSize="10">分析地物</text>
              </svg>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BufferAnalysis;
