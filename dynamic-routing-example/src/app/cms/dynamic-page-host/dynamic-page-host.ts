import { Component, inject, signal, effect, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { PAGE_TEMPLATE_REGISTRY } from '../services/page-template-registry';
import { PAGE_CONTENT_QUERY } from '../../../queries/pageContentQuery';
import { PageData } from '../models/tridion-page.model';
import { ApiClientService } from '../services/api-client.service';

@Component({
    selector: 'app-dynamic-page-host',
    standalone: true,
    imports: [NgComponentOutlet],
    templateUrl: './dynamic-page-host.html',
})
export class DynamicPageHostComponent {
    private readonly router = inject(Router);
    private readonly api = inject(ApiClientService);

    // Component states
    readonly resolvedTemplate = signal<Type<any> | null>(null);
    readonly pageData = signal<any | null>(null);
    readonly requestedTemplate = signal<string>('');
    readonly isTemplateMissing = signal<boolean>(false);
    readonly isNotFound = signal<boolean>(false);

    private readonly navEnd = toSignal(
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
    );
    
  
    constructor() {
        effect(() => {
            this.navEnd();
            const cleanPath = this.router.url.split('?')[0] || '/';
            this.loadPage(cleanPath);
        });
    }

    private formatCmsUrl(path: string): string {
        let clean = path.trim();
        if (!clean || clean === '/' || clean === '/index') {
            return '/index.html';
        }

        if (clean.endsWith('/')) {
            return `${clean}index.html`;
        }

        if (clean.endsWith('.html')) {
            return clean.startsWith('/') ? clean : `/${clean}`;
        }

        clean = clean.replace(/\.(htm?|aspx|json)$/i, '');
        return clean.startsWith('/') ? `${clean}.html` : `/${clean}.html`;
    }

    private async loadPage(path: string) {
        this.reset();

        const targetUrl = this.formatCmsUrl(path);

        try {
            const response = await firstValueFrom(this.api.post<PageData>('/cd/api', {
                query: PAGE_CONTENT_QUERY,
                variables: {
                    namespaceId: 1,
                    publicationId: 7,
                    url: targetUrl,
                },
            }));

            const rawData = response?.data?.typedPage;
            const pageTemplate = rawData?.rawContent?.data?.PageTemplate?.Title;

            if (!rawData || !pageTemplate) {
                this.isNotFound.set(true);
                return;
            }

            this.requestedTemplate.set(pageTemplate);
            const loader = PAGE_TEMPLATE_REGISTRY[pageTemplate];

            if (loader) {
                const componentClass = await loader();
                this.pageData.set(rawData);
                this.resolvedTemplate.set(componentClass);
            } else {
                this.isTemplateMissing.set(true);
            }
        } catch (error) {
            console.error('Failed to load page data from CMS:', error);
            this.isNotFound.set(true);
        }
    }

    private reset() {
        this.resolvedTemplate.set(null);
        this.pageData.set(null);
        this.requestedTemplate.set('');
        this.isTemplateMissing.set(false);
        this.isNotFound.set(false);
    }
}