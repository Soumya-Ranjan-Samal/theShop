function Showdata({data, name}){
    return (
        <>
            <div className="d bg-gray-200 px-6 p-1 md:w-1/2 w-full min-w-[200px]  rounded-lg " >
                <p className="flex justify-between"><b>{name}: </b><span>{data}</span></p>
            </div>
        </>
    )
}

export {Showdata}