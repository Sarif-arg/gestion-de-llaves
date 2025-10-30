import React, { useState, useEffect } from 'react';
import { Key, KeyStatus } from '../types';
import { KeyIcon } from './icons/KeyIcon';

interface KeyCardProps {
    keyData: Key;
    onCheckout: () => void;
    onReturn: () => void;
    onViewHistory: () => void;
}

const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    if (days > 0) {
        return `Hace ${days} día${days > 1 ? 's' : ''}${hours > 0 ? ` y ${hours} hora${hours > 1 ? 's' : ''}` : ''}`;
    }
    if (hours > 0) {
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    return 'Hace menos de un minuto';
};

const KeyCard: React.FC<KeyCardProps> = ({ keyData, onCheckout, onReturn, onViewHistory }) => {
    const isAvailable = keyData.status === KeyStatus.AVAILABLE;
    const [relativeTime, setRelativeTime] = useState(formatRelativeTime(keyData.checkoutLog?.date));

    useEffect(() => {
        if (!isAvailable) {
            const interval = setInterval(() => {
                setRelativeTime(formatRelativeTime(keyData.checkoutLog?.date));
            }, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [isAvailable, keyData.checkoutLog?.date]);


    const colorClasses: { [key: string]: { bg: string, text: string, key: string } } = {
        GREEN: { bg: 'bg-green-900/50 border-green-500', text: 'text-green-400', key: 'text-green-500'},
        BLUE: { bg: 'bg-blue-900/50 border-blue-500', text: 'text-blue-400', key: 'text-blue-500'},
        YELLOW: { bg: 'bg-yellow-900/50 border-yellow-500', text: 'text-yellow-400', key: 'text-yellow-500'},
        RED: { bg: 'bg-red-900/50 border-red-500', text: 'text-red-400', key: 'text-red-500'},
    };

    const colorMap: { [key: string]: string } = {
        GREEN: 'bg-green-500',
        BLUE: 'bg-blue-500',
        YELLOW: 'bg-yellow-500',
        RED: 'bg-red-500',
    };
    
    const statusClasses = isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600';
    const currentColors = colorClasses[keyData.color];

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAvailable) {
            onCheckout();
        } else {
            onReturn();
        }
    };

    return (
        <div 
            onClick={onViewHistory}
            className={`relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${currentColors.bg}`}
            role="button"
            aria-label={`Ver historial de la llave ${keyData.visibleCode}`}
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${colorMap[keyData.color]}`}></span>
                        <span className={`text-2xl font-bold font-mono ${currentColors.text}`}>{keyData.visibleCode}</span>
                    </div>
                    <KeyIcon className={`w-8 h-8 ${currentColors.key}`} />
                </div>
                <div className="mt-4 text-xs text-gray-400 min-h-[50px]">
                    {isAvailable ? (
                         <span className="font-semibold text-green-400">En Inmobiliaria</span>
                    ) : (
                        <div>
                            <p>Retirada por:</p>
                            <p className="font-semibold text-yellow-400 truncate">{keyData.checkoutLog?.personName}</p>
                            {keyData.checkoutLog?.personPhone && (
                                <p className="text-xs text-gray-500 truncate">Tel: {keyData.checkoutLog.personPhone}</p>
                            )}
                            <p className="text-gray-500 mt-1">{relativeTime}</p>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleButtonClick}
                className={`w-full mt-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${statusClasses}`}
            >
                {isAvailable ? 'Retirar' : 'Devolver'}
            </button>
        </div>
    );
};

export default KeyCard;