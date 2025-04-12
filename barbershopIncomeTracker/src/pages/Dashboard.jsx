import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { format, parseISO } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function Dashboard() {
    // State for income data and loading
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });

    // State for sorting
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    // Fetch income data
    useEffect(() => {
        const fetchIncomeData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (dateFilter.startDate) params.append('startDate', dateFilter.startDate);
                if (dateFilter.endDate) params.append('endDate', dateFilter.endDate);

                const response = await axiosInstance.get(`/api/income?${params}`);
                setIncomeData(response.data.incomes || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching income data:', err);
                setError('Failed to load income data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchIncomeData();
    }, [dateFilter]);

    // Apply sorting to data
    const sortedData = React.useMemo(() => {
        let sortableItems = [...incomeData];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle date comparison
                if (sortConfig.key === 'createdAt') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [incomeData, sortConfig]);

    // Request sort
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort icon
    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return <FaSort className="text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    // Calculate totals
    const totals = incomeData.reduce((acc, item) => {
        acc.totalIncome += item.income;
        acc.totalHeads += item.numberOfHeads;
        return acc;
    }, { totalIncome: 0, totalHeads: 0 });

    return (
        <div className="p-4 bg-white text-black">
            <h1 className="text-2xl font-bold mb-6 text-[#191919]">Income Dashboard</h1>
            
            {/* Date filter */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-[#191919]">Filter by Date</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="whitespace-nowrap">Start Date:</label>
                        <input
                            type="date"
                            value={dateFilter.startDate}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                            className="border rounded p-1"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="whitespace-nowrap">End Date:</label>
                        <input
                            type="date"
                            value={dateFilter.endDate}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                            className="border rounded p-1"
                        />
                    </div>
                    <button
                        className="ml-auto px-4 py-1 bg-[#191919] text-white rounded hover:bg-opacity-80"
                        onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-[#D72638]">
                    <h3 className="text-gray-500 text-sm">Total Income</h3>
                    <p className="text-2xl font-bold text-[#D72638]">₱{totals.totalIncome.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-[#191919]">
                    <h3 className="text-gray-500 text-sm">Total Customers</h3>
                    <p className="text-2xl font-bold text-[#191919]">{totals.totalHeads}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-[#D72638]">
                    <h3 className="text-gray-500 text-sm">Average Per Customer</h3>
                    <p className="text-2xl font-bold text-[#D72638]">
                        ₱{totals.totalHeads ? (totals.totalIncome / totals.totalHeads).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Income data table */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D72638] border-r-transparent"></div>
                    <p className="mt-2">Loading income data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">{error}</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white">
                        <thead className="bg-[#191919] text-white">
                            <tr>
                                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => requestSort('source')}>
                                    <div className="flex items-center">
                                        Source {getSortIcon('source')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => requestSort('numberOfHeads')}>
                                    <div className="flex items-center">
                                        Customers {getSortIcon('numberOfHeads')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => requestSort('income')}>
                                    <div className="flex items-center">
                                        Income {getSortIcon('income')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => requestSort('createdAt')}>
                                    <div className="flex items-center">
                                        Date {getSortIcon('createdAt')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((income) => (
                                    <tr key={income._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 capitalize">{income.source}</td>
                                        <td className="px-4 py-3">{income.numberOfHeads}</td>
                                        <td className="px-4 py-3">₱{income.income.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            {format(parseISO(income.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                        No income records found. Create your first income record to see it here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
