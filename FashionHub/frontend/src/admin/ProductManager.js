import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagenes: [],
        categoria: '',
        stock: ''
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, imagenes: e.target.value.split(',').map(img => img.trim()) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (editingProduct) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/products/${editingProduct._id}`, formData, config);
                setEditingProduct(null);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/products`, formData, config);
            }
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                imagenes: [],
                categoria: '',
                stock: ''
            });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Check console for details.');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            imagenes: product.imagenes.join(', '),
            categoria: product.categoria._id, // Assuming category is populated
            stock: product.stock
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Check console for details.');
            }
        }
    };

    return (
        <div className="product-manager">
            <h2>{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder="Product Name" value={formData.nombre} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Description" value={formData.descripcion} onChange={handleChange} required></textarea>
                <input type="number" name="precio" placeholder="Price" value={formData.precio} onChange={handleChange} required />
                <input type="text" name="imagenes" placeholder="Image URLs (comma separated)" value={formData.imagenes} onChange={handleImageChange} />
                <select name="categoria" value={formData.categoria} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setFormData({ nombre: '', descripcion: '', precio: '', imagenes: [], categoria: '', stock: '' }); }}>Cancel Edit</button>}
            </form>

            <h2>Product List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.nombre}</td>
                            <td>{product.categoria ? product.categoria.nombre : 'N/A'}</td>
                            <td>${product.precio}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => handleEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManager;