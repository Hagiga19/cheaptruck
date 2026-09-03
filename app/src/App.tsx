import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  BrickWall,
  Check,
  DoorOpen,
  DollarSign,
  Gauge,
  Home,
  ImagePlus,
  LampDesk,
  LayoutDashboard,
  Link,
  LogIn,
  MapPin,
  Move3D,
  PackagePlus,
  PanelLeft,
  Plus,
  RotateCcw,
  RotateCw,
  Ruler,
  Search,
  Settings2,
  ShoppingBag,
  Sofa,
  Sparkles,
  Square,
  Table2,
  Truck,
  Upload,
  UserRound,
  WandSparkles,
  Wifi,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './App.css'

type AuthMode = 'create' | 'signin'
type ViewMode = '2d' | '3d'
type CameraPreset = 'corner' | 'top' | 'front'
type Screen =
  | 'start'
  | 'wizard'
  | 'rooms'
  | 'inspired'
  | 'marketplace'
  | 'carrier'
  | 'uploads'
  | 'prices'
  | 'facebook'
  | 'profile'
  | 'review'
type RoomObjectKind = 'wall' | 'door' | 'window' | 'art' | 'sofa' | 'table' | 'lamp' | 'rug' | 'cabinet'

type Address = {
  state: string
  city: string
  street: string
  apartment: string
  floor: string
}

type RoomObject = {
  id: string
  kind: RoomObjectKind
  name: string
  x: number
  y: number
  widthIn: number
  depthIn: number
  heightIn: number
  rotation: number
  color: string
  imageUrl?: string
}

type ItemDetail = {
  id: string
  name: string
  length: number
  height: number
  width: number
  color: string
  auto: boolean
  fetch: boolean
  imageUrl?: string
}

type DesignOption = {
  id: string
  name: string
  mood: string
  price: number
  pool: string
  health: string
  fit: string
  accent: string
  items: string[]
}

type Backdrop = {
  id: string
  label: string
  className: string
  floor: string
  wall: string
  accent: string
}

const ROOM_WIDTH_IN = 216
const ROOM_DEPTH_IN = 144
const ROOM_WIDTH_FT = ROOM_WIDTH_IN / 12
const ROOM_DEPTH_FT = ROOM_DEPTH_IN / 12

const wizardSteps = [
  { id: 'shape', label: 'Room', icon: Ruler },
  { id: 'style', label: 'Style', icon: Sparkles },
  { id: 'items', label: 'Items', icon: ShoppingBag },
  { id: 'details', label: 'Sizing', icon: Settings2 },
  { id: 'fetch', label: 'Fetch', icon: Wifi },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'address', label: 'Location', icon: MapPin },
  { id: 'options', label: 'Designs', icon: Sofa },
]

const menuItems: { label: string; icon: LucideIcon; screen: Screen }[] = [
  { label: 'View your rooms', icon: LayoutDashboard, screen: 'rooms' },
  { label: 'Get inspired', icon: Sparkles, screen: 'inspired' },
  { label: 'Find items', icon: Search, screen: 'marketplace' },
  { label: 'Find a carrier', icon: Truck, screen: 'carrier' },
  { label: 'Upload items', icon: Upload, screen: 'uploads' },
  { label: 'Compare prices', icon: Gauge, screen: 'prices' },
  { label: 'Connect Facebook', icon: Wifi, screen: 'facebook' },
]

const liveBackdrops: Backdrop[] = [
  {
    id: 'studio',
    label: 'Bright studio',
    className: 'backdrop-studio',
    floor: '#d8d2c7',
    wall: '#f8faf7',
    accent: '#486b62',
  },
  {
    id: 'loft',
    label: 'City loft',
    className: 'backdrop-loft',
    floor: '#c8c3ba',
    wall: '#eef1ee',
    accent: '#5f6f7a',
  },
  {
    id: 'warm',
    label: 'Warm bedroom',
    className: 'backdrop-warm',
    floor: '#d6c2a6',
    wall: '#fbf5ea',
    accent: '#8d6b4f',
  },
]

const objectDefaults: Record<
  RoomObjectKind,
  { label: string; icon: LucideIcon; widthIn: number; depthIn: number; heightIn: number; color: string }
> = {
  wall: { label: 'Wall', icon: BrickWall, widthIn: 144, depthIn: 5, heightIn: 96, color: '#8d9791' },
  door: { label: 'Door', icon: DoorOpen, widthIn: 36, depthIn: 6, heightIn: 82, color: '#b79266' },
  window: { label: 'Window', icon: Square, widthIn: 52, depthIn: 5, heightIn: 44, color: '#a9bfcb' },
  art: { label: 'Art', icon: ImagePlus, widthIn: 34, depthIn: 4, heightIn: 32, color: '#bd8672' },
  sofa: { label: 'Sofa', icon: Sofa, widthIn: 84, depthIn: 38, heightIn: 34, color: '#8aa18c' },
  table: { label: 'Table', icon: Table2, widthIn: 46, depthIn: 28, heightIn: 18, color: '#9a7b5b' },
  lamp: { label: 'Lamp', icon: LampDesk, widthIn: 18, depthIn: 18, heightIn: 64, color: '#c8b36d' },
  rug: { label: 'Rug', icon: Square, widthIn: 96, depthIn: 72, heightIn: 2, color: '#b9b0a4' },
  cabinet: { label: 'Cabinet', icon: Box, widthIn: 54, depthIn: 20, heightIn: 34, color: '#7f8a84' },
}

const catalogKinds: RoomObjectKind[] = ['wall', 'door', 'window', 'sofa', 'table', 'lamp', 'rug', 'cabinet', 'art']
const styleSuggestions = ['Scandinavian calm', 'Bright modern', 'Compact cozy', 'Warm wood', 'Gallery wall']
const itemSuggestions = ['Sofa', 'Coffee table', 'Floor lamp', 'Media console', 'Bookshelf', 'Accent chair']
const colorChoices = ['#8aa18c', '#9a7b5b', '#a9bfcb', '#d7d2c5', '#bd8672', '#6f7974']

const initialAddress: Address = {
  state: 'NY',
  city: 'Brooklyn',
  street: '184 Market Street',
  apartment: '4B',
  floor: '4',
}

const initialObjects: RoomObject[] = [
  createRoomObject('wall', 16, 20, 0, 'Wall 1'),
  createRoomObject('wall', 16, 78, 0, 'Wall 2'),
  createRoomObject('door', 82, 68, 90, 'Door 1'),
  createRoomObject('window', 44, 20, 0, 'Window 1'),
  createRoomObject('sofa', 48, 55, 0, 'Sofa 1'),
  createRoomObject('table', 49, 43, 0, 'Coffee table 1'),
  createRoomObject('lamp', 73, 39, 0, 'Floor lamp 1'),
]

const initialItems: ItemDetail[] = [
  { id: 'sofa', name: 'Sofa', length: 86, height: 33, width: 36, color: '#8aa18c', auto: false, fetch: true },
  { id: 'coffee-table', name: 'Coffee table', length: 42, height: 18, width: 24, color: '#9a7b5b', auto: true, fetch: true },
  { id: 'floor-lamp', name: 'Floor lamp', length: 16, height: 64, width: 16, color: '#c8b36d', auto: true, fetch: false },
]

