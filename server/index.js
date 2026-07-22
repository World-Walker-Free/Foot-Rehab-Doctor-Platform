const express = require("express");
const cors = require("cors");
const cloudbase = require("@cloudbase/node-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const cloudApp = cloudbase.init({
  env: "cloud1-0gkrmbmj8a3a8eb4",
  secretId: process.env.CLOUDBASE_SECRET_ID,
  secretKey: process.env.CLOUDBASE_SECRET_KEY,
});

const db = cloudApp.database();
const _ = db.command;

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }
  next();
});

// 获取下一个数字ID
async function getNextUserId() {
  try {
    const { data } = await db
      .collection("Patients")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    if (data.length === 0) {
      return 1;
    }
    return data[0].id + 1;
  } catch (err) {
    console.error("获取下一个ID失败:", err);
    return Date.now();
  }
}

// 转换患者数据格式
function transformPatient(patient) {
  return {
    id: patient.id,
    name: patient.name,
    gender: patient.gender,
    age: patient.age,
    diagnosis: patient.diagnosis || "暂无诊断",
    contact: patient.contact || "",
    notes: patient.notes || "",
    doctor: patient.doctor || "张医生",
    status: patient.status || "active",
    total_train_times: patient.total_train_times || 0,
    success_times: patient.success_times || 0,
    success_rate: patient.success_rate || 0,
    stability_level: patient.stability_level || "",
    pain_level: patient.pain_level || 0,
    medical_num: patient.medical_num || null,
    admission_date: patient.admission_date,
    last_visit: patient.last_visit,
    _id: patient._id,
    // 角度字段
    left_down_angle_max: patient.left_down_angle_max || null,
    left_down_angle_min: patient.left_down_angle_min || null,
    left_up_angle_max: patient.left_up_angle_max || null,
    left_up_angle_min: patient.left_up_angle_min || null,
    left_inner_angle_max: patient.left_inner_angle_max || null,
    left_inner_angle_min: patient.left_inner_angle_min || null,
    left_outer_angle_max: patient.left_outer_angle_max || null,
    left_outer_angle_min: patient.left_outer_angle_min || null,
    right_down_angle_max: patient.right_down_angle_max || null,
    right_down_angle_min: patient.right_down_angle_min || null,
    right_up_angle_max: patient.right_up_angle_max || null,
    right_up_angle_min: patient.right_up_angle_min || null,
    right_inner_angle_max: patient.right_inner_angle_max || null,
    right_inner_angle_min: patient.right_inner_angle_min || null,
    right_outer_angle_max: patient.right_outer_angle_max || null,
    right_outer_angle_min: patient.right_outer_angle_min || null,
    left_dorsiflexion_count: patient.left_dorsiflexion_count || 0,
    left_plantarflexion_count: patient.left_plantarflexion_count || 0,
    left_inversion_count: patient.left_inversion_count || 0,
    left_eversion_count: patient.left_eversion_count || 0,
    right_dorsiflexion_count: patient.right_dorsiflexion_count || 0,
    right_plantarflexion_count: patient.right_plantarflexion_count || 0,
    right_inversion_count: patient.right_inversion_count || 0,
    right_eversion_count: patient.right_eversion_count || 0,
  };
}

app.get("/api/health", async (req, res) => {
  try {
    await db.collection("Patients").limit(1).get();
    res.json({ status: "OK", database: "CLOUDBASE_CONNECTED" });
  } catch (err) {
    console.error("健康检查失败:", err);
    res
      .status(500)
      .json({ status: "ERROR", database: "DISCONNECTED", error: err.message });
  }
});

