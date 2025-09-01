import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Hero(){

    const navigate = useNavigate();

    let [Data,setData] = useState([]);
    let catagory = ["Electronics", "Fashion", "Home & Kitchen", "Health & Wellness", "Toys & Kids", "Books & Stationery", "Automobile Accessories", "Sports & Outdoor", "Pet Supplies"]

    useEffect(()=>{
        let getData = async ()=>{
            await axios.get("http://localhost:3000/products/").then((res)=>{
                setData(res.data);
            }).catch((error)=>{
                console.log(error);
            });
        }
        getData();
    },[])

    function goto(id){
        navigate("/detail/"+id);
    }

    return (
        <>
        <div className="main">
            { catagory.map((el)=>{
                return (
                    <>
                        <h1 className="text-2xl font-bold text-white p-2 pl-6">{el}</h1>
                        <div className="hero p-2">
                        {
                            Data.filter((e)=>{ return e.catagory.indexOf(el) != -1 }).map((one)=>{
                                return (
                                    <>
                                        <div onClick={()=>goto(one._id)} className="card text-white font-semibold m-2 w-86 rounded-4xl p-4">
                                            <img className="h-68 m-1 rounded-2xl w-76 image"  src={one.pictures[0]} alt="/none" />
                                            <p>{one.name}</p>
                                            <p>Price: ₹{one.price}/-</p>
                                        </div>
                                    </>
                                )
                            })
                        }
                        </div>
                    </>
                )
            })
            }
        </div>
        </>
    )
}

export default Hero;