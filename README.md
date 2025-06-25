# EnderAspect Cryptocurrency Donation Website

This is a professional, single-page cryptocurrency donation website for EnderAspect, a YouTube Minecraft content creator. It's built with pure HTML, CSS, and JavaScript for deployment on GitHub Pages and features full Web3 wallet integration.

## Features

- **Frontend Only**: No backend server required.
- **Web3 Integration**: Connects with MetaMask for donations.
- **Multi-Chain Support**: Works with Ethereum, Polygon, and Arbitrum One.
- **Multi-Token Support**: Accepts ETH, stablecoins (USDC, USDT, DAI), and popular altcoins (WBTC, LINK, UNI).
- **Real-Time Pricing**: Fetches live crypto prices from the CoinGecko API.
- **Responsive Design**: Mobile-first and works on all screen sizes.
- **Supporter Tiers**: Tracks donation amounts to assign supporter tiers using Local Storage.
- **Easy Deployment**: Designed to be hosted on GitHub Pages.

## File Structure

```
donation-site/
├── index.html          (Main page with all content)
├── styles.css          (All styling)
├── script.js           (Web3 integration & functionality)
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

### Wallet Connection
- Users click the "Connect Wallet" button to connect their MetaMask wallet.
- The site detects the connected network and prompts the user to switch if they are on an unsupported network.
- The user's truncated wallet address and network are displayed once connected.

### Donation Process
1.  The user selects a preset donation amount or enters a custom USD amount.
2.  They choose which cryptocurrency to donate with.
3.  For volatile assets like ETH, the app fetches the current price from CoinGecko to calculate the equivalent crypto amount. For stablecoins, it's a 1:1 conversion.
4.  The user's balance for the selected token is displayed.
5.  The user clicks "Donate" and confirms the transaction in MetaMask.
6.  A success or failure message is shown with a link to the transaction on a block explorer.

### Tier Tracking
- The website uses the browser's **Local Storage** to keep track of the total amount a user has donated from that browser.
- This allows the site to display the user's current supporter tier.
- **Note**: This is for display purposes only. Verification for Discord roles and other benefits is a manual process.

### Claiming Benefits
- To claim tier benefits, supporters must join the official Discord server and provide their transaction hash in a designated channel for manual verification by the creator or a moderator.

## Customization

- **Creator Wallet Address**: To change the recipient wallet address, edit the `creatorWallet` constant in `script.js`.
- **Supported Tokens & Networks**: The `CONFIG` object at the top of `script.js` can be modified to add or remove tokens and networks. You will need to provide the correct contract addresses for each token on each supported chain.
- **Styling**: All colors, fonts, and layout properties can be changed in `styles.css`.