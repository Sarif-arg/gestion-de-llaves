
import React from 'react';
import { useApp } from '../context/AppContext';
import { KeyIcon } from './icons/KeyIcon';
import { LogoutIcon } from './icons/LogoutIcon';

const Header: React.FC = () => {
    const { currentUser, logout } = useApp();

    return (
        <header className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <KeyIcon className="h-10 w-10 text-brand-yellow" />
                        <div className="ml-3">
                            <h1 className="text-xl font-bold text-white leading-tight">Sistema de llaves</h1>
                            <p className="text-xs text-gray-400">Almiron Propiedades</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-300 hidden sm:block">
                            Bienvenido/a, <span className="font-semibold">{currentUser?.username}</span>
                        </span>
                        <button
                            onClick={logout}
                            className="ml-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-label="Cerrar sesión"
                        >
                           <LogoutIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;