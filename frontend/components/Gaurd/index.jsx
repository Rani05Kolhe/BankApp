import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/module";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";

const Guard = ({ endpoint, role }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");

  const [authorised, setAuthorised] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userType, setUserType] = useState(null);

  // If token missing → redirect immediately
  if (!token) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const httpReq = http(token);
        const { data } = await httpReq.get(endpoint);

        const user = data?.data?.userType;
        setUserType(user);

        sessionStorage.setItem("userInfo", JSON.stringify(data?.data));

        setAuthorised(true);
        setLoader(false);
      } catch (err) {
        setUserType(null);
        setAuthorised(false);
        setLoader(false);
      }
    };

    verifyToken();
  }, [endpoint, token]);

  if (loader) return <Loader />;

  // Convert role to array so it supports: "admin" or ["admin","employee"]
  const allowedRoles = Array.isArray(role) ? role : [role];

  // Check if user role allowed
  if (authorised && allowedRoles.includes(userType)) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default Guard;
