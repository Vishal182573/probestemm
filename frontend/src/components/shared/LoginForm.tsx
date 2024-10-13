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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
        description: "Welcome back!.",
        duration: 3000,
      });
      // Redirect based on role
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
    <Card className="w-full max-w-md shadow-lg bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">
          Welcome Back
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          New to Probe STEM?{" "}
          <Link href="/signup">
            <Button variant="link" className="text-primary text-sm p-0">
              Sign Up
            </Button>
          </Link>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={email}
            type="email"
            placeholder="Email Address"
            className="bg-background"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            value={password}
            type="password"
            placeholder="Password"
            className="bg-background"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-between items-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Log In
                <LogInIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
