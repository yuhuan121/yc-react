import React, { Component, useState } from 'react'
import { reqAllCoach, reqCoachAdd } from '../../api'
import { Breadcrumb, Table, Result, Button, Space, Modal, Form, Input, Radio, DatePicker, message } from 'antd';
import {Link} from 'react-router-dom'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


// 添加教练
interface Values {
  coachIdNumber: string,
  // coachPassword: string,
  coachPhone: string,
  coachRealName: string,
  coachSex: number,
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
      title="添加教练信息"
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
          name="coachIdNumber"
          label="教练身份证"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="coachPassword"
          label="教练密码"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="coachRealName"
          label="教练姓名"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coachPhone"
          label="教练手机号"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="coachSex"
          label="教练性别"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="0">女</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);
  const onCreate = async(values: any) => {
    // console.log('添加教练信息: ', values);
    
    const addCoach  = await reqCoachAdd(values)
    // console.log("请求成功:",addCoach)
    if (addCoach.status === 200) { 
      message.success('添加成功！');
      setTimeout(()=>{window.location.reload();},500); 
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
        添加教练
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
      coachInfo: [],
      islogin: true,
      searchText: '',
      searchedColumn: '',
    }
  }
  
  componentDidMount = async() => {
    const coach = await reqAllCoach()
    let ifsex
    coach.status == "200" ? (
    coach.data.map( item => (
      item.coachSex == 1 ? ifsex="男" : ifsex= "女",
      this.setState({
        coachInfo: [
          ... this.state.coachInfo,
          {
            key: item.coachId,
            name: item.coachRealName,
            sex: ifsex,
            phone: item.coachPhone,
            coachIdNumber: item.coachIdNumber,
            // coachPassword: item.coachPassword,
            createTime: item.createdTime,
            updateTime: item.updatedTime,
          }
        ]
      })
    ))
    ) : (
      this.setState({islogin: false})
    )
    console.log(coach.data)
  }
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
    const { coachInfo, islogin } = this.state
    const columns = [
      {
        title: '身份证',
        width: 160,
        dataIndex: 'coachIdNumber',
        key: 'coachIdNumber',
        fixed: 'left',
        ...this.getColumnSearchProps('coachIdNumber'),
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
      //   dataIndex: 'coachPassword',
      //   key: 'coachPassword',
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
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 150,
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
          <Breadcrumb.Item>教练基本信息</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{background: '#fff', padding: '10px 0'}}>
          <div style={{margin: '0 10px 10px'}}><CollectionsPage /></div>
          <div>
          <Table columns={columns} dataSource={coachInfo} scroll={{ x: 910 }}/>          </div>
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

