// In ShoppingListWrapper.js
import React, { useState } from 'react';
import { ShoppingListForm } from './ShoppingListForm';

export const ShoppingListWrapper = () => {
    const [shoppinglists, setShoppinglist] = useState([]);

    const addShoppinglist = shoppinglist => {
        setShoppinglist([...shoppinglists, shoppinglist]);
        console.log(shoppinglists); // Note: State updates may be asynchronous, so you may not see the updated state immediately after setting it
    };

    return (
        <div className='ShoppingListWrapper'>
            <ShoppingListForm addShoppinglist={addShoppinglist} />
        </div>
    );
};


