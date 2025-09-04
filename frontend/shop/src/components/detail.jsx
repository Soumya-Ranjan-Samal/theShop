import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import RelatedProduct from "./relatedproduct";
import Confirm from "./confirm";
import  axios  from "axios";
import "../App.css";

function Detail(){

    const params = useParams();
    const navigate = useNavigate();

    let [Data,setData] = useState({
        pictures: [],
        specifications: [],
        review: [],
    });
    let [curPic,setCurPic] = useState(0);
    let [reviewData,setReviewData] = useState({
        rating: 0,
        comment: "",
    });
    let [ask,setAsk] = useState();

    let getData = async ()=>{
            await axios.get("http://localhost:3000/products/"+params.id,{
                headers: {
                    Authorization: `bearer ${localStorage.getItem("mytoken")}`
                }
            }).then((res)=>{
                setData({...res.data});
            }).catch((error)=>{
                console.log(error);
            });
        }

    useEffect(()=>{
        getData();
    },[]);

    let buttonstyle = { color: "white", backgroundColor: "rgb(10,10,10,0.2)", borderRadius: "50%" }

    let changepic = (val)=>{
        if(val < 0){
            if(curPic==0){
                setCurPic(Data.pictures.length-1);
            }else{
                setCurPic(curPic+val)
            }
        }else{
            if(curPic==(Data.pictures.length-1)){
                setCurPic(0)
            }else{
                setCurPic(curPic+val)
            }
        }
    }

    let dotchange = (el)=>{
        setCurPic(parseInt(el.target.classList[0]))
    }

    function submitreview(){
        let send = async ()=>{
            await axios.post(`http://localhost:3000/products/${params.id}/review`,{
                ...reviewData
            },{
                headers: {
                    Authorization: `bearer ${localStorage.getItem('mytoken')}`
                }
            }).then((res)=>{
                getData();
            }).catch((error)=>{
                console.log(error);
                alert(error.response.data.details._message);
            });
        }
        setAsk({
            text: "Are you want to submit this comment",
            fun: send,
        });
    }

    let handelDeleteProduct = ()=>{
        let deleteProduct = async ()=>{
            await axios.delete(`http://localhost:3000/products/${params.id}/delete`,{
                headers: {
                    Authorization: `Barear ${localStorage.getItem("mytoken")}`
                }
            }).then((res)=>{
                if(res.data.status == false){
                    alert(res.data.message);
                }else{
                    navigate("/");                  
                }
            })
        }
        setAsk({
            text: "Are you want to submit this comment",
            fun: deleteProduct,
        });
    }

    function handelDeleteReview(id){
        let del = async ()=>{
            await axios.delete(`http://localhost:3000/products/${Data._id}/review/${id}`,{
                headers: {
                    Authorization: `bearer ${localStorage.getItem('mytoken')}`
                }
            }).then((res)=>{
                getData();
            }).catch((error)=>{
                console.log(error);
            });
        }
        setAsk({
            text: "Are you realy want to delete this comment",
            fun: del,
        });
    }

    function handelAddToCart(go){
        let add = async ()=>{
            await axios.post(`http://localhost:3000/user/cart/${Data._id}/add`,{},{
                headers: {
                    Authorization: `Barear ${localStorage.getItem("mytoken")}`
                }
            }).then((res)=>{
                if(res.status == 200){
                    alert('item added to cart sucessfuly');
                    if( go ){
                        navigate('/cart');
                    }   
                }else{
                    if(res.data.message == 'DO login first'){
                        navigate('/sign');
                    }
                    alert('something went wrong! please try later.');
                }
            }).catch((error)=>{
                if(error.status == 400){
                    alert('Do login first')
                    return navigate('/sign',{state: {from: "/detail/"+Data._id}});
                }
                alert('something went wrong! please try later.');
            })
        }
        if( Data.Available > 0 ){
            setAsk({
                text:  "Add this iteam to your cart to buy ?",
                fun: add,
            });
            return
        }    
        alert('Product is not in stock')
    }

    function handelChange(e){
        let name = e.target.name== "size-medium" ? "rating" : e.target.name ;
        let value = e.target.value;
        setReviewData({...reviewData, [name]: value});
    }


    return (
        <>
            <div className="main md:w-full md:p-0 p-2 w-[99%]">
                <div className="row1 flex justify-evenly">
                    <div className="md:w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                    <span className="name2 font-bold md:w-1/3 md:text-2xl text-white ">{Data.name}</span>
                    <div className="md:w-1/3" ></div>
                </div>
                <div className="row2 w-full flex flex-col md:flex-row">
                    <div className="md:w-[75%]">
                        <div className="pictures">
                            <div>
                                <IconButton sx={buttonstyle} onClick={()=>changepic(-1)} >
                                    <KeyboardArrowLeftRoundedIcon fontSize="large"  ></KeyboardArrowLeftRoundedIcon>
                                </IconButton>
                            </div>
                            <img className="bigimage w-3/4 md:w-2/3" src={Data.pictures[curPic]} alt="not found" />
                            <div>
                                <IconButton sx={buttonstyle} onClick={()=>changepic(1)} >
                                    <ChevronRightRoundedIcon fontSize="large"  ></ChevronRightRoundedIcon>
                                </IconButton>
                            </div>
                        </div>
                        <div className="curpic flex justify-center">
                        {
                            Data.pictures.map((el,index)=>{
                                let change = (el == Data.pictures[curPic])?  index+" m-1 mb-2 dot h-[10px] w-[10px] bg-white rounded-full" : index+" m-1 dot h-[10px] w-[10px] bg-white rounded-full opacity-20";
                                return (
                                    <>
                                        <div onClick={dotchange} className={change}></div>
                                    </>
                                )
                            })
                        }
                        </div>
                    </div>
                

                    <div className="border border-white h-full p-6 rounded-2xl text-black w-full md:w-1/4 text-base md:m-4 shadow-lg" style={{ backgroundColor: "rgba(245, 244, 244, 0.6)" }}>
                        
                            
                            <h2 className="text-xl font-semibold mb-2">{Data.name} <span className="text-yellow-500 px-2 rounded-full bg-yellow-100 hover:shadow-xl text-xl font-bold">{Data.Offer}% Off</span></h2>
                        

                        <p className="text-sm mb-1">Brand: <span className="font-medium">{Data.ProductSheller}</span></p>
                        <p className="mb-1">{Data.Available} units available</p>
                        <p className="text-sm mb-2">After all discounts</p>
                        <p className="mb-4">
                            Price:&nbsp;
                        <span className="line-through text-gray-500">₹{Data.price}.00/-</span>&nbsp;
                        <span className="text-2xl text-gray-600 bg-gray-100 rounded-full px-2 py-1 hover:shadow-lg font-bold">
                            ₹{Math.floor(Data.price * ((100 - Data.Offer) / 100))}/-
                        </span>
                    </p>

                    <div className="h-[1px] bg-gray-400 my-4" />

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Specifications</h3>
                        <ol className="list-disc list-inside bg-white bg-opacity-30 rounded-xl p-4 text-sm space-y-1">
                        {Data.specifications.map((el, index) => (
                            <li key={index}>{el}</li>
                        ))}
                        </ol>
                    </div>
                    </div>

                </div>
                {
                    localStorage.getItem('person') != 'Seller' && 
                    <div className="row3 m-4 border border-white rounded-xl p-4">
                        <ButtonGroup  variant="contained" className="w-[100%]" aria-label="Basic button group">
                            <Button sx={{backgroundColor: "white", color: "black", width: "40%"}} onClick={()=>handelAddToCart(true)}  endIcon={<ShoppingBagIcon/>} >Buy</Button>
                            <Button sx={{backgroundColor: "white", color: "black", width: "60%"}} onClick={()=>handelAddToCart(false)} endIcon={<ShoppingCartIcon/>}>Add to cart</Button>
                        </ButtonGroup>
                    </div>
                }
                {
                Data.tokenData == true &&

                (
                    <>
                    <hr className="text-white m-4"></hr>
                    <div className="ml-2 md:w-1/2  bg-purple-100 text-purple-600 rounded-full p-4">It's Your Product, you can edit and remove this from your inventory</div>
                    <div className="selleroption bg-black row3 m-4 md:w-1/2 border border-white rounded-xl p-2">
                        <ButtonGroup variant="contained" className="w-full" aria-label="Basic button group">
                            <Button onClick={()=>{navigate(`/edit/${Data._id}`)}} sx={{backgroundColor: "yellow", color: "black", width: "50%"}} endIcon={<EditNoteRoundedIcon/>} >Edit item details</Button>
                            <Button onClick={handelDeleteProduct} sx={{backgroundColor: "red", color: "white", width: "50%"}}  endIcon={<DeleteIcon/>}>Delete item from inventory</Button>
                        </ButtonGroup>
                </div>
                </>
                )
                }
                <div className="row4 flex md:flex-row flex-col  m-4 border border-white justify-between align-center p-4 rounded-xl">
                    <div className=" border border-white rounded-lg md:w-1/3 p-4">
                        <span className="text-lg text-white">Ratings by buyers: </span>
                        <div>
                            <Stack>
                                {
                                    Data.avgrating &&
                                    <Rating sx={{fontSize: "2rem"}} name="half-rating-read" defaultValue={ Data.avgrating }   readOnly />
                                }
                            </Stack>
                        </div>
                    </div>
                    <form className="giverevire md:w-2/3  flex flex-col">
                        <label htmlFor="revirew" className="text-white m-2">Some review</label>
                        <Rating name="size-medium" id="rating" value={reviewData.rating} onChange={handelChange} />
                        <span className="flex">
                            <textarea name="comment" value={reviewData.comment} onChange={handelChange} id="review" className="border m-2 w-[80%] bg-gray-300 border-white rounded-md p-2" placeholder="some remarks"></textarea>
                            <Button onClick={submitreview} variant="contained" sx={{height: "3rem", backgroundColor: "black", marginTop: "1rem"}}  endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </span>
                    </form>
                </div>

                <div className="row3 border border-white rounded-xl p-4 m-4">
                    <div className="text-xl text-white">All reviews</div>
                    <div className="allreview">
                            {
                                Data.review.map((rev)=>{
                                    return (
                                        <div className="revcard text-sm border border-gray-100 p-4 m-2 rounded-md bg-gray-100 text-gray-500 w-full md:w-[32%]">
                                            <div className="line1 flex justify-between">
                                                <Rating  name="size-medium" defaultValue={rev.rating}  readOnly />
                                                <span className="relative text-black top-[-5px]">
                                                    - By {rev.userId ? rev.userId.username : 'Unknown'}
                                                </span>
                                            </div>
                                           <div className="line2">
                                                <p>{rev.comment}</p>
                                           </div>
                                           {
                                            rev.userId?._id == localStorage.getItem('_id') && 
                                           <div className="line3">
                                                <Button sx={{backgroundColor: "rgb(10,10,10,0.7)", color: "gray"}} onClick={()=>handelDeleteReview(rev._id)} endIcon={<DeleteIcon/>} >Delete</Button>
                                           </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                    </div>
                </div>

                <div className="row4 border border-white rounded-xl p-4 m-4">
                    {
                        Data.catagory?.length &&
                        <>{
                            Data.catagory.map((el)=>{
                                return (
                                    <RelatedProduct catagory={el}/>
                                )
                            })
                        }</>
                    }
                </div>
                {
                    ask &&
                    <Confirm text={ask.text} fun={ask.fun} cancel={setAsk}></Confirm>
                }
            </div>
        </>
    )
}

export default Detail