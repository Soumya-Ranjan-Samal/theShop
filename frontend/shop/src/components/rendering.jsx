function Rendering(){
    return (
        <> 
            <div className="wholepage h-dvh fixed top-0 w-full bg-[rgba(0,0,0,0.8)] z-90 flex flex-col justify-center items-center">
                <div className="round h-20 w-20 p-4 border-5 border-white rounded-full flex justify-center items-center animate-ping">
                    <div className="round h-14 w-14 p-4 border-5 border-white rounded-full flex justify-center items-center">
                        <div className="round p-3 w-0 h-0 bg-white rounded-full"></div>
                    </div>
                </div>
                <p className="font-bold text-xl">Processing, Please Do not leave the page.</p>
            </div>
        </>
    )
}

export default Rendering;