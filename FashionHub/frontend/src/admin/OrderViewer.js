import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderViewer = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}`, { status: newStatus }, config);
            fetchOrders(); // Refresh orders after update
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error updating order status. Check console for details.');
        }
    };

    return (
        <div className="order-viewer">
            <h2>Order List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.usuario ? order.usuario.nombre : 'N/A'}</td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                                <select value={order.estado} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                                    <option value="pendiente">Pending</option>
                                    <option value="pagado">Paid</option>
                                    <option value="enviado">Shipped</option>
                                    <option value="entregado">Delivered</option>
                                </select>
                            </td>
                            <td>
                                {/* Optionally, add a view details button */}
                                <button onClick={() => alert('View details for order ' + order._id)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderViewer;