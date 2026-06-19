# AMERICANOMICON WEB REBOOT TODO

## Epic: Project Bootstrap

### Task: Initialize git repository
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** none
- **Notes:** Run `git init`, create `.gitignore` for a Node.js/Three.js project (node_modules, dist/, .env, *.wasm binaries, etc.), make initial commit.

### Task: Create project scaffolding
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** Task "Initialize git repository"
- **Notes:** Create config files and directory structure as defined in AGENTS.md. Use Vite for the build system — it handles ESM modules natively, has better Three.js plugin support via `@vitejs/plugin-basic-ssl` and `vite-plugin-top-level-await`, and provides faster HMR. Include `package.json`, `vite.config.js`, `.prettierrc`, and `.eslintrc`. Assets for Dev server: vite.config.js → assetsInclude: ../assets


### Task: Set up test framework
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** Task "Create project scaffolding"
- **Notes:** Configure Vitest (native ESM, fast, works well with Vite) for unit tests. Set up manual Three.js scene testing utilities for 3D-specific tests. Create test configuration files (`vitest.config.js`), test directory structure, and any shared fixtures. The framework must be runnable with a single command (`npm test`) before feature tests are added.

### Task: Set up local build pipeline
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** Task "Set up test framework"
- **Notes:** Create a `Makefile` or npm scripts that run linting (`eslint`), formatting (`prettier --check`), tests (`vitest`), and builds (`vite build`) in sequence. Configure Vite for development (`vite dev`) with HMR and production (`vite build`) with code splitting. Document the commands in README.md.

### Task: Set up CI/CD
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** Task "Set up local build pipeline"
- **Notes:** Create `.github/workflows/ci.yml` that runs linting and tests on push and PR. Note: Three.js 3D rendering cannot be tested in CI headless environments without WebGL context workarounds (e.g., `@react-three/test-renderer` or `jest-canvas-mock`). Document in README that full visual QA requires a browser.

### Task: Write README.md
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** epic/bootstrap
- **Dependencies:** Tasks "Set up local build pipeline", "Set up CI/CD"
- **Notes:** Include project description, setup instructions, build/run commands, testing instructions, known browser requirements (WebGPU support or WebGL 2 automatic fallback), and links to architecture docs.

---

## Epic: Renderer Architecture & Fallback System

### Task: Implement renderer initialization with automatic WebGPU/WebGL fallback
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Dependencies:** none (after bootstrap)
- **Notes:** Use Three.js built-in `getFallback` callback mechanism in the base `Renderer.init()`. Create a WebGPURenderer with a `getFallback` parameter that returns a WebGLRenderer instance if WebGPU init fails. The flow is: (1) detect WebGPU support via `navigator.gpu` for logging, (2) instantiate WebGPURenderer with `getFallback: () => new WebGLRenderer({ antialias: true })`, (3) call `await renderer.init()` — Three.js internally catches errors and calls `getFallback` automatically, (4) log which backend was ultimately used. No manual try/catch boilerplate needed. This is the foundational piece — all other systems depend on it.

### Task: Define TSL shader abstraction layer
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Dependencies:** Task "Implement renderer initialization with WebGPU/WebGL fallback"
- **Notes:** Create a shader abstraction that works with both renderers. Use only TSL features known to compile on both WebGPURenderer and WebGLRenderer — such as vertex displacement, color modulation, and standard node material primitives. Audio data must be passed as uniforms accessible to both shader variants. All TSL used in this project must compile to both backends; if a feature doesn't have parity, fix it or replace it rather than writing a separate WebGL code path.

### Task: Implement audio data pipeline to shaders
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/renderer-fallback
- **Dependencies:** Tasks "Define TSL shader abstraction layer", "Implement renderer initialization with WebGPU/WebGL fallback"
- **Notes:** Wire AudioAnalyser → sampling interval → uniform update → shader. Implement configurable `samplingLatency` (default 50ms). Shader must smooth interpolation between samples using time-based lerp. This is a cross-cutting concern affecting all room shaders.

---

## Epic: Text Rendering Subsystem

