import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const ShoppingList = ({task}) => {
    return (
        <div className='ShoppingList'>
                    <p>{task.task}</p>
                    <div>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
            )}
    

// import React, { useContext } from "react";
// import { ShopContext } from "./shop-context"; // Adjust the path accordingly
// import { CartItem } from "./ShoppingListItem";
// import PRODUCTS from "./Products"; // Adjust the path accordingly

// function ShoppingList() {
//   const { likedItems } = useContext(ShopContext);

//   return (
//     <div className="shopping-list">
//       <h1>Your Liked Items</h1>
//       <div className="items">
//         {likedItems.length === 0 ? (
//           <p>No items liked yet.</p>
//         ) : (
//           likedItems.map((productId) => {
//             const product = PRODUCTS.find((item) => item.id === productId);
//             return product ? <CartItem key={product.id} data={product} /> : null;
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// export default ShoppingList;


