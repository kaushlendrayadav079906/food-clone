import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const orderUrl = "http://localhost:8889/api/order"; // Ensure this matches your backend
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${orderUrl}/list`);
      console.log(response.data); // Debugging

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              
              <p className='order-item-food'>
                {order.items.map((item, itemIndex) => {
                  const foodName = item.foodId?.name || "Unknown Food"; // Handle missing names
                  return itemIndex === order.items.length - 1
                    ? `${foodName} x ${item.quantity}`
                    : `${foodName} x ${item.quantity}, `;
                })}
              </p>

              <p className='order-item-total'>
                Total Items: {order.items.reduce((total, item) => total + item.quantity, 0)}
              </p>

              {order.address && typeof order.address === "object" ? (
                <>
                  <p className='order-item-name'>
                    {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
                  </p>
                  <p className='order-item-phone'>
                    Phone: {order.address?.phoneNumber || "N/A"}
                  </p>
                  <div className='order-item-address'>
                    <p>{order.address?.street || "N/A"},</p>
                    <p>
                      {order.address?.city || "N/A"}, {order.address?.state || "N/A"}, {order.address?.country || "N/A"}, {order.address?.zipcode || "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="order-item-address">Address not available</p>
              )}

              <p>Total Price: ${order.amount}</p>

              <select>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
