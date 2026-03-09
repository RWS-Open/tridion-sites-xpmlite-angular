import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn:"root"
})

export class HeadlessXpmEditorState {
    private readonly _tcmId = signal<string>('');

    private readonly _isPage = signal(false);
    private readonly _customClasses = signal<string>('');

    private readonly _containerStyle = signal<Record<string, string> | null>(null);
    private readonly _contentStyle = signal<Record<string, string> | null>(null);
    private readonly _iconStyle = signal<Record<string, string> | null>(null);
    private readonly _linkStyle = signal<Record<string, string> | null>(null);

    readonly tcmId = this._tcmId.asReadonly();
    readonly isPage = this._isPage.asReadonly();

    readonly customClasses = this._customClasses.asReadonly();

    readonly containerStyle = this._containerStyle.asReadonly();
    readonly contentStyle = this._contentStyle.asReadonly();
    readonly iconStyle = this._iconStyle.asReadonly();
    readonly linkStyle = this._linkStyle.asReadonly();

    updateTcmId(value: string): void {
        this._tcmId.set(value);
    }

    updateIsPage(value: boolean): void {
        this._isPage.set(value);
    }

    updateCustomClasses(value: string): void {
        this._customClasses.set(value);
    }

    updateContainerStyle(value: Record<string, string> | null): void {
        this._containerStyle.set(value);
    }

    updateContentStyle(value: Record<string, string> | null): void {
        this._contentStyle.set(value);
    }

    updateIconStyle(value: Record<string, string> | null): void {
        this._iconStyle.set(value);
    }

    updateLinkStyle(value: Record<string, string> | null): void {
        this._linkStyle.set(value);
    }
}