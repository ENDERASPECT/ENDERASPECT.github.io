document.addEventListener('DOMContentLoaded', () => {
    const walletAddress = '0x05b2414bC97a0e879279E53Ca332526ECdB3785D';

    // --- QR Code Generation ---
    const qrCodeElement = document.getElementById('qr-code');
    if (qrCodeElement) {
        new QRCode(qrCodeElement, {
            text: walletAddress,
            width: 180,
            height: 180,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // --- Copy Wallet Address ---
    const copyWalletBtn = document.getElementById('copyWallet');
    const walletAddressElement = document.getElementById('walletAddress');

    if (copyWalletBtn && walletAddressElement) {
        copyWalletBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(walletAddress).then(() => {
                copyWalletBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyWalletBtn.textContent = 'Copy Address';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy address: ', err);
                alert('Failed to copy address.');
            });
        });
    }
});