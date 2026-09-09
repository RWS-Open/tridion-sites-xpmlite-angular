import { Injectable, signal } from "@angular/core";
import { Tab } from "../shared/tabs/tab/tab";

@Injectable()

export class XpmTabsService {
    tabs = signal<Tab[]>([])
    activeIndex = signal(0)

    setTabs(tabs: Tab[]) {
        this.tabs.set(tabs)
    }

    setActive(index:number){
        this.activeIndex.set(index)
    }
}