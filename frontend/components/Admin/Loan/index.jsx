import { Button, Card, Form, Input, message, Select, Table, Popconfirm, DatePicker } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { trimData, http, fetchData } from "../../../modules/module";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { useEffect, useState } from "react";

const { Item } = Form;

const Loan = () => {
  const [loanForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allLoans, setAllLoans] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  // ✅ Fetch Employees for Dropdown
  const { data: employees, error: eError } = useSWR("/api/users", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1200000,
  });

  useEffect(() => {
  if (employees) {
    const filter = employees.data
      .filter((emp) => emp.userType === "employee")
      .map((item) => ({
        label: `${item.fullname} (${item.email})`,
        value: item.email,
        key: item._id,
      }));
    setAllEmployees(filter);
  }
}, [employees]);


  // ✅ Fetch all loan data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/loans");
        setAllLoans(data.data);
      } catch (err) {
        messageApi.error("Unable to fetch loans");
      }
    };
    fetcher();
  }, [no]);

  // ✅ Create new loan
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);

      const httpReq = http();
      await httpReq.post("/api/loans", finalObj);

      messageApi.success("Loan created successfully!");
      loanForm.resetFields();
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to create loan!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Loan
  const onEditLoan = async (obj) => {
    setEdit(obj);
    loanForm.setFieldsValue({
      ...obj,
      startDate: obj.startDate ? obj.startDate.split("T")[0] : "",
      endDate: obj.endDate ? obj.endDate.split("T")[0] : "",
      dob: obj.dob ? obj.dob.split("T")[0] : "",
    });
  };

  // ✅ Update Loan
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      const httpReq = http();
await httpReq.put(`/api/loans/${edit._id}`, finalObj);

      messageApi.success("Loan updated successfully!");
      setEdit(null);
      loanForm.resetFields();
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to update loan!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Loan
  const onDeleteLoan = async (id) => {
    try {
      const httpReq = http();
await httpReq.delete(`/api/loans/${id}`);
      messageApi.success("Loan deleted successfully!");
      setNo(no + 1);
    } catch (err) {
      messageApi.error("Unable to delete loan!");
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      key: "loanAmount",
    },
    {
      title: "Interest (%)",
      dataIndex: "interest",
      key: "interest",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Edit this loan?"
            onConfirm={() => onEditLoan(obj)}
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            />
          </Popconfirm>

          <Popconfirm
            title="Delete this loan?"
            description="This action cannot be undone!"
            onConfirm={() => onDeleteLoan(obj._id)}
          >
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
        <Card title={edit ? "Edit Loan" : "Add New Loan"}>
          <Form
            form={loanForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
          >
            <Item
              name="employeeName"
              label="Employee Name"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Employee"
                options={allEmployees}
                showSearch
              />
            </Item>

            <Item
              name="email"
              label="Employee Email"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item name="branch" label="Branch" rules={[{ required: true }]}>
              <Input />
            </Item>

            <Item name="loanType" label="Loan Type" rules={[{ required: true }]}>
              <Input />
            </Item>

            <div className="grid md:grid-cols-2 gap-x-2">
              <Item
                name="loanAmount"
                label="Loan Amount"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Item>
              <Item
                name="interest"
                label="Interest (%)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Item>
            </div>

            <div className="grid md:grid-cols-2 gap-x-2">
              <Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Item>
              <Item name="endDate" label="End Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Item>
            </div>

            <Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <Input type="date" />
            </Item>

            <Item>
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className={`!w-full !font-bold ${
                  edit ? "!bg-rose-500 !text-white" : "!bg-blue-500 !text-white"
                }`}
              >
                {edit ? "Update Loan" : "Submit"}
              </Button>
            </Item>
          </Form>
        </Card>

        <Card
          className="md:col-span-2"
          title="Loan List"
          style={{ overflowX: "auto" }}
        >
          <Table
            columns={columns}
            dataSource={allLoans}
            rowKey="_id"
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Loan;