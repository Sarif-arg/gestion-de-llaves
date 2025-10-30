import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { User, Key, UserRole, KeyStatus, KeyColor, CheckoutLog, LogEntry, LogEntryType } from '../types';

// --- TEST DATA SETUP ---
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const overdueCheckoutLog: CheckoutLog = {
    personName: 'Contratista X',
    personPhone: '5491133334444',
    date: threeDaysAgo,
};

const initialOverdueLogEntry: LogEntry = {
    id: `log-initial-overdue-${threeDaysAgo}`,
    date: threeDaysAgo,
    type: LogEntryType.KEY_CHECKED_OUT,
    keyId: 'key-6',
    keyVisibleCode: 'A6',
    details: {
        actor: 'Contratista X',
        phone: '5491133334444',
        keyAddress: 'Tucuman 1566 1er Piso A',
    }
};
// --- END TEST DATA SETUP ---


// Define initial data at the top to ensure it's available when needed.
const initialAdminUser: User = { id: 'admin-0', username: 'admin', password: 'adminpassword', role: UserRole.ADMIN, phone: '5491111111111' };
const initialNormalUser: User = { id: 'user-0', username: 'user', password: 'userpassword', role: UserRole.USER, phone: '5491122222222' };

const generateKey = (id: number, visibleCode: string, color: KeyColor, address: string): Key => ({
    id: `key-${id}`,
    visibleCode,
    color,
    address,
    status: KeyStatus.AVAILABLE,
    history: [],
});

const initialUsers: User[] = [initialAdminUser, initialNormalUser];
const initialKeys: Key[] = [
    generateKey(1, 'A1', KeyColor.GREEN, 'Av San Martin 1615'),
    generateKey(2, 'A2', KeyColor.GREEN, '2 de Abril 677'),
    generateKey(3, 'A3', KeyColor.GREEN, 'Salta 81 y 85'),
    generateKey(4, 'A4', KeyColor.GREEN, 'Ayolas / Uruguay 1221'),
    generateKey(5, 'A5', KeyColor.GREEN, 'Misiones 576'),
    { // Overdue key for testing
        id: 'key-6',
        visibleCode: 'A6',
        color: KeyColor.GREEN,
        address: 'Tucuman 1566 1er Piso A',
        status: KeyStatus.CHECKED_OUT,
        history: [overdueCheckoutLog],
        checkoutLog: overdueCheckoutLog,
    },
];


