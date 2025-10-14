import Reports from "../model/report";

export async function getReports(req, res) {
    try {

        const { department } = req.query;

        // if (department) {
        //     switch (department) {
        //         case "ทั้งหมด":
        //             const allReports = await Reports.find()
        //             return res.status(200).json(allReports)
        //             break;
        //         case : 
        //             const { user_id } = req.query
        //             const userReports = await Reports.find({ user_id: user_id });
        //             return res.status(200).json(userReports)
        //             break;
        //         default:
        //             const departmentReports = await Reports.find({ department: department })
        //             return res.status(200).json(departmentReports)
        //     }
        // }

        if (department == "ทั้งหมด") {
            const allReports = await Reports.find()

            console.log("Query Parameters:", req.query); // ✅ ตรวจสอบค่า query parameters ที่ได้รับ

            console.log("Department:", department);


            return res.status(200).json(allReports)

        } else if (department) {
            const { department } = req.query
            const departmentReports = await Reports.find({ department: department })

            return res.status(200).json(departmentReports)
            
        } else {
            const { user_id } = req.query
            const userReports = await Reports.find({ user_id: user_id });
            return res.status(200).json(userReports)
        }

    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
}

export async function getReport(req, res) {
    try {
        const { report_id } = req.query;
        if (report_id) {
            const report = await Reports.findById(report_id)
            res.status(200).json(report)
        } 
        res.status(404).json({ error: 'Report not selected' })
    }
    catch (error) {
        res.status(404).json({ error:'Report not found' })
    }
}

export async function createReport(req, res) {
    try {
        const newReport = new Reports(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create report' });
    }
}

export async function updateReport(req, res) {
    try {
        const { report_id } = req.query;
        const formData = req.body;

        if (report_id && formData) {
            const report = await Reports.findByIdAndUpdate(report_id, formData)
            res.status(200).json({ report });
        }
        res.status(404).json({ error: 'Report not selected' });
    }
    catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to update report' });
    }
}

export async function deleteReport(req, res) {
    try {
        const { report_id } = req.query;
        if (report_id) {
            const report = await Reports.findByIdAndDelete(report_id)
            return res.status(200).json({ deleted: report_id })
        }
        res.stutus(404).json({ error: 'Report not selected' });
    }catch(error){
        res.status(404).json({ error: 'Failed to delete report' });
    }
}