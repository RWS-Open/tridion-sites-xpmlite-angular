import { Component, computed, effect, inject, input, Input, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeadlessXpmProvider } from 'headless-xpm-angular';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./layout.html",
  styleUrl: "./layout.css"
})
export class LayoutComponent {
  private readonly navigationService = inject(NavigationService);
  readonly navItems = computed(() => this.navigationService.navigation())
}