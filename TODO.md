# AMERICANOMICON WEB REBOOT TODO

## Epic: Project Bootstrap

### Task: Initialize git repository
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** XS
- **Dependencies:** none
- **Notes:** Run `git init`, create `.gitignore` for a Node.js/Three.js project (node_modules, dist/, .env, etc.), make initial commit.

### Task: Create project scaffolding
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** S
- **Dependencies:** Task "Initialize git repository"
- **Notes:** Create config files and directory structure as defined in AGENTS.md. Use Vite for the build system — it handles ESM modules natively, has better Three.js plugin support via `@vitejs/plugin-basic-ssl`, and provides faster HMR. Include `package.json`, `vite.config.js`, `.prettierrc`, and `.eslintrc`.

  **Asset strategy (dual-environment):**
  - **Development:** Local stub assets in root `assets/` directory (placeholder audio tracks, fonts). Configure Vite with `assetsInclude: ['../assets/**/*']` so dev server serves them. The room manifest at build time points to local paths like `assets/tracks/test.mp3`.
  - **Production:** Room manifest is generated/replaced with CDN-absolute URLs. The manifest file is treated as deployment-specific configuration. A separate production manifest build step or env-based override is recommended.
  - **Text content:** Lives in `src/data/textContent.json` — imported as a static JS module at build time, not fetched over HTTP at runtime.

### Task: Set up test framework
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** S
- **Dependencies:** Task "Create project scaffolding"
- **Notes:** Configure Vitest (native ESM, fast, works well with Vite) for unit tests. Set up manual Three.js scene testing utilities for 3D-specific tests. Create test configuration files (`vitest.config.js`), test directory structure, and any shared fixtures. The framework must be runnable with a single command (`npm test`) before feature tests are added.

### Task: Set up local build pipeline
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** S
- **Dependencies:** Task "Set up test framework"
- **Notes:** Create a `Makefile` or npm scripts that run linting (`eslint`), formatting (`prettier --check`), tests (`vitest`), and builds (`vite build`) in sequence. Configure Vite for development (`vite dev`) with HMR and production (`vite build`) with code splitting. Document the commands in README.md.

### Task: Set up CI/CD
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** S
- **Dependencies:** Task "Set up local build pipeline"
- **Notes:** Create `.github/workflows/ci.yml` that runs linting and tests on push and PR. Note: Three.js 3D rendering cannot be tested in CI headless environments without WebGL context workarounds (e.g., `@react-three/test-renderer` or `jest-canvas-mock`). Document in README that full visual QA requires a browser.

### Task: Write README.md
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Complexity:** XS
- **Dependencies:** Tasks "Set up local build pipeline", "Set up CI/CD"
- **Notes:** Include project description, setup instructions, build/run commands, testing instructions, known browser requirements (WebGPU support or WebGL 2 automatic fallback), and links to architecture docs.

---

## Epic: Renderer Architecture & Fallback System

### Task: Implement renderer initialization with automatic WebGPU/WebGL fallback
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Complexity:** M
- **Dependencies:** none (after bootstrap)
- **Notes:** Use Three.js built-in `getFallback` callback mechanism in the base `Renderer.init()`. Create a WebGPURenderer with a `getFallback` parameter that returns a WebGLRenderer instance if WebGPU init fails. The flow is: (1) detect WebGPU support via `navigator.gpu` for logging, (2) instantiate WebGPURenderer with `getFallback: () => new WebGLRenderer({ antialias: true })`, (3) call `await renderer.init()` — Three.js internally catches errors and calls `getFallback` automatically, (4) log which backend was ultimately used. No manual try/catch boilerplate needed. This is the foundational piece — all other systems depend on it.

