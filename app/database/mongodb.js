import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI)

        if (connection.readyState == 1) {
            console.log("Database connected")
        }
    }catch (error) {
        return Promise.reject(error)
    }
}
export { connectToDatabase };