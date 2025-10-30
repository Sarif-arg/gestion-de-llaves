
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Key } from '../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { personName: string, personPhone?: string }) => void;
    keyData: Key;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onConfirm, keyData }) => {
    const { currentUser } = useApp();
    const [checkoutType, setCheckoutType] = useState<'me' | 'other'>('me');
    const [otherName, setOtherName] = useState('');
    const [otherPhone, setOtherPhone] = useState('');
    const [isFormValid, setIsFormValid] = useState(true);

    useEffect(() => {
        if (checkoutType === 'me') {
            setIsFormValid(true);
        } else {
            setIsFormValid(otherName.trim() !== '' && otherPhone.trim() !== '');
        }
    }, [checkoutType, otherName, otherPhone]);
    
    useEffect(() => {
        // Reset form when modal opens or key changes
        setCheckoutType('me');
        setOtherName('');
        setOtherPhone('');
    }, [isOpen, keyData]);

    const handleConfirm = () => {
        if (!isFormValid) return;

        if (checkoutType === 'me' && currentUser) {
            onConfirm({ personName: currentUser.username });
        } else {
            onConfirm({ personName: otherName, personPhone: otherPhone });
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white">Retirar Llave {keyData.visibleCode}</h2>
                <p className="mt-2 text-gray-400">¿Quién retira la llave de la propiedad en {keyData.address}?</p>
                
                <div className="mt-6">
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setCheckoutType('me')}
                            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${checkoutType === 'me' ? 'bg-brand-blue text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Yo ({currentUser?.username})
                        </button>
                        <button
                            onClick={() => setCheckoutType('other')}
                            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${checkoutType === 'other' ? 'bg-brand-blue text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Otro
                        </button>
                    </div>
                </div>

                {checkoutType === 'other' && (
                    <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={otherName}
                            onChange={(e) => setOtherName(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                         <input
                            type="tel"
                            placeholder="Teléfono de contacto"
                            value={otherPhone}
                            onChange={(e) => setOtherPhone(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold">Cancelar</button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isFormValid}
                    >
                        Confirmar Retiro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
