/**
 * Generation History API Routes
 * Handles generation history retrieval and management
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { generationHistoryService } from '@/services/GenerationHistoryService';
import { ErrorHandler, ErrorCode } from '@/services/api/ErrorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return handleGetHistory(req, res);
      case 'DELETE':
        return handleDeleteGeneration(req, res);
      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'Generation History API');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleGetHistory(req: NextApiRequest, res: NextApiResponse) {
  const { userId, page = '1', limit = '20', type, stats } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Validate pagination
    const rangeError = ErrorHandler.validateRange(pageNum, 1, 1000, 'page');
    if (rangeError) {
      return res.status(400).json(ErrorHandler.toResponse(rangeError));
    }

    const limitError = ErrorHandler.validateRange(limitNum, 1, 100, 'limit');
    if (limitError) {
      return res.status(400).json(ErrorHandler.toResponse(limitError));
    }

    const userId_num = parseInt(userId as string);

    // Get statistics if requested
    if (stats === 'true') {
      const statistics = await generationHistoryService.getStatistics(userId_num);
      return res.status(200).json({ success: true, data: { statistics } });
    }

    // Get history by type if specified
    if (type) {
      const result = await generationHistoryService.getGenerationsByType(
        userId_num,
        type as string,
        { page: pageNum, limit: limitNum }
      );
      return res.status(200).json({ success: true, data: result });
    }

    // Get all history
    const result = await generationHistoryService.getHistory(userId_num, {
      page: pageNum,
      limit: limitNum,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    ErrorHandler.logError(error, 'handleGetHistory');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}

async function handleDeleteGeneration(req: NextApiRequest, res: NextApiResponse) {
  const { generationId } = req.query;
  const { userId } = req.body;

  if (!generationId || !userId) {
    return res.status(400).json({
      success: false,
      error: 'generationId and userId are required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    await generationHistoryService.deleteGeneration(generationId as string, userId);
    res.status(200).json({ success: true, data: { message: 'Generation deleted' } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleDeleteGeneration');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}
