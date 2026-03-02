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

const canvasWidth = 320
const canvasHeight = 190
const leftOffset = 20
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
    ctx.font = ' 22px SimHei'

    // 资产标识卡
    const titleWidth = getTextWidth(ctx, '资产标识卡')
    ctx.fillText('资产标识卡', (canvasWidth - titleWidth) / 2, 28)

    ctx.font = ' 18px SimSun'
    // 资产名称和序列号
    ctx.fillText('资产名称：' + props.tagInfo.name, leftOffset, topOffset + 50)
    ctx.fillText(
      '序 列 号：' + props.tagInfo.serialNumber,
      leftOffset,
      topOffset + 75,
    )

    if (props.tagInfo.customized) {
      ctx.fillText(props.tagInfo.customized, leftOffset, topOffset + 100)
      var customTextHeight = 25
    }
    else {
      var customTextHeight = 0
    }

    // 保管人和电话
    ctx.fillText('所属人员：' + props.tagInfo.custodian, leftOffset, topOffset + customTextHeight + 100)
    ctx.fillText('联系电话：' + props.tagInfo.phoneNumber, leftOffset, topOffset + customTextHeight + 125)
    
    // 日期
    ctx.fillText(props.tagInfo.date, leftOffset, topOffset + (customTextHeight / 2) + 162)

    if (props.tagInfo.displayQR) {
      // 二维码
      const qrCodeText = props.tagInfo.qrCodeId
      const qrCodeWidth = 75
      const qrCodeOptions = {
        width: qrCodeWidth,
        maskPattern: 3,
        margin: 0,
        color: {
          dark: '#000000b0', // 二维码颜色
          light: '#FFFFFF00', // 背景透明
        },
      }
      QRCode.toDataURL(qrCodeText, qrCodeOptions as any, (err, url) => {
        if (err) return reject(err)
        const qrImage = new Image()
        qrImage.src = url
        qrImage.onload = () => {
          ctx.drawImage(
            qrImage,
            leftOffset + 212,
            topOffset + 100,
            qrCodeWidth,
            qrCodeWidth,
          )
          resolve()
        }
        qrImage.onerror = reject
      })
    }
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

async function saveCanvas() {
  const canvas = tagCanvas.value
  if (!canvas) return
  await drawtag()

  const el = document.createElement('a');
  el.href = canvas.toDataURL();
  el.download = props.tagInfo.name + '.png';
  el.click()
}

async function printCanvas() {
  const canvas = tagCanvas.value
  if (!canvas) return
  await drawtag()

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
