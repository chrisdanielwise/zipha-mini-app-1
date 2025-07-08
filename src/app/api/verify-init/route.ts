import { NextResponse } from 'next/server';
import verifyTelegramInitData from '../../../../server/bot/config/verifyTelegramInitialData';


export async function POST(request: Request) {
  const { initData } = await request.json();
  const botToken = process.env.GREY_BOT_API_TOKEN!;
  // console.log("Received initData string:", initData); 
  if (!initData || typeof initData !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing or invalid initData' }, { status: 400 });
  } 
  
  if (!initData) {
    return NextResponse.json({ ok: false, error: 'Missing initData' }, { status: 400 });
  }

  const isValid = verifyTelegramInitData(initData, botToken);
  if (isValid) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }
}