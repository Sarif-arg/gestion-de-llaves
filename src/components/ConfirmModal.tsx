
import React, { useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (inputValue?: string, secondInputValue?: string) => void;
    title: string;
    message: string;
    confirmText: string;
    isDelete?: boolean;
    isCheckout?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDelete = false, isCheckout = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [secondInputValue, setSecondInputValue] = useState('');

    const handleConfirm = () => {
        onConfirm(inputValue, secondInputValue);
        setInputValue('');
        setSecondInputValue('');
    };

    if (!isOpen) return null;

    const confirmButtonColor = isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="mt-2 text-gray-400">{message}</p>
                
                {(isDelete || isCheckout) && (
                    <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            placeholder={isCheckout ? "Nombre de quien retira" : "Nombre de quien retira"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {isDelete && (
                             <input
                                type="text"
                                placeholder="Motivo (ej: Vendida, Dueño retiró)"
                                value={secondInputValue}
                                onChange={(e) => setSecondInputValue(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold">Cancelar</button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg ${confirmButtonColor} text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={(isDelete || isCheckout) && (!inputValue || (isDelete && !secondInputValue))}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;