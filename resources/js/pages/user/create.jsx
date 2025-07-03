import React, { useState, useRef,useEffect  } from 'react';
import { Steps, Form, Input, Button, message,theme,Space,DatePicker   } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { saveOffline, getUnsyncedForms, markAsSynced } from "../../indexDBHelper";
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
const steps = [
  {
    title: 'Basic Details',
    content:     <>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
             <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email address' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
             <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter your phone' },
               { pattern: /^\d{10}$/, message: 'Phone must be 10 digits' },
            ]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>
          <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input.TextArea placeholder="Enter address" rows={2} />
        </Form.Item>
        </>,
  },
  {
    title: 'Education Details',
    content:
    <Form.List name="users"  >
      {(fields, { add, remove }) => (
        <>
          {fields.map(_a => {
            var { key, name } = _a,
              restField = __rest(_a, ['key', 'name']);
            return (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'skills']}
                  rules={[{ required: true, message: 'Missing Skills' }]}
                >
                  <Input placeholder="Skills" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'university-name']}
                  rules={[{ required: true, message: 'Missing University Name' }]}
                >
                  <Input placeholder="University Name" />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                )}
              </Space>
            );
          })}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Education Details
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
 ,
  },
];
const generatePDF = async (values) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('User Details', 20, 20);

  // Basic Details
  doc.setFontSize(12);
  doc.text(`Username: ${values.username}`, 20, 35);
  doc.text(`Email: ${values.email}`, 20, 45);
  doc.text(`Phone: ${values.phone}`, 20, 55);
  doc.text(`Address: ${values.address}`, 20, 65);
  // Divider
  doc.setDrawColor(0);
 doc.line(20, 75, 190, 75);

  // Education Section
  doc.setFontSize(16);
  doc.text('Education Details', 20, 85);
  doc.setFontSize(12);

  if (Array.isArray(values.users)) {
     values.users.forEach((edu, index) => {
      const y = 95 + index * 20;
      doc.text(`• Skills: ${edu.skills}`, 25, y);
      doc.text(`  University: ${edu['university-name']}`, 25, y + 7);
    });
  }

  doc.save('submitted_form.pdf');
};
export default function UserCreate() {
	const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const addUserRef = useRef(null); 
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('token');
    const navigate = useNavigate();
  const onFinish = async(values) => {
     setLoading(true);
     if (navigator.onLine) {
         try {
            await axios.post('/api/store-user', values,{
              headers: {
                Authorization: `Bearer ${access_token}`,
                // other headers if needed:
                'Content-Type': 'application/json'
              }
            });
            
          } catch (err) {
             if (error.response.status === 401) {
               localStorage.removeItem('token');
                navigate('/users');
             }
            await saveOffline("formA", values);
          }finally {
            setLoading(false);
          }
     }else{
        try {
          await saveOffline("formA", values); 
        }catch (err) {

        }finally {
          setLoading(false);
        }
     }
    await generatePDF(values);
    form.resetFields();
    setCurrent(0);
    messageApi.open({
        type: 'success',
        content: 'Form has been submitted successfully',
      });
  };
   const next = async () => {
    try {
        if (current === 0) {
          await form.validateFields(["username", "email", "phone","address"]);
        } else if (current === 1) {
        const users = form.getFieldValue("users");
        if (!users || users.length === 0) {
          message.error("Please add at least one education detail.");
          return;
        }
      await form.validateFields([["users"]]);
    }
      setCurrent((prev) => prev + 1);
    } catch (error) {
      // Validation failed
    }
     // const users = form.getFieldValue("users");
    
  };
  const prev = () => {
    setCurrent(current - 1);
  };
	  const items = steps.map(item => ({ key: item.title, title: item.title }));
	   const contentStyle = {
	    padding: '20px',
	    color: token.colorTextTertiary,
	    backgroundColor: token.colorFillAlter,
	    borderRadius: token.borderRadiusLG,
	    border: `1px dashed ${token.colorBorder}`,
	    marginTop: 16,
	  };

	return (
		<>
    <Helmet>
        <title>Users</title>
      </Helmet>
    {contextHolder}
		  <Steps current={current} items={steps.map((item) => ({ key: item.title, title: item.title }))} />
	         <Form
	        form={form}
	        layout="vertical"
	        name="user_create_form"
	        onFinish={onFinish}
	        style={contentStyle}
          initialValues={{users: [{}] }}
	      >
        <div id="form-to-pdf">
	     {steps.map((step, index) => (
          <div key={index} style={{ display: index === current ? 'block' : 'none' }}>
            {step.content}
          </div>
        ))}
	     </div>
	      <div style={{ marginTop: 24 }}>
	       {current > 0 && (
	          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
	            Previous
	          </Button>
	        )}
	        {current < steps.length - 1 && (
	          <Button type="primary" onClick={() => next()}>
	            Next
	          </Button>
	        )}
	        {current === steps.length - 1 && (
	            <Button type="primary" htmlType="submit" loading={loading}>
              Done
            </Button>
	        )}
	       
	      </div>
	      </Form>
		</>
	)
}