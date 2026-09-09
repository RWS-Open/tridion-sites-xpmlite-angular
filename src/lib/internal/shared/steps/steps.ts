import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, ContentChildren, EventEmitter, inject, Input, OnInit, Output, QueryList } from "@angular/core";
import { StepperService } from "../../state/headless-xpm-stepper.service";
import { Step } from "./step/step";

@Component({
    selector: "app-steps",
    standalone: true,
    templateUrl: "./steps.html",
    styleUrls: ["./steps.css"],
    imports: [NgTemplateOutlet],
    providers: [StepperService]
})

export class Steps implements OnInit {

    @ContentChildren(Step, { descendants: true }) steps!: QueryList<Step>;

    @Input() activeIndex = 0;
    @Output() activeIndexChange = new EventEmitter<number>();

    readonly stepperService = inject(StepperService)

    nextLabel = computed(() => this.stepperService.nextLabel())
    prevLabel = computed(() => this.stepperService.prevLabel())
    stepError = computed(() => this.stepperService.stepError())

    ngOnInit(): void {
        this.stepperService.moveForward.subscribe(() => this.updateIndex(1))
        this.stepperService.moveBackward.subscribe(() => this.updateIndex(-1))
    }

    private updateIndex(index: number) {
        const newIndex = this.activeIndex + index
        if (newIndex >= 0 && newIndex < this.steps.length) {
            this.activeIndex = newIndex
            this.activeIndexChange.emit(this.activeIndex)
            this.stepperService.canNext.set(false)
        }
    }

    isCompleted(index: number): boolean {
        return index < this.activeIndex;
    }
}