### Task: Define TSL shader abstraction layer
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Complexity:** L
- **Dependencies:** Task "Implement renderer initialization with WebGPU/WebGL fallback"
- **Notes:** Create a shader abstraction that works with both renderers. Use only TSL features known to compile on both WebGPURenderer and WebGLRenderer — such as vertex displacement, color modulation, and standard node material primitives. Audio data must be passed as uniforms accessible to both shader variants. All TSL used in this project must compile to both backends; if a feature doesn't have parity, fix it or replace it rather than writing a separate WebGL code path.

### Task: Implement audio data pipeline to shaders
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Complexity:** M
- **Dependencies:** Tasks "Define TSL shader abstraction layer", "Implement renderer initialization with WebGPU/WebGL fallback"
- **Notes:** Wire AudioAnalyser → sampling interval → uniform update → shader. Implement configurable `samplingLatency` (default 50ms). Shader must smooth interpolation between samples using time-based lerp. This is a cross-cutting concern affecting all room shaders.

---

## Epic: Text Rendering Subsystem

### Task: Load and manage web fonts for Canvas2D text rendering
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-rendering
- **Complexity:** S
- **Dependencies:** none — can run in parallel with bootstrap
- **Notes:** Create a font loading utility that loads .woff font files using CSS @font-face injection into the document head. Provides a promise-based API: `loadFont('name', 'path/to/font.woff')` resolves when font is ready for Canvas2D use. Handles multiple fonts if needed. Integrates with the loading screen progress indicator. Throws or provides a fallback if font fails to load (use system sans-serif as last resort). Font choice affects canvas text layout — document which fonts are used and their metrics (cap height, x-height) for word-wrap calculations.

### Task: Implement CanvasTexture text generation system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-rendering
- **Complexity:** M
- **Dependencies:** Task "Load and manage web fonts for Canvas2D text rendering"
- **Notes:** **Decision made: use Canvas2D → CanvasTexture approach.** The `text/` module creates an offscreen `<canvas>` element, writes text content onto it using standard Canvas2D APIs (fillText, measureText, word-wrap), and wraps it as a `THREE.CanvasTexture(canvas)` applied to static surface materials.

  Key implementation details:
  - Choose canvas resolution per surface type (e.g., 1024×512 for back wall, 512×256 for floor/ceiling)
  - Use `texture.minFilter = THREE.LinearMipmapLinearFilter` for good quality at distance
  - Set `texture.needsUpdate = true` when text content changes
  - Support configurable font (loaded via CSS `@font-face` from `.woff` files), font size, color, line height, text alignment, and word wrap width
  - Text wrapping must handle multi-line content (estimate ~80 chars per line for a given canvas width)
  - No external dependencies — pure Canvas2D API + Three.js CanvasTexture
  - Works with both WebGPURenderer and WebGLRenderer (CanvasTexture is renderer-agnostic in Three.js)

---

## Epic: Text Content Database

### Task: Create text content database schema and data file
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-content
- **Complexity:** S
- **Dependencies:** none — can run in parallel with bootstrap
- **Notes:** Create `src/data/textContent.json` — a static JSON file containing text entries associated with each room ID. The schema maps `roomId` → object with keys for each static surface type:

  ```json
  {
    "room_001": {
      "floor": "Lyrics or atmosphere text for the floor surface...",
      "ceiling": "Notes about the recording for the ceiling surface...",
      "backWall": "Descriptive or poetic text for the back wall surface...",
      "titles": ["Echoes in the Algorithm", "Memory Palace Fragment #3"]
    }
  }
  ```

  - Each surface key contains a string (or array of strings for cycling text)
  - `titles` is an optional array of title variants displayed on active walls or overlays
  - Strings can contain newlines for multi-line layout; the CanvasTexture text renderer handles word-wrap
  - The file lives in `src/data/` and is imported as a static ES module at build time via Vite's JSON import

