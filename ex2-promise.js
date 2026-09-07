const STUDENTS = [
  {id: "6501", name: "สมชาย", major: "CE", score: "78"},
  {id: "6502", name: "สมหญิง", major: "CE", score: "91"},
  {id: "6503", name: "สมปอง", major: "IT", score: "80"},
  {id: "6504", name: "มนตรี", major: "CE", score: "60"},
];

// --- ต้องเพิ่มส่วนนี้: สร้างฟังก์ชัน fetchStudentByIdAsync ---
function fetchStudentByIdAsync(id) {
  return new Promise((resolve, reject) => {
    // 1. ตรวจสอบ id ผิดรูปแบบ
    if (typeof id !== "string" || id.trim() === "") {
      return reject(new Error("รหัสนักศึกษาไม่ถูกต้อง"));
    }

    // 2. หน่วงเวลา 300ms ค้นหาข้อมูล
    setTimeout(() => {
      const student = STUDENTS.find((s) => s.id === id);

      // ค้นแล้วไม่พบ
      if (!student) {
        return reject(new Error(`ไม่พบรหัสนักศึกษา ${id}`));
      }

      // พบ -> resolve สำเนา object
      resolve({ ...student });
    }, 300);
  });
}

//ส่วนที่ 3 3 ขั้น ตามสไลด์
fetchStudentByIdAsync("6501")
    .then((studen) => {
        // ขั้นที่ 1: แปลงเป็น {name, grade}
        const grade = studen.score >= 80 ? "A" : "F";
        return {name: studen.name, grade: grade };
    })
    .then((data) => {
        // ขั้นที่ 2: แปลงเป็นข้อความ 
        return `รายงาน: คุณ ${data.name} ได้เกรด ${data.grade}`;
    })
    .then((report) => {
        // ขั้นที่ 3: พิมพ์ออกทาง console
        console.log(report);
    })
    .catch((err) => {
        // ห้ามทิ้ง Promise โดยไม่มี catch
        console.error("เกิดข้อผิดพลาด: ", err.message);
    });