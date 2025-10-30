import React from 'react';
import { Key } from '../types';
import { ClockIcon } from './icons/ClockIcon';

interface KeyHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    keyData: Key;
}

const KeyHistoryModal: React.FC<KeyHistoryModalProps> = ({ isOpen, onClose, keyData }) => {
    if (!isOpen) return null;

    const reversedHistory = [...keyData.history].reverse();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <ClockIcon className="w-6 h-6 mr-3 text-brand-blue" />
                        Historial de Retiros: {keyData.visibleCode}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white text-3xl leading-none"
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </div>
                <p className="text-gray-400 mb-6">{keyData.address}</p>
                
                <div className="overflow-y-auto flex-grow pr-2">
                    {reversedHistory.length > 0 ? (
                        <ul className="space-y-4">
                            {reversedHistory.map((log, index) => (
                                <li key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-700">
                                    <p className="font-semibold text-white">{log.personName}</p>
                                    {log.personPhone && <p className="text-sm text-gray-400">Tel: {log.personPhone}</p>}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Retirada el: {new Date(log.date).toLocaleString('es-AR', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })} hs.
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                           <p className="text-gray-500 text-center py-8">No hay retiros anteriores para esta llave.</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default KeyHistoryModal;
