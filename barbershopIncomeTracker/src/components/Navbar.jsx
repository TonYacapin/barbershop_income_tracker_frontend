import { FaChartBar, FaPlus, FaCog, FaHome } from "react-icons/fa"

const Navbar = ({ setSelectedSection, selectedSection }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "charts", label: "Income Charts", icon: <FaChartBar /> },
    { id: "add-income", label: "Add Income", icon: <FaPlus /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ]

  return (
    <nav className="bg-[#191919] text-[#FFFFFF] shadow-md">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="py-4 text-[#D72638] font-bold text-xl">FinanceTracker</div>
          <div className="flex space-x-1 md:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.id)}
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  selectedSection === item.id ? "bg-[#D72638] text-[#FFFFFF]" : "text-[#FFFFFF] hover:bg-[#D72638]/80"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
