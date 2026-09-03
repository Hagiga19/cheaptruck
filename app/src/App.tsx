import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import * as THREE from 'three'
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
  LogIn,
  MapPin,
  Move3D,
  Paintbrush,
  PanelLeft,
  Plus,
  Ruler,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Square,
  Truck,
  Upload,
  UserRound,
  WandSparkles,
  Wifi,
} from 'lucide-react'
import './App.css'

type AuthMode = 'create' | 'signin'
type ViewMode = '2d' | '3d'
type Screen = 'start' | 'wizard' | 'rooms'
type RoomObjectKind = 'wall' | 'door' | 'window' | 'hang'

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
  width: number
  height: number
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

const wizardSteps = [
  { id: 'shape', label: 'Shape', icon: Ruler },
  { id: 'style', label: 'Style', icon: Paintbrush },
  { id: 'items', label: 'Items', icon: ShoppingBag },
  { id: 'details', label: 'Sizing', icon: SlidersHorizontal },
  { id: 'fetch', label: 'Fetch', icon: Wifi },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'options', label: 'Options', icon: Sparkles },
]

const menuItems = [
  { label: 'View your rooms', icon: LayoutDashboard, action: 'rooms' },
  { label: 'Get inspired', icon: Sparkles, action: 'inspired' },
  { label: 'Find items', icon: Search, action: 'items' },
  { label: 'Find a carrier', icon: Truck, action: 'carrier' },
  { label: 'Upload items', icon: Upload, action: 'upload' },
  { label: 'Compare prices', icon: Gauge, action: 'prices' },
  { label: 'Connect Facebook', icon: Wifi, action: 'facebook' },
]

const styleSuggestions = ['Neo cozy', 'Warm minimal', 'Japandi', 'Industrial glass', 'Retro color pop']
const itemSuggestions = ['Sofa', 'Coffee table', 'Floor lamp', 'Media console', 'Bookshelf', 'Accent chair']
const colorChoices = ['#36f4ff', '#b8ff5c', '#ff5ad7', '#ffd166', '#f4f0e8', '#8ef0c9']

const initialAddress: Address = {
  state: 'NY',
  city: 'Brooklyn',
  street: '184 Market Street',
  apartment: '4B',
  floor: '4',
}

const initialObjects: RoomObject[] = [
  { id: 'wall-1', kind: 'wall', name: 'Wall 1', x: 12, y: 17, width: 56, height: 4 },
  { id: 'wall-2', kind: 'wall', name: 'Wall 2', x: 12, y: 67, width: 56, height: 4 },
  { id: 'door-1', kind: 'door', name: 'Door 1', x: 70, y: 60, width: 14, height: 10 },
  { id: 'window-1', kind: 'window', name: 'Window 1', x: 32, y: 18, width: 18, height: 3 },
  { id: 'hang-1', kind: 'hang', name: 'Art rail 1', x: 70, y: 34, width: 13, height: 12 },
]

const initialItems: ItemDetail[] = [
  { id: 'sofa', name: 'Sofa', length: 86, height: 33, width: 36, color: '#36f4ff', auto: false, fetch: true },
  { id: 'coffee-table', name: 'Coffee table', length: 42, height: 18, width: 24, color: '#b8ff5c', auto: true, fetch: true },
  { id: 'floor-lamp', name: 'Floor lamp', length: 16, height: 64, width: 16, color: '#ffd166', auto: true, fetch: false },
]

