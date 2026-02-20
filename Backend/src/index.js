require("dotenv").config();
const app = require("./app");

// Vercel serverless export
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 CBE AI Backend running on port ${PORT}`);
  });
}
