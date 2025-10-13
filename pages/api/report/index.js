import { connectToDatabase } from "../../../app/database/mongodb"
import { getReports, createReport, updateReport, deleteReport } from "../../../app/database/controller"

export default async function handler(req, res) {
    connectToDatabase().catch(() => res.status(405).json({ error: "Can't Connect to Database" }))
    
    const { method } = req

    switch (method) {
        case "GET":
            getReports(req, res)
            break
        case "POST":
            createReport(req, res)
            break
        case "PUT":
            updateReport(req, res)
            break
        case "DELETE":
            deleteReport(req, res)
            break
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}