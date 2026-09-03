const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const baseUrl = process.env.CHEAPTRUCK_QA_URL || 'http://127.0.0.1:5173/'
const out = path.resolve('output/playwright')
const samplePng =
  'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAKklEQVR4nGNsaGhgIBcwka2trYIphwYGhgYGBgYqhnEKBxiqJUQAAFzUAimjVBxbAAAAAElFTkSuQmCC'

function writeSampleImage(name) {
  const file = path.join(out, name)
  fs.writeFileSync(file, Buffer.from(samplePng, 'base64'))
  return file
}

async function waitForStyleChange(page, locator, property, before, label) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const current = await locator.evaluate((node, prop) => node.style[prop], property)
    if (current && current !== before) return current
    await page.waitForTimeout(80)
  }

  throw new Error(`${label} did not update ${property}`)
}

async function setRange(page, controlId, value) {
  const input = page.locator(`[data-control="${controlId}"]`)
  await input.waitFor({ timeout: 3000 })
  await input.evaluate((node, nextValue) => {
    const element = node
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(element, String(nextValue))
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}

async function probeCanvas(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('.three-room canvas')
    if (!(canvas instanceof HTMLCanvasElement)) return { painted: false, samples: [], size: [0, 0] }

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return { painted: false, samples: [], size: [canvas.width, canvas.height] }

    const points = [
      [0.3, 0.34],
      [0.5, 0.48],
      [0.7, 0.56],
      [0.42, 0.72],
      [0.62, 0.28],
    ]
    const samples = points.map(([px, py]) => {
      const data = new Uint8Array(4)
      gl.readPixels(Math.floor(canvas.width * px), Math.floor(canvas.height * py), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data)
      return Array.from(data)
    })
    const painted = samples.some((sample) => sample[3] > 0 && sample.slice(0, 3).some((value) => value > 12))

    return { painted, samples, size: [canvas.width, canvas.height] }
  })
}

async function checkNavigation(page) {
  const menu = page.locator('.command-rail')
  const screens = [
    { button: 'View your rooms', text: /Living room/i },
    { button: 'Get inspired', text: /Bright studio/i },
    { button: 'Find items', text: /Low sage sofa/i },
    { button: 'Find a carrier', text: /Pickup van/i },
    { button: 'Upload items', text: /No uploaded item pictures yet|Uploaded item/i },
    { button: 'Compare prices', text: /Total target/i },
    { button: 'Connect Facebook', text: /Facebook is connected|Facebook is not connected/i },
  ]

  for (const screen of screens) {
    await menu.getByRole('button', { name: screen.button }).click()
    await page.getByText(screen.text).first().waitFor({ timeout: 3000 })
  }

  const facebookPanel = page.locator('.facebook-panel')
  if (await facebookPanel.getByRole('button', { name: /Disconnect Facebook/i }).isVisible()) {
    await facebookPanel.getByRole('button', { name: /Disconnect Facebook/i }).click()
    await facebookPanel.getByText(/Facebook is not connected/i).waitFor({ timeout: 3000 })
  }
  await facebookPanel.getByRole('button', { name: /^Connect Facebook$/i }).click()
  await facebookPanel.getByText(/Facebook is connected/i).waitFor({ timeout: 3000 })

  await page.getByRole('button', { name: /Open user profile/i }).click()
  await page.getByRole('heading', { name: /^Profile$/i }).first().waitFor({ timeout: 3000 })
}

