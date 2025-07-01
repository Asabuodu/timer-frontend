"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import Splash from "./Splash";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [disableSplash, setDisableSplash] = useState(false);

  const navItems = [
    { label: "Make Schedule", path: "/home" },
    { label: "Ongoing Schedule", path: "/ongoing" },
    { label: "Saved Schedule", path: "/saved" },
    { label: "Setting", path: "/settings" },
    { label: "Help", path: "/help" },
  ];

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
    router.push("/home");
  };

  const renderAuthButton = () =>
    user ? (
      <motion.div
        className="flex items-center gap-6"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-sm font-medium text-black hidden md:inline">
          {user.username || user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-red-500 border border-red-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </motion.div>
    ) : (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavClick("/signin")}
        className="ml-4 text-gray-700 border-2 border-black px-6 py-2 rounded-full text-sm font-mono hover:bg-gray-500 hover:text-white transition"
      >
        Signin
      </motion.button>
    );

  return (
    <>
      <Splash show={showSplash} onClose={() => setShowSplash(false)} />
      <nav className="w-full px-6 md:px-14 py-4 bg-transparent mb-3">
        <div className="flex items-center justify-between md:justify-around">
          {/* Logo */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
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
            <span className="text-3xl md:text-5xl font-light text-black">Simp</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex gap-10 items-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {navItems.map(({ label, path }) => (
              <motion.button
                key={label}
                onClick={() => handleNavClick(path)}
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`pb-2 text-sm font-medium transition-all ${
                  pathname === path
                    ? "border-b-2 border-black text-black hover:text-amber-500 hover:border-amber-500"
                    : "text-black hover:text-amber-500"
                }`}
              >
                {label}
              </motion.button>
            ))}
            {renderAuthButton()}
          </motion.div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 md:hidden flex flex-col gap-4 px-2"
            >
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
              <div className="mt-2">{renderAuthButton()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
