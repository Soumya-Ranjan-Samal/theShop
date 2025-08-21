import { data, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from "react";
import { CartItemCard } from "./cartitems";
import { CartTotalCard } from "./carttotalcard";
import "../App.css";
import axios from "axios";



function Cartbody() {

    let navigate = useNavigate();

    let [Data,setData] = useState([]);

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
                let val = result.data.data.cart;
                val.map(element => {
                    element.count = 1
                });
                setData(val);
            }).catch((error)=>{
                alert(error);
            });
        }
        getData();
    },[])


    return (
         <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 text-2xl text-white ">Shopping Cart</span>
                <div className="w-1/3" ></div>
            </div>
            <div className="row2 md:flex-row flex flex-col  w-full justify-evenly">
                <div className="col1 p-4">
                    {
                        Data.map((el)=>{
                            return  <CartItemCard key={el._id} Data={Data} item={el} setData = {setData}></CartItemCard>
                        })
                    }
                </div>
                <div className="col2 h-full md:w-1/3 w-[95%] m-4 rounded-lg  bg-white shadow-md p-4 sticky top-40">
                    <CartTotalCard data = {Data}  setData={setData} />
                </div>
            </div>
         </div>
    )
  }
  
  export default Cartbody;
  