import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import ProductDetails from './pages/ProductDetails'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  )
}