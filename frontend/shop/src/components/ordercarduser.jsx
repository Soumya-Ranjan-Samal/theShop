import { Stepper, Step, StepLabel, Button, ButtonGroup } from '@mui/material';
import { useEffect } from 'react';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';

function OrderCard({ order, refreshOrders }) {
  const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];
  const activeStep = steps.indexOf(order.status);

  const handleCancel = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/order/cancel/${order._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('mytoken')}`
          }
        }
      );
      if (res.status === 200) {
        alert('Order cancelled successfully');
        refreshOrders?.(); 
      } else {
        alert('Unable to cancel order');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };


  return (
    <div className={" transition delay-100 duration-300 ease-in-out hover:scale-110 bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col md:flex-row items-start gap-6 w-full max-w-4xl mx-auto border border-gray-200"}>
      
      <div className="w-full md:w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg border">
        <img
          src={order.productId.pictures[0]}
          alt={order.productId.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800">{order.productId.name}</h2>
        <p className="text-sm text-gray-500">Seller: {order.productId.ProductSheller}</p>
        <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
        <p className="text-sm text-gray-500">Price: ₹{order.productId.price}</p>
        <p className="text-sm text-gray-500">Offer: {order.productId.Offer}%</p>
        <p className="text-sm text-gray-500">Total: ₹{order.totalAmount.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">OTP: <span className="font-bold text-blue-600">{order.Otp}</span></p>

        {order.isCancelled && (
          <p className="text-red-600 font-semibold mt-2">Order Cancelled</p>
        )}
      </div>

      <div className="w-full md:w-64 flex flex-col items-start">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() =>
                  index <= activeStep ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {order.status === 'Placed' && !order.isCancelled && (
          <ButtonGroup variant="outlined" color="error" className="mt-4">
            <Button onClick={handleCancel}>Cancel Order</Button>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}

export default OrderCard;