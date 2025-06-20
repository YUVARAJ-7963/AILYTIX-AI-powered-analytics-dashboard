import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  PieChart,
  Upload,
  FileText,
  Brain,
  AlertTriangle,
  Lightbulb,
  ChevronsLeft,
  ChevronsRight,
  MessageSquare,
  Trash
} from 'lucide-react';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { AreaChart } from '../components/charts/AreaChart';
import { MetricCard } from '../components/MetricCard';
import { FileUpload } from '../components/FileUpload';
import { FileDetails } from '../components/FileDetails';
import { AIConversation } from '../components/AIConversation';
import { ScatterChart } from '../components/charts/ScatterChart';
import { HistogramChart } from '../components/charts/HistogramChart';

// Chart data transformation helpers
function toBarChartData(raw, xKey, yKey) {
  if (!raw || !raw[xKey] || !raw[yKey]) return { labels: [], datasets: [] };
  return {
    labels: raw[xKey],
    datasets: [
      {
        label: yKey,
        data: raw[yKey],
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 2,
      }
    ]
  };
}
function toLineChartData(raw, xKey, yKey) {
  if (!raw || !raw[xKey] || !raw[yKey]) return { labels: [], datasets: [] };
  return {
    labels: raw[xKey],
    datasets: [
      {
        label: yKey,
        data: raw[yKey],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        fill: false,
      }
    ]
  };
}
function toDoughnutChartData(raw, labelKey, valueKey) {
  if (!raw || !raw[labelKey] || !raw[valueKey]) return { labels: [], datasets: [] };
        return {
    labels: raw[labelKey],
    datasets: [
      {
        data: raw[valueKey],
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
            '#F472B6', '#FBBF24', '#34D399', '#60A5FA'
          ],
          borderColor: [
            '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2',
            '#BE185D', '#B45309', '#059669', '#2563EB'
          ],
          borderWidth: 2,
      }
    ]
  };
}
// New: Scatter chart data helper
function toScatterChartData(raw, xKey, yKey) {
  if (!raw || !raw[xKey] || !raw[yKey]) return { datasets: [] };
  const data = raw[xKey].map((x, i) => ({ x, y: raw[yKey][i] }));
  return {
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data,
        backgroundColor: '#3B82F6',
      }
    ]
  };
}
// New: Histogram chart data helper
function toHistogramChartData(raw, xKey, binCount = 10) {
  if (!raw || !raw[xKey]) return { labels: [], datasets: [] };
  const values = raw[xKey];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / binCount;
  const bins = Array(binCount).fill(0);
  const labels = Array(binCount).fill('').map((_, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    return `${start.toFixed(1)} - ${end.toFixed(1)}`;
  });
  values.forEach(v => {
    let idx = Math.floor((v - min) / binSize);
    if (idx === binCount) idx = binCount - 1;
    bins[idx]++;
  });
  return {
    labels,
    datasets: [
      {
        label: xKey,
        data: bins,
        backgroundColor: '#10B981',
      }
    ]
  };
}

