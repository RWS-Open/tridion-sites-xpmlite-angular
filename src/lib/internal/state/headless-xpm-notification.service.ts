import { Injectable, signal } from "@angular/core";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    type: NotificationType;
    message: string;
    details?: string;
    error?: unknown;
}

@Injectable({
    providedIn: "root"
})

export class NotificationService {
    notification = signal<Notification | null>(null);

    show(message: string, type: NotificationType = 'info', details: string, error?: unknown, duration = 5000): void {
        this.notification.set({
            type,
            message,
            details,
            error
        });

        setTimeout(() => {
            this.notification.set(null);
        }, duration);
    }

    success(message: string, details: string): void {
        this.show(message, 'success', details);
    }

    error(message: string, details: string, error?: unknown): void {
        this.show(message, 'error', details, error, 10000);
    }

    info(message: string, details: string): void {
        this.show(message, 'info', details);
    }

    warning(message: string, details: string): void {
        this.show(message, 'warning', details);
    }

    clear(): void {
        this.notification.set(null);
    }
}