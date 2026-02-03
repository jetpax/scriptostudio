# Extension API

API reference for extension developers.

## Constructor Arguments

Extensions receive four arguments:

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

### readFile(path)

Read a file from the device. Returns content as string.

```javascript
const content = await this.device.readFile('/boot.py')
```

### mkdir(path)

Create a directory. Succeeds silently if directory exists.

```javascript
await this.device.mkdir('/lib/ext/my-extension')
```

### listDir(path)

List directory contents. Returns array of entries.

```javascript
const files = await this.device.listDir('/lib')
// files = [{ name: 'sys', isDir: true }, { name: 'boot.py', isDir: false }]
```

### removeFile(path)

Delete a file from the device.

```javascript
await this.device.removeFile('/temp.txt')
```

## State Object

The `state` object is shared across all extensions and the main app:

```javascript
// Read connection status
if (this.state.isConnected) {
  // Device is connected
}

// Store extension-specific data
if (!this.state.myExtension) {
  this.state.myExtension = { config: {} }
}
```

### Common State Properties

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | boolean | Device connected via WebREPL |
| `deviceInfo` | object | Device metadata (board, flash, etc.) |
| `files` | array | Current file listing |

## Emit Function

Trigger events in the application:

```javascript
// Re-render the current panel
this.emit('render')

// Refresh file listing
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
    value=${this.state.myExtension.name}
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

Called when user installs the extension while connected to a device:

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

Define extension-specific styles in `extension.json`:

```json
{
  "styles": ".my-btn { background: var(--scheme-primary); }"
}
```
