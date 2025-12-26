/**
 * Unit Tests for Generation Canvas Component
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GenerationCanvas from '../GenerationCanvas';

describe('GenerationCanvas Component', () => {
  const mockImages = ['image-1.jpg', 'image-2.jpg', 'image-3.jpg'];
  const mockMetadata = { subject: 'test', timestamp: '2024-01-01' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Three-View Layout', () => {
    it('should display three images with labels', () => {
      // Feature: storyboard-enhancement, Property 3: Three-View Generation Trigger
      // Validates: Requirements 3.5

      render(
        <GenerationCanvas
          images={mockImages}
          type="three-view"
          metadata={mockMetadata}
        />
      );

      expect(screen.getByText('Front View')).toBeInTheDocument();
      expect(screen.getByText('Side View')).toBeInTheDocument();
      expect(screen.getByText('Top View')).toBeInTheDocument();
    });
  });

  describe('Multi-Grid Layout', () => {
    it('should display grid image', () => {
      // Feature: storyboard-enhancement, Property 3: Three-View Generation Trigger
      // Validates: Requirements 4.6

      render(
        <GenerationCanvas
          images={['grid-image.jpg']}
          type="multi-grid"
          metadata={mockMetadata}
        />
      );

      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Style-Comparison Layout', () => {
    it('should display 5 style variations', () => {
      // Feature: storyboard-enhancement, Property 3: Three-View Generation Trigger
      // Validates: Requirements 5.4

      const styleImages = Array.from({ length: 5 }, (_, i) => `style-${i + 1}.jpg`);

      render(
        <GenerationCanvas
          images={styleImages}
          type="style-comparison"
          metadata={mockMetadata}
        />
      );

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Style ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Narrative-Progression Layout', () => {
    it('should display frames in sequence', () => {
      // Feature: storyboard-enhancement, Property 3: Three-View Generation Trigger
      // Validates: Requirements 6.6

      const frameImages = Array.from({ length: 3 }, (_, i) => `frame-${i + 1}.jpg`);

      render(
        <GenerationCanvas
          images={frameImages}
          type="narrative-progression"
          metadata={mockMetadata}
        />
      );

      for (let i = 1; i <= 3; i++) {
        expect(screen.getByText(`Frame ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Canvas Actions', () => {
    it('should display save and delete buttons', () => {
      // Feature: storyboard-enhancement, Property 3: Three-View Generation Trigger
      // Validates: Requirements 3.5

      const onSave = vi.fn();
      const onDelete = vi.fn();

      render(
        <GenerationCanvas
          images={mockImages}
          type="three-view"
          metadata={mockMetadata}
          onSave={onSave}
          onDelete={onDelete}
        />
      );

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });
});
