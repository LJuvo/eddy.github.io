import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Input,
  DatePicker,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Steps,
  message,
  Descriptions,
  Divider,
  List,
  Avatar,
  Empty,
  Tabs,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  PrinterOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import moment from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  lastUsed?: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  template: string;
  type: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  createTime: string;
  createBy: string;
  fileSize?: string;
  downloadUrl?: string;
}

const ReportGeneration: React.FC = () => {
  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'T001',
      name: '日常巡护报告',
      type: 'patrol',
      description: '生成日/周/月度巡护工作统计报告',
      lastUsed: '2024-01-15',
    },
    {
      id: 'T002',
      name: '物种监测报告',
      type: 'species',
      description: '汇总物种分布、种群数量变化监测数据',
      lastUsed: '2024-01-10',
    },
    {
      id: 'T003',
      name: '水质监测报告',
      type: 'water',
      description: '整合各监测站点的水质数据进行分析',
      lastUsed: '2024-01-12',
    },
    {
      id: 'T004',
      name: '异常事件报告',
      type: 'alert',
      description: '统计和分析异常事件的发生及处理情况',
      lastUsed: '2024-01-14',
    },
    {
      id: 'T005',
      name: '设备运行报告',
      type: 'device',
      description: '监测设备在线率、故障统计等',
      lastUsed: '2024-01-08',
    },
    {
      id: 'T006',
      name: '综合分析报告',
      type: 'comprehensive',
      description: '保护区全面工作汇总报告',
    },
  ]);

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: 'R001',
      name: '2024年1月日常巡护报告',
      template: 'T001',
      type: 'patrol',
      status: 'completed',
      progress: 100,
      createTime: '2024-01-15 14:30',
      createBy: '系统管理员',
      fileSize: '2.5MB',
      downloadUrl: '/reports/patrol_202401.pdf',
    },
    {
      id: 'R002',
      name: '大鲵栖息地监测报告',
      template: 'T002',
      type: 'species',
      status: 'completed',
      progress: 100,
      createTime: '2024-01-10 10:20',
      createBy: '陈科研',
      fileSize: '5.8MB',
      downloadUrl: '/reports/species_202401.pdf',
    },
    {
      id: 'R003',
      name: '本周水质监测汇总',
      template: 'T003',
      type: 'water',
      status: 'generating',
      progress: 65,
      createTime: '2024-01-15 16:00',
      createBy: '系统管理员',
    },
    {
      id: 'R004',
      name: '1月上旬异常事件报告',
      template: 'T004',
      type: 'alert',
      status: 'completed',
      progress: 100,
      createTime: '2024-01-12 09:15',
      createBy: '刘管理',
      fileSize: '1.2MB',
      downloadUrl: '/reports/alert_202401a.pdf',
    },
  ]);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('1');

  const [form] = Form.useForm();

  // 报告类型
  const reportTypeOptions = [
    { value: 'patrol', label: '巡护报告' },
    { value: 'species', label: '物种报告' },
    { value: 'water', label: '水质报告' },
    { value: 'alert', label: '告警报告' },
    { value: 'device', label: '设备报告' },
    { value: 'comprehensive', label: '综合报告' },
  ];

  // 导出格式
  const exportFormatOptions = [
    { value: 'pdf', label: 'PDF文档', icon: <FilePdfOutlined /> },
    { value: 'word', label: 'Word文档', icon: <FileWordOutlined /> },
    { value: 'excel', label: 'Excel表格', icon: <FileExcelOutlined /> },
  ];

  // 时间范围快捷选项
  const dateRangeQuickOptions = [
    { label: '今日', value: 'today' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '本季度', value: 'quarter' },
    { label: '自定义', value: 'custom' },
  ];

  // 创建新报告
  const handleCreateReport = () => {
    setCreateModalVisible(true);
    setCurrentStep(0);
    form.resetFields();
  };

  // 步骤1: 选择模板
  const handleTemplateSelect = (templateId: string) => {
    form.setFieldsValue({ templateId });
    setCurrentStep(1);
  };

  // 步骤2: 配置参数
  const handleParamsConfigure = () => {
    setCurrentStep(2);
  };

  // 步骤3: 生成报告
  const handleGenerate = () => {
    const values = form.getFieldsValue();
    const template = templates.find(t => t.id === values.templateId);

    const newReport: GeneratedReport = {
      id: `R${String(generatedReports.length + 1).padStart(3, '0')}`,
      name: `${values.reportName || template?.name}_${moment().format('YYYYMMDDHHmm')}`,
      template: values.templateId,
      type: template?.type || 'comprehensive',
      status: 'generating',
      progress: 0,
      createTime: moment().format('YYYY-MM-DD HH:mm'),
      createBy: '系统管理员',
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    setCreateModalVisible(false);

    // 模拟生成进度
    const interval = setInterval(() => {
      setGeneratedReports(prev => prev.map(r => {
        if (r.id === newReport.id && r.status === 'generating') {
          const newProgress = r.progress + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...r, progress: 100, status: 'completed' as const, fileSize: '3.2MB' };
          }
          return { ...r, progress: Math.round(newProgress) };
        }
        return r;
      }));
    }, 500);

    message.success('报告生成任务已提交');
  };

  // 预览报告
  const handlePreview = (report: GeneratedReport) => {
    setSelectedReport(report);
    setPreviewModalVisible(true);
  };

  // 下载报告
  const handleDownload = (report: GeneratedReport) => {
    message.success(`开始下载: ${report.name}`);
  };

  // 删除报告
  const handleDelete = (reportId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这份报告吗？删除后无法恢复。',
      onOk: () => {
        setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
        message.success('报告已删除');
      },
    });
  };

  // 表格列定义
  const columns: ColumnsType<GeneratedReport> = [
    {
      title: '报告名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <Avatar
            size="small"
            style={{
              background: record.type === 'patrol' ? '#1890ff' :
                         record.type === 'species' ? '#52c41a' :
                         record.type === 'water' ? '#722ed1' :
                         record.type === 'alert' ? '#ff4d4f' : '#faad14',
            }}
            icon={<FileTextOutlined />}
          />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: '报告类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          patrol: { color: 'blue', text: '巡护' },
          species: { color: 'green', text: '物种' },
          water: { color: 'purple', text: '水质' },
          alert: { color: 'red', text: '告警' },
          device: { color: 'orange', text: '设备' },
          comprehensive: { color: 'gold', text: '综合' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record) => {
        if (status === 'generating') {
          return (
            <Space>
              <LoadingOutlined style={{ color: '#1890ff' }} />
              <Progress percent={record.progress} size="small" style={{ width: 80 }} />
            </Space>
          );
        }
        if (status === 'completed') {
          return (
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: '#52c41a' }}>已完成</span>
            </Space>
          );
        }
        return (
          <Space>
            <ClockCircleOutlined style={{ color: '#ff4d4f' }} />
            <span style={{ color: '#ff4d4f' }}>失败</span>
          </Space>
        );
      },
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: string) => size || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            disabled={record.status !== 'completed'}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            disabled={record.status !== 'completed'}
          >
            下载
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 步骤配置
  const steps = [
    { title: '选择模板', icon: <FileTextOutlined /> },
    { title: '配置参数', icon: <SyncOutlined /> },
    { title: '生成报告', icon: <FilePdfOutlined /> },
  ];

  return (
    <div className="report-generation fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">报告生成</h1>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateReport}>
            创建报告
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'rgba(24, 144, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1890ff',
                fontSize: 22,
              }}>
                <FileTextOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#666' }}>报告总数</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>
                  {generatedReports.length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'rgba(82, 196, 26, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#52c41a',
                fontSize: 22,
              }}>
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#666' }}>已完成</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>
                  {generatedReports.filter(r => r.status === 'completed').length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'rgba(250, 173, 20, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#faad14',
                fontSize: 22,
              }}>
                <LoadingOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#666' }}>生成中</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#faad14' }}>
                  {generatedReports.filter(r => r.status === 'generating').length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'rgba(114, 46, 209, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#722ed1',
                fontSize: 22,
              }}>
                <FilePdfOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#666' }}>模板数量</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#722ed1' }}>
                  {templates.length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: '报告列表',
            children: (
              <Card>
                <Table
                  columns={columns}
                  dataSource={generatedReports}
                  rowKey="id"
                  pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                />
              </Card>
            ),
          },
          {
            key: '2',
            label: '报告模板',
            children: (
              <Row gutter={[16, 16]}>
                {templates.map(template => (
                  <Col span={8} key={template.id}>
                    <Card
                      hoverable
                      style={{
                        borderColor: template.lastUsed ? '#52c41a' : '#d9d9d9',
                      }}
                      bodyStyle={{ padding: 20 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <Avatar
                          size={48}
                          style={{
                            background: template.type === 'patrol' ? '#1890ff' :
                                       template.type === 'species' ? '#52c41a' :
                                       template.type === 'water' ? '#722ed1' :
                                       template.type === 'alert' ? '#ff4d4f' : '#faad14',
                          }}
                          icon={<FileTextOutlined />}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                            {template.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                            {template.description}
                          </div>
                          {template.lastUsed && (
                            <div style={{ fontSize: 11, color: '#999' }}>
                              上次使用: {template.lastUsed}
                            </div>
                          )}
                        </div>
                      </div>
                      <Divider style={{ margin: '12px 0' }} />
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            form.setFieldsValue({ templateId: template.id });
                            setCreateModalVisible(true);
                            setCurrentStep(1);
                          }}
                        >
                          使用模板
                        </Button>
                        <Button size="small" icon={<EyeOutlined />}>
                          预览
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />

      {/* 创建报告弹窗 */}
      <Modal
        title="创建报告"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setCurrentStep(0);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 24 }}
        />

        {currentStep === 0 && (
          <div>
            <div style={{ marginBottom: 16, color: '#666' }}>
              请选择报告模板：
            </div>
            <Row gutter={[12, 12]}>
              {templates.map(template => (
                <Col span={8} key={template.id}>
                  <Card
                    size="small"
                    hoverable
                    style={{
                      borderColor: form.getFieldValue('templateId') === template.id ? '#1890ff' : '#d9d9d9',
                      background: form.getFieldValue('templateId') === template.id ? 'rgba(24, 144, 255, 0.05)' : '#fff',
                    }}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Avatar
                        size={40}
                        style={{
                          background: template.type === 'patrol' ? '#1890ff' :
                                     template.type === 'species' ? '#52c41a' :
                                     template.type === 'water' ? '#722ed1' :
                                     template.type === 'alert' ? '#ff4d4f' : '#faad14',
                          marginBottom: 8,
                        }}
                        icon={<FileTextOutlined />}
                      />
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{template.name}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {currentStep === 1 && (
          <Form form={form} layout="vertical">
            <Form.Item name="templateId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="报告名称"
              name="reportName"
              rules={[{ required: true, message: '请输入报告名称' }]}
            >
              <Input placeholder="请输入报告名称" />
            </Form.Item>
            <Form.Item
              label="时间范围"
              name="dateRange"
              rules={[{ required: true, message: '请选择时间范围' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="报告格式" name="format" initialValue="pdf">
              <Select>
                {exportFormatOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    <Space>{opt.icon}{opt.label}</Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="备注说明" name="remarks">
              <TextArea rows={3} placeholder="请输入备注说明（可选）" />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setCurrentStep(0)}>上一步</Button>
                <Button type="primary" onClick={handleParamsConfigure}>
                  下一步
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {currentStep === 2 && (
          <div>
            <Card size="small" style={{ marginBottom: 16, background: '#f5f5f5' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="模板">
                  {templates.find(t => t.id === form.getFieldValue('templateId'))?.name}
                </Descriptions.Item>
                <Descriptions.Item label="报告名称">
                  {form.getFieldValue('reportName')}
                </Descriptions.Item>
                <Descriptions.Item label="时间范围">
                  {form.getFieldValue('dateRange')?.join(' 至 ')}
                </Descriptions.Item>
                <Descriptions.Item label="输出格式">
                  {form.getFieldValue('format')?.toUpperCase()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>报告将包含以下内容：</div>
              <List
                size="small"
                dataSource={[
                  '保护区基本信息汇总',
                  '监测数据统计分析',
                  '异常事件记录与处理',
                  '巡护工作统计',
                  '图表与可视化',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    {item}
                  </List.Item>
                )}
              />
            </div>

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCurrentStep(1)}>上一步</Button>
              <Button type="primary" icon={<FilePdfOutlined />} onClick={handleGenerate}>
                开始生成
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 报告预览弹窗 */}
      <Modal
        title="报告预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setPreviewModalVisible(false)}>关闭</Button>
            <Button icon={<PrinterOutlined />}>打印</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => selectedReport && handleDownload(selectedReport)}>
              下载
            </Button>
          </Space>
        }
        width={900}
      >
        {selectedReport && (
          <div>
            <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
              <Descriptions column={4} size="small">
                <Descriptions.Item label="报告名称">{selectedReport.name}</Descriptions.Item>
                <Descriptions.Item label="类型">
                  <Tag color="blue">{selectedReport.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{selectedReport.createTime}</Descriptions.Item>
                <Descriptions.Item label="创建人">{selectedReport.createBy}</Descriptions.Item>
              </Descriptions>
            </Card>

            <div style={{
              height: 500,
              background: '#fff',
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {selectedReport.status === 'completed' ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FilePdfOutlined style={{ fontSize: 80, color: '#ff4d4f', marginBottom: 16 }} />
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                    {selectedReport.name}
                  </div>
                  <div style={{ color: '#666', marginBottom: 24 }}>
                    PDF文档 · {selectedReport.fileSize}
                  </div>
                  <div style={{
                    width: 400,
                    height: 300,
                    background: '#f5f5f5',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>
                        报告预览区域
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.8 }}>
                        实际报告将包含详细的图表、数据表格和分析内容
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <LoadingOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                  <div style={{ fontSize: 16, marginBottom: 8 }}>报告正在生成中...</div>
                  <Progress percent={selectedReport.progress} status="active" style={{ width: 200 }} />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportGeneration;
