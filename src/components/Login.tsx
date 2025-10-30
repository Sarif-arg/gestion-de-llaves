
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KeyIcon } from './icons/KeyIcon';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(username, password)) {
            setError('Usuario o contraseña inválidos.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <KeyIcon className="mx-auto h-12 w-12 text-brand-yellow" />
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Sistema de llaves
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Almiron Propiedades
                    </p>
                    <p className="mt-4 text-sm text-gray-400">
                        Use <code className="bg-gray-700 px-1 rounded">admin</code>/<code className="bg-gray-700 px-1 rounded">adminpassword</code> o <code className="bg-gray-700 px-1 rounded">user</code>/<code className="bg-gray-700 px-1 rounded">userpassword</code>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow focus:z-10 sm:text-sm"
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-brand-red text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-yellow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-yellow"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;