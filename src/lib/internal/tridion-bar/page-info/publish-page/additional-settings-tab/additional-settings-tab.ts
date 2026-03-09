import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { PublishService } from "../../../../state/headless-xpm-publish.service";
import { AdditionalOptions, DEPENDENT_ITEMS, ITEMS_IN_PROGRESS, PUBLISHING_PRIORITY } from "../../../../../constants/additional-settings.constants";

@Component({
    selector: "app-additional-settings-tab",
    imports: [FormsModule],
    standalone: true,
    templateUrl: "./additional-settings-tab.html",
    styleUrl: "./additional-settings-tab.css"
})

export class AdditionalSettingsTab {

    private publishService = inject(PublishService)

    private readonly _dependentItems = signal<AdditionalOptions[]>(DEPENDENT_ITEMS)
    private readonly _itemsInProgress = signal<AdditionalOptions[]>(ITEMS_IN_PROGRESS)
    private readonly _publishingPriority = signal<AdditionalOptions[]>(PUBLISHING_PRIORITY)
    private readonly _priorities = signal<string[]>(["Low", "Normal", "High"])
    readonly dependentItems = this._dependentItems.asReadonly()
    readonly itemsInProgress = this._itemsInProgress.asReadonly()
    readonly publishingPriority = this._publishingPriority.asReadonly()
    readonly priorities = this._priorities.asReadonly()
    
    isOpen = signal<boolean>(false);
    
    isPublishPrioritySet = computed(() => this.publishService.selectedOverridePublishPriority())
    selectedPublishPriority = computed(() => this.publishService.selectedPublishingPriority())
    selectedDependentItems = computed(() => this.publishService.selectedDependentItems())
    selectedItemsInProgress = computed(() => this.publishService.selectedItemsInProgress())
    selectedOverridePublishPriority = computed(() => this.publishService.selectedOverridePublishPriority())

    onDependentItemsSelect(value: boolean) {
        this.publishService.setAdditionalDependentItem(value)
    }

    onItemsInProgressSelect(value: boolean) {
        this.publishService.setAdditionalItemsInProgress(value)
    }

    onPublishingPrioritySelect(selectedValue: string) {
        this.publishService.setAdditionalPriorityChange(selectedValue)
        this.isOpen.set(false);
    }

    onPrioritySelect(value: boolean) {

        this.publishService.setAdditionalPublishingPriority(value)
        this.isOpen.set(false);
    }
    toggleDropdown() {
        this.isOpen.update(value => !value);
    }
}