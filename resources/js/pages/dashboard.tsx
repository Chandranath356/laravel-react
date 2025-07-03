import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Helmet } from 'react-helmet';

const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
    const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      Swal.fire({
          title: 'Are you sure?',
          text: "Do you want to logout?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('token');
            navigate('/');
          }
        });

    }
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div   style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            margin: 16,
            color: '#fff',        // Ensure text is visible on dark background
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Ivdisplays
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
           onClick={handleMenuClick}
        >
         <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 500,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
           <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;