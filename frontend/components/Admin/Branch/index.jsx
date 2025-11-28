import { Button, Card, Form, Input, message, Image, Table, Popconfirm } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { trimData, http } from "../../../modules/module";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import Password from "antd/es/input/Password";

const { Item } = Form;
const Branch = () => {
  //states collection

  const [branchForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [edit,setEdit] = useState(null);  
  const [no,setNo] = useState(0);
  //get app employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/branch");
        setAllBranch(data.data);
      } catch (err) {
        messageApi.error("Unable to fetch data");
      }
    };
    fetcher();
  }, [no]);

  //create new emloyee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.key = finalObj.branchName
      const httpReq = http();
      const { data } = await httpReq.post(`/api/branch`, finalObj);

      messageApi.success("Branch created !");
      branchForm.resetFields();
     
      setNo(no+1);
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        branchForm.setFields([
          {
            name: "branchName",
            errors: ["Branch already exists !"],
          },
        ]);
      } else {
        messageApi.error("Try again later");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // update employee
const onEditBranch = async (obj) =>{
    setEdit(obj);
    branchForm.setFieldsValue(obj);
  }
  //update

  const onUpdate = async (values) =>{
  try{
  setLoading(true);
  let finalObj = trimData(values);
 
  const httpReq = http();
  await httpReq.put(`/api/branch/${edit._id}`,finalObj);
  messageApi.success("Branch updated successfully !");
  setNo(no+1);
  setEdit(null);
  branchForm.resetFields();

  }
  catch(err){
    messageApi.error("Unable to update branch !")
  }finally{
    setLoading(false);
  }}
  // delete employee

  const onDeleteBranch = async (id) => {
    try{
         const httpReq = http();
         await httpReq.delete(`/api/branch/${id}`);
         messageApi.success("Branch delated successfully !");
         setNo(no+1);
    }catch(err){
         messageApi.error("Unable to delete branch !");

    }
  }

  //columns for table
  const columns = [

    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
 
    {
      title: "Branch Address",
      dataIndex: "branchAddress",
      key: "branchAddress",
    },
    {
      title: "Action",
      key: "action",
      fixed:"right",
      render: (_, obj) => (
        <div className="flex gap-1">
      <Popconfirm 
       title="Are you sure ?"
       description="Once you deleted, you can not re-store !"
       onCancel={() => messageApi.info("NO Changes occure !")}
       onConfirm={()=>onEditBranch(obj) }>
      
          <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined />}
          />

        </Popconfirm>


           <Popconfirm 
       title="Are you sure ?"
       description="Once you deleted, you can not re-store !"
       onCancel={() => messageApi.info("Your data is safe !")}
       onConfirm={()=>onDeleteBranch(obj._id) }>
        <Button
            type="text"
            className="!bg-pink-100 !text-pink-500"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
        
        </div>
      ),
    },
  ];
  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add new branch">

          <Form form={branchForm}
           onFinish={edit ? onUpdate : onFinish} 
           layout="vertical">
     
            <div className="grid md:grid-cols-2 gap-x-2">
              <Item
                name="branchName"
                label="Branch Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Item>
              
            </div> 
            <Item label="Branch Address" name="branchAddress">
              <Input.TextArea />
            </Item>
            <Item>
              {
                edit ? 
                <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-rose-500 !text-white !text-white !font-bold !w-full"
              >
               Update
              </Button>
              :
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !text-white !text-white !font-bold !w-full"
              >
                Submit
              </Button>
              }
            </Item>

          </Form>
        </Card>
        <Card className="md:col-span-2" title="branch list" style={{overflowX :"auto"}}>
          <Table columns={columns} 
          dataSource={allBranch} 
          scroll={{x:"max-content"}}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};
export default Branch;
