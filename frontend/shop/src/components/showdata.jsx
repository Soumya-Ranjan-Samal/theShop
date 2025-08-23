function Showdata({data, name}){
    return (
        <>
            <div className="d bg-gray-200 px-6 p-1 md:w-1/2 w-full min-w-[200px]  rounded-lg flex-shrink-0" >
                <p><b>{name}: </b>{data}</p>
            </div>
        </>
    )
}

export {Showdata}