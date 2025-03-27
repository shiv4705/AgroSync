import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>
                
                <div className="grid grid-cols-3 gap-6">
                    <Link to="/admin/users" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
                        Manage Users
                    </Link>
                    <Link to="/admin/reports" className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition-all">
                        View Reports
                    </Link>
                    <Link to="/admin/settings" className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition-all">
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;