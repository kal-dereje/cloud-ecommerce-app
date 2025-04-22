import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import Header from './components/Header';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AccountSettings from './pages/AccountSettings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
import CustomerInfo from './pages/CustomerInfo';
import { userAtom } from './atoms/userAtoms';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Cognito from './pages/Cognito';


const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useAtom(userAtom);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminProtected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useAtom(userAtom);
  return user?.role?.includes('admin')
    ? <>{children}</>
    : <Navigate to="/admin-login" replace />;
};

const App: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container mx-auto p-4">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Cognito />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        <Route path="/orders" element={<Protected><OrderHistory /></Protected>} />
        <Route path="/account" element={<Protected><AccountSettings /></Protected>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminProtected><AdminDashboard /></AdminProtected>}>  
          <Route path="" element={<ManageProducts />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="customers" element={<CustomerInfo />} />
        </Route>
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
