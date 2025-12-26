/**
 * Image Generation API Routes
 * Handles image generation requests
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { imageGenerationService } from '@/services/ImageGenerationService';
import { ErrorHandler, ErrorCode } from '@/services/api/ErrorHandler';
import type { GenerationType } from '@/services/ImageGenerationService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        return handleGenerate(req, res);
      case 'GET':
        return handleGetHistory(req, res);
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'Image Generation API');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleGenerate(req: NextApiRequest, res: NextApiResponse) {
  const { userId, type, template, parameters, subject, currentImage, script } = req.body;

  // Validate required fields
  const validationError = ErrorHandler.validateRequired(
    { userId, type, template, parameters },
    ['userId', 'type', 'template', 'parameters']
  );

  if (validationError) {
    return res.status(400).json(ErrorHandler.toResponse(validationError));
  }

  // Validate generation type
  const validTypes: GenerationType[] = ['three-view', 'multi-grid', 'style-comparison', 'narrative-progression'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      error: `Invalid generation type. Must be one of: ${validTypes.join(', ')}`,
      code: ErrorCode.INVALID_PARAMETER,
      retryable: false,
    });
  }

  try {
    const result = await imageGenerationService.generateImages({
      type,
      userId,
      template,
      parameters,
      subject,
      currentImage,
      script,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    ErrorHandler.logError(error, 'handleGenerate');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}

async function handleGetHistory(req: NextApiRequest, res: NextApiResponse) {
  const { userId, limit } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    const history = await imageGenerationService.getGenerationHistory(
      parseInt(userId as string),
      limit ? parseInt(limit as string) : 20
    );

    res.status(200).json({ success: true, data: { history } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleGetHistory');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}
