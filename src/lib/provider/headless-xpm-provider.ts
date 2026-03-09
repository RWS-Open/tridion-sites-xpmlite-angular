import { ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID, Signal, effect, computed, OnInit } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import { XpmStateService } from "../internal/state/headless-xpm-state.service";
import { HeadlessXpmProviderState } from "../internal/state/headless-xpm-provider.state";

import { TridionBar } from "../internal/tridion-bar/tridion-bar";
import { injectHeadlessXpmStyles } from '../internal/style/xpm-style';
import { AuthService } from "../internal/state/headless-xpm-auth.service";

@Component({
    standalone: true,
    selector: 'headless-xpm-provider',
    templateUrl: './headless-xpm-provider.html',
    imports: [TridionBar],
    providers: [XpmStateService, HeadlessXpmProviderState],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeadlessXpmProvider implements OnInit {

    editorUrl = input.required<string>();
    staging = input<boolean>(false);
    showToolbar = input(false);
    showPageEditorLink = input(false);

    private readonly platformId = inject(PLATFORM_ID);
    private readonly xpmState = inject(XpmStateService);
    private readonly providerState = inject(HeadlessXpmProviderState);
    private readonly authService = inject(AuthService)


    readonly isXpmEnabled = computed(() => this.xpmState.isXpmEnabled())
    readonly shouldShowToolbar: Signal<boolean> = computed(() => this.providerState.shouldShowToolbar());
    readonly pageLink = computed(() => this.providerState.showPageEditorLink())

    constructor() {
        effect(() => {

            this.providerState.updateEditorUrl(this.editorUrl());
            this.providerState.updateStaging(this.staging() as boolean);
            this.providerState.updateShowToolbar(this.showToolbar());
            this.providerState.updateShowPageEditorLink(this.showPageEditorLink());
        });
    }

    onToggleXpmMode(): void {
        this.xpmState.toggleXpmMode()
    }

    onToggleXpmPageMode(): void {
        this.xpmState.toggleXpmPageMode()
    }
    removeHeadlessXpmStyles() {
        if (isPlatformBrowser(this.platformId)) {
            const style = document.querySelector('style[data-headless-xpm]');
            style?.parentNode?.removeChild(style);
        }
    }

    ngOnInit(): void {
        this.authService.isAuthenticated$.subscribe(isAuth => {
            if (isAuth) {
                injectHeadlessXpmStyles(isPlatformBrowser(this.platformId));
            } else {
                this.removeHeadlessXpmStyles();
            }
        })
    }
}