// 获取患者列表
app.get("/api/patients", async (req, res) => {
  try {
    const { data } = await db.collection("Patients").orderBy("id", "asc").get();
    const patients = data.map(transformPatient);
    console.log(`获取患者列表成功，共 ${patients.length} 条`);
    res.json(patients);
  } catch (err) {
    console.error("获取患者列表失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 获取单个患者
app.get("/api/patients/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const { data } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (data.length === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    res.json(transformPatient(data[0]));
  } catch (err) {
    console.error("获取患者失败:", err);
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

    if (!name) return res.status(400).json({ error: "姓名不能为空" });
    if (!gender) return res.status(400).json({ error: "性别不能为空" });
    if (!age) return res.status(400).json({ error: "年龄不能为空" });

    const nextId = await getNextUserId();

    await db.collection("Patients").add({
      id: nextId,
      name,
      gender,
      age: parseInt(age),
      diagnosis: diagnosis || "暂无诊断",
      contact: contact || "",
      notes: notes || "",
      doctor: doctor || "张医生",
      total_train_times:
        total_train_times !== undefined ? total_train_times : 0,
      success_times: success_times !== undefined ? success_times : 0,
      success_rate: success_rate !== undefined ? success_rate : 0,
      stability_level: stability_level || "",
      pain_level: pain_level !== undefined ? pain_level : 0,
      status: "active",
      admission_date: new Date(),
      last_visit: new Date(),
      // 角度字段默认值
      left_down_angle_max: null,
      left_down_angle_min: null,
      left_up_angle_max: null,
      left_up_angle_min: null,
      left_inner_angle_max: null,
      left_inner_angle_min: null,
      left_outer_angle_max: null,
      left_outer_angle_min: null,
      right_down_angle_max: null,
      right_down_angle_min: null,
      right_up_angle_max: null,
      right_up_angle_min: null,
      right_inner_angle_max: null,
      right_inner_angle_min: null,
      right_outer_angle_max: null,
      right_outer_angle_min: null,
      left_dorsiflexion_count: 0,
      left_plantarflexion_count: 0,
      left_inversion_count: 0,
      left_eversion_count: 0,
      right_dorsiflexion_count: 0,
      right_plantarflexion_count: 0,
      right_inversion_count: 0,
      right_eversion_count: 0,
    });

    console.log("添加成功，ID:", nextId);
    res.status(201).json({
      id: nextId,
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
    });
  } catch (err) {
    console.error("添加患者失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 更新患者
app.put("/api/patients/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const updateData = req.body;

    console.log(`更新患者 ${patientId}:`, updateData);

    const { data: existingPatients } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (existingPatients.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    const patientDoc = existingPatients[0];

    await db
      .collection("Patients")
      .doc(patientDoc._id)
      .update({
        ...updateData,
        last_visit: new Date(),
      });

    console.log("更新成功");
    res.json({ id: patientId, ...updateData });
  } catch (err) {
    console.error("更新患者失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============ 患者角度数据管理 ============

// 更新患者角度数据（训练角度和次数）
app.put("/api/patients/:id/angles", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const angleData = req.body;

    console.log(`更新患者 ${patientId} 的角度数据:`, angleData);

    const { data: existingPatients } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (existingPatients.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    const patientDoc = existingPatients[0];

    // 构建更新数据
    const updateFields = {};

    // 左脚角度
    if (angleData.left_down_angle_max !== undefined) {
      updateFields.left_down_angle_max = angleData.left_down_angle_max;
    }
    if (angleData.left_down_angle_min !== undefined) {
      updateFields.left_down_angle_min = angleData.left_down_angle_min;
    }
    if (angleData.left_up_angle_max !== undefined) {
      updateFields.left_up_angle_max = angleData.left_up_angle_max;
    }
    if (angleData.left_up_angle_min !== undefined) {
      updateFields.left_up_angle_min = angleData.left_up_angle_min;
    }
    if (angleData.left_inner_angle_max !== undefined) {
      updateFields.left_inner_angle_max = angleData.left_inner_angle_max;
    }
    if (angleData.left_inner_angle_min !== undefined) {
      updateFields.left_inner_angle_min = angleData.left_inner_angle_min;
    }
    if (angleData.left_outer_angle_max !== undefined) {
      updateFields.left_outer_angle_max = angleData.left_outer_angle_max;
    }
    if (angleData.left_outer_angle_min !== undefined) {
      updateFields.left_outer_angle_min = angleData.left_outer_angle_min;
    }

    // 右脚角度
    if (angleData.right_down_angle_max !== undefined) {
      updateFields.right_down_angle_max = angleData.right_down_angle_max;
    }
    if (angleData.right_down_angle_min !== undefined) {
      updateFields.right_down_angle_min = angleData.right_down_angle_min;
    }
    if (angleData.right_up_angle_max !== undefined) {
      updateFields.right_up_angle_max = angleData.right_up_angle_max;
    }
    if (angleData.right_up_angle_min !== undefined) {
      updateFields.right_up_angle_min = angleData.right_up_angle_min;
    }
    if (angleData.right_inner_angle_max !== undefined) {
      updateFields.right_inner_angle_max = angleData.right_inner_angle_max;
    }
    if (angleData.right_inner_angle_min !== undefined) {
      updateFields.right_inner_angle_min = angleData.right_inner_angle_min;
    }
    if (angleData.right_outer_angle_max !== undefined) {
      updateFields.right_outer_angle_max = angleData.right_outer_angle_max;
    }
    if (angleData.right_outer_angle_min !== undefined) {
      updateFields.right_outer_angle_min = angleData.right_outer_angle_min;
    }

    // 次数
    if (angleData.left_dorsiflexion_count !== undefined) {
      updateFields.left_dorsiflexion_count = angleData.left_dorsiflexion_count;
    }
    if (angleData.left_plantarflexion_count !== undefined) {
      updateFields.left_plantarflexion_count =
        angleData.left_plantarflexion_count;
    }
    if (angleData.left_inversion_count !== undefined) {
      updateFields.left_inversion_count = angleData.left_inversion_count;
    }
    if (angleData.left_eversion_count !== undefined) {
      updateFields.left_eversion_count = angleData.left_eversion_count;
    }
    if (angleData.right_dorsiflexion_count !== undefined) {
      updateFields.right_dorsiflexion_count =
        angleData.right_dorsiflexion_count;
    }
    if (angleData.right_plantarflexion_count !== undefined) {
      updateFields.right_plantarflexion_count =
        angleData.right_plantarflexion_count;
    }
    if (angleData.right_inversion_count !== undefined) {
      updateFields.right_inversion_count = angleData.right_inversion_count;
    }
    if (angleData.right_eversion_count !== undefined) {
      updateFields.right_eversion_count = angleData.right_eversion_count;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "没有要更新的角度数据" });
    }

    updateFields.last_visit = new Date();

    await db.collection("Patients").doc(patientDoc._id).update(updateFields);

    console.log(`患者 ${patientId} 角度数据更新成功`);

    const { data: updatedPatient } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    res.json({
      success: true,
      message: "角度数据更新成功",
      data: transformPatient(updatedPatient[0]),
    });
  } catch (err) {
    console.error("更新角度数据失败:", err);
    res.status(500).json({
      error: "更新角度数据失败",
      details: err.message,
    });
  }
});

// 获取患者角度数据
app.get("/api/patients/:id/angles", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);

    const { data: patients } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (patients.length === 0) {
      return res.status(404).json({ error: "患者不存在" });
    }

    const patient = patients[0];

    res.json({
      id: patient.id,
      left_down_angle_max: patient.left_down_angle_max ?? null,
      left_down_angle_min: patient.left_down_angle_min ?? null,
      left_up_angle_max: patient.left_up_angle_max ?? null,
      left_up_angle_min: patient.left_up_angle_min ?? null,
      left_inner_angle_max: patient.left_inner_angle_max ?? null,
      left_inner_angle_min: patient.left_inner_angle_min ?? null,
      left_outer_angle_max: patient.left_outer_angle_max ?? null,
      left_outer_angle_min: patient.left_outer_angle_min ?? null,
      right_down_angle_max: patient.right_down_angle_max ?? null,
      right_down_angle_min: patient.right_down_angle_min ?? null,
      right_up_angle_max: patient.right_up_angle_max ?? null,
      right_up_angle_min: patient.right_up_angle_min ?? null,
      right_inner_angle_max: patient.right_inner_angle_max ?? null,
      right_inner_angle_min: patient.right_inner_angle_min ?? null,
      right_outer_angle_max: patient.right_outer_angle_max ?? null,
      right_outer_angle_min: patient.right_outer_angle_min ?? null,
      left_dorsiflexion_count: patient.left_dorsiflexion_count ?? 0,
      left_plantarflexion_count: patient.left_plantarflexion_count ?? 0,
      left_inversion_count: patient.left_inversion_count ?? 0,
      left_eversion_count: patient.left_eversion_count ?? 0,
      right_dorsiflexion_count: patient.right_dorsiflexion_count ?? 0,
      right_plantarflexion_count: patient.right_plantarflexion_count ?? 0,
      right_inversion_count: patient.right_inversion_count ?? 0,
      right_eversion_count: patient.right_eversion_count ?? 0,
    });
  } catch (err) {
    console.error("获取角度数据失败:", err);
    res.status(500).json({ error: "获取角度数据失败" });
  }
});

// 删除患者
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);

    const { data: existingPatients } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (existingPatients.length === 0) {
      return res.status(404).json({ error: "患者未找到" });
    }

    await db.collection("Patients").doc(existingPatients[0]._id).remove();

    console.log("删除成功");
    res.status(204).send();
  } catch (err) {
    console.error("删除患者失败:", err);
    res.status(500).json({ error: err.message });
  }
});

