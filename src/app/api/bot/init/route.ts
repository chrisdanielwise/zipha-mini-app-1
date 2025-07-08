import { NextResponse } from 'next/server';
import { initializeGreybot } from '../../../../../server/bot/config/initBot';

export async function GET() {
  try {
    // Check if bot is already initialized
    if ((global as any).__BOT_INITIALIZED__) {
      return NextResponse.json({ message: 'Bot already initialized' });
    }

    // Initialize the bot
    await initializeGreybot();
    (global as any).__BOT_INITIALIZED__ = true;
    
    return NextResponse.json({ 
      message: 'Bot initialized successfully',
      status: 'ready'
    });
  } catch (error: any) {
    console.error('Bot initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize bot' },
      { status: 500 }
    );
  }
} 