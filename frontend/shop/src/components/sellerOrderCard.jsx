import { useState } from "react";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { IconButton } from "@mui/material";
import axios from "axios";
import Confirm from "./confirm";

function SellerOrderCard({ order, setAllOrder }) {

  const { buyerId, productId } = order;
  const [state,setState] = useState(false);
  const [date,setDate] = useState(false);
  const [ask, setAsk] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState({
    deliveryDate : order.deliveryDate,
    state: order.status,
    otp: ''
  });
  const [otp, setOtp] = useState();
  const [otpColor, setOtpColor] = useState(true);

  function handelChange(el){
    if(el.target.name == 'state' && el.target.value == 'Delivered'){
      setOtp(true);
    }else if(el.target.name == 'state' && el.target.value != 'Delivered'){
      setOtp(false)
    }
    setDataToUpdate({...dataToUpdate,[el.target.name]: el.target.value });
  }

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

  function handelUpdate(){
    let req = async ()=>{
      if(dataToUpdate.state == 'Delivered' && dataToUpdate.otp.length == 0){
        alert('Otp field is required');
        setOtpColor(false);
        return;
      }
      console.log(localStorage.getItem('mytoken'));
      await axios.patch(`http://localhost:3000/seller/order/${order._id}/update`, {
        ...dataToUpdate,
      },{
        headers: {
          Authorization: `bearer ${localStorage.getItem('mytoken')}`,
        }
      }).then((res)=>{
        if(res.status == 200){
          alert(res.data.message);
          setAllOrder(allOrder => allOrder.map((el)=> el._id == order._id ? {...el, deliveryDate: dataToUpdate.deliveryDate, status: dataToUpdate.state}: el));
        }else{
          alert(res.data.message);
        }
      }).catch((error)=>{
        console.log(error);
          alert(error);
      });
    }
    setAsk({
            text: "Are you sure to do this update",
            fun: req,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex  flex-col gap-4 transition-all duration-300 easy-in-out h-full hover:shadow-xl">
      
      <div className="flex gap-4 items-center hover:bg-gray-200 p-2 rounded-xl">
        <img
          src={productId.pictures[0].url}
          alt={productId.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{productId.name}</h2>
          <p className="text-sm text-gray-500">Category: {productId.catagory.join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
          <p className="text-sm font-bold text-gray-800">₹{order.totalAmount}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <div>
          <p><span className="font-semibold">Buyer:</span> {buyerId.username}</p>
          <p><span className="font-semibold">Email:</span> {buyerId.email}</p>
          <p><span className="font-semibold">Phone:</span> {buyerId.phone}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Address:</span> {buyerId.address}</p>
          <p><span className="font-semibold">Ordered:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><span className="font-semibold">Delivery:</span> {new Date(order.deliveryDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            order.isCancelled
              ? 'bg-red-100 text-red-600'
              : order.status === 'Delivered'
              ? 'bg-green-100 text-green-600'
              : order.status === 'Shiped'
              ? 'bg-blue-100 text-blue-600'
              : order.status === 'Packed'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {order.isCancelled ? 'Cancelled' : order.status}
        </span>

        <div className="flex gap-2">
          {!order.isCancelled && order.status != 'Delivered' && (
            <>
            {
              !state &&
              <button onClick={()=>setState(true)} className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Update Status
              </button>
            }
            {
              !date && 
            <button onClick={()=>setDate(true)} className="text-sm px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Update Date
            </button>
            }
            </>
          )}
          {order.status === 'Placed' && !order.isCancelled && (
            <button onClick={handleCancel} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
              Cancel Order
            </button>
          )}
        </div>
      </div>

        {
          state && 
          <>
            <div className="stateupdate flex justify-between items-center">
                <label htmlFor="state" className="text-gray-400">Select the new state:</label>
                <select name="state" onChange={handelChange} value={dataToUpdate.state} className="border p-2 w-1/3 text-gray-500 border-gray-400 rounded" id="state">
                  <option value="Placed">Placed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              <button onClick={handelUpdate} className="rounded bg-green-100 p-2 text-green-600">Update</button>
              <IconButton onClick={()=>setState(false)} color="primary" aria-label="add to shopping cart">
                <HighlightOffRoundedIcon/>
              </IconButton>
            </div>
            {
              otp &&
            <div className="flex item-center justify-between text-gray-400">
              <label htmlFor="otp">Otp from Buyer:</label>
              <input type="number" name="otp" placeholder="Please enter the otp that buyer has"  onChange={handelChange} value={dataToUpdate.otp} className={"border  p-2 rounded-lg w-2/3 " + (otpColor ? "border-blue-600 bg-blue-100 text-blue-600": "border-red-600 bg-red-100 text-red-600 ")} />
            </div>
            }
          </>
        }

        {
          date && 
          <>
            <div className="stateupdate flex justify-between items-center">
                <label htmlFor="state" className="text-gray-400">Select the new state:</label>
                <input type="Date" onChange={handelChange} name="deliveryDate" value={dataToUpdate.deliveryDate} className="border p-2 w-1/3 text-gray-500 border-gray-400 rounded" id="state"></input>
              <button onClick={handelUpdate} className="rounded bg-green-100 p-2 text-green-600 mx-1">Update</button>
              <IconButton onClick={()=>setDate(false)} color="primary" aria-label="add to shopping cart">
                <HighlightOffRoundedIcon/>
              </IconButton>
            </div>
          </>
        }

        {
      ask &&
      <Confirm text={ask.text} fun={ask.fun} cancel={setAsk}></Confirm>
    }
      
    </div>
  );
}

export {SellerOrderCard}