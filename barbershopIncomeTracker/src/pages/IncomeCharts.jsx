import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { subDays, format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function IncomeCharts() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [granularity, setGranularity] = useState('day');
  const [sourceFilter, setSourceFilter] = useState('');
  const [availableSources, setAvailableSources] = useState([]);

  const [incomeBySource, setIncomeBySource] = useState([]);
  const [incomeByDate, setIncomeByDate] = useState([]);
  const [totalIncome, setTotalIncome] = useState(null);
  const [incomeTrends, setIncomeTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          granularity,
        });

        const [sourceResponse, dateResponse, totalResponse] = await Promise.all([
          axiosInstance.get(`/api/income-charts/by-source?${params}`),
          axiosInstance.get(`/api/income-charts/by-date?${params}`),
          axiosInstance.get(`/api/income-charts/total?${params}`),
        ]);

        const sourceData = sourceResponse.data?.incomeBySource || [];
        const dateData = dateResponse.data?.incomeByDate || [];
        const totalData = totalResponse.data?.totalIncome;

        setIncomeBySource(sourceData);
        setIncomeByDate(dateData);
        setTotalIncome(totalData);

        if (Array.isArray(sourceData) && sourceData.length > 0) {
          const sources = sourceData.map(item => item._id);
          setAvailableSources(sources);
        }

        if (sourceFilter) {
          const trendParams = new URLSearchParams({
            ...params,
            source: sourceFilter,
          });

          const trendResponse = await axiosInstance.get(`/api/income-charts/trends-by-source?${trendParams}`);
          setIncomeTrends(trendResponse.data?.incomeTrends || []);
        }

        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load income data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, granularity, sourceFilter]);

  const generateColors = (count) => {
    const colors = ['#D72638', '#191919', '#FFFFFF'];
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#191919',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#191919' },
        grid: { color: 'rgba(25, 25, 25, 0.1)' },
      },
      y: {
        ticks: { color: '#191919' },
        grid: { color: 'rgba(25, 25, 25, 0.1)' },
      },
    },
  };

  const sourceChartData = incomeBySource.length > 0 ? {
    labels: incomeBySource.map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)),
    datasets: [
      {
        label: 'Income by Source',
        data: incomeBySource.map(item => item.totalIncome),
        backgroundColor: generateColors(incomeBySource.length),
      }
    ]
  } : null;

  const dateChartData = incomeByDate.length > 0 ? {
    labels: incomeByDate.map(item => item._id),
    datasets: [
      {
        label: 'Income Over Time',
        data: incomeByDate.map(item => item.totalIncome),
        borderColor: '#D72638',
        backgroundColor: 'rgba(215, 38, 56, 0.2)',
        tension: 0.3,
      }
    ]
  } : null;

  const trendChartData = incomeTrends.length > 0 ? {
    labels: incomeTrends.map(item => item._id),
    datasets: [
      {
        label: `Income Trend for ${sourceFilter}`,
        data: incomeTrends.map(item => item.totalIncome),
        borderColor: '#D72638',
        backgroundColor: 'rgba(215, 38, 56, 0.2)',
        tension: 0.3,
      }
    ]
  } : null;

  const headsChartData = incomeByDate.length > 0 ? {
    labels: incomeByDate.map(item => item._id),
    datasets: [
      {
        label: 'Number of Heads Over Time',
        data: incomeByDate.map(item => item.totalHeads),
        borderColor: '#191919',
        backgroundColor: 'rgba(25, 25, 25, 0.2)',
        tension: 0.3,
      }
    ]
  } : null;

  return (
    <div className="income-charts-container p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Income Analytics</h1>

      <div className="filters mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="border rounded p-1"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="border rounded p-1"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Granularity</label>
            <select
              value={granularity}
              onChange={e => setGranularity(e.target.value)}
              className="border rounded p-1 w-full"
            >
              <option value="day">Daily</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Source (for Trends)</label>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="border rounded p-1 w-full"
            >
              <option value="">Select a source</option>
              {availableSources.map(source => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading income data...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="charts-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {totalIncome && (
            <div className="stats-card p-4 bg-white rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">Income Summary</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="stat">
                  <div className="text-3xl font-bold text-red-600">₱{totalIncome.totalIncome.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Total Income</div>
                </div>
                <div className="stat">
                  <div className="text-3xl font-bold text-green-600">{totalIncome.totalHeads}</div>
                  <div className="text-sm text-gray-500">Total Heads</div>
                </div>
                <div className="stat">
                  <div className="text-3xl font-bold text-purple-600">₱{totalIncome.averageIncomePerHead?.toFixed(2) || 0}</div>
                  <div className="text-sm text-gray-500">Avg Income/Head</div>
                </div>
              </div>
            </div>
          )}

          {sourceChartData && (
            <div className="chart-card p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Income by Source</h2>
              <div className="h-80">
                <Pie data={sourceChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {dateChartData && (
            <div className="chart-card p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Income Over Time</h2>
              <div className="h-80">
                <Line data={dateChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {headsChartData && (
            <div className="chart-card p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Customer Volume Over Time</h2>
              <div className="h-80">
                <Bar data={headsChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {trendChartData && (
            <div className="chart-card p-4 bg-white rounded-lg shadow col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-3">
                Income Trend: {sourceFilter.charAt(0).toUpperCase() + sourceFilter.slice(1)}
              </h2>
              <div className="h-80">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IncomeCharts;
