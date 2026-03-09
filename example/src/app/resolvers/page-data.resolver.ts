import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AppService } from '../app.service';

@Injectable({
    providedIn: 'root'
})
export class PageDataResolver implements Resolve<any> {

    private pageService = inject(AppService)

    resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
        const url = state.url
        return this.pageService.getPageData(url)
    }
}