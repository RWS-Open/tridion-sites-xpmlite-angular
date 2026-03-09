import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { PageDataResolver } from './resolvers/page-data.resolver';
export const routes: Routes = [
    {
        path: "",
        component: Layout,
        resolve: {
            pageData:PageDataResolver
        },
        runGuardsAndResolvers:"always",
        children: [
            {
                path: "",
                component: Home,
                pathMatch: "full",

            },
            {
                path: "products",
                component: Products,
                pathMatch: "full"
            }
        ]
    }
];




