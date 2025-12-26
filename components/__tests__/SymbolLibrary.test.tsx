/**
 * Unit Tests for Symbol Library Component
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SymbolLibrary from '../SymbolLibrary';
import type { Symbol } from '@prisma/client';

// Mock fetch
global.fetch = vi.fn();

describe('SymbolLibrary Component', () => {
  const mockSymbols: Symbol[] = [
    {
      id: '1',
      userId: 1,
      icon: 'data:image/png;base64,test',
      name: 'Test Symbol 1',
      description: 'Test Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 1,
      icon: 'data:image/png;base64,test2',
      name: 'Test Symbol 2',
      description: 'Test Description 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Symbol Grid Rendering', () => {
    it('should display all symbols in grid layout', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbols: mockSymbols }),
      } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Test Symbol 1')).toBeInTheDocument();
        expect(screen.getByText('Test Symbol 2')).toBeInTheDocument();
      });
    });

    it('should display empty state when no symbols', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbols: [] }),
      } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/No symbols yet/)).toBeInTheDocument();
      });
    });

    it('should display loading state initially', () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.1

      vi.mocked(global.fetch).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ symbols: mockSymbols }),
                } as any),
              100
            )
          )
      );

      render(<SymbolLibrary userId={1} />);

      expect(screen.getByText(/Loading symbols/)).toBeInTheDocument();
    });
  });

  describe('Upload Dialog', () => {
    it('should show upload dialog when upload button clicked', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.2

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbols: mockSymbols }),
      } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        const uploadButton = screen.getByText('+ Upload Symbol');
        fireEvent.click(uploadButton);
      });

      expect(screen.getByText('Upload Symbol')).toBeInTheDocument();
    });
  });

  describe('Edit/Delete Interactions', () => {
    it('should display edit and delete buttons on symbol card', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.5

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ symbols: mockSymbols }),
      } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        const deleteButtons = screen.getAllByText('Delete');

        expect(editButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
      });
    });

    it('should call delete API when delete button clicked', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.5

      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ symbols: mockSymbols }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ symbols: [mockSymbols[1]] }),
        } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      // Confirm deletion
      window.confirm = vi.fn(() => true);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/symbols/1'),
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on load failure', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.1

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as any);

      render(<SymbolLibrary userId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load symbols/)).toBeInTheDocument();
      });
    });
  });
});