### Task: Implement text content loader
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-content
- **Complexity:** XS
- **Dependencies:** Task "Create text content database schema and data file"
- **Notes:** Build a thin loader module (`src/data/contentLoader.js`) that:
  - Imports `textContent.json` as a static ES module (`import textContent from './textContent.json'`)
  - Provides `getTextContent(roomId)` → returns the text entry object for that room (or a fallback placeholder if missing)
  - Provides `getAllRoomIds()` → returns list of room IDs that have text entries
  - Data is available synchronously at module load time — no async fetching needed
  - The room manifest parser (separate task) references `textContentId` which maps to keys in this database

  No caching or persistence layer needed — data is loaded once at startup and held in memory. Text is never regenerated.

### Task: Connect text content to CanvasTexture rendering
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-content
- **Complexity:** M
- **Dependencies:** Tasks "Implement CanvasTexture text generation system", "Implement text content loader"
- **Notes:** Wire the text content database to the CanvasTexture text rendering subsystem. Pipeline:
  1. On room assembly, look up the room's `textContentId` from the manifest
  2. Call `getTextContent(textContentId)` to retrieve text strings for each surface
  3. For each static surface (floor, ceiling, back wall), call the CanvasTexture renderer with the appropriate text string
  4. Set `canvasTexture.needsUpdate = true` to trigger Three.js texture upload
  5. Throttle updates: only refresh textures when camera is looking at the surface (frustum culling or distance-based checks)

  Text is immediately available (no inference delay), so no loading states are needed during room entry. If a room's textContentId is missing from the database, use a graceful fallback (e.g., the room title repeated, or a default "..." placeholder). Handle empty strings gracefully — don't crash, just render an empty canvas.

---

## Epic: Room Construction System

### Task: Generate base textures for room surfaces (floor, ceiling, walls)
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** S
- **Dependencies:** none — can run in parallel with bootstrap
- **Notes:** Create procedural or static base texture sets for all room surface types. This includes:
  - Floor textures (wood, stone, carpet — one per sample room)
  - Ceiling textures (plaster, beam pattern — one per sample room)
  - Wall base textures (plaster, wallpaper, brick — one per sample room). These serve as the underlay for CanvasTextures on floor, ceiling, and back wall surfaces.
  - Texture resolution: generate at appropriate mip levels for Three.js CanvasTexture or ImageBitmap usage (e.g., 1024×1024, 512×512). Use procedural generation via offscreen Canvas2D — no external texture files needed.
  - These are static textures created once per room definition and reused across sessions. Text content from the database is rendered on top of these base textures via CanvasTexture.

### Task: Implement default audio-responsive shader with fallback
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/shader-default
- **Complexity:** L
- **Dependencies:** Task "Define TSL shader abstraction layer"
- **Notes:** Create a single default shader that is responsive to audio frequency data (vertex displacement + color modulation driven by AudioAnalyser uniforms). This shader serves as the fallback for any room that requests a shader name which does not exist. When a requested shader is not available, the system falls back to this default. No registry or preset system — just one working shader and a fallback mechanism. New shaders can be developed later as separate tasks; they do not need to be registered in advance. The manifest's `shaderName` field is treated as an optional hint, not a strict requirement.

### Task: Implement requestShader method for room construction
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/shader-default
- **Complexity:** S
- **Dependencies:** Task "Implement default audio-responsive shader with fallback"
- **Notes:** Create a `requestShader(shaderName, params)` method that the room construction system calls when building a room. The method receives the shader name from the room manifest's `shaderName` field and its associated parameters from `shaderParams`. If an exact match for `shaderName` exists in the registered shader map, return it with the provided params. If no match is found (or `shaderName` is empty/null), return the default audio-responsive shader with those same params applied.

  This method provides a simple registration/discovery mechanism — each shader task registers itself under a name string at module initialization time. No dynamic discovery or scanning; shaders are explicitly registered by their implementing tasks.

