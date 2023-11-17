<template>
  <div class="title"> 光谱数据分类测试 </div>
  <div class="head">
    <el-form label-width="120px">
      <el-row :span="24">
        <el-col :span="8">
          <el-form-item label="请选择样品：">
            <el-select v-model="id" placeholder="下拉选择" filterable>
              <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请输入开始位置">
            <el-input-number v-model="start" :precision="0" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请输入结束位置">
            <el-input-number v-model="end" :precision="0" :step="1"  />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请输入lambda_a">
            <el-input-number v-model="lambdaA" :precision="2" :step="0.01"  />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请输入lambda_b">
            <el-input-number v-model="lambdaB" :precision="2" :step="0.01"  />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请输入alpha">
            <el-input-number v-model="alpha" :precision="2" :step="0.01"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请输入ac">
            <el-input-number v-model="ac" :precision="2" :step="0.01" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click=confirm>确认</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div id="chart" style="height:600px;width:1400px;"></div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import * as echarts from 'echarts';

let { proxy } = getCurrentInstance();

const data = ref([])
const id = ref()
const alpha = ref(0.2)
const lambdaA = ref(2.0)
const lambdaB = ref(1000.0)
const ac = ref(-0.1)
const start = ref(300)
const end = ref(1000)

onMounted(() => {
  init()
})

const init = () => {
  proxy.$http.get("/api/spectrum/getAllData").then(res => {
    data.value = res.data;
  })
}

const confirm = () => {
  proxy.$http.post("/api/spectrum/test" ,
  {id: id.value, lambdaA: lambdaA.value, lambdaB: lambdaB.value, ac: ac.value, alpha: alpha.value, start: start.value, end: end.value})
  .then(res => {
    let data = res.data;
    echarts.init(document.getElementById('chart')).dispose();
    var myChart = echarts.init(document.getElementById('chart'));
    myChart.setOption({
      title: {
        text: '光谱数据'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['原始数据', '初步平滑', '背景荧光', '校准基线', '二次平滑']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xdata
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '原始数据',
          type: 'line',
          data: data.originY
        },
        {
          name: '初步平滑',
          type: 'line',
          data: data.sm1
        },
        {
          name: '背景荧光',
          type: 'line',
          data: data.background
        },
        {
          name: '校准基线',
          type: 'line',
          data: data.corrected
        },
        {
          name: '二次平滑',
          type: 'line',
          data: data.sm2
        }
      ]
    });
  })
}


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
