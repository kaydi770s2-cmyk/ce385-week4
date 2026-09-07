const STUDENTS = [
  {id: "6501", name: "สมชาย", major: "CE", score: "78"},
  {id: "6502", name: "สมหญิง", major: "CE", score: "91"},
  {id: "6503", name: "สมปอง", major: "IT", score: "80"},
  {id: "6504", name: "มนตรี", major: "CE", score: "60"},
];

function fetchStudentById(id, callback) {
  if (typeof id !== "string" || id.trim() === "") {
    callback(new Error("รหัสนักศึกษาไม่ถูกต้อง"));
    return;
  }

  setTimeout(() => {
    // แก้ไขจุดที่ 1: เปลี่ยน student.find เป็น STUDENTS.find
    const student = STUDENTS.find((s) => s.id === id);

    if (!student) {
      // แก้ไขจุดที่ 2: เปลี่ยน &{id} เป็น ${id}
      callback(new Error(`ไม่พบรหัสนักศึกษา ${id}`));
      return;
    }

    callback(null, { ...student });
  }, 300);
}

// --------------------------------------------------------
// ส่วนเรียกใช้งาน (แก้ไขค่า id ในกรณี ข. ให้เป็นรหัสที่ไม่มีจริงด้วยครับ)

// ก) id ที่มีจริง
fetchStudentById("6501", (error, student) => {
  if (error) {
    console.error("Error (ก): ", error.message);
    return;
  }
  console.log("Success (ก):", student);
});

// ข) id ที่ไม่มีจริง (เปลี่ยนจาก "6502" เป็นรหัสอื่น เช่น "9999")
fetchStudentById("9999", (error, student) => {
  if (error) {
    console.error("Error (ข): ", error.message);
    return;
  }
  console.log("Success (ข): ", student);
});

// ค) id ผิดรูปแบบ
fetchStudentById(42, (error, student) => {
  if (error) {
    console.error("Error (ค): ", error.message);
    return;
  }
  console.log("Success (ค): ", student);
});