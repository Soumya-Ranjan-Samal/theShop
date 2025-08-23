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
    let refreshOrders = null;

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
        refreshOrders=getData;
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
                <span className="name2 font-bold w-1/3 md:text-3xl text-xl text-white mt-2">{greetings()} {Data.username?.split(' ')[0]}</span>
                <div className="w-1/3" ></div>
            </div>
            <div id="scrollBox" className="row2 justify-items-center items-center flex flex-wrap flex-col gap-4 p-4 w-full justify-evenly">
                <Showdata data={Data.email} name={'Email'}></Showdata>
                <Showdata data={Data.phone} name={'Phone'}></Showdata>
                <Showdata data={Data.username} name={'Username'}></Showdata>
                <ModifiableData data={Data.address} name={'Address'}></ModifiableData>
                <ButtonGroup  className="p-2 bg-gray-200 md:w-1/2 w-full ">
                    <Button onClick={()=>navigate('/cart')}  className="bg-gray-200 text-white w-1/2" >See to Cart</Button>
                    <Button onClick={()=>navigate('/orders')} className="bg-gray-200 text-white w-1/2" >See My Order</Button>
                </ButtonGroup>
            </div>
         </div>
    )
  }
  
  export default UserAccountPage;
  
