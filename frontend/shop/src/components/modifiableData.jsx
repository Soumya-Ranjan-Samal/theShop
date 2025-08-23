// import { IconButton } from "@mui/material";
// import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
// import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { useState, useEffect } from "react";
// import Tooltip from '@mui/material/Tooltip';


// function ModifiableData({data, name}){
//     let [edit,setEdit] = useState(false);
    
//     return (
//         <>
//             <div className="d flex flex-col bg-gray-200 px-6 p-1 md:w-1/2 w-full min-w-[200px]  rounded-lg flex-shrink-0" >
//                 <div className="flex justify-between">
//                 <p><b>{name}: </b>{data}</p>
//                 <Tooltip title={!edit? 'Edit': 'Cancel editing'}>
//                 <IconButton size="small" onClick={() =>{setEdit((edit) => edit? false: true)}}  >
//                     {
//                         !edit &&
//                     <ModeEditOutlineRoundedIcon />
//                     }
//                     {
//                         edit && 
//                     <CancelRoundedIcon/>
//                     }
//                 </IconButton>
//                 </Tooltip>
//                 </div>
//                 {
//                     edit &&
//                         <div className="editbar flex m-2 justify-between">
//                             <TextField id="filled-basic" className="w-2/3" label={"New "+name} size="small" variant="filled" />
//                             <Button  class="bg-sky-500 text-white px-4 py-[0] rounded-lg" >
//                                 Change
//                             </Button>
//                         </div>
//                 }
//             </div>
//         </>
//     )
// }

// export {ModifiableData}

import { IconButton, Tooltip, TextField, Button } from "@mui/material";
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useState } from "react";

function ModifiableData({ data, name }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className="d flex flex-col bg-gray-200 px-6 p-1 md:w-1/2 w-full min-w-[200px] rounded-lg flex-shrink-0 transition-all duration-300">

        <div className="flex justify-between items-center">
          <p><b>{name}: </b>{data}</p>
          <Tooltip title={!edit ? 'Edit' : 'Cancel editing'}>
            <IconButton
              size="small"
              onClick={() => setEdit(prev => !prev)}
            >
              {!edit && <ModeEditOutlineRoundedIcon />}
              {edit && <CancelRoundedIcon />}
            </IconButton>
          </Tooltip>
        </div>

        <div
          className={`  overflow-hidden transition-all duration-300 ease-in-out ${
            edit ? 'max-h-40 opacity-100 mt-2 my-4' : 'max-h-0 opacity-0 '
          }`}
        >
          <div className="flex justify-between items-center gap-2">
            <TextField
              id="filled-basic"
              className="w-2/3"
              label={"New " + name}
              size="small"
              variant="filled"
            />
            <Button  class="bg-sky-500 text-white px-4 py-3 rounded-lg" >
             Change
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { ModifiableData };