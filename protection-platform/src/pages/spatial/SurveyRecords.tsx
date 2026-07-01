import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  List,
  Avatar,
  message,
  Popconfirm,
  Descriptions,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { surveyRecordsData } from '@/mock';

interface SurveyRecord {
  id: string;
  title: string;
  surveyor: string;
  surveyDate: string;
  location: string;
  speciesCount: number;
  status: string;
  remarks: string;
  surveyors?: string[];
  weather?: string;
  equipment?: string[];
  findings?: string[];
}

const SurveyRecords: React.FC = () => {
  const [recordList] = useState<SurveyRecord[]>([
    {
      id: 'SR001',
      title: '2024年春季鱼类多样性调查',
      surveyor: '陈科研',
      surveyDate: '2024-01-10',
      location: '诺水河干流',
      speciesCount: 15,
      status: '已完成',
      remarks: '数据已录入系统',
      surveyors: ['陈科研', '李科研', '王助理'],
      weather: '晴',
      equipment: ['流速仪', '水质检测仪', '采样网'],
      findings: ['发现岩原鲤新种群', '水质状况良好', '采集样本120份'],
    },
    {
      id: 'SR002',
      title: '大鲵栖息地专项调查',
      surveyor: '张科研',
      surveyDate: '2024-01-08',
      location: '核心区',
      speciesCount: 3,
      status: '已完成',
      remarks: '发现幼鲵个体',
      surveyors: ['张科研', '赵助理'],
      weather: '多云',
      equipment: ['红外相机', '水质检测仪'],
      findings: ['发现大鲵幼体2只', '栖息地环境良好', '建议加强保护'],
    },
    {
      id: 'SR003',
      title: '水生植物群落调查',
      surveyor: '陈科研',
      surveyDate: '2024-01-12',
      location: '澌滩河流域',
      speciesCount: 8,
      status: '进行中',
      remarks: '采样中',
      surveyors: ['陈科研'],
      weather: '阴',
      equipment: ['采样器', '照相机'],
      findings: ['采集水生植物标本30份', '数据整理中'],
    },
    {
      id: 'SR004',
      title: '冬季鸟类同步调查',
      surveyor: '李科研',
      surveyDate: '2024-01-05',
      location: '缓冲区',
      speciesCount: 22,
      status: '已完成',
      remarks: '记录黑鹳种群',
      surveyors: ['李科研', '张科研', '王助理', '赵助理'],
      weather: '晴',
      equipment: ['望远镜', '照相机', '录音笔'],
      findings: ['记录黑鹳种群8只', '发现白鹭新分布点', '候鸟数量较去年增加15%'],
    },
    {
      id: 'SR005',
      title: '两栖动物调查',
      surveyor: '陈科研',
      surveyDate: '2024-01-03',
      location: '实验区',
      speciesCount: 5,
      status: '已完成',
      remarks: '数据已提交',
      surveyors: ['陈科研', '刘助理'],
      weather: '小雨',
      equipment: ['手电筒', '采样袋'],
      findings: ['记录到中华蟾蜍分布', '繁殖期巡查建议'],
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<SurveyRecord> = [
    {
      title: '调查标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '调查人员',
      dataIndex: 'surveyor',
      key: 'surveyor',
      width: 100,
    },
    {
      title: '调查日期',
      dataIndex: 'surveyDate',
      key: 'surveyDate',
      width: 120,
      sorter: (a, b) => dayjs(a.surveyDate).unix() - dayjs(b.surveyDate).unix(),
    },
    {
      title: '调查地点',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      ellipsis: true,
    },
    {
      title: '物种数量',
      dataIndex: 'speciesCount',
      key: 'speciesCount',
      width: 100,
      sorter: (a, b) => a.speciesCount - b.speciesCount,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string }> = {
          '已完成': { color: 'success' },
          '进行中': { color: 'processing' },
          '待开始': { color: 'warning' },
        };
        return <Tag color={statusMap[status]?.color || 'default'}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setSelectedRecord(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => {
            setSelectedRecord(record);
            form.setFieldsValue(record);
            setCreateVisible(true);
          }}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除此记录？"
            onConfirm={() => message.success('删除成功')}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = recordList.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase()) ||
      item.surveyor.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    setSelectedRecord(null);
    form.resetFields();
    setCreateVisible(true);
  };

  const handleSubmit = () => {
    setCreateVisible(false);
    message.success('保存成功');
  };

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: selectedRecord && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="调查标题" span={2}>{selectedRecord.title}</Descriptions.Item>
          <Descriptions.Item label="调查人员">{selectedRecord.surveyor}</Descriptions.Item>
          <Descriptions.Item label="调查日期">{selectedRecord.surveyDate}</Descriptions.Item>
          <Descriptions.Item label="调查地点">{selectedRecord.location}</Descriptions.Item>
          <Descriptions.Item label="物种数量">{selectedRecord.speciesCount} 种</Descriptions.Item>
          <Descriptions.Item label="天气状况">{selectedRecord.weather || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={selectedRecord.status === '已完成' ? 'success' : 'processing'}>
              {selectedRecord.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{selectedRecord.remarks}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'team',
      label: '调查团队',
      children: selectedRecord && (
        <List
          dataSource={selectedRecord.surveyors || []}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ background: '#1890ff' }}>{item.charAt(0)}</Avatar>}
                title={item}
                description={`调查成员 ${index + 1}`}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'equipment',
      label: '调查设备',
      children: selectedRecord && (
        <div>
          <Row gutter={[8, 8]}>
            {selectedRecord.equipment?.map((item, index) => (
              <Col span={8} key={index}>
                <Tag color="blue">{item}</Tag>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'findings',
      label: '调查发现',
      children: selectedRecord && (
        <List
          dataSource={selectedRecord.findings || []}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ background: index === 0 ? '#52c41a' : '#1890ff' }}>{index + 1}</Avatar>}
                title={item}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">地面调查记录</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建调查
          </Button>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="搜索调查标题、地点或人员"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="已完成">已完成</Select.Option>
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="待开始">待开始</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button onClick={() => {
              setSearchText('');
              setFilterStatus(null);
            }}>
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="调查详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button key="export" icon={<FileTextOutlined />}>
            导出报告
          </Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => {
            setDetailVisible(false);
            form.setFieldsValue(selectedRecord);
            setCreateVisible(true);
          }}>
            编辑
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <Tabs items={tabItems} style={{ marginTop: 16 }} />
        )}
      </Modal>

      <Modal
        title={selectedRecord ? '编辑调查记录' : '新建调查记录'}
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item label="调查标题" name="title" rules={[{ required: true, message: '请输入调查标题' }]}>
                <Input placeholder="请输入调查标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="调查人员" name="surveyor" rules={[{ required: true, message: '请输入调查人员' }]}>
                <Input placeholder="请输入调查人员" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="调查日期" name="surveyDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="调查地点" name="location" rules={[{ required: true, message: '请输入调查地点' }]}>
                <Input placeholder="请输入调查地点" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="物种数量" name="speciesCount">
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="天气状况" name="weather">
                <Select placeholder="请选择天气">
                  <Select.Option value="晴">晴</Select.Option>
                  <Select.Option value="多云">多云</Select.Option>
                  <Select.Option value="阴">阴</Select.Option>
                  <Select.Option value="小雨">小雨</Select.Option>
                  <Select.Option value="雨">雨</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status">
                <Select>
                  <Select.Option value="待开始">待开始</Select.Option>
                  <Select.Option value="进行中">进行中</Select.Option>
                  <Select.Option value="已完成">已完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name="remarks">
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default SurveyRecords;