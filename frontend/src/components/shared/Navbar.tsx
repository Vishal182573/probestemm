"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react"; // Importing User icon
import Link from "next/link";
import Image from "next/image";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user, setUser] = useState<{
    photoUrl?: string;
    name?: string;
    id?: string;
  } | null>(null); // State to store user data

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Check for token and user details in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); // Parse user data from localStorage
    }
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">Probe STEM</h1>
          </Link>
          <button className="md:hidden text-gray-600" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/discussions">Questionnaire</NavLink>
            <NavLink to="/webinars">Webinars</NavLink>
            <NavLink to="/blogs">Blogs</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/about">About</NavLink>
            {isLoggedIn && user ? (
              <Link
                href={`/${localStorage.getItem("role")}-profile/${user.id}`}
              >
                <Image
                  src={user.photoUrl || "/fallback-profile.png"} // Fallback image if photoUrl is missing
                  alt={user.name || "User Profile"} // Alt text with fallback to "User Profile"
                  width={40}
                  height={40}
                  className="rounded-full bg-white border-[2px] border-gray-300 hover:border-blue-600 transition-all" // Improved styling
                />
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/discussions">Questionnaire</MobileNavLink>
              <MobileNavLink to="/blogs">Blogs</MobileNavLink>
              <MobileNavLink to="/projects">Projects</MobileNavLink>
              <MobileNavLink to="/webinars">Webinars</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              {isLoggedIn && user ? (
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <User className="mr-2" size={18} /> Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    >
      {children}
    </Button>
  </Link>
);

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    >
      {children}
    </Button>
  </Link>
);

export default Navbar;
