import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Statistic,
  Progress,
  Image,
  Divider,
  List,
  Avatar,
} from 'antd';
import {
  EnvironmentOutlined,
  BankOutlined,
  GlobalOutlined,
  FileTextOutlined,
  EditOutlined,
  SaveOutlined,
  ProjectOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { reserveInfo, speciesList, patrolPersonnel, administrativeZones } from '@/mock';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

const ReserveProfile: React.FC = () => {
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedTab, setSelectedTab] = useState('basic');

  const levelMap: Record<string, { color: string; text: string }> = {
    national: { color: 'red', text: '国家级' },
    provincial: { color: 'orange', text: '省级' },
    municipal: { color: 'blue', text: '市级' },
  };

  const statsData = [
    { title: '总面积', value: reserveInfo.area, suffix: 'hm²', icon: <GlobalOutlined />, color: '#1890ff' },
    { title: '物种数量', value: speciesList.length, suffix: '种', icon: <ProjectOutlined />, color: '#52c41a' },
    { title: '巡护人员', value: patrolPersonnel.length, suffix: '人', icon: <TeamOutlined />, color: '#722ed1' },
    { title: '行政区划', value: administrativeZones.length, suffix: '个', icon: <BankOutlined />, color: '#faad14' },
  ];

  const zoningData = [
    { name: '核心区', area: 8500, percent: 31.4, color: '#ff4d4f' },
    { name: '缓冲区', area: 6800, percent: 25.1, color: '#faad14' },
    { name: '实验区', area: 11800, percent: 43.5, color: '#52c41a' },
  ];

  const areaTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['2018', '2019', '2020', '2021', '2022', '2023'],
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      name: '面积(hm²)',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [{
      data: [26800, 26900, 27000, 27050, 27100, 27100],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(24,144,255,0.3)' },
          { offset: 1, color: 'rgba(24,144,255,0)' },
        ]),
      },
      lineStyle: { color: '#1890ff', width: 2 },
      itemStyle: { color: '#1890ff' },
    }],
  };

  const protectionLevelOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 2, name: '一级保护', itemStyle: { color: '#ff4d4f' } },
        { value: 3, name: '二级保护', itemStyle: { color: '#faad14' } },
      ],
    }],
  };

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <div>
          <Card title="保护区概况" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="保护区名称" span={2}>
                {reserveInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="保护区级别">
                <Tag color={levelMap[reserveInfo.level].color}>
                  {levelMap[reserveInfo.level].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="总面积">
                {reserveInfo.area.toLocaleString()} hm²
              </Descriptions.Item>
              <Descriptions.Item label="建立日期">
                {reserveInfo.establishedDate}
              </Descriptions.Item>
              <Descriptions.Item label="地理位置">
                {reserveInfo.location}
              </Descriptions.Item>
              <Descriptions.Item label="主要保护对象" span={2}>
                {reserveInfo.description}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Image
                width="100%"
                height={300}
                src="https://via.placeholder.com/800x300?text=Reserve+Map"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                style={{ borderRadius: 8 }}
              />
            </div>
          </Card>

          <Card title="功能区划">
            <Row gutter={[16, 16]}>
              {zoningData.map((zone, index) => (
                <Col span={8} key={index}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic
                      title={<span style={{ color: zone.color, fontWeight: 600 }}>{zone.name}</span>}
                      value={zone.area}
                      suffix="hm²"
                      valueStyle={{ color: zone.color }}
                    />
                    <Progress
                      percent={zone.percent}
                      strokeColor={zone.color}
                      showInfo={false}
                      style={{ marginTop: 8 }}
                    />
                    <div style={{ marginTop: 8, color: '#666' }}>
                      占比 {zone.percent}%
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      ),
    },
    {
      key: 'species',
      label: '保护物种',
      children: (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={speciesList}
          renderItem={(item) => (
            <List.Item>
              <Card size="small" hoverable>
                <Card.Meta
                  avatar={
                    <Avatar
                      size={48}
                      style={{ background: item.protectionLevel === '1' ? '#ff4d4f' : '#faad14' }}
                    >
                      {item.name.charAt(0)}
                    </Avatar>
                  }
                  title={item.name}
                  description={
                    <div>
                      <div style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>
                        {item.latinName}
                      </div>
                      <Tag
                        color={item.protectionLevel === '1' ? 'red' : 'orange'}
                        style={{ marginTop: 4 }}
                      >
                        {item.protectionLevel === '1' ? '一级保护' : '二级保护'}
                      </Tag>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'admin',
      label: '行政区划',
      children: (
        <List
          dataSource={administrativeZones}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ background: '#1890ff' }}>{item.name.charAt(0)}</Avatar>}
                title={item.name}
                description={
                  <Space>
                    <Tag>{item.type}</Tag>
                    <span>面积: {item.area} km²</span>
                    <span>人口: {item.population.toLocaleString()}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'charts',
      label: '数据分析',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="保护区面积变化趋势">
              <ReactECharts option={areaTrendOption} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="保护物种等级分布">
              <ReactECharts option={protectionLevelOption} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  const handleEdit = () => {
    form.setFieldsValue(reserveInfo);
    setEditVisible(true);
  };

  const handleSave = () => {
    setEditVisible(false);
    message.success('保存成功');
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">保护区档案</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            编辑档案
          </Button>
          <Button icon={<FileTextOutlined />}>
            导出档案
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs
          activeKey={selectedTab}
          onChange={setSelectedTab}
          items={tabItems}
        />
      </Card>

      <Modal
        title="编辑保护区信息"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="保护区名称" name="name">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="保护区级别" name="level">
                <Select>
                  <Select.Option value="national">国家级</Select.Option>
                  <Select.Option value="provincial">省级</Select.Option>
                  <Select.Option value="municipal">市级</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总面积(h m²)" name="area">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="建立日期" name="establishedDate">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="地理位置" name="location">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="主要保护对象" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReserveProfile;