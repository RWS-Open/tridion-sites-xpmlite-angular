# 🧩 headless-xpm-angular

A lightweight Angular package that adds edit links to your components or pages, enabling quick access to [RWS](https://rws.com) [Tridion Sites Experience Space](https://www.rws.com/content-management/tridion/sites/) (XPM) — ideal for headless CMS setups.

## ✨ Features

- Adds a visual edit icon/toolbar over Angular components.

- View and modify page component presentations.

- Publish page to Publications.

- Opens Tridion Experience Space (XPM) directly to the associated item (Page or Component)

- Works in staging environments only (as required by XPM)

- Lightweight and non-intrusive

## 🛠 Requirements

- Tridion Sites 10.1+
- Angular (Latest Version)

## 📦 Installation

```sh
    npm install headless-xpm-angular
```

## 🔧 Basic Usage

1. Configure Access Management

   Before using the library, you must register your application in the Tridion Access Management:

   - Register Application: Navigate to the Applications tab and register a new application.

      - Copy the generated ClientId.
      
      - Enter a Display Name for the application. 
      
      - Select AuthorizationCodeWithPkce as the allowed authentication flow type.
      
      - Enter your allowed Redirect URLs.
      
      - Click Save.

   - Enable Identity Provider: Navigate to the Identity Providers tab.

      - Expand the available Identity Providers (e.g., Windows).

      - Click the Edit action button.

      - In the Applications section, check the box for your newly created application.

         - Click Save to apply the changes.


2. Configure Auth Settings

   - Import the interceptor and provider function into your application configuration.

   - Update app.config.ts with the values created in Step 1:

   ```ts

      import { authInterceptor, provideXpmAuth } from 'headless-xpm-angular';

      export const appConfig: ApplicationConfig = {
         providers: [
            provideXpmAuth({
               baseUrl:"https://<domain.com>/api/v3.0",
               clientId: "*********",
               issuer: "https://<domain.com>/access-management/connect",
               redirectUri: "https://<your-app.com>/callback",
            }),
            provideHttpClient(withInterceptors([authInterceptor])),
            provideRouter(routes)
         ]
      };
   ```

3. Configure the Provider

   Wrap your application structure (usually in app.component.ts or your main layout) with the provider.

```ts
import { HeadlessXpmProvider } from 'headless-xpm-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeadlessXpmProvider],
  templateUrl: `
            <headless-xpm-provider 
               [editorUrl]="'https://domain.com/ui/editor'"
               [staging]="true" 
               [showToolbar]="true" 
               [showPageEditorLink]="true"
            >
            <router-outlet></router-outlet>
         </headless-xpm-provider>
      `,
})
export class App {
   tcmId = 'tcm:1-123-64';
}
```

4. Configure the Editor

   - Use the editor component to wrap specific UI elements you want to make editable.

      ```ts
         import { HeadlessXpmEditor } from 'headless-xpm-angular';

         @Component({
         standalone: true,
         selector: 'app-banner',
         imports: [HeadlessXpmEditor],
         template: `
            <headless-xpm-editor [tcmId]="tcmId">
               <div class="banner-content">
               <h1>{{ title }}</h1>
               <p>{{ body }}</p>
               </div>
            </headless-xpm-editor>
         `,
         })
         export class BannerComponent {
         tcmId = "tcmid";
         title = "...";
         body  = "....";
         }
      ```

   - Enable inline editing

      Use the FieldNamePipe to retrieve the key name of the editable field.

      ```ts
         import { HeadlessXpmEditor, FieldNamePipe } from 'headless-xpm-angular';

         @Component({
            selector: 'app-banner',
            imports: [HeadlessXpmEditor, FieldNamePipe],
            templateUrl: `
               <headless-xpm-editor [tcmId]="tcmid">   
                  <h1 [attr.xpm-editable-field-name]="componentData | fieldNamePipe:componentData.headline">
                     {{ componentData.headline }}
                  </h1>
               </headless-xpm-editor>
            `,
         })

         export class BannerComponent {
            tcmid = signal("tcmid")
            componentData = signal<any>();
         }
      ```

      To update the list items, insert the index position of each item as shown below:

         <headless-xpm-editor [tcmId]="tcmid">   
         @for (item of componentData.itemListElement; track item.id; let idx=$index) {
            <h1 
               [attr.xpm-editable-field-name]="componentData | fieldNamePipe:componentData.headline"
               [attr.xpm-editable-field-position]="idx"
            >
               {{ componentData.headline }}
            </h1>
         }
         </headless-xpm-editor>

5) Configure the Highlight Area

   - Update the top-level div with the region name using the data-region attribute, as shown below:

      <div [attr.data-region]="regionName">

   - Update the top-level component div with the data-component attribute for component highlighting:

      <div [attr.data-component]="componentTitle">


## 🧩 API Reference

### `<headless-xpm-provider />`

| Prop                 | Type      | Description                             | Required?               |
| -------------------- | --------- | --------------------------------------- | ----------------------- |
| `editorUrl`          | `string`  | URL to the Experience Space editor      | ✅ Yes                  |
| `staging`            | `boolean` | Enable the toolbar only in staging      | ❌ No (default: `false`) |
| `showToolbar`        | `boolean` | Show/hide the main XPM toolbar.         | ❌ No (default: `false`) |
| `showPageEditorLink` | `boolean` | Show an extra link for the current page | ❌ No (default: `false`) |

---

### `<headless-xpm-editor />`

| Prop             | Type      | Description                                 | Required?                |
| ---------------- | --------- | ------------------------------------------- | ------------------------ |
| `tcmId`          | `string`  | TCM URI of the Page or Component            | ✅ Yes                   |
| `isPage`         | `boolean` | Is this a Page (true) or Component (false)? | ❌ No (default: `false`) |
| `linkStyle`      | `Object`  | Custom inline styles for the edit link      | ❌ No                    |
| `iconStyle`      | `Object`  | Custom inline styles for the edit icon      | ❌ No                    |
| `containerStyle` | `Object`  | Custom inline styles for the outer wrapper  | ❌ No                    |
| `contentStyle`   | `Object`  | CSS for the editable content area           | ❌ No                    |

## 👉 Example Angular Apps

Looking for a full implementation? Check out our reference apps:

- [Example Angular Headless App](https://github.com/RWS-Open/tridion-sites-xpmminimal-angular)

## 🛠 Best Practices

- The editor uses content projection (ng-content). Ensure your wrapped elements are relatively positioned if you intend to customize icon placement.

- Ensure your API provides valid TCM URIs (tcm:pubId-itemId).

- Environment Flags: Pass your environment configuration to the [staging] input to ensure the edit UI is stripped in production.
