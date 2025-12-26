/**
 * Reset Action Template API Route
 * Handles template reset for action configurations
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { actionConfigurationService } from '@/services/ActionConfigurationService';
import { ErrorHandler, ErrorCode } from '@/services/api/ErrorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    if (method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }

    return handleResetTemplate(req, res);
  } catch (error) {
    ErrorHandler.logError(error, 'Reset Action Template API');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleResetTemplate(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId, templateType } = req.body;

  // Validate required fields
  const validationError = ErrorHandler.validateRequired(
    { id, userId, templateType },
    ['userId', 'templateType']
  );

  if (validationError) {
    return res.status(400).json(ErrorHandler.toResponse(validationError));
  }

  // Validate template type
  const validTypes = ['forward', 'rotate', 'jump', 'fly'];
  if (!validTypes.includes(templateType)) {
    return res.status(400).json({
      success: false,
      error: `Invalid template type. Must be one of: ${validTypes.join(', ')}`,
      code: ErrorCode.INVALID_PARAMETER,
      retryable: false,
    });
  }

  try {
    const config = await actionConfigurationService.resetTemplate(
      id as string,
      userId,
      templateType as any
    );

    res.status(200).json({ success: true, data: { config } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleResetTemplate');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}
