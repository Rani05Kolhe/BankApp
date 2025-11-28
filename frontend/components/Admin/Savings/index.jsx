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

const Savings = () => {
  const navigate = useNavigate();
  const [savingForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [allSavings, setAllSavings] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [edit, setEdit] = useState(null);
  const [reload, setReload] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [searchText, setSearchText] = useState("");

  // Fetch customers
  const { data: users } = useSWR("/api/users", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1200000,
  });

  useEffect(() => {
    if (users) {
      const list = users.data
        .filter((u) => u.userType === "customer")
        .map((c) => ({
          label: `${c.fullname} (${c.email})`,
          value: c._id,
          fullname: c.fullname,
          email: c.email,
        }));
      setAllCustomers(list);
    }
  }, [users]);

  // Fetch savings
  useEffect(() => {
    const load = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/savings");
        setAllSavings(data.data || []);
      } catch (err) {
        messageApi.error("Unable to fetch savings");
      }
    };
    load();
  }, [reload]);

  // Auto calculate total saving
  const handleSavingChange = () => {
    const v = savingForm.getFieldsValue();
    const amount = Number(v.amount);
    const interest = Number(v.interest);
    const duration = Number(v.duration);

    if (amount > 0 && interest >= 0 && duration > 0) {
      const total = amount + (amount * interest * duration) / 1200;
      setTotalSaving(Number(total.toFixed(2)));
    } else {
      setTotalSaving(0);
    }
  };

  // Create saving record
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const selected = allCustomers.find(
        (c) => c.value === values.customerId
      );

      const finalObj = {
        ...values,
        customerId: values.customerId,
        customerName: selected?.fullname || "",
        amount: Number(values.amount),
        interest: Number(values.interest),
        duration: Number(values.duration),
        totalSaving,
      };

      const httpReq = http();
      await httpReq.post("/api/savings", finalObj);

      messageApi.success("Saving added successfully!");
      savingForm.resetFields();
      setTotalSaving(0);
      setReload((r) => r + 1);
    } catch (err) {
      messageApi.error("Unable to add saving!");
    } finally {
      setLoading(false);
    }
  };

  // Update saving record
  const onUpdate = async (values) => {
    try {
      setLoading(true);

      const selected = allCustomers.find(
        (c) => c.value === values.customerId
      );

      const finalObj = {
        ...values,
        customerId: values.customerId,
        customerName: selected?.fullname || "",
        amount: Number(values.amount),
        interest: Number(values.interest),
        duration: Number(values.duration),
        totalSaving,
      };

      const httpReq = http();
      await httpReq.put(`/api/savings/${edit._id}`, finalObj);

      messageApi.success("Saving updated successfully!");
      setEdit(null);
      savingForm.resetFields();
      setTotalSaving(0);
      setReload((r) => r + 1);
    } catch (err) {
      messageApi.error("Unable to update saving!");
    } finally {
      setLoading(false);
    }
  };

  // Edit saving
  const onEditSaving = (obj) => {
    setEdit(obj);

    savingForm.setFieldsValue({
      ...obj,
      customerId: obj.customerId,
      startDate: obj.startDate?.split("T")[0],
      endDate: obj.endDate?.split("T")[0],
      dob: obj.dob?.split("T")[0],
      status: obj.status,
    });

    setTotalSaving(obj.totalSaving || 0);
  };

  // Delete
  const onDeleteSaving = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/savings/${id}`);
      messageApi.success("Saving deleted successfully!");
      setReload((r) => r + 1);
    } catch {
      messageApi.error("Unable to delete saving!");
    }
  };

  // Search Filter
  const filteredSavings = allSavings.filter((s) => {
    if (!searchText) return true;
    const sTxt = searchText.toLowerCase();
    return (
      (s.customerName || "").toLowerCase().includes(sTxt) ||
      (s.amount || "").toString().includes(sTxt) ||
      (s.status || "").toLowerCase().includes(sTxt)
    );
  });

  // Table Columns
  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Saving Amount (₹)", dataIndex: "amount", key: "amount" },
    { title: "Interest (%)", dataIndex: "interest", key: "interest" },
    { title: "Duration (Months)", dataIndex: "duration", key: "duration" },
    {
      title: "Total Amount (₹)",
      dataIndex: "totalSaving",
      key: "totalSaving",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Button
            type="text"
            className="!bg-blue-100 !text-blue-500"
            onClick={() =>
              navigate(`/admin/customerpro/${obj.customerId}`)
            }
          >
            View Profile
          </Button>

          <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined />}
            onClick={() => onEditSaving(obj)}
          />

          <Popconfirm
            title="Delete saving?"
            onConfirm={() => onDeleteSaving(obj._id)}
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
        <Card title={edit ? "Edit Saving" : "Add New Saving"}>
          <Form
            form={savingForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
            onValuesChange={handleSavingChange}
          >
            <Item
              name="customerId"
              label="Customer"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Customer"
                options={allCustomers}
                showSearch
                optionFilterProp="label"
              />
            </Item>

            <Item name="amount" label="Saving Amount" rules={[{ required: true }]}>
              <Input type="number" />
            </Item>

            <Item name="interest" label="Interest (%)" rules={[{ required: true }]}>
              <Input type="number" />
            </Item>

            <Item name="duration" label="Duration (Months)" rules={[{ required: true }]}>
              <Input type="number" />
            </Item>

            <div className="bg-blue-50 p-2 rounded text-center font-bold text-blue-600">
              Total Saving: ₹ {totalSaving}
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Item>

              <Item name="endDate" label="End Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Item>
            </div>

            <Item name="status" label="Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Completed", value: "completed" },
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
                {edit ? "Update Saving" : "Submit"}
              </Button>
            </Item>
          </Form>
        </Card>

        <Card
          title="Savings List"
          className="md:col-span-2"
          extra={
            <Input
              placeholder="Search saving..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          }
        >
          <Table
            columns={columns}
            dataSource={filteredSavings}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Savings;
