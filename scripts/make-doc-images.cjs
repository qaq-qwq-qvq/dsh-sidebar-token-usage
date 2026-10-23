/**
 * Renders the documentation mockups for the current settings layout.
 * Output: docs/images/settings-options.png, docs/images/settings-pricing.png
 *
 * These are illustrations drawn from the real component structure (sample data,
 * not a live capture); the sidebar screenshots in the same folder are captures.
 */
const fs = require('node:fs')
const path = require('node:path')
const sharp = require('C:/Users/wujia/.dsh/profiles/desktop/node_modules/sharp')

const OUT = path.join(__dirname, '..', 'docs', 'images')
fs.mkdirSync(OUT, { recursive: true })

const FONT = 'Microsoft YaHei, Segoe UI, sans-serif'
const C = {
  ink: '#1f2328',
  sub: '#5b6168',
  faint: '#8b9096',
  caption: '#9aa0a6',
  line: '#e7e8eb',
  soft: '#f2f3f5',
  card: '#ffffff',
  blue: '#4d6bfe',
  blueSoft: '#e9edff',
  green: '#2f9e44',
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function text(x, y, value, { size = 12, fill = C.ink, weight = 400, anchor = 'start' } = {}) {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`
}
function rect(x, y, w, h, { fill = C.card, stroke = 'none', sw = 1, r = 0 } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
}
function pill(x, y, label, { h = 22, w, fill = C.soft, color = C.sub, size = 11, weight = 400 } = {}) {
  const width = w === undefined ? Math.max(30, label.length * 6.4 + 18) : w
  return rect(x, y, width, h, { fill, r: h / 2 }) + text(x + width / 2, y + h / 2 + 4, label, { size, fill: color, weight, anchor: 'middle' })
}
function checkbox(x, y, label, on) {
  const box = on
    ? rect(x, y, 14, 14, { fill: C.blue, r: 4 }) +
      `<path d="M${x + 3.2} ${y + 7.2} l2.6 2.6 l4.6 -5" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
    : rect(x, y, 14, 14, { fill: '#fff', stroke: '#c6c9ce', r: 4 })
  return box + text(x + 22, y + 11.5, label, { size: 11.5, fill: C.sub })
}
function field(x, y, w, value, { align = 'right', size = 11.5 } = {}) {
  return rect(x, y, w, 22, { fill: '#fff', stroke: C.line, r: 5 }) +
    text(align === 'right' ? x + w - 8 : x + 8, y + 15, value, { size, fill: C.ink, anchor: align === 'right' ? 'end' : 'start' })
}
function tabs(x, y, w, items, active) {
  const gap = 4
  const total = w
  const each = (total - gap * (items.length - 1) - 8) / items.length
  let out = rect(x, y, w, 34, { fill: C.soft, r: 10 })
  items.forEach((label, index) => {
    const tx = x + 4 + index * (each + gap)
    if (index === active) out += rect(tx, y + 4, each, 26, { fill: '#fff', stroke: C.line, r: 8 })
    out += text(tx + each / 2, y + 21, label, {
      size: 12,
      fill: index === active ? C.ink : C.faint,
      weight: index === active ? 600 : 400,
      anchor: 'middle',
    })
  })
  return out
}

/* ── 1. settings page: the tab bar and the chrome tab ──────────────────── */
function settingsOptions() {
  const W = 860
  const H = 560
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
  s += rect(0, 0, W, H, { fill: '#fff' })
  s += text(24, 32, '侧边栏 token 用量', { size: 13, weight: 600 })
  s += tabs(24, 48, W - 48, ['会话行', '侧边栏底部', '侧边栏整理', '价格'], 0)

  // hover scope: two segmented controls
  s += text(24, 116, '会话行', { size: 10, weight: 600, fill: C.caption })
  s += text(24, 146, '会话行上显示', { size: 11.5, fill: C.sub })
  s += pill(112, 132, '用量', { fill: C.blueSoft, color: C.blue, weight: 600 })
  s += pill(158, 132, '费用')
  s += text(24, 178, '会话展开方式', { size: 11.5, fill: C.sub })
  s += pill(112, 164, '鼠标移入')
  s += pill(186, 164, '点击', { fill: C.blueSoft, color: C.blue, weight: 600 })

  // checkbox grid
  const boxes = [
    ['输入 / 输出 / 缓存明细', true], ['上下文占用', true],
    ['当前模型与思考强度', true], ['缓存命中率', false],
    ['轮次 / 步数 / 耗时', false], ['首字延迟 / 解码速度', false],
    ['权限 / 预设 / 工作目录', false], ['估算费用', true],
    ['行内显示上下文圆环', false], ['按模型用量', true],
  ]
  boxes.forEach(([label, on], index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    s += checkbox(24 + col * 250, 200 + row * 26, label, on)
  })

  // preview card
  const px = 540
  s += text(px, 116, '效果预览', { size: 10, weight: 600, fill: C.caption })
  s += rect(px, 128, 296, 372, { fill: '#fff', stroke: C.line, r: 10 })
  const rows = [
    ['输入', '12,400'], ['输出', '3,100'], ['缓存读', '486,000'], ['缓存写', '0'],
    ['上下文', '62,000 / 128,000 · 48%'],
  ]
  rows.forEach(([key, value], index) => {
    s += text(px + 14, 152 + index * 19, key, { size: 11, fill: C.faint })
    s += text(px + 282, 152 + index * 19, value, { size: 11, fill: C.sub, anchor: 'end' })
  })
  s += rect(px + 14, 252, 268, 1, { fill: C.line })
  const extra = [['缓存命中', '98%'], ['轮次', '9'], ['步数', '42'], ['累计耗时', '8m 20s'], ['首字延迟', '7s'], ['解码速度', '34.4 tok/s']]
  extra.forEach(([key, value], index) => {
    s += text(px + 14, 272 + index * 19, key, { size: 11, fill: C.faint })
    s += text(px + 282, 272 + index * 19, value, { size: 11, fill: C.sub, anchor: 'end' })
  })
  s += rect(px + 14, 392, 268, 1, { fill: C.line })
  s += text(px + 14, 412, '模型用量', { size: 10, fill: C.caption })
  s += text(px + 14, 432, 'deepseek-flash', { size: 10.5, fill: C.sub })
  s += text(px + 282, 432, '501.5K · ¥0.069', { size: 10.5, fill: C.sub, anchor: 'end' })

  // chrome tab hint
  s += text(24, 352, '切到「侧边栏整理」可以关掉紧凑侧边栏；切到「价格」编辑模型价格。', { size: 11, fill: C.faint })
  s += `</svg>`
  return { name: 'settings-options', svg: s }
}

/* ── 2. settings page: the price table ─────────────────────────────────── */
function settingsPricing() {
  const W = 860
  const H = 420
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
  s += rect(0, 0, W, H, { fill: '#fff' })
  s += text(24, 26, '价格（CNY / 百万 token）', { size: 10, weight: 600, fill: C.caption })
  s += text(24, 46, '改完立即生效；默认值来自 DeepSeek 官方价目表。', { size: 11, fill: C.faint })

  const modelX = 24
  const groupX = [270, 448, 626]
  const colWidths = [70, 70]
  const headY = 78

  s += text(modelX, headY, '模型 · 匹配', { size: 10, weight: 600, fill: C.caption })
  ;['缓存命中', '输入未命中', '输出'].forEach((label, index) => {
    s += text(groupX[index] + 86, headY, label, { size: 10, weight: 600, fill: C.caption, anchor: 'middle' })
  })
  ;['闲时', '高峰'].forEach((tier, t) => {
    groupX.forEach((gx) => {
      s += text(gx + 18 + t * 86 + 35, headY + 18, tier, { size: 9.5, fill: C.caption, anchor: 'middle' })
    })
  })

  const rows = [
    { name: 'deepseek-flash', match: 'flash', amounts: ['0.02', '0.04', '1', '2', '4', '8'], custom: false },
    { name: 'deepseek-v4-pro', match: 'v4-pro', amounts: ['0.15', '0.3', '4.5', '9', '13.5', '27'], custom: false },
    { name: 'gpt-5.6-terra', match: 'gpt-5.6', amounts: ['0', '0', '0', '0', '0', '0'], custom: true },
  ]

  rows.forEach((row, index) => {
    const y = 118 + index * 46
    s += rect(24, y - 12, W - 48, 1, { fill: C.line })
    if (row.custom) {
      s += field(modelX, y, 150, row.name, { align: 'left', size: 11 })
      s += field(modelX, y + 16, 150, row.match, { align: 'left', size: 10 })
    } else {
      s += text(modelX, y + 10, row.name, { size: 11.5, fill: C.ink })
      s += rect(modelX, y + 16, 110, 18, { fill: '#fff', stroke: C.line, r: 5 })
      s += text(modelX + 6, y + 29, row.match, { size: 9.5, fill: C.faint })
    }
    row.amounts.forEach((amount, position) => {
      const group = Math.floor(position / 2)
      const tier = position % 2
      s += field(groupX[group] + 18 + tier * 86, y, colWidths[tier], amount)
    })
    if (row.custom) {
      s += text(W - 40, y + 12, '×', { size: 15, fill: C.faint, anchor: 'middle' })
    }
  })

  const footY = 118 + rows.length * 46 + 18
  s += rect(24, footY, 92, 26, { fill: '#fff', stroke: C.line, r: 13 })
  s += text(70, footY + 17, '添加模型', { size: 11, fill: C.sub, anchor: 'middle' })
  s += rect(124, footY, 100, 26, { fill: '#fff', stroke: C.line, r: 13 })
  s += text(174, footY + 17, '恢复官方价', { size: 11, fill: C.sub, anchor: 'middle' })
  s += text(236, footY + 17, '按模型名包含匹配，越具体的匹配越先命中；匹配为空的行不参与计费。', { size: 11, fill: C.faint })

  s += text(24, footY + 56, '计价路由（逗号分隔）', { size: 11, fill: C.faint })
  s += rect(24, footY + 64, W - 48, 24, { fill: '#fff', stroke: C.line, r: 5 })
  s += text(32, footY + 80, 'deepseek-account, deepseek-official, llm-deepseek', { size: 11, fill: C.ink })
  s += `</svg>`
  return { name: 'settings-pricing', svg: s }
}

const shots = [settingsOptions(), settingsPricing()]
;(async () => {
  for (const shot of shots) {
    const svgPath = path.join(OUT, shot.name + '.svg')
    const pngPath = path.join(OUT, shot.name + '.png')
    fs.writeFileSync(svgPath, shot.svg, 'utf8')
    await sharp(Buffer.from(shot.svg)).png().toFile(pngPath)
    const meta = await sharp(pngPath).metadata()
    console.log('wrote', shot.name + '.png', meta.width + 'x' + meta.height, fs.statSync(pngPath).size + 'B')
    fs.unlinkSync(svgPath)
  }
})()
