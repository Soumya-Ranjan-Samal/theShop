import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { ButtonGroup, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Tooltip, { tooltipClasses }  from '@mui/material/Tooltip';
import {useNavigate} from 'react-router-dom'
import Confirm from "./confirm";
import axios from 'axios';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
}));

function CartItemCard({ item, Data, setData }) {

  
    let [ask,setAsk] = useState();
    const navigate = useNavigate();


  const increaseQty = ()=>{
    if(item.count < item.Available){
      let data = Data.map((el)=> el._id == item._id ? {...el,count : el.count + 1} : el);
      setData(data);
    }
  }

  const decreaseQty = ()=>{
    if(item.count > 1){
      let data = Data.map((el)=> el._id == item._id ? {...el,count : el.count - 1} : el);
      setData(data);
    }
  }

  

  const handleBuy = () => {
    const req = async ()=>{ 
      await axios.post(`http://localhost:3000/order/${item._id}/${item.count}`,{},{
        headers: {
          Authorization: `bearer ${localStorage.getItem('mytoken')}`
        }
      }).then((res)=>{
        console.log(res);
        if(res.status == 200){
          alert('Order placed successfuly');
          setData(Data.filter((el)=> el._id != item._id))
        }else{
          alert('Something went wrong try latter!');
        }
      }).catch((error)=>{
        console.log(error)
        alert('Something went wrong');
      })
    }
    setAsk({
      text: "Great choice, Should we place order "+ item.name +" now",
      fun: req,
    });
  };

  const handelDiscard = () => {
    const req = async ()=>{ 
      await axios.delete(`http://localhost:3000/user/cart/${item._id}/remove`,{
        headers: {
          Authorization: `bearer ${localStorage.getItem('mytoken')}`
        }
      }).then((res)=>{
        if(res.status == 200){
          alert('Item is removed');
          setData(Data.filter((el)=> el._id != item._id));
        }else{
          alert('Something went wrong try latter!');
        }
      }).catch((error)=>{
        console.log(error)
        alert('Something went wrong');
      })
    }
    setAsk({
      text: "Are you sure to remove "+ item.name +" from your cart",
      fun: req,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6  my-6 flex flex-col md:flex-row gap-6">
      
      <div className="w-[240px] h-[240px] bg-gray-100 rounded-xl hover:shadow-2xl flex items-center justify-center">
        <img
          src={item.pictures[0]}
          alt={item.name}
          className="object-contain w-full h-full p-4"
        />
      </div>

      <div className="flex-grow text-gray-800 flex flex-col justify-between">
        <div>
          <h2 className="text-1xl font-bold mb-2">{item.name}</h2>
          <p className="text-sm text-gray-500 mb-1">Sold by: <span className="font-medium">{item.ProductSheller}</span></p>
          <p className="text-sm text-gray-500 mb-1">Available: <span className="font-medium">{item.Available}</span></p>
          <p className="text-sm text-gray-500 mb-1">Offer: <span className="font-medium">{item.Offer}% off</span></p>
          <p className="text-xl font-semibold text-green-600 mt-2">₹ {((item.price * item.count * (100 - item.Offer)) / 100).toFixed(2)} <span className='text-gray-900'>for {item.count} items</span></p>
          <p className="mt-4 text-sm text-gray-500">{item.review.length} reviews</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >−</button>
            <span className="text-lg font-medium">{item.count}</span>
            <button
              onClick={increaseQty}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >+</button>
          </div>
          <ButtonGroup  variant="contained" className="w-[70%]  bg-black p-[2px]" aria-label="Basic button group">
                <LightTooltip  title='Make a order'>
                  <Button sx={{backgroundColor: "silver", color: "black", width: "80%", }} onClick={handleBuy} endIcon={<ShoppingBagIcon/>} >Buy</Button>
                </LightTooltip >
                <LightTooltip  title='remove from cart'>
                  <Button sx={{backgroundColor: "silver", color: "red", width: "20%", }} onClick={handelDiscard} >
                    <ClearRoundedIcon/>
                  </Button>
                </LightTooltip >
          </ButtonGroup>
        </div>
      </div>
      {
        ask &&
        <Confirm text={ask.text} fun={ask.fun} cancel={setAsk}></Confirm>
      }
    </div>
  );
}

export { CartItemCard };