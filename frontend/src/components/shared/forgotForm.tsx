/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { API_URL } from "@/constants";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email/role, 2: OTP verification, 3: new password
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/email/send-email`, { email });
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
      setStep(2);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/email/validate-code`, {
        email,
        code: otp
      });
      toast({
        title: "OTP Verified",
        description: "Please enter your new password",
      });
      setStep(3);
    } catch (error) {
      setError("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        userType:role,
        email,
        newPassword
      });
      
      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
      });
      router.push("/login");
    } catch (error) {
      setError("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendOTP} className="space-y-4 text-black">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-full bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="professor">Professor</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
      
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12"
      />
      
      <Button
        type="submit"
        className="w-full h-12 bg-[#5e17eb] text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Send Verification Code"
        )}
      </Button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <Input
        type="text"
        placeholder="Enter verification code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-black"
      />
      
      <Button
        type="submit"
        className="w-full h-12 bg-[#5e17eb] text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Verify Code"
        )}
      </Button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <Input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-black"
      />
      
      <Button
        type="submit"
        className="w-full h-12 bg-[#5e17eb] text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-3xl font-bold text-[#472014] font-caveat">
            Reset Password
          </CardTitle>
        </div>
        <p className="text-sm text-[#686256]">
          {step === 1 && "Enter your email to receive a verification code"}
          {step === 2 && "Enter the verification code sent to your email"}
          {step === 3 && "Enter your new password"}
        </p>
      </CardHeader>
      
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-4 text-center"
          >
            {error}
          </motion.p>
        )}
        
        <div className="mt-4 text-center">
          <Link href="/login">
            <Button
              variant="link"
              className="text-[#eb5e17] hover:text-[#472014] text-sm"
            >
              Back to Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;