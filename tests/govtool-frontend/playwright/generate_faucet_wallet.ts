import { ShelleyWallet } from "./lib/helpers/crypto";

(async () => {
  try {
    console.log("\nGenerating your wallet... 🔐");
    const wallet = await ShelleyWallet.generate();
    const walletJson = wallet.json();

    // Display wallet details
    console.log("\n🎉 Wallet generated successfully!");
    console.log("-----------------------------------");
    console.log("💼 Wallet:", walletJson);
    console.log(`\n🔑 Payment Private Key: ${walletJson.payment.private}`);
    console.log(`💰 Stake Private Key: ${walletJson.stake.private}`);
    console.log(`🏠 Wallet Address: ${walletJson.address}`);
    console.log("-----------------------------------");

    // Instructions for environment variables
    console.log(
      "\n📋 Please copy the following to your environment variables:"
    );
    console.log(`1. Set FAUCET_PAYMENT_PRIVATE=${walletJson.payment.private}`);
    console.log(`2. Set FAUCET_STAKE_PRIVATE=${walletJson.stake.private}`);
    console.log(`3. Set FAUCET_ADDRESS=${walletJson.address}`);

    console.log(
      "\n🎈 All set! Please ensure this wallet is funded with a sufficient balance"
    );
  } catch (error) {
    console.error("\n❌ An error occurred:", error.message);
  }
})();
