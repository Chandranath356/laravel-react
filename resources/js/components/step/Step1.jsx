import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
const Step1 = () => {
	const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
}
   return (
    <>
    	 <Form
		    name="basic"
		    labelCol={{ span: 8 }}
		    wrapperCol={{ span: 16 }}
		    style={{ maxWidth: 600 }}
		    initialValues={{ remember: true }}
		    onFinish={onFinish}
		    onFinishFailed={onFinishFailed}
		    autoComplete="off"
		  >
		    <Form.Item
		      label="Username"
		      name="username"
		      rules={[{ required: true, message: 'Please input your username!' }]}
		    >
		      <Input />
		    </Form.Item>
		    <Form.Item
		      label="Password"
		      name="password"
		      rules={[{ required: true, message: 'Please input your password!' }]}
		    >
		      <Input.Password />
		    </Form.Item>
		  </Form>
    </>
    );
};

export default Step1;