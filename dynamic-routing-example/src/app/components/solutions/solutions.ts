import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FieldNamePipe, HeadlessXpmEditor } from 'headless-xpm-angular';

@Component({
    selector: 'app-solutions',
    imports:[RouterLink, HeadlessXpmEditor, FieldNamePipe],
    templateUrl: './solutions.html',
    styleUrl:"./solutions.css"
})

export class Solutions {
    components = input<any[]>([])
}