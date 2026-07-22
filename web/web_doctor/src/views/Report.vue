<template>
  <div class="report-container">
    <div class="report-header">
      <h2>康复训练评估报告</h2>
      <div class="header-actions">
        <button class="btn btn-outline-primary" @click="toggleEditMode">
          <i class="bi" :class="isEditing ? 'bi-eye' : 'bi-pencil'"></i>
          {{ isEditing ? "预览" : "编辑" }}
        </button>
        <button class="btn btn-primary" @click="exportToPDF">
          <i class="bi bi-file-pdf"></i> 导出PDF
        </button>
        <button class="btn btn-success" @click="generateReport">
          <i class="bi bi-robot"></i> AI生成报告
        </button>
      </div>
    </div>

    <div class="report-content" ref="reportContent">
      <!-- 报告封面头部 -->
      <div class="report-cover">
        <div class="cover-left">
          <div class="hospital-logo">
            <i class="bi bi-hospital"></i>
          </div>
          <div class="hospital-info">
            <h1>康复医学科</h1>
            <p>足部康复训练评估报告</p>
          </div>
        </div>
        <div class="cover-right">
          <div class="report-meta">
            <div class="meta-item">
              <span class="meta-label">报告编号</span>
              <span class="meta-value"
                >RPT-{{ String(patient.id || 0).padStart(6, "0") }}</span
              >
            </div>
            <div class="meta-item">
              <span class="meta-label">报告日期</span>
              <span class="meta-value">{{ reportDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">主治医生</span>
              <span class="meta-value">{{ doctorName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 患者基本信息 -->
      <div class="section patient-info">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-person-badge"></i>
          </div>
          <h3>一、患者基本信息</h3>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-item">
              <span class="label">姓名</span>
              <span class="value highlight">{{
                patient.name || "未填写"
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">性别</span>
              <span class="value">{{ patient.gender || "未填写" }}</span>
            </div>
            <div class="info-item">
              <span class="label">年龄</span>
              <span class="value">{{
                patient.age ? patient.age + "岁" : "未填写"
              }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">病历号</span>
              <span class="value">{{ patient.medicalRecord || "未设置" }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">诊断结果</span>
              <span class="value diagnosis">{{
                patient.diagnosis || "暂无"
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合评估概览 -->
      <div class="section overview-section">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-clipboard2-pulse"></i>
          </div>
          <h3>二、综合评估概览</h3>
        </div>
        <div class="overview-cards">
          <div
            class="overview-card"
            :class="getSuccessRateClass(patient.success_rate)"
          >
            <div class="card-header">
              <i class="bi bi-bullseye"></i>
              <span>训练完成度</span>
            </div>
            <div class="card-value">
              {{ formatPercentage(patient.success_rate) }}%
            </div>
            <div class="card-status">
              {{ getSuccessRateLevel(patient.success_rate) }}
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (patient.success_rate || 0) + '%' }"
              ></div>
            </div>
          </div>
          <div
            class="overview-card"
            :class="getStabilityClass(patient.stability_level)"
          >
            <div class="card-header">
              <i class="bi bi-shield-check"></i>
              <span>稳定性指数</span>
            </div>
            <div class="card-value">
              {{ formatNumber(patient.stability_level) }}<small>/100</small>
            </div>
            <div class="card-status">
              {{ getStabilityLevel(patient.stability_level) }}
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (patient.stability_level || 0) + '%' }"
              ></div>
            </div>
          </div>
          <div class="overview-card" :class="getPainClass(patient.pain_level)">
            <div class="card-header">
              <i class="bi bi-activity"></i>
              <span>疼痛指数</span>
            </div>
            <div class="card-value">
              {{ formatNumber(patient.pain_level) }}<small>/10</small>
            </div>
            <div class="card-status">
              {{ getPainLevel(patient.pain_level) }}
            </div>
            <div class="progress-bar reverse">
              <div
                class="progress-fill"
                :style="{ width: (patient.pain_level || 0) * 10 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 训练数据统计 -->
      <div class="section training-stats">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-bar-chart-line"></i>
          </div>
          <h3>三、训练数据统计</h3>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">训练总次数</div>
              <div class="stat-value">{{ patient.total_train_times || 0 }}</div>
              <div class="stat-unit">次</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">成功次数</div>
              <div class="stat-value">{{ patient.success_times || 0 }}</div>
              <div class="stat-unit">次</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">
              <i class="bi bi-x-circle"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">失败次数</div>
              <div class="stat-value">{{ getFailTimes() }}</div>
              <div class="stat-unit">次</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">成功率</div>
              <div class="stat-value">
                {{ formatPercentage(patient.success_rate) }}
              </div>
              <div class="stat-unit">%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI分析报告 -->
      <div class="section ai-analysis">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-cpu"></i>
          </div>
          <h3>四、AI智能分析报告</h3>
        </div>
        <div v-if="isGenerating" class="generating-overlay">
          <div class="spinner"></div>
          <p>正在生成智能分析报告...</p>
        </div>
        <div v-else>
          <div v-if="isEditing" class="editable-report">
            <textarea
              v-model="editableReport"
              class="report-editor"
              rows="18"
              placeholder="点击生成报告或直接编辑..."
            ></textarea>
          </div>
          <div v-else class="report-text" v-html="formattedReport"></div>
        </div>
      </div>

      <!-- 康复建议 -->
      <div class="section recommendations" v-if="recommendations.length">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-lightbulb"></i>
          </div>
          <h3>五、康复建议</h3>
        </div>
        <ul class="recommendations-list">
          <li v-for="(item, index) in recommendations" :key="index">
            <span class="rec-number">{{ index + 1 }}</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 医生签名 -->
      <div class="doctor-signature">
        <div class="signature-content">
          <div class="signature-left">
            <div class="hospital-stamp">
              <!-- <div class="stamp-border">
                <div class="stamp-text">康复医学科</div>
                <div class="stamp-sub">诊断专用章</div>
              </div> -->
            </div>
          </div>
          <div class="signature-right">
            <div class="signature-line">
              <span>主治医生：</span>
              <span class="doctor-name">{{ doctorName }}</span>
            </div>
            <div class="signature-date">
              <span>报告日期：{{ reportDate }}</span>
            </div>
          </div>
        </div>
        <div class="signature-note">
          <p>注：本报告由AI辅助生成，仅供参考，具体治疗方案请遵医嘱。</p>
          <p>
            报告编号：RPT-{{ String(patient.id || 0).padStart(6, "0") }} |
            康复医学科
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import html2pdf from "html2pdf.js";
import { getPatients } from "@/api/patients";

export default {
  name: "ReportPage",
  setup() {
    const route = useRoute();
    const patientId = ref(route.params.id);

    const patient = ref({
      id: null,
      name: "",
      medicalRecord: "",
      gender: "",
      age: "",
      diagnosis: "",
      total_train_times: 0,
      success_times: 0,
      success_rate: 0,
      stability_level: 0,
      pain_level: 0,
    });

    const isGenerating = ref(false);
    const isEditing = ref(false);
    const aiReport = ref("");
    const editableReport = ref("");
    const recommendations = ref([]);
    const reportDate = ref(new Date().toLocaleDateString("zh-CN"));
    const doctorName = ref("张医生");

    const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;

    const formattedReport = computed(() => {
      if (!aiReport.value)
        return '<div class="empty-report"><i class="bi bi-clipboard-data"></i><p>点击"AI生成报告"按钮，获取智能分析报告</p></div>';
      return aiReport.value.replace(/\n/g, "<br>");
    });

    const formatNumber = (value) => {
      if (value === null || value === undefined) return "0";
      return typeof value === "number" ? value.toFixed(1) : value;
    };

    const formatPercentage = (value) => {
      if (value === null || value === undefined) return "0";
      return typeof value === "number" ? value.toFixed(1) : value;
    };

    const getFailTimes = () => {
      const total = patient.value.total_train_times || 0;
      const success = patient.value.success_times || 0;
      return Math.max(0, total - success);
    };

    const fetchPatientData = async () => {
      try {
        const response = await getPatients();
        const patients = response.data;

        if (patients && patients.length > 0) {
          const targetId = parseInt(patientId.value);
          let data = patients.find((p) => p.id === targetId);

          if (!data) {
            data = patients[0];
          }

          patient.value = {
            id: data.id,
            name: data.name || "",
            medicalRecord:
              data.medicalRecord || `MR${String(data.id).padStart(3, "0")}`,
            gender: data.gender || "",
            age: data.age || "",
            diagnosis: data.diagnosis || "暂无",
            total_train_times: data.total_train_times ?? 0,
            success_times: data.success_times ?? 0,
            success_rate: data.success_rate ?? 0,
            stability_level: data.stability_level ?? 0,
            pain_level: data.pain_level ?? 0,
          };
        }
      } catch (error) {
        console.error("获取患者数据失败:", error);
      }
    };

    const getSuccessRateLevel = (rate) => {
      if (rate >= 85) return "优秀";
      if (rate >= 70) return "良好";
      if (rate >= 50) return "一般";
      return "需改进";
    };

    const getSuccessRateClass = (rate) => {
      if (rate >= 85) return "excellent";
      if (rate >= 70) return "good";
      if (rate >= 50) return "average";
      return "poor";
    };

    const getStabilityLevel = (stability) => {
      if (stability >= 80) return "稳定";
      if (stability >= 60) return "较稳定";
      if (stability >= 40) return "一般";
      return "不稳定";
    };

    const getStabilityClass = (stability) => {
      if (stability >= 80) return "excellent";
      if (stability >= 60) return "good";
      if (stability >= 40) return "average";
      return "poor";
    };

    const getPainLevel = (pain) => {
      if (pain <= 2) return "无痛";
      if (pain <= 4) return "轻度";
      if (pain <= 6) return "中度";
      return "重度";
    };

    const getPainClass = (pain) => {
      if (pain <= 2) return "excellent";
      if (pain <= 4) return "good";
      if (pain <= 6) return "average";
      return "poor";
    };

    const generateReport = async () => {
      isGenerating.value = true;

      try {
        const prompt = `你是一名专业的康复医学专家，请为以下患者生成一份详细的康复训练评估报告。

【患者基本信息】
- 性别：${patient.value.gender || "未填写"}
- 年龄：${patient.value.age || "未填写"}岁
- 诊断结果：${patient.value.diagnosis || "暂无"}

【训练数据】
- 训练总次数：${patient.value.total_train_times || 0}次
- 成功次数：${patient.value.success_times || 0}次
- 成功率：${formatPercentage(patient.value.success_rate)}%
- 稳定性指数：${formatNumber(patient.value.stability_level)}分（满分100分）
- 疼痛指数：${formatNumber(patient.value.pain_level)}分（0-10分）

【报告格式要求】
请按以下章节生成报告，每个章节用【】标注标题：

【一、训练效果评估】
基于成功率数据，客观评估患者当前训练效果，分析成功/失败原因。

【二、稳定性分析】
基于稳定性指数，分析患者平衡能力和动作稳定性。

【三、疼痛管理评估】
基于疼痛指数，评估疼痛对康复训练的影响。

【四、综合建议】
结合诊断结果和训练数据，给出3-5条具体可执行的康复建议。

【五、下阶段目标】
制定短期（2周）和中期（1个月）的量化康复目标。

【格式规范】
- 使用专业医学术语
- 每段3-5行
- 数据引用要准确
- 严禁出现患者姓名`;

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "kimi-chat",
            messages: [
              {
                role: "system",
                content: "你是一名专业的康复医学专家，擅长撰写康复评估报告。",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.5,
            max_tokens: 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let reportText = data.choices[0].message.content;
          reportText = formatReportText(reportText);
          aiReport.value = reportText;
          editableReport.value = reportText;
          extractRecommendations(reportText);
        } else {
          useMockReport();
        }
      } catch (error) {
        console.error("生成报告失败:", error);
        useMockReport();
      } finally {
        isGenerating.value = false;
      }
    };

    const formatReportText = (text) => {
      const sections = [
        "一、训练效果评估",
        "二、稳定性分析",
        "三、疼痛管理评估",
        "四、综合建议",
        "五、下阶段目标",
      ];

      let formattedText = text;

      sections.forEach((section) => {
        const pattern = new RegExp(`【?${section}】?`, "g");
        formattedText = formattedText.replace(pattern, `【${section}】`);
      });

      if (patient.value.name) {
        formattedText = formattedText.replace(
          new RegExp(patient.value.name, "g"),
          "该患者",
        );
      }

      sections.forEach((section) => {
        formattedText = formattedText.replace(
          `【${section}】`,
          `\n【${section}】\n`,
        );
      });

      return formattedText.trim();
    };

    const useMockReport = () => {
      const successRate = formatPercentage(patient.value.success_rate);
      const stability = formatNumber(patient.value.stability_level);
      const pain = formatNumber(patient.value.pain_level);
      const diagnosis = patient.value.diagnosis || "相关疾病";
      const total = patient.value.total_train_times || 0;
      const success = patient.value.success_times || 0;
      const fail = Math.max(0, total - success);

      let mockReport = `【一、训练效果评估】

该患者已完成${total}次康复训练，其中成功${success}次，失败${fail}次，整体成功率为${successRate}%。${getSuccessRateComment(
        patient.value.success_rate,
      )}${getTrainingAdvice(patient.value.success_rate)}

【二、稳定性分析】

患者当前稳定性指数为${stability}分（满分100分）。${getStabilityComment(
        patient.value.stability_level,
      )}${getStabilityDetail(patient.value.stability_level)}

【三、疼痛管理评估】

患者当前疼痛指数为${pain}分（0-10分制）。${getPainComment(
        patient.value.pain_level,
      )}${getPainAdvice(patient.value.pain_level)}

【四、综合建议】

基于${diagnosis}的诊断结果和当前训练数据，建议：
${getRecommendationsByData(
  patient.value.success_rate,
  patient.value.stability_level,
  patient.value.pain_level,
  diagnosis,
)}

【五、下阶段目标】

短期目标（2周内）：${getShortTermGoal(patient.value)}

中期目标（1个月内）：${getMidTermGoal(patient.value)}`;

      aiReport.value = mockReport;
      editableReport.value = mockReport;
      extractRecommendations(mockReport);
    };

    const getSuccessRateComment = (rate) => {
      if (rate >= 85) return "患者配合度良好，动作执行准确，训练效果显著。";
      if (rate >= 70) return "患者配合度较好，训练效果良好，仍有提升空间。";
      if (rate >= 50)
        return "患者配合度一般，部分动作执行不够标准，需加强指导。";
      return "患者配合度不足，训练效果较差，需重新评估训练方案。";
    };

    const getTrainingAdvice = (rate) => {
      if (rate >= 85) return "建议维持当前训练强度，可适当增加训练难度。";
      if (rate >= 70) return "建议保持当前训练频率，重点关注动作质量。";
      if (rate >= 50) return "建议增加一对一指导频率，分解复杂动作降低难度。";
      return "建议暂停高强度训练，从基础动作重新开始。";
    };

    const getStabilityComment = (stability) => {
      if (stability >= 80)
        return "患者平衡能力优秀，动作稳定性强，康复进展顺利。";
      if (stability >= 60)
        return "患者稳定性表现良好，基本能够完成大部分训练动作。";
      if (stability >= 40)
        return "患者稳定性有待加强，平衡能力需要进一步训练。";
      return "患者稳定性较差，平衡能力明显不足，需重点干预。";
    };

    const getStabilityDetail = (stability) => {
      if (stability >= 80) return "建议增加动态平衡训练和单腿站立等进阶练习。";
      if (stability >= 60) return "建议增加平衡板训练和重心转移练习。";
      if (stability >= 40) return "建议从静态平衡训练开始，逐步增加难度。";
      return "建议使用辅助器具进行平衡训练，确保安全。";
    };

    const getPainComment = (pain) => {
      if (pain <= 2) return "患者疼痛控制理想，对训练基本无影响。";
      if (pain <= 4) return "患者存在轻度疼痛，可耐受，对训练影响较小。";
      if (pain <= 6) return "患者存在中度疼痛，对训练有一定影响，需关注。";
      return "患者疼痛较明显，严重影响训练，需调整方案。";
    };

    const getPainAdvice = (pain) => {
      if (pain <= 2) return "可维持当前训练强度，注意监测疼痛变化。";
      if (pain <= 4) return "建议训练前热身10分钟，训练后冰敷15分钟。";
      if (pain <= 6)
        return "建议降低训练强度，增加休息间隔，必要时使用镇痛措施。";
      return "建议暂停训练，进行疼痛评估，必要时就医。";
    };

    const getRecommendationsByData = (rate, stability, pain, diagnosis) => {
      const recommendations = [];

      if (rate < 70) {
        recommendations.push("增加一对一指导训练频率，每周至少3次");
      } else {
        recommendations.push("保持当前训练频率，每周3-4次");
      }

      if (stability < 60) {
        recommendations.push("增加平衡板、单腿站立等稳定性专项训练");
      }

      if (pain > 4) {
        recommendations.push("训练前进行充分热身，训练后冰敷15分钟");
        recommendations.push("适当降低训练强度，避免疼痛加剧");
      } else {
        recommendations.push("可逐步增加训练强度，但需监测疼痛反应");
      }

      recommendations.push(`针对${diagnosis}进行针对性康复训练`);
      recommendations.push("建立训练日志，记录每次训练后的身体反应");

      return recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n");
    };

    const getShortTermGoal = (data) => {
      const rate = data.success_rate || 0;
      const stability = data.stability_level || 0;

      if (rate < 60) return "成功率提升至65%以上，稳定性指数提升至45分以上";
      if (rate < 75) return "成功率提升至80%以上，稳定性指数提升至65分以上";
      return "维持85%以上的成功率，稳定性指数稳定在80分以上";
    };

    const getMidTermGoal = (data) => {
      const stability = data.stability_level || 0;
      const pain = data.pain_level || 0;

      if (stability < 50)
        return "稳定性指数提升至65分以上，疼痛指数降至3分以下";
      if (stability < 70)
        return "稳定性指数提升至80分以上，疼痛指数降至2分以下";
      return "稳定性指数稳定在85分以上，疼痛指数控制在1分以下";
    };

    const extractRecommendations = (text) => {
      const recommendationsList = [];

      const recommendationMatch = text.match(
        /【四、综合建议】\n([\s\S]*?)(?=【五、|$)/,
      );
      if (recommendationMatch) {
        const recText = recommendationMatch[1];
        const lines = recText.split("\n");
        for (const line of lines) {
          const cleanLine = line.replace(/^[\d\s\.、\-\*]+/, "").trim();
          if (cleanLine && cleanLine.length > 5 && !cleanLine.includes("【")) {
            recommendationsList.push(cleanLine);
          }
        }
      }

      if (recommendationsList.length === 0) {
        recommendationsList.push(
          "继续坚持每日康复训练",
          "注意训练姿势的正确性",
          "定期复查，评估康复效果",
          "保持良好心态，积极配合治疗",
        );
      }

      recommendations.value = recommendationsList.slice(0, 6);
    };

    const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
      if (!isEditing.value && editableReport.value !== aiReport.value) {
        aiReport.value = editableReport.value;
        extractRecommendations(aiReport.value);
      }
    };

    const exportToPDF = () => {
      const element = document.querySelector(".report-content");
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `康复训练报告_${patient.value.medicalRecord}_${reportDate.value}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    };

    onMounted(() => {
      fetchPatientData();
    });

    return {
      patient,
      isGenerating,
      isEditing,
      editableReport,
      formattedReport,
      recommendations,
      reportDate,
      doctorName,
      formatNumber,
      formatPercentage,
      getFailTimes,
      getSuccessRateLevel,
      getSuccessRateClass,
      getStabilityLevel,
      getStabilityClass,
      getPainLevel,
      getPainClass,
      generateReport,
      toggleEditMode,
      exportToPDF,
    };
  },
};
</script>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 报告头部 */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: reportSlideIn 0.5s ease;
}

@keyframes reportSlideIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-header h2 {
  margin: 0;
  color: #1a365d;
  font-size: 22px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(24, 188, 156, 0.35);
}

.btn-success {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(52, 152, 219, 0.35);
}

.btn-outline-primary {
  background: transparent;
  border: 2px solid #18bc9c;
  color: #18bc9c;
}

.btn-outline-primary:hover {
  background: #18bc9c;
  color: white;
}

/* 报告内容 */
.report-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  animation: reportContentFadeIn 0.6s ease 0.15s backwards;
}

@keyframes reportContentFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 报告封面 */
.report-cover {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
  border-radius: 12px;
  margin-bottom: 32px;
  color: white;
}

.cover-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hospital-logo {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.hospital-info h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.hospital-info p {
  margin: 4px 0 0;
  font-size: 14px;
  opacity: 0.85;
}

.cover-right {
  text-align: right;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  font-size: 13px;
}

.meta-label {
  opacity: 0.7;
}

.meta-value {
  font-weight: 500;
}

/* 通用区块样式 */
.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.section-header h3 {
  margin: 0;
  color: #1a365d;
  font-size: 18px;
  font-weight: 600;
}

/* 患者信息 */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 16px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #18bc9c;
}

.info-item.full-width {
  flex: 2;
}

.info-item .label {
  font-weight: 600;
  color: #64748b;
  min-width: 70px;
  font-size: 13px;
}

.info-item .value {
  color: #1e293b;
  font-weight: 500;
  font-size: 14px;
}

.info-item .value.highlight {
  color: #18bc9c;
  font-weight: 600;
}

.info-item .value.diagnosis {
  color: #dc2626;
  font-weight: 600;
}

/* 综合评估概览 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.overview-card {
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.overview-card.excellent {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.overview-card.good {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.overview-card.average {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.overview-card.poor {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.card-header i {
  font-size: 16px;
}

.overview-card.excellent .card-header i {
  color: #22c55e;
}
.overview-card.good .card-header i {
  color: #3b82f6;
}
.overview-card.average .card-header i {
  color: #f59e0b;
}
.overview-card.poor .card-header i {
  color: #ef4444;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.card-value small {
  font-size: 16px;
  font-weight: 400;
  color: #94a3b8;
}

.card-status {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar.reverse .progress-fill {
  background: linear-gradient(90deg, #22c55e, #ef4444);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #18bc9c, #2ecc71);
  border-radius: 3px;
  transition: width 1s ease;
}

/* 训练数据统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.stat-icon.blue {
  background: #dbeafe;
  color: #3b82f6;
}
.stat-icon.green {
  background: #dcfce7;
  color: #22c55e;
}
.stat-icon.orange {
  background: #fef3c7;
  color: #f59e0b;
}
.stat-icon.purple {
  background: #f3e8ff;
  color: #a855f7;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-unit {
  font-size: 12px;
  color: #94a3b8;
}

/* AI分析报告 */
.generating-overlay {
  text-align: center;
  padding: 60px;
  background: #f8fafc;
  border-radius: 12px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e2e8f0;
  border-top-color: #18bc9c;
  border-right-color: #2ecc71;
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.report-editor {
  width: 100%;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  resize: vertical;
  background: #fefefe;
  transition: all 0.3s ease;
}

.report-editor:focus {
  border-color: #18bc9c;
  box-shadow: 0 0 0 3px rgba(24, 188, 156, 0.15);
  outline: none;
}

.report-text {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  line-height: 2;
  color: #334155;
  font-size: 14px;
  border: 1px solid #e2e8f0;
}

.report-text :deep(【) {
  color: #18bc9c;
  font-weight: 600;
}

.report-text :deep(】) {
  color: #18bc9c;
  font-weight: 600;
}

.empty-report {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-report i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

/* 康复建议 */
.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 3px solid #18bc9c;
  transition: all 0.2s ease;
}

.recommendations-list li:hover {
  background: #f0fdf4;
  transform: translateX(4px);
}

.rec-number {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.recommendations-list li span:last-child {
  flex: 1;
  line-height: 1.6;
  color: #475569;
  font-size: 14px;
}

/* 医生签名 */
.doctor-signature {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

.signature-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.hospital-stamp {
  width: 80px;
  height: 80px;
}

.stamp-border {
  width: 100%;
  height: 100%;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-15deg);
  opacity: 0.7;
}

.stamp-text {
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
  letter-spacing: 1px;
}

.stamp-sub {
  font-size: 8px;
  color: #dc2626;
  margin-top: 2px;
}

.signature-right {
  text-align: right;
}

.signature-line {
  margin-bottom: 8px;
  font-size: 15px;
}

.doctor-name {
  font-weight: 600;
  color: #1a365d;
  font-size: 18px;
}

.signature-date {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.signature-note {
  text-align: center;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}

.signature-note p {
  margin: 4px 0;
  font-size: 12px;
  color: #94a3b8;
}

/* 打印优化 */
@media print {
  .report-header {
    display: none;
  }
  .report-content {
    padding: 20px;
    box-shadow: none;
  }
  .btn {
    display: none;
  }
  .overview-card:hover,
  .stat-card:hover,
  .recommendations-list li:hover {
    transform: none;
    box-shadow: none;
  }
}

@media (max-width: 768px) {
  .report-container {
    padding: 12px;
  }
  .report-header {
    flex-direction: column;
    gap: 12px;
  }
  .report-cover {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  .cover-right {
    text-align: center;
  }
  .meta-item {
    justify-content: center;
  }
  .overview-cards {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .info-row {
    flex-direction: column;
  }
  .signature-content {
    flex-direction: column;
    gap: 20px;
  }
  .signature-right {
    text-align: center;
  }
}
</style>
