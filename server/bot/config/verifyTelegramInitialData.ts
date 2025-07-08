import crypto from "crypto";

function verifyTelegramInitData(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    
    if (!hash) {
      return false;
    }

    // Remove hash from data
    urlParams.delete("hash");
    
    // Sort parameters alphabetically
    const sortedParams = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // Create secret key
    if (!botToken) {
      console.error("Bot token not provided");
      return false;
    }

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    
    // Calculate hash
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(sortedParams)
      .digest("hex");

    return calculatedHash === hash;
  } catch (error) {
    console.error("Error verifying Telegram init data:", error);
    return false;
  }
}

export default verifyTelegramInitData; 