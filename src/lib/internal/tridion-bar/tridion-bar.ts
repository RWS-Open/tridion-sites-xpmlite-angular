import { CommonModule } from "@angular/common";
import { afterNextRender, ChangeDetectionStrategy, Component, DOCUMENT, EnvironmentInjector, inject, input, OnDestroy, output, runInInjectionContext, signal } from "@angular/core";
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from "../state/headless-xpm-auth.service";
import { XpmPageInfoService } from "../state/headless-xpm-page-info.service";
import { PublishService } from "../state/headless-xpm-publish.service";
import { XpmStateService } from "../state/headless-xpm-state.service";

import { filter, Subscription } from "rxjs";
import { HeadlessXpmPageCreationService } from "../state/headless-xpm-page-creation.service";
import { StringUtils } from "../utils/StringUtils";
import { PageCreation } from "./page-creation/page-creation";
import { PageInfo } from "./page-info/page-info";
import { PublishPageModal } from "./page-info/publish-page/publish-page-modal";

@Component({
    selector: "app-tridion-bar",
    imports: [CommonModule, PageInfo, PublishPageModal, PageCreation],
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
    private pageCreationService = inject(HeadlessXpmPageCreationService)

    readonly isAuthenticated = this.authService.isAuthenticated
    readonly showPageEditMode = this.xpmState.isPageEnabled
    readonly showPublishModal = this.publishService.showPublishModal
    readonly showPageInfo = this.xpmPageInfoService.showPageInfo;
    readonly showPageCreationModal = this.pageCreationService.showPageCreationModal

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

    togglePageCreation(){
        this.pageCreationService.togglePageCreationModal()
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

    ngOnInit(): void {
        if (this.isAuthenticated()) {
            this.routerSub = this.router.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {

                    runInInjectionContext(this.envInjector, () => {
                        afterNextRender(() => {
                            if (this.isAuthenticated()) {
                                this.getPageInfoByPageId();
                            }
                        });
                    });

                });
        }
    }

    private getPageInfoByPageId() {
        const observer = new MutationObserver(() => {
            const tcmId = this.xpmPageInfoService.getPageId();
            if (tcmId) {
                observer.disconnect()
                this.xpmPageInfoService.getPageInfo(tcmId);
                this.xpmPageInfoService.updatePageId(tcmId);
            }
        });

        observer.observe(this.document.body, {
            childList: true,
            subtree: true,
            attributes: true
        })
    }
    ngOnDestroy(): void {
        this.routerSub?.unsubscribe();
    }
}