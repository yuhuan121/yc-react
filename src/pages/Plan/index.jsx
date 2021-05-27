import React, { Component, useState } from 'react'
import { reqAllPlan, reqPlanAdd } from '../../api'
import { Breadcrumb, Table, Result, Button, Space, Modal, Form, Input, Radio, DatePicker, message, Select } from 'antd';
import {Link} from 'react-router-dom'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { trainType }from '../../assets/js/data'
import moment from 'moment';

// 添加教练
interface Values {
  coachId: number,
  planBooked: number,
  planLimit: number,
  planName: string,
  planStart: string,
  planEnd: string,
  planType: number,
  shuttle: number,
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

  
  return (
    <Modal
      visible={visible}
      title="添加计划"
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
          name="planName"
          label="项目名称"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="planType"
          label="训练类型"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Select 
              options={trainType} 
              style={{ width: 300, padding: 0 }}
              allowClear={true}
            />
        </Form.Item>
        <Form.Item
          name="coachId"
          label="教练"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="planBooked"
          label="预约人数"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="planLimit"
          label="名额"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="shuttle"
          label="是否接送"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="planStart"
          label="开始时间"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <DatePicker 
            placeholder="选择时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
        <Form.Item
          name="planEnd"
          label="结束时间"
          rules={[{ required: true, message: '未填写信息！' }]}
        >
          <DatePicker 
            placeholder="选择时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);
  const onCreate = async(values: any) => {
    // console.log('添加计划信息: ', values);
    values.planStart = moment(values.planStart).format("YYYY-MM-DD HH:mm:ss")
    values.planEnd = moment(values.planEnd).format("YYYY-MM-DD HH:mm:ss")
    const addPlan  = await reqPlanAdd(values)
    // console.log("请求成功:",addPlan)
    if (addPlan.status === 200) { 
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
        添加接送计划
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
      planInfo: [],
      islogin: true,
    }
  }
  
  componentDidMount = async() => {
    const plan = await reqAllPlan()
    let ifshuttle, ifplanType
    plan.status == "200" ? (
      plan.data.map( async(item) => (
        item.shuttle == 1 ? ifshuttle="是" : ifshuttle="否",
        item.planType == "12" && ( ifplanType="C1 科目二" ),
        item.planType == "13" && ( ifplanType="C1 科目三"),
        item.planType == "22" && ( ifplanType="C2 科目二"),
        item.planType == "23" && ( ifplanType="C2 科目三"),
      this.setState({
        planInfo: [
          ... this.state.planInfo,
          {
            planId: item.planId,
            planName: item.planName,
            coachId: item.coachId,
            planBooked: item.planBooked,
            planStart: item.planStart,
            planEnd: item.planEnd,
            createdTime: item.createdTime,
            planLimit: item.planLimit,
            updatedTime: item.updatedTime,
            planType: ifplanType,
            shuttle: ifshuttle,
          }
        ]
      })
    ))
    ) : (
      this.setState({islogin: false})
    )
    console.log("接送计划：", plan.data)
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
    const { planInfo, islogin } = this.state
    const columns = [
      {
        title: '编号',
        width: 100,
        dataIndex: 'planId',
        key: 'planId',
        fixed: 'left',
      },
      {
        title: '名称',
        width: 100,
        dataIndex: 'planName',
        key: 'planName',
        fixed: 'left',
        ...this.getColumnSearchProps('planName'),
      },
      {
        title: '教练id',
        dataIndex: 'coachId',
        key: 'coachId',
        width: 150,
        ...this.getColumnSearchProps('coachId'),
      },
      {
        title: '预约人数',
        dataIndex: 'planBooked',
        key: 'planBooked',
        width: 150,
        ...this.getColumnSearchProps('planBooked'),
      },
      {
        title: '开始时间',
        dataIndex: 'planStart',
        key: 'planStart',
        width: 150,
        ...this.getColumnSearchProps('planStart'),
      },
      {
        title: '结束时间',
        dataIndex: 'planEnd',
        key: 'planEnd',
        width: 150,
        ...this.getColumnSearchProps('planEnd'),
      },
      {
        title: '名额',
        dataIndex: 'planLimit',
        key: 'planLimit',
        width: 150,
        ...this.getColumnSearchProps('planLimit'),
      },
      {
        title: '训练类型',
        dataIndex: 'planType',
        key: 'planType',
        width: 150,
        ...this.getColumnSearchProps('planType'),
      },
      {
        title: '是否接送',
        dataIndex: 'shuttle',
        key: 'shuttle',
        width: 150,
        ...this.getColumnSearchProps('shuttle'),
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        key: 'updatedTime',
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
          <Breadcrumb.Item>计划基本信息</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{background: '#fff', padding: '10px 0'}}>
          <div style={{margin: '0 10px 10px'}}><CollectionsPage /></div>
          <div>
            <Table columns={columns} dataSource={planInfo} scroll={{ x: 1700 }}/>
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