const savedRooms = [
  { name: 'Living room', status: 'Draft design ready', price: '$1,240', freshness: '2 listings need refresh' },
  { name: 'Kitchen', status: 'Measurements needed', price: '$680 target', freshness: 'No Marketplace fetch yet' },
  { name: 'Bedroom', status: 'Saved inspiration', price: '$920 target', freshness: 'Ready to reopen' },
]

const marketplaceItems = [
  { name: 'Low sage sofa', price: '$420', distance: '3.2 mi', kind: 'sofa' as RoomObjectKind },
  { name: 'Round wood table', price: '$95', distance: '1.4 mi', kind: 'table' as RoomObjectKind },
  { name: 'Narrow storage cabinet', price: '$180', distance: '5.1 mi', kind: 'cabinet' as RoomObjectKind },
]

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('create')
  const [signedIn, setSignedIn] = useState(false)
  const [screen, setScreen] = useState<Screen>('start')
  const [activeStep, setActiveStep] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('corner')
  const [resetCameraKey, setResetCameraKey] = useState(0)
  const [showMeasurements, setShowMeasurements] = useState(true)
  const [liveBackgrounds, setLiveBackgrounds] = useState(true)
  const [activeBackdropId, setActiveBackdropId] = useState(liveBackdrops[0].id)
  const [objects, setObjects] = useState(initialObjects)
  const [selectedObjectId, setSelectedObjectId] = useState(initialObjects[4].id)
  const [address, setAddress] = useState(initialAddress)
  const [styleAnswer, setStyleAnswer] = useState('bright, modern, affordable, with enough room to walk')
  const [selectedStyles, setSelectedStyles] = useState(['Bright modern', 'Warm wood'])
  const [wantedItems, setWantedItems] = useState(['Sofa', 'Coffee table', 'Floor lamp'])
  const [itemDetails, setItemDetails] = useState(initialItems)
  const [fetchFromWeb, setFetchFromWeb] = useState(true)
  const [budget, setBudget] = useState(1450)
  const [facebookConnected, setFacebookConnected] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState('clear-slate')
  const [activityMessage, setActivityMessage] = useState('Planner ready')

  const activeBackdrop = liveBackdrops.find((backdrop) => backdrop.id === activeBackdropId) ?? liveBackdrops[0]
  const activeWizardStep = wizardSteps[activeStep]
  const selectedObject = objects.find((object) => object.id === selectedObjectId) ?? objects[0]
  const uploadedObjects = objects.filter((object) => object.imageUrl)

  const designOptions = useMemo<DesignOption[]>(
    () => [
      {
        id: 'clear-slate',
        name: 'Clear Slate',
        mood: 'open walkway, low sofa, wood table, calm wall art',
        price: Math.max(620, budget - 210),
        pool: 'Strong',
        health: 'Fresh',
        fit: '94%',
        accent: '#486b62',
        items: ['Sofa', 'Coffee table', 'Floor lamp'],
      },
      {
        id: 'market-calm',
        name: 'Market Calm',
        mood: 'compact layout, warm cabinet, flexible lighting',
        price: Math.max(540, budget - 360),
        pool: 'Medium',
        health: 'One stale',
        fit: '88%',
        accent: '#8d6b4f',
        items: ['Loveseat', 'Round table', 'Bookshelf'],
      },
      {
        id: 'soft-gallery',
        name: 'Soft Gallery',
        mood: 'neutral furniture, framed wall, extra storage',
        price: Math.min(budget + 90, 2450),
        pool: 'Thin',
        health: 'Needs backup',
        fit: '81%',
        accent: '#5f6f7a',
        items: ['Accent chair', 'Console', 'Floor lamp'],
      },
      {
        id: 'easy-pickup',
        name: 'Easy Pickup',
        mood: 'few large items, strong fit, easiest transport path',
        price: Math.max(480, budget - 500),
        pool: 'Strong',
        health: 'Fresh',
        fit: '96%',
        accent: '#6f7974',
        items: ['Sofa', 'Nesting tables', 'Media console'],
      },
    ],
    [budget],
  )

  const selectedOption = designOptions.find((option) => option.id === selectedOptionId) ?? designOptions[0]

  useEffect(() => {
    if (!liveBackgrounds || screen !== 'wizard') return

    const timer = window.setInterval(() => {
      setActiveBackdropId((current) => {
        const index = liveBackdrops.findIndex((backdrop) => backdrop.id === current)
        return liveBackdrops[(index + 1) % liveBackdrops.length].id
      })
    }, 4500)

    return () => window.clearInterval(timer)
  }, [liveBackgrounds, screen])

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignedIn(true)
    setScreen('start')
    setActivityMessage('Address confirmed before project start')
  }

  function handleFacebookAuth() {
    setFacebookConnected(true)
    setSignedIn(true)
    setScreen('start')
    setActivityMessage('Facebook connected for sign-in prototype')
  }

  function openScreen(nextScreen: Screen) {
    setScreen(nextScreen)
    setGenerating(false)
    setActivityMessage(`${screenTitle(nextScreen)} opened`)
  }

  function startNewRoom() {
    setScreen('wizard')
    setActiveStep(0)
    setActivityMessage('Room planner opened')
  }

  function goNext() {
    if (activeStep === 6) {
      setGenerating(true)
      setActivityMessage('Generating designs from the live room state')
      window.setTimeout(() => {
        setGenerating(false)
        setActiveStep(7)
        setActivityMessage('Four design options generated')
      }, 900)
      return
    }

    setActiveStep((step) => Math.min(step + 1, wizardSteps.length - 1))
  }

  function goBack() {
    if (generating) return
    setActiveStep((step) => Math.max(step - 1, 0))
  }

  function addObject(kind: RoomObjectKind, imageUrl?: string) {
    const count = objects.filter((object) => object.kind === kind).length + 1
    const object = createRoomObject(kind, clamp(38 + count * 4, 16, 84), clamp(42 + count * 5, 18, 82), 0, undefined, imageUrl)

    setObjects((current) => [...current, object])
    setSelectedObjectId(object.id)
    setActivityMessage(`${object.name} added to room`)
  }

  function updateObject(id: string, patch: Partial<RoomObject>) {
    setObjects((current) => current.map((object) => (object.id === id ? { ...object, ...patch } : object)))
  }

  function deleteSelectedObject() {
    const index = objects.findIndex((object) => object.id === selectedObject.id)
    if (index < 0 || objects.length <= 1) return

    const nextObjects = objects.filter((object) => object.id !== selectedObject.id)
    setObjects(nextObjects)
    setSelectedObjectId(nextObjects[Math.max(0, index - 1)].id)
    setActivityMessage(`${selectedObject.name} removed`)
  }

  function duplicateSelectedObject() {
    const clone = {
      ...selectedObject,
      id: `${selectedObject.kind}-${Date.now()}`,
      name: `${selectedObject.name} copy`,
      x: clamp(selectedObject.x + 5, 8, 92),
      y: clamp(selectedObject.y + 5, 8, 92),
    }

    setObjects((current) => [...current, clone])
    setSelectedObjectId(clone.id)
    setActivityMessage(`${selectedObject.name} duplicated`)
  }

  function toggleStyle(style: string) {
    setSelectedStyles((current) =>
      current.includes(style) ? current.filter((item) => item !== style) : [...current, style],
    )
  }

  function toggleWantedItem(item: string) {
    const exists = wantedItems.includes(item)
    setWantedItems((current) => (exists ? current.filter((value) => value !== item) : [...current, item]))
    setItemDetails((current) => {
      if (exists) return current.filter((detail) => detail.name !== item)

      return [
        ...current,
        {
          id: item.toLowerCase().replace(/\s+/g, '-'),
          name: item,
          length: 36,
          height: 28,
          width: 22,
          color: colorChoices[current.length % colorChoices.length],
          auto: true,
          fetch: fetchFromWeb,
        },
      ]
    })
  }

  function updateItem(id: string, patch: Partial<ItemDetail>) {
    setItemDetails((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function handleItemImageUpload(id: string, file: File) {
    readImageFile(file, (imageUrl) => {
      updateItem(id, { imageUrl })
      setActivityMessage('Item picture attached')
    })
  }

  function handleSelectedObjectImage(file: File) {
    readImageFile(file, (imageUrl) => {
      updateObject(selectedObject.id, { imageUrl })
      setActivityMessage(`${selectedObject.name} picture attached`)
    })
  }

  function handleNewUpload(file: File) {
    readImageFile(file, (imageUrl) => {
      addObject('cabinet', imageUrl)
      setActivityMessage('Uploaded item added to room')
    })
  }

  function handleUseMarketplaceItem(kind: RoomObjectKind, label: string) {
    addObject(kind)
    setScreen('wizard')
    setActiveStep(0)
    setViewMode('2d')
    setActivityMessage(`${label} placed in the planner`)
  }

  if (!signedIn) {
    return (
      <AuthGate
        address={address}
        authMode={authMode}
        facebookConnected={facebookConnected}
        onAddressChange={setAddress}
        onAuthModeChange={setAuthMode}
        onFacebookAuth={handleFacebookAuth}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="command-rail" aria-label="CheapTruck menu">
        <button className="brand-mark" onClick={() => openScreen('start')} aria-label="Open project start">
          <Home size={23} />
          <span>CheapTruck</span>
        </button>

        <nav className="menu-stack">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`menu-button ${screen === item.screen ? 'active' : ''}`}
                onClick={() => openScreen(item.screen)}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            <span className="eyebrow">Prototype correction pass</span>
            <h1>{screen === 'wizard' ? activeWizardStep.label : screenTitle(screen)}</h1>
          </div>

          <div className="status-strip" aria-live="polite">
            <BadgeCheck size={18} />
            <span>{activityMessage}</span>
          </div>

          <button className="profile-chip" aria-label="Open user profile" title="User profile" onClick={() => openScreen('profile')}>
            <UserRound size={18} />
            <span>Yahel</span>
          </button>
        </header>

        {screen === 'start' && (
          <ProjectStart
            address={address}
            facebookConnected={facebookConnected}
            onContinueRoom={() => {
              setScreen('wizard')
              setActiveStep(7)
              setActivityMessage('Design options reopened')
            }}
            onOpenRooms={() => openScreen('rooms')}
            onStartNewRoom={startNewRoom}
          />
        )}

        {screen === 'rooms' && (
          <RoomsDashboard
            onAddRoom={startNewRoom}
            onOpenDesign={() => {
              setScreen('wizard')
              setActiveStep(7)
              setActivityMessage('Saved design opened')
            }}
          />
        )}

        {screen === 'wizard' && (
          <section className="wizard-shell">
            <div className="step-lane" aria-label="Room creation steps">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <button
                    key={step.id}
                    className={`step-pill ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'complete' : ''}`}
                    onClick={() => {
                      if (!generating) {
                        setActiveStep(index)
                        setActivityMessage(`${step.label} step opened`)
                      }
                    }}
                    aria-label={`Open ${step.label}`}
                    title={step.label}
                  >
                    <Icon size={16} />
                    <span>{step.label}</span>
                  </button>
                )
              })}
            </div>

            {generating ? (
              <GeneratingState />
            ) : (
              <div className="planner-layout">
                <section className="room-stage" aria-label="Room planner">
                  <PlannerToolbar
                    activeBackdropId={activeBackdropId}
                    cameraPreset={cameraPreset}
                    liveBackgrounds={liveBackgrounds}
                    showMeasurements={showMeasurements}
                    viewMode={viewMode}
                    onAddObject={addObject}
                    onCameraPresetChange={setCameraPreset}
                    onResetCamera={() => setResetCameraKey((value) => value + 1)}
                    onSetBackdrop={setActiveBackdropId}
                    onToggleLiveBackgrounds={() => setLiveBackgrounds((value) => !value)}
                    onToggleMeasurements={() => setShowMeasurements((value) => !value)}
                    onViewModeChange={setViewMode}
                  />

                  <div className="stage-viewport">
                    {viewMode === '2d' ? (
                      <RoomCanvas2D
                        activeBackdrop={activeBackdrop}
                        objects={objects}
                        selectedObjectId={selectedObjectId}
                        showMeasurements={showMeasurements}
                        onMoveObject={updateObject}
                        onSelectObject={setSelectedObjectId}
                      />
                    ) : (
                      <RoomScene3D
                        activeBackdrop={activeBackdrop}
                        cameraPreset={cameraPreset}
                        objects={objects}
                        resetKey={resetCameraKey}
                        selectedObjectId={selectedObjectId}
                      />
                    )}
                  </div>
                </section>

                <aside className="control-deck" aria-label="Planner controls">
                  <WizardPanel
                    activeStep={activeStep}
                    address={address}
                    budget={budget}
                    designOptions={designOptions}
                    fetchFromWeb={fetchFromWeb}
                    itemDetails={itemDetails}
                    objects={objects}
                    selectedObject={selectedObject}
                    selectedOption={selectedOption}
                    selectedOptionId={selectedOptionId}
                    selectedStyles={selectedStyles}
                    styleAnswer={styleAnswer}
                    wantedItems={wantedItems}
                    onAddressChange={setAddress}
                    onBudgetChange={setBudget}
                    onDeleteObject={deleteSelectedObject}
                    onDuplicateObject={duplicateSelectedObject}
                    onFetchFromWebChange={setFetchFromWeb}
                    onItemImageUpload={handleItemImageUpload}
                    onNewUpload={handleNewUpload}
                    onSelectedObjectImage={handleSelectedObjectImage}
                    onSelectObject={setSelectedObjectId}
                    onSelectOption={setSelectedOptionId}
                    onStyleAnswerChange={setStyleAnswer}
                    onToggleStyle={toggleStyle}
                    onToggleWantedItem={toggleWantedItem}
                    onUpdateItem={updateItem}
                    onUpdateObject={updateObject}
                  />

                  <div className="wizard-actions">
                    <button className="secondary-action" onClick={goBack} disabled={activeStep === 0}>
                      <ArrowLeft size={17} />
                      <span>Back</span>
                    </button>
                    {activeStep < wizardSteps.length - 1 ? (
                      <button className="primary-action" onClick={goNext}>
                        <span>{activeStep === 6 ? 'Generate options' : 'Next'}</span>
                        <ArrowRight size={17} />
                      </button>
                    ) : (
                      <button className="primary-action" onClick={() => openScreen('rooms')}>
                        <span>Save room</span>
                        <Check size={17} />
                      </button>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </section>
        )}

        {isShortcutScreen(screen) && (
          <ShortcutPanel
            address={address}
            budget={budget}
            facebookConnected={facebookConnected}
            screen={screen}
            uploadedObjects={uploadedObjects}
            onAddMarketplaceItem={handleUseMarketplaceItem}
            onConnectFacebook={() => {
              setFacebookConnected(true)
              setActivityMessage('Facebook connected for Marketplace prototype')
            }}
            onDisconnectFacebook={() => {
              setFacebookConnected(false)
              setActivityMessage('Facebook disconnected')
            }}
            onNewUpload={handleNewUpload}
            onOpenPlanner={startNewRoom}
            onAddressChange={setAddress}
            onSetBudget={setBudget}
          />
        )}
      </main>
    </div>
  )
}

function AuthGate({
  address,
  authMode,
  facebookConnected,
  onAddressChange,
  onAuthModeChange,
  onFacebookAuth,
  onSubmit,
}: {
  address: Address
  authMode: AuthMode
  facebookConnected: boolean
  onAddressChange: (address: Address) => void
  onAuthModeChange: (mode: AuthMode) => void
  onFacebookAuth: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="CheapTruck entry">
        <div className="auth-brand">
          <div className="brand-icon">
            <Home size={30} />
          </div>
          <p>CheapTruck</p>
        </div>
        <div className="light-room-preview" aria-hidden="true">
          <div className="preview-wall left" />
          <div className="preview-wall back" />
          <div className="preview-floor" />
          <div className="preview-sofa" />
          <div className="preview-table" />
          <div className="preview-window" />
          <div className="preview-path" />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">Marketplace-powered room design</span>
          <h1>CheapTruck</h1>
          <p>Plan the room, place your own items, then compare local listings with fit and pickup details visible.</p>
        </div>
      </section>

      <form className="auth-panel" onSubmit={onSubmit}>
        <div className="auth-mode" role="group" aria-label="Account mode">
          <button
            type="button"
            className={authMode === 'create' ? 'active' : ''}
            onClick={() => onAuthModeChange('create')}
          >
            <LogIn size={17} />
            <span>Create</span>
          </button>
          <button
            type="button"
            className={authMode === 'signin' ? 'active' : ''}
            onClick={() => onAuthModeChange('signin')}
          >
            <UserRound size={17} />
            <span>Sign in</span>
          </button>
        </div>

        <label>
          Name
          <input placeholder="Yahel Hagi" required={authMode === 'create'} />
        </label>

        <label>
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>

        <label>
          Password
          <input type="password" placeholder="password" required />
        </label>

        <button type="button" className={`facebook-action ${facebookConnected ? 'connected' : ''}`} onClick={onFacebookAuth}>
          <Wifi size={17} />
          <span>{facebookConnected ? 'Continue with Facebook connected' : 'Continue with Facebook'}</span>
        </button>

        <fieldset className="address-fieldset">
          <legend>Address</legend>
          <div className="address-grid">
            <label>
              State
              <input
                value={address.state}
                onChange={(event) => onAddressChange({ ...address, state: event.target.value })}
                required
              />
            </label>
            <label>
              City
              <input
                value={address.city}
                onChange={(event) => onAddressChange({ ...address, city: event.target.value })}
                required
              />
            </label>
            <label className="wide-field">
              Address
              <input
                value={address.street}
                onChange={(event) => onAddressChange({ ...address, street: event.target.value })}
                required
              />
            </label>
            <label>
              Apartment
              <input
                value={address.apartment}
                onChange={(event) => onAddressChange({ ...address, apartment: event.target.value })}
              />
            </label>
            <label>
              Floor
              <input
                value={address.floor}
                onChange={(event) => onAddressChange({ ...address, floor: event.target.value })}
              />
            </label>
          </div>
        </fieldset>

        <button className="primary-action full-action" type="submit">
          <span>{authMode === 'create' ? 'Create account' : 'Sign in'}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </main>
  )
}

function ProjectStart({
  address,
  facebookConnected,
  onContinueRoom,
  onOpenRooms,
  onStartNewRoom,
}: {
  address: Address
  facebookConnected: boolean
  onContinueRoom: () => void
  onOpenRooms: () => void
  onStartNewRoom: () => void
}) {
  return (
    <section className="start-grid">
      <div className="launch-panel live-panel">
        <span className="eyebrow">Account and address ready</span>
        <h2>Start with a real room planner, then bring in Marketplace options.</h2>
        <div className="launch-actions">
          <button className="primary-action" onClick={onStartNewRoom}>
            <Plus size={18} />
            <span>Create a new room</span>
          </button>
          <button className="secondary-action" onClick={onContinueRoom}>
            <Sofa size={18} />
            <span>View design options</span>
          </button>
        </div>
        <div className="confirmation-row">
          <span>
            <MapPin size={17} />
            {address.street}, {address.city}
          </span>
          <span>
            <Wifi size={17} />
            Facebook {facebookConnected ? 'connected' : 'not connected'}
          </span>
        </div>
      </div>

      <div className="mission-board">
        <StatusNode label="Room handling" value="move, resize, rotate, view in 3D" active />
        <StatusNode label="Uploads" value="own item photos can be placed" active />
        <StatusNode label="Marketplace" value="candidate pools stay visible" />
        <StatusNode label="Fit" value="dimensions update the live scene" />
      </div>

      <button className="saved-room-strip" onClick={onOpenRooms}>
        <LayoutDashboard size={20} />
        <span>Open saved rooms</span>
        <ArrowRight size={18} />
      </button>
    </section>
  )
}

function RoomsDashboard({ onAddRoom, onOpenDesign }: { onAddRoom: () => void; onOpenDesign: () => void }) {
  return (
    <section className="rooms-grid">
      {savedRooms.map((room) => (
        <button className="room-tile" key={room.name} onClick={onOpenDesign}>
          <div className="room-image" aria-hidden="true">
            <span>{room.name.slice(0, 1)}</span>
          </div>
          <div>
            <h2>{room.name}</h2>
            <p>{room.status}</p>
            <span>{room.price}</span>
          </div>
          <small>{room.freshness}</small>
        </button>
      ))}

      <button className="add-room-tile" onClick={onAddRoom}>
        <Plus size={24} />
        <span>Add another room</span>
      </button>
    </section>
  )
}

function PlannerToolbar({
  activeBackdropId,
  cameraPreset,
  liveBackgrounds,
  showMeasurements,
  viewMode,
  onAddObject,
  onCameraPresetChange,
  onResetCamera,
  onSetBackdrop,
  onToggleLiveBackgrounds,
  onToggleMeasurements,
  onViewModeChange,
}: {
  activeBackdropId: string
  cameraPreset: CameraPreset
  liveBackgrounds: boolean
  showMeasurements: boolean
  viewMode: ViewMode
  onAddObject: (kind: RoomObjectKind) => void
  onCameraPresetChange: (preset: CameraPreset) => void
  onResetCamera: () => void
  onSetBackdrop: (id: string) => void
  onToggleLiveBackgrounds: () => void
  onToggleMeasurements: () => void
  onViewModeChange: (mode: ViewMode) => void
}) {
  return (
    <div className="stage-toolbar">
      <div className="catalog-strip" aria-label="Add objects">
        {catalogKinds.map((kind) => {
          const Icon = objectDefaults[kind].icon
          return (
            <button key={kind} className="tool-button" onClick={() => onAddObject(kind)} title={`Add ${objectDefaults[kind].label}`} aria-label={`Add ${objectDefaults[kind].label}`}>
              <Icon size={17} />
              <span>{objectDefaults[kind].label}</span>
            </button>
          )
        })}
      </div>

      <div className="toolbar-groups">
        <div className="mode-toggle" role="group" aria-label="Room view">
          <button className={viewMode === '2d' ? 'active' : ''} onClick={() => onViewModeChange('2d')} aria-label="2D view">
            <PanelLeft size={17} />
            <span>2D</span>
          </button>
          <button className={viewMode === '3d' ? 'active' : ''} onClick={() => onViewModeChange('3d')} aria-label="3D view">
            <Move3D size={17} />
            <span>3D</span>
          </button>
        </div>

        <div className="mini-button-row" role="group" aria-label="Planner helpers">
          <button className={showMeasurements ? 'active' : ''} onClick={onToggleMeasurements} aria-label="Toggle measurements" title="Toggle measurements">
            <Ruler size={16} />
          </button>
          <button className={liveBackgrounds ? 'active' : ''} onClick={onToggleLiveBackgrounds} aria-label="Toggle live backgrounds" title="Toggle live backgrounds">
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      <div className="backdrop-row" aria-label="Live backgrounds">
        {liveBackdrops.map((backdrop) => (
          <button key={backdrop.id} className={activeBackdropId === backdrop.id ? 'active' : ''} onClick={() => onSetBackdrop(backdrop.id)}>
            {backdrop.label}
          </button>
        ))}
      </div>

      <div className="camera-row" aria-label="3D camera controls">
        {(['corner', 'top', 'front'] as CameraPreset[]).map((preset) => (
          <button key={preset} className={cameraPreset === preset ? 'active' : ''} onClick={() => onCameraPresetChange(preset)}>
            {preset}
          </button>
        ))}
        <button onClick={onResetCamera} aria-label="Reset camera" title="Reset camera">
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  )
}

function RoomCanvas2D({
  activeBackdrop,
  objects,
  onMoveObject,
  onSelectObject,
  selectedObjectId,
  showMeasurements,
}: {
  activeBackdrop: Backdrop
  objects: RoomObject[]
  selectedObjectId: string
  showMeasurements: boolean
  onMoveObject: (id: string, patch: Partial<RoomObject>) => void
  onSelectObject: (id: string) => void
}) {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null)

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const nextX = ((event.clientX - rect.left - dragging.offsetX) / rect.width) * 100
    const nextY = ((event.clientY - rect.top - dragging.offsetY) / rect.height) * 100

    onMoveObject(dragging.id, {
      x: clamp(nextX, 4, 96),
      y: clamp(nextY, 4, 96),
    })
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, object: RoomObject) {
    if (!boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    onSelectObject(object.id)
    setDragging({
      id: object.id,
      offsetX: event.clientX - rect.left - (object.x / 100) * rect.width,
      offsetY: event.clientY - rect.top - (object.y / 100) * rect.height,
    })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  return (
    <div
      className={`room-board ${activeBackdrop.className}`}
      ref={boardRef}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <div className="board-grid" aria-hidden="true" />
      <div className="measurement-ruler horizontal" aria-hidden="true">
        18 ft
      </div>
      <div className="measurement-ruler vertical" aria-hidden="true">
        12 ft
      </div>

      {objects.map((object) => {
        const widthPct = inchesToWidthPercent(object.widthIn)
        const depthPct = inchesToDepthPercent(object.depthIn)
        return (
          <button
            key={object.id}
            className={`plan-object ${object.kind} ${selectedObjectId === object.id ? 'selected' : ''}`}
            style={
              {
                '--object-color': object.color,
                backgroundImage: object.imageUrl ? `url(${object.imageUrl})` : undefined,
                height: `${depthPct}%`,
                left: `${object.x}%`,
                top: `${object.y}%`,
                transform: `translate(-50%, -50%) rotate(${object.rotation}deg)`,
                width: `${widthPct}%`,
              } as CSSProperties
            }
            onClick={() => onSelectObject(object.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') onMoveObject(object.id, { x: clamp(object.x - 2, 4, 96) })
              if (event.key === 'ArrowRight') onMoveObject(object.id, { x: clamp(object.x + 2, 4, 96) })
              if (event.key === 'ArrowUp') onMoveObject(object.id, { y: clamp(object.y - 2, 4, 96) })
              if (event.key === 'ArrowDown') onMoveObject(object.id, { y: clamp(object.y + 2, 4, 96) })
              if (event.key.toLowerCase() === 'r') onMoveObject(object.id, { rotation: normalizeRotation(object.rotation + 15) })
            }}
            onPointerDown={(event) => handlePointerDown(event, object)}
            title={object.name}
            aria-label={`Select ${object.name}`}
          >
            <span>{object.name}</span>
            {showMeasurements && (
              <small>
                {object.widthIn} x {object.depthIn}
              </small>
            )}
          </button>
        )
      })}
    </div>
  )
}

function RoomScene3D({
  activeBackdrop,
  cameraPreset,
  objects,
  resetKey,
  selectedObjectId,
}: {
  activeBackdrop: Backdrop
  cameraPreset: CameraPreset
  objects: RoomObject[]
  resetKey: number
  selectedObjectId: string
}) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const mount = host

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(activeBackdrop.wall)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120)
    setCameraPosition(camera, cameraPreset)

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = true
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.maxPolarAngle = Math.PI / 2.05
    controls.target.set(0, 0.8, 0)

    const roomGroup = new THREE.Group()
    scene.add(roomGroup)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM_WIDTH_FT, ROOM_DEPTH_FT),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(activeBackdrop.floor), metalness: 0.05, roughness: 0.64 }),
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI / 2
    roomGroup.add(floor)

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeBackdrop.wall),
      roughness: 0.72,
    })

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WIDTH_FT, 8, 0.12), wallMaterial)
    backWall.position.set(0, 4, -ROOM_DEPTH_FT / 2)
    backWall.receiveShadow = true
    roomGroup.add(backWall)

    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 8, ROOM_DEPTH_FT), wallMaterial)
    sideWall.position.set(-ROOM_WIDTH_FT / 2, 4, 0)
    sideWall.receiveShadow = true
    roomGroup.add(sideWall)

    const grid = new THREE.GridHelper(ROOM_WIDTH_FT, 18, 0xb9c8c1, 0xd9e1dd)
    grid.position.y = 0.012
    roomGroup.add(grid)

    objects.forEach((object) => {
      const mesh = createObjectMesh(object, object.id === selectedObjectId)
      roomGroup.add(mesh)
    })

    const walkPath = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7, 0.05, 4.6),
        new THREE.Vector3(-1.8, 0.05, 1.1),
        new THREE.Vector3(2.2, 0.05, -1.4),
        new THREE.Vector3(6.5, 0.05, -4),
      ]),
      new THREE.LineBasicMaterial({ color: new THREE.Color(activeBackdrop.accent), transparent: true, opacity: 0.65 }),
    )
    roomGroup.add(walkPath)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xaeb9b2, 2.2))
    const sun = new THREE.DirectionalLight(0xffffff, 2.4)
    sun.position.set(5, 9, 5)
    sun.castShadow = true
    scene.add(sun)

    function resize() {
      const rect = mount.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    let frame = 0
    function animate() {
      frame = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose()
          const materials = Array.isArray(node.material) ? node.material : [node.material]
          materials.forEach((material) => material.dispose())
        }
      })
    }
  }, [activeBackdrop, cameraPreset, objects, resetKey, selectedObjectId])

  return <div className="three-room" ref={hostRef} aria-label="Interactive 3D room preview" />
}

