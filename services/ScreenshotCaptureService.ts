/**
 * Screenshot Capture Service
 * Handles screenshot capture and region selection for the image cloning feature
 */

export interface ScreenshotCaptureServiceConfig {
  timeout?: number;
  maxRetries?: number;
}

export interface ScreenshotRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ScreenshotCaptureService {
  private isActive: boolean = false;
  private config: ScreenshotCaptureServiceConfig;
  private screenshotCanvas: HTMLCanvasElement | null = null;
  private selectionOverlay: HTMLDivElement | null = null;

  constructor(config: ScreenshotCaptureServiceConfig = {}) {
    this.config = {
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    };
  }

  /**
   * Start screenshot mode and listen for screenshot key
   */
  async startScreenshotMode(): Promise<void> {
    if (this.isActive) {
      console.warn('[ScreenshotCaptureService] Screenshot mode already active, cancelling first');
      this.cancelScreenshotMode();
    }

    this.isActive = true;
    console.log('[ScreenshotCaptureService] Screenshot mode activated');

    // Set up keyboard listener for screenshot key
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen key (code: 'PrintScreen')
      if (e.code === 'PrintScreen' || e.key === 'PrintScreen') {
        e.preventDefault();
        this.captureScreenshot().catch(err => {
          console.error('[ScreenshotCaptureService] Screenshot capture failed:', err);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Store handler for cleanup
    (this as any).keyDownHandler = handleKeyDown;
  }

  /**
   * Cancel screenshot mode
   */
  cancelScreenshotMode(): void {
    if (!this.isActive) return;

    this.isActive = false;
    console.log('[ScreenshotCaptureService] Screenshot mode cancelled');

    // Remove keyboard listener
    const handler = (this as any).keyDownHandler;
    if (handler) {
      window.removeEventListener('keydown', handler);
      delete (this as any).keyDownHandler;
    }

    // Clean up overlay
    this.cleanupSelectionOverlay();
  }

  /**
   * Capture screenshot from screen
   */
  async captureScreenshot(): Promise<HTMLCanvasElement> {
    console.log('[ScreenshotCaptureService] Capturing screenshot...');

    try {
      // Try using html2canvas for browser-based capture
      const canvas = await this.captureUsingHtml2Canvas();
      this.screenshotCanvas = canvas;
      console.log('[ScreenshotCaptureService] Screenshot captured successfully');
      
      // Show selection interface and emit event when done
      try {
        const blob = await this.showSelectionInterface(canvas);
        console.log('[ScreenshotCaptureService] Selection interface completed, blob size:', blob.size);
        
        // Emit custom event with the screenshot blob
        const event = new CustomEvent('screenshotCaptured', {
          detail: { blob, canvas }
        });
        window.dispatchEvent(event);
        console.log('[ScreenshotCaptureService] Screenshot event emitted');
      } catch (error) {
        console.error('[ScreenshotCaptureService] Selection interface error:', error);
        // Emit error event
        const event = new CustomEvent('screenshotCaptureError', {
          detail: { error }
        });
        window.dispatchEvent(event);
        throw error;
      }
      
      return canvas;
    } catch (error) {
      console.error('[ScreenshotCaptureService] Screenshot capture failed:', error);
      // Emit error event
      const event = new CustomEvent('screenshotCaptureError', {
        detail: { error }
      });
      window.dispatchEvent(event);
      throw new Error('Failed to capture screenshot');
    }
  }

  /**
   * Show selection interface for user to select region
   */
  async showSelectionInterface(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        this.createSelectionOverlay(canvas, (region: ScreenshotRegion) => {
          const blob = this.extractRegionAsBlob(canvas, region);
          this.cleanupSelectionOverlay();
          resolve(blob);
        }, () => {
          this.cleanupSelectionOverlay();
          reject(new Error('Selection cancelled'));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get selected region from screenshot
   */
  async getSelectedRegion(): Promise<Blob> {
    if (!this.screenshotCanvas) {
      throw new Error('No screenshot captured');
    }

    return this.showSelectionInterface(this.screenshotCanvas);
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Capture screenshot using html2canvas library
   */
  private async captureUsingHtml2Canvas(): Promise<HTMLCanvasElement> {
    try {
      console.log('[ScreenshotCaptureService] Attempting to import html2canvas...');
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      console.log('[ScreenshotCaptureService] html2canvas imported successfully');

      // Capture the entire viewport
      console.log('[ScreenshotCaptureService] Starting html2canvas capture...');
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: window.devicePixelRatio,
        logging: true,
      });
      
      console.log('[ScreenshotCaptureService] html2canvas capture completed, canvas size:', canvas.width, 'x', canvas.height);
      return canvas;
    } catch (error) {
      console.error('[ScreenshotCaptureService] html2canvas capture failed:', error);
      throw error;
    }
  }

  /**
   * Create selection overlay for user to select region
   */
  private createSelectionOverlay(
    canvas: HTMLCanvasElement,
    onConfirm: (region: ScreenshotRegion) => void,
    onCancel: () => void
  ): void {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'screenshot-selection-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.3);
      cursor: crosshair;
    `;

    // Create canvas display
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10001;
      overflow: auto;
    `;

    const displayCanvas = document.createElement('canvas');
    displayCanvas.width = canvas.width;
    displayCanvas.height = canvas.height;
    const ctx = displayCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(canvas, 0, 0);
    }
    displayCanvas.style.cssText = `
      display: block;
      max-width: 100%;
      height: auto;
    `;

    canvasContainer.appendChild(displayCanvas);

    // Create selection rectangle
    const selectionRect = document.createElement('div');
    selectionRect.style.cssText = `
      position: fixed;
      border: 2px solid #7c3aed;
      background: rgba(124, 58, 237, 0.1);
      display: none;
      z-index: 10002;
      pointer-events: none;
    `;

    // Create info display
    const infoDisplay = document.createElement('div');
    infoDisplay.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-family: monospace;
      z-index: 10003;
      pointer-events: none;
    `;
    infoDisplay.textContent = 'Click and drag to select region. Press ESC to cancel.';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 10003;
    `;

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.style.cssText = `
      padding: 8px 16px;
      background: #7c3aed;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      display: none;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    `;

    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);

    // Selection state
    let isSelecting = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;
      selectionRect.style.display = 'block';
      confirmBtn.style.display = 'inline-block';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting) return;

      currentX = e.clientX;
      currentY = e.clientY;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      selectionRect.style.left = `${x}px`;
      selectionRect.style.top = `${y}px`;
      selectionRect.style.width = `${width}px`;
      selectionRect.style.height = `${height}px`;

      infoDisplay.textContent = `Region: ${Math.round(x)}, ${Math.round(y)} | Size: ${Math.round(width)} x ${Math.round(height)}`;
    };

    const handleMouseUp = () => {
      isSelecting = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cleanup();
        onCancel();
      }
    };

    const handleConfirm = () => {
      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      if (width === 0 || height === 0) {
        alert('Please select a region');
        return;
      }

      cleanup();
      onConfirm({ x, y, width, height });
    };

    const handleCancel = () => {
      cleanup();
      onCancel();
    };

    const cleanup = () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);

