// page-template-registry.ts
import { Type } from '@angular/core';
/* import { ContentPageTemplate } from '../templates/content-page/content-page-template';
import { HomePageTemplate } from '../templates/home-page/home-page-template';
import { DetailsPageTemplate } from '../templates/details-page/details-page-template';
import { CampaignPageTemplate } from '../templates/campaign-page/campaign-page-template';
import { ProductsPageTemplate } from '../templates/products-page/products-page-template'; */

export interface CmsPageResponse {
    url: string;
    template: string;
    title: string;
    data: Record<string, any>;
}

/* export const PAGE_TEMPLATE_REGISTRY: Record<string, Type<any>> = {
    'Onedemo Details Page Static Widget': DetailsPageTemplate,
    'Onedemo Home Page': HomePageTemplate,
    'Content Page': ContentPageTemplate,
    'Onedemo Campaign Page': CampaignPageTemplate,
    'Onedemo Products Page': ProductsPageTemplate
}; */

export const PAGE_TEMPLATE_REGISTRY: Record<string, () => Promise<Type<any>>> = {
    'Onedemo Home Page': () => import('../templates/home-page/home-page-template').then(m => m.HomePageTemplate),
    'Onedemo XO Home Page': () => import('../templates/home-page/home-page-template').then(m => m.HomePageTemplate),
    'Onedemo Products Page': () => import('../templates/products-page/products-page-template').then(m => m.ProductsPageTemplate),
    'Content Page': () => import('../templates/content-page/content-page-template').then(m => m.ContentPageTemplate),
    'Onedemo Details Page Static Widget': () => import('../templates/details-page/details-page-template').then(m => m.DetailsPageTemplate),
    'Onedemo Campaign Page': () => import('../templates/campaign-page/campaign-page-template').then(m => m.CampaignPageTemplate)
};