<template>
  <div style="margin-top:20px; margin-left:20px">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="样本数据" name="sample"><Sample/></el-tab-pane>
      <el-tab-pane label="混合物数据" name="mixed"><Mixed/></el-tab-pane>
      <el-tab-pane label="组分识别" name="iden"><Iden/></el-tab-pane>
    </el-tabs>
  </div>

</template>

<script setup name="Sample">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Sample from './sample.vue'
import Mixed from './mixed.vue'
import Iden from './iden.vue'

const activeName = ref('sample')

</script>

<style scoped>
.title{
  font-size: 40px;
  margin: 20px 0;
}

#chart{
  height:100%;
  width:100%;
}

</style>
