
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Key, KeyColor } from '../types';

interface KeyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    keyData: Key | null;
}

const KeyFormModal: React.FC<KeyFormModalProps> = ({ isOpen, onClose, keyData }) => {
    const { addKey, updateKey, keys } = useApp();
    const [visibleCode, setVisibleCode] = useState('');
    const [address, setAddress] = useState('');
    const [color, setColor] = useState<KeyColor>(KeyColor.GREEN);
    
    useEffect(() => {
        if (keyData) {
            setVisibleCode(keyData.visibleCode);
            setAddress(keyData.address);
            setColor(keyData.color);
        } else {
            // Suggest a new unique code
            const existingCodes = new Set(keys.map(k => k.visibleCode));
            let newCode = '';
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = 0; i < letters.length; i++) {
                for (let j = 1; j <= 6; j++) {
                    const code = `${letters[i]}${j}`;
                    if (!existingCodes.has(code)) {
                        newCode = code;
                        break;
                    }
                }
                if (newCode) break;
            }
            setVisibleCode(newCode);
            setAddress('');
            setColor(KeyColor.GREEN);
        }
    }, [keyData, keys]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyData) {
            updateKey(keyData.id, visibleCode);
        } else {
            const success = addKey({ visibleCode, address, color });
            if (!success) return; // Don't close if add failed
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-white">{keyData ? 'Editar Llave' : 'Agregar Nueva Llave'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="visibleCode" className="block text-sm font-medium text-gray-300 mb-1">Código Visible</label>
                            <input
                                id="visibleCode"
                                type="text"
                                value={visibleCode}
                                onChange={(e) => setVisibleCode(e.target.value.toUpperCase())}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                required
                                pattern="[A-Z][1-6]"
                                title="El código debe ser una letra seguida de un número del 1 al 6 (ej: A1, B4)."
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                required
                                disabled={!!keyData} // Disable address editing
                            />
                             {!!keyData && <p className="text-xs text-gray-500 mt-1">La dirección no se puede cambiar después de la creación.</p>}
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">Etiqueta de Color</label>
                            <select
                                id="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value as KeyColor)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-brand-yellow focus:border-brand-yellow"
                                disabled={!!keyData} // Disable color editing
                            >
                                {Object.values(KeyColor).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {!!keyData && <p className="text-xs text-gray-500 mt-1">El color no se puede cambiar después de la creación.</p>}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-brand-yellow hover:bg-yellow-500 text-white font-semibold">
                            {keyData ? 'Guardar Cambios' : 'Agregar Llave'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KeyFormModal;