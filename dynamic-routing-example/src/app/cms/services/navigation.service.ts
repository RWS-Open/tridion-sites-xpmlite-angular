import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SITEMAP_QUERY } from '../../../queries/sitemapQuery';
import { SITEMAP_VARIABLES } from '../../../queries/sitemapVariables';
import { NavItem } from '../models/navigation.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly api = inject(ApiClientService);

  readonly navigation = signal<NavItem[]>([]);
  readonly isLoading = signal<boolean>(false);

  private sanitizePath(url: string): string {
    if (!url) return '';
    return url.replace(/^\/+|\/+$/g, '');
  }

  private buildNavTree(items: any[] = [], isRootLevel: boolean = true): NavItem[] {
    const navItems: NavItem[] = [];

    for (const item of items) {

      if (isRootLevel && (item.Url === '/index' || item.Title?.trim().toLowerCase() === 'home')) {
        continue;
      }

      if (item.Type === 'Page') {
        navItems.push({
          id: item.Id,
          title: item.Title,
          routePath: this.sanitizePath(item.Url),
          rawUrl: item.Url,
          visible: item.Visible ?? true,
          children: [],
        });
        continue;
      }

      if (item.Type === 'StructureGroup') {
        const rawChildren: any[] = Array.isArray(item.Items) ? item.Items : [];

        const indexPage = rawChildren.find(
          (c: any) => c.Type === 'Page' && (c.Url?.endsWith('/index') || c.Url === '/index')
        );


        const dropdownChildrenRaw = rawChildren.filter((c: any) => {
          const isIndex = c.Type === 'Page' && (c.Url?.endsWith('/index') || c.Url === '/index');
          if (!isIndex) return true;

          const isGenericName = c.Title?.trim().toLowerCase() === 'index';
          return !isGenericName;
        });


        const dropdownChildren = this.buildNavTree(dropdownChildrenRaw, false);

        navItems.push({
          id: item.Id,
          title: item.Title,
          routePath: this.sanitizePath(indexPage ? indexPage.Url : item.Url),
          rawUrl: indexPage ? indexPage.Url : item.Url,
          visible: item.Visible ?? true,
          children: dropdownChildren,
        });
      }
    }

    return navItems;
  }

  async loadNavigation(): Promise<void> {
    this.isLoading.set(true);
    try {
      const siteMapQuery = {
        query: SITEMAP_QUERY,
        variables: SITEMAP_VARIABLES,
      };

      const response = await firstValueFrom(this.api.post<any>('/cd/api', siteMapQuery));

      const rawRoot = response?.data?.typedPage?.rawContent?.data;
      const rootItems: any[] = rawRoot?.Items ?? [];

      const navTree = this.buildNavTree(rootItems, true);
      this.navigation.set(navTree);
    } catch (err) {
      console.error('Failed to load CMS navigation:', err);
      this.navigation.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}