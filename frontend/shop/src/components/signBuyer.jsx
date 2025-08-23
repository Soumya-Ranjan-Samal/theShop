import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"

function Signbuyer(props){
    let [sign,setSign] = useState(true);
    let phonetype = ["+91", "+82", "+76", "+45", "+6"];
    let navigate = useNavigate();
    let [verify,setVerify] = useState({
        email: null,
        phone: null,
    }) 
    let [form,setForm] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        phoneOtp: null,
        emailOtp: null,
    });

    let transition = ()=>{
        let card = document.querySelector(".signCardForBuyers");
        card.style.left = "-110%";
        setTimeout(()=>{
            setSign(sign? false : true);
            card.style.left = "0";
        },1000);
    }

    let sendEmailOtp = ()=>{
        let request = async ()=>{
            await axios.post("http://localhost:3000/otp/email",{
                email: form.email,
            }).then((res)=>{
                console.log(res);
            }).catch((error)=>{
                console.log(error);
            });
        }
        request();
    }

    let sendPhoneOtp = ()=>{
        let request = async ()=>{
            await axios.post("http://localhost:3000/otp/phone",{
                phone: form.phone,
            }).then((res)=>{
                console.log(res);
            }).catch((error)=>{
                console.log(error);
            });
        }
        request();
    }

    let verifyEmail = ()=>{
        let request = async ()=>{
            await axios.post("http://localhost:3000/verify/email",{
                email: form.email,
                emailOtp: form.emailOtp
            }).then((res)=>{
                if(res.data == "correct"){
                    setVerify({...verify, email: true});
                    setForm({...form, emailOtp: true});
                }else{
                    setVerify({...verify, email: false});
                    setForm({...form, emialOtp: false});
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
        request();
    }

let verifyPhone = ()=>{
    let request = async ()=>{
        await axios.post("http://localhost:3000/verify/phone",{
            phone: form.phone,
            phoneOtp: form.phoneOtp
        }).then((res)=>{
            if(res.data == "correct"){
                setVerify({...verify, phone: true});
                setForm({...form, phoneOtp: true});
            }else{
                setVerify({...verify, phone: false});
                setForm({...form, phoneOtp: true});
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
    request();
}

    let signUp = ()=>{
        let request = async ()=>{
            await axios.post("http://localhost:3000/user/signup",{
                ...form
            }).then((res)=>{
                if(res.data.state == true){
                    localStorage.setItem("mytoken",res.data.token);
                    navigate(props.returnPath ? props.returnPath : "/");
                }
                alert(res.data.message);
            }).catch((error)=>{
                prompt("Something wrong");
            });
        }
        request();
    }

    let signIn = ()=>{
        let request = async ()=>{
            await axios.post("http://localhost:3000/user/signin",{
                ...form
            }).then((res)=>{
                if(res.data.state == true){
                    localStorage.setItem("mytoken",res.data.token);
                    navigate(props.returnPath ? props.returnPath : "/");
                }
                alert(res.data.message);
            }).catch((error)=>{
                prompt("Something wrong");
            });
        }
        request();
    }

    let updatefun = (el)=>{
        setForm({...form, [el.target.name]: el.target.value})
    }

    return (
        <>
            <div className="signCardForBuyers bg-white p-6 md:w-1/3 w-full rounded-lg flex flex-col items-center justify-center">
                <h1 className="text-lg font-bold">{sign? "Sign Up" : "Sign In"}</h1>
                {
                    sign &&
                    <>
                    <div className="row1 w-full flex flex-col m-2">
                        <TextField id="standard-basic" name='username' value={form.username} onChange={updatefun} label="Your Full Name" variant="standard" />
                    </div>
                <div className="row2 w-full flex md:flex-row flex-col items-center justify-center  m-2">
                    <TextField
                        id="standard-select-currency"
                        select
                        defaultValue="+91"
                        variant="standard"
                        className='w-[18%]'
                        sx={{marginTop: "1rem"}}
                        >
                    {phonetype.map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                    </TextField>
                    <TextField  className="w-[80%]" id="standard-basic" name='phone'  value={form.phone} onChange={updatefun} label="Your Phone Number" variant="standard" />
                </div>
                
                <div className="row3 flex">
                    <Button variant="outlined" onClick={sendPhoneOtp} sx={{color: "white", backgroundColor: "gray", border: "0px", marginRight: "3px"}} size="small">
                        Send OTP
                    </Button>
                    <div>
                        <TextField id="outlined-basic" sx={{backgroundColor: verify.phone != null ? verify.phone ? "green": "red" : null}} size='small' name="phoneOtp" value={form.phoneOtp} onChange={updatefun} label="Enter Number OTP" variant="outlined" />
                    </div>
                    <Button variant="outlined" onClick={verifyPhone} sx={{color: "gray", border: "1px solid rgba(1,1,1,0.2)", marginLeft: "3px"}} size="small">
                        Verify OTP
                    </Button>

                </div>
                </>
                }
                <div className="row4 w-full flex flex-col m-2">
                    <TextField id="standard-basic" name='email' value={form.email} onChange={updatefun} label="Your Email Id" variant="standard" />
                </div>
                {
                    sign &&
                <>
                <div className="row5 flex">
                    <Button variant="outlined" onClick={sendEmailOtp} sx={{color: "white", backgroundColor: "gray", border: "0px", marginRight: "3px"}} size="small">
                        Send OTP
                    </Button>
                    <div>
                        <TextField id="outlined-basic" sx={{backgroundColor: verify.email != null ? verify.email ? "green" : "red" : null}}  name="emailOtp" value={form.emailOtp} onChange={updatefun} size='small' label="Enter Number OTP" variant="outlined" />
                    </div>
                    <Button variant="outlined" onClick={verifyEmail} sx={{color: "gray", border: "1px solid rgba(1,1,1,0.2)", marginLeft: "3px"}} size="small">
                        Verify OTP
                    </Button>
                </div>

                <div className="row6 w-full flex flex-col m-2">
                    <TextField id="standard-basic" label="Your Address for delivery" name='address' value={form.address} onChange={updatefun} variant="standard" />
                </div>
                </>
                }
                <div className="row7 w-full flex flex-col m-2">
                    <TextField id="standard-basic" name='password' value={form.password} onChange={updatefun} label={sign?"Give a Strong Password":"Your Password"} variant="standard" />
                </div>
                <div className="row8 flex flex-col m-2">
                    <Button variant="outlined" sx={{backgroundColor: "black", color: "rgba(255,255,255,0.7)"}} onClick={sign ? signUp : signIn } >{ sign ? "Sign Up" : "Sign In"}</Button>
                    <div>
                        <p>{sign? "Already have an account?": "Don't have an Account?"} <span className='text-blue-400' onClick={transition} >{!sign? "Sign Up" : "Sign In"}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signbuyer;