// 获取恢复数据
app.get("/api/recovery-data/:patientId", async (req, res) => {
  try {
    const patientId = parseInt(req.params.patientId);

    const { data: patients } = await db
      .collection("Patients")
      .where({ id: patientId })
      .get();

    if (patients.length === 0) {
      return res.json([]);
    }

    const patient = patients[0];
    res.json([
      {
        patient_id: patientId,
        stability_level: patient.stability_level,
        pain_level: patient.pain_level,
        record_date: patient.last_visit || new Date(),
      },
    ]);
  } catch (err) {
    console.error("获取恢复数据失败:", err);
    res.json([]);
  }
});

// 登录接口
app.post("/api/auth/login", async (req, res) => {
  try {
    const { account, password } = req.body;

    console.log("登录请求:", { account, password: "***" });

    if (!account || !password) {
      return res.status(400).json({
        success: false,
        error: "账号/手机号/邮箱和密码不能为空",
      });
    }

    const { data } = await db
      .collection("Doctor")
      .where(_.or([{ phone: account }, { email: account }]))
      .get();

    console.log("查询结果数量:", data.length);

    if (data.length === 0) {
      return res.status(401).json({
        success: false,
        error: "账号不存在",
      });
    }

    const doctor = data[0];

    if (doctor.password !== password) {
      return res.status(401).json({
        success: false,
        error: "密码错误",
      });
    }

    const token = Buffer.from(`${doctor._id}:${Date.now()}`).toString("base64");

    res.json({
      success: true,
      token: token,
      user: {
        id: doctor._id,
        name: doctor.name,
        phone: doctor.phone,
        email: doctor.email,
        role: doctor.role || "doctor",
        avatar: doctor.avatar || "",
      },
    });
  } catch (err) {
    console.error("登录失败:", err);
    res.status(500).json({
      success: false,
      error: "登录失败: " + err.message,
    });
  }
});

