export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface User {
    id: string;
    username: string;
    password?: string; // Should not be stored in production, here for simplicity
    role: UserRole;
    phone?: string;
}

export enum KeyColor {
    GREEN = 'GREEN',
    BLUE = 'BLUE',
    YELLOW = 'YELLOW',
    RED = 'RED',
}

export enum KeyStatus {
    AVAILABLE = 'AVAILABLE',
    CHECKED_OUT = 'CHECKED_OUT',
    DELETED = 'DELETED',
}

export interface CheckoutLog {
    personName: string;
    personPhone?: string;
    date: string;
}

export interface DeletionLog {
    reason: string;
    personName: string;
    date: string;
}

export interface Key {
    id: string;
    visibleCode: string;
    color: KeyColor;
    address: string;
    status: KeyStatus;
    checkoutLog?: CheckoutLog;
    deletionLog?: DeletionLog;
    history: CheckoutLog[];
}

export enum LogEntryType {
    KEY_CREATED = 'Llave Creada',
    KEY_CHECKED_OUT = 'Llave Retirada',
    KEY_RETURNED = 'Llave Devuelta',
    KEY_DELETED = 'Llave Dada de Baja',
}

export interface LogEntry {
    id: string;
    date: string;
    type: LogEntryType;
    keyId: string;
    keyVisibleCode: string;
    details: {
        actor: string; // Who did it
        phone?: string; // For checkouts
        reason?: string; // For deletions
        keyAddress: string; // For context
    };
}
