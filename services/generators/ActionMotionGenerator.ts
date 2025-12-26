/**
 * Action Motion Generator
 * Generates prompts for motion actions (forward, rotate, jump, fly)
 */

import { promptEngine } from '../PromptEngine';

export type ActionType = 'forward' | 'rotate' | 'jump' | 'fly';

export interface ActionMotionRequest {
  actionType: ActionType;
  subject: string;
  template: string;
  context?: string;
}

export interface ActionMotionResult {
  prompt: string;
  parameters: Record<string, string>;
  actionType: ActionType;
}

export class ActionMotionGenerator {
  /**
   * Generate action motion prompt
   */
  generatePrompt(request: ActionMotionRequest): ActionMotionResult {
    const { actionType, subject, template, context } = request;

    // Validate input
    if (!subject || subject.trim().length === 0) {
      throw new Error('Subject is required');
    }

    if (!template || template.trim().length === 0) {
      throw new Error('Template is required');
    }

    if (!this.isValidActionType(actionType)) {
      throw new Error(`Invalid action type: ${actionType}`);
    }

    // Build parameters for template substitution
    const parameters: Record<string, string> = {
      subject: subject.trim(),
      action: actionType,
      ...(context && { context: context.trim() }),
    };

    // Render prompt with parameters
    const prompt = promptEngine.renderPrompt(template, parameters);

    return {
      prompt,
      parameters,
      actionType,
    };
  }

  /**
   * Validate action type
   */
  isValidActionType(actionType: string): actionType is ActionType {
    return ['forward', 'rotate', 'jump', 'fly'].includes(actionType);
  }

  /**
   * Validate action motion request
   */
  validate(request: ActionMotionRequest): boolean {
    if (!request.subject || request.subject.trim().length === 0) {
      throw new Error('Subject is required');
    }

    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    if (!this.isValidActionType(request.actionType)) {
      throw new Error(`Invalid action type: ${request.actionType}`);
    }

    // Check if template has required placeholders
    const requiredPlaceholders = ['subject'];
    for (const placeholder of requiredPlaceholders) {
      if (!promptEngine.validateTemplate(request.template, [placeholder])) {
        throw new Error(`Template must contain {${placeholder}} placeholder`);
      }
    }

    return true;
  }

  /**
   * Get action description
   */
  getActionDescription(actionType: ActionType): string {
    const descriptions: Record<ActionType, string> = {
      forward: 'Smooth forward motion',
      rotate: '360-degree rotation',
      jump: 'Jumping motion',
      fly: 'Flying motion',
    };

    return descriptions[actionType];
  }

  /**
   * Get action icon
   */
  getActionIcon(actionType: ActionType): string {
    const icons: Record<ActionType, string> = {
      forward: '➡️',
      rotate: '🔄',
      jump: '⬆️',
      fly: '✈️',
    };

    return icons[actionType];
  }

  /**
   * Get all action types
   */
  getAllActionTypes(): ActionType[] {
    return ['forward', 'rotate', 'jump', 'fly'];
  }
}

export const actionMotionGenerator = new ActionMotionGenerator();
