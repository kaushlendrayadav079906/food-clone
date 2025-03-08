import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const listUrl = "http://localhost:8889/api/food/list";
  const removeUrl = "http://localhost:8889/api/food/remove";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(listUrl);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch the list");
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.delete(`${removeUrl}/${id}`);
      if (response.data.success) {
        toast.success("Food removed successfully");
        setList(list.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to remove food item");
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container">
      <h2>Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>
                <img
                  src={
                    item.image
                      ? `http://localhost:8889/uploads/${item.image}`
                      : "/placeholder.jpg"
                  }
                  alt={item.name}
                  width="100"
                />
              </td>

              <td>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
