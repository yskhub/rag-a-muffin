import React, { useState, useEffect } from 'react';
import { documentsApi, adminApi } from '../services/api';
import DocumentUpload from './DocumentUpload';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, src] = await Promise.all([documentsApi.getStats(), documentsApi.getSources()]);
            setStats(s); setSources(src.sources || []);
        } catch (e) {
            console.error("Failed to fetch admin data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSeed = async () => { await adminApi.seedSampleData(); fetchData(); };
    const handleDelete = async (name) => { await documentsApi.deleteDocument(name); fetchData(); };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div><h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1><p className="text-gray-500">Manage documents</p></div>
                    <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg">← Back to Chat</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 text-center border shadow-sm">
                        <div className="text-2xl mb-1">📊</div>
                        <p className="text-gray-500 text-sm">Documents</p>
                        <p className="text-2xl font-bold">{stats?.total_documents || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center border shadow-sm">
                        <div className="text-2xl mb-1">📁</div>
                        <p className="text-gray-500 text-sm">Sources</p>
                        <p className="text-2xl font-bold">{sources.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center border shadow-sm">
                        <div className="text-2xl mb-1">💰</div>
                        <p className="text-gray-500 text-sm">Cost</p>
                        <p className="text-2xl font-bold text-green-600">$0</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUpload onUploadComplete={fetchData} />
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="font-bold mb-4">⚡ Actions</h3>
                        <button onClick={handleSeed} className="w-full mb-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors">🌱 Seed Sample Data</button>
                        <button onClick={fetchData} className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">🔄 Refresh Stats</button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                    <h3 className="font-bold mb-4">📚 Active Sources</h3>
                    {sources.length === 0 ? (
                        <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sources.map(s => (
                                <div key={s} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 border">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📄</span>
                                        <span className="font-medium text-gray-700">{s}</span>
                                    </div>
                                    <button onClick={() => handleDelete(s)} className="text-red-500 hover:text-red-700 text-sm font-bold bg-white px-3 py-1 rounded border hover:bg-red-50 transition-colors">Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
