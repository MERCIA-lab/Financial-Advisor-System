import { useEffect, useState } from "react";

const API = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const emptyClient = { name: "", email: "", phone: "" };
const emptySecurity = {
  name: "",
  category: "",
  purchaseDate: "",
  purchasePrice: "",
  quantity: 1,
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("xod_token") || "");
  const [advisor, setAdvisor] = useState(JSON.parse(localStorage.getItem("xod_advisor") || "null"));
  const [loginForm, setLoginForm] = useState({ email: "advisor@xod.local", password: "password" });
  const [error, setError] = useState("");

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [securities, setSecurities] = useState([]);

  const [clientForm, setClientForm] = useState(emptyClient);
  const [editingClientId, setEditingClientId] = useState(null);

  const [securityForm, setSecurityForm] = useState(emptySecurity);
  const [editingSecurityId, setEditingSecurityId] = useState(null);

  useEffect(() => {
    if (token) loadClients();
  }, [token]);

  useEffect(() => {
    if (selectedClientId && token) loadSecurities(selectedClientId);
    else setSecurities([]);
  }, [selectedClientId, token]);

  async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    if (res.status === 204) return null;
    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("application/json") ? res.json() : null;
  }

  async function login(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      });

      setToken(data.token);
      setAdvisor({ advisorId: data.advisorId, name: data.name, email: data.email });
      localStorage.setItem("xod_token", data.token);
      localStorage.setItem("xod_advisor", JSON.stringify({ advisorId: data.advisorId, name: data.name, email: data.email }));
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  }

  function logout() {
    setToken("");
    setAdvisor(null);
    setClients([]);
    setSecurities([]);
    setSelectedClientId(null);
    localStorage.removeItem("xod_token");
    localStorage.removeItem("xod_advisor");
  }

  async function loadClients() {
    const data = await apiFetch("/clients");
    setClients(data);
    if (!selectedClientId && data.length) setSelectedClientId(data[0].clientId);
    if (selectedClientId && !data.some((c) => c.clientId === selectedClientId)) {
      setSelectedClientId(data.length ? data[0].clientId : null);
    }
  }

  async function loadSecurities(clientId) {
    const data = await apiFetch(`/clients/${clientId}/securities`);
    setSecurities(data);
  }

  function startEditClient(client) {
    setEditingClientId(client.clientId);
    setClientForm({ name: client.name, email: client.email, phone: client.phone });
  }

  function cancelEditClient() {
    setEditingClientId(null);
    setClientForm(emptyClient);
  }

  async function saveClient(e) {
    e.preventDefault();
    if (editingClientId) {
      await apiFetch(`/clients/${editingClientId}`, {
        method: "PUT",
        body: JSON.stringify(clientForm),
      });
    } else {
      await apiFetch("/clients", {
        method: "POST",
        body: JSON.stringify(clientForm),
      });
    }
    cancelEditClient();
    await loadClients();
  }

  async function deleteClient(clientId) {
    await apiFetch(`/clients/${clientId}`, { method: "DELETE" });
    if (selectedClientId === clientId) setSelectedClientId(null);
    await loadClients();
  }

  function startEditSecurity(security) {
    setEditingSecurityId(security.securityId);
    setSecurityForm({
      name: security.name,
      category: security.category,
      purchaseDate: security.purchaseDate,
      purchasePrice: security.purchasePrice,
      quantity: security.quantity,
    });
  }

  function cancelEditSecurity() {
    setEditingSecurityId(null);
    setSecurityForm(emptySecurity);
  }

  async function saveSecurity(e) {
    e.preventDefault();
    if (!selectedClientId) return;

    const payload = {
      ...securityForm,
      purchasePrice: Number(securityForm.purchasePrice),
      quantity: Number(securityForm.quantity),
    };

    if (editingSecurityId) {
      await apiFetch(`/clients/securities/${editingSecurityId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch(`/clients/${selectedClientId}/securities`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    cancelEditSecurity();
    await loadSecurities(selectedClientId);
  }

  async function deleteSecurity(securityId) {
    await apiFetch(`/clients/securities/${securityId}`, { method: "DELETE" });
    await loadSecurities(selectedClientId);
  }

  if (!token) {
    return (
      <main>
        <h1>XOD Financial Advisor Login</h1>
        <section className="card auth-card">
          <form onSubmit={login}>
            <input type="email" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
          </form>
        </section>
      </main>
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
