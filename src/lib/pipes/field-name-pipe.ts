import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: "fieldNamePipe",
    standalone: true
})

export class FieldNamePipe implements PipeTransform {
    transform(props: any, value: any): string {
        if (!props || value === undefined) return '';
        const key = Object.keys(props).find(k => {
            const propValue = props[k];
            return typeof propValue === 'string' && typeof value === 'string' ? propValue.trim() === value.trim() : propValue === value
        });
        return key || '';
    }
}