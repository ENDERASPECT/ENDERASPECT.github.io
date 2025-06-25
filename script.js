document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
        creatorWallet: '0x05b2414bC97a0e879279E53Ca332526ECdB3785D',
        supportedNetworks: {
            1: { name: 'Ethereum', explorer: 'https://etherscan.io/tx/' },
            137: { name: 'Polygon', explorer: 'https://polygonscan.com/tx/' },
            42161: { name: 'Arbitrum One', explorer: 'https://arbiscan.io/tx/' }
        },
        priceApiUrl: 'https://api.coingecko.com/api/v3/simple/price',
        tokens: {
            // Stablecoins (preferred - 1:1 USD)
            'USDC': {
                1: '0xA0b86991c631C24e77Fc9ef5E1E5E5EdE9eF5C3B',
                137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
                coingeckoId: 'usd-coin'
            },
            'USDT': {
                1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                coingeckoId: 'tether'
            },
            'DAI': {
                1: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                137: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
                42161: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
                coingeckoId: 'dai'
            },
            // Altcoins (alternative options - volatile pricing)
            'WBTC': {
                1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
                137: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
                42161: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
                coingeckoId: 'wrapped-bitcoin'
            },
            'LINK': {
                1: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
                137: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
                42161: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
                coingeckoId: 'chainlink'
            },
            'UNI': {
                1: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
                137: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
                42161: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
                coingeckoId: 'uniswap'
            },
            'ETH': {
                coingeckoId: 'ethereum'
            }
        },
        erc20Abi: [
            {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
            {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
            {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
        ]
    };

    class UIController {
        constructor() {
            this.connectWalletBtn = document.getElementById('connectWalletBtn');
            this.walletInfo = document.getElementById('walletInfo');
            this.walletAddress = document.getElementById('walletAddress');
            this.networkName = document.getElementById('networkName');
            this.errorMessage = document.getElementById('error-message');
            this.donateBtn = document.getElementById('donateBtn');
            this.tokenBalance = document.getElementById('tokenBalance');
            this.tokenPrice = document.getElementById('tokenPrice');
            this.gasEstimate = document.getElementById('gasEstimate');
            this.transactionStatus = document.getElementById('transaction-status');
            this.statusMessage = document.getElementById('status-message');
            this.txLink = document.getElementById('tx-link');
            this.currentTier = document.getElementById('currentTier');
            this.tierProgress = document.getElementById('tierProgress');
            this.copyWalletBtn = document.getElementById('copyWallet');
            this.creatorWalletSpan = document.getElementById('creatorWallet');
            this.amountButtons = document.querySelectorAll('.amount-btn');
            this.customAmountInput = document.getElementById('customAmount');
            this.tokenSelect = document.getElementById('tokenSelect');
        }

        showError(message) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }

        hideError() {
            this.errorMessage.style.display = 'none';
        }

        updateWalletStatus(isConnected, address = '', network = '') {
            if (isConnected) {
                this.connectWalletBtn.style.display = 'none';
                this.walletInfo.style.display = 'block';
                this.walletAddress.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
                this.networkName.textContent = network;
                this.donateBtn.disabled = false;
            } else {
                this.connectWalletBtn.textContent = 'Connect Wallet';
                this.connectWalletBtn.style.display = 'block';
                this.walletInfo.style.display = 'none';
                this.donateBtn.disabled = true;
            }
        }

        showTransactionStatus(message, txHash = '', explorerUrl = '') {
            this.transactionStatus.style.display = 'block';
            this.statusMessage.textContent = message;
            if (txHash) {
                this.txLink.href = `${explorerUrl}${txHash}`;
                this.txLink.style.display = 'block';
            } else {
                this.txLink.style.display = 'none';
            }
        }

        updateTier(totalDonated) {
            let tier = 'None';
            if (totalDonated >= 100) tier = 'Apex';
            else if (totalDonated >= 50) tier = 'Quantum';
            else if (totalDonated >= 30) tier = 'Nexus';
            else if (totalDonated >= 15) tier = 'Cipher';
            else if (totalDonated >= 5) tier = 'Initiate';
            
            this.currentTier.textContent = tier;
            const progress = Math.min((totalDonated / 100) * 100, 100);
            this.tierProgress.style.width = `${progress}%`;
        }
    }

    class WalletManager {
        constructor(ui, onStateChange) {
            this.web3 = null;
            this.account = null;
            this.chainId = null;
            this.ui = ui;
            this.onStateChange = onStateChange;
        }

        async connect() {
            if (window.ethereum) {
                try {
                    this.ui.connectWalletBtn.textContent = 'Connecting...';
                    this.web3 = new Web3(window.ethereum);
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    this.account = accounts[0];
                    this.chainId = await this.web3.eth.getChainId();
                    
                    this.ui.hideError();
                    this.updateState();
                    this.listenToEvents();
                } catch (error) {
                    this.ui.showError('Wallet connection rejected.');
                    this.ui.updateWalletStatus(false);
                }
            } else {
                this.ui.showError('MetaMask not detected. Please install it.');
            }
        }

        listenToEvents() {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.account = accounts[0] || null;
                this.updateState();
            });
            window.ethereum.on('chainChanged', (chainId) => {
                this.chainId = parseInt(chainId, 16);
                this.updateState();
            });
        }

        updateState() {
            const network = CONFIG.supportedNetworks[this.chainId];
            if (this.account && network) {
                this.ui.updateWalletStatus(true, this.account, network.name);
                this.onStateChange(this.account, this.chainId);
            } else {
                this.ui.updateWalletStatus(false);
                if (this.account && !network) {
                    this.ui.showError('Unsupported network. Please switch to Ethereum, Polygon, or Arbitrum.');
                }
            }
        }

        async switchNetwork(chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: this.web3.utils.toHex(chainId) }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    // Add network logic here if needed
                    this.ui.showError('This network is not added to your MetaMask.');
                } else {
                    this.ui.showError('Failed to switch network.');
                }
            }
        }
    }

    class PriceTracker {
        async getPrice(tokenId) {
            try {
                const response = await fetch(`${CONFIG.priceApiUrl}?ids=${tokenId}&vs_currencies=usd`);
                const data = await response.json();
                return data[tokenId].usd;
            } catch (error) {
                console.error('Error fetching price:', error);
                return null;
            }
        }
    }

    class TokenHandler {
        constructor(web3, account, chainId) {
            this.web3 = web3;
            this.account = account;
            this.chainId = chainId;
        }

        getContractAddress(token) {
            return CONFIG.tokens[token][this.chainId];
        }

        async getBalance(token) {
            if (token === 'ETH') {
                const balance = await this.web3.eth.getBalance(this.account);
                return this.web3.utils.fromWei(balance, 'ether');
            } else {
                const contractAddress = this.getContractAddress(token);
                if (!contractAddress) return '0';
                const contract = new this.web3.eth.Contract(CONFIG.erc20Abi, contractAddress);
                const balance = await contract.methods.balanceOf(this.account).call();
                const decimals = await this._getDecimals(contract);
                return (balance / (10 ** decimals)).toString();
            }
        }

        async _getDecimals(contract) {
            // Standard ERC20, but some tokens might not have it.
            try {
                return await contract.methods.decimals().call();
            } catch (e) {
                // Common stablecoins have 6 or 18
                const name = await contract.methods.name().call();
                if (name.includes('USDC')) return 6;
                return 18;
            }
        }
    }

    class DonationHandler {
        constructor(web3, account, chainId, ui) {
            this.web3 = web3;
            this.account = account;
            this.chainId = chainId;
            this.ui = ui;
            this.priceTracker = new PriceTracker();
        }

        async processDonation(amountUSD, token) {
            this.ui.donateBtn.disabled = true;
            this.ui.showTransactionStatus('Processing donation...');

            try {
                const isStablecoin = ['USDC', 'USDT', 'DAI'].includes(token);
                
                if (token === 'ETH') {
                    await this.handleEthDonation(amountUSD);
                } else {
                    await this.handleErc20Donation(amountUSD, token, isStablecoin);
                }
            } catch (error) {
                this.ui.showTransactionStatus(`Error: ${error.message}`);
            } finally {
                this.ui.donateBtn.disabled = false;
            }
        }

        async handleEthDonation(amountUSD) {
            const ethPrice = await this.priceTracker.getPrice('ethereum');
            if (!ethPrice) {
                this.ui.showTransactionStatus('Error: Could not fetch ETH price.');
                return;
            }
            const amountETH = (amountUSD / ethPrice).toFixed(18);
            const amountWei = this.web3.utils.toWei(amountETH, 'ether');

            this.ui.showTransactionStatus('Please confirm the transaction in your wallet.');
            const tx = await this.web3.eth.sendTransaction({
                from: this.account,
                to: CONFIG.creatorWallet,
                value: amountWei
            });
            
            this.onSuccess(tx.transactionHash, amountUSD);
        }

        async handleErc20Donation(amountUSD, token, isStablecoin) {
            const contractAddress = CONFIG.tokens[token][this.chainId];
            if (!contractAddress) {
                this.ui.showTransactionStatus('Error: Token not supported on this network.');
                return;
            }
            const contract = new this.web3.eth.Contract(CONFIG.erc20Abi, contractAddress);
            const decimals = await new TokenHandler(this.web3)._getDecimals(contract);
            
            let amountToken;
            if (isStablecoin) {
                amountToken = (amountUSD * (10 ** decimals)).toString();
            } else {
                const tokenPrice = await this.priceTracker.getPrice(CONFIG.tokens[token].coingeckoId);
                if (!tokenPrice) {
                    this.ui.showTransactionStatus(`Error: Could not fetch ${token} price.`);
                    return;
                }
                const tokenValue = (amountUSD / tokenPrice) * (10 ** decimals);
                amountToken = Math.floor(tokenValue).toString();
            }

            // Check allowance and approve if necessary
            const allowance = await contract.methods.allowance(this.account, CONFIG.creatorWallet).call();
            if (BigInt(allowance) < BigInt(amountToken)) {
                this.ui.showTransactionStatus('Approval needed. Please confirm in your wallet.');
                await contract.methods.approve(CONFIG.creatorWallet, amountToken).send({ from: this.account });
            }

            this.ui.showTransactionStatus('Approval successful. Processing transfer...');
            const tx = await contract.methods.transfer(CONFIG.creatorWallet, amountToken).send({ from: this.account });
            
            this.onSuccess(tx.transactionHash, amountUSD);
        }

        onSuccess(txHash, amountUSD) {
            const explorerUrl = CONFIG.supportedNetworks[this.chainId].explorer;
            this.ui.showTransactionStatus('Donation successful! Thank you!', txHash, explorerUrl);
            
            // Update local storage for tier tracking
            let totalDonated = parseFloat(localStorage.getItem('totalDonated') || '0');
            totalDonated += parseFloat(amountUSD);
            localStorage.setItem('totalDonated', totalDonated);
            this.ui.updateTier(totalDonated);
        }
    }

    class App {
        constructor() {
            this.ui = new UIController();
            this.wallet = new WalletManager(this.ui, this.onWalletStateChange.bind(this));
            this.priceTracker = new PriceTracker();
            this.tokenHandler = null;
            this.donationHandler = null;
            this.selectedAmount = 0;
            this.selectedToken = 'ETH';
            this.bindEvents();
            this.init();
        }

        init() {
            const totalDonated = parseFloat(localStorage.getItem('totalDonated') || '0');
            this.ui.updateTier(totalDonated);
            this.ui.creatorWalletSpan.textContent = CONFIG.creatorWallet;
        }

        bindEvents() {
            this.ui.connectWalletBtn.addEventListener('click', () => this.wallet.connect());
            this.ui.copyWalletBtn.addEventListener('click', () => this.copyCreatorWallet());
            
            this.ui.amountButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.ui.amountButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.selectedAmount = parseFloat(btn.dataset.amount);
                    this.ui.customAmountInput.value = '';
                    this.updateDonationDetails();
                });
            });

            this.ui.customAmountInput.addEventListener('input', (e) => {
                this.ui.amountButtons.forEach(b => b.classList.remove('selected'));
                this.selectedAmount = parseFloat(e.target.value) || 0;
                this.updateDonationDetails();
            });

            this.ui.tokenSelect.addEventListener('change', (e) => {
                this.selectedToken = e.target.value;
                this.updateDonationDetails();
            });

            this.ui.donateBtn.addEventListener('click', () => {
                if (this.selectedAmount >= 5) {
                    this.donationHandler.processDonation(this.selectedAmount, this.selectedToken);
                } else {
                    this.ui.showError('Minimum donation is $5.');
                }
            });
        }

        onWalletStateChange(account, chainId) {
            if (account && chainId) {
                this.tokenHandler = new TokenHandler(this.wallet.web3, account, chainId);
                this.donationHandler = new DonationHandler(this.wallet.web3, account, chainId, this.ui);
                this.updateDonationDetails();
            }
        }

        async updateDonationDetails() {
            if (!this.tokenHandler) return;

            // Update balance
            const balance = await this.tokenHandler.getBalance(this.selectedToken);
            this.ui.tokenBalance.textContent = `${parseFloat(balance).toFixed(4)} ${this.selectedToken}`;

            // Update price
            const isStablecoin = ['USDC', 'USDT', 'DAI'].includes(this.selectedToken);
            if (isStablecoin) {
                this.ui.tokenPrice.textContent = '~$1.00 USD';
            } else {
                const price = await this.priceTracker.getPrice(CONFIG.tokens[this.selectedToken].coingeckoId);
                this.ui.tokenPrice.textContent = price ? `$${price.toFixed(2)} USD` : 'N/A';
            }
        }

        copyCreatorWallet() {
            navigator.clipboard.writeText(CONFIG.creatorWallet).then(() => {
                this.ui.copyWalletBtn.textContent = 'Copied!';
                setTimeout(() => { this.ui.copyWalletBtn.textContent = 'Copy'; }, 2000);
            });
        }
    }

    new App();
});