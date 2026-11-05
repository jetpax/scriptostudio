# App API

What the browser side of an App can use.

## Constructor arguments

Your App's class receives four arguments:

```javascript
constructor(deviceAPI, emit, state, html) {
  this.device = deviceAPI  // Device communication
  this.emit = emit         // Event emitter
  this.state = state       // Shared state
  this.html = html         // Template renderer
}
```

## Device API

The `deviceAPI` object provides device communication:

### execute(code)

Execute Python code on the device. Returns output as a string.

```javascript
const result = await this.device.execute('print(1 + 1)')
// result = "2"
```

### saveFile(path, content)

Write a file to the device filesystem.

```javascript
await this.device.saveFile('/lib/my_module.py', 'print("hello")')
```

### mkdir(path)

Create a directory. Succeeds silently if directory exists.

```javascript
await this.device.mkdir('/lib/ext/my_app')
```

### subscribe(type, handler) and unsubscribe(type)

Listen for an event the board sends. `type` is a key in the event, and `handler` gets that key's value. There is one handler per type, so subscribing again replaces it.

```javascript
this.device.subscribe('my_event', (value) => {
  this.state.myApp.last = value
  this.emit('render')
})
// later
this.device.unsubscribe('my_event')
```

### openCanStream({ ack, onFrames })

Receive every frame the CAN bus gets. `onFrames(payload, lost)` is called with whole 20-byte records, laid out as `lib/sys/streams.py` on the board says, and with how many frames were lost just before them. It returns a promise of `{ status(), close() }`.

```javascript
const stream = await this.device.openCanStream({
  onFrames: (payload, lost) => this.handleFrames(payload, lost)
})
// later
await stream.close()
```

## State Object

The `state` object is shared by all Apps and Studio:

```javascript
// Read connection status
if (this.state.isConnected) {
  // Device is connected
}

// Store your App's data
if (!this.state.myApp) {
  this.state.myApp = { config: {} }
}
```

### State properties

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | boolean | A board is connected |

## Emit Function

Trigger events in the application:

```javascript
// Re-render the current panel
this.emit('render')

// Refresh the file listing
this.emit('refresh-files')
```

## HTML Template

The `html` function is a tagged template literal for rendering:

```javascript
renderMyPanel() {
  const items = ['A', 'B', 'C']
  
  return this.html`
    <div class="system-panel">
      <div class="panel-header">
        <h2>My Panel</h2>
      </div>
      <ul>
        ${items.map(item => this.html`<li>${item}</li>`)}
      </ul>
    </div>
  `
}
```

### Event Handlers

Use `onclick`, `onchange`, etc. with arrow functions:

```javascript
return this.html`
  <button onclick=${() => this.handleClick()}>
    Click Me
  </button>
  <input 
    type="text" 
    value=${this.state.myApp.name}
    oninput=${(e) => this.handleInput(e.target.value)}
  />
`
```

### Conditionals

```javascript
return this.html`
  ${this.state.isConnected
    ? this.html`<p>Connected!</p>`
    : this.html`<p>Not connected</p>`
  }
`
```

## Lifecycle Hooks

### onInstall()

Called when the user installs the App with a board connected:

```javascript
async onInstall() {
  // this.deviceFiles is injected by the loader
  for (const [path, content] of Object.entries(this.deviceFiles)) {
    await this.device.saveFile(path, content)
  }
  return true  // Return false to indicate failure
}
```

### getMenuItems()

Optional. Return dynamic menu items:

```javascript
getMenuItems() {
  const items = [{ id: 'main', label: 'Main' }]
  
  // Add items based on state
  if (this.state.devices?.length > 0) {
    this.state.devices.forEach(d => {
      items.push({ id: `device-${d.id}`, label: d.name })
    })
  }
  
  return items
}
```

## CSS Classes

Use these system classes for consistent styling:

| Class | Description |
|-------|-------------|
| `.system-panel` | Standard panel container |
| `.panel-header` | Panel header with h2 and actions |
| `.panel-message` | Centered message text |

Define your App's styles in `extension.json`:

```json
{
  "styles": ".my-btn { background: var(--scheme-primary); }"
}
```