### Task: Implement active wall shader system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** L
- **Dependencies:** Tasks "Define TSL shader abstraction layer", "Implement audio data pipeline to shaders"
- **Notes:** Create the shared ShaderMaterial for left/front/right walls using TSL. Implement UV mapping scheme (each wall = 1/3 of UV.u space). Audio frequency data drives vertex displacement along normals and color modulation.

  This shader must be registered with the `requestShader` method so that room manifests referencing this shader by name receive it. Register under a conventional name (e.g., `bassPulse`). When requested via `requestShader("bassPulse", params)`, return this ShaderMaterial instance with the provided parameters.

### Task: Implement static surface rendering
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** M
- **Dependencies:** Tasks "Connect text content to CanvasTexture rendering", "Implement CanvasTexture text generation system"
- **Notes:** Create floor, ceiling, and back wall PlaneGeometry meshes. Apply base textures generated by "Generate base textures for room surfaces" task, then overlay CanvasTextures with room text content from the content database.

  Implementation details:
  - Floor and ceiling receive CanvasTextures rendered from `textContent[roomId].floor` and `.ceiling` strings
  - Back wall receives a CanvasTexture from `textContent[roomId].backWall` string
  - If a room has no text entry for a surface, use the bare base texture (no text overlay) — no error, just clean
  - Implement dynamic texture update with camera-aware throttling (only update canvases when the surface is visible)
  - CanvasTextures are updated once at room creation time; subsequent updates only happen on camera focus (for performance)

### Task: Assemble rooms — integrate all room construction components
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** XL
- **Dependencies:** Tasks "Generate base textures for room surfaces", "Implement default audio-responsive shader with fallback", "Implement requestShader method for room construction", "Implement active wall shader system", "Implement static surface rendering", "Implement doorframe geometry and instancing"
- **Notes:** Create the `createRoom(roomManifestEntry)` function that assembles all room components into a complete Three.js scene. This is the central integration point of the Room Construction System epic:

  1. Read room manifest entry (room ID, audio asset path, shader name/params, text content ID, door positions).
  2. Look up text content via `getTextContent(room.textContentId)`.
  3. Create floor, ceiling, back wall PlaneGeometry meshes with base textures + CanvasTextures overlaying text content.
  4. Request the appropriate shader via `requestShader(shaderName, params)` for left/front/right walls.
  5. Create doorframe assemblies using InstancedMesh (2 per room).
  6. Set up a THREE.AudioListener at the room's configured listener position.
  7. Create PositionalAudio from the room manifest's audio asset URL and attach it to the listener.
  8. Register all meshes in a Room object (or Map) for easy scene management and cleanup on transition.

  The assembled room must be ready to add to the scene graph. Return a Room handle that includes: reference to the Three.js Group, audio listener, positional audio source, and any references needed for texture updates or cleanup.

### Task: Implement doorframe geometry and instancing
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** S
- **Dependencies:** none — independent of shader/text systems
- **Notes:** Build doorframe from three BoxGeometry pieces (left pillar, right pillar, top header). Create invisible portal trigger mesh. Batch doorframe assemblies using InstancedMesh. Each room has two doors (left and right rear corners). Door dimensions: approximately 2.4m tall × 0.9m wide per doorway. Portal trigger should be slightly larger than the doorway opening to ensure reliable raycast hits.

### Task: Implement room transitions (fade, swap, resume)
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** M
- **Dependencies:** Tasks "Assemble rooms — integrate all room construction components", "Implement raycaster-based room navigation system"
- **Notes:** Implement the full room transition choreography triggered by raycaster navigation:

  1. **Fade out**: Animate a fullscreen overlay from transparent to black over ~0.5s.
  2. **Pause audio**: Stop current room's positional audio at its current playback position.
  3. **Save state**: Record currentRoom and playback progress in the state management system.
  4. **Destroy old scene**: Remove the previous room's Group from the scene graph and dispose of associated geometries, textures, and materials to free GPU memory.
  5. **Load new room**: Call `createRoom()` for the target room (from manifest), including base textures, shader application, doorframe placement, audio listener setup, and CanvasTexture rendering from text content database.
  6. **Fade in**: Animate the fullscreen overlay from black to transparent over ~0.5s.
  7. **Resume audio**: Start the new room's audio at the saved playback position (or beginning if first entry).

  During transition, disable raycaster input to prevent double-clicks. If a second click occurs during fade-out, queue it and process after fade-in completes.

