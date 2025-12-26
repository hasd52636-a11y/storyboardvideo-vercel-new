/**
 * Symbol API Routes
 * Handles symbol CRUD operations
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { symbolService } from '@/services/SymbolService';
import { ErrorHandler, ErrorCode } from '@/services/api/ErrorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return handleGetSymbols(req, res);
      case 'POST':
        return handleCreateSymbol(req, res);
      case 'PUT':
        return handleUpdateSymbol(req, res);
      case 'DELETE':
        return handleDeleteSymbol(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'Symbol API');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleGetSymbols(req: NextApiRequest, res: NextApiResponse) {
  const { userId, id } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    if (id) {
      // Get single symbol
      const symbol = await symbolService.getSymbolById(id as string);
      if (!symbol) {
        return res.status(404).json({
          success: false,
          error: 'Symbol not found',
          code: ErrorCode.NOT_FOUND,
          retryable: false,
        });
      }
      return res.status(200).json({ success: true, data: symbol });
    } else {
      // Get all symbols for user
      const symbols = await symbolService.getSymbols(parseInt(userId as string));
      return res.status(200).json({ success: true, data: { symbols } });
    }
  } catch (error) {
    ErrorHandler.logError(error, 'handleGetSymbols');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleCreateSymbol(req: NextApiRequest, res: NextApiResponse) {
  const { userId, icon, name, description } = req.body;

  // Validate required fields
  const validationError = ErrorHandler.validateRequired(
    { userId, icon, name, description },
    ['userId', 'icon', 'name', 'description']
  );

  if (validationError) {
    return res.status(400).json(ErrorHandler.toResponse(validationError));
  }

  try {
    const symbol = await symbolService.uploadSymbol({
      userId,
      icon,
      name,
      description,
    });

    res.status(201).json({ success: true, data: symbol });
  } catch (error) {
    ErrorHandler.logError(error, 'handleCreateSymbol');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}

async function handleUpdateSymbol(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId, icon, name, description } = req.body;

  if (!id || !userId) {
    return res.status(400).json({
      success: false,
      error: 'id and userId are required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    const symbol = await symbolService.updateSymbol(id as string, userId, {
      icon,
      name,
      description,
    });

    res.status(200).json({ success: true, data: symbol });
  } catch (error) {
    ErrorHandler.logError(error, 'handleUpdateSymbol');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}

async function handleDeleteSymbol(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({
      success: false,
      error: 'id and userId are required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    await symbolService.deleteSymbol(id as string, userId);
    res.status(200).json({ success: true, data: { message: 'Symbol deleted' } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleDeleteSymbol');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}
