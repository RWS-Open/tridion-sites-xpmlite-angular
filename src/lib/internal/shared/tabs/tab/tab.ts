import { Component, ContentChild, Input, TemplateRef } from "@angular/core";

@Component({
    selector: "app-tab",
    imports: [],
    templateUrl:"./tab.html"
})

export class Tab {
    @Input() label!: string;
    @Input() disabled = false;

    @ContentChild(TemplateRef)
    template!: TemplateRef<any>;
}