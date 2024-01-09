# Marmeto Basetheme v2.0

This repository contains a starting point for Shopify Online Store 2.0 Theme
development using Tailwind CSS and the default Dawn theme.

## Workflow

A short description of this workflow:

- Edit theme locally using the Shopify CLI, Tailwind
- Commit changes to feature branch
- Merge feature branch with main branch once feature is implemented

### Technologies used

- Tailwind CSS
  - The main css file is located in `_styles/skeleton-base.css`
  - This file will be built to `assets/custom.css`
- Shopify CLI


## Getting started
- Create a new repository. 
- Choose the "Repository template" as "Skeleton-2.0"
- Set up the fontFamily, fontSize & colors in tailwind.config.js
- Set up all the base styles such as the typography, buttons, form inputs at "_styles" folder. 
- Start creating sections. If you want to make use of a section, make sure to leave the original section untouched and always create a new section. 

### Prerequisites

- [Shopify CLI](https://shopify.dev/themes/getting-started/create#step-1-install-shopify-cli)
- [Node.js](https://nodejs.org/)

### Development

You will need 3 terminal windows:

1. Install dependencies
    ```bash
     npm install
    ```

2. Serve your Shopify theme

    you will need 2 terminal windows running

   - Watch for tailwind changes
     ```bash
     npm run tw
     ```    

   - First, log in to your store if you was not logged in already.
     ```bash
     shopify login --store your-store-name.myshopify.com
     ```
   - Serve your theme to your development store
     ```bash
     npm run shopify
     ```

2. Build your code: in a separate terminal window, run `npm start` to start
   watch for file changes and build development bundles.

to track a branch in your Github repository.

## Final notes

### Further reading 

- [shopify.dev](https://shopify.dev)
- [Tools for building Shopify themes](https://shopify.dev/themes/tools)
- [Version control for Shopify themes best practices](https://shopify.dev/themes/best-practices/version-control)

### Suggestions

If you have any suggestions to improve this repository, please open an issue. I
would be happy to hear from you.
