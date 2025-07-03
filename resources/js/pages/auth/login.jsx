import React,{useState } from "react";

import { Button, Checkbox, Form, Grid, Input, theme,message, Typography } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Login() {
    const { token } = useToken();
    const screens = useBreakpoint();
     const [loading, setLoading] = useState(false);
     const [messageApi, contextHolder] = message.useMessage();
       const navigate = useNavigate();
    const onFinish = async(values) => {
      setLoading(true);
        try {
          const response = await axios.post('/api/login', values);
          const { access_token } = response.data;
          // Save token in localStorage
          localStorage.setItem('token', access_token);
          messageApi.open({
            type: 'success',
            content: 'Login Successfully',
          });;
          navigate('/users');
        } catch (err) {
            console.log(err);
             messageApi.open({
              type: 'error',
              content: err.response?err.response.data.message:err.message,
            });
        } finally {
          setLoading(false);
        }
        // console.log("Received values of form: ", values);
    }

     const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px"
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
    }
  };

    return (
      <>
       <Helmet>
        <title>Login</title>
      </Helmet>
      {contextHolder}
         <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
        <Title style={styles.title}>Sign in</Title>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block="true" type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
          
          </Form.Item>
        </Form>
      </div>
    </section>
    </>
    );
}
