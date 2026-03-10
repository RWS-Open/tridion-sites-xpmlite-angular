# 🧩 headless-xpm-angular

A lightweight Angular package that adds edit links to your components or pages, enabling quick access to [RWS](https://rws.com) [Tridion Sites Experience Space](https://www.rws.com/content-management/tridion/sites/) (XPM) — ideal for headless CMS setups.


## 🛠 Requirements

- Tridion Sites 10.1+ 

## 📦 Installation

- Clone the repository and navigate to example folder, then install dependencies:

```sh
    npm install
```

## 🔧 Configuration

- Update the environment.ts and/or environment.prod.ts files with your Tridion Sites environment details.

	```ts
	  production: false,
	  clientId:"",
	  issuer:"https://domain.com/access-management/connect",
	  openApiUrl:'https://domain.com/api/v3.0',
	  redirectUri:window.location.origin,

	  graphqlBaseUrl: 'https://domain.com:8081/cd/api',	// Content Delivery API endpoint
	  experience_space_editor: "https://domain.com/ui/editor",	// Experience Space Editor URL
	  staging: true,
	  showToolbar: true,
	  showPageEditorLink: true
	```
	
- Allow Cors
	
	navigate to openapi folder and update the web.config to allow cors
	
		```xml
		<corsConfigs>
			<corsAllowlist>
			  <!-- To enable CORS you can add multiple lines like the one below and put your custom web-site domain and port. -->
			  <!-- <add origin="https://domain:port" /> -->
			  <add origin="https://dxa.tridiondemo.com"/>
			  <add origin="https://preview.tridiondemo.com"/>
			  <add origin="http://localhost:4200"/>
			</corsAllowlist>
		  </corsConfigs>
		```
	
🔑 Configuration Notes


- apiUrl: Points to your Content Delivery (GraphQL/Content Service) endpoint used for fetching component/presentation data.

- experience_space_editor: Points to Experience Space and enables the "Edit in XPM" links inside the UI.
	
	
## ▶️ Running the Application Locally

- Start the Angular dev server:

- ng serve


## 🧪 Testing XPM Integration

- Start the Angular app.
- Ensure your Experience Space is accessible.
- Click the "Edit Components" button in the bottom bar.
- Hove over the components. You should see "Edit" links/buttons injected by the headless XPM helper.
- Click the "Edit Experience Space" button to edit the component in Tridion Sites experience space.