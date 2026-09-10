# XPMLITE Example APP Setup

## Creating Page Types in Content Explorer

1. **Create the container Structure Group:**
  Inside the **Home** Structure Group, create a new Structure Group named **_Page Types**.

2. **Open the Structure Group:**
    - In the Classic Content Explorer, navigate to and open the newly created _Page Types Structure Group.

3. **Initiate page creation:**
    - Click **New Page** in the context menu.

4. **Define page properties:**

    - Enter the Name and File Name.
    - Select the appropriate **Page Template** and **Page Schema** to associate with the page.

5. **Enable Page Type:**
    - Check the box labeled **Use this Page as a Page Type**.

6. **Add default components:**
    - Switch to the **Design** tab to add any pre-configured components that should appear on pages created from this page type.

7. **Save:**
    - Click Save and Close
  
  ---

## Running exmaple app

1. **Clone the repository:**
      - Clone the example app from the repository

2. **Install dependencies:**
  
    ```bash
      npm install
    ```

3. **Install the Beta package**:

    - Install the [Beta Version](https://www.npmjs.com/package/headless-xpm-angular/v/1.0.3-beta.2) of the Package for Page Creation feature.

    ```bash
      npm i headless-xpm-angular@1.0.3-beta.2
    ```

4. **Update environment Variables:**

    - Update environment variables by updating the environment.ts file

5. **Launch the development server:**

    ```bash
      ng serve
    ```

---

## Creating Pages from Page Types

- **Initiate page creation:** Click the **Create New Page** icon in the xpmlite toolbar.

- **Select Page Type**: From the modal window showing pre-configured Page Types, select your desired type and click Next.

- **Specify page details**: Enter the **Page Name** and **Filename**, then click Show Page Info.

- **Review components**: Pre-configured components will clone automatically; review and confirm them.

- **Save**: Click Save to create the page.

- **Publish**: Select your target publication and publishing publications, then publish the page.
