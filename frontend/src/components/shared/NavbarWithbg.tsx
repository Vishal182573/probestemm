"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LOGOLEFT, LOGORIGHT } from "../../../public";

export const NavbarWithBg: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    imageUrl?: string;
    photoUrl?: string;
    profileImageUrl?: string;
    companyName?:string;
  } | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const profileButton = document.getElementById('profile-button');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        !profileButton?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getProfileImageSrc = () => {
    if (!user || !user.role) return null;

    switch (user.role) {
      case "student":
        return user.imageUrl || null;
      case "professor":
        return user.photoUrl || null;
      case "business":
        return user.profileImageUrl || null;
      default:
        return null;
    }
  };

  const linkTextColor = "text-[#472014]";

  const ProfileButton = () => (
    <Button
      id="profile-button"
      variant="ghost"
      onClick={toggleDropdown}
      className="text-[#472014] flex items-center gap-2 hover:bg-blue-50 hover:text-black"
    >
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
        {getProfileImageSrc() ? (
          <Image
            src={getProfileImageSrc()!}
            alt={user?.fullName || "User Profile"}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <User className="text-gray-600 w-5 h-5" />
        )}
      </div>
      <span className="font-medium">{user?.fullName || user?.companyName || "User"}</span>
      <ChevronDown className={`w-4 h-4 ${showDropdown ? "rotate-180" : ""} transition-transform`} />
    </Button>
  );

  const ProfileDropdown = () => (
    <div
      id="profile-dropdown"
      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 "
    >
      <div className="py-1">
        <Link href={`/${user?.role}-profile/${user?.id}`}>
          <button className="text-[#472014] hover:bg-blue-50 group flex items-center w-full px-4 py-2 text-sm">
            <User className="mr-3 h-5 w-5" />
            My Profile
          </button>
        </Link>
        <Link href={`/edit-profile`}>
          <button className="text-[#472014] hover:bg-blue-50 group flex items-center w-full px-4 py-2 text-sm">
            <Settings className="mr-3 h-5 w-5" />
            Edit Profile
          </button>
        </Link>
      </div>
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 group flex items-center w-full px-4 py-2 text-sm"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24 relative">
          <Link href="/" className="relative">
            <div className="flex items-center justify-center h-24">
              <div className="relative h-full flex items-center">
                <Image
                  src={LOGOLEFT}
                  alt="left logo part"
                  className="w-auto h-20 lg:h-24 object-contain"
                  priority
                />
              </div>
              <div className="relative h-full flex items-center">
                <Image
                  src={LOGORIGHT}
                  alt="right logo part"
                  className="w-auto h-20 lg:h-24 object-contain"
                  priority
                />
              </div>
            </div>
          </Link>
          <button className="md:hidden text-gray-600" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={linkTextColor}>
              HOME
            </NavLink>
            <NavLink to="/about" className={linkTextColor}>
              ABOUT US
            </NavLink>
            <NavLink to="/discussions" className={linkTextColor}>
              DISCUSSION FORUM
            </NavLink>
            <NavLink to="/webinars" className={linkTextColor}>
              WEBINARS
            </NavLink>
            <NavLink to="/blogs" className={linkTextColor}>
              RESEARCH CORNER
            </NavLink>
            <NavLink to="/projects" className={linkTextColor}>
              PROJECTS
            </NavLink>
            <NavLink to="/contact" className={linkTextColor}>
              CONTACT US
            </NavLink>
            {isLoggedIn && user ? (
              <div className="relative hover:text-black">
                <ProfileButton />
                {showDropdown && <ProfileDropdown />}
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-[#472014] text-white font-semibold"
                >
                  LOGIN 
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
              <MobileNavLink to="/about" className={linkTextColor}>
                ABOUT US
              </MobileNavLink>
              <MobileNavLink to="/discussions" className={linkTextColor}>
                DISCUSSION FORUM
              </MobileNavLink>
              <MobileNavLink to="/webinars" className={linkTextColor}>
                WEBINARS
              </MobileNavLink>
              <MobileNavLink to="/blogs" className={linkTextColor}>
                RESEARCH CORNER
              </MobileNavLink>
              <MobileNavLink to="/projects" className={linkTextColor}>
                PROJECTS
              </MobileNavLink>
              <MobileNavLink to="/contact" className={linkTextColor}>
                CONTACT US
              </MobileNavLink>
              {isLoggedIn && user ? (
                <div className="border-t border-gray-200 pt-2">
                  <Link href={`/${user.role}-profile/${user.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <User className="mr-2" size={18} /> My Profile
                    </Button>
                  </Link>
                  <Link href={`/${user.role}-profile/${user.id}/edit`}>
                    <Button
                      variant="ghost"
                      className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Settings className="mr-2" size={18} /> Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2" size={18} /> Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    className="w-full bg-[#472014] text-white hover:bg-[#8a5444]"
                  >
                    LOGIN 
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

const NavLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className: string;
}> = ({ to, children, className }) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className={`${className} hover:bg-blue-50 font-semibold text-sm hover:text-[#472014]`}
    >
      {children}
    </Button>
  </Link>
);

const MobileNavLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className: string;
}> = ({ to, children, className }) => (
  <Link href={to}>
    <Button
      variant="ghost"
      className={`w-full text-left ${className} hover:bg-blue-50 hover:text-[#472014]`}
    >
      {children}
    </Button>
  </Link>
);

export default NavbarWithBg;