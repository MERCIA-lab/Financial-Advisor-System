import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme/theme';

// Components
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import ClientList from './components/pages/ClientList';
import PortfolioView from './components/pages/PortfolioView';
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// App Router Component
function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:clientId/portfolio"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PortfolioView />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Portfolio Analysis Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Settings Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

  return (
    <main>
      <div className="topbar">
        <div>
          <h1>XOD Financial Advisor Client Management</h1>
          <p>{advisor?.name} ({advisor?.email})</p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      <section className="grid">
        <div className="card">
          <h2>{editingClientId ? "Edit Client" : "Create Client"}</h2>
          <form onSubmit={saveClient}>
            <input placeholder="Name" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} required />
            <input placeholder="Email" type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} required />
            <input placeholder="Phone" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} required />
            <button type="submit">{editingClientId ? "Update Client" : "Add Client"}</button>
            {editingClientId && <button type="button" className="secondary" onClick={cancelEditClient}>Cancel</button>}
          </form>
        </div>

        <div className="card">
          <h2>Clients</h2>
          {clients.map((c) => (
            <div key={c.clientId} className={selectedClientId === c.clientId ? "row active" : "row"}>
              <button onClick={() => setSelectedClientId(c.clientId)}>{c.name}</button>
              <div className="actions">
                <button className="secondary" onClick={() => startEditClient(c)}>Edit</button>
                <button className="danger" onClick={() => deleteClient(c.clientId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>{editingSecurityId ? "Edit Security" : "Add Security"}</h2>
          <form onSubmit={saveSecurity}>
            <input placeholder="Name" value={securityForm.name} onChange={(e) => setSecurityForm({ ...securityForm, name: e.target.value })} required />
            <input placeholder="Category" value={securityForm.category} onChange={(e) => setSecurityForm({ ...securityForm, category: e.target.value })} required />
            <input type="date" value={securityForm.purchaseDate} onChange={(e) => setSecurityForm({ ...securityForm, purchaseDate: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Purchase Price" value={securityForm.purchasePrice} onChange={(e) => setSecurityForm({ ...securityForm, purchasePrice: e.target.value })} required />
            <input type="number" min="1" placeholder="Quantity" value={securityForm.quantity} onChange={(e) => setSecurityForm({ ...securityForm, quantity: e.target.value })} required />
            <button type="submit" disabled={!selectedClientId}>{editingSecurityId ? "Update Security" : "Add Security"}</button>
            {editingSecurityId && <button type="button" className="secondary" onClick={cancelEditSecurity}>Cancel</button>}
          </form>
        </div>

        <div className="card">
          <h2>Securities</h2>
          {!selectedClientId && <p>Select a client to view portfolio.</p>}
          {securities.map((s) => (
            <div key={s.securityId} className="row">
              <span>{s.name} ({s.category}) x{s.quantity}</span>
              <div className="actions">
                <button className="secondary" onClick={() => startEditSecurity(s)}>Edit</button>
                <button className="danger" onClick={() => deleteSecurity(s.securityId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
