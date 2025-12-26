/**
 * Action Configuration API Routes
 * Handles action configuration management
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { actionConfigurationService } from '@/services/ActionConfigurationService';
import { ErrorHandler, ErrorCode } from '@/services/api/ErrorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return handleGetConfig(req, res);
      case 'POST':
        return handleCreateConfig(req, res);
      case 'PUT':
        return handleUpdateConfig(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'Action Configuration API');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleGetConfig(req: NextApiRequest, res: NextApiResponse) {
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
      // Get specific configuration
      const config = await actionConfigurationService.getConfigById(id as string);
      if (!config) {
        return res.status(404).json({
          success: false,
          error: 'Configuration not found',
          code: ErrorCode.NOT_FOUND,
          retryable: false,
        });
      }
      return res.status(200).json({ success: true, data: { config } });
    } else {
      // Get user's configuration
      const config = await actionConfigurationService.getConfig(parseInt(userId as string));
      if (!config) {
        // Create default configuration if not exists
        const defaultConfig = await actionConfigurationService.createConfig({
          userId: parseInt(userId as string),
          name: 'Default Configuration',
          description: 'Default action configuration',
        });
        return res.status(200).json({ success: true, data: { config: defaultConfig } });
      }
      return res.status(200).json({ success: true, data: { config } });
    }
  } catch (error) {
    ErrorHandler.logError(error, 'handleGetConfig');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(500).json(errorResponse);
  }
}

async function handleCreateConfig(req: NextApiRequest, res: NextApiResponse) {
  const { userId, name, description, templates } = req.body;

  // Validate required fields
  const validationError = ErrorHandler.validateRequired(
    { userId, name, description },
    ['userId', 'name', 'description']
  );

  if (validationError) {
    return res.status(400).json(ErrorHandler.toResponse(validationError));
  }

  try {
    const config = await actionConfigurationService.createConfig({
      userId,
      name,
      description,
      templates,
    });

    res.status(201).json({ success: true, data: { config } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleCreateConfig');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}

async function handleUpdateConfig(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { userId, name, description, forwardTemplate, rotateTemplate, jumpTemplate, flyTemplate } = req.body;

  if (!id || !userId) {
    return res.status(400).json({
      success: false,
      error: 'id and userId are required',
      code: ErrorCode.MISSING_REQUIRED_FIELD,
      retryable: false,
    });
  }

  try {
    const config = await actionConfigurationService.updateConfig(id as string, userId, {
      name,
      description,
      forwardTemplate,
      rotateTemplate,
      jumpTemplate,
      flyTemplate,
    });

    res.status(200).json({ success: true, data: { config } });
  } catch (error) {
    ErrorHandler.logError(error, 'handleUpdateConfig');
    const errorResponse = ErrorHandler.toResponse(error);
    res.status(400).json(errorResponse);
  }
}
