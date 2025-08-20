import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import CartItem from "./cartitems.jsx";
import CartSummary from "./cartsummery.jsx";
import "../App.css";
import axios from "axios";



function Cartbody() {

    let navigate = useNavigate();
    let [Data,setData] = useState();

    useEffect(()=>{
        let getData = async ()=>{
            await axios.get("http://localhost:3000/user/cart",{
                headers: {
                    Authorization: `barear ${localStorage.getItem('mytoken')}`
                }
            }).then((result)=>{
                if(result.data.data.expiredAt){
                    alert("do log in first");
                    return
                }
                setData([...result.data.data.cart]);
            }).catch((error)=>{
                alert(error);
            });
        }
        getData();
    })


    return (
         <div className="main">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 text-2xl text-white ">Shopping Cart</span>
                <div className="w-1/3" ></div>
            </div>
            <div className="row2 flex">
                <div className="col1">
                    {
                        Data.map((el)=>{
                            return  <CartItem item={el}></CartItem>
                        })
                    }
                </div>
            </div>
         </div>
    )
  }
  
  export default Cartbody;
  