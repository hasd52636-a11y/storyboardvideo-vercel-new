/**
 * 统一用户 API 端点
 */

import { NextRequest, NextResponse } from 'next/server';

function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { message },
    },
    { status }
  );
}

function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'profile';

    switch (action) {
      case 'profile':
        // TODO: 实现获取用户资料的逻辑
        return successResponse({ profile: {} });

      case 'transactions':
        // TODO: 实现获取交易记录的逻辑
        return successResponse({ transactions: [] });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[user] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'deduct';
    const body = await request.json();

    switch (action) {
      case 'deduct':
        // TODO: 实现扣费逻辑
        return successResponse({ message: 'Balance deducted' });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[user] POST error:', error);
    return errorResponse('Internal server error', 500);
  }
}
