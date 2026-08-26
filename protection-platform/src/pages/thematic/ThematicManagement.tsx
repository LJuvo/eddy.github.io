import React, { useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  ColorPicker,
  Select,
  InputNumber,
  DatePicker,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Collapse,
  Empty,
  Tooltip,
  Divider,
  Badge,
  Steps,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CompassOutlined,
  FileOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  FormOutlined,
  PlayCircleOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import type {
  ThematicTopic,
  ThematicChapter,
  ThematicWaypoint,
  ThematicStat,
  ThematicTopicInput,
} from '@/types';
import { thematicTopicsData } from '@/mock';

const { Panel } = Collapse;
const { TextArea } = Input;

// 状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  published: { color: 'green', text: '已发布' },
  draft: { color: 'default', text: '草稿' },
  archived: { color: 'warning', text: '已归档' },
};

// 预设颜色 - 按组分页
const presetColors = [
  {
    label: '常用颜色',
    colors: ['#4FC3F7', '#81C784', '#FFB74D', '#BA68C8', '#F06292', '#52C41A', '#1890FF', '#FA8C16', '#13C2C2', '#722ED1'],
  },
];

// 生成唯一ID
const generateId = () => `TT${Date.now().toString().slice(-8)}`;

// 日期格式化
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return dateStr.split(' ')[0];
};

