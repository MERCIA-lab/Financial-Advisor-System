import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { clientService } from '../../services/api';

const COLORS = ['#FFD700', '#000000', '#333333', '#666666'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAssets: 0,
    dayChange: 0,
    totalChange: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const clients = await clientService.getAll();

      // Calculate stats
      let totalAssets = 0;
      const allocation = {};

      for (const client of clients.data) {
        // Get securities for each client
        try {
          const securities = await clientService.getById(client.id);
          // Calculate total value from securities
          // This is a simplified calculation - in real app you'd have current prices
          const clientValue = securities.data.securities?.reduce((sum, security) =>
            sum + (security.purchasePrice * security.quantity), 0) || 0;
          totalAssets += clientValue;

          // Asset allocation by category
          securities.data.securities?.forEach(security => {
            allocation[security.category] = (allocation[security.category] || 0) + clientValue;
          });
        } catch (error) {
          console.error(`Error loading securities for client ${client.id}:`, error);
        }
      }

      setStats({
        totalClients: clients.data.length,
        totalAssets,
        dayChange: totalAssets * 0.02, // Mock day change
        totalChange: totalAssets * 0.15, // Mock total change
      });

      // Convert allocation to chart data
      const allocationData = Object.entries(allocation).map(([category, value]) => ({
        name: category,
        value: value,
      }));
      setAssetAllocation(allocationData);

      // Mock recent activity
      setRecentActivity([
        { id: 1, action: 'Added new security to John Doe', time: '2 hours ago', type: 'add' },
        { id: 2, action: 'Updated client portfolio for Jane Smith', time: '4 hours ago', type: 'update' },
        { id: 3, action: 'Created new client account', time: '1 day ago', type: 'create' },
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Advisor Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total AUM</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {formatCurrency(stats.totalAssets)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Clients</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {stats.totalClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: stats.dayChange >= 0 ? 'success.main' : 'error.main', mr: 1 }} />
                <Typography variant="h6">Day Change</Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: stats.dayChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {stats.dayChange >= 0 ? '+' : ''}{formatCurrency(stats.dayChange)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: stats.totalChange >= 0 ? 'success.main' : 'error.main', mr: 1 }} />
                <Typography variant="h6">Total Return</Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: stats.totalChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {stats.totalChange >= 0 ? '+' : ''}{formatCurrency(stats.totalChange)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Allocation
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                    />
                    <Chip
                      label={activity.type}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'secondary.main',
                        textTransform: 'capitalize'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          sx={{ mr: 2 }}
        >
          Add New Client
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
        >
          Run Report
        </Button>
      </Box>
    </Box>
  );
}