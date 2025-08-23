import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import "../App.css"
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";

function Navbar() {

    const [navCol, setNavCol] = useState('bg-[rgba(248,248,248,0.5)] shadow-lg');
    const [personState,setPersonState] = useState("");
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

    let check = async ()=>{
      await axios.get(`http://localhost:3000/check/person/state`,{
        headers: {
          Authorization: `bearer ${localStorage.getItem('mytoken')}`
        }
      }).then((data)=>{
        setPersonState(data.data.state)
      }).catch((error)=>{
        console.log(error);
      });
    }
    check();

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

                  {
                     personState=='User' &&
                    <>
                      <a  className="navop" onClick={()=>navigate('/user/account')} >Account</a>
                    </>
                  }
                  

                  {
                    personState == 'User' &&
                    <>
                      <a  className="navop" onClick={()=>{navigate('/cart')}}>Cart</a>
                      <a  className="navop" onClick={()=>{navigate('/orders')}}>My Order</a>
                    </>
                  }

                  {
                    personState == '' &&
                    <>
                      <a  className="navop" onClick={()=>{navigate('/sign')}}>Sign up</a>
                    </>
                  }
               
              <a href="" className="navop">Search</a>
            </div>
            <div className="other w-1/3 grid grid-flow-col justify-items-end">
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