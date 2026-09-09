import { NgTemplateOutlet } from "@angular/common";
import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";


@Component({
    selector: "app-modal",
    imports: [NgTemplateOutlet],
    templateUrl: "./modal.html",
    styleUrls: ["./modal.css"],
})

export class HeadlessXpmModal {
    @Input() isOpen = false;
    @Input() title = 'Modal';
    @Input() cancelButtonText = 'Cancel';
    @Input() okButtonText = 'Confirm';
    @Input() template?: TemplateRef<any>;

    @Input() disableOkButton = false;
    @Input() showOkButton = true;
    @Input() showCancelButton = true;

    @Output() okButton = new EventEmitter<void>();
    @Output() closeButton = new EventEmitter<void>();
}