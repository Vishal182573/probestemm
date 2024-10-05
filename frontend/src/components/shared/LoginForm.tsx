import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export const LoginForm: React.FC = () => {
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
        <form className="space-y-4">
          <Input
            type="email"
            placeholder="Email Address"
            className="bg-background"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-background"
          />
          <div className="flex justify-between items-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            Log In
            <LogInIcon className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
