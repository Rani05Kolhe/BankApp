import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import{Link} from "react-router-dom";

const Homelayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
  <Layout>
        <Header style={{ padding: 0, background: colorBgContainer,  display: "flex",                
          justifyContent: "space-between", 
          alignItems: "center", }}>
        <Link to="/admin">Visit Admin </Link>

       <div>
          <Link to="/signin">
            <Button type="link">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button type="primary">Sign Up</Button>
          </Link>
        </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
  );
};
export default Homelayout;