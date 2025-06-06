// backend/index.js
const express = require("express");
const connectDB = require("./utils/config");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// API route'larını tanımla
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