export default function Dashboard() {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [chartSuggestions, setChartSuggestions] = useState([]);
  const [chartData, setChartData] = useState({});
  const [aiSummary, setAiSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Fetch file list on mount and after upload
  const fetchFileList = () => {
    fetch('http://localhost:5000/files/list', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFileList(data))
      .catch(() => setFileList([]));
  };
  useEffect(() => {
    fetchFileList();
  }, []);

  // When a file is uploaded, fetch all related data
  const handleFileUpload = (data) => {
    setIsProcessing(true);
    setSelectedFile(data.file_id);
      setFileInfo({
      id: data.file_id,
      name: data.filename,
      size: '',
      rows: data.file_metadata.num_rows,
      columns: data.file_metadata.columns.length,
      columnNames: data.file_metadata.columns,
        uploadedAt: new Date().toLocaleString()
      });
    fetchFileRelatedData(data.file_id, data.file_metadata);
    fetchFileList();
  };

  // When a file is selected from the sidebar
  const handleFileSelect = (file) => {
    setSelectedFile(file.id);
    setFileInfo({
      id: file.id,
      name: file.filename,
      size: '',
      rows: file.file_metadata.num_rows,
      columns: file.file_metadata.columns.length,
      columnNames: file.file_metadata.columns,
      uploadedAt: new Date(file.upload_time).toLocaleString()
    });
    fetchFileRelatedData(file.id, file.file_metadata);
    if (window.innerWidth < 1024) {
      setLeftSidebarOpen(false);
    }
  };

  // Fetch chart suggestions, chart data, and AI summary for a file
  const fetchFileRelatedData = async (fileId, metadata) => {
    setIsLoadingInsights(true);
    setAiSummary('');
    setChartSuggestions([]);
    
    try {
        // Fetch all data in parallel
        const [suggestRes, chartRes, aiRes] = await Promise.all([
            fetch(`http://localhost:5000/charts/suggest/${fileId}`, { credentials: 'include' }),
            fetch(`http://localhost:5000/charts/data/${fileId}`, { credentials: 'include' }),
            fetch(`http://localhost:5000/ai/summary/${fileId}`, { credentials: 'include' })
        ]);

        const suggestData = await suggestRes.json();
        const chartDataObj = await chartRes.json();
        const aiData = await aiRes.json();

        setChartSuggestions(suggestData.suggestions || []);
        setChartData(chartDataObj);
        setAiSummary(aiData.summary || 'AI summary could not be generated.');

    } catch (error) {
        console.error("Error fetching file related data:", error);
        setAiSummary('Error fetching AI summary.');
    } finally {
        setIsLoadingInsights(false);
      setIsProcessing(false);
    }
  };

  const dynamicMetrics = fileInfo ? {
    records: fileInfo.rows,
    columns: fileInfo.columns,
  } : null;

  // Add handleDeleteFile function
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`http://localhost:5000/files/delete/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        if (selectedFile === fileId) {
          setSelectedFile(null);
          setFileInfo(null);
          setChartSuggestions([]);
          setChartData({});
          setAiSummary('');
        }
        fetchFileList();
      } else {
        alert("Failed to delete file.");
      }
    } catch (err) {
      alert("Error deleting file.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 font-sans pt-16">
      {/* Backdrop for mobile */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
            onClick={() => { setLeftSidebarOpen(false); setRightSidebarOpen(false); }}
            className="fixed inset-x-0 top-16 bottom-0 bg-black/60 z-20"
        ></div>
      )}

      {/* Left Sidebar */}
      <div
        className={`
          bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out 
          fixed top-16 bottom-0 left-0 z-30 transform w-7/12
          ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${leftSidebarOpen ? 'lg:w-3/12' : 'w-0'}
          overflow-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
             <h2 className="text-xl font-bold text-white">My Data</h2>
             <button onClick={() => setLeftSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-700">
                <ChevronsLeft className="w-5 h-5" />
              </button>
        </div>
        <div className="flex-1 px-4 py-4 overflow-y-auto">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Files</h3>
            <ul className="space-y-1">
              {fileList.map(file => (
                <li key={file.id} className="flex items-center overflow-hidden">
                  <button
                    className={`flex-1 min-w-0 text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${selectedFile === file.id ? 'bg-blue-600/20 text-blue-300 font-semibold' : 'hover:bg-gray-700'}`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate min-w-0 flex-1">{file.filename}</span>
                  </button>
                  <button
                    className="ml-2 p-1 rounded hover:bg-red-600 transition-colors"
                    title="Delete file"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash className="w-4 h-4 text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
        </div>
          </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {!leftSidebarOpen && (
                <button onClick={() => setLeftSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                    <ChevronsRight className="w-5 h-5" />
                </button>
            )}
            <div>
                 <h1 className="text-xl font-bold text-white">
                    {fileInfo?.name ? `Analytics for ${fileInfo.name}` : 'Dashboard'}
                </h1>
            </div>
                </div>
          <div className="flex items-center gap-2">
             {!rightSidebarOpen && (
                <button onClick={() => setRightSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                    <MessageSquare className="w-5 h-5" />
                </button>
              )}
            </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center h-full text-center bg-gray-800/50 rounded-xl border border-gray-700 p-8">
                  <Upload className="w-16 h-16 text-gray-500 mb-4" />
                  <h2 className="text-2xl font-semibold text-white mb-2">Welcome to AIlytix</h2>
                  <p className="text-gray-400 max-w-md mb-8">Upload a new file to begin your analysis.</p>
                  <div className="w-full max-w-md">
                    <FileUpload onUploadSuccess={handleFileUpload} isProcessing={isProcessing} />
                </div>
              </div>
            ) : isLoadingInsights ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <h2 className="text-2xl font-semibold text-white">Analyzing Data...</h2>
                  </div>
            ) : (
                <div className="space-y-8">
                     {/* File Upload Section */}
                     <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Upload New Data</h3>
                        <FileUpload onUploadSuccess={handleFileUpload} isProcessing={isProcessing} />
                    </div>
                     
                     {/* File Details & AI Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <FileDetails fileInfo={fileInfo} />
                    </div>
                        <div className="lg:col-span-2">
                          {aiSummary && (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
                              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                                AI-Powered Overview
                              </h3>
                              <p className="text-gray-300 text-sm leading-relaxed">{aiSummary}</p>
                  </div>
                          )}
                    </div>
                    </div>
                    {/* Dynamic Metrics Cards */}
                    {dynamicMetrics && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <MetricCard title="Total Rows" value={dynamicMetrics.records} icon={FileText} color="blue" />
                        <MetricCard title="Total Columns" value={dynamicMetrics.columns} icon={BarChart3} color="green" />
                        <MetricCard title="Key Metric" value={"-"} icon={Lightbulb} color="orange" />
                        <MetricCard title="Anomaly Score" value={"-"} icon={AlertTriangle} color="purple" />
                      </div>
                    )}
                    {/* Charts */}
                    {chartSuggestions.length > 0 ? (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Visualizations</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {chartSuggestions.map((suggestion, idx) => {
                                const chartProps = { height: 350, title: suggestion.title, theme: 'dark' };
                                if (suggestion.type === 'bar') {
                                    const data = toBarChartData(chartData, suggestion.x, suggestion.y);
                                    return <BarChart key={idx} {...chartProps} data={data} />;
                                }
                                if (suggestion.type === 'line') {
                                    const data = toLineChartData(chartData, suggestion.x, suggestion.y);
                                    return <LineChart key={idx} {...chartProps} data={data} />;
                                }
                                if (suggestion.type === 'pie' || suggestion.type === 'doughnut') {
                                    // If suggestion provides labels/values directly, use them
                                    let data;
                                    if (suggestion.labels && suggestion.values) {
                                        data = {
                                            labels: suggestion.labels,
                                            datasets: [
                                                {
                                                    data: suggestion.values,
                                                    backgroundColor: [
                                                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
                                                        '#F472B6', '#FBBF24', '#34D399', '#60A5FA'
                                                    ],
                                                    borderColor: [
                                                        '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2',
                                                        '#BE185D', '#B45309', '#059669', '#2563EB'
                                                    ],
                                                    borderWidth: 2,
                                                }
                                            ]
                                        };
                                    } else {
                                        data = toDoughnutChartData(chartData, suggestion.labels, suggestion.values);
                                    }
                                    return <DoughnutChart key={idx} {...chartProps} data={data} />;
                                }
                                if (suggestion.type === 'area') {
                                    const data = toLineChartData(chartData, suggestion.x, suggestion.y);
                                    // AreaChart expects fill: true
                                    data.datasets[0].fill = true;
                                    return <AreaChart key={idx} {...chartProps} data={data} />;
                                }
                                if (suggestion.type === 'scatter') {
                                    const data = toScatterChartData(chartData, suggestion.x, suggestion.y);
                                    return <ScatterChart key={idx} {...chartProps} data={data} />;
                                }
                                if (suggestion.type === 'histogram') {
                                    const data = toHistogramChartData(chartData, suggestion.x);
                                    return <HistogramChart key={idx} {...chartProps} data={data} />;
                                }
                                return null;
                            })}
                        </div>
                      </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center h-full min-h-[30vh] bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                          <PieChart className="w-16 h-16 text-gray-600 mb-4" />
                          <h2 className="text-xl font-semibold text-white">No Visualizations</h2>
                          <p className="text-gray-400 max-w-md">Could not generate chart suggestions for this file.</p>
                      </div>
                    )}
                </div>
            )}
              </div>
      </main>

      {/* Right Sidebar */}
       <div
        className={`
          bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out
          fixed lg:relative top-16 bottom-0 lg:top-auto lg:bottom-auto right-0 z-30 transform
          ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:transform-none
          ${rightSidebarOpen ? 'lg:w-5/12' : 'w-0'}
          overflow-hidden
        `}
      >
        <AIConversation fileInfo={fileInfo} setSidebarOpen={setRightSidebarOpen} />
      </div>
    </div>
  );
}