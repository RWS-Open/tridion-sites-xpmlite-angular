import { DOCUMENT, inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";

@Injectable({
    providedIn: "root"
})

export class XpmHighlighter {
    private document = inject(DOCUMENT);
    private renderer: Renderer2;

    private previouslySelectedElement: HTMLElement | null = null;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null)
    }

    findScrollHightLightArea(selector: string) {

        this.clearPreviousSelection();
        const element = this.document.querySelector(selector) as HTMLElement

        if (!element) {
            console.warn(`[Lib Could not find element with selector:${selector}]`);
            return;
        }

        this.renderer.addClass(element, 'xpm-highlight');

        this.renderer.setStyle(element, 'outline', '#28a745 solid 4px');
        this.renderer.setStyle(element, 'outline-offset', '-2px');
        this.renderer.setStyle(element, 'transition', 'outline 0.3s ease-in-out');
        this.renderer.setStyle(element, 'position', 'relative');
        this.renderer.setStyle(element, 'z-index', 99);

        element.scrollIntoView({
            behavior: 'smooth',
            block: "center"
        })
        this.previouslySelectedElement = element
    }
    private clearPreviousSelection() {
        if (this.previouslySelectedElement) {
            this.renderer.removeClass(this.previouslySelectedElement, 'xpm-highlight');
            this.renderer.removeStyle(this.previouslySelectedElement, 'outline');
            this.renderer.removeStyle(this.previouslySelectedElement, 'outline-offset');
            this.renderer.removeStyle(this.previouslySelectedElement, 'transition');
            this.renderer.removeStyle(this.previouslySelectedElement, 'position');
            this.renderer.removeStyle(this.previouslySelectedElement, 'z-index');
            this.previouslySelectedElement = null;
        }
    }
}