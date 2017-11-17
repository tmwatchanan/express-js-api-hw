## Endpoints ##
- '/' GET: แสดงฟอร์มเพิ่มข้อมูล และข้อมูล customer ทั้งหมด
- '/user' GET: ให้ข้อมูล customer ทั้งหมด
- '/user' POST: เพิ่มข้อมูล customer ใหม่
- '/user/id' GET: ให้ข้อมูล customer ที่ตรงกับ id
- '/user/id' PUT: แก้ข้อมูล customer ที่ตรงกับ id
- '/user/id' DELETE: ลบข้อมูล customer ที่ตรงกับ id

นอกจาก '/' ที่แสดงผลในรูป HTML แล้ว endpoint อื่นๆให้รับค่า และส่งค่ากลับในรูปของ JSON ทั้งหมด
