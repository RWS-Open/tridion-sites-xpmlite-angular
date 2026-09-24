import { isPlatformBrowser } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, PLATFORM_ID, Signal } from "@angular/core";

import { HeadlessXpmProviderState } from "../internal/state/headless-xpm-provider.state";
import { XpmStateService } from "../internal/state/headless-xpm-state.service";

import { AuthService } from "../internal/state/headless-xpm-auth.service";
import { injectHeadlessXpmStyles } from '../internal/style/xpm-style';
import { TridionBar } from "../internal/tridion-bar/tridion-bar";

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
    sitemapPageId = input<string>();

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
            this.providerState.updateSitemapPageId(this.sitemapPageId() as string);
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
            if (isAuth && this.staging()) {
                injectHeadlessXpmStyles(isPlatformBrowser(this.platformId));
            } else {
                this.removeHeadlessXpmStyles();
            }
        })
    }
}