"use client"

import { useState, useEffect } from "react"
import { FaChartBar, FaPlus, FaCog, FaHome, FaBars, FaTimes } from "react-icons/fa"

const Navbar = ({ setSelectedSection, selectedSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll detection for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "charts", label: "Income Charts", icon: <FaChartBar /> },
    { id: "add-income", label: "Add Income", icon: <FaPlus /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#191919]/95 backdrop-blur-sm shadow-lg" : "bg-[#191919]"
      }`}
    >
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-[#D72638] font-bold text-xl tracking-tight">
              Finance<span className="text-white">Tracker</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.id)}
                className={`
                  flex items-center px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    selectedSection === item.id
                      ? "bg-[#D72638] text-white shadow-md"
                      : "text-gray-300 hover:bg-[#D72638]/20 hover:text-white"
                  }
                `}
              >
                <span
                  className={`mr-2 ${selectedSection === item.id ? "scale-110" : ""} transition-transform duration-200`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#D72638]/20 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-[#191919]/95 backdrop-blur-sm border-t border-[#D72638]/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSection(item.id)
                setIsMobileMenuOpen(false)
              }}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg text-left
                transition-all duration-200 ease-in-out
                ${
                  selectedSection === item.id
                    ? "bg-[#D72638] text-white"
                    : "text-gray-300 hover:bg-[#D72638]/20 hover:text-white"
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
