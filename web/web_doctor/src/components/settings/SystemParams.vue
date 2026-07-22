<template>
  <div class="system-params">
    <h3>系统参数设置</h3>
    <el-form label-width="120px">
      <el-form-item label="数据保留天数">
        <el-input-number
          v-model="dataRetention"
          :min="30"
          :max="365"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="自动备份">
        <el-switch v-model="autoBackup"></el-switch>
      </el-form-item>
      <el-form-item label="备份时间">
        <el-time-picker
          v-model="backupTime"
          :disabled="!autoBackup"
        ></el-time-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dataRetention = ref(90);
const autoBackup = ref(true);
const backupTime = ref(new Date(2024, 0, 1, 2, 0));
</script>

<style scoped>
.system-params {
  padding: 20px;
}
</style>