interface AppContextType {
    currentUser: User | null;
    users: User[];
    keys: Key[];
    auditLog: LogEntry[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addUser: (user: Omit<User, 'id'>) => void;
    addKey: (key: Omit<Key, 'id' | 'status' | 'history'>) => boolean;
    updateKey: (keyId: string, newVisibleCode: string) => void;
    deleteKey: (keyId: string, reason: string, personName: string) => void;
    checkoutKey: (keyId: string, personName: string, personPhone?: string) => void;
    returnKey: (keyId: string, returnerName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('app_users', initialUsers);
    const [keys, setKeys] = useLocalStorage<Key[]>('app_keys', initialKeys);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('app_currentUser', null);
    const [auditLog, setAuditLog] = useLocalStorage<LogEntry[]>('app_auditLog', [initialOverdueLogEntry]);

    const login = (username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            id: new Date().toISOString(),
            ...user
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
    };

    const addKey = (keyData: Omit<Key, 'id' | 'status' | 'history'>): boolean => {
        if (keys.some(k => k.visibleCode === keyData.visibleCode && k.status !== KeyStatus.DELETED)) {
            alert('El código visible ya existe.');
            return false;
        }
        const newKey: Key = {
            id: new Date().toISOString(),
            ...keyData,
            status: KeyStatus.AVAILABLE,
            history: [],
        };

        const newLogEntry: LogEntry = {
            id: `log-${new Date().toISOString()}`,
            date: new Date().toISOString(),
            type: LogEntryType.KEY_CREATED,
            keyId: newKey.id,
            keyVisibleCode: newKey.visibleCode,
            details: {
                actor: currentUser!.username,
                keyAddress: newKey.address,
            }
        };
        
        setAuditLog(prevLog => [newLogEntry, ...prevLog]);
        setKeys(prevKeys => [...prevKeys, newKey]);
        return true;
    };

    const updateKey = (keyId: string, newVisibleCode: string) => {
        if (keys.some(k => k.id !== keyId && k.visibleCode === newVisibleCode && k.status !== KeyStatus.DELETED)) {
             alert('El código visible ya existe.');
             return;
        }
        setKeys(prevKeys => prevKeys.map(key => 
            key.id === keyId ? { ...key, visibleCode: newVisibleCode } : key
        ));
    };

    const deleteKey = (keyId: string, reason: string, personName: string) => {
        let keyToLog: Key | undefined;
        
        const updatedKeys = keys.map(key => {
            if (key.id === keyId) {
                keyToLog = key;
                return { 
                    ...key, 
                    status: KeyStatus.DELETED, 
                    deletionLog: { reason, personName, date: new Date().toISOString() } 
                };
            }
            return key;
        });
        
        if (keyToLog) {
            const newLogEntry: LogEntry = {
                id: `log-${new Date().toISOString()}`,
                date: new Date().toISOString(),
                type: LogEntryType.KEY_DELETED,
                keyId: keyToLog.id,
                keyVisibleCode: keyToLog.visibleCode,
                details: {
                    actor: personName,
                    reason: reason,
                    keyAddress: keyToLog.address,
                }
            };
            setAuditLog(prevLog => [newLogEntry, ...prevLog]);
            setKeys(updatedKeys);
        }
    };

    const checkoutKey = (keyId: string, personName: string, personPhone?: string) => {
        let keyToLog: Key | undefined;
        
        const updatedKeys = keys.map(key => {
            if (key.id === keyId) {
                keyToLog = key;
                const checkoutLog: CheckoutLog = { personName, date: new Date().toISOString() };
                if (personPhone) {
                    checkoutLog.personPhone = personPhone;
                }
                return { 
                    ...key, 
                    status: KeyStatus.CHECKED_OUT, 
                    checkoutLog,
                    history: [...key.history, checkoutLog]
                };
            }
            return key;
        });

        if (keyToLog) {
             const newLogEntry: LogEntry = {
                id: `log-${new Date().toISOString()}`,
                date: new Date().toISOString(),
                type: LogEntryType.KEY_CHECKED_OUT,
                keyId: keyToLog.id,
                keyVisibleCode: keyToLog.visibleCode,
                details: {
                    actor: personName,
                    phone: personPhone,
                    keyAddress: keyToLog.address,
                }
            };
            setAuditLog(prevLog => [newLogEntry, ...prevLog]);
            setKeys(updatedKeys);
        }
    };
    
    const returnKey = (keyId: string, returnerName: string) => {
        let keyToLog: Key | undefined;

        const updatedKeys = keys.map(key => {
            if (key.id === keyId) {
                keyToLog = key;
                const { checkoutLog, ...rest } = key;
                return {
                    ...rest,
                    status: KeyStatus.AVAILABLE,
                };
            }
            return key;
        });
        
        if (keyToLog) {
            const newLogEntry: LogEntry = {
                id: `log-${new Date().toISOString()}`,
                date: new Date().toISOString(),
                type: LogEntryType.KEY_RETURNED,
                keyId: keyToLog.id,
                keyVisibleCode: keyToLog.visibleCode,
                details: {
                    actor: returnerName,
                    keyAddress: keyToLog.address,
                }
            };
            setAuditLog(prevLog => [newLogEntry, ...prevLog]);
            setKeys(updatedKeys);
        }
    };


    const value = {
        currentUser,
        users,
        keys,
        auditLog,
        login,
        logout,
        addUser,
        addKey,
        updateKey,
        deleteKey,
        checkoutKey,
        returnKey,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};