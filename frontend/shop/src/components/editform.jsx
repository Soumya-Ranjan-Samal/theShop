import { useState, useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Confirm from "./confirm";
import axios from "axios";
import "../App.css";

function Addform(){
    const navigate = useNavigate();
    let params = useParams();

    let [picarray, setPicarray] = useState([]);
    let [specsArr, setspecsArr] = useState([]);
    let [cat,setCat] = useState([]);
    let [data,setData] = useState({
        name: "",
        price: 100,
        Available: 0,
        ProductSheller: "",
        Offer: ""
    });
    let [ask,setAsk] = useState();

    let catagory = ["Electronics", "Fashion", "Home & Kitchen", "Health & Wellness", "Toys & Kids", "Books & Stationery", "Automobile Accessories", "Sports & Outdoor", "Pet Supplies"];

    useEffect(()=>{
        let getData = async ()=>{
                await axios.get("http://localhost:3000/products/"+params.id+"/edit",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mytoken')}`
                }
            }).then((res)=>{
                console.log(res);
                    setData({...res.data});
                    setspecsArr([...res.data.specifications]);
                    setCat([...res.data.catagory]);
                    setPicarray([...res.data.pictures]);
                }).catch((error)=>{
                        alert(error.response.data.message);
                });
            }
            getData();
    },[])

    function handelimagequantity(el){
        let val = el.target.value;
        let arr = picarray.splice(0,el.target.value);
        for(let i=arr.length;i<val;i++){
            arr.push("");
        }
        setPicarray(arr);
    }

    function handelSpecsQuantity(el){
        let val = el.target.value;
        let arr = specsArr.splice(0,el.target.value);
        for(let i=arr.length;i<val;i++){
            arr.push("");
        }
        setspecsArr(arr);
    }

    function handelCatChange(el){
        setCat([...cat,el.target.value]);
    }

    function handelCatdelete(val){
        let arr = cat.filter((el)=>el!=val)
        setCat(arr);
    }

    function handelChange(el){
        let name = el.target.name;
        let value = el.target.value;
        setData({...data,[name]: value});
    }

    function handelimageChange(el){
        let arr = [...picarray]
        arr[parseInt(el.target.name)] = el.target.value;
        setPicarray(arr);
    }

    function handelSpecsChange(el){
        let arr = [...specsArr]
        arr[parseInt(el.target.name)] = el.target.value;
        setspecsArr(arr);
    }

    function handelSubmit(){
        let send = async ()=>{
            await axios.patch("http://localhost:3000/products/"+data._id,{
                ...data,
                pictures: picarray,
                specifications:  specsArr,
                catagory: cat
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mytoken')}`
                }
            }).then((res)=>{
                    navigate("/detail/"+data._id);
            }).catch((error)=>{
                console.log(error);
            });
        }
        setAsk({
            text: "Are you sure to do this update",
            fun: send,
        })
    }

    return (
        <>
            <div className="main min-h-[95dvh] text-white">
                <div className="head flex">
                <div><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <h1 className="text-2xl font-bold p-4">EDIT PRODOCT DETAILS</h1>
                </div>
                <form action="" className="border m-4 text-lg font-semibold border-white rounded-lg p-6">
                    <div className="row1 flex">
                        <div className="col1  w-1/3 flex flex-col">
                            <lable>Name of the product <span className="text-red-500">*</span></lable>
                            <input type="text" name="name" value={data.name} onChange={handelChange} className="inputstyle my-2 mr-2" />
                        </div>
                        <div className="col2 w-1/3 flex flex-col">
                            <lable>Product price in rupees <span className="text-red-500">*</span></lable>
                            <input type="number" min={100} name="price" value={data.price} onChange={handelChange}  className="inputstyle my-2 mr-2" />
                        </div>
                        <div className="col3 w-1/3 flex flex-col">
                            <lable>Available quantity <span className="text-red-500">*</span></lable>
                            <input type="number" name="Available" value={data.Available} onChange={handelChange}  className="inputstyle my-2" />
                        </div>
                    </div>

                    <hr className="my-6 text-black" /> 

                    <div className="row2 mt-2 flex justify-between">
                        <div className="col1">
                            <label htmlFor="picq">Number of Pictures</label>
                            {
                                picarray.length &&
                                <input type="number" min={0} max={10} defaultValue={picarray.length} onChange={handelimagequantity} className="inputstyle mx-2"/>
                            }
                        </div>
                        <div className="col2 flex flex-col w-1/3">
                            <label htmlFor="picq">Any Offer / Discount</label>
                            <input type="number" min={0} max={80} name="Offer" value={data.Offer} onChange={handelChange}  className="inputstyle mx-2"/>
                        </div>
                    </div>

                    <div className="row3 flex flex-col">
                        {
                            picarray.map((el,index)=>{
                                return (
                                    <>
                                        <div className="w-2/3 flex flex-col">
                                                <span>image {index+1} : </span>
                                                <input type="text" name={""+index} value={el} onChange={handelimageChange} className="imagefield inputstyle" />
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                    
                    <hr className="my-6 text-black" /> 

                    <div className="row4 my-2 flex ">
                        <div className="col1 w-1/3">
                            <label htmlFor="">Number of Specificating </label>
                            {
                                specsArr.length &&
                                <input type="number" className="inputstyle" defaultValue={specsArr.length} onChange={handelSpecsQuantity}  />
                            }
                        </div>
                        <div className="col2 w-2/3">
                            {
                                specsArr.map((el,index)=>{
                                    return (
                                        <>
                                            <div>
                                                <span>specs {index+1} : </span>
                                                <input type="text" value={el} name={index} onChange={handelSpecsChange}   className="specfield inputstyle m-2 w-[80%]" />
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>


                        <hr className="my-6 text-black" /> 

                    <div className="row5 flex">
                        <div className="col1">
                            <label htmlFor="">Select Product catagory </label>
                                <select name="catagory" className="inputstyle" onChange={handelCatChange} id="">
                                    <option value="">-select-</option>
                                    {
                                        catagory.map((el)=>{
                                            return (
                                                <>
                                                    <option value={el} className="bg-black text-white">{el}</option>
                                                </>
                                            )
                                        })
                                    }
                                </select>
                        </div>

                        <div className="col2">
                                    {
                                        cat.map((el)=>{
                                            return (
                                                <>
                                                    <Chip
                                                        sx={{margin: "5px"}}
                                                        label={el}
                                                        variant="outlined"
                                                        onDelete={()=>handelCatdelete(el)}
                                                    />
                                                </>
                                            )
                                        })
                                    }
                        </div>
                    </div>

                        <hr className="my-6 text-black" /> 

                    <div className="row6 flex justify-between">
                        <div className="col1">
                                    <label htmlFor="">Product Seller </label>
                                    <input type="text" name="ProductSeller" value={data.ProductSheller}  onChange={handelChange}  className="inputstyle ml-2" />
                        </div>
                        <div className="col2">
                                    <Button onClick={handelSubmit} variant="contained" sx={{backgroundColor: "white", color: "black",borderRadius: "10px", border: "10px solid black"}}>UPDATE</Button>
                        </div>
                    </div>
                </form>
                {
                    ask &&
                    <Confirm text={ask.text} fun={ask.fun} cancel={setAsk}></Confirm>
                }
            </div>
        </>
    )
}

export default Addform;