function WizardPanel({
  activeStep,
  address,
  budget,
  designOptions,
  fetchFromWeb,
  itemDetails,
  objects,
  selectedObject,
  selectedOption,
  selectedOptionId,
  selectedStyles,
  styleAnswer,
  wantedItems,
  onAddressChange,
  onBudgetChange,
  onDeleteObject,
  onDuplicateObject,
  onFetchFromWebChange,
  onItemImageUpload,
  onNewUpload,
  onSelectedObjectImage,
  onSelectObject,
  onSelectOption,
  onStyleAnswerChange,
  onToggleStyle,
  onToggleWantedItem,
  onUpdateItem,
  onUpdateObject,
}: {
  activeStep: number
  address: Address
  budget: number
  designOptions: DesignOption[]
  fetchFromWeb: boolean
  itemDetails: ItemDetail[]
  objects: RoomObject[]
  selectedObject: RoomObject
  selectedOption: DesignOption
  selectedOptionId: string
  selectedStyles: string[]
  styleAnswer: string
  wantedItems: string[]
  onAddressChange: (address: Address) => void
  onBudgetChange: (budget: number) => void
  onDeleteObject: () => void
  onDuplicateObject: () => void
  onFetchFromWebChange: (value: boolean) => void
  onItemImageUpload: (id: string, file: File) => void
  onNewUpload: (file: File) => void
  onSelectedObjectImage: (file: File) => void
  onSelectObject: (id: string) => void
  onSelectOption: (id: string) => void
  onStyleAnswerChange: (answer: string) => void
  onToggleStyle: (style: string) => void
  onToggleWantedItem: (item: string) => void
  onUpdateItem: (id: string, patch: Partial<ItemDetail>) => void
  onUpdateObject: (id: string, patch: Partial<RoomObject>) => void
}) {
  if (activeStep === 0) {
    return (
      <>
        <PanelHeader icon={<Ruler size={20} />} title="Customise the room" />
        <div className="object-list">
          {objects.map((object) => (
            <button
              key={object.id}
              className={`object-row ${object.id === selectedObject.id ? 'active' : ''}`}
              onClick={() => onSelectObject(object.id)}
            >
              <ObjectIcon kind={object.kind} />
              <span>{object.name}</span>
              <small>{object.rotation} deg</small>
            </button>
          ))}
        </div>

        <ObjectEditor
          object={selectedObject}
          onDelete={onDeleteObject}
          onDuplicate={onDuplicateObject}
          onImageUpload={onSelectedObjectImage}
          onUpdate={(patch) => onUpdateObject(selectedObject.id, patch)}
        />
      </>
    )
  }

  if (activeStep === 1) {
    return (
      <>
        <PanelHeader icon={<Sparkles size={20} />} title="What style should your room have?" />
        <textarea
          className="answer-box"
          value={styleAnswer}
          onChange={(event) => onStyleAnswerChange(event.target.value)}
          rows={5}
        />
        <ChipGrid items={styleSuggestions} selected={selectedStyles} onToggle={onToggleStyle} />
      </>
    )
  }

  if (activeStep === 2) {
    return (
      <>
        <PanelHeader icon={<ShoppingBag size={20} />} title="What items do you want?" />
        <ChipGrid items={itemSuggestions} selected={wantedItems} onToggle={onToggleWantedItem} />
        <div className="inline-output">
          <Box size={17} />
          <span>{wantedItems.length} item roles ready for request resolution</span>
        </div>
      </>
    )
  }

  if (activeStep === 3) {
    return (
      <>
        <PanelHeader icon={<Settings2 size={20} />} title="Size up your needed items" />
        <div className="item-stack">
          {itemDetails.map((item) => (
            <div className="item-editor" key={item.id}>
              <div className="item-editor-head">
                <strong>{item.name}</strong>
                <button
                  className={`mini-toggle ${item.auto ? 'active' : ''}`}
                  onClick={() => onUpdateItem(item.id, { auto: !item.auto })}
                  aria-label={`Let the system choose ${item.name}`}
                  title="Let the system choose"
                >
                  <WandSparkles size={15} />
                  <span>Auto</span>
                </button>
              </div>
              <RangeControl label="Length" max={120} min={8} value={item.length} onChange={(value) => onUpdateItem(item.id, { length: value })} />
              <RangeControl label="Height" max={96} min={8} value={item.height} onChange={(value) => onUpdateItem(item.id, { height: value })} />
              <RangeControl label="Width" max={72} min={8} value={item.width} onChange={(value) => onUpdateItem(item.id, { width: value })} />
              <div className="swatch-row" aria-label={`${item.name} color`}>
                {colorChoices.map((color) => (
                  <button
                    key={color}
                    className={`swatch ${item.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => onUpdateItem(item.id, { color })}
                    title={color}
                    aria-label={`Choose ${color}`}
                  />
                ))}
              </div>
              <div className="item-photo-row">
                {item.imageUrl && <img src={item.imageUrl} alt="" />}
                <UploadTile
                  label={item.imageUrl ? 'Replace item picture' : 'Upload item picture'}
                  onUpload={(file) => onItemImageUpload(item.id, file)}
                  testId={`item-upload-${item.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  if (activeStep === 4) {
    return (
      <>
        <PanelHeader icon={<Wifi size={20} />} title="Fetch everything from the web?" />
        <div className="binary-choice">
          <button className={fetchFromWeb ? 'active' : ''} onClick={() => onFetchFromWebChange(true)}>
            Yes
          </button>
          <button className={!fetchFromWeb ? 'active' : ''} onClick={() => onFetchFromWebChange(false)}>
            No
          </button>
        </div>

        <div className="fetch-list">
          {itemDetails.map((item) => (
            <label className={!fetchFromWeb ? 'disabled-row' : ''} key={item.id}>
              <input
                checked={item.fetch && fetchFromWeb}
                disabled={!fetchFromWeb}
                type="checkbox"
                onChange={(event) => onUpdateItem(item.id, { fetch: event.target.checked })}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </>
    )
  }

  if (activeStep === 5) {
    return (
      <>
        <PanelHeader icon={<DollarSign size={20} />} title="What is your price range?" />
        <div className="budget-readout">
          <span>${budget.toLocaleString()}</span>
          <small>Total room target</small>
        </div>
        <input
          className="budget-slider"
          max={2600}
          min={350}
          step={50}
          type="range"
          value={budget}
          onChange={(event) => onBudgetChange(Number(event.target.value))}
        />
        <div className="budget-marks">
          <span>$350</span>
          <span>$2,600</span>
        </div>
      </>
    )
  }

  if (activeStep === 6) {
    return (
      <>
        <PanelHeader icon={<MapPin size={20} />} title="Confirm the project address" />
        <AddressEditor address={address} onAddressChange={onAddressChange} compact />
        <div className="inline-output">
          <MapPin size={17} />
          <span>Used for Marketplace distance and pickup practicality</span>
        </div>
      </>
    )
  }

  return (
    <>
      <PanelHeader icon={<Sofa size={20} />} title="View design options" />
      <div className="option-grid">
        {designOptions.map((option) => (
          <button
            key={option.id}
            className={`option-tile ${selectedOptionId === option.id ? 'active' : ''}`}
            onClick={() => onSelectOption(option.id)}
            style={{ '--accent': option.accent } as CSSProperties}
          >
            <span>{option.name}</span>
            <strong>${option.price.toLocaleString()}</strong>
            <small>{option.fit} fit confidence</small>
          </button>
        ))}
      </div>
      <div className="option-detail" style={{ '--accent': selectedOption.accent } as CSSProperties}>
        <div>
          <span>{selectedOption.pool} pool</span>
          <span>{selectedOption.health}</span>
          <span>{selectedOption.fit} fit</span>
        </div>
        <p>{selectedOption.mood}</p>
        <ul>
          {selectedOption.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button className="secondary-action">
          <Check size={17} />
          <span>Select this option</span>
        </button>
      </div>
      <UploadTile label="Add your own item picture" onUpload={onNewUpload} testId="inline-upload-input" />
    </>
  )
}

function ObjectEditor({
  object,
  onDelete,
  onDuplicate,
  onImageUpload,
  onUpdate,
}: {
  object: RoomObject
  onDelete: () => void
  onDuplicate: () => void
  onImageUpload: (file: File) => void
  onUpdate: (patch: Partial<RoomObject>) => void
}) {
  return (
    <div className="object-editor-panel">
      <div className="selected-object-title">
        <ObjectIcon kind={object.kind} />
        <div>
          <strong>{object.name}</strong>
          <span>{objectDefaults[object.kind].label}</span>
        </div>
      </div>

      <div className="nudge-grid" aria-label="Move selected object">
        <button onClick={() => onUpdate({ y: clamp(object.y - 2, 4, 96) })} aria-label="Move up">
          Up
        </button>
        <button onClick={() => onUpdate({ x: clamp(object.x - 2, 4, 96) })} aria-label="Move left">
          Left
        </button>
        <button onClick={() => onUpdate({ x: clamp(object.x + 2, 4, 96) })} aria-label="Move right">
          Right
        </button>
        <button onClick={() => onUpdate({ y: clamp(object.y + 2, 4, 96) })} aria-label="Move down">
          Down
        </button>
      </div>

      <RangeControl controlId="object-x" label="Position X" max={96} min={4} value={object.x} onChange={(value) => onUpdate({ x: value })} />
      <RangeControl controlId="object-y" label="Position Y" max={96} min={4} value={object.y} onChange={(value) => onUpdate({ y: value })} />
      <RangeControl controlId="object-width" label="Object width" max={160} min={8} value={object.widthIn} onChange={(value) => onUpdate({ widthIn: value })} />
      <RangeControl controlId="object-depth" label="Object depth" max={120} min={4} value={object.depthIn} onChange={(value) => onUpdate({ depthIn: value })} />
      <RangeControl controlId="object-height" label="Object height" max={108} min={2} value={object.heightIn} onChange={(value) => onUpdate({ heightIn: value })} />
      <RangeControl controlId="object-rotation" label="Rotation" max={359} min={0} value={object.rotation} onChange={(value) => onUpdate({ rotation: value })} />

      <div className="quick-actions">
        <button onClick={() => onUpdate({ rotation: normalizeRotation(object.rotation - 15) })}>
          <RotateCcw size={15} />
          <span>Rotate</span>
        </button>
        <button onClick={() => onUpdate({ rotation: normalizeRotation(object.rotation + 15) })}>
          <RotateCw size={15} />
          <span>Rotate</span>
        </button>
        <button onClick={onDuplicate}>
          <PackagePlus size={15} />
          <span>Copy</span>
        </button>
        <button onClick={onDelete} disabled={object.kind === 'wall' && object.name === 'Wall 1'}>
          <Box size={15} />
          <span>Delete</span>
        </button>
      </div>

      <UploadTile
        label={object.imageUrl ? 'Replace object picture' : 'Upload object picture'}
        onUpload={onImageUpload}
        testId="selected-image-input"
      />
    </div>
  )
}

function ShortcutPanel({
  address,
  budget,
  facebookConnected,
  onAddMarketplaceItem,
  onConnectFacebook,
  onDisconnectFacebook,
  onNewUpload,
  onOpenPlanner,
  onAddressChange,
  onSetBudget,
  screen,
  uploadedObjects,
}: {
  address: Address
  budget: number
  facebookConnected: boolean
  screen: Screen
  uploadedObjects: RoomObject[]
  onAddMarketplaceItem: (kind: RoomObjectKind, label: string) => void
  onConnectFacebook: () => void
  onDisconnectFacebook: () => void
  onNewUpload: (file: File) => void
  onOpenPlanner: () => void
  onAddressChange: (address: Address) => void
  onSetBudget: (value: number) => void
}) {
  if (screen === 'inspired') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Sparkles size={20} />} title="Get inspired" />
        <div className="inspiration-grid">
          {liveBackdrops.map((backdrop) => (
            <button key={backdrop.id} className={`inspiration-card ${backdrop.className}`} onClick={onOpenPlanner}>
              <span>{backdrop.label}</span>
              <small>Start from this room mood</small>
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (screen === 'marketplace') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Search size={20} />} title="Find items" />
        <div className="market-list">
          {marketplaceItems.map((item) => (
            <div className="market-row" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.price} / {item.distance}
                </span>
              </div>
              <button className="secondary-action" onClick={() => onAddMarketplaceItem(item.kind, item.name)}>
                <Plus size={16} />
                <span>Use in room</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (screen === 'carrier') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Truck size={20} />} title="Find a carrier" />
        <div className="service-grid">
          <StatusNode label="Pickup van" value="$45 estimate / 4.8 mi route" active />
          <StatusNode label="Two-person lift" value="$85 estimate / pending approval" />
          <StatusNode label="Seller pickup window" value="Ask after item approval" />
        </div>
      </section>
    )
  }

  if (screen === 'uploads') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Upload size={20} />} title="Upload items" />
        <UploadTile label="Upload an item picture and place it in the room" onUpload={onNewUpload} testId="new-upload-input" />
        <div className="uploaded-grid">
          {uploadedObjects.length === 0 ? (
            <p>No uploaded item pictures yet.</p>
          ) : (
            uploadedObjects.map((object) => (
              <div className="uploaded-card" key={object.id}>
                <img src={object.imageUrl} alt="" />
                <strong>{object.name}</strong>
              </div>
            ))
          )}
        </div>
      </section>
    )
  }

  if (screen === 'prices') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Gauge size={20} />} title="Compare prices" />
        <div className="budget-readout compact-readout">
          <span>${budget.toLocaleString()}</span>
          <small>Total target</small>
        </div>
        <input
          className="budget-slider"
          max={2600}
          min={350}
          step={50}
          type="range"
          value={budget}
          onChange={(event) => onSetBudget(Number(event.target.value))}
        />
        <div className="service-grid">
          <StatusNode label="Best value" value="Easy Pickup / under target" active />
          <StatusNode label="Highest fit" value="Clear Slate / 94% confidence" />
          <StatusNode label="Weak pool" value="Soft Gallery / needs backups" />
        </div>
      </section>
    )
  }

  if (screen === 'facebook') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<Wifi size={20} />} title="Connect Facebook" />
        <div className="facebook-panel">
          <div>
            <strong>{facebookConnected ? 'Facebook is connected' : 'Facebook is not connected'}</strong>
            <p>This prototype simulates the connection state. A real Marketplace connection will need Facebook app configuration and auth approval.</p>
          </div>
          {facebookConnected ? (
            <button className="secondary-action" onClick={onDisconnectFacebook}>
              <Link size={16} />
              <span>Disconnect Facebook</span>
            </button>
          ) : (
            <button className="primary-action" onClick={onConnectFacebook}>
              <Wifi size={16} />
              <span>Connect Facebook</span>
            </button>
          )}
        </div>
      </section>
    )
  }

  if (screen === 'profile') {
    return (
      <section className="shortcut-panel">
        <PanelHeader icon={<UserRound size={20} />} title="Profile" />
        <AddressEditor address={address} onAddressChange={onAddressChange} compact />
        <div className="inline-output">
          <BadgeCheck size={17} />
          <span>Profile details are prototype-only for now</span>
        </div>
      </section>
    )
  }

  return null
}

function GeneratingState() {
  return (
    <section className="generating-panel" aria-live="polite">
      <div className="thinking-room">
        <Sofa size={34} />
      </div>
      <span className="eyebrow">AI thinking</span>
      <h2>Checking room fit, Marketplace pools, prices, and pickup practicality.</h2>
      <div className="scan-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  )
}

function AddressEditor({
  address,
  compact,
  onAddressChange,
}: {
  address: Address
  compact?: boolean
  onAddressChange: (address: Address) => void
}) {
  return (
    <div className={`address-grid ${compact ? 'compact' : ''}`}>
      <label>
        State
        <input value={address.state} onChange={(event) => onAddressChange({ ...address, state: event.target.value })} />
      </label>
      <label>
        City
        <input value={address.city} onChange={(event) => onAddressChange({ ...address, city: event.target.value })} />
      </label>
      <label className="wide-field">
        Address
        <input value={address.street} onChange={(event) => onAddressChange({ ...address, street: event.target.value })} />
      </label>
      <label>
        Apartment
        <input value={address.apartment} onChange={(event) => onAddressChange({ ...address, apartment: event.target.value })} />
      </label>
      <label>
        Floor
        <input value={address.floor} onChange={(event) => onAddressChange({ ...address, floor: event.target.value })} />
      </label>
    </div>
  )
}

function UploadTile({ label, onUpload, testId }: { label: string; onUpload: (file: File) => void; testId: string }) {
  return (
    <label className="upload-tile">
      <ImagePlus size={18} />
      <span>{label}</span>
      <input
        accept="image/*"
        data-testid={testId}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ''
        }}
      />
    </label>
  )
}

function PanelHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="panel-header">
      <span className="panel-icon">{icon}</span>
      <h2>{title}</h2>
    </div>
  )
}

function ChipGrid({
  items,
  onToggle,
  selected,
}: {
  items: string[]
  selected: string[]
  onToggle: (item: string) => void
}) {
  return (
    <div className="chip-grid">
      {items.map((item) => (
        <button key={item} className={selected.includes(item) ? 'selected' : ''} onClick={() => onToggle(item)}>
          {selected.includes(item) && <Check size={14} />}
          <span>{item}</span>
        </button>
      ))}
    </div>
  )
}

function RangeControl({
  controlId,
  label,
  max,
  min,
  onChange,
  value,
}: {
  controlId?: string
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>{Math.round(value)}</strong>
      </span>
      <input
        aria-label={label}
        data-control={controlId}
        max={max}
        min={min}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function StatusNode({ active, label, value }: { active?: boolean; label: string; value: string }) {
  return (
    <div className={`status-node ${active ? 'active' : ''}`}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  )
}

function ObjectIcon({ kind }: { kind: RoomObjectKind }) {
  const Icon = objectDefaults[kind].icon
  return <Icon size={16} />
}

function createRoomObject(kind: RoomObjectKind, x: number, y: number, rotation = 0, name?: string, imageUrl?: string): RoomObject {
  const defaults = objectDefaults[kind]
  return {
    id: `${kind}-${Date.now()}-${Math.round(Math.random() * 100000)}`,
    kind,
    name: name ?? `${defaults.label} ${Math.max(1, Math.round(Math.random() * 20))}`,
    x,
    y,
    widthIn: defaults.widthIn,
    depthIn: defaults.depthIn,
    heightIn: defaults.heightIn,
    rotation,
    color: defaults.color,
    imageUrl,
  }
}

function createObjectMesh(object: RoomObject, selected: boolean) {
  const widthFt = Math.max(0.2, object.widthIn / 12)
  const depthFt = Math.max(0.2, object.depthIn / 12)
  const heightFt = Math.max(0.05, object.heightIn / 12)
  const x = (object.x / 100 - 0.5) * ROOM_WIDTH_FT
  const z = (object.y / 100 - 0.5) * ROOM_DEPTH_FT
  const color = new THREE.Color(object.color)

  const group = new THREE.Group()
  group.position.set(x, 0, z)
  group.rotation.y = -THREE.MathUtils.degToRad(object.rotation)

  if (object.kind === 'lamp') {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, heightFt, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 }),
    )
    pole.position.y = heightFt / 2
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(widthFt / 2, widthFt / 2.4, 0.5, 18),
      new THREE.MeshStandardMaterial({ color: 0xf0e3b2, roughness: 0.38 }),
    )
    shade.position.y = heightFt
    group.add(pole, shade)
  } else {
    const geometry = new THREE.BoxGeometry(widthFt, heightFt, depthFt)
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: object.kind === 'window' ? 0.05 : 0.02,
      roughness: 0.52,
      transparent: object.kind === 'window',
      opacity: object.kind === 'window' ? 0.72 : 1,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.y = heightFt / 2
    group.add(mesh)
  }

  if (selected) {
    const outlineGeometry = new THREE.BoxGeometry(widthFt + 0.12, heightFt + 0.12, depthFt + 0.12)
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(outlineGeometry),
      new THREE.LineBasicMaterial({ color: 0x26756b }),
    )
    outline.position.y = heightFt / 2
    group.add(outline)
  }

  return group
}

