<template>
  <div class="report-templates">
    <h3>报告模板设置</h3>
    <el-form label-width="120px">
      <el-form-item label="模板类型">
        <el-select v-model="templateType">
          <el-option label="标准模板" value="standard"></el-option>
          <el-option label="详细模板" value="detailed"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包含图表">
        <el-switch v-model="includeCharts"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const templateType = ref("standard");
const includeCharts = ref(true);
</script>

<style scoped>
.report-templates {
  padding: 20px;
}
</style>
