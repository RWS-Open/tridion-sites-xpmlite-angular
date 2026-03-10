import { Observable } from "rxjs";
import { inject, Injectable, signal } from "@angular/core";

import { XpmApiService } from "./headless-xpm-api.service";
import { ComponentData } from "./headless-xpm-inline-editor.model";


@Injectable({
    providedIn: "root"
})

export class InlineEditorService {

    private apiService = inject(XpmApiService)

    private readonly _componentData = signal<ComponentData[]>([]);
    private readonly _componentCheckoutData = signal<any | null>(null);
    private readonly _isEditorActive = signal(false);

    readonly componentData = this._componentData.asReadonly();
    readonly componentCheckoutData = this._componentCheckoutData.asReadonly();
    readonly isEditorActive = this._isEditorActive.asReadonly()

    updateEditorStatus(editorStatus:boolean){
        this._isEditorActive.set(editorStatus)
    }

    getItem(componentId: string) {
        const url = `/items/${componentId}?useDynamicVersion=true`;
        this.apiService.getItems<ComponentData>(url).subscribe(res => {
            this._componentData.update((currentItems) => {
                const index = currentItems.findIndex(item => item.Id===res.Id)
                if(index!==-1){
                    const updatedItems = [...currentItems];
                    updatedItems[index] = res;
                    return updatedItems;
                }{
                    return [...currentItems, res]
                }
            })
        })
    }

    checkoutItem<T>(componentId: string):Observable<T> {
        const url = `/items/${componentId}/checkOut`;
        const checkoutBody = {};
        return this.apiService.checkOutItem<T>(url, checkoutBody)
    }

    saveItem<T>(componentId:string, body:T){
        const url=`/items/${componentId}`;
        return this.apiService.updateItem(url, body)
    }

    checkinItem<T>(componentId:string, body:T){
        const url = `/items/${componentId}/checkIn`;
        return this.apiService.checkin(url, body)
    }
}