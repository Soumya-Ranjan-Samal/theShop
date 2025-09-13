import {  useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { Showdata } from "./showdata";
import { ModifiableData } from "./modifiableData";
import { Button } from "@mui/material";
import Rendering from "./rendering";

function SellerAccountPage(){

    let navigate = useNavigate();
    const [Data,setData] = useState();
    const [render, setRender] = useState(false);

    useEffect(()=>{
        setRender(true);
        const req = async ()=>{
            await axios.get('http://localhost:3000/seller/account',{
                headers: {
                    Authorization: `bearer ${localStorage.getItem('mytoken')}`,
                }
            }).then((result)=>{
                if(result.data.state == false){
                    alert(result.data.message);
                    return;
                }
                console.log(result.data.data);
                setData(result.data.data);
                setRender(false);
            }).catch((error)=>{
                allert(error);
                setRender(false);
            });
        }
        req()
    },[]);

    function update(el){
        const reqest = async ()=>{
            await axios.patch(`http://localhost:3000/seller/account/${el.target.title}`, Data,
                {
                    headers: {
                        Authorization: `bearer ${localStorage.getItem('myToken')}`,
                    }
                }
            ).then((res)=>{
                setData(res.data.data);
            }).catch((error)=>{
                alert('Something went wrong, Please try later!');
                console.log(error);
            });
        }
    }

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
        <>
        <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 md:text-lg text-md text-white mt-2">{greetings()} {Data?.username?.split(' ')[0]}</span>
                <div className="w-1/3" ></div>
            </div>
            <div id="scrollBox" className="row2 text-xs justify-items-center items-center flex flex-wrap flex-col gap-4 p-4 w-full justify-evenly">
                <Showdata data={Data?.email} name={'Email'}></Showdata>
                <Showdata data={Data?.phone} name={'Phone'}></Showdata>
                <Showdata data={Data?.username} name={'Username'}></Showdata>
                {
                    Data &&
                    <ModifiableData 
                        data={Data?.companyName}
                        name={'Company Name'}
                        setData={setData}
                        useName={'companyName'}
                        updateFun={update}
                    ></ModifiableData>
                }
                <ModifiableData data={Data?.address} name={'Address'}></ModifiableData>
                <div className="flex w-full md:w-1/2 md:flex-row flex-col  justify-between">
                    <Showdata data={Data?.products.length} name={'Product Selleing'}></Showdata>
                    {/* <Button onClick={()=>{navigate('/add')}} class="md:mt-0 mt-5 hover:bg-blue-600 hover:text-blue-100 hover:scale-110 hover:shadow-lg transition-all border-2 hover:border-white duration-400 px-1 py-2 rounded-lg md:w-1/3 bg-blue-100 text-blue-600" >Add new Product</Button> */}
                    <Button onClick={()=>{navigate('/add')}} class="md:mt-0 mt-5 hover:shadow-amber-500 hover:scale-110 hover:shadow-xl transition-all border-2 hover:border-amber duration-400 px-1 py-2 rounded-full md:w-1/4 bg-amber-100 text-amber-600" >Add new Product</Button>
                </div>
                <Showdata data={Data?.orders.length} name={'Total Order Available'}></Showdata>
                <Button onClick={()=>{localStorage.removeItem('mytoken');navigate('/sign')}} class=" transition-all delay-200 duration-700 bg-white hover:text-white hover:bg-red-500 hover:border-white rounded-xl border border-red-500 p-2 text-red-500 md:w-1/6" >Sign Out</Button>
            </div>
         </div>
         {
            render &&
            <Rendering></Rendering>
         }
        </>
    )
}

export {SellerAccountPage}