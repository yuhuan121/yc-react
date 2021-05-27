import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  ContactsOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
import Student from '../Student'
import Coach from '../Coach'
import Plan from '../Plan'
import Booking from '../Booking'
import NotFound from '../NotFound'
import {reqAllStu} from '../../api'
// import LeftNav from '../../components/leftNav'

const { Header, Content, Footer, Sider } = Layout;

export default class index extends Component {
  state = {
    collapsed: false,
  };
  
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    let { history } = this.props

    const { collapsed } = this.state;
    return(
      <div>
        <Router>
        <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div style={{height:32, margin: 16, background: 'rgba(255, 255, 255, 0.3)'}}></div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}><Link to="/student">学生</Link></Menu.Item>
            <Menu.Item key="2" icon={<ContactsOutlined />}><Link to="/coach">教练</Link></Menu.Item>
            <Menu.Item key="3" icon={<CalendarOutlined />}><Link to="/plan">计划</Link></Menu.Item>            
            {/* <Menu.Item key="4">
              <Link to="/booking">预约信息</Link>
            </Menu.Item> */}

          </Menu> 
        </Sider>
        <Layout>
          <Content style={{margin: 20}}>
            <Switch>
              <Redirect from='/' exact to='/student'/>
              <Route path="/student" component={Student}/>
              <Route path="/plan" component={Plan}/>
              <Route path="/booking" component={Booking}/>
              <Route path="/coach" component={Coach}/>
              <Route component={NotFound}/>
            </Switch>
          </Content>
            
        </Layout>
      </Layout>
      </Router>
    </div>
    )
  }
}
