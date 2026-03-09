import { Component, input, Type } from "@angular/core";

@Component({
    selector: "app-publish-tab",
    imports: [],
    //templateUrl: "./publish-tab.html",
    template:""
})

export class PublishTab {
    title = input.required<string>();
    component = input.required<Type<any>>();
}