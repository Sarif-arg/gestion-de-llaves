
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Header from './components/Header';
import { UserRole } from './types';

const AppContent: React.FC = () => {
    const { currentUser } = useApp();

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                {currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <UserDashboard />}
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
