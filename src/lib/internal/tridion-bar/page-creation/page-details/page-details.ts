import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, debounceTime, of, Subject, takeUntil, tap } from "rxjs";
import { HeadlessXpmPageCreationService } from "../../../state/headless-xpm-page-creation.service";
import { StepperService } from "../../../state/headless-xpm-stepper.service";
import { SelectedStructureGroup } from "../page-types/page-types.model";

@Component({
    selector: "app-page-details",
    templateUrl: "./page-details.html",
    styleUrl: "./page-details.css",
    imports: [FormsModule, ReactiveFormsModule]
})
export class PageDetails implements OnInit, OnDestroy {
    pageDetailsForm!: FormGroup;
    private destroy$ = new Subject<void>();
    private formBuilder = inject(FormBuilder);
    private readonly pageCreationService = inject(HeadlessXpmPageCreationService);
    private readonly stepperService = inject(StepperService);

    @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;

    readonly selectedPageType = computed(() => this.pageCreationService.selectedPageType())
    readonly strGroups = computed(() => this.pageCreationService.structureGroup());
    readonly selectedStrGroup = signal<SelectedStructureGroup | null>(null);
    readonly isDropdownOpen = signal<boolean>(false);

    backendGeneralError = signal<string | null>(null);

    constructor() {
        effect(() => {
            this.initializeFormWithSelectedPageType();
        });
    }

    ngOnInit(): void {
        this.stepperService.setNextLabel("Show Page Info");
        this.stepperService.setPrevLabel("Previous");
        this.stepperService.canPrev.set(true);

        this.pageDetailsForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            filename: ["", [Validators.required]],
            foldername: ["", [Validators.required]],
            pageType: [{ value: "", disabled: true }],
            template: [{ value: "", disabled: true }],
            schema: [{ value: "", disabled: true }]
        });

        setTimeout(() => {
            this.nameInput?.nativeElement.focus();
        }, 0);

        this.pageDetailsForm.valueChanges
            .pipe(debounceTime(400), takeUntil(this.destroy$))
            .subscribe((formData) => {

                if (this.backendGeneralError()) {
                    this.backendGeneralError.set(null);
                }

                const isFormValid = this.pageDetailsForm.valid;
                this.pageCreationService.updateFormData({
                    name: formData.name,
                    filename: formData.filename
                });
                this.stepperService.canNext.set(isFormValid);
            });

        this.stepperService.nextRequest$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.validateAndProceed();
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
        this.stepperService.setNextLabel("Next");
        this.stepperService.setPrevLabel("Previous");
    }

    private validateAndProceed() {
        if (this.pageDetailsForm.invalid) {
            this.pageDetailsForm.markAllAsTouched();
            return;
        }

        this.stepperService.isLoading.set(true);
        this.backendGeneralError.set(null);

        const formValues = this.pageDetailsForm.getRawValue();
        const enteredName = formValues.name.trim().toLowerCase();
        const enteredFileName = formValues.filename.trim().toLowerCase();

        this.pageCreationService.geteFolderItems(this.selectedStrGroup()?.Id as string).pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
                this.handleBackendErrors(err);
                this.stepperService.isLoading.set(false);
                return of(null);
            })
        )
            .subscribe((response: Record<string, unknown>[]) => {
                this.stepperService.isLoading.set(false);

                if (!response) return;
                const nameExists = response.some((item) => item["Title"] === enteredName);
                const fileNameExists = response.some((item) => item["FileName"] === enteredFileName);

                const nameControl = this.pageDetailsForm.get('name');
                const fileControl = this.pageDetailsForm.get('filename');
                if (nameExists) {
                    nameControl?.setErrors({ duplicateName: 'A page with this name already exists in this folder.' });
                    nameControl?.markAsTouched();
                    return
                }
                if (fileNameExists) {
                    fileControl?.setErrors({ duplicateFileName: 'A file with this name already exists in this folder.' });
                    fileControl?.markAsTouched();
                    return
                }

                this.stepperService.isLoading.set(true);
                const selectedFolderId = this.selectedStrGroup()?.Id as string;
                this.pageCreationService.getDefaultPageModel(selectedFolderId).pipe(
                    tap(() => this.pageCreationService.updateSelectedPageData()),
                    takeUntil(this.destroy$)
                ).subscribe({
                    next: () => {
                        this.stepperService.isLoading.set(false);
                        this.stepperService.complete();
                    },
                    error: (err) => {
                        this.stepperService.isLoading.set(false);
                        this.handleBackendErrors(err);
                    }
                });
            });
    }

    private handleBackendErrors(errorResponse: any) {
        const errors = errorResponse?.error?.fieldErrors || errorResponse?.error?.errors;

        if (errors) {
            Object.keys(errors).forEach((fieldKey) => {
                const control = this.pageDetailsForm.get(fieldKey);
                if (control) {
                    control.setErrors({ backendError: errors[fieldKey] });
                    control.markAsTouched();
                }
            });
        }

        const generalMsg = errorResponse?.error?.message || "Validation failed. Please verify your entries.";
        this.backendGeneralError.set(generalMsg);
    }

    private initializeFormWithSelectedPageType() {
        const selectedPageType = this.pageCreationService.selectedPageType();
        if (selectedPageType) {
            this.pageDetailsForm.patchValue({
                template: selectedPageType.pageTemplate?.templateTitle ?? "",
                schema: selectedPageType.pageSchema?.schemaTitle ?? "",
                pageType: selectedPageType.pageTitle ?? ""
            });
        }
    }

    fetchStructureGroups() {
        if (this.isDropdownOpen()) {
            this.isDropdownOpen.set(false);
            return;
        }
        const publicationId = this.selectedPageType()?.publicationId as string;
        this.isDropdownOpen.set(true);
        this.pageCreationService.getOrganizationalItems(publicationId);
    }

    closeDropdown() {
        setTimeout(() => {
            this.isDropdownOpen.set(false);
            this.pageDetailsForm.get('foldername')?.markAsTouched();
            this.pageDetailsForm.get('foldername')?.updateValueAndValidity();
        }, 200);
    }

    handleSelectedStrGroup(item: { Id: string; Title: string }) {
        this.selectedStrGroup.set({
            Id: item.Id,
            Title: item.Title
        });

        const control = this.pageDetailsForm.get('foldername');
        if (control) {
            control.setValue(item.Title);
            control.markAsDirty();
            control.markAsTouched();
            control.updateValueAndValidity();
        }

        this.isDropdownOpen.set(false);
    }

    onSubmit() {
        if (this.pageDetailsForm.valid) {
            //const formPageData = this.pageDetailsForm.value;
            //console.log("Form Page Data:", formPageData);
            this.validateAndProceed();
        }
    }
}