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
	
### 🔑 Configuration Notes

- clientId : Can be created by registering the new application in Access Management
- Issuer: Authorization URL
- openApiUrl : Open API URL
- redirectUri : Redirect URI
- graphqlBaseUrl: Points to your Content Delivery (GraphQL/Content Service) endpoint used for fetching component/presentation data.
- experience_space_editor: Points to Experience Space and enables the "Edit in XPM" links inside the UI.
		
### Configure CORS
	
Navigate to %Tridion_Home%\Openapi folder and update web.config to allow CORS

```xml
	<corsConfigs>
		<corsAllowlist>
			<!-- To enable CORS you can add multiple lines like the one below and put your custom web-site domain and port. -->
			<!-- <add origin="https://domain:port" /> -->
			<add origin="http://localhost:4200"/>
		</corsAllowlist>
	</corsConfigs>
```

## ▶️ Running the Application Locally

- Start the Angular dev server:

- ng serve


## 🧪 Testing XPM Integration

Follow the steps below to edit and insert components using the Experience Space.

- Start the Angular app.
- Ensure your Experience Space is accessible.
- Login to access the Content manager api's

### Steps to Create Page Types for Page Creation

- Create the container Structure Group:

	- Inside the **Home** Structure Group, create a new Structure Group named **_Page Types**.

- Open the Structure Group:

	- In the Classic Content Explorer, navigate to and open the newly created _Page Types Structure Group.

- Initiate page creation:

	- Click **New Page** in the ribbon or context menu.

- Define page properties:

	- Enter the Name and File Name.
	- Select the appropriate Page Template and Page Schema to associate with the page.
	
- Enable Page Type:

	- Check the box labeled Use this Page as a Page Type.

- Add default components:

	- Switch to the **Design** tab to add any pre-configured components that should appear on pages created from this page type.
		
- Save:

	- Click Save and Close.
		
### Editing Components

- Double-click the text that is configured for inline editing.
- Input fields will appear, allowing you to modify the content.
- Make the required changes.
- Click Save to apply the changes.

### Inserting Components into a Page

- Click the Page Info button.
- Select the region where you want to add a new component.
- Click the Item Selector (plus icon).
- Navigate through the folder tree.
- Select the desired component.
- Choose the appropriate Component Template.
- Click Insert.
- Click Save to persist the changes.

### Publishing the Page

- Click on the publish Icon to publish the current page
- Select Publication Target Type and Publications.
- Click Publish
- Wait for Publisher to Publish the page

### Creating a Page Using Page Types

- **Initiate page creation:** Click the **Create New Page** icon.
- **Choose a Page Types:** From the modal window showing pre-configured Page Types, select your desired type and click Next.
- **Set page details:** Enter the **Page Name** and **Filename**, then click **Show Page Info.**
- **Confirm components:** The existing components will automatically cloned;
- **Save the page**: Click Save.
- **Publish:** Select your target publication and publishing destination, then publish the page.