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
	
	- apiUrl: https://domain.com/cd/api	// Content Delivery API endpoint
	- experience_space_editor : https://domain/ui/editor	// Experience Space Editor URL
	
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