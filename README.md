# EnderAspect Cryptocurrency Donation Website

This is a simple, professional, single-page cryptocurrency donation website for EnderAspect, a YouTube Minecraft content creator. It's built with pure HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

This version provides a straightforward way for supporters to donate by displaying a wallet address and a QR code, removing the need for complex browser wallet integration.

## Features

- **Frontend Only**: No backend server required.
- **Simple Donations**: Displays a static wallet address and QR code for easy donations.
- **ERC-20 Support**: The address can accept ETH and any ERC-20 token on compatible chains (e.g., Ethereum, Polygon, Arbitrum).
- **Copy to Clipboard**: A button allows users to easily copy the wallet address.
- **Responsive Design**: Mobile-first and works on all screen sizes.
- **Easy Deployment**: Designed to be hosted on GitHub Pages.

## File Structure

```
donation-site/
├── index.html          (Main page with all content)
├── styles.css          (All styling)
├── script.js           (QR code generation and copy functionality)
├── images/
│   ├── profile.jpg     (Creator profile image placeholder)
└── README.md           (Setup instructions)
```

## Setup and Deployment on GitHub Pages

1.  **Create a GitHub Repository**:
    - Create a new public repository on GitHub named `enderaspect-donations` or similar.

2.  **Upload Files**:
    - Upload `index.html`, `styles.css`, `script.js`, and the `images` folder to the main branch of your repository.

3.  **Enable GitHub Pages**:
    - Go to your repository's **Settings** tab.
    - In the left sidebar, click on **Pages**.
    - Under "Build and deployment", select **Deploy from a branch** as the source.
    - Choose the `main` branch (or `master`) and the `/ (root)` folder.
    - Click **Save**. GitHub will build and deploy your site.

4.  **Access Your Site**:
    - After a few minutes, your site will be live at `https://<your-username>.github.io/enderaspect-donations/`.

## How It Works

The website displays EnderAspect's public cryptocurrency wallet address. Supporters can send donations by:
1.  **Scanning the QR Code** with their mobile wallet app.
2.  **Copying the Wallet Address** and pasting it into their wallet's "send" field.

This method is simple, secure, and supports a wide variety of tokens without requiring users to connect their wallet to the site.

## Customization

- **Creator Wallet Address**: To change the recipient wallet address, edit the `walletAddress` constant at the top of `script.js`. This will automatically update the displayed address and the QR code.
- **Styling**: All colors, fonts, and layout properties can be changed in `styles.css`.
- **Images**: Replace `images/profile.jpg` with your own profile picture.