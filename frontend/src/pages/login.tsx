// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { Input, Button, Card, Typography, Modal, Form, message } from "antd";
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

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    let interval: any;
    if ((otpModalVisible || resetPasswordModalVisible) && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpModalVisible, resetPasswordModalVisible, timer]);

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

      if (response.status === 201 && response.data?.data) {
        const { token, email, role } = response.data.data;

        toast.success("Login successful!");
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);

        setUser({ role: role });
        navigate("/layout");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const handleForgetPassword = () => {
    setEmailModalVisible(true);
  };

  const handleSendOtp = async () => {
    if (!emailForOtp) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/events/backend/user/send-otp", {
        email: emailForOtp,
      });
      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        setEmailModalVisible(false);
        setOtpModalVisible(true);
        setTimer(60);
        setResendDisabled(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/events/backend/user/verify-otp", {
        email: emailForOtp,
        otp: otp,
      });
      if (response.status === 200) {
        toast.success("OTP verified!");
        setOtpModalVisible(false);
        setResetPasswordModalVisible(true);
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/events/backend/user/reset-password", {
        email: emailForOtp,
        otp: otp,
        newPassword: newPassword
      });

      if (response.status === 200) {
        toast.success("Password reset successful! Please login with your new password.");
        setResetPasswordModalVisible(false);
        // Clear all fields
        setEmailForOtp("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
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
          <Button type="link" onClick={handleForgetPassword}>
            Forgot Password?
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Text type="secondary">Don't have an account? </Text>
          <a href="/signup" className="text-indigo-700">Sign Up</a>
        </div>
      </Card>

      {/* Email Modal */}
      <Modal
        title="Forgot Password"
        open={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        onOk={handleSendOtp}
        okText="Send OTP"
      >
        <Input
          placeholder="Enter your registered email"
          prefix={<MailOutlined />}
          value={emailForOtp}
          onChange={(e) => setEmailForOtp(e.target.value)}
        />
      </Modal>

      {/* OTP Modal */}
      <Modal
        title="Enter OTP"
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        onOk={handleVerifyOtp}
        okText="Verify OTP"
      >
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4"
        />
        <div className="flex items-center justify-between">
          <span>Resend OTP in {timer}s</span>
          <Button type="link" disabled={resendDisabled} onClick={handleResendOtp}>
            Resend OTP
          </Button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Reset Password"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
        okText="Reset Password"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="New Password" required>
            <Input.Password
              placeholder="Enter new password"
              prefix={<LockOutlined />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-3"
            />
          </Form.Item>
          <Form.Item label="Confirm Password" required>
            <Input.Password
              placeholder="Confirm new password"
              prefix={<LockOutlined />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;