function readImageFile(file: File, onLoad: (imageUrl: string) => void) {
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result)
  }
  reader.readAsDataURL(file)
}

function setCameraPosition(camera: THREE.PerspectiveCamera, preset: CameraPreset) {
  if (preset === 'top') camera.position.set(0, 18, 0.01)
  if (preset === 'front') camera.position.set(0, 5.2, 15)
  if (preset === 'corner') camera.position.set(9, 7, 10)
  camera.lookAt(0, 0.8, 0)
}

function inchesToWidthPercent(value: number) {
  return clamp((value / ROOM_WIDTH_IN) * 100, 3, 86)
}

function inchesToDepthPercent(value: number) {
  return clamp((value / ROOM_DEPTH_IN) * 100, 3, 86)
}

function screenTitle(screen: Screen) {
  const titles: Record<Screen, string> = {
    start: 'Start a room',
    wizard: 'Planner',
    rooms: 'Your rooms',
    inspired: 'Get inspired',
    marketplace: 'Find items',
    carrier: 'Find a carrier',
    uploads: 'Upload items',
    prices: 'Compare prices',
    facebook: 'Connect Facebook',
    profile: 'Profile',
    review: 'Seller review',
  }
  return titles[screen]
}

function isShortcutScreen(screen: Screen) {
  return ['inspired', 'marketplace', 'carrier', 'uploads', 'prices', 'facebook', 'profile'].includes(screen)
}

function normalizeRotation(value: number) {
  return Math.round((value + 360) % 360)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default App
