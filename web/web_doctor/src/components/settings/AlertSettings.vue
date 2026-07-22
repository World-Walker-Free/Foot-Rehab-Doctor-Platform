<template>
  <div class="alert-settings">
    <h3>报警设置</h3>
    <el-form label-width="120px">
      <el-form-item label="报警阈值">
        <el-input-number
          v-model="threshold"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="报警方式">
        <el-checkbox-group v-model="alertMethods">
          <el-checkbox label="sound">声音报警</el-checkbox>
          <el-checkbox label="popup">弹窗报警</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const threshold = ref(80);
const alertMethods = ref(["sound", "popup"]);
</script>

<style scoped>
.alert-settings {
  padding: 20px;
}
</style>
