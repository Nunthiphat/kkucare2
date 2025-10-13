export function LoginSuccess() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-green-500 text-white text-md my-4 py-2 text-center rounded-md">
                Login Success!
            </div>
            <div>
                <button onClick={() => window.location.href = '/userform'} className="bg-blue-500 text-white p-2 rounded">
                    Go to User Form
                </button>
            </div>
        </div>
    )
}

export function LoginFailed() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-red-500 text-white text-md my-4 py-2 text-center rounded-md">
                Login Failed!
            </div>
        </div>
    )
}

export function FileSelected() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-blue-500 text-white text-md my-4 py-2 text-center rounded-md">
                File Selected!
            </div>
        </div>
    )
}