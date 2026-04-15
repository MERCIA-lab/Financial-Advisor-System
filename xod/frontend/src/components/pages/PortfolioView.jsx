import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService, securityService } from '../../services/api';

export default function PortfolioView() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [securities, setSecurities] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    dayChange: 0,
    totalReturn: 0,
  });
  const [open, setOpen] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchasePrice: '',
    quantity: '',
  });

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      const [clientResponse, securitiesResponse] = await Promise.all([
        clientService.getById(clientId),
        securityService.getByClientId(clientId),
      ]);

      setClient(clientResponse.data);
      setSecurities(securitiesResponse.data);

      // Calculate portfolio statistics
      calculatePortfolioStats(securitiesResponse.data);
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  const calculatePortfolioStats = (securities) => {
    let totalValue = 0;
    let totalCost = 0;

    securities.forEach(security => {
      const currentValue = security.purchasePrice * security.quantity;
      const costBasis = security.purchasePrice * security.quantity;
      totalValue += currentValue;
      totalCost += costBasis;
    });

    const totalReturn = totalValue - totalCost;
    const dayChange = totalValue * 0.02; // Mock day change

    setPortfolioStats({
      totalValue,
      dayChange,
      totalReturn,
    });
  };

  const handleOpenDialog = (security = null) => {
    setEditingSecurity(security);
    if (security) {
      setFormData({
        name: security.name,
        category: security.category,
        purchasePrice: security.purchasePrice,
        quantity: security.quantity,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        purchasePrice: '',
        quantity: '',
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingSecurity(null);
    setFormData({
      name: '',
      category: '',
      purchasePrice: '',
      quantity: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const securityData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        quantity: parseInt(formData.quantity),
      };

      if (editingSecurity) {
        await securityService.update(editingSecurity.id, securityData);
      } else {
        await securityService.create(clientId, securityData);
      }
      loadClientData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving security:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this security?')) {
      try {
        await securityService.delete(id);
        loadClientData();
      } catch (error) {
        console.error('Error deleting security:', error);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (!client) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/clients')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4">{client.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {client.email} • {client.phone}
          </Typography>
        </Box>
      </Box>

      {/* Portfolio Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {formatCurrency(portfolioStats.totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Day Change
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: portfolioStats.dayChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {portfolioStats.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioStats.dayChange)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Return
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: portfolioStats.totalReturn >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {portfolioStats.totalReturn >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalReturn)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Securities Table */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Holdings</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Security
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }} align="right">Quantity</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }} align="right">Purchase Price</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }} align="right">Current Value</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }} align="right">Total Value</TableCell>
              <TableCell sx={{ color: 'secondary.main', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {securities.map((security) => {
              const totalValue = security.purchasePrice * security.quantity;
              const currentPrice = security.purchasePrice * 1.05; // Mock current price
              const currentValue = currentPrice * security.quantity;

              return (
                <TableRow key={security.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {security.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={security.category}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'secondary.main',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{security.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(security.purchasePrice)}</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>
                    {formatCurrency(currentPrice)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(currentValue)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(security)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(security.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Security Form Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'primary.main' }}>
          {editingSecurity ? 'Edit Security' : 'Add New Security'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Security Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Tech, Finance, Healthcare"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                required
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSecurity ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}