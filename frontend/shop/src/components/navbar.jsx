import "../App.css"
import StorefrontIcon from '@mui/icons-material/Storefront';

function Navbar() {

    
    return (
      <>
        <div className="nav  m-[0.1rem] rounded p-2 flex justify-center content-center">
            <div className="name text-xl font-bold  pl-4 flex justify-baseline pt-1 w-1/3">
              <StorefrontIcon></StorefrontIcon><i>The Shop</i>
            </div>
            <div className="options w-1/3  flex m-2  content-center text-md font-semibold text-white justify-evenly">
              <a href="" className="navop">Home</a>
              
                  <a href="" className="navop">Account</a>
                  <a href="" className="navop">Cart</a>
                  <a href="" className="navop">My Order</a>
               
              <a href="" className="navop">Search</a>
            </div>
            <div className="other w-1/3">

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