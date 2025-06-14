const transportOwner = () =>{
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>    
            <p className="text-lg text-gray-600">Welcome to your Transport Dashboard!</p>
            <div className="mt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                    Click Me
                </button>
            </div>
        </div>
    );
}

export default transportOwner;