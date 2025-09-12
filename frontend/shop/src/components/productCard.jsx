import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProductCard({data}){
    let navigate = useNavigate();

    return (
        <>
        <motion.div initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                     onClick={()=>navigate('/detail/'+data._id)} className="c hover:shadow-xl hover:shadow-gray-300 my-5 relative top-0 hover:-top-3   transition-all easy-in-out duration-400 easy-out  font-bold w-full m-1 bg-white flex items-center text-gray-500 p-6 rounded-full">
            <img src={data.pictures[0].url} className=" border-4 border-gray-500 h-34 w-34 rounded-full" alt="" />
            <div className="info">
                <p>{data.name.length > 30 ? data.name.slice(0,30)+".." : data.name}</p>
                <p>&nbsp;&nbsp;&nbsp;$ {data.price}/-</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Offer: {data.Offer}%</p>
                <p>&nbsp;&nbsp;&nbsp;Available: {data.Available}</p>
                <p>reviews: {data.review.length}</p>
            </div>
        </motion.div>
        </>
    )
}

export {ProductCard}