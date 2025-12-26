/**
 * 统一认证 API 端点
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

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'login';
    const body = await request.json();

    switch (action) {
      case 'login':
        // TODO: 实现登录逻辑
        return successResponse({ token: 'auth_token' });

      case 'register':
        // TODO: 实现注册逻辑
        return successResponse({ message: 'User registered' });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[auth] POST error:', error);
    return errorResponse('Internal server error', 500);
  }
}
