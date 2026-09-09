import { Component, inject } from "@angular/core";
import { HeadlessXpmModal } from "../../shared/modal/modal";
import { Step } from "../../shared/steps/step/step";
import { Steps } from "../../shared/steps/steps";
import { HeadlessXpmPageCreationService } from "../../state/headless-xpm-page-creation.service";
import { PageDetails } from "./page-details/page-details";
import { PageTypes } from "./page-types/page-types";
import { PublishNewPage } from "./publish-page/publish-new-page";
import { SavePage } from "./save-page/save-page";


@Component({
    selector:"app-page-creation",
    imports: [HeadlessXpmModal, Steps, Step, PageTypes, PageDetails, SavePage, PublishNewPage],
    templateUrl:"./page-creation.html",
    styleUrl:"./page-creation.css"
})

export class PageCreation{
    private pageCreationService = inject(HeadlessXpmPageCreationService)

    readonly showModal = this.pageCreationService.showPageCreationModal

    modalTitle= "Create New Page"
    okButtonText= "Save"
    cancelButtonText= "Cancel"

    saveItem() {
        // Implementation for saving the item
    }

    toggleModal() {
        this.pageCreationService.togglePageCreationModal()
    }
}