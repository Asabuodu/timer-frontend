"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import Splash from "./Splash";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [disableSplash, setDisableSplash] = useState(false);

  const navItems = [
    { label: "Make Schedule", path: "/" },
    { label: "Ongoing Schedule", path: "/ongoing" },
    { label: "Saved Schedule", path: "/saved" },
    { label: "Setting", path: "/settings" },
    { label: "Help", path: "/help" },
  ];

  // Sync Zustand user with localStorage (on page reload)
  useEffect(() => {
    const userData = localStorage.getItem("authUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
  }, [setUser]);

  const handleLogoClick = () => {
    if (!disableSplash) {
      setShowSplash(true);
      setDisableSplash(true);
    }
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push("/signin");
  };

  const renderAuthButton = () =>
    user ? (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-black hidden md:inline">
          Hello, {user.username || user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-red-500 border border-red-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    ) : (
      <button
        onClick={() => handleNavClick("/signup")}
        className="ml-4 text-gray-700 border-2 border-black px-6 py-2 rounded-full text-sm font-mono hover:bg-blue-500 hover:text-white transition"
      >
        Sign Up
      </button>
    );

  return (
    <>
      <Splash show={showSplash} onClose={() => setShowSplash(false)} />
      <nav className="w-full px-6 md:px-14 py-4 bg-transparent">
        <div className="flex items-center justify-around hover:border-black">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={isHovered ? "/vector.png" : "/vector1.png"}
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="text-3xl md:text-5xl font-bold text-black">Simp</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10 justify-around items-center">
            {navItems.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => handleNavClick(path)}
                className={`pb-2 text-sm font-medium transition-all ${
                  pathname === path
                    ? "border-b-2 border-black text-black hover:text-amber-500 hover:border-amber-500"
                    : "text-black hover:text-amber-500"
                }`}
              >
                {label}
              </button>
            ))}
            {renderAuthButton()}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 flex flex-col md:hidden gap-4">
            {navItems.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => handleNavClick(path)}
                className={`text-left text-sm font-medium ${
                  pathname === path
                    ? "border-b-2 border-black text-black hover:text-amber-500 hover:border-amber-500"
                    : "text-black hover:text-amber-500"
                }`}
              >
                {label}
              </button>
            ))}
            {renderAuthButton()}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
