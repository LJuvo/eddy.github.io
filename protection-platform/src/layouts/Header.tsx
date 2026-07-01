import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined,
  QuestionCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, Avatar, Space, Button, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { currentUser } from '@/mock';

interface HeaderProps {
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: '1', title: '新告警', content: '澌滩河发现水质异常', time: '5分钟前', unread: true },
    { id: '2', title: '任务提醒', content: '李巡护已完成巡护任务', time: '30分钟前', unread: true },
    { id: '3', title: '系统通知', content: '监测设备DEV004已离线', time: '2小时前', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      onOk: () => {
        navigate('/login');
      },
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '账号设置',
      icon: <QuestionCircleOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const notificationItems: MenuProps['items'] = notifications.map(n => ({
    key: n.id,
    label: (
      <div style={{ 
        padding: '8px 0', 
        borderLeft: n.unread ? '3px solid #2D7D46' : 'none',
        paddingLeft: n.unread ? 8 : 0,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{n.content}</div>
        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{n.time}</div>
      </div>
    ),
  }));

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: collapsed ? 80 : 260,
        right: 0,
        height: 60,
        background: 'white',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 99,
        transition: 'left 0.2s ease',
      }}
    >
      {/* 左侧 - 面包屑和标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          <span style={{ color: '#2D7D46', fontWeight: 500 }}>诺水河保护区</span>
          <span style={{ margin: '0 8px', color: '#ddd' }}>/</span>
          <span>综合管理平台</span>
        </div>
      </div>

      {/* 右侧 - 操作按钮和用户信息 */}
      <Space size={16}>
        {/* 全屏按钮 */}
        <Button 
          type="text" 
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={handleFullscreen}
          style={{ color: '#666' }}
        />

        {/* 通知 */}
        <Dropdown 
          menu={{ 
            items: notificationItems,
            onClick: ({ key }) => {
              if (key === '1') navigate('/patrol/alerts');
            }
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={unreadCount} size="small">
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              style={{ color: '#666' }}
            />
          </Badge>
        </Dropdown>

        {/* 帮助 */}
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined />} 
          style={{ color: '#666' }}
          onClick={() => {
            Modal.info({
              title: '帮助中心',
              content: '四川诺水河珍稀水生动物国家级自然保护区综合管理平台 v1.0',
              width: 400,
            });
          }}
        />

        {/* 用户信息 */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Avatar 
              size={36} 
              style={{ background: 'linear-gradient(135deg, #2D7D46, #3a9a59)' }}
              icon={<UserOutlined />}
            />
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{currentUser.department}</div>
            </div>
          </div>
        </Dropdown>
      </Space>
    </header>
  );
};

export default Header;
