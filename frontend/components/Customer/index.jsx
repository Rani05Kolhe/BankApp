import Customerlayout from "../Layout/Customerlayout";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const customerId = userInfo?._id; // correct ID from backend

  return (
    <Customerlayout>
      <h1 className="text-5xl font-bold text-red-500">
        Welcome to Customer Panel
      </h1>

      <Button
        type="text"
        className="!bg-blue-100 !text-blue-500 mt-4"
        onClick={() => navigate(`/customer/customerpro/${customerId}`)}
      >
        View Profile
      </Button>
    </Customerlayout>
  );
};

export default CustomerDashboard;
