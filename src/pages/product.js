// import React, { useContext } from "react";
// import { ShopContext } from "./shop-context";

// export const Product = (props) => {
//   const { id, image, title, price } = props.data;
//   const { addToCart, cartItems } = useContext(ShopContext);

//   const cartItemCount = cartItems[id];

//   return (
//     <div className="product">
//       <img src={image} />
//       <div className="description">
//         <p>
//           <b>{title}</b>
//         </p>
//         <p> £{price}</p>
//       </div>
//       <button className="addToCartBttn" onClick={() => addToCart(id)}>
//         Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
//       </button>
//     </div>
//   );
// };