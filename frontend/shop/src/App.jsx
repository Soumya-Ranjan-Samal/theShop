import Homepage from "./pages/home";
import Details from "./pages/details";
import Add from "./pages/add";
import Edit from "./pages/edit";
import SignUpAndIn from "./pages/signUpAndIn";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Cart from "./pages/cart";
import "./app.css"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}/>
          <Route path="/detail/:id" element={<Details></Details>}/>
          <Route path="/add" element={<Add></Add>} />
          <Route path="/edit/:id" element={<Edit></Edit>}/>
          <Route path="/signupandsignin" element={<SignUpAndIn></SignUpAndIn>}/>
          <Route path="/cart" element={<Cart></Cart>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

// <Homepage></Homepage>
    //  <Details></Details>

export default App
