import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterOutlet } from "@angular/router";

import { Header } from "../../header/header";
import { Chatbot } from "../../chatbot/chatbot";
import { HeadlessXpmProvider } from "headless-xpm-angular";
import { environment } from "../../../environments/environment";
import { Footer } from "../../footer/footer";

@Component({
    selector: "app-layout",
    imports: [RouterOutlet, Header, Chatbot, HeadlessXpmProvider, Footer],
    templateUrl: "./layout.html",
    styleUrl: "./layout.css"
})

export class Layout {
    editorUrl = signal<string>("")
    staging = signal<boolean>(false)
    showToolbar = signal<boolean>(false)
    showPageEditorLink = signal<boolean>(false)

    private readonly route = inject(ActivatedRoute)

    ngOnInit(): void {
        this.editorUrl.set(environment.experience_space_editor)
        this.staging.set(environment.staging)
        this.showToolbar.set(environment.showToolbar)
        this.showPageEditorLink.set(environment.showPageEditorLink)
        
    }
}