### Task: Implement raycaster-based room navigation system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Complexity:** M
- **Dependencies:** Tasks "Implement doorframe geometry and instancing", "Implement state management via EventDispatcher"
- **Notes:** Implement raycasting on the portal trigger mesh for click/touch events. Door dimensions: ~2.4m tall × 0.9m wide per doorway. Portal trigger should be slightly larger than the doorway opening to ensure reliable raycast hits.

  On successful raycast hit: trigger the room transition choreography (separate task). Camera lerp animation toward door position with scene fade-to-black transition. Audio pause/resume on room change. State management via EventDispatcher: track currentRoom, playback progress.

---

## Epic: Audio System

### Task: Implement positional audio engine
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/audio
- **Complexity:** M
- **Dependencies:** none — independent bootstrap task
- **Notes:** Set up THREE.Audio and PositionalAudio for spatial sound. Create audio asset loading pipeline from room manifest. Configure audio listeners and positional speakers within each room.

### Task: Implement AudioAnalyser sampling system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/audio
- **Complexity:** S
- **Dependencies:** Task "Implement positional audio engine"
- **Notes:** Create configurable-frequency AudioAnalyser sampling (default 50ms). Implement smooth interpolation of frequency data between samples. Pass sampled data to shader uniforms. Handle AudioContext state (resume on user gesture, pause/resume on room change).

---

## Epic: Intro Scene — Library Fall-through

### Task: Model and texture intro scene assets (bookshelves, books, library environment)
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/intro-scene
- **Complexity:** M
- **Dependencies:** none — can run in parallel with bootstrap
- **Notes:** Create the 3D geometry and base textures for the intro library scene. This includes:
  - Bookshelf models (InstancedMesh-compatible: shared geometry, unique transforms)
  - Individual book models (simple box geometries with varied colors/sizes, merged into InstancedMesh batches)
  - Library floor, ceiling, and wall planes
  - Base color/normal maps for library surfaces (static textures — no generative content)
  - Bookshelf models: simple procedural geometry via Three.js primitives (BoxGeometry).
  - Individual book models: these require more detail (spine shapes, varied thicknesses, slight imperfections). Model them in a DCC tool (Blender), export as GLTF/GLB with glTF embedding or separate .bin/.textures, and load at runtime via THREE.GLTFLoader. Keep each book model lightweight — merged geometry, single material where possible.
  - Merge similar books into InstancedMesh batches to minimize draw calls.
  - Assets must be lightweight enough to load quickly during the intro scene preload phase.

### Task: Implement library intro scene
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/intro-scene
- **Complexity:** M
- **Dependencies:** Tasks "Implement room manifest parser", "Implement positional audio engine", "Implement CanvasTexture text generation system", "Load and manage web fonts for Canvas2D text rendering", "Implement state management via EventDispatcher", "Model and texture intro scene assets (bookshelves, books, library environment)"
- **Notes:** The intro scene begins with a single entry button:

  - **"Enter the Archive"** — on click: (1) resume/create the AudioContext (required by browser autoplay policies), (2) initialize positional audio engine, (3) begin the library fall-through animation.

  This ensures AudioContext is user-gesture-initiated before any audio playback occurs. No alternate paths or opt-outs needed — text content is always available from the static database.

  Create the falling-through-library animation. Use InstancedMesh for bookshelves and books (separate geometry from doorframes). Camera auto-falls through the scene while: rooms are loaded, audio is preloaded, adjacent rooms are preloaded, first room CanvasTextures are rendered. On completion: destroy library scene, transition to first room with fade-in.

  The intro overlay must include visual branding (project title, atmospheric description) and a subtle animation that hints at the 3D space beyond.

