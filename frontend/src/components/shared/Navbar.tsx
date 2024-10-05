"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <Link href="/login">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </Link>
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
              <Link href="/login">
                <Button
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link href={to}>
    <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
      {children}
    </Button>
  </Link>
);

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link href={to}>
    <Button variant="ghost" className="w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50">
      {children}
    </Button>
  </Link>
);

export default Navbar;