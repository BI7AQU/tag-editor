<script setup lang="ts">
import { ref } from 'vue'

import type { FieldInfoData, tagData } from '@/types'

import DynamicForm from '@/components/common/DynamicForm.vue'
import Tabs from '@/components/common/Tabs.vue'
import InfoHead from '@/components/common/InfoHead.vue'
import Footer from '@/components/common/Footer.vue'

import tag1 from '@/components/tag1.vue'
import tag2 from '@/components/tag2.vue'

const tabs = ref([
  { label: '32x19 mm', key: 'tag1' },
  { label: '30x10 mm', key: 'tag2' },
])

const activeTab = ref('')

const fieldInfo = ref<FieldInfoData>({
  name: { label: '资产名称', type: 'text', colSpan: 1 },
  serialNumber: { label: '序列号', type: 'text', colSpan: 1, maxLength: 23 },
  date: { label: '日期', type: 'date', colSpan: 1 },
  customized: { label: '自定义信息', type: 'text', colSpan: 1, maxLength: 20 },
  custodian: { label: '保管人', type: 'text', colSpan: 1, maxLength: 12 },
  phoneNumber: { label: '电话', type: 'text', colSpan: 1, maxLength: 12 },
  qrCodeId: { label: '二维码内容', type: 'text', colSpan: 1, maxLength: 144 },
  displayQR: { label: '显示二维码', type: 'checkbox', colSpan: 1 },
})

const tagInfo = ref<tagData>({
  name: '鼎阳SDS804',
  serialNumber: 'X073561',
  date: '2026-03-02',
  customized: '',
  custodian: '冷藏箱',
  phoneNumber: '13800000000',
  qrCodeId: 'https://assets.steveling.cn/api/20260302_X073561',
  displayQR: true,
})

</script>

<template>
  <div class="container px-5 py-5 md:py-16 xl:py-24 mx-auto my-auto h-fit">
    <div class="items-center justify-between p-4 rounded-lg bg-white shadow-indigo-50 shadow-md">
      <InfoHead />

      <DynamicForm class="mb-4" v-model="tagInfo" v-model:fields="fieldInfo" />

      <Tabs class="mb-4 text-sm" v-model="activeTab" :tabs="tabs" />
      
      <div>
        <div class="tag-container py-4">
          <tag1 :tagInfo="tagInfo" v-if="activeTab == 'tag1'" />
          <tag2 :tagInfo="tagInfo" v-if="activeTab == 'tag2'" />
          <template v-else-if="activeTab == ''">
            <h2 class="text-2xl">请选择标签类型！</h2>
          </template>
        </div>
      </div> 
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