async function checkPlanner(page, cfg) {
  const menu = page.locator('.command-rail')

  await page.getByRole('button', { name: /Open project start/i }).click()
  await page.getByRole('button', { name: /Create a new room/i }).click()
  await page.getByText(/Customise the room/i).waitFor({ timeout: 3000 })

  for (const name of ['Wall', 'Door', 'Window', 'Sofa', 'Table', 'Lamp', 'Rug', 'Cabinet', 'Art']) {
    await page.getByRole('button', { name: new RegExp(`^Add ${name}$`, 'i') }).click()
  }

  const objectCount = await page.locator('.plan-object').count()
  if (objectCount < 16) throw new Error(`${cfg.name}: catalog buttons did not add every object`)
  const objectRows = page.locator('.object-row')

  for (let index = 0; index < objectCount; index += 1) {
    const object = page.locator('.plan-object').nth(index)
    await objectRows.nth(index).click()
    const beforeLeft = await object.evaluate((node) => node.style.left)
    await page.getByRole('button', { name: /Move right/i }).click()
    await waitForStyleChange(page, object, 'left', beforeLeft, `object ${index}`)
  }

  const selected = page.locator('.plan-object.selected')
  await selected.scrollIntoViewIfNeeded()
  const beforeDragLeft = await selected.evaluate((node) => node.style.left)
  const selectedBox = await selected.boundingBox()
  if (!selectedBox) throw new Error(`${cfg.name}: selected object is not visible`)

  await page.mouse.move(selectedBox.x + selectedBox.width / 2, selectedBox.y + selectedBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(selectedBox.x + selectedBox.width / 2 + 60, selectedBox.y + selectedBox.height / 2 + 34, { steps: 6 })
  await page.mouse.up()
  await waitForStyleChange(page, selected, 'left', beforeDragLeft, `${cfg.name} dragged selected object`)

  const beforeWidth = await selected.evaluate((node) => node.style.width)
  const beforeHeight = await selected.evaluate((node) => node.style.height)
  const beforeTransform = await selected.evaluate((node) => node.style.transform)

  await setRange(page, 'object-width', 132)
  await waitForStyleChange(page, selected, 'width', beforeWidth, 'selected object width')
  await setRange(page, 'object-depth', 84)
  await waitForStyleChange(page, selected, 'height', beforeHeight, 'selected object depth')
  await setRange(page, 'object-height', 72)
  await setRange(page, 'object-rotation', 47)
  await waitForStyleChange(page, selected, 'transform', beforeTransform, 'selected object rotation')

  await page.setInputFiles('[data-testid="selected-image-input"]', writeSampleImage(`${cfg.name}-selected.png`))
  await page.getByText(/picture attached/i).first().waitFor({ timeout: 3000 })
  const background = await selected.evaluate((node) => window.getComputedStyle(node).backgroundImage)
  if (!background.includes('data:image')) throw new Error(`${cfg.name}: selected object upload did not render`)

  await page.getByRole('button', { name: /Open Sizing/i }).click()
  await page.setInputFiles('[data-testid="item-upload-sofa"]', writeSampleImage(`${cfg.name}-item.png`))
  await page.getByText(/Item picture attached/i).waitFor({ timeout: 3000 })
  await page.locator('.item-photo-row img').first().waitFor({ timeout: 3000 })

  await menu.getByRole('button', { name: 'Upload items' }).click()
  await page.setInputFiles('[data-testid="new-upload-input"]', writeSampleImage(`${cfg.name}-new-upload.png`))
  await page.getByText(/Uploaded item added to room/i).waitFor({ timeout: 3000 })
  await page.locator('.uploaded-card img').first().waitFor({ timeout: 3000 })

  await menu.getByRole('button', { name: 'Find items' }).click()
  await page.getByRole('button', { name: /Use in room/i }).first().click()
  await page.getByText(/Customise the room/i).waitFor({ timeout: 3000 })

  await page.getByRole('button', { name: /Toggle live backgrounds/i }).click()
  await page.getByRole('button', { name: /Toggle live backgrounds/i }).click()
  await page.getByRole('button', { name: /City loft/i }).click()

  await page.screenshot({ path: path.join(out, `${cfg.name}-planner-2d.png`), fullPage: true })

  await page.getByRole('button', { name: /3D view/i }).click()
  await page.waitForSelector('.three-room canvas')
  await page.waitForTimeout(700)

  const canvas = page.locator('.three-room canvas')
  const canvasBox = await canvas.boundingBox()
  if (!canvasBox) throw new Error(`${cfg.name}: 3D canvas is not visible`)
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.5, canvasBox.y + canvasBox.height * 0.5)
  await page.mouse.down()
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.64, canvasBox.y + canvasBox.height * 0.42, { steps: 8 })
  await page.mouse.up()

  await page.getByRole('button', { name: /^top$/i }).click()
  await page.getByRole('button', { name: /^front$/i }).click()
  await page.getByRole('button', { name: /Reset camera/i }).click()
  await page.waitForTimeout(500)

  const canvasProbe = await probeCanvas(page)
  await page.screenshot({ path: path.join(out, `${cfg.name}-planner-3d.png`), fullPage: true })

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole('button', { name: /^Next$/i }).click()
  }

  await page.getByRole('button', { name: /Generate options/i }).click()
  await page.getByText(/Four design options generated/i).waitFor({ timeout: 4000 })
  await page.screenshot({ path: path.join(out, `${cfg.name}-options.png`), fullPage: true })

  return canvasProbe
}

async function runCase(browser, cfg) {
  const consoleErrors = []
  const page = await browser.newPage({ viewport: cfg.viewport })

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(out, `${cfg.name}-auth.png`), fullPage: true })
  await page.getByRole('button', { name: /Continue with Facebook/i }).click()
  await page.getByText(/Facebook connected/i).first().waitFor({ timeout: 3000 })

  await checkNavigation(page)
  const canvasProbe = await checkPlanner(page, cfg)
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
