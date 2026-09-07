const STUDENTS = [
  { id: "6501", name: "สมชาย", major: "CE", score: 78 },
  { id: "6502", name: "สมหญิง", major: "CE", score: 91 },
  { id: "6503", name: "สมปอง", major: "IT", score: 80 },
  { id: "6504", name: "มนตรี", major: "CE", score: 60 }
];

// ฟังก์ชันคืน Promise จากข้อ 2
function fetchStudentByIdAsync(id) {
  return new Promise((resolve, reject) => {
    if (typeof id !== "string" || id.trim() === "") {
      return reject(new Error("รหัสนักศึกษาไม่ถูกต้อง"));
    }

    setTimeout(() => {
      const student = STUDENTS.find((s) => s.id === id);

      if (!student) {
        return reject(new Error(`ไม่พบรหัสนักศึกษา ${id}`));
      }

      resolve({ ...student });
    }, 300);
  });
}

const studenIds = ["6501", "6502", "6503"];

// ===================================================================
// ส่วนที่ 1 — reportSequential()
// ===================================================================
async function reportSequential () {
    console.log("--- เริ่มส่วนที่ 1: reportSequential ---");
    const startTime = Date.now();

    for (const id of studenIds) {
        const student = await fetchStudentByIdAsync(id);
        // ตัดเกรด
        const grade = Number(student.score) >= 80 ? "A" : "F";
        console.log(`พบข้อมูล: ${student.name} (เกรด ${grade})`);
    }

    const duration = Date.now() - startTime;
    console.log(`ส่วนที่ 1 ใช้เวลาไป: ${duration} ms\n`);
    return duration;
}

// ===================================================================
// ส่วนที่ 2 — reportParallel()
// ===================================================================
async function reportParallel(seqDuratio) {
    console.log("--- เริ่มส่วนที่ 2: reportParallel ---");
    const startTime = Date.now();

    const Promise = studenIds.map((id) => fetchStudentByIdAsync(id));
    const students = await Promise.toLocaleString(Promise);

    STUDENTS.forEach((student) => {
        const grade = Number(student.score) >= 80 ? "A" : "F";
        console.log(`พบข้อมูล: ${student.name} (เกรด ${grade})`);
    });

    const duration = Date.now() - startTime;
    const speedup = (seqDuratio / duration).toFixed(2);

    console.log(`ส่วนที่ 2 ใช้เวลาไป: ${duration} ms`);
    console.log(`เร็วขึ้นกว่าแบบแรกประมาณ ${speedup} เท่า\n`);
}

// ===================================================================
// ส่วนที่ 3 — safeReport(id)
// ===================================================================
async function safeReport(id) {
    try {
        const student = await fetchStudentByIdAsync(id);
        // ตัดเกรด
        const grade = Number(student.score) >= 80 ? "A" : "F";
        console.log(`พบข้อมูล: ${student.name} (เกรด ${grade})`);
    }catch (error) {
        console.log(`ตรวจไม่พบ: ${error.message}`);
    }finally {
        console.log(`--- จบการตรวจสอบ ${id} ---`);
    }
}

// ===================================================================
// main()
// ===================================================================
async function main() {
    const seqTime = await reportSequential();
    await reportParallel(seqTime);

    console.log("--- เริ่มส่วนที่ 3: safeReport --- ");
    await safeReport("6501");
    await safeReport("9999");
    await safeReport(42);
}

main();
/*
===================================================================
ส่วนที่ 4 — ตอบคำถามเป็น comment ท้ายไฟล์:
===================================================================
1) ทำไม try-catch ครอบ await จับ reject ได้ แต่ครอบการเรียก callback ธรรมดาไม่ได้?
   - เพราะ await จะแปลงสถานะ reject ของ Promise ให้กลายเป็น Exception (Throw Error) 
     ใน Synchronous Flow ทำให้ try-catch ปกติจับได้
   - ส่วน Callback ธรรมดาทำงานอยู่ใน Event Loop แบบ Asynchronous ซึ่งรันนอก Execution Context 
     ของ try-catch ไปแล้ว จึงจับ Error ไม่ได้

2) ทดลอง "ลืม await" หน้า Promise.all แล้วเอาผลไปใช้ต่อ — เกิดอะไรขึ้น เขียนคำอธิบายประกอบ:
   - ผลลัพธ์ที่ได้จะเป็น Promise Object ที่อยู่ในสถานะ <pending> ไม่ใช่ Array ของข้อมูลนักศึกษาจริง
   - เมื่อนำไปใช้ต่อ เช่น เข้าถึงค่าข้างในจะกลายเป็น undefined หรือรันต่อทันทีโดยไม่รอให้การดึงข้อมูลเสร็จ ทำให้วัดเวลาทำงานผิดพลาด
===================================================================
*/