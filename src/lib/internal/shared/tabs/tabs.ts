import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { TabHeader } from "./tab-header/tab-header";
import { Tab } from "./tab/tab";
@Component({
    selector: "app-tabs",
    templateUrl: "./tabs.html",
    styleUrl: "./tabs.css",
    imports: [TabHeader],
})

export class Tabs implements AfterContentInit {
    @ContentChildren(Tab)
    tabs!: QueryList<Tab>

    @Input() activeIndex = 0;
    @Output() activeIndexChange = new EventEmitter<number>();

    ngAfterContentInit(): void {
        if (this.activeIndex >= this.tabs.length) {
            this.activeIndex = 0;
        }
    }
    selectTab(index: number) {
    const tab = this.tabs.toArray()[index];
    if (tab.disabled) return;

    this.activeIndex = index;
    this.activeIndexChange.emit(index);
  }
}