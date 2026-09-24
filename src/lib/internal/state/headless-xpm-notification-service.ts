import { Injectable, signal } from "@angular/core";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    type: NotificationType;
    message: string;
    error?: unknown;
}

@Injectable({
    providedIn: "root"
})

export class NotificationService {
    notification = signal<Notification | null>(null);

    show(message: string, type: NotificationType = 'info', error?: unknown, duration = 5000): void {
        this.notification.set({
            type,
            message,
            error
        });

        setTimeout(() => {
            this.notification.set(null);
        }, duration);
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string, error?: unknown): void {
        this.show(message, 'error', error, 10000);
    }

    info(message: string): void {
        this.show(message, 'info');
    }

    warning(message: string): void {
        this.show(message, 'warning');
    }

    clear(): void {
        this.notification.set(null);
    }
}