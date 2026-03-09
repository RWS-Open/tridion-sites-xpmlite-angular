import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  effect,
  inject
} from '@angular/core';
import { XpmStateService } from '../internal/state/headless-xpm-state.service';

@Directive({
  selector: '[headlessXpm]',
  standalone: true
})
export class HeadlessXpmDirective {
  @Input() tcmId!: string;
  @Input() isPage = false;
  @Input() showExpSpaceEditor = true;

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private state = inject(XpmStateService);

  private editUrl = '';

  constructor() {
    effect(() => {
      const isXpmEnabled = this.state.isXpmEnabled()
      this.updateUI(isXpmEnabled)
    })
  }

  ngOnInit() {
    this.editUrl = this.isPage
      ? `https://experience-space-editor/page?tcm=${this.tcmId}`
      : `https://experience-space-editor/component?tcm=${this.tcmId}`;

    this.renderer.addClass(this.el.nativeElement, 'headlessXpmRegion');
  }

  private updateUI(isEnabled: boolean) {
    const host = this.el.nativeElement;

    if (isEnabled || !this.showExpSpaceEditor) {
      this.renderer.addClass(host, 'headlessXpmRegion-hover');
      this.ensureEditIcon();
    } else {
      this.renderer.removeClass(host, 'headlessXpmRegion-hover');
      this.removeEditIcon();
    }
  }

  private ensureEditIcon() {
    if (this.el.nativeElement.querySelector('.headlessXpmIcon')) return;

    const anchor = this.renderer.createElement('a');
    this.renderer.addClass(anchor, 'headlessXpmIcon');
    this.renderer.setAttribute(anchor, 'href', this.editUrl);
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'rel', 'noopener noreferrer');
    anchor.innerHTML = ` <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="edit"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"
      ></path>
    </svg>`;

    this.renderer.insertBefore(
      this.el.nativeElement,
      anchor,
      this.el.nativeElement.firstChild
    );
  }

  private removeEditIcon() {
    const icon = this.el.nativeElement.querySelector('.headlessXpmIcon');
    if (icon) {
      this.renderer.removeChild(this.el.nativeElement, icon);
    }
  }
}