const ThematicManagement: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ThematicTopic[]>(thematicTopicsData);
  const [form] = Form.useForm();

  // 弹窗状态
  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [chapterModalVisible, setChapterModalVisible] = useState(false);
  const [waypointModalVisible, setWaypointModalVisible] = useState(false);
  const [statModalVisible, setStatModalVisible] = useState(false);

  // 当前编辑的对象
  const [editingTopic, setEditingTopic] = useState<ThematicTopic | null>(null);
  const [editingChapter, setEditingChapter] = useState<ThematicChapter | null>(null);
  const [editingWaypoint, setEditingWaypoint] = useState<ThematicWaypoint | null>(null);
  const [editingStat, setEditingStat] = useState<ThematicStat | null>(null);

  // 临时状态（编辑中使用）
  const [tempTopic, setTempTopic] = useState<ThematicTopic | null>(null);
  const [tempChapter, setTempChapter] = useState<ThematicChapter | null>(null);

  // ========== 专题 CRUD ==========

  const handleCreateTopic = () => {
    const newTopic: ThematicTopic = {
      id: generateId(),
      name: '',
      code: '',
      description: '',
      coverColor: '#4FC3F7',
      icon: '🏞️',
      status: 'draft',
      chapters: [],
      createdBy: 'admin',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      viewCount: 0,
      isDefault: false,
    };
    setEditingTopic(newTopic);
    setTempTopic({ ...newTopic });
    form.setFieldsValue(newTopic);
    setTopicModalVisible(true);
  };

  const handleEditTopic = (topic: ThematicTopic) => {
    setEditingTopic(topic);
    setTempTopic(JSON.parse(JSON.stringify(topic)));
    form.setFieldsValue(topic);
    setTopicModalVisible(true);
  };

  const handleDeleteTopic = async (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    message.success('专题已删除');
  };

  const handleSaveTopic = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      // 处理颜色和图标
      let coverColor = values.coverColor || tempTopic?.coverColor || '#4FC3F7';
      if (typeof coverColor === 'object' && coverColor.meta) {
        coverColor = coverColor.meta;
      }

      const updatedTopic: ThematicTopic = {
        ...(tempTopic as ThematicTopic),
        ...values,
        coverColor,
        icon: values.icon || tempTopic?.icon || '🏞️',
        updatedAt: now,
      };

      if (editingTopic && topics.find(t => t.id === editingTopic.id)) {
        // 更新
        setTopics(prev => prev.map(t => t.id === editingTopic.id ? updatedTopic : t));
        message.success('专题已更新');
      } else {
        // 新建
        setTopics(prev => [updatedTopic, ...prev]);
        message.success('专题已创建');
      }

      setTopicModalVisible(false);
      setEditingTopic(null);
      setTempTopic(null);
      form.resetFields();
    } catch (err) {
      // 表单验证失败
    }
  };

  const handlePreviewTopic = (topic: ThematicTopic) => {
    navigate(`/thematic/showcase?topic=${topic.id}`);
  };

  const handlePublishTopic = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, status: 'published', updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) } : t));
    message.success('专题已发布');
  };

  const handleArchiveTopic = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, status: 'archived', updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) } : t));
    message.success('专题已归档');
  };

  // ========== 章节 CRUD ==========

  const handleAddChapter = () => {
    if (!tempTopic) return;
    const nextId = (tempTopic.chapters.reduce((max, c) => Math.max(max, c.id), 0) || 0) + 1;
    const newChapter: ThematicChapter = {
      id: nextId,
      title: '新章节',
      subtitle: '',
      description: '',
      color: presetColors[0].colors[(nextId - 1) % presetColors[0].colors.length],
      route: [],
      waypoints: [],
      icon: '📍',
    };
    setEditingChapter(newChapter);
    setTempChapter(JSON.parse(JSON.stringify(newChapter)));
    setChapterModalVisible(true);
  };

  const handleEditChapter = (chapter: ThematicChapter) => {
    setEditingChapter(chapter);
    setTempChapter(JSON.parse(JSON.stringify(chapter)));
    setChapterModalVisible(true);
  };

  const handleDeleteChapter = (chapterId: number) => {
    if (!tempTopic) return;
    const updated = {
      ...tempTopic,
      chapters: tempTopic.chapters.filter(c => c.id !== chapterId),
    };
    setTempTopic(updated);
    message.success('章节已删除');
  };

  const handleMoveChapter = (chapterId: number, direction: 'up' | 'down') => {
    if (!tempTopic) return;
    const chapters = [...tempTopic.chapters];
    const idx = chapters.findIndex(c => c.id === chapterId);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= chapters.length) return;
    [chapters[idx], chapters[swapIdx]] = [chapters[swapIdx], chapters[idx]];
    setTempTopic({ ...tempTopic, chapters });
  };

  const handleSaveChapter = () => {
    if (!tempTopic || !tempChapter) return;
    const chapters = [...tempTopic.chapters];
    const idx = chapters.findIndex(c => c.id === tempChapter.id);
    if (idx !== -1) {
      chapters[idx] = tempChapter;
    } else {
      chapters.push(tempChapter);
    }
    setTempTopic({ ...tempTopic, chapters });
    setChapterModalVisible(false);
    setEditingChapter(null);
    setTempChapter(null);
    message.success('章节已保存');
  };

  // ========== 航点 CRUD ==========

  const handleAddWaypoint = () => {
    if (!tempChapter) return;
    const newWp: ThematicWaypoint = {
      name: '新航点',
      desc: '',
      lng: 107.15,
      lat: 32.05,
    };
    setEditingWaypoint(newWp);
    setWaypointModalVisible(true);
  };

  const handleEditWaypoint = (wp: ThematicWaypoint) => {
    setEditingWaypoint({ ...wp });
    setWaypointModalVisible(true);
  };

  const handleDeleteWaypoint = (index: number) => {
    if (!tempChapter) return;
    const waypoints = [...tempChapter.waypoints];
    waypoints.splice(index, 1);
    // 同步删除 route 中对应的点
    const route = [...tempChapter.route];
    if (route.length > index) {
      route.splice(index, 1);
    }
    setTempChapter({ ...tempChapter, waypoints, route });
    message.success('航点已删除');
  };

  const handleSaveWaypoint = () => {
    if (!tempChapter || !editingWaypoint) return;
    const waypoints = [...tempChapter.waypoints];
    const wp = { ...editingWaypoint };
    const idx = waypoints.findIndex(w => w.name === editingWaypoint.name && w.lng === editingWaypoint.lng);
    if (idx !== -1) {
      waypoints[idx] = wp;
      // 同步更新 route
      const route = [...tempChapter.route];
      if (route.length > idx) {
        route[idx] = [wp.lng, wp.lat];
      } else {
        route.push([wp.lng, wp.lat]);
      }
      setTempChapter({ ...tempChapter, waypoints, route });
    } else {
      waypoints.push(wp);
      const route = [...tempChapter.route];
      route.push([wp.lng, wp.lat]);
      setTempChapter({ ...tempChapter, waypoints, route });
    }
    setWaypointModalVisible(false);
    setEditingWaypoint(null);
    message.success('航点已保存');
  };

  // ========== 统计数据 CRUD ==========

  const handleAddStat = () => {
    if (!tempChapter) return;
    const newStat: ThematicStat = { label: '新指标', value: '0', unit: '' };
    setEditingStat(newStat);
    setStatModalVisible(true);
  };

  const handleEditStat = (stat: ThematicStat) => {
    setEditingStat({ ...stat });
    setStatModalVisible(true);
  };

  const handleDeleteStat = (index: number) => {
    if (!tempChapter || !tempChapter.stats) return;
    const stats = [...tempChapter.stats];
    stats.splice(index, 1);
    setTempChapter({ ...tempChapter, stats });
    message.success('统计项已删除');
  };

  const handleSaveStat = () => {
    if (!tempChapter || !editingStat) return;
    const stats = tempChapter.stats ? [...tempChapter.stats] : [];
    const idx = stats.findIndex(s => s.label === editingStat.label);
    if (idx !== -1) {
      stats[idx] = editingStat;
    } else {
      stats.push(editingStat);
    }
    setTempChapter({ ...tempChapter, stats });
    setStatModalVisible(false);
    setEditingStat(null);
    message.success('统计项已保存');
  };

  // ========== 专题表格列 ==========

  const columns: ColumnsType<ThematicTopic> = [
    {
      title: '专题名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${record.coverColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {record.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      ),
    },
    {
      title: '章节数',
      dataIndex: 'chapters',
      key: 'chapters',
      width: 80,
      render: (chapters: ThematicChapter[]) => chapters.length,
    },
    {
      title: '浏览次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTopic(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewTopic(record)}
          >
            预览
          </Button>
          {record.status !== 'published' && (
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handlePublishTopic(record.id)}
            >
              发布
            </Button>
          )}
          {record.status === 'published' && (
            <Button
              type="link"
              onClick={() => handleArchiveTopic(record.id)}
            >
              归档
            </Button>
          )}
          <Popconfirm
            title="确定删除此专题？"
            description="删除后将无法恢复"
            onConfirm={() => handleDeleteTopic(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* 页面头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>专题展示管理</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>
            管理自然保护区多专题展示内容，支持动态配置章节、航点与统计数据
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateTopic}
        >
          新建专题
        </Button>
      </div>

      {/* 专题统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4FC3F7, #29B6F6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 24,
              }}>
                <CompassOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{topics.length}</div>
                <div style={{ color: '#666', fontSize: 13 }}>专题总数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #52C41A, #389E0D)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 24,
              }}>
                <PlayCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>
                  {topics.filter(t => t.status === 'published').length}
                </div>
                <div style={{ color: '#666', fontSize: 13 }}>已发布</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #FA8C16, #D46B08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 24,
              }}>
                <FileOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>
                  {topics.filter(t => t.status === 'draft').length}
                </div>
                <div style={{ color: '#666', fontSize: 13 }}>草稿</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 专题列表表格 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CompassOutlined style={{ color: '#4FC3F7' }} />
            <span>专题列表</span>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        <Table
          columns={columns}
          dataSource={topics}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个专题` }}
        />
      </Card>

      {/* ========== 专题编辑弹窗 ========== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FormOutlined />
            <span>{editingTopic && topics.find(t => t.id === editingTopic.id) ? '编辑专题' : '新建专题'}</span>
          </div>
        }
        open={topicModalVisible}
        onOk={handleSaveTopic}
        onCancel={() => {
          setTopicModalVisible(false);
          setEditingTopic(null);
          setTempTopic(null);
          form.resetFields();
        }}
        width={900}
        okText="保存"
        cancelText="取消"
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {tempTopic && (
          <>
            <Form form={form} layout="vertical" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="专题名称"
                    rules={[{ required: true, message: '请输入专题名称' }]}
                  >
                    <Input placeholder="如：诺水河自然保护区" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    label="专题编码"
                    rules={[{ required: true, message: '请输入专题编码' }]}
                  >
                    <Input placeholder="如：NUOSHU_MAIN" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="专题描述"
                rules={[{ required: true, message: '请输入专题描述' }]}
              >
                <TextArea rows={3} placeholder="简要描述专题的内容和目的" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="icon" label="专题图标 (Emoji)">
                    <Input placeholder="如：🏞️" maxLength={4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="coverColor" label="主题色">
                    <ColorPicker
                      showText
                      presets={presetColors}
                      onChange={(color) => {
                        setTempTopic({ ...tempTopic, coverColor: color.toHexString() });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="status" label="状态">
                <Select>
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="published">已发布</Select.Option>
                  <Select.Option value="archived">已归档</Select.Option>
                </Select>
              </Form.Item>
            </Form>

            <Divider orientation="left" orientationMargin={0}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                <FileOutlined style={{ marginRight: 6 }} />
                章节配置 ({tempTopic.chapters.length})
              </span>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleAddChapter}
                style={{ marginLeft: 8 }}
              >
                添加章节
              </Button>
            </Divider>

            {tempTopic.chapters.length === 0 ? (
              <Empty description="暂无章节，点击上方按钮添加" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Collapse
                defaultActiveKey={tempTopic.chapters.map(c => String(c.id))}
                items={tempTopic.chapters.map((chapter, index) => ({
                  key: String(chapter.id),
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: chapter.color,
                        }}
                      />
                      <span style={{ fontWeight: 600 }}>{chapter.icon} {chapter.title}</span>
                      <Tag color="blue">航点 {chapter.waypoints.length}</Tag>
                    </div>
                  ),
                  extra: (
                    <Space size={4} onClick={e => e.stopPropagation()}>
                      <Tooltip title="上移">
                        <Button
                          size="small"
                          icon={<ArrowUpOutlined />}
                          disabled={index === 0}
                          onClick={() => handleMoveChapter(chapter.id, 'up')}
                        />
                      </Tooltip>
                      <Tooltip title="下移">
                        <Button
                          size="small"
                          icon={<ArrowDownOutlined />}
                          disabled={index === tempTopic.chapters.length - 1}
                          onClick={() => handleMoveChapter(chapter.id, 'down')}
                        />
                      </Tooltip>
                      <Tooltip title="编辑">
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditChapter(chapter)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="确定删除此章节？"
                        onConfirm={() => handleDeleteChapter(chapter.id)}
                      >
                        <Button size="small" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Space>
                  ),
                  children: (
                    <div style={{ padding: '8px 0' }}>
                      <Row gutter={[16, 12]}>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#999' }}>副标题</div>
                          <div style={{ fontSize: 14 }}>{chapter.subtitle || '-'}</div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#999' }}>航点数</div>
                          <div style={{ fontSize: 14 }}>{chapter.waypoints.length} 个</div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#999' }}>路线点数</div>
                          <div style={{ fontSize: 14 }}>{chapter.route.length} 个</div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#999' }}>统计指标</div>
                          <div style={{ fontSize: 14 }}>
                            {chapter.stats ? chapter.stats.length : 0} 项
                          </div>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
                        {chapter.description.slice(0, 80)}{chapter.description.length > 80 ? '...' : ''}
                      </div>
                    </div>
                  ),
                }))}
              />
            )}
          </>
        )}
      </Modal>

      {/* ========== 章节编辑弹窗 ========== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThunderboltOutlined />
            <span>编辑章节</span>
          </div>
        }
        open={chapterModalVisible}
        onOk={handleSaveChapter}
        onCancel={() => {
          setChapterModalVisible(false);
          setEditingChapter(null);
          setTempChapter(null);
        }}
        width={700}
        okText="保存章节"
        cancelText="取消"
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {tempChapter && (
          <>
            <Row gutter={16}>
              <Col span={16}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>章节标题</div>
                  <Input
                    value={tempChapter.title}
                    onChange={e => setTempChapter({ ...tempChapter, title: e.target.value })}
                    placeholder="章节标题"
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>图标 (Emoji)</div>
                  <Input
                    value={tempChapter.icon}
                    onChange={e => setTempChapter({ ...tempChapter, icon: e.target.value })}
                    maxLength={4}
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={16}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>副标题</div>
                  <Input
                    value={tempChapter.subtitle}
                    onChange={e => setTempChapter({ ...tempChapter, subtitle: e.target.value })}
                    placeholder="章节副标题"
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>主题色</div>
                  <ColorPicker
                    showText
                    presets={presetColors}
                    value={tempChapter.color}
                    onChange={(color) => setTempChapter({ ...tempChapter, color: color.toHexString() })}
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>章节描述</div>
              <TextArea
                rows={3}
                value={tempChapter.description}
                onChange={e => setTempChapter({ ...tempChapter, description: e.target.value })}
                placeholder="详细描述本章节的内容"
              />
            </div>

            <Divider orientation="left" orientationMargin={0}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                <EnvironmentOutlined style={{ marginRight: 6 }} />
                航点列表 ({tempChapter.waypoints.length})
              </span>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleAddWaypoint}
                style={{ marginLeft: 8 }}
              >
                添加航点
              </Button>
            </Divider>

            {tempChapter.waypoints.length === 0 ? (
              <Empty description="暂无航点" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div style={{ marginBottom: 16 }}>
                {tempChapter.waypoints.map((wp, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 6,
                      marginBottom: 8,
                      border: `1px solid ${tempChapter.color}30`,
                      borderLeft: `3px solid ${tempChapter.color}`,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: tempChapter.color,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        marginRight: 12,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{wp.name}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {wp.desc} · {wp.lng.toFixed(4)}, {wp.lat.toFixed(4)}
                      </div>
                    </div>
                    <Space size={4}>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditWaypoint(wp)}
                      />
                      <Popconfirm
                        title="删除此航点？"
                        onConfirm={() => handleDeleteWaypoint(index)}
                      >
                        <Button size="small" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Space>
                  </div>
                ))}
              </div>
            )}

            <Divider orientation="left" orientationMargin={0}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                <BarChartOutlined />
                统计指标 ({tempChapter.stats ? tempChapter.stats.length : 0})
              </span>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleAddStat}
                style={{ marginLeft: 8 }}
              >
                添加指标
              </Button>
            </Divider>

            {(!tempChapter.stats || tempChapter.stats.length === 0) ? (
              <Empty description="暂无统计指标" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div>
                {tempChapter.stats.map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 6,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>{stat.label}</span>
                      <span style={{ color: '#666', marginLeft: 8 }}>
                        {stat.value} {stat.unit}
                      </span>
                    </div>
                    <Space size={4}>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditStat(stat)}
                      />
                      <Popconfirm
                        title="删除此指标？"
                        onConfirm={() => handleDeleteStat(index)}
                      >
                        <Button size="small" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Modal>

      {/* ========== 航点编辑弹窗 ========== */}
      <Modal
        title="编辑航点"
        open={waypointModalVisible}
        onOk={handleSaveWaypoint}
        onCancel={() => {
          setWaypointModalVisible(false);
          setEditingWaypoint(null);
        }}
        width={500}
        okText="保存"
        cancelText="取消"
      >
        {editingWaypoint && (
          <Form layout="vertical">
            <Form.Item label="航点名称" required>
              <Input
                value={editingWaypoint.name}
                onChange={e => setEditingWaypoint({ ...editingWaypoint, name: e.target.value })}
                placeholder="如：源头"
              />
            </Form.Item>
            <Form.Item label="航点描述">
              <TextArea
                rows={2}
                value={editingWaypoint.desc}
                onChange={e => setEditingWaypoint({ ...editingWaypoint, desc: e.target.value })}
                placeholder="航点详细描述"
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="经度 (Lng)" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={70}
                    max={140}
                    step={0.0001}
                    precision={4}
                    value={editingWaypoint.lng}
                    onChange={v => v !== null && setEditingWaypoint({ ...editingWaypoint, lng: v })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="纬度 (Lat)" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={55}
                    step={0.0001}
                    precision={4}
                    value={editingWaypoint.lat}
                    onChange={v => v !== null && setEditingWaypoint({ ...editingWaypoint, lat: v })}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* ========== 统计指标编辑弹窗 ========== */}
      <Modal
        title="编辑统计指标"
        open={statModalVisible}
        onOk={handleSaveStat}
        onCancel={() => {
          setStatModalVisible(false);
          setEditingStat(null);
        }}
        width={450}
        okText="保存"
        cancelText="取消"
      >
        {editingStat && (
          <Form layout="vertical">
            <Form.Item label="指标名称" required>
              <Input
                value={editingStat.label}
                onChange={e => setEditingStat({ ...editingStat, label: e.target.value })}
                placeholder="如：累计巡护里程"
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={14}>
                <Form.Item label="数值" required>
                  <Input
                    value={editingStat.value}
                    onChange={e => setEditingStat({ ...editingStat, value: e.target.value })}
                    placeholder="如：12,500"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="单位">
                  <Input
                    value={editingStat.unit}
                    onChange={e => setEditingStat({ ...editingStat, unit: e.target.value })}
                    placeholder="如：km"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ThematicManagement;
