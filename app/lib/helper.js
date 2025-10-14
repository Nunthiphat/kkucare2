
const BASE_URL = 'http://localhost:3000'

//search reports
export const getReports = async (userData) => {

    const { role } = userData;

    if(role == 'เจ้าหน้าที่'){
        const department = userData?.department;
        const response = await fetch(`${BASE_URL}/api/report?department=${department}`)       
        const json = await response.json()
        return json
    } else {
        const user_id = userData?.user_id;
        const response = await fetch(`${BASE_URL}/api/report?user_id=${user_id}`)
        const json = await response.json()
        return json
    }
}

export const receiveReports = async () => {

    const department_id = sessionStorage.getItem("role");
    const response = await fetch(`${BASE_URL}/api/report/receive?department_id=${department_id}`)
    const json = await response.json()

    return json
}

//single report
export const getReport = async(report_id) => {
    const response = await fetch(`${BASE_URL}/api/report/${report_id}`)
    const json = await response.json()

    if(json) return json
    return{}
}

//create report
export async function createReport(formData) {
    try{
        const Options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }

        const response = await fetch(`${BASE_URL}/api/report`, Options)

        console.log("this is helper : ", formData)

        const json = await response.json()
        return json
    }catch(error){
        return (error)
    }
}

//update a new report
export async function updateReport(report_id, formData) {

    console.log("this is helper : ", formData)
    console.log("this is helper id : ", report_id)


    const Options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }

        const response = await fetch(`${BASE_URL}/api/report/${report_id}`, Options)
        const json = await response.json()
        return json
}

//delete a report
export async function deleteReport(reportId) {
    const report_id = `?report_id=${reportId}`;
    const Options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
        }
        const response = await fetch(`${BASE_URL}/api/report${report_id}`, Options)
        const json = await response.json()
        return json
}

export async function handleLogin(email, password) {

  const res = await fetch("../api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),

  });

  const data = await res.json();

  if (res.ok) {
    // เก็บ user_id ไว้ใน sessionStorage
    sessionStorage.setItem("user", JSON.stringify(data.user));

    return res;
  } else {
    alert(data.error);
  }
}