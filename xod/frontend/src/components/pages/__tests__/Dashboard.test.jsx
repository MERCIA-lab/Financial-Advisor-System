import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../theme/theme';
import Dashboard from './Dashboard';

// Mock the API service
jest.mock('../../services/api', () => ({
  clientService: {
    getAll: jest.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
    }),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard title', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Advisor Dashboard')).toBeInTheDocument();
  });

  test('displays summary cards', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Total AUM')).toBeInTheDocument();
    expect(screen.getByText('Total Clients')).toBeInTheDocument();
    expect(screen.getByText('Day Change')).toBeInTheDocument();
    expect(screen.getByText('Total Return')).toBeInTheDocument();
  });

  test('shows asset allocation chart', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Asset Allocation')).toBeInTheDocument();
  });

  test('displays recent activity section', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  test('renders quick action buttons', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
    expect(screen.getByText('Run Report')).toBeInTheDocument();
  });
});