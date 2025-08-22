import {  useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderCard from "./ordercarduser";
import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";



function OrderDash() {

    let navigate = useNavigate();

    let [Data,setData] = useState([]);
    let refreshOrders = null;

    useEffect(()=>{
        let getData = async ()=>{
            await axios.get("http://localhost:3000/order",{
                headers: {
                    Authorization: `barear ${localStorage.getItem('mytoken')}`
                }
            }).then((result)=>{
                if(result.data.data.expiredAt){
                    alert("do log in first");
                    return
                }
                setData(result.data.data);
            }).catch((error)=>{
                alert(error);
            });
        }
        getData();
        refreshOrders=getData;
    },[])


    return (
         <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 text-2xl text-white ">My Orders</span>
                <div className="w-1/3" ></div>
            </div>
            <div className=" row2 md:flex-row flex flex-wrap flex-col gap-4 p-4 w-full justify-evenly">
                {
                    Data.length == 0 &&
                    <h1 className="text-gray-900 font-bold text-4xl">Nothing has been ordered!</h1>
                }
                {
                    Data.length>0 && 
                    Data.map((el,index)=><OrderCard key={el._id} order={el} refreshOrders={refreshOrders}></OrderCard>)
                }
            </div>
         </div>
    )
  }
  
  export default OrderDash;
  
