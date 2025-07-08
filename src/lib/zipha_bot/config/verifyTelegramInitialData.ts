import crypto from 'crypto';

export default function verifyTelegramInitData(initData: string, botToken: string): boolean {
  try {
    const parsedParams = new URLSearchParams(initData);
    const hash = parsedParams.get('hash');
    if (!hash) return false;
    parsedParams.delete('hash');

    const sortedParams = [...parsedParams.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${key}=${val}`)
      .join('\n');

    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(sortedParams)
      .digest('hex');

    return generatedHash === hash;
  } catch (err) {
    console.error('Verification error:', err);
    return false;
  }
}