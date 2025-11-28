import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Table,
  Popconfirm,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { trimData, http, fetchData } from "../../../modules/module";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const { Item } = Form;

const Loans = () => {
  
const navigate = useNavigate();
  const [loanForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [allLoans, setAllLoans] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [edit, setEdit] = useState(null);
  const [reload, setReload] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);
  const [searchText, setSearchText] = useState("");

  // Fetch customers
  const { data: users } = useSWR("/api/users", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1200000,
  });

  // Convert to Select options
  useEffect(() => {
    if (users) {
      const list = users.data
        .filter((u) => u.userType === "customer")
        .map((c) => ({
          label: `${c.fullname} (${c.email})`,
          value: c._id, // Select stores id
          fullname: c.fullname, // For later use
          email: c.email,
        }));
      setAllCustomers(list);
    }
  }, [users]);

  // Fetch loans
  useEffect(() => {
    const load = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/loans");
        setAllLoans(data.data || []);
      } catch (err) {
        messageApi.error("Unable to fetch loans");
      }
    };
    load();
  }, [reload]);

  // Auto calculate total loan
  const handleLoanChange = () => {
    const v = loanForm.getFieldsValue();
    const p = Number(v.loanAmount);
    const r = Number(v.interest);
    const t = Number(v.duration);

    if (p > 0 && r >= 0 && t > 0) {
      const total = p + (p * r * t) / 1200;
      setTotalLoan(Number(total.toFixed(2)));
    } else {
      setTotalLoan(0);
    }
  };

  // Create loan
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const selected = allCustomers.find(
        (c) => c.value === values.customerName
      );

      const finalObj = {
        ...values,
        customerId: values.customerName,
        customerName: selected?.fullname || "", // FIX
        loanAmount: Number(values.loanAmount),
        interest: Number(values.interest),
        duration: Number(values.duration),
        totalLoan: totalLoan,
      };

      const httpReq = http();
      await httpReq.post("/api/loans", finalObj);

      messageApi.success("Loan created successfully!");
      loanForm.resetFields();
      setTotalLoan(0);
      setReload((r) => r + 1);
    } catch (err) {
      messageApi.error("Unable to create loan!");
    } finally {
      setLoading(false);
    }
  };

  // Update loan
  const onUpdate = async (values) => {
    try {
      setLoading(true);

      const selected = allCustomers.find(
        (c) => c.value === values.customerName
      );

      const finalObj = {
        ...values,
        customerId: values.customerName,
        customerName: selected?.fullname || "",
        loanAmount: Number(values.loanAmount),
        interest: Number(values.interest),
        duration: Number(values.duration),
        totalLoan: totalLoan,
      };

      const httpReq = http();
      await httpReq.put(`/api/loans/${edit._id}`, finalObj);

      messageApi.success("Loan updated successfully!");
      setEdit(null);
      loanForm.resetFields();
      setTotalLoan(0);
      setReload((r) => r + 1);
    } catch (err) {
      messageApi.error("Unable to update loan!");
    } finally {
      setLoading(false);
    }
  };

  // Edit loan
  const onEditLoan = (obj) => {
    setEdit(obj);

    loanForm.setFieldsValue({
      ...obj,
      customerName: obj.customerId, // FIX: set ID, not name
      startDate: obj.startDate?.split("T")[0],
      endDate: obj.endDate?.split("T")[0],
      dob: obj.dob?.split("T")[0],
      status: obj.status, // FIX
    });

    setTotalLoan(obj.totalLoan || 0);
  };

  // Delete loan
  const onDeleteLoan = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/loans/${id}`);
      messageApi.success("Loan deleted successfully!");
      setReload((r) => r + 1);
    } catch {
      messageApi.error("Unable to delete loan!");
    }
  };

  // Search Filter
  const filteredLoans = allLoans.filter((loan) => {
    if (!searchText) return true;
    const s = searchText.toLowerCase();
    return (
      (loan.customerName || "").toLowerCase().includes(s) ||
      (loan.loanType || "").toLowerCase().includes(s) ||
      String(loan.loanAmount || "").includes(s) ||
      (loan.status || "").toLowerCase().includes(s)
    );
  });
  const calculateEMI = (p, r, n) => {
  if (!p || !r || !n) return 0;

  const monthlyRate = r / 12 / 100;
  const emi =
    (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);

  return Number(emi.toFixed(2));
};


  // Table Columns
  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Loan Type", dataIndex: "loanType", key: "loanType" },
    { title: "Loan Amount", dataIndex: "loanAmount", key: "loanAmount" },
    { title: "Interest (%)", dataIndex: "interest", key: "interest" },
    { title: "Duration (Months)", dataIndex: "duration", key: "duration" },
//     {
//   title: "Monthly EMI (₹)",
//   key: "emi",
//    dataIndex: "emi", 
//   render: (record) => (
//     <span style={{ color: "green", fontWeight: 600 }}>
//       ₹ {calculateEMI(record.loanAmount, record.interest, record.duration)}
//     </span>
//   ),
// },
    {
      title: "Total Loan (₹)",
      dataIndex: "totalLoan",
      key: "totalLoan",
      render: (t) => (
        <span style={{ color: "#0d6efd", fontWeight: 600 }}>₹ {t}</span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (t) => (t ? new Date(t).toLocaleDateString() : ""),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (t) => (t ? new Date(t).toLocaleDateString() : ""),
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (t) => (t ? new Date(t).toLocaleDateString() : ""),
    },
    { title: "Status", dataIndex: "status", key: "status" },

    

    {
      title: "Action",
      key: "action",
      render: (_, obj) => (
        <div className="flex gap-1">
            <Button
        type="text"
        className="!bg-blue-100 !text-blue-500"
        onClick={() => navigate(`/admin/customerpro/${obj.customerId}`)}
      >
        View Profile
      </Button>
          <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined />}
            onClick={() => onEditLoan(obj)}
          />
          
          <Popconfirm
            title="Delete loan?"
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
      {contextHolder}

      <div className="grid md:grid-cols-3 gap-3">
        <Card title={edit ? "Edit Loan" : "Add New Loan"}>
          <Form
            form={loanForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
            onValuesChange={handleLoanChange}
          >
            <Item
              name="customerName"
              label="Customer Name"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Customer"
                options={allCustomers}
                showSearch
                optionFilterProp="label"
              />
            </Item>

            <Item name="loanType" label="Loan Type" rules={[{ required: true }]}>
              <Input placeholder="e.g. Personal, Home, etc." />
            </Item>

            <div className="grid md:grid-cols-3 gap-x-2">
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

              <Item
                name="duration"
                label="Duration (Months)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Item>
            </div>

            <div className="bg-blue-50 p-2 rounded text-center font-bold text-blue-600">
              Total Loan: ₹ {totalLoan}
            </div>

            <div className="grid md:grid-cols-2 gap-2">
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

            <Item name="status" label="Loan Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />
            </Item>

            <Item>
              <Button
                loading={loading}
                htmlType="submit"
                className={`!w-full !text-white !font-bold ${
                  edit ? "!bg-rose-500" : "!bg-blue-500"
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
          extra={
            <Input
              placeholder="Search loan..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          }
        >
          <Table
            columns={columns}
            dataSource={filteredLoans}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Loans;
