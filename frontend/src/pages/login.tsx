// src/pages/Login.tsx

import React, { useState } from "react";
import { Input, Button, Card, Typography } from "antd";
import { LockOutlined, MailOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../components/UserContext";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/events/backend/user/authenticate", {
        email: formData.email,
        password: formData.password
      });

      console.log(response);

      if (response.status === 201 && response.data?.data) {
      
        const token = response.data.data.token;
        const email = response.data.data.email;
        const role = response.data.data.role;
      
        if (token && email && role) {
          console.log("login success");
          toast.success("Login successful!");
          localStorage.setItem("authToken", token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", role);

          const userData = {
            role: role,
          };

          // Update UserContext and local state
          setUser(userData);
          
          navigate("/layout");
        } else {
          toast.error("Unexpected response from server.");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <Card className="w-full max-w-md p-6 shadow-xl">
        <Title level={2} className="text-center text-indigo-700">Sign In</Title>
        <Text type="secondary" className="block mb-6 text-center">Welcome back! Please login to your account.</Text>

        <Input
          name="email"
          placeholder="Enter your email"
          prefix={<MailOutlined />}
          className="mb-4"
          value={formData.email}
          onChange={handleChange}
        />

        <Input.Password
          name="password"
          placeholder="Enter your password"
          prefix={<LockOutlined />}
          iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          className="mb-6"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="primary" block size="large" onClick={handleLogin}>
          Sign In
        </Button>

        <div className="mt-4 text-center">
          <Text type="secondary">Don't have an account? </Text>
          <a href="/signup" className="text-indigo-700">Sign Up</a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
