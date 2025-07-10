import { NextRequest, NextResponse } from "next/server";
import settingsModel from "../../../../server/bot/models/settings.model";

export async function GET(req: NextRequest) {
  try {
    // Get the admin user ID from environment or request
    const adminUserId = Number(process.env.USER_ID) || 1;
    
    // Fetch settings document containing coupons
    const settingsDoc = await settingsModel.findOne({ userId: adminUserId });
    
    if (!settingsDoc || !settingsDoc.settings.codeGeneration) {
      return NextResponse.json({ coupons: [] });
    }

    // Transform the data for frontend consumption
    const coupons = settingsDoc.settings.codeGeneration.map((coupon: any) => ({
      id: coupon._id || coupon.couponId,
      couponCode: coupon.couponCode,
      couponId: coupon.couponId,
      username: coupon.username,
      services: coupon.options?.map((opt: any) => opt.text).join(", ") || "No services",
      redeemed: coupon.redeemed,
      createdAt: coupon.timestamps,
      status: coupon.redeemed ? "Redeemed" : "Active"
    }));

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { couponCode } = await req.json();
    const adminUserId = Number(process.env.USER_ID) || 1;

    if (!couponCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    // Remove the coupon from the array
    const result = await settingsModel.updateOne(
      { userId: adminUserId },
      { $pull: { "settings.codeGeneration": { couponCode } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
} 