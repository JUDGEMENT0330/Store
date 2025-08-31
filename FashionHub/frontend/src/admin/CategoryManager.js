import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        parent: ''
    });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

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
            if (editingCategory) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/categories/${editingCategory._id}`, formData, config);
                setEditingCategory(null);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/categories`, formData, config);
            }
            setFormData({ nombre: '', parent: '' });
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category. Check console for details.');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            nombre: category.nombre,
            parent: category.parent ? category.parent._id : ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/categories/${id}`, config);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error deleting category. Check console for details.');
            }
        }
    };

    return (
        <div className="category-manager">
            <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder="Category Name" value={formData.nombre} onChange={handleChange} required />
                <select name="parent" value={formData.parent} onChange={handleChange}>
                    <option value="">No Parent (Top Level)</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
                <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
                {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setFormData({ nombre: '', parent: '' }); }}>Cancel Edit</button>}
            </form>

            <h2>Category List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Parent</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.nombre}</td>
                            <td>{category.parent ? category.parent.nombre : 'N/A'}</td>
                            <td>
                                <button onClick={() => handleEdit(category)}>Edit</button>
                                <button onClick={() => handleDelete(category._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryManager;