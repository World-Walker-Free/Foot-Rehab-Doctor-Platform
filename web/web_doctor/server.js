const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

// 完整的CORS配置
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的域名列表
    const allowedOrigins = [
      "https://localhost:5173", // 本地开发
      "https://cloud1-0gkrmbmj8a3a8eb4-1380573880.tcloudbaseapp.com", // 云开发域名
      /\.tcloudbaseapp\.com$/, // 允许所有云开发子域名
    ];

    // 允许没有origin的请求（如Postman、移动应用）
    if (!origin) return callback(null, true);

    // 检查是否在允许列表中
    const allowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (allowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error("CORS policy violation"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// 应用CORS中间件（只使用这一个，不要再手动设置）
app.use(cors(corsOptions));

// 请求日志中间件
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`,
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("请求体:", req.body);
  }
  next();
});

// 数据库配置
const dbConfig = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "akr",
  database: process.env.DB_NAME || "FootRehabDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: 1433,
  },
};

// 全局连接池
let pool;

// 初始化数据库连接
async function initDatabase() {
  try {
    console.log("正在连接数据库...");
    pool = await sql.connect(dbConfig);
    console.log("✅ 数据库连接成功");

    // 测试连接
    const result = await pool.request().query("SELECT 1 as test");
    console.log("✅ 数据库测试查询成功");

    return pool;
  } catch (err) {
    console.error("❌ 数据库连接失败:", err.message);
    console.error("详细信息:", err);
    throw err;
  }
}

// 中间件：确保数据库连接
async function ensureDBConnection(req, res, next) {
  try {
    if (!pool) {
      console.log("数据库连接未初始化，正在初始化...");
      await initDatabase();
    }

    if (!pool.connected) {
      console.log("数据库连接断开，重新连接...");
      await pool.connect();
    }

    next();
  } catch (err) {
    console.error("数据库连接错误:", err);
    res.status(500).json({
      error: "数据库连接失败",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

// 1. 健康检查
app.get("/api/health", async (req, res) => {
  try {
    if (!pool) {
      await initDatabase();
    }

    const result = await pool.request().query("SELECT 1 as test");

    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: "CONNECTED",
      message: "数据库连接正常",
    });
  } catch (err) {
    console.error("健康检查失败:", err);
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "DISCONNECTED",
      error: err.message,
    });
  }
});

// 2. 数据库信息
app.get("/api/db-info", async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        @@VERSION as version,
        DB_NAME() as db_name,
        @@SERVERNAME as server_name
    `);

    res.json({
      status: "SUCCESS",
      info: result.recordset[0],
    });
  } catch (err) {
    res.status(500).json({ error: "获取数据库信息失败" });
  }
});

// 3. 获取患者列表
app.get("/api/patients", ensureDBConnection, async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT * FROM patients ORDER BY id");
    console.log(`获取到 ${result.recordset.length} 名患者`);
    res.json(result.recordset);
  } catch (err) {
    console.error("获取患者列表失败:", err);
    res.status(500).json({ error: "获取患者列表失败" });
  }
});

// 4. 获取单个患者
app.get("/api/patients/:id", ensureDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM patients WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("获取患者失败:", err);
    res.status(500).json({ error: "获取患者失败" });
  }
});

// 5. 添加患者
app.post("/api/patients", ensureDBConnection, async (req, res) => {
  try {
    const { name, gender, age, diagnosis, contact, notes } = req.body;

    console.log("添加患者:", req.body);

    // 验证必要字段
    if (!name || !gender || !age || !diagnosis) {
      return res.status(400).json({
        error: "缺少必要参数",
        required: ["name", "gender", "age", "diagnosis"],
      });
    }

    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("gender", sql.NVarChar, gender)
      .input("age", sql.Int, age)
      .input("diagnosis", sql.NVarChar, diagnosis)
      .input("contact", sql.NVarChar, contact || null)
      .input("notes", sql.NVarChar, notes || null).query(`
        INSERT INTO patients (name, gender, age, diagnosis, contact, notes, last_visit)
        OUTPUT INSERTED.*
        VALUES (@name, @gender, @age, @diagnosis, @contact, @notes, GETDATE())
      `);

    console.log("患者添加成功:", result.recordset[0]);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("添加患者失败:", err);
    res.status(500).json({
      error: "添加患者失败",
      details: err.message,
    });
  }
});

// 6. 更新患者
app.put("/api/patients/:id", ensureDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, age, diagnosis, contact, notes } = req.body;

    console.log(`更新患者 ${id}:`, req.body);

    // 验证必要字段
    if (!name || !gender || !age || !diagnosis) {
      return res.status(400).json({
        error: "缺少必要参数",
        required: ["name", "gender", "age", "diagnosis"],
      });
    }

    // 使用参数化查询
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("gender", sql.NVarChar, gender)
      .input("age", sql.Int, age)
      .input("diagnosis", sql.NVarChar, diagnosis)
      .input("contact", sql.NVarChar, contact || null)
      .input("notes", sql.NVarChar, notes || null).query(`
        UPDATE patients 
        SET 
          name = @name,
          gender = @gender,
          age = @age,
          diagnosis = @diagnosis,
          contact = @contact,
          notes = @notes
        WHERE id = @id;
        
        SELECT * FROM patients WHERE id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    console.log("患者更新成功:", result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("更新患者失败:", err);
    res.status(500).json({
      error: "更新患者失败",
      details: err.message,
    });
  }
});

// 7. 删除患者
app.delete("/api/patients/:id", ensureDBConnection, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM patients WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("删除患者失败:", err);
    res.status(500).json({ error: "删除患者失败" });
  }
});

// 8. 测试更新
app.put("/api/patients-test/:id", ensureDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log(`测试更新患者 ${id}，新名称: ${name}`);

    if (!name) {
      return res.status(400).json({ error: "需要提供name参数" });
    }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name).query(`
        UPDATE patients 
        SET name = @name 
        WHERE id = @id;
        
        SELECT * FROM patients WHERE id = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    res.json({
      success: true,
      message: "测试更新成功",
      patient: result.recordset[0],
    });
  } catch (err) {
    console.error("测试更新失败:", err);
    res.status(500).json({
      error: "测试更新失败",
      details: err.message,
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({
    error: "服务器内部错误",
    message: err.message,
  });
});

// 404处理
app.use("*", (req, res) => {
  res.status(404).json({
    error: "端点不存在",
    path: req.originalUrl,
    method: req.method,
  });
});

// 启动服务器
const PORT = 3001;

async function startServer() {
  try {
    // 初始化数据库
    await initDatabase();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log("\n📊 可用端点:");
      console.log(`  GET  http://localhost:${PORT}/api/health`);
      console.log(`  GET  http://localhost:${PORT}/api/db-info`);
      console.log(`  GET  http://localhost:${PORT}/api/patients`);
      console.log(`  GET  http://localhost:${PORT}/api/patients/:id`);
      console.log(`  POST http://localhost:${PORT}/api/patients`);
      console.log(`  PUT  http://localhost:${PORT}/api/patients/:id`);
      console.log(
        `  PUT  http://localhost:${PORT}/api/patients-test/:id (测试用)`,
      );
      console.log(`  DELETE http://localhost:${PORT}/api/patients/:id`);
    });
  } catch (err) {
    console.error("❌ 服务器启动失败:", err);
    process.exit(1);
  }
}

// 优雅关闭
process.on("SIGINT", async () => {
  console.log("正在关闭服务器...");
  if (pool) {
    await pool.close();
    console.log("数据库连接已关闭");
  }
  process.exit(0);
});

// 启动服务器
startServer();
