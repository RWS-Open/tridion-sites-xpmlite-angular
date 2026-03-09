import { Component } from '@angular/core';
import { Logo } from "./logo/logo";
import { Navigation } from "./navigation/navigation";
import { TopNavigation } from "./top-navigation/top-navigation";
import { LanguageDropdown } from "./language-dropdown/language-dropdown";

@Component({
  selector: 'app-header',
  imports: [Logo, Navigation, TopNavigation, LanguageDropdown],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
