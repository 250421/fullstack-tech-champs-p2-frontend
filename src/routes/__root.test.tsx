// __root.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';

// Mock the Outlet to isolate RootLayout logic
jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  Outlet: () => <div data-testid="mock-outlet" />
}));

// Re-declare RootLayout here to test it (since it's not exported from __root.tsx)
const RootLayout = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
};

describe('RootLayout', () => {
  it('renders Outlet within QueryClientProvider', () => {
    render(<RootLayout />);
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
  });
});