### Task: Implement CanvasTexture text generation system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/text-rendering
- **Dependencies:** none — can run in parallel with renderer bootstrap
- **Notes:** **Decision made: use Canvas2D → CanvasTexture approach.** The `text/` module creates an offscreen `<canvas>` element, writes LLM-generated text onto it using standard Canvas2D APIs (fillText, measureText, word-wrap), and wraps it as a `THREE.CanvasTexture(canvas)` applied to static surface materials.

  Key implementation details:
  - Choose canvas resolution per surface type (e.g., 1024×512 for back wall, 512×256 for floor/ceiling)
  - Use `texture.minFilter = THREE.LinearMipmapLinearFilter` for good quality at distance
  - Set `texture.needsUpdate = true` when text content changes
  - Support configurable font (loaded via CSS `@font-face` from `.woff` files), font size, color, line height, text alignment, and word wrap width
  - Text wrapping must handle multi-line output from LLM (estimate ~80 chars per line for a given canvas width)
  - No external dependencies — pure Canvas2D API + Three.js CanvasTexture
  - Works with both WebGPURenderer and WebGLRenderer (CanvasTexture is renderer-agnostic in Three.js)

---

## Epic: Local LLM Integration

### Task: Set up wllama integration layer
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/llm-integration
- **Dependencies:** none — can run in parallel with other bootstrap tasks
- **Notes:** Create an abstraction layer around wllama that handles:
  - Model loading from HuggingFace or local files (~500MB target: Qwen3.5-0.8B-Q4_K_M or similar)
  - WebGPU backend preferred (simpler deployment, no COOP/COEP headers needed; WASM multi-threaded path is optional for larger models but not needed here)
  - Web Worker initialization for non-blocking inference
  - Progress callbacks for download/loading UI
  - Model caching in IndexedDB so the model isn't re-downloaded on page reload
  - The ~500MB model size is well within wllama's ArrayBuffer limit, so no split-model complexity
  - Target parameters: low temperature (0.7-1.0), short output (50-150 tokens) for fast generation

### Task: Implement LLM prompt generation pipeline
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/llm-integration
- **Dependencies:** Task "Set up wllama integration layer"
- **Notes:** Create the prompt template system from `prompts/` files. Implement text generation with appropriate parameters (temperature, max_tokens) for creative/descriptive output. Add caching so that room+track combinations don't regenerate text on replay.

### Task: Implement dynamic texture updates from LLM output
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/llm-integration
- **Dependencies:** Tasks "Implement CanvasTexture text generation system", "Implement LLM prompt generation pipeline"
- **Notes:** Connect LLM-generated text to the CanvasTexture text rendering subsystem. Pipeline:
  1. LLM generates text → string output
  2. Text module receives string, writes it to offscreen canvas using configured font/style/word-wrap settings
  3. Set `canvasTexture.needsUpdate = true` to trigger Three.js texture upload
  4. Throttle updates: only update textures when camera is looking at the surface (frustum culling or distance-based checks)
  5. Cache generated text per room+track combination to avoid regeneration on replay
  6. Show loading state during generation (2-8 seconds) — blank/dithered texture until LLM completes

---

## Epic: Room Construction System

### Task: Implement active wall shader system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Dependencies:** Tasks "Define TSL shader abstraction layer", "Implement audio data pipeline to shaders"
- **Notes:** Create the shared ShaderMaterial for left/front/right walls using TSL. Implement UV mapping scheme (each wall = 1/3 of UV.u space). Audio frequency data drives vertex displacement along normals and color modulation. Support configurable shader presets (bassPulse, etc.) via room manifest parameters.

### Task: Implement static surface rendering
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Dependencies:** Tasks "Implement dynamic texture updates from LLM output", "Implement CanvasTexture text generation system"
- **Notes:** Create floor, ceiling, and back wall PlaneGeometry meshes. Apply CanvasTextures generated from LLM text. Implement dynamic texture update with camera-aware throttling.

### Task: Implement doorframe geometry and instancing
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Dependencies:** none — independent of shader/text systems
- **Notes:** Build doorframe from three BoxGeometry pieces (left pillar, right pillar, top header). Create invisible portal trigger mesh. Batch doorframe assemblies using InstancedMesh. Each room has two doors (left and right rear corners).

