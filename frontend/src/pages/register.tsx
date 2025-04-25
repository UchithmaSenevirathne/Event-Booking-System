// src/pages/SignUp.tsx

import React, { useState } from "react";
import { Input, Button, Card, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password, confirmPassword } = formData;
    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/events/backend/user/register", {
        email: formData.email,
        password: formData.password,
        role: "USER"
      });

      if (response.status === 201) {
        toast.success("Registration successful!");
        setFormData({ email: "", password: "", confirmPassword: "" });
      }
    } catch (error: any) {
      if (error.response?.status === 406) {
        toast.error("Email already used!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <Card className="w-full max-w-md p-6 shadow-xl">
        <Title level={2} className="text-center text-indigo-700">Sign Up</Title>
        <Text type="secondary" className="block mb-6 text-center">Enter your details to create an account</Text>

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
          className="mb-4"
          value={formData.password}
          onChange={handleChange}
        />

        <Input.Password
          name="confirmPassword"
          placeholder="Confirm password"
          prefix={<LockOutlined />}
          iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          className="mb-6"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button type="primary" block size="large" onClick={handleSubmit}>
          Sign Up
        </Button>

        <div className="mt-4 text-center">
          <Text type="secondary">Already have an account? </Text>
          <a href="/login" className="text-indigo-700">Sign In</a>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