const savedRooms = [
  { name: 'Living room', status: 'Draft option ready', price: '$1,240', freshness: '2 listings need refresh' },
  { name: 'Kitchen', status: 'Measurements needed', price: '$680 target', freshness: 'No Marketplace fetch yet' },
  { name: 'Bedroom', status: 'Saved inspiration', price: '$920 target', freshness: 'Ready to reopen' },
]

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('create')
  const [signedIn, setSignedIn] = useState(false)
  const [screen, setScreen] = useState<Screen>('start')
  const [activeStep, setActiveStep] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [objects, setObjects] = useState(initialObjects)
  const [selectedObjectId, setSelectedObjectId] = useState(initialObjects[0].id)
  const [address, setAddress] = useState(initialAddress)
  const [styleAnswer, setStyleAnswer] = useState('clean, futuristic, comfortable, not too expensive')
  const [selectedStyles, setSelectedStyles] = useState(['Neo cozy', 'Warm minimal'])
  const [wantedItems, setWantedItems] = useState(['Sofa', 'Coffee table', 'Floor lamp'])
  const [itemDetails, setItemDetails] = useState(initialItems)
  const [fetchFromWeb, setFetchFromWeb] = useState(true)
  const [budget, setBudget] = useState(1450)
  const [generating, setGenerating] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState('pulse-loft')
  const [activityMessage, setActivityMessage] = useState('Room shell synced to Measurements')

  const activeWizardStep = wizardSteps[activeStep]
  const selectedObject = objects.find((object) => object.id === selectedObjectId) ?? objects[0]

  const designOptions = useMemo<DesignOption[]>(
    () => [
      {
        id: 'pulse-loft',
        name: 'Pulse Loft',
        mood: 'low sofa, bright art rail, chrome table',
        price: Math.max(620, budget - 210),
        pool: 'Strong',
        health: 'Fresh',
        fit: '92%',
        accent: '#36f4ff',
        items: ['Sofa', 'Coffee table', 'Floor lamp'],
      },
      {
        id: 'market-calm',
        name: 'Market Calm',
        mood: 'warm wood, compact layout, flexible lamp',
        price: Math.max(540, budget - 360),
        pool: 'Medium',
        health: 'One stale',
        fit: '88%',
        accent: '#b8ff5c',
        items: ['Loveseat', 'Round table', 'Bookshelf'],
      },
      {
        id: 'color-rig',
        name: 'Color Rig',
        mood: 'bold chair, shelf wall, glowing corner',
        price: Math.min(budget + 90, 2450),
        pool: 'Thin',
        health: 'Needs backup',
        fit: '79%',
        accent: '#ff5ad7',
        items: ['Accent chair', 'Console', 'Floor lamp'],
      },
      {
        id: 'clean-signal',
        name: 'Clean Signal',
        mood: 'simple shapes, brighter walkway, easy pickup',
        price: Math.max(480, budget - 500),
        pool: 'Strong',
        health: 'Fresh',
        fit: '95%',
        accent: '#ffd166',
        items: ['Sofa', 'Nesting tables', 'Media console'],
      },
    ],
    [budget],
  )

  const selectedOption = designOptions.find((option) => option.id === selectedOptionId) ?? designOptions[0]

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignedIn(true)
    setScreen('start')
    setActivityMessage('Address confirmed before project start')
  }

  function handleMenuAction(action: string) {
    if (action === 'rooms') {
      setScreen('rooms')
      setActivityMessage('Saved rooms opened')
      return
    }

    if (action === 'items') {
      setScreen('wizard')
      setActiveStep(2)
      setActivityMessage('Jumped to wanted items')
      return
    }

    if (action === 'prices') {
      setScreen('wizard')
      setActiveStep(5)
      setActivityMessage('Budget controls opened')
      return
    }

    setActivityMessage(`${labelFromAction(action)} queued for a later product pass`)
  }

  function startNewRoom() {
    setScreen('wizard')
    setActiveStep(0)
    setActivityMessage('New room started')
  }

  function goNext() {
    if (activeStep === 6) {
      setGenerating(true)
      setActivityMessage('AI lining up designs, fit checks, and Marketplace pools')
      window.setTimeout(() => {
        setGenerating(false)
        setActiveStep(7)
        setActivityMessage('Four design options generated')
      }, 1100)
      return
    }

    setActiveStep((step) => Math.min(step + 1, wizardSteps.length - 1))
  }

  function goBack() {
    if (generating) return
    setActiveStep((step) => Math.max(step - 1, 0))
  }

  function addObject(kind: RoomObjectKind) {
    const count = objects.filter((object) => object.kind === kind).length + 1
    const object: RoomObject = {
      id: `${kind}-${Date.now()}`,
      kind,
      name: `${kindLabel(kind)} ${count}`,
      x: clamp(18 + count * 7, 8, 76),
      y: clamp(22 + count * 8, 12, 74),
      width: kind === 'wall' ? 34 : kind === 'door' ? 13 : 17,
      height: kind === 'wall' || kind === 'window' ? 4 : kind === 'door' ? 10 : 12,
    }

    setObjects((current) => [...current, object])
    setSelectedObjectId(object.id)
    setActivityMessage(`${object.name} added to the room`)
  }

  function updateObject(id: string, patch: Partial<RoomObject>) {
    setObjects((current) => current.map((object) => (object.id === id ? { ...object, ...patch } : object)))
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

  if (!signedIn) {
    return (
      <AuthGate
        address={address}
        authMode={authMode}
        onAddressChange={setAddress}
        onAuthModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="command-rail" aria-label="CheapTruck menu">
        <button className="brand-mark" onClick={() => setScreen('start')} aria-label="Open project start">
          <Home size={22} />
          <span>CheapTruck</span>
        </button>

        <nav className="menu-stack">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="menu-button"
                onClick={() => handleMenuAction(item.action)}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            <span className="eyebrow">First UI prototype</span>
            <h1>{screen === 'wizard' ? activeWizardStep.label : screen === 'rooms' ? 'Your rooms' : 'Start a room'}</h1>
          </div>

          <div className="status-strip" aria-live="polite">
            <BadgeCheck size={18} />
            <span>{activityMessage}</span>
          </div>

          <button className="profile-chip" aria-label="Open user profile" title="User profile">
            <UserRound size={18} />
            <span>Yahel</span>
          </button>
        </header>

        {screen === 'start' && (
          <ProjectStart
            address={address}
            onContinueRoom={() => {
              setScreen('wizard')
              setActiveStep(7)
            }}
            onOpenRooms={() => setScreen('rooms')}
            onStartNewRoom={startNewRoom}
          />
        )}

        {screen === 'rooms' && <RoomsDashboard onAddRoom={startNewRoom} onOpenDesign={() => setScreen('wizard')} />}

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
                      if (!generating) setActiveStep(index)
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
              <div className="lab-layout">
                <section className="room-stage" aria-label="Room editor">
                  <div className="stage-toolbar">
                    <div className="tool-cluster" role="group" aria-label="Add room structure">
                      <IconButton label="Add wall" onClick={() => addObject('wall')} icon={<BrickWall size={17} />} />
                      <IconButton label="Add door" onClick={() => addObject('door')} icon={<DoorOpen size={17} />} />
                      <IconButton label="Add window" onClick={() => addObject('window')} icon={<Square size={17} />} />
                      <IconButton label="Add hanging object" onClick={() => addObject('hang')} icon={<ImagePlus size={17} />} />
                    </div>

                    <div className="mode-toggle" role="group" aria-label="Room view">
                      <button
                        className={viewMode === '2d' ? 'active' : ''}
                        onClick={() => setViewMode('2d')}
                        aria-label="2D view"
                        title="2D view"
                      >
                        <PanelLeft size={17} />
                        <span>2D</span>
                      </button>
                      <button
                        className={viewMode === '3d' ? 'active' : ''}
                        onClick={() => setViewMode('3d')}
                        aria-label="3D view"
                        title="3D view"
                      >
                        <Move3D size={17} />
                        <span>3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="stage-viewport">
                    {viewMode === '2d' ? (
                      <RoomCanvas2D
                        objects={objects}
                        selectedObjectId={selectedObjectId}
                        onMoveObject={updateObject}
                        onSelectObject={setSelectedObjectId}
                      />
                    ) : (
                      <RoomScene3D objects={objects} selectedObjectId={selectedObjectId} />
                    )}
                  </div>
                </section>

                <aside className="control-deck" aria-label="Wizard controls">
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
                    onFetchFromWebChange={setFetchFromWeb}
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
                      <button className="primary-action" onClick={() => setScreen('rooms')}>
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
      </main>
    </div>
  )
}

function AuthGate({
  address,
  authMode,
  onAddressChange,
  onAuthModeChange,
  onSubmit,
}: {
  address: Address
  authMode: AuthMode
  onAddressChange: (address: Address) => void
  onAuthModeChange: (mode: AuthMode) => void
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
        <div className="signal-room" aria-hidden="true">
          <div className="signal-floor" />
          <div className="signal-wall one" />
          <div className="signal-wall two" />
          <div className="signal-sofa" />
          <div className="signal-table" />
          <div className="signal-lamp" />
          <div className="signal-route" />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">Marketplace-powered room design</span>
          <h1>CheapTruck</h1>
          <p>Design the room first, then keep every listing, fit check, price, and pickup detail visible.</p>
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

        <button type="button" className="facebook-action">
          <Wifi size={17} />
          <span>Continue with Facebook</span>
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
  onContinueRoom,
  onOpenRooms,
  onStartNewRoom,
}: {
  address: Address
  onContinueRoom: () => void
  onOpenRooms: () => void
  onStartNewRoom: () => void
}) {
  return (
    <section className="start-grid">
      <div className="launch-panel">
        <span className="eyebrow">Account and address ready</span>
        <h2>Build a room from measurements to Marketplace options.</h2>
        <div className="launch-actions">
          <button className="primary-action" onClick={onStartNewRoom}>
            <Plus size={18} />
            <span>Create a new room</span>
          </button>
          <button className="secondary-action" onClick={onContinueRoom}>
            <Sparkles size={18} />
            <span>View design options</span>
          </button>
        </div>
        <div className="address-confirmation">
          <MapPin size={18} />
          <span>
            {address.street}, {address.city}, {address.state}
          </span>
        </div>
      </div>

      <div className="mission-board">
        <StatusNode label="Request" value="style and wanted items" active />
        <StatusNode label="Measurements" value="room shell started" active />
        <StatusNode label="Marketplace" value="fetch allowed per item" />
        <StatusNode label="Room designs" value="options with fit notes" />
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

function RoomCanvas2D({
  objects,
  onMoveObject,
  onSelectObject,
  selectedObjectId,
}: {
  objects: RoomObject[]
  selectedObjectId: string
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
      x: clamp(nextX, 3, 90),
      y: clamp(nextY, 3, 88),
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
      className="room-board"
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

      {objects.map((object) => (
        <button
          key={object.id}
          className={`room-object ${object.kind} ${selectedObjectId === object.id ? 'selected' : ''}`}
          style={{
            left: `${object.x}%`,
            top: `${object.y}%`,
            width: `${object.width}%`,
            height: `${object.height}%`,
          }}
          onClick={() => onSelectObject(object.id)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') onMoveObject(object.id, { x: clamp(object.x - 2, 3, 90) })
            if (event.key === 'ArrowRight') onMoveObject(object.id, { x: clamp(object.x + 2, 3, 90) })
            if (event.key === 'ArrowUp') onMoveObject(object.id, { y: clamp(object.y - 2, 3, 88) })
            if (event.key === 'ArrowDown') onMoveObject(object.id, { y: clamp(object.y + 2, 3, 88) })
          }}
          onPointerDown={(event) => handlePointerDown(event, object)}
          title={object.name}
          aria-label={`Select ${object.name}`}
        >
          <span>{object.name}</span>
        </button>
      ))}
    </div>
  )
}

function RoomScene3D({ objects, selectedObjectId }: { objects: RoomObject[]; selectedObjectId: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const mount = host

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    const roomGroup = new THREE.Group()
    const pointer = { x: 0, y: 0 }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x050607, 0)
    mount.appendChild(renderer.domElement)

    camera.position.set(4.8, 4.3, 6.2)
    camera.lookAt(0, 0.7, 0)
    scene.add(roomGroup)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 4.4),
      new THREE.MeshStandardMaterial({ color: 0x111815, metalness: 0.35, roughness: 0.55 }),
    )
    floor.rotation.x = -Math.PI / 2
    roomGroup.add(floor)

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1d2422,
      metalness: 0.28,
      roughness: 0.42,
      transparent: true,
      opacity: 0.82,
    })

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.4, 0.08), wallMaterial)
    backWall.position.set(0, 1.2, -2.2)
    roomGroup.add(backWall)

    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 4.4), wallMaterial)
    sideWall.position.set(-3.2, 1.2, 0)
    roomGroup.add(sideWall)

    const colorsByKind: Record<RoomObjectKind, number> = {
      wall: 0x35eaff,
      door: 0xffd166,
      window: 0xb8ff5c,
      hang: 0xff5ad7,
    }

    objects.forEach((object) => {
      const isSelected = object.id === selectedObjectId
      const geometry =
        object.kind === 'hang'
          ? new THREE.BoxGeometry(0.52, 0.52, 0.08)
          : new THREE.BoxGeometry(Math.max(0.25, object.width / 12), object.kind === 'wall' ? 0.13 : 0.5, 0.18)

      const material = new THREE.MeshStandardMaterial({
        color: colorsByKind[object.kind],
        emissive: colorsByKind[object.kind],
        emissiveIntensity: isSelected ? 0.38 : 0.14,
        metalness: 0.42,
        roughness: 0.28,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set((object.x / 100) * 6 - 3, object.kind === 'hang' ? 1.35 : 0.25, (object.y / 100) * 4 - 2)
      roomGroup.add(mesh)
    })

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6ef7ff, transparent: true, opacity: 0.55 })
    const grid = new THREE.GridHelper(6.4, 12, 0x293a36, 0x1c2624)
    grid.position.y = 0.012
    roomGroup.add(grid)

    const pathPoints = [
      new THREE.Vector3(-2.6, 0.04, 1.6),
      new THREE.Vector3(-0.8, 0.05, 0.4),
      new THREE.Vector3(1.4, 0.06, -0.6),
      new THREE.Vector3(2.3, 0.06, -1.4),
    ]
    const path = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pathPoints), lineMaterial)
    roomGroup.add(path)

    scene.add(new THREE.AmbientLight(0xc7fff4, 0.55))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(2.5, 5, 4)
    scene.add(keyLight)
    const neonLight = new THREE.PointLight(0xff5ad7, 2.4, 8)
    neonLight.position.set(-2.4, 1.5, 1.8)
    scene.add(neonLight)

    function resize() {
      const rect = mount.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = mount.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    let frame = 0
    function animate() {
      frame = requestAnimationFrame(animate)
      roomGroup.rotation.y += (-0.22 + pointer.x * 0.2 - roomGroup.rotation.y) * 0.05
      roomGroup.rotation.x += (-0.08 + pointer.y * 0.05 - roomGroup.rotation.x) * 0.05
      renderer.render(scene, camera)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    mount.addEventListener('pointermove', handlePointerMove)
    resize()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      mount.removeEventListener('pointermove', handlePointerMove)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [objects, selectedObjectId])

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
  onFetchFromWebChange,
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
  onFetchFromWebChange: (value: boolean) => void
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
        <PanelHeader icon={<Ruler size={20} />} title="Edit the size and shape of the home" />
        <div className="object-list">
          {objects.map((object) => (
            <button
              key={object.id}
              className={`object-row ${object.id === selectedObject.id ? 'active' : ''}`}
              onClick={() => onSelectObject(object.id)}
            >
              <ObjectIcon kind={object.kind} />
              <span>{object.name}</span>
              <small>
                {Math.round(object.width)} x {Math.round(object.height)}
              </small>
            </button>
          ))}
        </div>

        <div className="slider-stack">
          <RangeControl
            label="Width"
            max={70}
            min={3}
            value={selectedObject.width}
            onChange={(value) => onUpdateObject(selectedObject.id, { width: value })}
          />
          <RangeControl
            label="Height"
            max={34}
            min={3}
            value={selectedObject.height}
            onChange={(value) => onUpdateObject(selectedObject.id, { height: value })}
          />
        </div>
      </>
    )
  }

  if (activeStep === 1) {
    return (
      <>
        <PanelHeader icon={<Paintbrush size={20} />} title="What style should your room have?" />
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
        <PanelHeader icon={<SlidersHorizontal size={20} />} title="Size up your needed items" />
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
              <RangeControl
                label="Length"
                max={120}
                min={8}
                value={item.length}
                onChange={(value) => onUpdateItem(item.id, { length: value })}
              />
              <RangeControl
                label="Height"
                max={96}
                min={8}
                value={item.height}
                onChange={(value) => onUpdateItem(item.id, { height: value })}
              />
              <RangeControl
                label="Width"
                max={72}
                min={8}
                value={item.width}
                onChange={(value) => onUpdateItem(item.id, { width: value })}
              />
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
        <div className="address-grid compact">
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
            <input
              value={address.street}
              onChange={(event) => onAddressChange({ ...address, street: event.target.value })}
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
            <input value={address.floor} onChange={(event) => onAddressChange({ ...address, floor: event.target.value })} />
          </label>
        </div>
        <div className="inline-output">
          <MapPin size={17} />
          <span>Used for search radius and pickup practicality</span>
        </div>
      </>
    )
  }

  return (
    <>
      <PanelHeader icon={<Sparkles size={20} />} title="View design options" />
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
          <Sparkles size={17} />
          <span>Select the option</span>
        </button>
      </div>
    </>
  )
}

function GeneratingState() {
  return (
    <section className="generating-panel" aria-live="polite">
      <div className="thinking-ring">
        <Sparkles size={38} />
      </div>
      <span className="eyebrow">AI thinking</span>
      <h2>Lining up room design, fit checks, prices, and listing health.</h2>
      <div className="scan-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
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

function IconButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="icon-button" onClick={onClick} title={label} aria-label={label}>
      {icon}
    </button>
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
  label,
  max,
  min,
  onChange,
  value,
}: {
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
      <input max={max} min={min} type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
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
  if (kind === 'wall') return <BrickWall size={16} />
  if (kind === 'door') return <DoorOpen size={16} />
  if (kind === 'window') return <Square size={16} />
  return <LampDesk size={16} />
}

function labelFromAction(action: string) {
  return action.replace(/^\w/, (letter) => letter.toUpperCase())
}

function kindLabel(kind: RoomObjectKind) {
  if (kind === 'hang') return 'Hanging object'
  return kind.replace(/^\w/, (letter) => letter.toUpperCase())
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default App
