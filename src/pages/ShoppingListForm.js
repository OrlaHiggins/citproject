import axios from 'axios';
import React, { useState } from 'react';

export const ShoppingListForm = ({ userId }) => {
    const [value, setValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5432/add-to-shopping-list', {
                userId: userId,
                productId: value
            });
            console.log('Product added to shopping list:', response.data);
        } catch (error) {
            console.error('Error adding product to shopping list:', error);
        }

        setValue("");
    };

    return (
        <form className='ShoppingListForm' onSubmit={handleSubmit}>
            <input
                type="text"
                className='shoppinglist-input'
                value={value}
                placeholder='Enter product ID'
                onChange={(e) => setValue(e.target.value)}
            />
            <button type='submit' className='shoppinglist-btn'>Add an Item</button>
        </form>
    );
};


