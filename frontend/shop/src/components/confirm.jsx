import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import "../App.css";

function Confirm(props){
    return (
        <>
            <div className="wholeblack">
                <div className="permissionBox bg-white text-xl rounded-xl md:w-1/2 w-[70%] ml-[15%] md:ml-[25%] mt-[20%] p-6">
                    <p className='p-6 bg-[rgba(1,1,1,0.3)] rounded-md'>{props.text}</p>
                    <ButtonGroup variant="contained" className="w-[100%]" aria-label="Basic button group">
                            <Button sx={{backgroundColor: "red", color: "white", width: "50%"}} endIcon={<ClearRoundedIcon/>} onClick={()=>props.cancel(false)} >NO</Button>
                            <Button sx={{backgroundColor: "green", color: "white", width: "50%"}}  endIcon={<DoneRoundedIcon/>} onClick={()=>{props.fun();props.cancel(false)}}>YES</Button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}

export default Confirm;