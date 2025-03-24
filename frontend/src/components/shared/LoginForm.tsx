"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInIcon, Loader2 } from "lucide-react";
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

// Create an axios instance for authentication-related API calls
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

export const LoginForm: React.FC = () => {
  // State management for form inputs and UI controls
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility between plain text and hidden
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Send IP address along with email for security tracking
      await authApi.post('/send-ip', {
        emailId: email,
      });

      // Attempt user authentication
      const response = await authApi.post("/signin", {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      // Store user session data in localStorage for persistence
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));
      if(role !== "business"){
        localStorage.setItem("fullName", user.fullName);
      }else{
        localStorage.setItem("companyName", user.companyName);
      }
      localStorage.setItem("email", user.email);
      localStorage.setItem("phoneNumber", user.phoneNumber);

      // Set authorization header for future API requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Show success notification
      toast({
        title: "Login successful!",
        description: "Welcome back!",
        duration: 3000,
      });

      // Redirect user based on their role
      switch (role) {
        case "student":
          router.push(`/student-profile/${user.id}`);
          break;
        case "professor":
          router.push(`/professor-profile/${user.id}`);
          break;
        case "business":
          router.push(`/business-profile/${user.id}`);
          break;
        case "admin":
          router.push(`/admin-dashboard/${user.id}`);
          break;
        default:
          router.push(`/dashboard/${user.id}`);
      }
    } catch (error) {
      // Handle authentication errors
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data?.error || "An error occurred during sign in"
        );
      } else {
        setError("An error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render login form UI
  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      {/* Card Header with Title and Sign Up Link */}
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-[#472014] font-caveat">
          Sign In
        </CardTitle>
        <p className="text-sm text-[#686256]">
          New to Probe STEM?{" "}
          <Link href="/signup">
            <Button
              variant="link"
              className="text-[#eb5e17] hover:text-[#472014] text-sm p-0 font-semibold"
            >
              Sign Up
            </Button>
          </Link>
        </p>
      </CardHeader>

      {/* Card Content with Login Form */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input Field */}
          <div className="space-y-2">
            <Input
              value={email}
              type="email"
              placeholder="Email Address"
              className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-[#472014] placeholder:text-[#686256]/60"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input Field with Show/Hide Toggle */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-[#472014]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[#472014]">
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="professor">Faculty/Scientist</SelectItem>
              <SelectItem value="business">Industry</SelectItem>
            </SelectContent>
          </Select>

          {/* Forgot Password Link */}
          <div className="flex justify-between items-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[#eb5e17] hover:text-[#472014] font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button with Loading State */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#5e17eb] text-white font-semibold transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Log In
                <LogInIcon className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Error Message Display with Animation */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 text-center"
            >
              {error}
            </motion.p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;