      overlay.remove();
      canvasContainer.remove();
      selectionRect.remove();
      infoDisplay.remove();
      buttonContainer.remove();

      this.selectionOverlay = null;
    };

    // Attach event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    // Add elements to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(canvasContainer);
    document.body.appendChild(selectionRect);
    document.body.appendChild(infoDisplay);
    document.body.appendChild(buttonContainer);

    this.selectionOverlay = overlay;
  }

  /**
   * Extract region from canvas as blob
   */
  private extractRegionAsBlob(canvas: HTMLCanvasElement, region: ScreenshotRegion): Promise<Blob> {
    // Create a new canvas for the selected region
    const regionCanvas = document.createElement('canvas');
    regionCanvas.width = region.width;
    regionCanvas.height = region.height;

    const ctx = regionCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw the selected region
    ctx.drawImage(
      canvas,
      region.x,
      region.y,
      region.width,
      region.height,
      0,
      0,
      region.width,
      region.height
    );

    // Convert to blob
    return new Promise((resolve, reject) => {
      regionCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png'
      );
    });
  }

  /**
   * Clean up selection overlay
   */
  private cleanupSelectionOverlay(): void {
    if (this.selectionOverlay) {
      this.selectionOverlay.remove();
      this.selectionOverlay = null;
    }
  }
}

export default ScreenshotCaptureService;
