import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { formControlClasses, Tooltip } from "@mui/material";
import Rendering from "./rendering";
import Confirm from "./confirm";
import axios from "axios";
import "../App.css";

function Addform(){
    const navigate = useNavigate();

    let [render, setRender] = useState(false);
    let [picarray, setPicarray] = useState([]);
    let [picCount, setPicCount] = useState(0);
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


    let catagory = ["Electronics", "Fashion", "Home & Kitchen", "Health & Wellness", "Toys & Kids", "Books & Stationery", "Automobile Accessories", "Sports & Outdoor", "Pet Supplies"]


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

    function handelImageNumber(el){
        el.preventDefault();
        setPicCount(el => el+1);
    }

   function handelimageChange(element, index) {
    const localUrl = URL.createObjectURL(element.target.files[0]);

    setPicarray(prev => {
        const updated = prev.map(item =>
        item.id === index
            ? { ...item, url: localUrl, data: element.target.files[0] }
            : item
        );

        const exists = updated.some(item => item.id === index);

        return exists
        ? updated
        : [...prev, { id: index, url: localUrl, data: element.target.files[0] }];

    });
    }

    function handelImageDiscard(index){
        console.log(index);
        let field = document.querySelector('#imageFieldCollector');
        Array.from(field.children).forEach(element => {
            if(element.id == index){
                field.removeChild(element);
                setPicarray(el=> el.filter((e)=> e.id != index));
            }
        });
    }

    function handelSpecsChange(el){
        let arr = [...specsArr]
        arr[parseInt(el.target.name)] = el.target.value;
        setspecsArr(arr);
    }


    async function handelImageUpload(file){
        let formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', "theShopFrontendUpload");
        try{
            let res = await axios.post("https://api.cloudinary.com/v1_1/duwup3a7i/image/upload", formData);
            return {
                url: res.data.secure_url,
                publicId : res.data.public_id
            };
        }catch(error){
            console.error("Upload failed:", err);
            return null;
        }
    }

    function handelSubmit(){
        
        let send = async ()=>{
            setRender(true);
            const uploadImage = async ()=>{
                    console.log('here');
                    let uploadedImage = []
                    for(let i of picarray){
                        let url = await handelImageUpload(i.data);
                        console.log(url);
                        if(url){
                            uploadedImage.push(url)
                        }
                    }
                return uploadedImage;
                }

            uploadImage().then(async (uploadedImage)=>{
                await axios.post("http://localhost:3000/products",{
                    ...data,
                    pictures: uploadedImage,
                    specifications:  specsArr,
                    catagory: cat
                },{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('mytoken')}`
                    }
                }).then((res)=>{
                    navigate("/detail/"+res.data._id);
                }).catch((error)=>{
                    console.log(error);
                    setRender(false)
                });
            }).catch((error)=>{
                console.log(error);
                setRender(false)
            });
        }
        setAsk({
            text: "Are you sure to add this product and you commit to provide service for it ?",
            fun: send,
        });
    }


    return (
        <>
            <div className="main min-h-[95dvh]  text-white">
                <div className="head flex">
                <div><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <h1 className="text-xl font-bold p-4">ADD NEW PRODUCT TO SELL</h1>
                </div>
                <form action="" className="border m-4 text-sm font-semibold border-white rounded-lg p-6">
                    <div className="row1 flex md:flex-row flex-col">
                        <div className="col1  md:w-1/4 flex flex-col">
                            <label >Name of the product <span className="text-red-500">*</span></label>
                            <input type="text" id="name" name="name" value={data.name} onChange={handelChange} className="inputstyle my-2 mr-2" />
                        </div>
                        <div className="col2 md:w-1/4 flex flex-col">
                            <label>Product price in rupees <span className="text-red-500">*</span></label>
                            <input type="number" min={100} name="price" value={data.price} onChange={handelChange}  className="inputstyle my-2 mr-2" />
                        </div>
                        <div className="col3 md:w-1/4 flex flex-col">
                            <label>Available quantity <span className="text-red-500">*</span></label>
                            <input type="number" name="Available" value={data.Available} onChange={handelChange}  className="inputstyle my-2" />
                        </div>
                        <div className="col4 flex flex-col md:w-1/4">
                            <label htmlFor="picq">Any Offer / Discount</label>
                            <input type="number" min={0} max={80} name="Offer" value={data.Offer} onChange={handelChange}  className="inputstyle ml-2 my-2"/>
                        </div>
                    </div>

                    <hr className="my-6 text-black" /> 
                    <label htmlFor="image">Add Images of Prodduct</label>

                    <div id="imageFieldCollector" className="row3 flex flex-col">
                        {
                            Array.from({length: picCount}).map((_, index)=>{
                                return (
                                    <div id={index} className="m-2 flex flex-row items-center justify-between md:w-1/3" key={index}>
                                        <input type="file" onChange={(el)=>handelimageChange(el, index)} className="border w-3/4 border-white rounded-xl p-2 inputstyle" />
                                        <img src={picarray[index]?.url} alt="" className="h-10 w-12 rounded-lg border-2 border-white cover" />
                                        <Tooltip placement="right" title='Discard this field'>
                                            <button className="border-2 mx-1 hover:bg-[rgba(0,0,0,0.4)] border-white rounded-lg p-1" onClick={(el)=>{el.preventDefault();handelImageDiscard(index)}} ><DeleteRoundedIcon/></button>
                                        </Tooltip>
                                    </div>
                                )
                            })
                        }
                        <Tooltip title='Add another field for an image' >

                        <button id="none" onClick={handelImageNumber} className="bg-blue-100 text-blue-600 rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer hover:border-blue-600 border-2 active:bg-blue-600 active:border-white active:text-blue-100 border-blue-100 text-sm hover:text-base m-2" >{ picCount == 0 ? 'Add a Image' : 'Add another image' }</button>
                        </Tooltip>
                    </div>
                    
                    <hr className="my-6 text-black" /> 

                    <div className="row4 my-2 flex ">
                        <div className="col1 w-1/3">
                            <label htmlFor="">Number of Specificating </label>
                            <input type="number" className="inputstyle w-20" onChange={handelSpecsQuantity}  />
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
                                        catagory.map((el, index)=>{
                                            return (
                                                    <option value={el} key={index} className="bg-black text-white">{el}</option>
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
                                    <input type="text" name="ProductSheller" value={data.ProductSheller}  onChange={handelChange}  className="inputstyle ml-2" />
                        </div>
                        <div className="col2">
                                    <Button onClick={handelSubmit} variant="contained" sx={{backgroundColor: "white", color: "black",borderRadius: "10px", border: "10px solid black"}}>ADD</Button>
                        </div>
                    </div>
                </form>
                {
                    ask &&
                    <Confirm text={ask.text} fun={ask.fun} cancel={setAsk}></Confirm>
                }
                {
                    render &&
                    <Rendering></Rendering>
                }
            </div>
        </>
    )
}

export default Addform;