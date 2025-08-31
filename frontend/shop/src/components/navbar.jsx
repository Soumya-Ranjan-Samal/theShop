import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import "../App.css"
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AnimatePresence, motion } from "framer-motion";

function Navbar() {

    const [navCol, setNavCol] = useState('bg-[rgba(248,248,248,0.5)] shadow-lg');
    const [personState,setPersonState] = useState("");
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    (window.innerWidth > 500 ? setMenu(true): setMenu(false) )
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setNavCol('bg-[rgba(0,0,0,0.1)] shadow-xl border-black');
      } else {
        setNavCol('bg-[rgba(248,248,248,0.5)] shadow-xl');
      }
    };

    window.addEventListener('scroll', handleScroll);

    let check = async ()=>{
      await axios.get(`http://localhost:3000/check/person/state`,{
        headers: {
          Authorization: `bearer ${localStorage.getItem('mytoken')}`
        }
      }).then((data)=>{
        setPersonState(data.data.state)
        localStorage.setItem('person', data.data.state);
      }).catch((error)=>{
        console.log(error);
      });
    }
    check();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    return (
      <>
        <div className={ ( menu && window.innerWidth<500 ? 'h-36': 'h-16') + " md:h-full transition-all duration-300 nav z-[10] m-[0.1rem] rounded p-2 flex md:justify-center md:content-center "+navCol} >
            <div className="name md:text-xl font-bold  pl-4 md:m-0 m-2 flex justify-baseline pt-1 md:w-1/3 w-1/2">
              <StorefrontIcon></StorefrontIcon><i>The Shop</i>
            </div>

            <div onClick={()=>setMenu(menu ? false : true )} className="menu md:opacity-0 fixed top-2 left-[85%] bg-white rounded-full p-2">
              {menu ? <CloseRoundedIcon></CloseRoundedIcon> : <MenuRoundedIcon></MenuRoundedIcon>}
            </div>

            {
              menu &&
              <div className={ "options md:w-1/3 w-[50%] md:me-[0%] mr-[40%] flex md:flex-row  flex-col m-2  content-center md:text-md font-semibold text-white justify-evenly"}>
                  <a  className="navop" onClick={()=>{navigate('/')}}>Home</a>

                  {
                    personState=='Seller' &&
                    <>
                      <a  className="navop" onClick={()=>navigate('/seller/account')} >Account</a>
                      <a  className="navop" onClick={()=>{navigate('/seller/products')}}>My Products</a>
                      <a  className="navop" onClick={()=>{navigate('/seller/orders')}}>Orders</a>
                    </>
                  }
                  

                  {
                    personState == 'User' &&
                    <>
                      <a  className="navop" onClick={()=>navigate('/user/account')} >Account</a>
                      <a  className="navop" onClick={()=>{navigate('/cart')}}>Cart</a>
                      <a  className="navop" onClick={()=>{navigate('/orders')}}>My Order</a>
                    </>
                  }

                  {
                    personState == '' &&
                    <>
                      <a  className="navop" onClick={()=>{navigate('/sign')}}>Sign up</a>
                      <a  className="navop" onClick={()=>{navigate('/sign')}}>Sign In</a>
                    </>
                  }
               
              <a href="" className="navop">Search</a>
            </div>
            }
            <div className="other md:relative fixed top-[-10%] w-1/3 grid grid-flow-col justify-items-end">
                  {
                    personState != '' &&
                    <>
                      <a onClick={()=>{localStorage.removeItem('mytoken');setPersonState('')}}  className=" rounded-xl px-2 py-2 bg-red-600 opacity-30 hover:opacity-100 border border-red-600 hover:border-white text-white font-bold">Sign Out</a>
                    </>
                  }
            </div>
        </div>
      </>
    )
  }
  
  export default Navbar
  

  {/* <div className="name text-white w-1/3 text-3xl font-bold m-2">
                The Shop /-
            </div> */}
            {/* <div className="search w-1/3  bg-gray-200 flex rounded-4xl ">
                <input id="search" className="bg-gray-200 rounded-4xl w-full p-4" type="text" />
                <label htmlFor="search" className=" bg-gray-500 m-[0.2rem] text-white text-xl rounded-full p-2">GO!</label>
            </div> */}