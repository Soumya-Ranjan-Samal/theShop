// import React from "react";

// function CartTotalCard({ data }) {
//   return (
//     <div>
//       <div className="r1 font-bold text-xl text-center mb-4">
//         Total Added Items
//       </div>
//       <div className="items">
//         {Array.isArray(data) && data.length > 0 ? (
//           <ul className="list-disc list-inside space-y-2">
//             {data.map((el, index) => (
//               <li key={el._id || index} className="text-gray-700">
//                 <span>{el.name}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500 text-center">No items in cart</p>
//         )}
//       </div>
//       <div className="total">
//         Total Price: {data.reduce((sum, el)=> sum + el.price*el.count , 0)}
//       </div>
//       <div className="totalafterdiscount">
//         Pay: ₹ {data.reduce((total, el)=> total + (el.price*el.count - el.price*el.count* (el.Offer / 100)), 0 )}
//       </div>
//     </div>
//   );
// }

// export { CartTotalCard };

import React from "react";
import { Button, Divider, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

function CartTotalCard({ data }) {
  const totalPrice = data.reduce((sum, el) => sum + el.price * el.count, 0);
  const totalPayable = data.reduce(
    (total, el) =>
      total + (el.price * el.count - el.price * el.count * (el.Offer / 100)),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full h-[500px] flex flex-col justify-between">
      {/* Header */}
      <Typography variant="h6" className="text-center font-bold mb-4 text-gray-800">
        🛒 Cart Summary
      </Typography>

      <Divider className="mb-4" />

      {/* Scrollable Items List */}
      <div className="overflow-y-auto max-h-[250px] pr-2">
        {Array.isArray(data) && data.length > 0 ? (
          <ul className="space-y-3">
            {data.map((el, index) => (
              <li
                key={el._id || index}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <p className="font-semibold text-gray-800">
                  {el.name}
                  <span className="ml-2 text-sm text-gray-600">× {el.count}</span>
                </p>
                <p className="text-sm">
                  Price: <span className="line-through text-red-500">₹{el.price}</span>
                </p>
                <p className="text-sm">
                  Discount: {el.Offer}% →{" "}
                  <span className="text-green-600 font-medium">
                    ₹{((el.price * el.count * (100 - el.Offer)) / 100).toFixed(2)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No items in cart</p>
        )}
      </div>

      {/* Totals */}
      <Divider className="my-4" />
      <div className="text-gray-800 space-y-2 text-sm">
        <p>
          <span className="font-medium">Total Price:</span>{" "}
          <span className="text-red-600 font-semibold">₹{totalPrice}</span>
        </p>
        <p>
          <span className="font-medium">Total Payable:</span>{" "}
          <span className="text-green-600 font-semibold">₹{totalPayable.toFixed(2)}</span>
        </p>
      </div>
      <Button
        variant="contained"
        fullWidth
        startIcon={<ShoppingCartCheckoutIcon />}
        sx={{
          backgroundColor: '#F59E0B', 
          color: '#fff',
          '&:hover': {
            backgroundColor: '#D97706', 
          },
          textTransform: 'none',
          mt: 2,
        }}
        className="mt-4 normal-case"
        onClick={() => alert(`Proceeding to buy ₹${totalPayable.toFixed(2)} worth of items`)}
      >
        Buy All
      </Button>
    </div>
  );
}

export { CartTotalCard };