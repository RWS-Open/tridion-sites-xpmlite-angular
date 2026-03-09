import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { PageData } from "../types";
import { PAGE_QUERY } from "../graphql/PageQuery";
import { PAGE_VARIABLES } from "../graphql/PageVariables";

import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private apiUrl = environment.graphqlBaseUrl;
    pageData = signal<PageData | null>(null)

    constructor(private http: HttpClient) { }

    getPageData(url: string) {
        const pageVariables = { ...PAGE_VARIABLES }
        if (url === "/") {
            pageVariables.url = url + "index.html"
        } else {
            pageVariables.url = url + "/index.html"
        }
        const query = {
            query: PAGE_QUERY,
            variables: pageVariables
        }
        this.http.post<PageData>(this.apiUrl, query).subscribe(res => {
            this.pageData.set(res)
        })
    }
}