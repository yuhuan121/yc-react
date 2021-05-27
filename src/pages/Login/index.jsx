import React, { Component } from 'react'
import {reqLogin} from '../../api'
import { Form, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import './index.css'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class index extends Component {
  onFinish = async(values) => {
    const {username, password} = values
    const data = "username="+username+"&password="+password
    const result = await reqLogin(data) 
    // console.log('请求成功', result)
		let { history } = this.props
    if (result.status === 200) { // 登陆成功
      message.success('登录成功！');
      
      history.push('/');
      
    } else { // 登陆失败
      message.error('登录失败，请确认账号和密码是否正确');
    }
  }
  onFinishFailed = () => {
    message.error('登录失败，请确认账号和密码是否正确');
  }
  
  render() {
    return (
      <div>
        <div className="loginBox">
          <div className="loginTitle">登录</div>
        <Form {...layout}
            name="login"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item 
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入您的用户名',
                }
              ]}
            > 
              <Input />
            </Form.Item>
      
            <Form.Item 
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
              >
              <Input.Password />
            </Form.Item>
      
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className="btn_submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
