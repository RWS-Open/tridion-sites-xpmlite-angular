import { Routes } from '@angular/router';
import { LayoutComponent } from './cms/layout/layout';
import { DynamicPageHostComponent } from './cms/dynamic-page-host/dynamic-page-host';

export const routes: Routes = [
    {
      path:"",
      component:LayoutComponent,
      children:[
        {
          path: '**',
          component: DynamicPageHostComponent
        }
      ]
    }
  ]
