import { Component, ContentChild, Input, TemplateRef } from "@angular/core";

@Component({
    selector: "app-step",
    templateUrl: "./step.html",
    styleUrls: ["./step.css"],
    standalone:true
})

export class Step {
    @Input() label!: string;
    @Input() disabled = false;

    @ContentChild('stepsTemplate', { static: true }) template!: TemplateRef<any>;
}