import apiClient from './apiClient'

export async function getProducts() {
  const response = await apiClient.get('/products')
  return response.data
}

export async function getProduct(id) {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export async function createProduct(product) {
  const response = await apiClient.post('/products', product)
  return response.data
}

export async function updateProduct(id, product) {
  const response = await apiClient.put(`/products/${id}`, product)
  return response.data
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`)
}