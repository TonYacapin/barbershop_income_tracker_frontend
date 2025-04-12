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
        <div className="min-h-screen flex flex-col">
            <Navbar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
            <div
                className="flex-grow bg-amber-50 mx-auto mt-6 px-4 py-6 max-w-7xl w-full sm:px-6 lg:px-8"
                style={{ paddingTop: '4rem' }} // Adjust this value to match the Navbar height
            >
                {renderContent()}
            </div>
        </div>
    )
}

export default MainPage