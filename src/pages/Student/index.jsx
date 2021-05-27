import React, { Component, useState } from 'react'
import {reqAllStu, reqStuAdd} from '../../api'
import { Table, Result, Button, Space, Modal, Form, Input, Radio, DatePicker, message, Select, Breadcrumb } from 'antd';
import {Link} from 'react-router-dom'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { trainType }from '../../assets/js/data'

// 训练类型选择器
const { Option } = Select;
// 添加学生
interface Values {
  coachId: number,
  coachId_2: number,
  coachId_3: number,
  exam_1: string,
  exam_2: string,
  exam_3: string,
  exam_4: string,
  studentAddress: string,
  studentIdNumber: string,
  // studentPassword: string,
  studentPhone: string,
  studentProgress: number,
  studentRealName: string,
  studentSex: number,
  studentSignupDate: string,
  studentType: number,
}

interface CollectionCreateFormProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  
  const timeFormat = (value, dateString) => {
    return dateString
  }
  
  return (
    <Modal
      visible={visible}
      title="添加学生信息"
      okText="添加"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('提交失败:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="studentIdNumber"
          label="学生身份证"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="studentPassword"
          label="学生密码"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="studentRealName"
          label="学生姓名"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="studentPhone"
          label="学生手机号"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="studentSex"
          label="学生性别"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="0">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="studentType"
          label="学生类型"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="0">C1</Radio.Button>
            <Radio.Button value="1">C2</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="studentAddress"
          label="学生地址"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="studentProgress"
          label="训练类型"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Select 
              options={trainType} 
              style={{ width: 300, padding: 0 }}
              placeholder="全部"
              allowClear={true}
            />
        </Form.Item>
        <Form.Item
          name="studentSignupDate"
          label="注册日期"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coachId"
          label="教练1"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coachId_2"
          label="教练2"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coachId_3"
          label="教练3"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="exam_1"
          label="科目一"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="exam_2"
          label="科目二"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="exam_3"
          label="科目三"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="exam_4"
          label="科目四"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);
  const onCreate = async(values: any) => {
    // console.log('添加学生信息: ', values);
    const addStu  = await reqStuAdd(values)
    // console.log("请求成功:",addStu)
    if (addStu.status === 200) { 
      message.success('添加成功！');
      setTimeout(()=>{window.location.reload();},500); //暴力强制刷新，不推荐
    } else { 
      message.error('添加失败');
    }
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        添加学生
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};


export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stuInfo: [],
      islogin: true,
      searchText: '',
      searchedColumn: '',
    }
  }
  
  componentDidMount = async() => {
    const student = await reqAllStu()
    let { history } = this.props
    let ifsex, ifstudentProgress
    student.status == "200" ? (
    student.data.map( item => (
      item.studentSex == 1 ? ifsex="男" : ifsex= "女",
      item.studentProgress == "12" && ( ifstudentProgress="C1 科目二" ),
      item.studentProgress == "13" && ( ifstudentProgress="C1 科目三"),
      item.studentProgress == "22" && ( ifstudentProgress="C2 科目二"),
      item.studentProgress == "23" && ( ifstudentProgress="C2 科目三"),
      this.setState({
        stuInfo: [
          ... this.state.stuInfo,
          {
            key: item.studentId,
            name: item.studentRealName,
            sex: ifsex,
            address: item.studentAddress,
            phone: item.studentPhone,
            exam1: item.exam_1,
            exam2: item.exam_2,
            exam3: item.exam_3,
            exam4: item.exam_4,
            coachId: item.coachId,
            coachId_2: item.coachId_2,
            coachId_3: item.coachId_3,
            studentIdNumber: item.studentIdNumber,
            studentProgress: ifstudentProgress,
            // studentPassword: item.studentPassword,
            
          }
        ]
      })
    ))
    ) : (
      this.setState({islogin: false})
    )
  }

  // 查询
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  
  render() {
    const { stuInfo, islogin } = this.state
    const columns = [
      {
        title: '身份证',
        width: 200,
        dataIndex: 'studentIdNumber',
        key: 'studentIdNumber',
        fixed: 'left',
        ...this.getColumnSearchProps('studentIdNumber'),
      },
      {
        title: '姓名',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        ...this.getColumnSearchProps('name')
      },
      // {
      //   title: '密码',
      //   width: 150,
      //   dataIndex: 'studentPassword',
      //   key: 'studentPassword',
      //   ...this.getColumnSearchProps('studentPassword'),
      // },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 100,
        ...this.getColumnSearchProps('sex'),
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        width: 150,
        ...this.getColumnSearchProps('phone'),
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 150,
        ...this.getColumnSearchProps('address'),
      },
      {
        title: '科目一',
        dataIndex: 'exam1',
        key: 'exam1',
        width: 150,
      },
      {
        title: '科目二',
        dataIndex: 'exam2',
        key: 'exam2',
        width: 150,
      },
      {
        title: '科目三',
        dataIndex: 'exam3',
        key: 'exam3',
        width: 150,
      },
      {
        title: '科目四',
        dataIndex: 'exam4',
        key: 'exam4',
        width: 150,
      },
      {
        title: '教练一',
        dataIndex: 'coachId',
        key: 'coachId',
        width: 100,
        ...this.getColumnSearchProps('coachId'),
      },
      {
        title: '教练二',
        dataIndex: 'coachId_2',
        key: 'coachId2',
        width: 100,
        ...this.getColumnSearchProps('coachId2'),
      },
      {
        title: '教练三',
        dataIndex: 'coachId_3',
        key: 'coachId3',
        width: 100,
        ...this.getColumnSearchProps('coachId3'),
      },
      { title: '训练类型', dataIndex: 'studentProgress', key: 'studentProgress', width: 150,
        ...this.getColumnSearchProps('studentProgress'),
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: () => (
        <Space size="middle">
        <a>编辑</a>
        <a>删除</a>
      </Space>)
      },
    ];

    

    return (
      <div>
        {
        islogin == true ? (
        <div>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>学生基本信息</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{background: '#fff', padding: '10px 0'}}>
            <div style={{margin: '0 10px 10px'}}><CollectionsPage /></div>
            <div>
                <Table columns={columns} dataSource={stuInfo} scroll={{ x: 1860 }} />
            </div>
          </div>
        </div>
        ) :(
          <Result
            status="403"
            title="403"
            subTitle="抱歉，您没有权限访问该页面"
            extra={<Button onClick={() => setTimeout(() => {window.location.reload()}, 200)}><Link to="/login">Back Login</Link></Button>}
          />
        )
      }
      </div>
    )
  }
}
