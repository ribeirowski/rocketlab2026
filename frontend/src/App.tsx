import { Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/templates/AppShell"
import { ProductsPage } from "@/pages/productsPage"
import { ProductDetailPage } from "@/pages/productDetailPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  )
}
