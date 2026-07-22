const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
  console.log(
    `${new Date().toLocaleTimeString()} - ${req.method} ${req.originalUrl}`,
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }
  next();
});

// 数据库配置
const config = {
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
let pool = null;

// 初始化数据库连接
async function initPool() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ 数据库连接成功");
    }
    return pool;
  } catch (err) {
    console.error("❌ 数据库连接失败:", err.message);
    throw err;
  }
}

// 健康检查
app.get("/api/health", async (req, res) => {
  try {
    await initPool();
    res.json({ status: "OK", database: "CONNECTED" });
  } catch (err) {
    res
      .status(500)
      .json({ status: "ERROR", database: "DISCONNECTED", error: err.message });
  }
});

// 获取患者列表
app.get("/api/patients", async (req, res) => {
  try {
    await initPool();
    const result = await sql.query`SELECT * FROM patients ORDER BY id`;
    res.json(result.recordset);
  } catch (err) {
    console.error("获取患者列表失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 获取单个患者
app.get("/api/patients/:id", async (req, res) => {
  try {
    await initPool();
    const result =
      await sql.query`SELECT * FROM patients WHERE id = ${req.params.id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("获取患者失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 添加或更新康复数据

app.post("/api/recovery-data", async (req, res) => {
  try {
    const { patient_id, stability_level, pain_level, record_date } = req.body;

    if (!patient_id) {
      return res.status(400).json({ error: "患者ID不能为空" });
    }

    await initPool();

    // 检查是否已有当天的记录
    const existing = await sql.query`
      SELECT id FROM RecoveryData 
      WHERE patient_id = ${patient_id} 
      AND record_date = ${record_date || new Date().toISOString().split("T")[0]}
    `;

    let result;
    if (existing.recordset.length > 0) {
      // 更新现有康复记录
      result = await sql.query`
        UPDATE RecoveryData 
        SET 
          stability_level = ${stability_level ?? null},
          pain_level = ${pain_level ?? null}
        WHERE id = ${existing.recordset[0].id}
        OUTPUT INSERTED.*
      `;
    } else {
      // 插入新康复记录
      result = await sql.query`
        INSERT INTO RecoveryData (patient_id, record_date, stability_level, pain_level)
        OUTPUT INSERTED.*
        VALUES (${patient_id}, ${
        record_date || new Date().toISOString().split("T")[0]
      }, 
        ${stability_level ?? null}, ${pain_level ?? null})
      `;
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("保存康复数据失败:", err);
    res.status(500).json({ error: err.message });
  }
});
// 添加患者
app.post("/api/patients", async (req, res) => {
  try {
    const {
      name,
      gender,
      age,
      diagnosis,
      contact,
      notes,
      doctor,
      total_train_times,
      success_times,
      success_rate,
      stability_level,
      pain_level,
    } = req.body;

    console.log("添加患者请求:", req.body);

    // 验证必要字段
    if (!name) return res.status(400).json({ error: "姓名不能为空" });
    if (!gender) return res.status(400).json({ error: "性别不能为空" });
    if (!age) return res.status(400).json({ error: "年龄不能为空" });
    if (!diagnosis) return res.status(400).json({ error: "诊断不能为空" });

    await initPool();

    // 按照原有写法插入数据
    const result = await sql.query`
      INSERT INTO patients (
        name, gender, age, diagnosis, contact, notes, doctor, 
        total_train_times, success_times, success_rate, stability_level, pain_level,
        status, admission_date, last_visit
      )
      OUTPUT INSERTED.*
      VALUES (
        ${name}, 
        ${gender}, 
        ${age}, 
        ${diagnosis}, 
        ${contact || null}, 
        ${notes || null}, 
        ${doctor || "张医生"},
        ${total_train_times !== undefined ? total_train_times : 0},
        ${success_times !== undefined ? success_times : 0},
        ${success_rate !== undefined ? success_rate : 0},
        ${stability_level || null},
        ${pain_level !== undefined ? pain_level : 0},
        'active',
        GETDATE(),
        GETDATE()
      )
    `;

    console.log("添加成功:", result.recordset[0]);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("添加患者失败:", err);
    res.status(500).json({
      error: "添加患者失败",
      details: err.message,
    });
  }
});

// 更新患者

app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      age,
      diagnosis,
      contact,
      notes,
      doctor,
      total_train_times,
      success_times,
      success_rate,
      stability_level,
      pain_level,
    } = req.body;

    console.log(`更新患者 ${id}:`, req.body);

    // 验证必要字段
    if (!name) return res.status(400).json({ error: "姓名不能为空" });
    if (!gender) return res.status(400).json({ error: "性别不能为空" });
    if (!age) return res.status(400).json({ error: "年龄不能为空" });
    if (!diagnosis) return res.status(400).json({ error: "诊断不能为空" });

    await initPool();

    // 检查患者是否存在
    const checkResult =
      await sql.query`SELECT id FROM patients WHERE id = ${id}`;
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    await sql.query`
      UPDATE patients 
      SET 
        name = ${name},
        gender = ${gender},
        age = ${age},
        diagnosis = ${diagnosis},
        contact = ${contact || null},
        notes = ${notes || null},
        doctor = ${doctor || "张医生"},
        total_train_times = ${
          total_train_times !== undefined ? total_train_times : null
        },
        success_times = ${success_times !== undefined ? success_times : null},
        success_rate = ${success_rate !== undefined ? success_rate : null},
        stability_level = ${stability_level || null},
        pain_level = ${pain_level !== undefined ? pain_level : null},
        last_visit = GETDATE()
      WHERE id = ${id}
    `;

    // 获取更新后的数据
    const result = await sql.query`SELECT * FROM patients WHERE id = ${id}`;

    console.log("更新成功:", result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("更新患者失败:", err);
    res.status(500).json({
      error: "更新患者失败",
      details: err.message,
    });
  }
});

app.get("/api/patients/:id/detail", async (req, res) => {
  try {
    const { id } = req.params;

    await initPool();

    // 获取患者基本信息
    const patientResult = await sql.query`
      SELECT * FROM patients WHERE id = ${id}
    `;

    if (patientResult.recordset.length === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    const patient = patientResult.recordset[0];

    // 获取最新的恢复数据
    const recoveryResult = await sql.query`
      SELECT TOP 1 stability_level, pain_level, record_date
      FROM RecoveryData 
      WHERE patient_id = ${id}
      ORDER BY record_date DESC
    `;

    const latestRecovery = recoveryResult.recordset[0] || {
      stability_level: null,
      pain_level: null,
      record_date: null,
    };

    res.json({
      ...patient,
      stability_level: latestRecovery.stability_level,
      pain_level: latestRecovery.pain_level,
      last_recovery_date: latestRecovery.record_date,
    });
  } catch (err) {
    console.error("获取患者详情失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 删除患者
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await initPool();

    const result = await sql.query`DELETE FROM patients WHERE id = ${id}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("删除患者失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 404处理
app.use("*", (req, res) => {
  res.status(404).json({ error: "API不存在", path: req.originalUrl });
});

// 启动服务器
const PORT = 3001;

async function startServer() {
  try {
    await initPool();

    app.listen(PORT, () => {
      console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
      console.log("\n📊 可用端点:");
      console.log("  GET    /api/patients");
      console.log("  GET    /api/patients/:id");
      console.log("  POST   /api/patients");
      console.log("  PUT    /api/patients/:id");
      console.log("  DELETE /api/patients/:id");
      console.log("  GET    /api/health\n");
    });
  } catch (err) {
    console.error("服务器启动失败:", err);
    process.exit(1);
  }
}

startServer();
