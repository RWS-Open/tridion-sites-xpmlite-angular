import { AfterContentInit, Component, ContentChildren, QueryList, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PublishTab } from "./publish-tab/publish-tab";

@Component({
    selector: "app-publish-tabs",
    imports: [CommonModule],
    templateUrl: "./publish-tabs.html",
    styleUrl: "./publish-tabs.css"
})

export class PublishTabs implements AfterContentInit {
    @ContentChildren(PublishTab)
    tabs!: QueryList<PublishTab>;

    activeTab = signal<PublishTab | null>(null);

    ngAfterContentInit(): void {
        if (this.tabs.length) {
            this.activeTab.set(this.tabs.first)
        }
    }

    selectTab(tab: PublishTab) {
        this.activeTab.set(tab)
    }
}