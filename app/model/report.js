import {Schema, models, model} from 'mongoose';

const reportSchema = new Schema({
    report_id : {type: String,
    unique: true,
    default: function () {
      return this._id.toString();  // copy ค่า _id มาใส่ reportId
    }
    },
    user_id : {type: String},
    topic : {type: String},
    description : {type: String},
    image: {
      name: { type: String, required: false },     // ชื่อรูปภาพ
      data: { type: String, required: false }      // ข้อมูลรูปภาพ (Base64 / ตัวอักษร)
    },
    status : {type: String, default: "ส่งแล้ว"},
    department : {type: String},
    start_date : {type: Date, default: Date.now},
    end_date : {type: Date, default: null},
});

const Reports = models.report || model('report', reportSchema)
export default Reports;