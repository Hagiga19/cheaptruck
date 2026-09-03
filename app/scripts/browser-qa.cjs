const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const baseUrl = process.env.CHEAPTRUCK_QA_URL || 'http://127.0.0.1:5173/'
const out = path.resolve('output/playwright')

async function runCase(browser, cfg) {
  const consoleErrors = []
  const page = await browser.newPage({ viewport: cfg.viewport })

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(out, `${cfg.name}-auth.png`), fullPage: true })

  await page.getByLabel('Name').fill('Yahel Hagi')
  await page.locator('input[type="email"]').fill('yahel@example.com')
  await page.locator('input[type="password"]').fill('cheaptruck-demo')
  await page.getByRole('button', { name: /create account/i }).click()
  await page.getByRole('button', { name: /create a new room/i }).click()
  await page.getByRole('button', { name: 'Add wall' }).click()
  await page.screenshot({ path: path.join(out, `${cfg.name}-wizard-2d.png`), fullPage: true })

  await page.getByRole('button', { name: '3D view' }).click()
  await page.waitForSelector('.three-room canvas')
  await page.waitForTimeout(650)

  const canvasProbe = await page.evaluate(() => {
    const canvas = document.querySelector('.three-room canvas')
    if (!(canvas instanceof HTMLCanvasElement)) return { painted: false, samples: [], size: [0, 0] }

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return { painted: false, samples: [], size: [canvas.width, canvas.height] }

    const points = [
      [0.28, 0.35],
      [0.5, 0.48],
      [0.7, 0.55],
      [0.42, 0.7],
      [0.62, 0.32],
    ]
    const samples = points.map(([px, py]) => {
      const data = new Uint8Array(4)
      gl.readPixels(Math.floor(canvas.width * px), Math.floor(canvas.height * py), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data)
      return Array.from(data)
    })
    const painted = samples.some((sample) => sample[3] > 0 && sample.slice(0, 3).some((value) => value > 12))

    return { painted, samples, size: [canvas.width, canvas.height] }
  })

  await page.screenshot({ path: path.join(out, `${cfg.name}-wizard-3d.png`), fullPage: true })
  await page.getByRole('button', { name: '2D view' }).click()

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole('button', { name: /^Next$/i }).click()
  }

  await page.getByRole('button', { name: /generate options/i }).click()
  await page.getByText('Four design options generated').waitFor({ timeout: 3000 })
  await page.screenshot({ path: path.join(out, `${cfg.name}-options.png`), fullPage: true })
  await page.close()

  return { viewport: cfg.name, canvasProbe, consoleErrors }
}

async function main() {
  fs.mkdirSync(out, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const cases = [
    { name: 'desktop', viewport: { width: 1440, height: 950 } },
    { name: 'mobile', viewport: { width: 390, height: 844 } },
  ]
  const results = []

  for (const cfg of cases) {
    results.push(await runCase(browser, cfg))
  }

  await browser.close()

  const failures = results.flatMap((result) => {
    const issues = []
    if (!result.canvasProbe.painted) issues.push(`${result.viewport}: 3D canvas was blank`)
    if (result.consoleErrors.length > 0) issues.push(`${result.viewport}: console errors: ${result.consoleErrors.join('; ')}`)
    return issues
  })

  console.log(JSON.stringify(results, null, 2))

  if (failures.length > 0) {
    console.error(failures.join('\n'))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
