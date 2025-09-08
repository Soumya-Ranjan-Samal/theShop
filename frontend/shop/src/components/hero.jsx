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
        <div className="main p-2">
            { catagory.map((el)=>{
                return (
                    <>
                        <h1 className="text-xl font-bold p-1 text-center text-white  rounded">{el}</h1>
                        <div className="flex flex-wrap bg-[rgba(255,255,255,1)] rounded-3xl p-2">
                        {
                            Data.filter((e)=>{ return e.catagory.indexOf(el) != -1 }).map((one)=>{
                                return (
                                    <>
                                        <div
                                            onClick={() => goto(one._id)}
                                            className="relative w-60 h-60 m-4 hover:scale-110 transition-transform duration-300 rounded-3xl overflow-hidden border border-gray-300 hover:border-white cursor-pointer group hover:shadow-lg"
                                        >
                                        <img
                                            src={one.pictures[0]}
                                            alt="Product"
                                            className="w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-white bg-opacity-80 text-gray-800 p-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center">
                                            <p className="font-semibold text-md">
                                                {one.name}
                                            </p>
                                            <p className="text-sm mt-1">Price: ₹{one.price}/-</p>
                                        </div>
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