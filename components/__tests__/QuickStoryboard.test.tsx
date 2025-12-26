/**
 * Unit Tests for Quick Storyboard Component
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickStoryboard from '../QuickStoryboard';
import type { QuickStoryboardConfig } from '@prisma/client';

// Mock fetch
global.fetch = vi.fn();

describe('QuickStoryboard Component', () => {
  const mockConfig: QuickStoryboardConfig = {
    id: '1',
    userId: 1,
    name: 'Default Config',
    description: 'Default configuration',
    threeViewTemplate: 'Generate three orthographic views (front, side, top) of {subject}',
    multiGridTemplate: 'Generate a {gridDimensions} grid storyboard with {frameCount} frames',
    styleComparisonTemplate: 'Generate {subject} in 5 different artistic styles: {styles}',
    narrativeProgressionTemplate:
      'Generate {frameCount} sequential frames showing narrative progression from: {currentContext}',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Rendering', () => {
    it('should display all four quick-action buttons', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 2.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ config: mockConfig }),
      } as any);

      render(<QuickStoryboard userId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Three-View')).toBeInTheDocument();
        expect(screen.getByText('Multi-Grid')).toBeInTheDocument();
        expect(screen.getByText('Style Comparison')).toBeInTheDocument();
        expect(screen.getByText('Narrative Progression')).toBeInTheDocument();
      });
    });
  });

  describe('Template Editing', () => {
    it('should display editable prompt templates', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 2.2

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ config: mockConfig }),
      } as any);

      render(<QuickStoryboard userId={1} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Generate three orthographic views/)
        ).toBeInTheDocument();
      });
    });

    it('should allow editing templates', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 9.2

      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ config: mockConfig }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ config: mockConfig }),
        } as any);

      render(<QuickStoryboard userId={1} />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      // Should show textarea for editing
      await waitFor(() => {
        const textareas = screen.getAllByRole('textbox');
        expect(textareas.length).toBeGreaterThan(0);
      });
    });

    it('should validate template on save', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 9.3

      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ config: mockConfig }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ config: mockConfig }),
        } as any);

      render(<QuickStoryboard userId={1} />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      // Save should call API
      await waitFor(() => {
        const saveButtons = screen.getAllByText('Save');
        fireEvent.click(saveButtons[0]);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/quick-storyboard/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('Input Validation Dialogs', () => {
    it('should show input dialog for Multi-Grid', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 4.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ config: mockConfig }),
      } as any);

      render(<QuickStoryboard userId={1} />);

      await waitFor(() => {
        const multiGridButton = screen.getByText('Multi-Grid').closest('button');
        fireEvent.click(multiGridButton!);
      });

      // Should show input dialog
      await waitFor(() => {
        expect(screen.getByText(/Number of frames/)).toBeInTheDocument();
      });
    });

    it('should validate frame count input', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 4.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ config: mockConfig }),
      } as any);

      const onError = vi.fn();
      render(<QuickStoryboard userId={1} onError={onError} />);

      await waitFor(() => {
        const multiGridButton = screen.getByText('Multi-Grid').closest('button');
        fireEvent.click(multiGridButton!);
      });

      // Enter invalid value
      const input = screen.getByPlaceholderText('Enter value') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '1' } });

      const generateButton = screen.getByText('Generate');
      fireEvent.click(generateButton);

      // Should show error
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error on load failure', async () => {
      // Feature: storyboard-enhancement, Property 2: Quick Storyboard Configuration Persistence
      // Validates: Requirements 2.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as any);

      const onError = vi.fn();
      render(<QuickStoryboard userId={1} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});
