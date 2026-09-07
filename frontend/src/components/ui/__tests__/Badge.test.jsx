import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders the correct label for a known booking status', () => {
    renderWithProviders(<Badge status="in_progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders custom children over the status label', () => {
    renderWithProviders(<Badge status="pending">Custom label</Badge>);
    expect(screen.getByText('Custom label')).toBeInTheDocument();
  });
});
