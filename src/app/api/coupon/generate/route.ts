import { NextRequest, NextResponse } from "next/server";
import Coupon from "src/lib/zipha_bot/models/couponClass";
import settingsModel from "src/lib/zipha_bot/models/settings.model";

const couponInstance = Coupon.getInstance();

export async function POST(req: NextRequest) {
  try {
   
    const body = await req.json();
    const { selectedOptions, adminUserId,userId } = body;

    if (!Array.isArray(selectedOptions) || selectedOptions.length === 0) {
      return NextResponse.json({ error: "No selected options provided." }, { status: 400 });
    }

    const couponCode = await couponInstance.generateCouponCode(); // 👈 using your new method
    const couponId = userId; // Ideally Telegram user ID or something unique

    await settingsModel.findOneAndUpdate(
      { userId: adminUserId },
      {
        $push: {
          "settings.codeGeneration": {
            couponId,
            username: "",
            options: selectedOptions.map((opt: string) => ({ text: opt })),
            redeemed: false,
            timestamps: new Date(),
            couponCode,
          },
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ couponCode });
  } catch (err) {
    console.error("Coupon generation failed:", err);
    return NextResponse.json({ error: "Failed to generate coupon" }, { status: 500 });
  }
}