---

## Epic: Room Manifest & Content Pipeline

### Task: Implement room manifest parser
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/content-pipeline
- **Complexity:** S
- **Dependencies:** none — independent
- **Notes:** Parse `src/data/roomManifest.json`. Validate room entries. Audio asset paths may be local dev URLs or production CDN URLs depending on the environment; the parser should accept both transparently. The `textContentId` field maps to keys in `textContent.json`. Provide a clean API for accessing room data throughout the app.

### Task: Create sample room content
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/content-pipeline
- **Complexity:** S
- **Dependencies:** Tasks "Implement room manifest parser", "Create text content database schema and data file"
- **Notes:** Create at least 3 sample rooms with:
  - Local dev stub audio files in `assets/tracks/` (for development)
  - Shader definitions (e.g., `bassPulse`)
  - Text content entries in `src/data/textContent.json` (floor, ceiling, back wall strings, titles)
  - Door configurations
  For production, create an alternate manifest version with CDN URLs for all audio assets. This serves as both demo content and QA test data.

---

## Epic: State Management & Persistence

### Task: Implement state management via EventDispatcher
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/state-management
- **Complexity:** M
- **Dependencies:** none — can run in parallel
- **Notes:** Create the event-driven state system using THREE.EventDispatcher as the base. Define the following events:
  - `roomChange(oldRoom, newRoom)` — fired when transitioning between rooms
  - `playbackProgress(time, duration)` — fired periodically during audio playback
  - `loadingUpdate(key, progress, total)` — loading screen progress updates

  State properties: currentRoom (string), playbackProgress (number, seconds), roomTransitionState (idle | fading-out | loading | fading-in).

  Implement persistence of state across room transitions and page reloads (localStorage or IndexedDB for progress).

  Consumers of this system: room navigation (saves/restores playback progress on transition), loading screen (tracks initialization state). All consuming tasks should list this task as a dependency.

---

## Epic: UI & Polish

### Task: Implement loading screen
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/ui
- **Complexity:** M
- **Dependencies:** none — independent
- **Notes:** Create a fullscreen HTML/CSS overlay (not Three.js) positioned above the canvas. Use a centered card layout with title, progress bars, and status text.

  Progress indicators:
  - Audio preload
  - Room initialization (base texture generation, geometry setup)
  - Per-room CanvasTexture rendering

  Handle the library intro scene transition. The loading screen must handle failure modes: audio preload failure (track not found at URL — log warning, continue without that track), manifest parse errors (show user-friendly error message). Each failure should display a graceful error state rather than a silent crash.

### Task: Implement camera controls
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/ui
- **Complexity:** S
- **Dependencies:** Tasks "Implement raycaster-based room navigation system"
- **Notes:** Set up OrbitControls for initial camera interaction. Implement smooth camera transitions during room navigation (lerp animation). Add any additional interaction patterns (zoom limits, rotation constraints within rooms).

---

## Epic: Deployment & Production Build

### Task: Configure production asset path migration
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/deployment
- **Complexity:** M
- **Dependencies:** Tasks "Implement room manifest parser", "Create sample room content"
- **Notes:** Implement the build-time or deployment-time step that replaces local dev asset paths in the room manifest with production CDN URLs. This may be a separate production manifest file swapped in during vite build, an env-based override script, or a Vite plugin that replaces asset references at build time. Choose the approach that best fits the deployment target. Document the process in README.md.

### Task: Optimize build for production
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/deployment
- **Complexity:** S
- **Dependencies:** Task "Configure production asset path migration"
- **Notes:** Configure Vite production build with code splitting, asset compression (Brotli/Gzip), and proper cache headers. Create deployment configuration for target platform (web). Include WebGL fallback parity verification as part of the QA checklist — verify that all TSL shaders compile and render correctly on both WebGPURenderer and WebGLRenderer backends before release.

---
