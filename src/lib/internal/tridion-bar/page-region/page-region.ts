import { Component, input } from "@angular/core";
import { Region } from "../../state/headless-xpm-page.model";

@Component({
    selector:"app-page-region",
    templateUrl:"./page-region.html",
    styleUrl:"./page-region.css"
})


export class PageRegion{
    region = input<Region | null>(null)
}