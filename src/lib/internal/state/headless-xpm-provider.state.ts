import { computed, Injectable, Signal, signal } from "@angular/core";

@Injectable()

export class HeadlessXpmProviderState {
    private readonly _editorUrl = signal<string>('');
    private readonly _staging = signal(false);
    private readonly _showToolbar = signal(false);
    private readonly _showPageEditorLink = signal(false);

    readonly editorUrl: Signal<string> = this._editorUrl.asReadonly();
    readonly staging: Signal<boolean> = this._staging.asReadonly();
    readonly showToolbar: Signal<boolean> = this._showToolbar.asReadonly();
    readonly showPageEditorLink: Signal<boolean> = this._showPageEditorLink.asReadonly();

    readonly shouldShowToolbar: Signal<boolean> = computed(() =>
        this._staging() && this._showToolbar()
    );

    updateEditorUrl(value: string): void {
        this._editorUrl.set(value);
    }

    updateStaging(value: boolean): void {
        this._staging.set(value);
    }

    updateShowToolbar(value: boolean): void {
        this._showToolbar.set(value);
    }

    updateShowPageEditorLink(value: boolean): void {
        this._showPageEditorLink.set(value);
    }
}