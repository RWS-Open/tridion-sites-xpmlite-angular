import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './cms/services/navigation.service';
import { HeadlessXpmProvider } from 'headless-xpm-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadlessXpmProvider],
  templateUrl: "./app.html"

})
export class App {
  private readonly navigationService = inject(NavigationService);

  readonly navLinks = this.navigationService.navigation;

}