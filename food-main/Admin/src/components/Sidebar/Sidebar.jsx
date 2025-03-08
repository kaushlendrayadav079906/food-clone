import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets'; // Ensure 'assets' is correctly imported

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <NavLink to="/add" className='sidebar-option'> {/* Add NavLink for Add Items */}
        <img src={assets.add_icon_white} alt="Add Items" />
        <p>Add Items</p>
      </NavLink>
      <NavLink to="/list" className='sidebar-option'> {/* NavLink for List Item */}
        <img src={assets.parcel_icon} alt="List Items" />
        <p>List Item</p>
      </NavLink>
      <NavLink to="/orders" className='sidebar-option'> {/* NavLink for Orders */}
        <img src={assets.order_icon} alt="Orders" />
        <p>Order</p>
      </NavLink>
    </div>
  );
}

export default Sidebar;
