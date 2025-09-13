import { IconButton, Tooltip, TextField, Button } from "@mui/material";
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useState } from "react";

function ModifiableData({ data, name, setData, useName, updateFun}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className="d flex flex-col bg-gray-200 px-6 p-1 md:w-1/2 w-full min-w-[200px] rounded-lg flex-shrink-0 transition-all duration-300">

        <div className="flex justify-between items-center">
          <p className="flex w-2/3 justify-between"><b>{name}: </b><span className="w-2/4 text-center">{data}</span></p>
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
              name={useName}
              onChange={(el)=>{
                setData((data)=>{
                  return {...data, [useName]: el.target.value}
                });
              }}
            />
            <Button className="bg-sky-500 text-white px-4 py-3 rounded-lg" title={useName} onClick={updateFun} >
              Change
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { ModifiableData };