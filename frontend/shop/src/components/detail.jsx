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

    useEffect(()=>{
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
            }).then((res)=>{
                window.location.reload();
            }).catch((error)=>{
                console.log(error);
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
            await axios.delete(`http://localhost:3000/products/${Data._id}/review/${id}`).then((res)=>{
                window.location.reload();
            }).catch((error)=>{
                console.log(error);
            });
        }
        setAsk({
            text: "Are you realy want to delete this comment",
            fun: del,
        });
    }

    function handelAddToCart(){
        let add = async ()=>{
            await axios.post(`http://localhost:3000/user/cart/${Data._id}/add`,{},{
                headers: {
                    Authorization: `Barear ${localStorage.getItem("mytoken")}`
                }
            }).then((res)=>{
                if(res.status == 200){
                    alert('item added to cart sucessfuly');
                    navigate('/cart');
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
                text:  "Add this iteam to your cart ?",
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
            <div className="main">
                <div className="row1 flex justify-evenly">
                    <div className="w-1/3"><button className="back" onClick={()=>{navigate("/")}} ><ArrowBackIcon></ArrowBackIcon></button></div>
                    <span className="name2 font-bold w-1/3 text-2xl text-white ">{Data.name}</span>
                    <div className="w-1/3" ></div>
                </div>
                <div className="row2 w-full flex">
                    <div className="w-[75%]">
                        <div className="pictures">
                            <div>
                                <IconButton sx={buttonstyle} onClick={()=>changepic(-1)} >
                                    <KeyboardArrowLeftRoundedIcon fontSize="large"  ></KeyboardArrowLeftRoundedIcon>
                                </IconButton>
                            </div>
                            <img className="bigimage" src={Data.pictures[curPic]} alt="not found" />
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
                
                    <div className="debts border border-white p-6 rounded-4xl  text-white w-[25%] text-xl m-4 ml-0">
                        <p>{Data.name}</p>
                        <p className="text-sm">Barnd {Data.ProductSheller}</p>
                        <p> {Data.Available} Units Available </p>
                        <p><b><span className="text-yellow-400 text-2xl" >{Data.Offer}% Off</span> on this product</b></p>
                        <p className="text-sm"> After all Discount</p>
                        <p>Price:&nbsp;<span className="linethrough opacity-70" >${Data.price}.00/-</span>&nbsp; <b className="text-2xl text-black font-bold">${Data.price * ((100-Data.Offer)/100)}/-</b></p>
                        <div className="h-[2px] m-4 bg-white">

                        </div>
                        <span>
                            <span className="text-2xl">Specificatioins</span>
                            <ol className="specs text-[15px] border border-white rounded-xl my-4 bg-black opacity-40 p-4  ">
                                {
                                    Data.specifications.map((el)=>{
                                        return (
                                            <li>* {el}</li>
                                        )
                                    })
                                }
                            </ol>
                        </span>
                    </div>
                </div>
                <div className="row3 m-4 border border-white rounded-xl p-2">
                        <ButtonGroup  variant="contained" className="w-[100%]" aria-label="Basic button group">
                            <Button sx={{backgroundColor: "white", color: "black", width: "40%"}} endIcon={<ShoppingBagIcon/>} >Buy</Button>
                            <Button sx={{backgroundColor: "white", color: "black", width: "60%"}} onClick={handelAddToCart} endIcon={<ShoppingCartIcon/>}>Add to cart</Button>
                        </ButtonGroup>
                </div>
                {
                Data.tokenData == true &&
                (<div className="selleroption bg-black row3 m-4 w-[50%] border border-black rounded-xl p-2">
                        <ButtonGroup variant="contained" className="w-[100%]" aria-label="Basic button group">
                            <Button onClick={()=>{navigate(`/edit/${Data._id}`)}} sx={{backgroundColor: "yellow", color: "black", width: "50%"}} endIcon={<EditNoteRoundedIcon/>} >Edit item details</Button>
                            <Button onClick={handelDeleteProduct} sx={{backgroundColor: "red", color: "white", width: "50%"}}  endIcon={<DeleteIcon/>}>Delete item from inventory</Button>
                        </ButtonGroup>
                </div>)
                }
                <div className="row4 flex m-4 border border-white justify-between align-center p-4 rounded-xl">
                    <div className=" border border-white rounded-lg w-[30%] p-8">
                        <span className="text-xl text-white">Ratings by buyers: </span>
                        <div>
                            <Stack>
                                {
                                    Data.avgrating &&
                                    <Rating sx={{fontSize: "2rem"}} name="half-rating-read" defaultValue={ Data.avgrating }   readOnly />
                                }
                            </Stack>
                        </div>
                    </div>
                    <form className="giverevire w-[70%]   flex flex-col">
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
                                        <div className="revcard border border-gray-100 p-4 m-2 rounded-md text-gray-200 w-[30%]">
                                            <div className="line1">
                                                <Rating  name="size-medium" defaultValue={rev.rating}  readOnly />
                                                <span className="relative top-[-5px]">
                                                    - By Jorden huskey
                                                </span>
                                            </div>
                                           <div className="line2">
                                                <p>{rev.comment}</p>
                                           </div>
                                           <div className="line3">
                                                <Button sx={{backgroundColor: "rgb(10,10,10,0.7)", color: "gray"}} onClick={()=>handelDeleteReview(rev._id)} endIcon={<DeleteIcon/>} >Delete</Button>
                                           </div>
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