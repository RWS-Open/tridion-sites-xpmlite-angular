import { afterNextRender, ChangeDetectionStrategy, Component, DOCUMENT, EnvironmentInjector, inject, input, OnDestroy, OnInit, output, runInInjectionContext, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { XpmPageInfoService } from "../state/headless-xpm-page-info.service";
import { PublishService } from "../state/headless-xpm-publish.service";
import { XpmStateService } from "../state/headless-xpm-state.service";
import { AuthService } from "../state/headless-xpm-auth.service";

import { PublishPageModal } from "./page-info/publish-page/publish-page-modal";
import { PageInfo } from "./page-info/page-info";
import { StringUtils } from "../utils/StringUtils";
import { filter, startWith, Subscription } from "rxjs";

@Component({
    selector: "app-tridion-bar",
    imports: [CommonModule, PageInfo, PublishPageModal],
    templateUrl: "./tridion-bar.html",
    styleUrl: './tridion-bar.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TridionBar implements OnDestroy {
    private readonly router = inject(Router);
    private envInjector = inject(EnvironmentInjector);
    private routerSub?: Subscription;
    private readonly _showXpmBar = signal<boolean>(false)

    readonly showXpmBar = this._showXpmBar.asReadonly()

    readonly isXpmEnabled = input.required<boolean>();
    readonly pageLink = input<boolean | null>(null);
    readonly updateXpmMode = output<void>();
    readonly updateXpmPageMode = output<void>();

    private document = inject(DOCUMENT);
    private xpmState = inject(XpmStateService);
    private authService = inject(AuthService)
    private xpmPageInfoService = inject(XpmPageInfoService)
    private publishService = inject(PublishService)

    readonly isAuthenticated = this.authService.isAuthenticated
    readonly showPageEditMode = this.xpmState.isPageEnabled
    readonly showPublishModal = this.publishService.showPublishModal
    readonly showPageInfo = this.xpmPageInfoService.showPageInfo;

    onUpdateXpm(): void {
        this.updateXpmMode.emit()
    }
    onUpdateXpmPage(): void {
        this.updateXpmPageMode.emit()
    }

    toggleXpmBar() {
        this._showXpmBar.set(!this.showXpmBar())
    }

    togglePageInfo(): void {
        if (this.isAuthenticated()) {
            const pageId = this.xpmPageInfoService.getPageId();
            this.xpmPageInfoService.updatePageId(pageId as string)
            if (!this.xpmPageInfoService.showPageInfo()) {
                this.xpmPageInfoService.togglePageInfo(!this.xpmPageInfoService.showPageInfo())
                const pageTcmId = StringUtils.sanitizeIdentifier(pageId as string)
                this.xpmPageInfoService.getPageInfo(pageTcmId)
            } else {
                this.xpmPageInfoService.togglePageInfo(!this.xpmPageInfoService.showPageInfo())
            }
        }
    }

    togglePublishingModal() {
        this.publishService.togglePublishModal()
    }

    async signin() {
        await this.authService.login()
        this.xpmPageInfoService.togglePageInfo(false)
    }

    signout() {
        this.authService.logout()
        this.xpmPageInfoService.togglePageInfo(false)
    }

    /* ngOnInit(): void {
        this.routerSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => {

            runInInjectionContext(this.envInjector, () => {
                afterNextRender(() => {
                    const tcmId = this.xpmPageInfoService.getPageId();

                    if (tcmId) {
                        this.xpmPageInfoService.getPageInfo(tcmId);
                        this.xpmPageInfoService.updatePageId(tcmId);
                    }
                });
            });
        });
    } */
    ngOnInit(): void {
        this.routerSub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {

                runInInjectionContext(this.envInjector, () => {
                    afterNextRender(() => {
                        this.waitForPageId();
                    });
                });

            });
    }

    private waitForPageId() {
        const observer = new MutationObserver(() => {
            const tcmId = this.xpmPageInfoService.getPageId();
            if (tcmId) {
                observer.disconnect()
                this.xpmPageInfoService.getPageInfo(tcmId);
                this.xpmPageInfoService.updatePageId(tcmId);
            }
        });

        observer.observe(this.document.body, {
            childList:true,
            subtree:true,
            attributes:true
        })
    }
    ngOnDestroy(): void {
        this.routerSub?.unsubscribe();
    }
}