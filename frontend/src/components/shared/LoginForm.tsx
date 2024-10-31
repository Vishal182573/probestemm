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

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await authApi.post("/signin", {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      // Store user data in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("fullName", user.fullName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("phoneNumber", user.phoneNumber);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast({
        title: "Login successful!",
        description: "Welcome back!",
        duration: 3000,
      });

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

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={email}
              type="email"
              placeholder="Email Address"
              className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-[#472014] placeholder:text-[#686256]/60"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              value={password}
              type="password"
              placeholder="Password"
              className="bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-[#472014] placeholder:text-[#686256]/60"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full bg-white/50 border-2 border-[#686256]/20 focus:border-[#eb5e17] h-12 text-[#472014]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[#472014]">
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-between items-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[#eb5e17] hover:text-[#472014] font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
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