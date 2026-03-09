import { ChangeDetectionStrategy, Component, ComponentRef, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, OnInit, Renderer2, signal, ViewChild, ViewContainerRef } from "@angular/core";
import { CommonModule } from "@angular/common";

import { XpmStateService } from "../internal/state/headless-xpm-state.service";
import { HeadlessXpmProviderState } from "../internal/state/headless-xpm-provider.state";
import { fromEvent, Subscription } from "rxjs";
import { InlineEditor } from "./inline-editor/inline-editor";
import { AuthService } from "../internal/state/headless-xpm-auth.service";
import { InlineEditorService } from "../internal/state/headless-xpm-inline-editor.service";
import { StringUtils } from "../internal/utils/StringUtils";

function splitStyle(style: string | Record<string, any> | null | undefined) {
    return {
        styleString: typeof style === 'string' ? style : null,
        styleObject: style && typeof style === 'object' && Object.keys(style).length ? style : null
    };
}

@Component({
    standalone: true,
    selector: `headless-xpm-editor`,
    imports: [CommonModule],
    templateUrl: "./headless-xpm-editor.html",
    styleUrl: './headless-xpm-editor.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeadlessXpmEditor implements OnInit, OnDestroy {
    private dblClickSub!: Subscription;

    private renderer = inject(Renderer2)
    private el = inject(ElementRef)
    private xpmState = inject(XpmStateService);
    private providerState = inject(HeadlessXpmProviderState, { optional: true });
    private authService = inject(AuthService)
    private inlineEditorService = inject(InlineEditorService);

    private readonly _isXpmEditingEnabled = signal<boolean>(false)
    readonly isXpmEditingEnabled = this._isXpmEditingEnabled.asReadonly();
    readonly tcmId = input.required<string>();
    readonly isPage = input(false);
    readonly containerStyle = input<string | Record<string, any>>({});
    readonly contentStyle = input<string | Record<string, any>>({});
    readonly linkStyle = input<string | Record<string, any>>({});
    readonly iconStyle = input<string | Record<string, any>>({});

    readonly editUrl = computed(() => {
        const editorUrl = this.providerState?.editorUrl();
        const tcmId = this.tcmId?.();
        if (!editorUrl || !tcmId) return null;

        const path = this.isPage() ? 'page' : 'component';
        return `${editorUrl}/${path}?item=${tcmId}`;
    });
    readonly isAuthenticated = computed(() => this.authService.getAccessToken())
    readonly showXpm = computed(() => this.providerState?.staging() && (this.xpmState.isXpmEnabled() || !this.providerState.shouldShowToolbar()))
    readonly showPageXpm = computed(() => this.providerState?.staging() && (this.xpmState.isPageEnabled() || !this.providerState.shouldShowToolbar()))
    readonly shouldShowEditIcon = computed(() => this.isPage() ? this.showPageXpm() : this.showXpm());
    readonly shouldShowRegionHover = computed(() => {
        if (this.isPage()) {
            return this.showPageXpm();
        }

        return this.showXpm();
    });

    @HostBinding('class') customClasses = '';

    readonly containerStyles = computed(() => splitStyle(this.containerStyle()));
    readonly contentStyles = computed(() => splitStyle(this.contentStyle()));
    readonly linkStyles = computed(() => splitStyle(this.linkStyle()));
    readonly iconStyles = computed(() => splitStyle(this.iconStyle()));

    @ViewChild('hostContainer', { read: ViewContainerRef })
    vcr!: ViewContainerRef;

    inputValue = signal<string>("")
    private editorRef?: ComponentRef<InlineEditor>;
    private targetElement: HTMLElement | null = null;

    ngOnInit(): void {
        this.dblClickSub = fromEvent<MouseEvent>(this.el.nativeElement, 'dblclick').subscribe((event) => {
            if (!this.isAuthenticated()) {
                this.cleanup()
                console.warn('Action restricted: Authentication is required.');
                return;
            }
            const target = event.target as HTMLElement;
            const fieldName = target?.getAttribute('xpm-editable-field-name') as string;
            const fieldPosition = target?.getAttribute('xpm-editable-field-position') as string;

            if (target.closest('.xpm-edit-container')) return;

            this.targetElement = target;

            const parent = target.parentElement;
            if (!parent) return;

            const currentValue = target.textContent?.trim() || '';

            // Destroy previous editor
            this.editorRef?.destroy();

            // Hide original element
            this.renderer.setStyle(target, 'display', 'none');

            // Create editor
            this.editorRef = this.vcr.createComponent(InlineEditor);

            const instance = this.editorRef.instance;
            instance.inputValue.set(currentValue);
            instance.tcmId.set(this.tcmId())
            instance.fieldName.set(fieldName)
            instance.fieldPosition.set(fieldPosition)

            instance.saveChanges = (val: string) => {
                target.textContent = val;
                this.cleanup();
            };

            instance.cancelChanges = () => {
                this.cleanup();
            };

            // Move editor to correct DOM position
            parent.insertBefore(
                this.editorRef.location.nativeElement,
                target.nextSibling
            );
            this.xpmEdit()
        });
    }

    private xpmEdit() {
        const componentId = StringUtils.sanitizeIdentifier(this.tcmId())
        this._isXpmEditingEnabled.set(true)
        this.inlineEditorService.getItem(componentId)
    }

    private cleanup() {
        if (!this.targetElement) return;

        this.renderer.removeStyle(this.targetElement, 'display');
        this.editorRef?.destroy();

        this.targetElement = null;
    }
    ngOnDestroy(): void {
        if (this.dblClickSub) {
            this.dblClickSub.unsubscribe()
        }
    }

    constructor() {
        if (!this.providerState) {
            console.error('HeadlessXpmEditor must be used inside a HeadlessXpmProvider');
        }
        effect(() => {
            if (!this.authService.isAuthenticated()) {
                this.cleanup();
            }
        });
    }
}