<template>
  <div
    class="flex flex-col md:flex-row gap-4 justify-between w-full py-4"
    :style="{ minHeight: canvasHeight }"
  >
    <div class="tag-container">
      <div class="canvas-aspect" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
        <canvas id="tag" ref="tagCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
      </div>
    </div>
  </div>

   <div class="tab" style="text-align:center;">
    <button class="tab-item" @click="saveCanvas()">保存</button>
    <button class="tab-item" @click="printCanvas()">打印</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import {
  getTextWidth,
} from '@/utils/canvas'

const props = defineProps({
  tagInfo: {
    type: Object,
    required: true,
  },
})

const canvasWidth = 300
const canvasHeight = 100
const leftOffset = 2
let topOffset = 3

const tagCanvas = ref<HTMLCanvasElement>()

const destroyCanvas = () => {
  const canvas = tagCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx?.clearRect(0, 0, canvas.width, canvas.height)
}

const drawtag = async () => {
  destroyCanvas()
  const canvas = tagCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 绘制矩形边框
  ctx.strokeStyle = '#000000'; 
  ctx.lineWidth = 0.1; 
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  await drawtagDetails(canvas, ctx)
}

const drawtagDetails = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    //信息绘制
    ctx.fillStyle = 'rgba(0, 0, 0)'
    ctx.font = ' 32px SimSun'

    // 保管人和电话
    const custodianWidth = getTextWidth(ctx, props.tagInfo.custodian)
    ctx.fillText(props.tagInfo.custodian, leftOffset + ( canvasWidth - custodianWidth ) / 2, topOffset + 38)
    ctx.font = ' 32px SimHei'
    const phoneNumberWidth = getTextWidth(ctx, props.tagInfo.phoneNumber)
    ctx.fillText(props.tagInfo.phoneNumber, leftOffset + ( canvasWidth - phoneNumberWidth ) / 2, topOffset + 78)
    
  })
}

onMounted(() => {
  drawtag()
})

watch(
  () => props.tagInfo,
  () => {
    drawtag()
  },
  { deep: true },
)

function saveCanvas() {
  const canvas = tagCanvas.value
  if (!canvas) return

  const el = document.createElement('a');
  el.href = canvas.toDataURL();
  el.download = props.tagInfo.custodian + '.png';
  el.click()
}

function printCanvas() {
  const canvas = tagCanvas.value
  if (!canvas) return

  const imageData = canvas.toDataURL('image/png') // 转换为 Base64 图像
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>打印标签</title></head>
        <body style="margin: 0; text-align: center;">
          <img src="${imageData}" style="max-width: 100%; height: auto;" />
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
</script>

<style scoped>
.tag-container {
  @apply flex justify-center items-center w-full;
}
.canvas-aspect {
  width: 100%;
  aspect-ratio: 876 / 539;
  position: relative;
}
.canvas-aspect canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
