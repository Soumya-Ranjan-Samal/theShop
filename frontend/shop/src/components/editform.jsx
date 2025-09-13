import { useState, useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Tooltip } from "@mui/material";
import Confirm from "./confirm";
import Rendering from './rendering.jsx'
import axios from "axios";
import "../App.css";

function Addform(){
    const navigate = useNavigate();
    let params = useParams();

    let [oldPic, setOldPic] = useState([]);
    let [render, setRender] = useState(false);

    let [picarray, setPicarray] = useState([]);
    let [specsArr, setspecsArr] = useState([]);
    let [picCount, setPicCount] = useState(0);
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

    function handelImageNumber(el){
        el.preventDefault();
        setPicCount(el => el+1);
    }

    useEffect(()=>{
        let getData = async ()=>{
                await axios.get("http://localhost:3000/products/"+params.id+"/edit",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('mytoken')}`
                }
            }).then((res)=>{
                    setData({...res.data});
                    setspecsArr([...res.data.specifications]);
                    setCat([...res.data.catagory]);
                    setOldPic([...res.data.pictures]);
                }).catch((error)=>{
                        alert(error.response.data.message);
                });
            }
            getData();
    },[]);

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
                await axios.patch("http://localhost:3000/products/"+data._id,{
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
                text: "Are you sure to do this update",
                fun: send,
            });
        }

    function deleteImage(detial){
        let requests = async ()=>{
            setRender(true);
            await axios.patch(`http://localhost:3000/products/image/${data._id}`,
                detial,
                {
                    headers: {
                        Authorization : `bearer ${localStorage.getItem('mytoken')}`
                    }
                }
            ).then((res)=>{
                setOldPic(oldPic.filter((e)=> e.url != detial.url));
                setRender(false);
            }).catch((error)=>{
                console.log(error);
                alert('Something went wrong, please try later.');
                setRender(false);
            });
        }
        setAsk({
            text: "Are you sure to delete this picture, you will not be able to retrive it later",
            fun: requests
        });
    }


    return (
        <>
            <div className="main min-h-[95dvh] text-white">
                <div className="head flex">
                <div><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                <h1 className="text-xl font-bold p-4">EDIT PRODOCT DETAILS</h1>
                </div>
                <form action="" className="border m-4 text-sm font-semibold border-white rounded-lg p-6">
                    <div className="row1 flex md:flex-row flex-col ">
                        <div className="col1  md:w-1/4 flex flex-col">
                            <label>Name of the product <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={data.name} onChange={handelChange} className="inputstyle my-2 mr-2" />
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
                            <input type="number" min={0} max={80} name="Offer" value={data.Offer} onChange={handelChange}  className="inputstyle my-2 mx-2"/>
                        </div>
                    </div>

                    <hr className="my-6 text-black" /> 

                    <div className="currentImages">
                        <p className="text-sm">Current Images</p>
                        <div className="images flex  flex-wrap">
                            {
                                oldPic?.map((pictureDeats, index)=>{
                                    return (
                                        <div key={index} className="relative m-4 hover:shadow-lg shadow-white border-5 border-gray-400 rounded-xl" >
                                            <img src={pictureDeats.url} alt="" className=" h-36 w-42 object-cover rounded-lg" />
                                            <Tooltip title="Delete This Picture" placement="top">
                                                <button onClick={(element)=>{element.preventDefault();deleteImage(pictureDeats)}} className="absolute cursor-pointer hover:shadow-lg hover:shadow-red-500  top-[-10%] border-3 p-2 border-white rounded-full left-36 bg-red-600 "><DeleteRoundedIcon sx={{backgroundColor: 'transparent'}}></DeleteRoundedIcon></button>
                                            </Tooltip>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <hr className="my-6 text-black" />

                    <div id="imageFieldCollector" className="row3 flex flex-col">
                        {
                            Array.from({length: picCount}).map((_, index)=>{
                                return (
                                    <div id={index} className="m-2 flex flex-row items-center justify-between md:w-1/3" key={index}>
                                        {
                                           ! picarray[index]?.url &&
                                            <input type="file" onChange={(el)=>handelimageChange(el, index)} className="border w-3/4 border-white rounded-xl p-2 inputstyle" /> 
                                        }
    
                                        <img src={picarray.filter(el => el.id == index)[0]?.url} alt="" className="h-36 w-42 rounded-xl border-5  border-gray-400 object-cover" />
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

                    <div className="row4 my-2 flex flex-col md:flex-row">
                        <div className="col1 md:w-1/3">
                            <label htmlFor="">Number of Specificating </label>
                            {
                                specsArr.length &&
                                <input type="number" className="inputstyle" defaultValue={specsArr.length} onChange={handelSpecsQuantity}  />
                            }
                        </div>
                        <div className="col2 md:w-2/3">
                            {
                                specsArr.map((el,index)=>{
                                    return (
                                            <div key={index}>
                                                <span>specs {index+1} : </span>
                                                <input type="text" value={el} name={index} onChange={handelSpecsChange}   className="specfield inputstyle m-2 md:w-[80%]" />
                                            </div>
                                    )
                                })
                            }
                        </div>
                    </div>


                        <hr className="my-6 text-black" /> 

                    <div className="row5 flex flex-col md:flex-row">
                        <div className="col1 mb-2">
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
                                        cat.map((el, index)=>{
                                            return (
                                                    <Chip
                                                        key={index}
                                                        sx={{margin: "5px"}}
                                                        label={el}
                                                        variant="outlined"
                                                        onDelete={()=>handelCatdelete(el)}
                                                    />
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
                {
                    render &&
                    <Rendering></Rendering>
                }
            </div>
        </>
    )
}

export default Addform;