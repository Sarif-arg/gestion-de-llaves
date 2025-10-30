
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Key, KeyStatus } from '../types';
import KeyCard from './KeyCard';
import ConfirmModal from './ConfirmModal';
import CheckoutModal from './CheckoutModal';
import KeyHistoryModal from './KeyHistoryModal';

const UserDashboard: React.FC = () => {
    const { keys, checkoutKey, returnKey, currentUser } = useApp();
    const [selectedKey, setSelectedKey] = useState<Key | null>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedKeyForHistory, setSelectedKeyForHistory] = useState<Key | null>(null);


    const handleCheckoutClick = (key: Key) => {
        setSelectedKey(key);
        setIsCheckoutModalOpen(true);
    };

    const handleReturnClick = (key: Key) => {
        setSelectedKey(key);
        setIsReturnModalOpen(true);
    };

    const handleViewHistoryClick = (key: Key) => {
        setSelectedKeyForHistory(key);
        setIsHistoryModalOpen(true);
    };

    const confirmCheckout = (data: { personName: string, personPhone?: string }) => {
        if (selectedKey) {
            checkoutKey(selectedKey.id, data.personName, data.personPhone);
        }
        setIsCheckoutModalOpen(false);
        setSelectedKey(null);
    };
    
    const confirmReturn = () => {
        if (selectedKey && currentUser) {
            returnKey(selectedKey.id, currentUser.username);
        }
        setIsReturnModalOpen(false);
        setSelectedKey(null);
    };

    const activeKeys = keys.filter(k => k.status !== KeyStatus.DELETED);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Estado de las Llaves</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {activeKeys.map(key => (
                    <KeyCard 
                        key={key.id} 
                        keyData={key} 
                        onCheckout={() => handleCheckoutClick(key)} 
                        onReturn={() => handleReturnClick(key)}
                        onViewHistory={() => handleViewHistoryClick(key)}
                    />
                ))}
            </div>

            {isCheckoutModalOpen && selectedKey && (
                <CheckoutModal
                    isOpen={isCheckoutModalOpen}
                    onClose={() => setIsCheckoutModalOpen(false)}
                    onConfirm={confirmCheckout}
                    keyData={selectedKey}
                />
            )}

            {isReturnModalOpen && selectedKey && (
                <ConfirmModal
                    isOpen={isReturnModalOpen}
                    onClose={() => setIsReturnModalOpen(false)}
                    onConfirm={confirmReturn}
                    title="Devolver Llave"
                    message={`¿Estás seguro que quieres marcar la llave ${selectedKey.visibleCode} como devuelta?`}
                    confirmText="Devolver Llave"
                />
            )}

            {isHistoryModalOpen && selectedKeyForHistory && (
                <KeyHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    keyData={selectedKeyForHistory}
                />
            )}
        </div>
    );
};

export default UserDashboard;
