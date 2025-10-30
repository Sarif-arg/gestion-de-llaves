
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Key, User, KeyStatus, UserRole, LogEntry, LogEntryType } from '../types';
import KeyFormModal from './KeyFormModal';
import ConfirmModal from './ConfirmModal';
import { PlusIcon } from './icons/PlusIcon';
import { UserIcon } from './icons/UserIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { KeyIcon } from './icons/KeyIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const AdminDashboard: React.FC = () => {
    const { keys, users, addUser, deleteKey, auditLog } = useApp();
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<Key | null>(null);
    const [deletingKey, setDeletingKey] = useState<Key | null>(null);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUserPhone, setNewUserPhone] = useState('');

    const handleAddKey = () => {
        setEditingKey(null);
        setIsKeyModalOpen(true);
    };

    const handleEditKey = (key: Key) => {
        setEditingKey(key);
        setIsKeyModalOpen(true);
    };

    const handleDeleteKey = (key: Key) => {
        setDeletingKey(key);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteKey = (personName: string, reason: string) => {
        if (deletingKey) {
            deleteKey(deletingKey.id, reason, personName);
        }
        setIsDeleteModalOpen(false);
        setDeletingKey(null);
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({ username: newUsername, password: newPassword, phone: newUserPhone, role: UserRole.USER });
        setNewUsername('');
        setNewPassword('');
        setNewUserPhone('');
        setIsUserModalOpen(false);
    };

    const handleDownloadLog = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLog, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `historial_llaves_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    
    const colorMap: { [key: string]: string } = {
        GREEN: 'bg-green-600',
        BLUE: 'bg-blue-600',
        YELLOW: 'bg-yellow-600',
        RED: 'bg-red-600',
    };

    const eventTypeColors: { [key in LogEntryType]: string } = {
        [LogEntryType.KEY_CREATED]: 'bg-blue-500/20 text-blue-400',
        [LogEntryType.KEY_CHECKED_OUT]: 'bg-yellow-500/20 text-yellow-400',
        [LogEntryType.KEY_RETURNED]: 'bg-green-500/20 text-green-400',
        [LogEntryType.KEY_DELETED]: 'bg-red-500/20 text-red-400',
    };

    const activeKeys = keys.filter(k => k.status !== KeyStatus.DELETED);

    const checkedOutKeyLogIds = useMemo(() => {
        const latestEvents = new Map<string, LogEntry>();
        [...auditLog].reverse().forEach(log => {
            latestEvents.set(log.keyId, log);
        });

        const checkedOut = new Set<string>();
        latestEvents.forEach((log) => {
            if (log.type === LogEntryType.KEY_CHECKED_OUT) {
                checkedOut.add(log.id);
            }
        });
        return checkedOut;
    }, [auditLog]);


    return (
        <div className="space-y-8">
            {/* Key Management */}
            <section className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center"><KeyIcon className="w-6 h-6 mr-2"/>Gestión de Llaves</h2>
                    <button onClick={handleAddKey} className="flex items-center bg-brand-yellow hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Agregar Llave
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3">Código</th>
                                <th className="p-3">Dirección</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeKeys.map(key => (
                                <tr key={key.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3 font-mono">
                                        <span className={`inline-block w-4 h-4 rounded-full mr-3 ${colorMap[key.color]}`}></span>
                                        {key.visibleCode}
                                    </td>
                                    <td className="p-3">{key.address}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${key.status === KeyStatus.AVAILABLE ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {key.status === KeyStatus.AVAILABLE ? 'Disponible' : `Retirada por ${key.checkoutLog?.personName}`}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleEditKey(key)} className="p-2 text-gray-400 hover:text-white" disabled><EditIcon className="w-5 h-5 opacity-50"/></button>
                                        <button onClick={() => handleDeleteKey(key)} className="p-2 text-gray-400 hover:text-brand-red"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
             {/* Audit Log */}
             <section className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold flex items-center"><UserIcon className="w-6 h-6 mr-2"/>Bitácora de Actividad</h2>
                    <button onClick={handleDownloadLog} className="flex items-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Descargar Historial (JSON)
                    </button>
                </div>
                <div className="overflow-x-auto">
                   {auditLog.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Evento</th>
                                    <th className="p-3">Llave</th>
                                    <th className="p-3">Detalles</th>
                                    <th className="p-3 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLog.map(log => {
                                    let isOverdue = false;
                                    
                                    if (log.type === LogEntryType.KEY_CHECKED_OUT && checkedOutKeyLogIds.has(log.id)) {
                                        const checkoutDate = new Date(log.date);
                                        const now = new Date();
                                        const hoursDiff = (now.getTime() - checkoutDate.getTime()) / (1000 * 3600);
                                        isOverdue = hoursDiff > 48;
                                    }

                                    const handleWhatsAppClick = () => {
                                        if (!log.details.phone) return;
                                        const message = `Hola ${log.details.actor}, te escribimos desde Almiron Propiedades para recordarte que la llave ${log.keyVisibleCode} de la propiedad en ${log.details.keyAddress} necesita ser devuelta. ¡Gracias!`;
                                        const encodedMessage = encodeURIComponent(message);
                                        window.open(`https://wa.me/${log.details.phone.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
                                    };

                                    return (
                                        <tr key={log.id} className={`border-b border-gray-700 ${isOverdue ? 'bg-red-900/40' : 'hover:bg-gray-700/50'}`}>
                                            <td className="p-3 text-sm text-gray-400">{new Date(log.date).toLocaleString('es-AR')}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${eventTypeColors[log.type]}`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono">{log.keyVisibleCode}</td>
                                            <td className="p-3 text-sm">
                                                <p><span className="font-semibold">{log.details.actor}</span> {log.details.keyAddress && `(${log.details.keyAddress})`}</p>
                                                {log.details.phone && <p className="text-xs text-gray-400">Tel: {log.details.phone}</p>}
                                                {log.details.reason && <p className="text-xs text-gray-400">Motivo: {log.details.reason}</p>}
                                            </td>
                                            <td className="p-3 text-right">
                                                {isOverdue && log.details.phone && (
                                                    <button onClick={handleWhatsAppClick} className="flex items-center ml-auto bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors">
                                                        <WhatsAppIcon className="w-4 h-4 mr-2" />
                                                        Pedir Devolución
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay actividad registrada.</p>
                   )}
                </div>
            </section>

            {/* User Management */}
            <section className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center"><UserIcon className="w-6 h-6 mr-2"/>Gestión de Usuarios</h2>
                    <button onClick={() => setIsUserModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Agregar Usuario
                    </button>
                </div>
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                           <div>
                                <span className="font-semibold text-white">{user.username}</span>
                                {user.phone && <span className="block text-xs text-gray-400">{user.phone}</span>}
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === UserRole.ADMIN ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-300'}`}>
                                {user.role}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {isKeyModalOpen && (
                <KeyFormModal
                    isOpen={isKeyModalOpen}
                    onClose={() => setIsKeyModalOpen(false)}
                    keyData={editingKey}
                />
            )}
            
            {isDeleteModalOpen && deletingKey && (
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={(personName, reason) => confirmDeleteKey(personName!, reason!)}
                    title="Dar de Baja Llave"
                    message={`¿Estás seguro que quieres dar de baja la llave ${deletingKey.visibleCode}? Esta acción no se puede deshacer y quedará registrada.`}
                    confirmText="Dar de Baja"
                    isDelete={true}
                />
            )}
            
            {isUserModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Usuario</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono (ej: 54911...)"
                                    value={newUserPhone}
                                    onChange={(e) => setNewUserPhone(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Agregar Usuario</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}

        </div>
    );
};

export default AdminDashboard;
