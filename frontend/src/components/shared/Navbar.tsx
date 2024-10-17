"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    imageUrl?: string;
    photoUrl?: string;
    profileImageUrl?: string;
  } | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (token && userString && role) {
      setIsLoggedIn(true);
      const userData = JSON.parse(userString);
      setUser({ ...userData, role });
    }
  }, []);

  // Scroll detection to change text color
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getProfileImageSrc = () => {
    if (!user || !user.role) return "/user.png";

    switch (user.role) {
      case "student":
        return user.imageUrl || "/user.png";
      case "professor":
        return user.photoUrl || "/user.png";
      case "business":
        return user.profileImageUrl || "/user.png";
      default:
        return "/user.png";
    }
  };

  const linkTextColor = isScrolled ? "text-[#472014]" : "text-white";

  return (
    <nav className="bg-opacity-90 backdrop-blur-md shadow-md fixed top-0 z-50 w-full transition-colors duration-300 ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <h1 className={`text-2xl font-bold ${linkTextColor}`}>Probe STEM</h1>
          </Link>
          <button className="md:hidden text-gray-600" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={linkTextColor}>
              HOME
            </NavLink>
            <NavLink to="/discussions" className={linkTextColor}>
              DISCUSSION FORUM
            </NavLink>
            <NavLink to="/webinars" className={linkTextColor}>
              WEBINARS
            </NavLink>
            <NavLink to="/blogs" className={linkTextColor}>
              BLOGS
            </NavLink>
            <NavLink to="/projects" className={linkTextColor}>
              PROJECTS
            </NavLink>
            <NavLink to="/about" className={linkTextColor}>
              ABOUT
            </NavLink>
            {isLoggedIn && user ? (
              <Link href={`/${user.role}-profile/${user.id}`}>
                <Image
                  src={getProfileImageSrc()}
                  alt={user.fullName || "User Profile"}
                  width={40}
                  height={40}
                  className="rounded-full bg-white border-[2px] border-gray-300 hover:border-blue-600 transition-all"
                />
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-[#472014] text-white font-semibold"
                >
                  LOGIN / SIGNUP
                </Button>
              </Link>
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <MobileNavLink to="/" className={linkTextColor}>
                HOME
              </MobileNavLink>
              <MobileNavLink to="/discussions" className={linkTextColor}>
                DISCUSSION FORUM
              </MobileNavLink>
              <MobileNavLink to="/blogs" className={linkTextColor}>
                BLOGS
              </MobileNavLink>
              <MobileNavLink to="/projects" className={linkTextColor}>
                PROJECTS
              </MobileNavLink>
              <MobileNavLink to="/webinars" className={linkTextColor}>
                WEBINARS
              </MobileNavLink>
              <MobileNavLink to="/about" className={linkTextColor}>
                ABOUT
              </MobileNavLink>
              {isLoggedIn && user ? (
                <Link href={`/${user.role}-profile/${user.id}`}>
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
                    className="w-full bg-[#472014] text-white"
                  >
                    LOGIN/SIGNUP
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

const NavLink: React.FC<{ to: string; children: React.ReactNode; className: string }> = ({
  to,
  children,
  className,
}) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className={`${className} hover:text-blue-600 hover:bg-blue-50 font-semibold text-lg`}
    >
      {children}
    </Button>
  </Link>
);

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; className: string }> = ({
  to,
  children,
  className,
}) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className={`w-full text-left ${className} hover:text-blue-600 hover:bg-blue-50`}
    >
      {children}
    </Button>
  </Link>
);

export default Navbar;
