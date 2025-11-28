import { Card, Input, Form, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {trimData, http} from "../../../modules/module";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
const {Item} =Form;


const Login =() => {
   const cookies = new Cookies();
   const expires = new Date();
   expires.setDate(expires.getDate() + 3);
    
   const navigate = useNavigate();
    const [messageApi,context ]= message.useMessage();
  
    const onFinish= async (values)=>{
        try{
            const finalObj =trimData(values);
            const httpReq = http();
            const {data} = await httpReq.post("/api/login",finalObj);
            if(data?.isLoged && data?.userType === "admin"){
               const {token} = data;
               cookies.set("authToken",token,{
                path:"/",
                expires
               });
               navigate("/admin");
            }
              else if(data?.isLoged && data?.userType === "employee"){
               const {token} = data;
               cookies.set("authToken",token,{
                path:"/",
                expires
               });
               navigate("/employee");
            } else if(data?.isLoged && data?.userType === "customer"){
               const {token} = data;
               cookies.set("authToken",token,{
                path:"/",
                expires
               });
               navigate("/customer");
            }else {
                return message.warning("Wrong Credencials !");
            }



        }catch(err){
           messageApi.error(err?.response?.data?.message);        }
         
    }
    return(
      
        <div className="flex"> 
          {context}
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img 
                src="/bank-img.png" 
                alt="Bank-img"
                className="w-4/5 object-contain"
                />
            </div>
            <div className="w-full md:w-1/2 flex item-center justify-center p-6 bg-white">
               <Card className="w-1/2 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-center mb-6">
                    Bank Login
                  </h2>
                  <Form 
                  name="login" 
                  onFinish={onFinish}
                  layout="vertical"
              >
                <Item name="email" lable="Username" rules={[{required:true}]}>
                    <Input prefix={<UserOutlined/>} placeholder="Enter your name"></Input>
                </Item>
                

                 <Item name="password" lable="Password" rules={[{required:true}]}>
                    <Input prefix={<LockOutlined/>} placeholder="Enter your Password"></Input>
                </Item>

                <Item >
                    <Button type="text"
                    htmlType="submit"
                    block
                       className="!bg-blue-500 !text-white !font-bold">
                     
                        Login
                    </Button>
                    
                </Item>
                  </Form>
               </Card>
            </div>
        </div>
    )
}
export default Login;