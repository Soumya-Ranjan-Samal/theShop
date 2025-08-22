import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import "../App.css"
import StorefrontIcon from '@mui/icons-material/Storefront';

function Navbar() {

    const [navCol, setNavCol] = useState('bg-[rgba(248,248,248,0.5)] shadow-lg');
    const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setNavCol('bg-[rgba(0,0,0,0.1)] shadow-xl border-black');
      } else {
        setNavCol('bg-[rgba(248,248,248,0.5)] shadow-xl');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


    return (
      <>
        <div className={"nav z-[10] m-[0.1rem] rounded p-2 flex justify-center content-center "+navCol} >
            <div className="name text-xl font-bold  pl-4 flex justify-baseline pt-1 w-1/3">
              <StorefrontIcon></StorefrontIcon><i>The Shop</i>
            </div>
            <div className="options w-1/3  flex m-2  content-center text-md font-semibold text-white justify-evenly">
                  <a  className="navop" onClick={()=>{navigate('/')}}>Home</a>
                  <a  className="navop">Account</a>
                  <a  className="navop" onClick={()=>{navigate('/cart')}}>Cart</a>
                  <a  className="navop" onClick={()=>{navigate('/orders')}}>My Order</a>
               
              <a href="" className="navop">Search</a>
            </div>
            <div className="other w-1/3">

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