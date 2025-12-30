require("dotenv").config();
const app = require("./app");
const { connectMongo, bindMongoLogs } = require("./db/mongoose");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    bindMongoLogs();
    await connectMongo();
    
    // Thêm '0.0.0.0' để Render có thể kết nối với ứng dụng của bạn
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`▶ Shoply API live on port ${PORT}`);
    });
  } catch (error) {
    console.error("FAILED TO START SERVER:", error);
    process.exit(1);
  }
})();