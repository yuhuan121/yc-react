import React, { Component } from 'react'
import { reqAllBooking } from '../../api'
import { Table, Result, Button } from 'antd';
import {Link} from 'react-router-dom'

const columns = [
  {
    title: '编号',
    width: 100,
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '进度',
    width: 100,
    dataIndex: 'progress',
    key: 'progress',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 150,
  },
  {
    title: 'planId',
    dataIndex: 'planId',
    key: 'planId',
    width: 150,
  },
  {
    title: 'shuttle',
    dataIndex: 'shuttle',
    key: 'shuttle',
    width: 150,
  },
  {
    title: 'studentId',
    dataIndex: 'studentId',
    key: 'studentId',
    width: 150,
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>删除</a>,
  },
];


export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bookingInfo: [],
      islogin: true,
    }
  }
  
  componentDidMount = async() => {
    const booking = await reqAllBooking()
    let oneStu ;
    booking.status == "200" ? (
      booking.data.map( async(item) => (
      this.setState({
        bookingInfo: [
          ... this.state.bookingInfo,
          {
            key: item.bookingId,
            progress: item.bookingProgress,
            state: item.bookingState,
            planId: item.planId,
            shuttle: item.shuttle,
            studentId: item.studentId,
          }
        ]
      })
    ))
    ) : (
      this.setState({islogin: false})
    )
    console.log("预约：", booking.data)
  }

  render() {
    const { bookingInfo, islogin } = this.state
    return (
      <div>
        {
          islogin == true ? (
            <Table columns={columns} dataSource={bookingInfo} />
            )
          :(
            <Result
              status="403"
              title="403"
              subTitle="抱歉，您没有权限访问该页面"
              extra={<Button onClick={() => setTimeout(() => {window.location.reload()}, 500)}><Link to="/login">Back Login</Link></Button>}
            />
          )
        }
      </div>
    )
  }
}

