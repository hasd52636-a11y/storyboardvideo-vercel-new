/**
 * Clone Workflow Manager
 * Orchestrates the entire image cloning workflow
 */

import ScreenshotCaptureService from './ScreenshotCaptureService';
import ImageAnalysisService from './ImageAnalysisService';

export type WorkflowStatus = 'idle' | 'capturing' | 'analyzing' | 'generating' | 'complete' | 'error';
export type WorkflowStep = 'screenshot' | 'analysis' | 'generation';

export interface CloneWorkflowState {
  status: WorkflowStatus;
  currentStep: WorkflowStep;
  screenshot?: Blob;
  screenshotPreview?: string;
  analysis?: string;
  generatedPrompt?: string;
  clonedImageUrl?: string;
  error?: {
    step: string;
    message: string;
    retryable: boolean;
  };
  timestamp: number;
}

export interface CloneWorkflowManagerConfig {
  timeout?: number;
  maxRetries?: number;
}

export class CloneWorkflowManager {
  private state: CloneWorkflowState;
  private screenshotService: ScreenshotCaptureService;
  private analysisService: ImageAnalysisService;
  private config: CloneWorkflowManagerConfig;
  private stateChangeListeners: Array<(state: CloneWorkflowState) => void> = [];
  private retryCount: number = 0;

  constructor(config: CloneWorkflowManagerConfig = {}) {
    this.config = {
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    };

    this.state = {
      status: 'idle',
      currentStep: 'screenshot',
      timestamp: Date.now(),
    };

    this.screenshotService = new ScreenshotCaptureService(config);
    this.analysisService = new ImageAnalysisService(config);
  }