### Task: Use Raycaster onClick/onTouch to navigate rooms
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/rooms
- **Dependencies:** Task "Implement doorframe geometry and instancing"
- **Notes:** Implement raycasting on the portal trigger mesh for click/touch events. Camera lerp animation toward door position with scene fade-to-black transition. Audio pause/resume on room change. State management via EventDispatcher: track currentRoom, playback progress, generated text history.

---

## Epic: Audio System

### Task: Implement positional audio engine
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/audio
- **Dependencies:** none — independent bootstrap task
- **Notes:** Set up THREE.Audio and PositionalAudio for spatial sound. Create audio asset loading pipeline from room manifest. Configure audio listeners and positional speakers within each room.

### Task: Implement AudioAnalyser sampling system
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/audio
- **Dependencies:** Task "Implement positional audio engine"
- **Notes:** Create configurable-frequency AudioAnalyser sampling (default 50ms). Implement smooth interpolation of frequency data between samples. Pass sampled data to shader uniforms. Handle AudioContext state (resume on user gesture, pause/resume on room change).

---

## Epic: Intro Scene — Library Fall-through

### Task: Implement library intro scene
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/intro-scene
- **Dependencies:** none — can run in parallel after bootstrap
- **Notes:** Create the falling-through-library animation. Use InstancedMesh for bookshelves and books (separate geometry from doorframes). Camera auto-falls through the scene while: rooms are loaded, audio is preloaded, first room textures are generated, adjacent rooms are preloaded. On completion: destroy library scene, transition to first room with fade-in.

---

## Epic: Room Manifest & Content Pipeline

### Task: Implement room manifest parser
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/content-pipeline
- **Dependencies:** none — independent
- **Notes:** Parse `roomManifest.json`. Validate room entries, load shader presets, resolve LLM prompt templates. Provide a clean API for accessing room data throughout the app.

### Task: Create sample room content
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/content-pipeline
- **Dependencies:** Task "Implement room manifest parser"
- **Notes:** Create at least 3 sample rooms with: audio tracks, shader presets (bassPulse, etc.), LLM prompt templates, and door configurations. This serves as both demo content and QA test data.

---

## Epic: State Management & Persistence

### Task: Implement state management via EventDispatcher
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/state-management
- **Dependencies:** none — can run in parallel
- **Notes:** Create the event-driven state system tracking: currentRoom, playback progress (time position), generated text history, room transition state. Implement persistence of state across room transitions and page reloads (localStorage or IndexedDB for progress; text history can be larger).

---

## Epic: UI & Polish

### Task: Implement loading screen
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/ui
- **Dependencies:** none — independent
- **Notes:** Create a loading overlay with progress indicators for:
  - Model download (wllama ~500MB, with progress bar and percentage)
  - Model caching in IndexedDB (skip download on repeat visits)
  - Audio preload
  - Room initialization
  - Per-room text generation (show "Generating atmosphere..." during LLM inference, 2-8 seconds)
  Handle the library intro scene transition. The loading screen must gracefully handle variable LLM latency — don't block room entry while waiting for all textures to generate; show a placeholder/dithered texture and update in-place.

### Task: Implement camera controls
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/ui
- **Dependencies:** Tasks "Implement room navigation system"
- **Notes:** Set up OrbitControls for initial camera interaction. Implement smooth camera transitions during room navigation (lerp animation). Add any additional interaction patterns (zoom limits, rotation constraints within rooms).

---

## Epic: Deployment & Production Build

### Task: Configure COOP/COEP headers (optional — recommended for best performance)
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/deployment
- **Dependencies:** none — independent of code tasks
- **Notes:** Wllama multi-threaded WASM path requires `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` HTTP headers. The project uses the WebGPU backend by default (no COOP/COEP required), but these headers are still recommended for optimal WASM performance if the multi-threaded path is ever enabled. Configure the Vite dev server and production deployment to include them. Document this as optional in README.

### Task: Optimize build for production
- **Status:** [ ] pending
- **Assignee:** scrummaster
- **Branch:** feature/deployment
- **Dependencies:** Tasks "Configure COOP/COEP headers", all feature tasks complete
- **Notes:** Configure Vite production build with code splitting, asset compression (Brotli/Gzip), and proper cache headers. Ensure .wasm files are served with correct MIME types. Create deployment configuration for target platform (web).

---
