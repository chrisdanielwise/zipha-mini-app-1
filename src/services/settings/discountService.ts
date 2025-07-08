// /services/settings/discountService.ts

import { settingsClass } from "src/lib/zipha_bot/controllers/callback_handlers/settings/settingsClass";
//Bot function
export async function applyVipDiscount(discount: number) {
  const settings = settingsClass();
  const result = await settings.getSettings();

  const { oneMonth, threeMonths, sixMonths, oneYear } = result.vipPrice as {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };

  const discountedPrices = {
    oneMonth: +(oneMonth - oneMonth * discount).toFixed(2),
    threeMonths: +(threeMonths - threeMonths * discount).toFixed(2),
    sixMonths: +(sixMonths - sixMonths * discount).toFixed(2),
    oneYear: +(oneYear - oneYear * discount).toFixed(2),
  };

  await settings.updateSettings(settings.callbackQuery || "", discountedPrices);
  return discountedPrices;
}
// Mini app function
export async function applySelectiveVipDiscount(
  discount: number,
  options: {
    applyToAll?: boolean;
    targetDurations?: string[];
  } = {}
) {
  const settings = settingsClass();
  const result = await settings.getSettings();

  const { oneMonth, threeMonths, sixMonths, oneYear } = result.vipPrice as {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };

  const originalPrices = { oneMonth, threeMonths, sixMonths, oneYear };

  const keyMap: Record<string, keyof typeof originalPrices> = {
    vip1Month: "oneMonth",
    vip3Month: "threeMonths",
    vip6Month: "sixMonths",
    vip12Month: "oneYear",
  };

  // FIX: Correctly interpret false as false
  const applyToAll = options.applyToAll === true;

  const normalizedDurations = (options.targetDurations || [])
    .map((key) => keyMap[key])
    .filter((k): k is keyof typeof originalPrices => Boolean(k));

  const discountedPrices = Object.fromEntries(
    Object.entries(originalPrices).map(([key, value]) => {
      const shouldApply = applyToAll || normalizedDurations.includes(key as keyof typeof originalPrices);
      const discounted = shouldApply ? +(value - value * discount).toFixed(2) : value;
      return [key, discounted];
    })
  );

  let answer = await settings.updateSettings(settings.callbackQuery || '', discountedPrices);
  return answer;
}


export async function resetVipDiscount() {
  const settings = settingsClass();
  const result = await settings.getSettings();

  const { oneMonth, threeMonths, sixMonths, oneYear } = result.vipPrice as {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };

  await settings.updateSettings(settings.callbackQuery || "", {
    oneMonth,
    threeMonths,
    sixMonths,
    oneYear,
  });

  return { oneMonth, threeMonths, sixMonths, oneYear };
}