  /**
   * Get current workflow state
   */
  getState(): CloneWorkflowState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: (state: CloneWorkflowState) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }

  /**
   * Initiate clone workflow
   */
  async initiateClone(itemId: string): Promise<void> {
    if (!itemId || itemId.trim().length === 0) {
      throw new Error('Item ID is required');
    }

    console.log(`[CloneWorkflowManager] Initiating clone workflow for item ${itemId}`);

    try {
      this.retryCount = 0;
      
      this.updateState({
        status: 'capturing',
        currentStep: 'screenshot',
        error: undefined,
      });

      // Wait for user to press Print Screen and read from clipboard
      const screenshot = await this.waitForClipboardImage();
      
      if (!screenshot) {
        throw new Error('No image found in clipboard');
      }

      // Handle screenshot capture
      await this.handleScreenshotCapture(screenshot);
    } catch (error) {
      this.handleError('screenshot', error);
    }
  }

  /**
   * Wait for user to press Print Screen and read image from clipboard
   */
  private async waitForClipboardImage(): Promise<Blob | null> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 120; // 120 attempts * 500ms = 60 seconds
      
      const checkClipboard = async () => {
        try {
          attempts++;
          
          // Try to read clipboard
          const items = await navigator.clipboard.read();
          console.log(`[CloneWorkflowManager] Clipboard check ${attempts}/${maxAttempts}, items:`, items.length);
          
          if (items.length > 0) {
            for (const item of items) {
              console.log('[CloneWorkflowManager] Item types:', item.types);
              
              // Check for image types
              for (const type of item.types) {
                if (type.startsWith('image/')) {
                  console.log('[CloneWorkflowManager] Found image type:', type);
                  const blob = await item.getType(type);
                  console.log('[CloneWorkflowManager] Got image from clipboard, size:', blob.size, 'type:', type);
                  resolve(blob);
                  return;
                }
              }
            }
          }
          
          // Continue checking if no image found yet
          if (attempts < maxAttempts) {
            setTimeout(checkClipboard, 500);
          } else {
            console.warn('[CloneWorkflowManager] Clipboard check timeout after', attempts, 'attempts');
            resolve(null);
          }
        } catch (error) {
          console.error('[CloneWorkflowManager] Clipboard read error on attempt', attempts, ':', error);
          
          // Continue checking even on error
          if (attempts < maxAttempts) {
            setTimeout(checkClipboard, 500);
          } else {
            console.warn('[CloneWorkflowManager] Clipboard check failed after', attempts, 'attempts');
            resolve(null);
          }
        }
      };
      
      console.log('[CloneWorkflowManager] Starting clipboard monitoring...');
      // Start checking clipboard
      checkClipboard();
    });
  }

  /**
   * Handle screenshot capture
   */
  async handleScreenshotCapture(screenshot: Blob): Promise<void> {
    if (!screenshot || screenshot.size === 0) {
      this.handleError('screenshot', new Error('Invalid screenshot: empty blob'));
      throw new Error('Invalid screenshot: empty blob');
    }

    console.log('[CloneWorkflowManager] Processing screenshot...');

    try {
      // Create preview
      const preview = URL.createObjectURL(screenshot);

      this.updateState({
        screenshot,
        screenshotPreview: preview,
        status: 'analyzing',
        currentStep: 'analysis',
      });

      // Analyze image
      const analysis = await this.analysisService.analyzeImage(screenshot);

      if (!analysis || analysis.trim().length === 0) {
        throw new Error('Image analysis returned empty result');
      }

      // Generate prompt
      const prompt = await this.analysisService.generatePrompt(analysis);

      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt generation returned empty result');
      }

      // Validate prompt
      const isValid = await this.analysisService.validatePrompt(prompt);

      if (!isValid) {
        throw new Error('Generated prompt failed validation');
      }

      this.updateState({
        analysis,
        generatedPrompt: prompt,
        status: 'complete',
        currentStep: 'generation',
      });

      console.log('[CloneWorkflowManager] Workflow completed successfully');
    } catch (error) {
      this.handleError('analysis', error);
    }
  }

  /**
   * Handle prompt generation
   */
  async handlePromptGeneration(prompt: string): Promise<void> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    console.log('[CloneWorkflowManager] Generating image from prompt...');

    try {
      this.updateState({
        generatedPrompt: prompt,
        status: 'generating',
        currentStep: 'generation',
      });

      // Validate prompt
      const isValid = await this.analysisService.validatePrompt(prompt);

      if (!isValid) {
        throw new Error('Prompt validation failed');
      }

      // Note: Actual image generation will be handled by the parent component
      // This service just manages the workflow state

      console.log('[CloneWorkflowManager] Ready for image generation');
    } catch (error) {
      this.handleError('generation', error);
    }
  }

  /**
   * Handle error at any step
   */
  private handleError(step: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isRetryable = this.retryCount < (this.config.maxRetries || 3);

    console.error(`[CloneWorkflowManager] Error at step "${step}":`, errorMessage);

    this.updateState({
      status: 'error',
      error: {
        step,
        message: errorMessage,
        retryable: isRetryable,
      },
    });
  }

  /**
   * Cancel workflow
   */
  cancelWorkflow(): void {
    console.log('[CloneWorkflowManager] Cancelling workflow...');

    // Cancel screenshot mode
    this.screenshotService.cancelScreenshotMode();

    // Clean up preview
    if (this.state.screenshotPreview) {
      URL.revokeObjectURL(this.state.screenshotPreview);
    }

    this.retryCount = 0;

    this.updateState({
      status: 'idle',
      currentStep: 'screenshot',
      screenshot: undefined,
      screenshotPreview: undefined,
      analysis: undefined,
      generatedPrompt: undefined,
      error: undefined,
    });
  }

  /**
   * Retry workflow
   */
  async retryWorkflow(): Promise<void> {
    console.log('[CloneWorkflowManager] Retrying workflow...');

    if (!this.state.error) {
      throw new Error('No error to retry');
    }

    if (this.retryCount >= (this.config.maxRetries || 3)) {
      throw new Error('Maximum retry attempts exceeded');
    }

    this.retryCount++;
    const step = this.state.error.step;

    try {
      if (step === 'screenshot') {
        // Restart screenshot capture
        this.updateState({
          status: 'capturing',
          currentStep: 'screenshot',
          error: undefined,
        });

        const screenshot = await this.waitForScreenshot();
        if (screenshot) {
          await this.handleScreenshotCapture(screenshot);
        }
      } else if (step === 'analysis' && this.state.screenshot) {
        // Retry analysis
        this.updateState({
          status: 'analyzing',
          currentStep: 'analysis',
          error: undefined,
        });
        await this.handleScreenshotCapture(this.state.screenshot);
      } else if (step === 'generation') {
        // Retry generation
        if (this.state.generatedPrompt) {
          this.updateState({
            status: 'generating',
            currentStep: 'generation',
            error: undefined,
          });
          await this.handlePromptGeneration(this.state.generatedPrompt);
        }
      }
    } catch (error) {
      this.handleError(step, error);
    }
  }

  /**
   * Update generated prompt
   */
  updatePrompt(newPrompt: string): void {
    if (!newPrompt || newPrompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    console.log('[CloneWorkflowManager] Updating prompt...');

    this.updateState({
      generatedPrompt: newPrompt,
    });
  }

  /**
   * Validate workflow state transition
   */
  isValidStateTransition(fromStatus: WorkflowStatus, toStatus: WorkflowStatus): boolean {
    const validTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
      idle: ['capturing'],
      capturing: ['analyzing', 'error', 'idle'],
      analyzing: ['complete', 'error', 'idle'],
      generating: ['complete', 'error', 'idle'],
      complete: ['idle', 'generating'],
      error: ['capturing', 'analyzing', 'generating', 'idle'],
    };

    return validTransitions[fromStatus]?.includes(toStatus) ?? false;
  }

  /**
   * Reset workflow to idle state
   */
  reset(): void {
    console.log('[CloneWorkflowManager] Resetting workflow...');
    this.cancelWorkflow();
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Wait for screenshot capture
   */
  private waitForScreenshot(): Promise<Blob | null> {
    return new Promise((resolve) => {
      // Listen for screenshot capture event from ScreenshotCaptureService
      const handleCustomEvent = (event: any) => {
        if (event.detail && event.detail.blob) {
          console.log('[CloneWorkflowManager] Screenshot blob received:', event.detail.blob.size, 'bytes');
          window.removeEventListener('screenshotCaptured', handleCustomEvent);
          window.removeEventListener('screenshotCaptureError', handleErrorEvent);
          clearTimeout(timeoutId);
          resolve(event.detail.blob);
        }
      };

      const handleErrorEvent = (event: any) => {
        console.error('[CloneWorkflowManager] Screenshot capture error:', event.detail.error);
        window.removeEventListener('screenshotCaptured', handleCustomEvent);
        window.removeEventListener('screenshotCaptureError', handleErrorEvent);
        clearTimeout(timeoutId);
        resolve(null);
      };

      window.addEventListener('screenshotCaptured', handleCustomEvent);
      window.addEventListener('screenshotCaptureError', handleErrorEvent);

      // Set timeout to cancel if no screenshot is taken
      const timeoutId = setTimeout(() => {
        console.warn('[CloneWorkflowManager] Screenshot capture timeout');
        window.removeEventListener('screenshotCaptured', handleCustomEvent);
        window.removeEventListener('screenshotCaptureError', handleErrorEvent);
        resolve(null);
      }, this.config.timeout || 30000);
    });
  }

  /**
   * Update workflow state
   */
  private updateState(updates: Partial<CloneWorkflowState>): void {
    const newState = {
      ...this.state,
      ...updates,
      timestamp: Date.now(),
    };

    this.state = newState;

    console.log('[CloneWorkflowManager] State updated:', this.state);

    // Notify listeners
    this.stateChangeListeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('[CloneWorkflowManager] Error in state change listener:', error);
      }
    });
  }
}

export default CloneWorkflowManager;
