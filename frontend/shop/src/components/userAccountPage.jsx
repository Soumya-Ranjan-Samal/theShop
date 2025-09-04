import {  useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { Showdata } from "./showdata";
import { ModifiableData } from "./modifiableData";
import { Button, ButtonGroup } from "@mui/material";



function UserAccountPage() {

    let navigate = useNavigate();

    let [Data,setData] = useState([]);

    useEffect(()=>{
        let getData = async ()=>{
            await axios.get("http://localhost:3000/user/account",{
                headers: {
                    Authorization: `barear ${localStorage.getItem('mytoken')}`
                }
            }).then((result)=>{
                if(result.data.state == false){
                    alert(result.data.message);
                    return;
                }
                console.log(result.data.data);
                setData(result.data.data);
            }).catch((error)=>{
                alert(error);
            });
        }
        getData();
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

    return (
         <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 md:text-1xl text-xl text-white mt-2">{greetings()} {Data.username?.split(' ')[0]}</span>
                <div className="w-1/3" ></div>
            </div>
            <div id="scrollBox" className="row2 text-sm justify-items-center items-center flex flex-wrap flex-col gap-4 p-4 w-full justify-evenly">
                <Showdata data={Data.email} name={'Email'}></Showdata>
                <Showdata data={Data.phone} name={'Phone'}></Showdata>
                <Showdata data={Data.username} name={'Username'}></Showdata>
                <ModifiableData data={Data.address} name={'Address'}></ModifiableData>
                <Showdata data={Data.cart?.length} name={'Items in Cart'}></Showdata>
                <Showdata data={Data.order?.length} name={'Items Ordered'}></Showdata>
                <ButtonGroup  className="p-2 bg-gray-200 md:w-1/2 w-full ">
                    <Button onClick={()=>navigate('/cart')}  className="bg-gray-200 text-white w-1/2" >See to Cart</Button>
                    <Button onClick={()=>navigate('/orders')} className="bg-gray-200 text-white w-1/2" >See My Order</Button>
                </ButtonGroup>
                <Button onClick={()=>{localStorage.removeItem('mytoken');navigate('/sign')}} class=" transition-all delay-200 duration-700 bg-white hover:text-white hover:bg-red-500 hover:border-white rounded-xl border border-red-500 p-2 text-red-500 md:w-1/6" >Sign Out</Button>
            </div>
         </div>
    )
  }
  
  export default UserAccountPage;
  