// 注册接口
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, account, password } = req.body;

    console.log("注册请求:", { name, account, password: "***" });

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "姓名不能为空",
      });
    }

    if (!account || !account.trim()) {
      return res.status(400).json({
        success: false,
        error: "邮箱或手机号不能为空",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "密码长度不能少于6位",
      });
    }

    const isEmail = account.includes("@");
    const queryField = isEmail ? "email" : "phone";

    const { data: existingUsers } = await db
      .collection("Doctor")
      .where({
        [queryField]: account.trim(),
      })
      .get();

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: `${isEmail ? "邮箱" : "手机号"}已被注册，请使用其他账号`,
      });
    }

    let doctorData = {
      name: name.trim(),
      password: password,
      role: "doctor",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isEmail) {
      doctorData.email = account.trim();
      doctorData.phone = "";
    } else {
      doctorData.phone = account.trim();
      doctorData.email = "";
    }

    const result = await db.collection("Doctor").add(doctorData);

    console.log("注册成功，ID:", result.id);

    const token = Buffer.from(`${result.id}:${Date.now()}`).toString("base64");

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: result.id,
        name: doctorData.name,
        email: doctorData.email,
        phone: doctorData.phone,
        role: doctorData.role,
      },
      message: "注册成功",
    });
  } catch (err) {
    console.error("注册失败:", err);
    res.status(500).json({
      success: false,
      error: "注册失败: " + err.message,
    });
  }
});

// 获取当前医生信息
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "未提供认证信息",
      });
    }

    res.json({
      success: true,
      user: null,
    });
  } catch (err) {
    console.error("获取用户信息失败:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 登出接口
app.post("/api/auth/logout", async (req, res) => {
  try {
    res.json({
      success: true,
      message: "登出成功",
    });
  } catch (err) {
    console.error("登出失败:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 数据库测试端点
app.get("/api/db-test", async (req, res) => {
  try {
    const { data } = await db.collection("Patients").limit(1).get();
    res.json({
      status: "SUCCESS",
      database: "CloudBase",
      message: "云开发数据库连接成功",
      sampleCount: data.length,
    });
  } catch (err) {
    res.status(500).json({
      status: "DB_CONNECTION_FAILED",
      error: err.message,
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: "API不存在", path: req.originalUrl });
});

const PORT = process.env.PORT || 3001; ///9000  3001

app.listen(PORT, () => {
  console.log(`\n🚀 HTTP云函数运行在端口 ${PORT}`);
  console.log("\n📊 可用端点:");
  console.log("  GET    /api/patients");
  console.log("  GET    /api/patients/:id");
  console.log("  POST   /api/patients");
  console.log("  PUT    /api/patients/:id");
  console.log("  PUT    /api/patients/:id/angles  ← 更新角度数据");
  console.log("  GET    /api/patients/:id/angles  ← 获取角度数据");
  console.log("  DELETE /api/patients/:id");
  console.log("  GET    /api/health");
  console.log("  GET    /api/db-test\n");
  console.log("📁 数据来源: 云开发数据库 (CloudBase)");
  console.log("   环境ID: cloud1-0gkrmbmj8a3a8eb4\n");
});
