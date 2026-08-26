import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Row,
  Col,
  DatePicker,
  Descriptions,
  Badge,
  Statistic,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileTextOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { operationLogsData } from '@/mock';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Log {
  id: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  time: string;
  status: string;
  details?: string;
}

const OperationLogs: React.FC = () => {
  const [data] = useState<Log[]>(operationLogsData);
  const [filteredData, setFilteredData] = useState<Log[]>(operationLogsData);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [viewingLog, setViewingLog] = useState<Log | null>(null);
  const [searchText, setSearchText] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模块列表
  const moduleList = ['系统', '巡护管理', '生态数据', '监测预警', '系统管理'];

  // 筛选数据
  const filterData = (
    search?: string,
    module?: string,
    status?: string,
    date?: [Dayjs | null, Dayjs | null] | null
  ) => {
    const searchVal = search !== undefined ? search : searchText;
    const moduleVal = module !== undefined ? module : moduleFilter;
    const statusVal = status !== undefined ? status : statusFilter;
    const dateVal = date !== undefined ? date : dateRange;

    let result = data;

    // 搜索过滤
    if (searchVal) {
      result = result.filter(
        (item) =>
          item.user.includes(searchVal) ||
          item.action.includes(searchVal) ||
          item.ip.includes(searchVal)
      );
    }

    // 模块过滤
    if (moduleVal !== 'all') {
      result = result.filter((item) => item.module === moduleVal);
    }

    // 状态过滤
    if (statusVal !== 'all') {
      result = result.filter((item) => item.status === statusVal);
    }

    // 日期范围过滤
    if (dateVal && dateVal[0] && dateVal[1]) {
      const startDate = dateVal[0].startOf('day');
      const endDate = dateVal[1].endOf('day');
      result = result.filter((item) => {
        const logDate = dayjs(item.time);
        return (logDate.isSame(startDate) || logDate.isAfter(startDate)) &&
               (logDate.isSame(endDate) || logDate.isBefore(endDate));
      });
    }

    setFilteredData(result);
  };

  // 搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, moduleFilter, statusFilter, dateRange);
  };

  // 模块筛选变化
  const handleModuleChange = (value: string) => {
    setModuleFilter(value);
    filterData(searchText, value, statusFilter, dateRange);
  };

  // 状态筛选变化
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    filterData(searchText, moduleFilter, value, dateRange);
  };

  // 日期范围变化
  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
    filterData(searchText, moduleFilter, statusFilter, dates);
  };

  // 查看详情
  const handleView = (log: Log) => {
    setViewingLog(log);
    setIsDetailVisible(true);
  };

  // 重置筛选
  const handleReset = () => {
    setSearchText('');
    setModuleFilter('all');
    setStatusFilter('all');
    setDateRange(null);
    setFilteredData(data);
  };

  // 获取状态标签
  const getStatusInfo = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      '成功': { color: 'success', text: '成功' },
      '失败': { color: 'error', text: '失败' },
      '告警': { color: 'warning', text: '告警' },
    };
    return map[status] || { color: 'default', text: status };
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      '成功': '#52c41a',
      '失败': '#ff4d4f',
      '告警': '#faad14',
    };
    return map[status] || '#999';
  };

  // 表格列定义
  const columns: ColumnsType<Log> = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Tag>{id}</Tag>,
    },
    {
      title: '操作用户',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user) => (
        <span style={{ fontWeight: 500 }}>
          {user}
        </span>
      ),
    },
    {
      title: '操作内容',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      ellipsis: true,
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      width: 110,
      render: (module) => {
        const colorMap: Record<string, string> = {
          '系统': 'default',
          '巡护管理': 'blue',
          '生态数据': 'green',
          '监测预警': 'orange',
          '系统管理': 'purple',
        };
        return <Tag color={colorMap[module] || 'default'}>{module}</Tag>;
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      width: 170,
      sorter: (a, b) => dayjs(a.time).unix() - dayjs(b.time).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => {
        const info = getStatusInfo(status);
        return (
          <Badge status={info.color as any} text={info.text} />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 统计各类日志数量
  const successCount = data.filter((item) => item.status === '成功').length;
  const failedCount = data.filter((item) => item.status === '失败').length;
  const alertCount = data.filter((item) => item.status === '告警').length;

  return (
    <div className="operation-logs fade-in">
      {/* 页面标题 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <FileTextOutlined style={{ marginRight: 8 }} />
            操作日志
          </h1>
          <p className="page-subtitle">查看系统操作记录、用户行为审计</p>
        </div>
        <div className="page-header-actions">
          <Button icon={<DownloadOutlined />}>导出日志</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置筛选
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="日志总数"
              value={data.length}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="成功操作"
              value={successCount}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="失败操作"
              value={failedCount}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bodyStyle={{ padding: 16 }}>
            <Statistic
              title="告警事件"
              value={alertCount}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card bodyStyle={{ padding: 16, marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="搜索用户、操作或IP"
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={moduleFilter}
              onChange={handleModuleChange}
              style={{ width: '100%' }}
            >
              <Option value="all">全部模块</Option>
              {moduleList.map((module) => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="成功">成功</Option>
              <Option value="失败">失败</Option>
              <Option value="告警">告警</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
        </Row>
      </Card>

      {/* 日志列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 日志详情弹窗 */}
      <Modal
        title="日志详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={
          <Button onClick={() => setIsDetailVisible(false)}>关闭</Button>
        }
        width={600}
      >
        {viewingLog && (
          <>
            <Descriptions column={2} bordered size="small" style={{ marginTop: 20 }}>
              <Descriptions.Item label="日志ID" span={2}>
                <Tag>{viewingLog.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作用户">
                <span style={{ fontWeight: 500 }}>{viewingLog.user}</span>
              </Descriptions.Item>
              <Descriptions.Item label="操作状态">
                <Badge
                  status={getStatusInfo(viewingLog.status).color as any}
                  text={getStatusInfo(viewingLog.status).text}
                />
              </Descriptions.Item>
              <Descriptions.Item label="操作内容" span={2}>
                {viewingLog.action}
              </Descriptions.Item>
              <Descriptions.Item label="所属模块">
                <Tag color="blue">{viewingLog.module}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="IP地址">
                <Tag>{viewingLog.ip}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作时间" span={2}>
                {viewingLog.time}
              </Descriptions.Item>
              {viewingLog.details && (
                <Descriptions.Item label="详细信息" span={2}>
                  {viewingLog.details}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 详细信息 */}
            <Card
              title="操作详情"
              size="small"
              style={{ marginTop: 16 }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                <pre style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  {JSON.stringify(
                    {
                      日志ID: viewingLog.id,
                      用户: viewingLog.user,
                      操作: viewingLog.action,
                      模块: viewingLog.module,
                      IP: viewingLog.ip,
                      时间: viewingLog.time,
                      状态: viewingLog.status,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OperationLogs;