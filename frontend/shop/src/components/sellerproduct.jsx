import {  useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { Showdata } from "./showdata";
import { ProductCard } from "./productCard";
import {AnimatePresence,motion } from 'framer-motion';
import { Button } from "@mui/material";

function SellerProductView(){

    const [Data,setData] = useState([])
    const navigate = useNavigate();
    const [search,setSearch] = useState('')

    useEffect(()=>{
        const req = async ()=>{
            await axios.get('http://localhost:3000/seller/account/products',{
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

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 },
};


    return (
        <>
        <div className="main min-h-dvh">
            <div className="row1 flex justify-evenly">
                <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <span className="name2 font-bold w-1/3 md:text-lg text-md text-white mt-2">{greetings()} {Data?.username?.split(' ')[0]}</span>
                <div className="w-1/3" ></div>
            </div>
            <div id="scrollBox" className="row2 text-xs justify-items-center items-center flex flex-wrap flex-col gap-4 p-4 w-full justify-evenly">
                <div className="b flex flex-col justify-evenly w-full md:flex-row ">
                    <div className="w-1/2 flex justify-between" >
                        <Showdata data={Data?.companyName} name={'Company Name'}></Showdata>
                        <Button onClick={()=>{navigate('/add')}} class="md:mt-0 mt-5 hover:shadow-amber-500 hover:scale-110 hover:shadow-xl transition-all border-2 hover:border-amber duration-400 px-1 py-2 rounded-full md:w-1/3 bg-amber-100 text-amber-600" >Add new Product</Button>
                    </div>
                    <label className="shadow-lg selector flex md:w-1/3 mt-2 md:mt-0 border text-white  rounded-4xl p-2">
                        <input type="text" value={search} onChange={(el)=>setSearch(el.target.value)} className=' w-full m-1' placeholder="Search your product by name" />
                        <div className="log w-28 bg-white text-gray-500 rounded-full p-1">
                            <SearchRoundedIcon sx={{backgroundColor: "white", color:"gray", borderRadius: "50%"}}></SearchRoundedIcon>
                            Search
                        </div>
                    </label>
                </div>

<AnimatePresence>
    <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="data flex flex-col md:flex-row flex-wrap justify-evenly w-full gap-2"
    >
    {Data.products
      ?.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .map((el) => (
        <motion.div
          key={el._id}
          variants={cardVariants}
          layout
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:w-[33%] w-full"
        >
          <ProductCard data={el} />
        </motion.div>
      ))}
    </motion.div>
  </AnimatePresence>


            </div>
        </div>
        </>
    )
}

export {SellerProductView}