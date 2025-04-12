import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from './Dashboard';
import SettingsPage from './SettingsPage';
import IncomePage from './IncomePage';
import IncomeCharts from './IncomeCharts';


const MainPage = () => {
    const [selectedSection, setSelectedSection] = useState('dashboard');

    const renderContent = () => {
        switch (selectedSection) {
            case 'settings':
                return <SettingsPage />;
            case 'charts':
                return <IncomeCharts />;
            case 'add-income':
                return <IncomePage />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div>
            <Navbar setSelectedSection={setSelectedSection} />
            <div style={styles.dashboardContainer}>{renderContent()}</div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        marginTop: '20px',
        padding: '20px',
    },
};

export default MainPage;