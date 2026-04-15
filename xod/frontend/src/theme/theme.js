import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold/Yellow
      contrastText: '#000000', // Black text on yellow
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#FFD700', // Yellow text on black
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter dark for cards
    },
    text: {
      primary: '#FFD700', // Yellow text
      secondary: '#ffffff', // White text for secondary
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#FFD700',
    },
    h5: {
      fontWeight: 600,
      color: '#FFD700',
    },
    h6: {
      fontWeight: 500,
      color: '#FFD700',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#FFD700',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#E6C200',
          },
        },
        containedSecondary: {
          backgroundColor: '#000000',
          color: '#FFD700',
          border: '1px solid #FFD700',
          '&:hover': {
            backgroundColor: '#FFD700',
            color: '#000000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid #FFD700',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '2px solid #FFD700',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: '2px solid #FFD700',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #FFD700',
          '& .MuiDataGrid-cell': {
            color: '#FFD700',
            borderBottom: '1px solid #333',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#000000',
            color: '#FFD700',
            borderBottom: '2px solid #FFD700',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#2a2a2a',
          },
        },
      },
    },
  },
});

export default theme;