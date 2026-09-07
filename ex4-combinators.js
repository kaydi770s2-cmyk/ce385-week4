// 1. เครื่องมือจำลอง (ห้ามแก้ตามโจทย์)
const wait = (ms, value, willFail = false) =>
  new Promise((resolve, reject) => {
    setTimeout(() => (willFail ? reject(new Error(`${value} ล้มเหลว`)) : resolve(value)), ms);
  });

// 2. ฟังก์ชัน Timeout สำหรับข้อ 4
const timeoutPromise = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout เกินเวลาที่กำหนด")), ms)
  );

// ===================================================================
// สถานการณ์ที่ 1: Promise.all
// เหตุผล: ต้องการข้อมูลครบทุกชิ้น ถ้ามีชิ้นไหนล้มให้เปิดหน้าแรกไม่ได้ทันที
// ===================================================================
async function scenario1() {
  console.log("--- สถานการณ์ที่ 1 ---");

  // กรณีสำเร็จหมด
  try {
    const res = await Promise.all([
      wait(300, "โปรไฟล์"),
      wait(400, "ตารางเรียน"),
      wait(500, "ประกาศ"),
    ]);
    console.log(`เปิดหน้าแรก: ${res.join(" + ")}`);
  } catch (error) {
    console.log(`หน้าแรกเปิดไม่ได้: ${error.message}`);
  }

  // กรณีมีชิ้นล้ม (willFail = true)
  try {
    const res = await Promise.all([
      wait(300, "โปรไฟล์"),
      wait(400, "ตารางเรียน"),
      wait(500, "ประกาศ", true),
    ]);
    console.log(`เปิดหน้าแรก: ${res.join(" + ")}`);
  } catch (error) {
    console.log(`หน้าแรกเปิดไม่ได้: ${error.message}`);
  }
  console.log("");
}

// ===================================================================
// สถานการณ์ที่ 2: Promise.allSettled
// เหตุผล: ต้องการรายงานครบทุกช่องทาง ช่องที่ล้มต้องไม่ทำให้กระบวนการทั้งหมดพัง
// ===================================================================
async function scenario2() {
  console.log("--- สถานการณ์ที่ 2 ---");

  const results = await Promise.allSettled([
    wait(300, "อีเมล"),
    wait(500, "SMS", true),
    wait(400, "แอป"),
  ]);

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log(`ส่งสำเร็จ: ${result.value}`);
    } else {
      console.log(`ส่งไม่สำเร็จ: ${result.reason.message}`);
    }
  });
  console.log("");
}

// ===================================================================
// สถานการณ์ที่ 3: Promise.any
// เหตุผล: ดึงจากหลาย Mirror เอาเฉพาะตัวแรกที่ "สำเร็จ" ไม่สนตัวที่ล้มเหลวก่อนหน้า
// ===================================================================
async function scenario3() {
  console.log("--- สถานการณ์ที่ 3 ---");

  try {
    const data = await Promise.any([
      wait(300, "mirror-A", true),
      wait(600, "mirror-B"),
    ]);
    console.log(`ได้ข้อมูลจาก: ${data}`);
  } catch (error) {
    console.log(`ล้มเหลวทุกตัว: ${error.message}`);
  }
  console.log("");
}

// ===================================================================
// สถานการณ์ที่ 4: Promise.race
// เหตุผล: แข่งเวลาตามกำหนด 800ms ตัวไหนเสร็จ/ล้มก่อนเอาตัวนั้น (เกินเวลาตกไปใช้แคช)
// ===================================================================
async function scenario4() {
  console.log("--- สถานการณ์ที่ 4 ---");

  try {
    const data = await Promise.race([
      wait(1200, "ข้อมูลจากฐานข้อมูล"),
      timeoutPromise(800),
    ]);
    console.log(`ได้ข้อมูลจาก: ${data}`);
  } catch (error) {
    console.log(`เกิน 800ms -> เลิกรอ -> ใช้แคชเก่าแทน (${error.message})`);
  }
  console.log("");
}

// ===================================================================
// main()
// ===================================================================
async function main() {
  await scenario1();
  await scenario2();
  await scenario3();
  await scenario4();
}

main();