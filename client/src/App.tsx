import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Debts from './pages/Debts';
import Invoices from './pages/Invoices';
import Certificates from './pages/Certificates';
import Claims from './pages/Claims';
import ClaimForm from './pages/ClaimForm';
import InvoiceForm from './pages/InvoiceForm';
import NewsFeed from './pages/NewsFeed';
import Layout from './components/Layout';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/:id" element={<InvoiceForm />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/claims/new" element={<ClaimForm />} />
        <Route path="/claims/:id" element={<ClaimForm />} />
        <Route path="/news" element={<NewsFeed />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;