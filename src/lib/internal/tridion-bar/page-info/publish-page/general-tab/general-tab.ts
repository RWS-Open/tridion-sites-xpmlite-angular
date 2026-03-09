import { Component, computed, inject, signal } from "@angular/core";

import { PublishService } from "../../../../state/headless-xpm-publish.service";
import { DEPLOYMENT_CONFIG, PUBLISH_CONFIG, PublishOption } from "../../../../../constants/publish-options.constants";

@Component({
    selector: "app-general-tab",
    imports: [],
    templateUrl: "./general-tab.html",
    styleUrl: "./general-tab.css"
})

export class GeneralTab {
    private publishService = inject(PublishService)

     private readonly _publishingOptions = signal<PublishOption[]>(PUBLISH_CONFIG)
    private readonly _deploymentOptions = signal<PublishOption[]>(DEPLOYMENT_CONFIG)
    
    readonly publishingOptions = this._publishingOptions.asReadonly();
    readonly deploymentOptions = this._deploymentOptions.asReadonly();

    childPublications = computed(() => this.publishService.childPublications())
    targetTypes = computed(() => this.publishService.publishableTargetTypes())
    parentPublication = computed(() => this.publishService.parentPublication())
    scheduleDeployment = computed(() => this.publishService.selectedDeploymentOption())
    selectedChildPublications = computed(() => this.publishService.selectedChildPublication())
    selectedParentPubliation = computed(() => this.publishService.selectedParentPublication())
    selectedTargetTypes = computed(() => this.publishService.selectedTargetType())
    selectedPublishingOption = computed(() => this.publishService.selectedPublishingOptions())
    selectedDeploymentOption=computed(() => this.publishService.selectedDeploymentOption())
    selectedDeploymentDatetime = computed(() => this.publishService.selectedDeploymentDatetime())
    selectedTargetType = computed(() => this.publishService.selectedTargetType())
    isTargetTypesLoading = computed(() => this.publishService.isTargetTypesLoading())
    isChildPublicationsLoading = computed(() => this.publishService.isChilPublicationLoading())
    onTargetTypeSelect(event: Event, targetId: string) {
        const isChecked = (event.target as HTMLInputElement).checked
        this.publishService.setSelectedTargetTypes(targetId, isChecked)
    }

    toggleTargetTypeSelect(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked
        this.publishService.toggleAllTargetTypes(isChecked)
    }

    onChildPublicationSelect(event: Event, publicationId: string) {
        const isChecked = (event.target as HTMLInputElement).checked
        this.publishService.setSelectedPublications(publicationId, isChecked)
    }
    onParentPublicationSelect(event:Event, publicationId: string) {
        const isChecked = (event.target as HTMLInputElement).checked
        if(isChecked){
            this.publishService.setSelectedParentPublication(publicationId)
        }else{
            this.publishService.setSelectedParentPublication(null)
        }
    }

    toggleAllPublicationSelect(event: Event) {
        const checked = (event.target as HTMLInputElement).checked
        this.publishService.onIncludeChildPublications(checked)
    }

    onDeploymentOptionSelect(deployment: boolean) {
        if(deployment){
             this.publishService.setDeploymentDatetime(null)
             this.publishService.setDeploymentOptions(deployment)
        }else{
            this.publishService.setDeploymentOptions(deployment)
        }
    }

    onPublishingOptionsSelect(publishing: boolean) {
        this.publishService.setPublishingOptions(publishing)
    }

    isSelected(id: string): boolean {
        return this.selectedChildPublications().includes(id);
    }

    onDeploymentDateChange(event:Event){
        const dateTime = (event.target as HTMLInputElement).value
         this.publishService.setDeploymentDatetime(dateTime)
    }
}