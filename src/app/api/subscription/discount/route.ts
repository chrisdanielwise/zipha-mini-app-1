// /app/api/discount/vip/route.ts

import { NextRequest, NextResponse } from "next/server";
import { applySelectiveVipDiscount, resetVipDiscount } from "src/services/settings/discountService";

export async function POST(req: NextRequest) {
  try {
    const { discount, applyToAll, targetDurations } = await req.json();
    let updatedPrices 
    if (typeof discount !== "number" || discount < 0 ) {
      return NextResponse.json({ error: "Invalid discount value" }, { status: 400 });
    }
    const normalizedApplyToAll = applyToAll === true; // ✅ Safe boolean check

    if (!normalizedApplyToAll && (!Array.isArray(targetDurations) || targetDurations.length === 0)) {
      console.log("You must specify target durations if applyToAll is false")
      return NextResponse.json({ error: "You must specify target durations if applyToAll is false" }, { status: 400 });
    }

    const options = {
      applyToAll: normalizedApplyToAll,
      targetDurations,
    };
    if(discount === 0){
      updatedPrices = await resetVipDiscount()
    }
    else{
      updatedPrices = await applySelectiveVipDiscount(discount, options);
      // console.log("Updated prices:", updatedPrices); // ✅ Console logging
    }
    return NextResponse.json({ message: "Discount applied", prices: updatedPrices });
  } catch (error) {
    console.error("Discount error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}