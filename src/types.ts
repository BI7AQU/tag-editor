export type tagData = {
  serialNumber: string // 序列号
  name: string // 资产名称
  date: string // 日期
  customized: string // 自定义信息

  // 信息
  custodian: string // 保管人
  phoneNumber: string // 电话

  // 其他信息
  qrCodeId: string // 二维码内容
  displayQR?: boolean // 是否显示二维码
  [key: string]: any
}

export type FieldInfoColumn = {
  label: string
  colSpan: number
  onlyEnglishAndNumber?: boolean
  onlyChinese?: boolean
  maxLength?: number
  maxValue?: number
  data?: any
  disabled?: boolean
} & (
  | {
      type: 'text' | 'date' | 'time' | 'float' | 'number' | 'checkbox'
    }
  | {
      type: 'select'
      data: Array<{ label: string; key: string | number }>
    }
)
export type FieldInfoData = Record<string, FieldInfoColumn>
