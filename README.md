<img src="./public/assets/logo.svg" alt="LinkLog Logo" width="60">

# LinkLog — A powerful Grabify alternative

Get detailed analytics and insights from any link you share using hundreds of data points. Simple, powerful, fast.

- **Fast:** Made with Bun, Elysia and SQLite
- **Secure:** Cap for CAPTCHAs
- **Open source:** Fully open source, hosted on GitHub
- **Privacy-focused:** No ads, no nonsense
- **Insanely detailed:** 200+ data points logged
- **Self-hosted:** Host it yourself or use our hosted service

👉 **Try it out** at [linklog.tiagorangel.com](https://linklog.tiagorangel.com)

## Data points logged

**1. Browser**

- `isPrivate`
- `browserName`
- `browserVersion`
- `languages`
- `doNotTrack`
- `jsVersion`
- `torBrowser`
- `userAgent`
- `platform`
- `hardwareConcurrency`
- `deviceMemory`
- `maxTouchPoints`
- `cookieEnabled`
- `appName`
- `appCodeName`
- `appVersion`
- `product`
- `productSub`
- `vendor`
- `vendorSub`
- `webdriver`
- `pdfViewerEnabled`
- `javaEnabled`
- `pluginsLength`
- `mimeTypesLength`

**2. Device information:**

- **Screen:**
  - `height`
  - `width`
  - `pixelratio`
  - `colorDepth`
  - `pixelDepth`
  - `availWidth`
  - `availHeight`
  - `innerWidth`
  - `innerHeight`
  - `outerWidth`
  - `outerHeight`
  - `orientation`
- `speed` (network speed in mbps):
- `fps`
- `theme`
- `mediaDevices`
  - `devices`
  - `audioInputCount`
  - `videoInputCount`
  - `audioOutputCount`
- `battery`
  - `charging`
  - `chargingTime`
  - `dischargingTime`
  - `level`
- `performanceInfo`

  - `supported`
  - `memory`
    - usedJSHeapSize
    - totalJSHeapSize
    - jsHeapSizeLimit
  - `navigation`
    - `type`
    - `redirectCount`
  - `timing`
    - `navigationStart`
    - `loadEventEnd`
    - `domContentLoadedEventEnd`

- `storage`
  - `supported`
  - `quota`
  - `usage`
  - `usageDetails`
- `vibration`
  - `supported`
- `notification`
  - `supported`
  - `permission`
- `serviceWorker`
  - `supported`
- `speech`
  - `speechSynthesis`
  - `speechRecognition`
- `paymentRequest`
  - `supported`
- `credentials`
  - `supported`
- `gamepads`
  - `supported`
  - `count`
- `clipboard`
  - `supported`
  - `readSupported`
- `sensors`
  - `deviceMotion`
  - `motionPermissionRequired`
  - `deviceOrientation`
  - `orientationPermissionRequired`
  - `ambientLight`
  - `proximity`
- `hardware`
  - `cpuSpeed`
  - `hardwareConcurrency`
  - `deviceMemory`
    - used
    - total
    - limit
    - ratio
- `inputCapabilities`
  - `pointerType`
  - `hoverCapability`
  - `anyPointer`
  - `anyHover`
  - `maxTouchPoints`
  - `touchSupport`
  - `stylusSupport`
- `display`
  - `colorGamut`
  - `dynamicRange`
  - `displayMode`
  - `refreshRate`
  - `orientation`

**3. OS**

- `mobile`
- `name`
- `architecture`
  - `platform`
  - `archHint`
  - `wasmSupport`
  - `wasmFeatures`
    - simd
    - threads
  - `hardwareConcurrency`
  - `deviceMemory`

**4. Page:**

- `referrer`
- `url`
- `domain`
- `protocol`
- `userAgent`

**5. Plugins:**

- `adblock`
- `grammarly`
- `stylus`
- `java`
- `flash`
- `crx` (list of all chrome extensions installed!)

**6. Network:**

- `connection`
  - `effectiveType`
  - `type`
  - `downlink`
  - `rtt`
  - `saveData`
- `webrtc`
  - `supported`
  - `candidates`
  - `candidateTypes`
  - `gatheringTime`
  - `iceConnectionState`
  - `iceGatheringState`
  - `localIPs`
  - `stats`

**7. Fingerprints:**

- `canvas`
- `webgl`
- `webAudio`
- `fonts`
- `wasm`
  - `supported`
  - `compilationTime`
  - `addFunction`
- `css`
- `dom`
- `error`
- `interaction`

**8. System:**

- `timezone`
  - `timeZoneOffset`
  - `timeZone`
  - `locale`
  - `calendar`
  - `numberingSystem`
  - `currency`
- `cssMediaQueries`
  - `prefersColorScheme`
  - `prefersReducedMotion`
  - `prefersContrast`
  - `prefersReducedTransparency`
  - `invertedColors`
  - `forcedColors`
  - `hoverCapability`
  - `pointerCapability`
  - `displayMode`
- `permissions`
  - geolocation, notifications, midi, camera, microphone, `background-sync`, `persistent-storage`, `clipboard-read`, `clipboard-write`, speaker
- `mediaCapabilities`
- h264Video
- aacAudio
- `misc`
  - workerSupport
  - wasmSupport
  - sharedArrayBufferSupport
  - atomicsSupport
  - webglSupport
  - webgl2Support
  - offscreenCanvasSupport
  - broadcastChannelSupport
  - intersectionObserverSupport
  - resizeObserverSupport
  - mutationObserverSupport
  - promiseSupport
  - symbolSupport
  - proxySupport
  - mapSupport
  - setSupport
  - weakMapSupport
  - weakSetSupport
  - bigIntSupport
  - intersectionObserver
  - mutationObserver
  - resizeObserver
  - performanceObserver
  - crypto
  - webCrypto
  - bluetooth
  - usb
  - serial
  - hid
  - presentation
  - wakeLock
  - share
  - contacts
  - scheduling
  - trustedTypes
- `accessibility`
  - reducedMotion
  - reducedTransparency
  - highContrast
  - lowContrast
  - colorScheme
  - invertedColors
  - forcedColors
  - screenReader
- `security`
  - secureContext
  - crossOriginIsolated
  - crypto
  - permissions
  - featurePolicy
  - csp
  - trustedTypes

**9. APIs:**

- speechSynthesis
- speechRecognition
- bluetoothApi
- nfcApi
- usbApi
- serialApi
- hidApi
- paymentRequest
- virtualReality
- webXR
- webAuthentication
- webShare
- webLocks
- broadcastChannel
- screenWakeLock
- eyeDropper
- fileSystemAccess
- webCodecs
- trustedTypes

**All of this from a single link click.**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tiagorangel1/linklog.git
   ```
2. Navigate to the project directory:
   ```bash
   cd linklog
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create the data folder:
   ```bash
   mkdir .data
   ```
5. Start the development server:
   ```bash
   bun dev
   ```

Note that the ratelimiting and deleteme functionality relies on the `cf-connecting-ip` header which is only available for websites behind Cloudflare.

## License

This project is licensed under the AGPL 3.0 license
