import React, { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Select,
  Input,
  Modal,
  Descriptions,
  Tabs,
  Avatar,
  Statistic,
  Progress,
  Badge,
  Timeline,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BookOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { speciesList, speciesDistributionData } from '@/mock';
import type { Species } from '@/types';

const { Option } = Select;
const { Search } = Input;

const SpeciesArchive: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  // 分类筛选选项
  const categoryOptions = [
    { value: 'all', label: '全部分类' },
    { value: '两栖纲', label: '两栖纲' },
    { value: '鱼纲', label: '鱼纲' },
    { value: '哺乳纲', label: '哺乳纲' },
    { value: '鸟纲', label: '鸟纲' },
  ];

  // 保护级别筛选
  const levelOptions = [
    { value: 'all', label: '全部级别' },
    { value: '1', label: '一级保护' },
    { value: '2', label: '二级保护' },
    { value: '3', label: '三级保护' },
  ];

  // 受威胁状态筛选
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'critically_endangered', label: '极危' },
    { value: 'endangered', label: '濒危' },
    { value: 'vulnerable', label: '易危' },
    { value: 'near_threatened', label: '近危' },
    { value: 'least_concern', label: '无危' },
  ];

  // 过滤后的物种数据
  const filteredSpecies = speciesList.filter(species => {
    const matchCategory = categoryFilter === 'all' || species.category.includes(categoryFilter);
    const matchLevel = levelFilter === 'all' || species.protectionLevel === levelFilter;
    const matchStatus = statusFilter === 'all' || species.status === statusFilter;
    const matchSearch = searchText === '' ||
      species.name.toLowerCase().includes(searchText.toLowerCase()) ||
      species.latinName.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchLevel && matchStatus && matchSearch;
  });

  // 保护级别映射
  const getProtectionLevel = (level: string) => {
    const map: Record<string, { color: string; text: string }> = {
      '1': { color: 'red', text: '一级' },
      '2': { color: 'orange', text: '二级' },
      '3': { color: 'gold', text: '三级' },
    };
    return map[level] || { color: 'default', text: level };
  };

  // 受威胁状态映射
  const getStatusInfo = (status: string) => {
    const map: Record<string, { color: string; text: string; iucn: string }> = {
      critically_endangered: { color: 'red', text: '极危', iucn: 'CR' },
      endangered: { color: 'orange', text: '濒危', iucn: 'EN' },
      vulnerable: { color: 'gold', text: '易危', iucn: 'VU' },
      near_threatened: { color: 'lime', text: '近危', iucn: 'NT' },
      least_concern: { color: 'green', text: '无危', iucn: 'LC' },
    };
    return map[status] || { color: 'default', text: status, iucn: '' };
  };

  // 表格列定义
  const columns: ColumnsType<Species> = [
    {
      title: '物种名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>
            {record.latinName}
          </div>
        </div>
      ),
    },
    {
      title: '分类信息',
      dataIndex: 'category',
      key: 'category',
      width: 180,
    },
    {
      title: '保护级别',
      dataIndex: 'protectionLevel',
      key: 'protectionLevel',
      width: 100,
      render: (level) => {
        const { color, text } = getProtectionLevel(level);
        return <Tag color={color}>{text}保护</Tag>;
      },
    },
    {
      title: ' IUCN 状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const { color, text, iucn } = getStatusInfo(status);
        return (
          <Tag color={color}>
            {iucn} {text}
          </Tag>
        );
      },
    },
    {
      title: '分布地点',
      dataIndex: 'distribution',
      key: 'distribution',
      render: (_, record) => {
        const dist = speciesDistributionData.find(d => d.name === record.name);
        return dist?.location || '待定';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedSpecies(record);
            setDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 物种分布饼图配置
  const distributionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data: speciesDistributionData.map((item, index) => ({
          value: item.count,
          name: item.name,
          itemStyle: {
            color: ['#2D7D46', '#1B5E8C', '#ff4d4f', '#faad14', '#722ed1'][index % 5],
          },
        })),
      },
    ],
  };

  // 保护级别统计
  const levelStats = [
    { level: '一级', count: speciesList.filter(s => s.protectionLevel === '1').length, color: '#ff4d4f' },
    { level: '二级', count: speciesList.filter(s => s.protectionLevel === '2').length, color: '#faad14' },
    { level: '三级', count: speciesList.filter(s => s.protectionLevel === '3').length, color: '#52c41a' },
  ];

  return (
    <div className="species-archive fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <BookOutlined style={{ marginRight: 8 }} />
            物种档案
          </h1>
          <p className="page-subtitle">保护区重点保护物种信息管理与查询</p>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />}>
            新增物种
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="物种总数"
              value={speciesList.length}
              prefix={<SafetyOutlined style={{ color: '#2D7D46' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="一级保护"
              value={levelStats[0].count}
              prefix={<SafetyOutlined style={{ color: levelStats[0].color }} />}
              valueStyle={{ color: levelStats[0].color }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="二级保护"
              value={levelStats[1].count}
              prefix={<SafetyOutlined style={{ color: levelStats[1].color }} />}
              valueStyle={{ color: levelStats[1].color }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="极危物种"
              value={speciesList.filter(s => s.status === 'critically_endangered').length}
              prefix={<SafetyOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧列表区域 */}
        <Col xs={24} lg={16}>
          <Card
            title="物种列表"
            extra={
              <Space>
                <Search
                  placeholder="搜索物种名称或学名"
                  allowClear
                  style={{ width: 200 }}
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Space>
            }
          >
            {/* 筛选器 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 140 }}
                suffixIcon={<FilterOutlined />}
              >
                {categoryOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <Select
                value={levelFilter}
                onChange={setLevelFilter}
                style={{ width: 120 }}
              >
                {levelOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 140 }}
              >
                {statusOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <Button icon={<CloseOutlined />} onClick={() => {
                setCategoryFilter('all');
                setLevelFilter('all');
                setStatusFilter('all');
                setSearchText('');
              }}>
                重置
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={filteredSpecies}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              size="middle"
              rowClassName={(record) => 
                record.status === 'critically_endangered' ? 'danger-row' : ''
              }
            />
          </Card>
        </Col>

        {/* 右侧统计区域 */}
        <Col xs={24} lg={8}>
          <Card title="物种分布统计" style={{ marginBottom: 16 }}>
            <ReactECharts option={distributionOption} style={{ height: 280 }} />
          </Card>

          <Card title="保护级别构成">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {levelStats.map((stat, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: stat.color, fontWeight: 500 }}>
                      <SafetyOutlined style={{ marginRight: 4 }} />
                      {stat.level}保护
                    </span>
                    <span style={{ fontWeight: 600 }}>{stat.count} 种</span>
                  </div>
                  <Progress
                    percent={(stat.count / speciesList.length) * 100}
                    showInfo={false}
                    strokeColor={stat.color}
                    trailColor="#f0f0f0"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 物种详情弹窗 */}
      <Modal
        title={null}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
        closable={false}
        style={{ top: 20 }}
      >
        {selectedSpecies && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 24,
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #2D7D46 0%, #1B5E8C 100%)',
              borderRadius: 8,
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar size={64} style={{ background: '#fff', color: '#2D7D46', fontSize: 28 }}>
                  {selectedSpecies.name.charAt(0)}
                </Avatar>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{selectedSpecies.name}</h2>
                  <div style={{ fontSize: 14, opacity: 0.9, fontStyle: 'italic' }}>
                    {selectedSpecies.latinName}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <Tag color="red">一级保护</Tag>
                    <Tag color="red">CR 极危</Tag>
                  </div>
                </div>
              </div>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={() => setDetailVisible(false)}
                style={{ color: '#fff' }}
              />
            </div>

            <Tabs
              items={[
                {
                  key: 'basic',
                  label: '基本信息',
                  children: (
                    <Descriptions column={2} bordered size="small">
                      <Descriptions.Item label="分类">{selectedSpecies.category}</Descriptions.Item>
                      <Descriptions.Item label="保护级别">
                        <Tag color="red">国家一级重点保护</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label=" IUCN 濒危等级" span={2}>
                        <Tag color="red">CR - 极危</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="分布区域" span={2}>
                        诺水河核心保护区
                      </Descriptions.Item>
                      <Descriptions.Item label="物种描述" span={2}>
                        {selectedSpecies.description}
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                },
                {
                  key: 'population',
                  label: '种群信息',
                  children: (
                    <div>
                      <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic title="估计数量" value="约 50 尾" />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic title="种群趋势" value="稳定" valueStyle={{ color: '#52c41a' }} />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic title="分布面积" value="15 km²" />
                          </Card>
                        </Col>
                      </Row>
                      <Card size="small" title="近年监测数据">
                        <Timeline
                          items={[
                            { color: 'green', children: '2024年: 记录到繁殖活动，新增幼鲵个体' },
                            { color: 'blue', children: '2023年: 种群数量保持稳定' },
                            { color: 'blue', children: '2022年: 发现新的栖息地' },
                          ]}
                        />
                      </Card>
                    </div>
                  ),
                },
                {
                  key: 'habitat',
                  label: '栖息地',
                  children: (
                    <div>
                      <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="栖息地类型">清澈溪流、溶洞</Descriptions.Item>
                        <Descriptions.Item label="水质要求">pH 6.5-7.5，溶氧量 {'>'} 6mg/L</Descriptions.Item>
                        <Descriptions.Item label="水温范围">12-22°C</Descriptions.Item>
                        <Descriptions.Item label="食物来源">溪流鱼虾、昆虫幼虫</Descriptions.Item>
                        <Descriptions.Item label="威胁因素">水污染、非法捕猎、栖息地破坏</Descriptions.Item>
                      </Descriptions>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SpeciesArchive;