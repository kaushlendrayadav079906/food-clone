import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets'; // Ensure this path is correct
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const url = "http://localhost:8889/api/food"; // Backend base URL
    const [image, setImage] = useState(null); // Image file state
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                });
                setImage(null);
                toast.success("Product added successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload Area"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
                    />
                </div>

                <div className='add-product-name flex-col'>
                    <p>Product Name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name='name'
                        placeholder='Type here'
                        required
                    />
                </div>

                <div className='add-product-description flex-col'>
                    <p>Product Description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder='Write content here'
                        required
                    ></textarea>
                </div>

                <div className='add-category-price flex-col'>
                    <div className='add-category flex'>
                        <p>Product Category</p>
                        <select
                            name="category"
                            value={data.category}
                            onChange={onChangeHandler}
                            required
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Pasta">Pasta</option>
                        </select>
                    </div>

                    <div className='add-price flex-col'>
                        <p>Price</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name='price'
                            placeholder='Enter price'
                            required
                        />
                    </div>
                </div>

                <button type="submit" className='add-product-button'>Add Product</button>
            </form>
        </div>
    );
};

export default Add;