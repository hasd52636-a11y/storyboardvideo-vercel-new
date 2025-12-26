/**
 * 统一管理员 API 端点
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
    const action = searchParams.get('action') || 'get-all-users';

    switch (action) {
      case 'get-all-users':
        // TODO: 实现获取所有用户的逻辑
        return successResponse({ users: [] });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[admin] GET error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'update-balance';
    const body = await request.json();

    switch (action) {
      case 'update-balance':
        // TODO: 实现更新余额的逻辑
        return successResponse({ message: 'Balance updated' });

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (error) {
    console.error('[admin] POST error:', error);
    return errorResponse('Internal server error', 500);
  }
}
