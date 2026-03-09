import { Injectable, signal } from "@angular/core";

@Injectable()

export class XpmStateService {
    private readonly _isXpmEnabled = signal(false);
    private readonly _isPageEnabled = signal(false);

    readonly isXpmEnabled = this._isXpmEnabled.asReadonly();
    readonly isPageEnabled = this._isPageEnabled.asReadonly();

    toggleXpmMode(): void {
        this._isXpmEnabled.update(value => !value)
    }
    toggleXpmPageMode(): void {
        this._isPageEnabled.update(value => !value)
    }
}