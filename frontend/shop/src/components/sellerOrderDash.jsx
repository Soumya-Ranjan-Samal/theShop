import {  useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import { SellerOrderCard } from "./sellerOrderCard";
import axios from "axios";

function SellerOrderDash(){

    const [Data, setData] = useState();
    const [ordersData, setOrdersData] = useState();
    const [filter, setFilter] = useState('Pendings') 

    useEffect(()=>{
            const req = async ()=>{
                await axios.get('http://localhost:3000/seller/account/orders',{
                    headers: {
                        Authorization: `bearer ${localStorage.getItem('mytoken')}`,
                    }
                }).then((result)=>{
                    if(result.data.state == false){
                        alert(result.data.message);
                        return; 
                    }
                    setData(result.data.data);
                    setOrdersData(result.data.data.orders);
                }).catch((error)=>{
                    allert(error);
                });
            }
            req()
        },[]);

    function greetings(){
        let time = Date(Date.now()).split(' ')[4].split(":")[0];
        if(time>0 && time< 12)
            return "Good Morning "
        else if(time > 12 && time < 16)
            return "Good Afternoon "
        else
            return "Good Evening "
    }

    function handelChange(el){
        setFilter(el.target.value);
    }


    return (
        <>
        <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold md:w-1/3 w-3/4 md:text-3xl text-xl text-white mt-2">{greetings()} {Data?.username?.split(' ')[0]}, Here are the orders for you products</span>
                <div className="w-1/3" ></div>
            </div>

            <div className=" md:w-1/2 w-full m-4 flex justify-around  rounded-full">
                <button value={"Pendings"} onClick={handelChange} className={ "p-2 border border-white w-1/3 rounded-l-full hover:text-yellow-500 hover:shadow-xl shadow-yellow-500" + (filter == 'Pendings' ? ' bg-white text-black' : ' bg-black text-white' )} >Pendings</button>
                <button value={"Delivered"} onClick={handelChange} className={ "p-2 border border-white w-1/3 hover:text-blue-500 hover:shadow-xl shadow-blue-500" + (filter == 'Delivered' ? ' bg-white text-black' : ' bg-black text-white' )}>Delivered</button>
                <button value={"Canceled"} onClick={handelChange} className={ "p-2 border border-white w-1/3 hover:text-red-500 rounded-r-full hover:shadow-xl shadow-red-500" + (filter == 'Canceled' ? ' bg-white text-black' : ' bg-black text-white' )}>Canceled</button>
            </div>
            
            <div className="data mt-20 flex flex-col md:flex-row flex-wrap justify-evenly w-full">
                    {   
                        filter == "Pendings" &&
                        ordersData?.filter((el)=>el.status != "Delivered" && !el.isCancelled ).map((el)=>{
                            return <SellerOrderCard order={el}  setAllOrder={setOrdersData}></SellerOrderCard>
                        })
                    }
                    {   
                        filter == "Delivered" &&
                        ordersData?.filter((el)=>el.status == "Delivered" && !el.isCancelled ).map((el)=>{
                            return <SellerOrderCard order={el}  setAllOrder={setOrdersData}></SellerOrderCard>
                        })
                    }
                    {   
                        filter == "Canceled" &&
                        ordersData?.filter((el)=> el.isCancelled ).map((el)=>{
                            return <SellerOrderCard order={el}  setAllOrder={setOrdersData}></SellerOrderCard>
                        })
                    }
            </div>
        </div>
        </>
    )
}

export {SellerOrderDash};