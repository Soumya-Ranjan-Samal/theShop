import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import Signbuyer from "../components/signBuyer";
import Signseller from "../components/signSeller";
import "../App.css"

function SignUpAndIn(){

    let location = useLocation();
    let returnPath = location.state?.from;

    let [sign,setSign] = useState(false);


    return (
        <>
            <div className= "signBackground h-[100dvh] bg-gray-500">
                <div className="row1 flex justify-center mb-6">
                <div className="topbut m-6 md:w-[40%] w-[80%] ">
                    <ButtonGroup variant="contained" sx={{borderRadius: "10rem"}} className="w-[100%]" aria-label="Basic button group">
                            <Button sx={{backgroundColor: sign?"black":"white", color: sign?"white":"black", width: "50%", borderRadius: "10rem"}} endIcon={<AddCircleOutlineRoundedIcon/>} onClick={()=>{setSign(false)}}  >I am here for Shopping</Button>
                            <Button sx={{backgroundColor: sign?"white":"black", color: sign?"black":"white", width: "50%", borderRadius: "10rem"}}  endIcon={<CheckCircleOutlineRoundedIcon/>} onClick={()=>{setSign(true)}} >I am here for Selling</Button>
                    </ButtonGroup>
                </div>
                </div>
                {
                    !sign &&
                <div className="signarea">
                        <Signbuyer returnPath={returnPath} />
                    <div className="text-center">
                        <ShoppingCartRoundedIcon sx={{fontSize: "20rem", color: "white"}}/>
                        <i><div className="text-white font-bold text-lg">
                            <p>Welcome to The Shop</p>
                            <p>Buy any product of any catagory from anywhere any time with greate deals</p>
                        </div></i>
                    </div>
                </div>
                }
                
                {
                    sign && 
                    <div className="signarea2">
                        <Signseller returnPath={returnPath} />
                        <div className="text-center">
                            <StoreRoundedIcon sx={{fontSize: "20rem", color: "white"}}/>
                            <i>
                                <div className="text-white font-bold text-lg">
                                    <p>Welcome to The Shop</p>
                                    <p>Sell any product of any catagory from anywhere any time with greate deals</p>
                                </div>
                            </i>
                        </div>
                    </div>
                } 
            </div>
        </>
    )
}

export default SignUpAndIn;