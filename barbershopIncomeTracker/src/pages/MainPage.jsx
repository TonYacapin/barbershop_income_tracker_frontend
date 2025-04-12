
import { useState } from "react"
import Navbar from "../components/Navbar"
import Dashboard from "./Dashboard"
import SettingsPage from "./SettingsPage"
import IncomePage from "./IncomePage"
import IncomeCharts from "./IncomeCharts"

const MainPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard")

  const renderContent = () => {
    switch (selectedSection) {
      case "settings":
        return <SettingsPage />
      case "charts":
        return <IncomeCharts />
      case "add-income":
        return <IncomePage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
      <div className="mx-auto mt-6 px-4 py-6 max-w-7xl">{renderContent()}</div>
    </div>
  )
}

export default MainPage
