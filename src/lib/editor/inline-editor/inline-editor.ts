import { Component, inject, signal } from "@angular/core";
import { concatMap, Observable } from "rxjs";

import { InlineEditorService } from "../../internal/state/headless-xpm-inline-editor.service";
import { StringUtils } from "../../internal/utils/StringUtils";
import { CheckoutData } from "./inline-editor.model";

@Component({
  selector: "app-inline-editor",
  templateUrl: "./inline-editor.html",
  styleUrl: "./inline-editor.css"
})

export class InlineEditor {

  private readonly inlineEditorService = inject(InlineEditorService);

  private readonly componentData = this.inlineEditorService.componentData

  inputValue = signal<string>("")
  tcmId = signal<string>("");
  fieldName = signal<string>("");
  fieldPosition = signal<string>("0")
  saveChanges!: (val: string) => void;
  cancelChanges!: () => void;

  onInput(event: Event) {
    const el = event.target as HTMLInputElement
    if(el.name!=='null'){
      this.inputValue.set(el.value)
      this.fieldName.set(el?.name as string)
      this.fieldPosition.set(el.getAttribute('xpm-editable-field-position') as string)
    } else{
      
      this.inputValue.set(el.value)
      this.fieldName.set(el?.closest('[xpm-editable-field-name]')?.getAttribute("xpm-editable-field-name") as string)
      this.fieldPosition.set(el?.closest('[xpm-editable-field-name]')?.getAttribute("xpm-editable-field-name") as string)
    }
  }
  save() {
    this.saveChanges(this.inputValue());
    this.updateComponent()
  }

  cancel() {
    this.cancelChanges();
  }

  updateComponent() {
    const primaryBlueprintItem = StringUtils.sanitizeIdentifier(this.componentData()?.BluePrintInfo.PrimaryBluePrintParentItem.IdRef as string);

    this.inlineEditorService.checkoutItem<CheckoutData>(primaryBlueprintItem as string).pipe(
      concatMap((checkoutResponse: CheckoutData): Observable<CheckoutData> => {
        const field = this.fieldName();
        const fieldPosition = this.fieldPosition()
        const updateValue = this.inputValue();
        const checkoutId = StringUtils.sanitizeIdentifier(checkoutResponse.Id)
        const content = checkoutResponse.Content as any;
        this.updateNestedData(content, field, updateValue, fieldPosition);
        return this.inlineEditorService.saveItem(checkoutId, checkoutResponse).pipe(
          concatMap((updateResponse) => {
            const updatedId = StringUtils.sanitizeIdentifier(updateResponse.Id);
            const componentCheckInBody = {
              "RemovePermanentLock": true
            }
            return this.inlineEditorService.checkinItem<any>(updatedId, componentCheckInBody)
          })
        )
      })
    ).subscribe()

  }

  updateNestedData(obj: any, targetKey: string, updateValue: string, fieldPosition: string | number): boolean {

    if (!obj || typeof obj !== 'object') return false;

    const targetIndex = Number(fieldPosition);

    if (!Array.isArray(obj) && targetKey in obj) {
      obj[targetKey] = updateValue;
      return true;
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (Array.isArray(value)) {

        if (
          value[targetIndex] &&
          typeof value[targetIndex] === 'object' &&
          targetKey in value[targetIndex]
        ) {
          value[targetIndex][targetKey] = updateValue;
          return true;
        }

        for (const item of value) {
          if (this.updateNestedData(item, targetKey, updateValue, fieldPosition)) {
            return true;
          }
        }
      }
      else if (typeof value === 'object' && value !== null) {
        if (this.updateNestedData(value, targetKey, updateValue, fieldPosition)) {
          return true;
        }
      }
    }
    return false;
  }
}