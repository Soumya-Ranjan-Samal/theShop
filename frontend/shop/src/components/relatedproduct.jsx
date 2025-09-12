import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function RelatedProduct(props){

    const [data,setData] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        let getRealatedPro = async ()=>{
            await axios.get("http://localhost:3000/products/catagory/"+props.catagory).then((res)=>{
                setData(res.data);
            }).catch((error)=>{
                console.log(error);
            });
        }
        getRealatedPro();
    },[props.catagory]);


    return (
        <>
            <span className="text-lg text-white">Related Products</span>
            <div className="allproducts ">
                {
                    data.map((el)=>{
                        return (
                            <>
                                <a href={"/detail/"+el._id}>
                                <div className="smallcard w-42 bg-[rgb(10,10,10,0.2)] text-xs text-white rounded-lg p-4 m-2">
                                    <img className="h-36 w-36 rounded-lg" src={el.pictures[0].url} alt="" />
                                    <span>{el.name.length > 16 ? el.name.slice(0,14)+"..." : el.name}</span>
                                    <div>$ {el.price - el.price * el.Offer/100}/-</div>
                                </div>
                                </a>
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}

export default RelatedProduct;