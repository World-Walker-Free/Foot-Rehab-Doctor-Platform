const sql = require("mssql");

const config = {
  user: process.env.DB_USER || "web_user",
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "FootRehabDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function testConnection() {
  try {
    // 连接数据库
    await sql.connect(config);
    console.log("✅ 数据库连接成功！");

    // 测试查询
    const result = await sql.query`SELECT TOP 5 * FROM Patients`;
    console.log("前5名患者:");
    console.table(result.recordset);
  } catch (err) {
    console.error("❌ 连接失败:", err);
  } finally {
    // 关闭连接
    sql.close();
  }
}

testConnection();
