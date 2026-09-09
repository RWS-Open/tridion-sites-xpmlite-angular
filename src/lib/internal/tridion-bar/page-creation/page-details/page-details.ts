import { Component, effect, inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { StepperService } from "../../../state/headless-xpm-stepper.service";

@Component({
    selector: "app-page-details",
    templateUrl: "./page-details.html",
    styleUrl: "./page-details.css",
    imports: [FormsModule, ReactiveFormsModule]
})

export class PageDetails implements OnInit, OnDestroy {
    // Implementation for page details
    pageDetailsForm!: FormGroup
    private destroy$ = new Subject<void>();
    private formBuilder = inject(FormBuilder)
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService)
    private readonly stepperService = inject(StepperService)

    ngOnInit(): void {
        this.stepperService.setNextLabel('Show Page Info');
        this.stepperService.setPrevLabel('Previous');
        this.stepperService.canPrev.set(true);
        this.pageDetailsForm = this.formBuilder.group({
            name: ['', [Validators.required],],
            filename: ['', [Validators.required]],
            pageType: [{ value: "", disabled: true, }],
            template: [{ value: "", disabled: true }],
            schema: [{ value: "", disabled: true }]
        });

        this.pageDetailsForm.valueChanges.pipe(
            debounceTime(400),
            takeUntil(this.destroy$)
        ).subscribe(formData => {
            console.log("Form Data:", formData);
            const isFormValid = this.pageDetailsForm.valid;
            // Further processing of form data
            this.pageCreationService.updateFormData(formData)
            this.stepperService.canNext.set(isFormValid);
        });

        this.stepperService.nextRequest$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            console.log(this.pageDetailsForm.value)
            this.pageCreationService.updateSelectedPageData()
            this.stepperService.isLoading.set(false);
            this.stepperService.complete();
        });
        this.stepperService.prevRequest$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.stepperService.goback();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stepperService.setNextLabel('Next');
        this.stepperService.setPrevLabel('Previous');
    }

    onSubmit() {
        // Handle form submission
        if (this.pageDetailsForm.valid) {
            const formPageData = this.pageDetailsForm.value;
            console.log("Form Page Data:", formPageData);

            // Further processing of form page data
        }
    }

    constructor() {
        effect(() => {
            this.initializeFormWithSelectedPageType()
        })
    }

    private initializeFormWithSelectedPageType() {
        const selectedPageType = this.pageCreationService.selectedPageType()
        if (selectedPageType) {
            this.pageDetailsForm.patchValue({
                template: selectedPageType.pageTemplate.templateTitle,
                schema: selectedPageType.pageSchema.schemaTitle,
                pageType: selectedPageType.pageTitle
            })
        }
    }
}