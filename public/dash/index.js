const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const state = {
  currentView: null,
  scrollPosition: 0,
};

const utils = {
  escapeHtml(unsafe) {
    if (typeof unsafe !== "string") return unsafe;
    const div = document.createElement("div");
    div.textContent = unsafe;
    return div.innerHTML;
  },

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  },

  simpleHash(data) {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  },

  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error(error.message);
    }
  },
};

const views = {
  async confirmShorten(url) {
    const template = `
      <div class="confirm-dialog">
        <div class="confirm-content">
          <h1>Create link?</h1>
          <p>Solve the CAPTCHA to create a new short URL</p>

          <div class="cap-container">
            <cap-widget id="cap" data-cap-api-endpoint="/cap/"></cap-widget>
          </div>
        </div>
      </div>
    `;

    $("main").innerHTML = template;

    setTimeout(() => {
      $(".cap-container cap-widget").addEventListener("solve", (e) => {
        const { token } = e.detail;

        this.createNewLink(url, token);
      });
    }, 100);
  },

  async showEventDetails(hit, preloadedResponse, slug, scrollTop) {
    const template = `
      <div class="detail-header">
        <button class="back-btn btn-secondary">
          ← Back to overview
        </button>
        <h1>Visit details</h1>
      </div>
      
      <div class="detail-sections">
        ${this.renderDetailSection("IP", [
          ["IP Address", hit.ip_data?.ip?.ip],
          ["ISP", hit.ip_data?.ip?.isp],
          ["Host", hit.ip_data?.ip?.host],
          ["Reverse DNS", hit.ip_data?.ip?.rdns],
          ["ASN", hit.ip_data?.ip?.asn],
          [
            "Country",
            hit.ip_data?.ip?.country_name && hit.ip_data?.ip?.country_code
              ? `${hit.ip_data.ip.country_name} (${hit.ip_data.ip.country_code})`
              : hit.ip_data?.ip?.country_name || hit.ip_data?.ip?.country_code,
          ],
          [
            "Region",
            hit.ip_data?.ip?.region_name && hit.ip_data?.ip?.region_code
              ? `${hit.ip_data.ip.region_name} (${hit.ip_data.ip.region_code})`
              : hit.ip_data?.ip?.region_name || hit.ip_data?.ip?.region_code,
          ],
          ["City", hit.ip_data?.ip?.city],
          ["Postal Code", hit.ip_data?.ip?.postal_code],
          [
            "Continent",
            hit.ip_data?.ip?.continent_name && hit.ip_data?.ip?.continent_code
              ? `${hit.ip_data.ip.continent_name} (${hit.ip_data.ip.continent_code})`
              : hit.ip_data?.ip?.continent_name ||
                hit.ip_data?.ip?.continent_code,
          ],
          [
            "Location",
            hit.ip_data?.ip?.latitude && hit.ip_data?.ip?.longitude
              ? `<a href="https://www.google.com/maps/search/${hit.ip_data.ip.latitude}+${hit.ip_data.ip.longitude}" target="_blank">${hit.ip_data.ip.latitude}, ${hit.ip_data.ip.longitude}</a>`
              : "Unknown",
          ],
          ["Metro Code", hit.ip_data?.ip?.metro_code || "Unknown"],
          ["Timezone", hit.ip_data?.ip?.timezone],
          ["Date/Time", hit.ip_data?.ip?.datetime],
        ])}
        
        ${this.renderDetailSection("Browser", [
          ["Name", hit.ip_data?.browser?.browserName],
          ["Version", hit.ip_data?.browser?.browserVersion],
          ["User Agent", hit.ip_data?.browser?.userAgent],
          ["Platform", hit.ip_data?.browser?.platform],
          ["Hardware Concurrency", hit.ip_data?.browser?.hardwareConcurrency],
          [
            "Device Memory",
            hit.ip_data?.browser?.deviceMemory
              ? `${hit.ip_data.browser.deviceMemory} GB`
              : undefined,
          ],
          ["Max Touch Points", hit.ip_data?.browser?.maxTouchPoints],
          ["Cookie Enabled", hit.ip_data?.browser?.cookieEnabled],
          ["Java Enabled", hit.ip_data?.browser?.javaEnabled],
          ["PDF Viewer Enabled", hit.ip_data?.browser?.pdfViewerEnabled],
          ["Webdriver", hit.ip_data?.browser?.webdriver],
          ["App Name", hit.ip_data?.browser?.appName],
          ["App Version", hit.ip_data?.browser?.appVersion],
          ["Product", hit.ip_data?.browser?.product],
          ["Vendor", hit.ip_data?.browser?.vendor],
          [
            "Languages",
            hit.ip_data?.browser?.languages
              ?.map(
                (lang) => `<span class="tag">${utils.escapeHtml(lang)}</span>`
              )
              .join(""),
            true,
          ],
          ["Do Not Track", hit.ip_data?.browser?.doNotTrack],
          ["Private Mode", hit.ip_data?.browser?.isPrivate],
          ["JavaScript Version", hit.ip_data?.browser?.jsVersion],
          ["Tor Browser", hit.ip_data?.browser?.torBrowser],
          ["Plugins Length", hit.ip_data?.browser?.pluginsLength],
          ["MIME Types Length", hit.ip_data?.browser?.mimeTypesLength],
        ])}
        
        ${this.renderDetailSection("OS", [
          ["Mobile Device", hit.ip_data?.os?.mobile],
          ["OS Name", hit.ip_data?.os?.name],
        ])}
        
        ${this.renderDetailSection("Device", [
          ["Screen Width", hit.ip_data?.device?.screen?.width],
          ["Screen Height", hit.ip_data?.device?.screen?.height],
          ["Color Depth", hit.ip_data?.device?.screen?.colorDepth],
          ["Pixel Depth", hit.ip_data?.device?.screen?.pixelDepth],
          ["Available Width", hit.ip_data?.device?.screen?.availWidth],
          ["Available Height", hit.ip_data?.device?.screen?.availHeight],
          ["Inner Width", hit.ip_data?.device?.screen?.innerWidth],
          ["Inner Height", hit.ip_data?.device?.screen?.innerHeight],
          ["Outer Width", hit.ip_data?.device?.screen?.outerWidth],
          ["Outer Height", hit.ip_data?.device?.screen?.outerHeight],
          ["Pixel Ratio", hit.ip_data?.device?.screen?.pixelratio],
          ["FPS", hit.ip_data?.device?.fps],
          [
            "Orientation",
            `${
              hit.ip_data?.device?.orientation?.landscape
                ? "Landscape"
                : "Portrait"
            }${
              hit.ip_data?.device?.orientation?.upside_down
                ? " (Upside Down)"
                : ""
            }`,
          ],
          ["Theme", hit.ip_data?.device?.theme],
          [
            "Connection speed",
            hit.ip_data?.device?.speed?.time
              ? `${hit.ip_data.device.speed.time}`
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Hardware", [
          [
            "CPU Speed Test",
            hit.ip_data?.device?.hardware?.cpuSpeed
              ? `${hit.ip_data.device.hardware.cpuSpeed} iterations/10ms`
              : undefined,
          ],
          [
            "Hardware Concurrency",
            hit.ip_data?.device?.hardware?.hardwareConcurrency,
          ],
          [
            "Device Memory",
            hit.ip_data?.device?.hardware?.deviceMemory
              ? `${hit.ip_data.device.hardware.deviceMemory} GB`
              : undefined,
          ],
          [
            "Memory Used",
            hit.ip_data?.device?.hardware?.memoryPressure?.used
              ? `${(
                  hit.ip_data.device.hardware.memoryPressure.used /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Memory Total",
            hit.ip_data?.device?.hardware?.memoryPressure?.total
              ? `${(
                  hit.ip_data.device.hardware.memoryPressure.total /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Memory Limit",
            hit.ip_data?.device?.hardware?.memoryPressure?.limit
              ? `${(
                  hit.ip_data.device.hardware.memoryPressure.limit /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Memory Pressure",
            hit.ip_data?.device?.hardware?.memoryPressure?.ratio
              ? `${(
                  hit.ip_data.device.hardware.memoryPressure.ratio * 100
                ).toFixed(1)}%`
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Device Sensors", [
          ["Device Motion Support", hit.ip_data?.device?.sensors?.deviceMotion],
          [
            "Motion Permission Required",
            hit.ip_data?.device?.sensors?.motionPermissionRequired,
          ],
          [
            "Device Orientation Support",
            hit.ip_data?.device?.sensors?.deviceOrientation,
          ],
          [
            "Orientation Permission Required",
            hit.ip_data?.device?.sensors?.orientationPermissionRequired,
          ],
          ["Ambient Light Sensor", hit.ip_data?.device?.sensors?.ambientLight],
          ["Proximity Sensor", hit.ip_data?.device?.sensors?.proximity],
        ])}

        ${this.renderDetailSection("Battery", [
          ["Charging", hit.ip_data?.device?.battery?.charging],
          ["Charging Time", hit.ip_data?.device?.battery?.chargingTime],
          ["Discharging Time", hit.ip_data?.device?.battery?.dischargingTime],
          [
            "Level",
            hit.ip_data?.device?.battery?.level
              ? `${(hit.ip_data.device.battery.level * 100).toFixed(1)}%`
              : undefined,
          ],
          ["Supported", hit.ip_data?.device?.battery?.supported],
        ])}

        ${this.renderDetailSection("Media Devices", [
          [
            "Audio Input Count",
            hit.ip_data?.device?.mediaDevices?.audioInputCount,
          ],
          [
            "Video Input Count",
            hit.ip_data?.device?.mediaDevices?.videoInputCount,
          ],
          [
            "Audio Output Count",
            hit.ip_data?.device?.mediaDevices?.audioOutputCount,
          ],
          [
            "Device List",
            hit.ip_data?.device?.mediaDevices?.devices
              ? JSON.stringify(hit.ip_data.device.mediaDevices.devices, null, 2)
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Performance", [
          [
            "Memory Used JS Heap",
            hit.ip_data?.device?.performanceInfo?.memory?.usedJSHeapSize
              ? `${(
                  hit.ip_data.device.performanceInfo.memory.usedJSHeapSize /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Memory Total JS Heap",
            hit.ip_data?.device?.performanceInfo?.memory?.totalJSHeapSize
              ? `${(
                  hit.ip_data.device.performanceInfo.memory.totalJSHeapSize /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Memory JS Heap Limit",
            hit.ip_data?.device?.performanceInfo?.memory?.jsHeapSizeLimit
              ? `${(
                  hit.ip_data.device.performanceInfo.memory.jsHeapSizeLimit /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : undefined,
          ],
          [
            "Navigation Type",
            hit.ip_data?.device?.performanceInfo?.navigation?.type,
          ],
          [
            "Redirect Count",
            hit.ip_data?.device?.performanceInfo?.navigation?.redirectCount,
          ],
        ])}

        ${this.renderDetailSection("Storage", [
          [
            "Quota",
            hit.ip_data?.device?.storage?.quota
              ? `${(
                  hit.ip_data.device.storage.quota /
                  1024 /
                  1024 /
                  1024
                ).toFixed(2)} GB`
              : undefined,
          ],
          [
            "Usage",
            hit.ip_data?.device?.storage?.usage
              ? `${(hit.ip_data.device.storage.usage / 1024 / 1024).toFixed(
                  2
                )} MB`
              : undefined,
          ],
          ["Supported", hit.ip_data?.device?.storage?.supported],
        ])}

        ${this.renderDetailSection("Browser Plugins", [
          ["AdBlock", hit.ip_data?.plugins?.adblock],
          ["Grammarly", hit.ip_data?.plugins?.grammarly],
          ["Stylus", hit.ip_data?.plugins?.stylus],
          ["Java", hit.ip_data?.plugins?.java],
          ["Adobe Flash", hit.ip_data?.plugins?.flash],
          [
            "Extensions",
            hit.ip_data?.plugins?.crx
              ?.map(
                (ext) => `<span class="tag">${utils.escapeHtml(ext)}</span>`
              )
              .join(""),
            true,
          ],
        ])}

        ${this.renderDetailSection("Network", [
          ["Connection Type", hit.ip_data?.network?.connection?.type],
          ["Effective Type", hit.ip_data?.network?.connection?.effectiveType],
          [
            "Downlink",
            hit.ip_data?.network?.connection?.downlink
              ? `${hit.ip_data.network.connection.downlink} Mbps`
              : undefined,
          ],
          [
            "RTT",
            hit.ip_data?.network?.connection?.rtt
              ? `${hit.ip_data.network.connection.rtt} ms`
              : undefined,
          ],
          ["Save Data", hit.ip_data?.network?.connection?.saveData],
          ["WebRTC Supported", hit.ip_data?.network?.webrtc?.supported],
          [
            "WebRTC Local IPs",
            hit.ip_data?.network?.webrtc?.localIPs?.join(", "),
          ],
          [
            "WebRTC ICE State",
            hit.ip_data?.network?.webrtc?.iceConnectionState,
          ],
        ])}

        ${console.log(hit.ip_data?.fingerprints)}

        ${this.renderDetailSection("Advanced Fingerprints", [
          ["Canvas Fingerprint", hit.ip_data?.fingerprints?.canvas],
          [
            "WebGL Fingerprint",
            `${hit.ip_data?.fingerprints?.webgl?.hash} (${JSON.stringify(
              hit.ip_data?.fingerprints?.webgl?.detailed
            )})`,
          ],
          [
            "WebAudio Fingerprint",
            `${hit.ip_data?.fingerprints?.webAudio?.hash} (${JSON.stringify(
              hit.ip_data?.fingerprints?.webAudio?.detailed
            )})`,
          ],
          ["Font List Fingerprint", hit.ip_data?.fingerprints?.fonts],
          ["WebAssembly Support", hit.ip_data?.fingerprints?.wasm?.supported],
          [
            "WebAssembly Compilation Time",
            hit.ip_data?.fingerprints?.wasm?.compilationTime
              ? `${hit.ip_data.fingerprints.wasm.compilationTime.toFixed(3)}ms`
              : undefined,
          ],
          [
            "WebAssembly Test Result",
            hit.ip_data?.fingerprints?.wasm?.addFunction,
          ],
          [
            "CSS Properties Hash",
            hit.ip_data?.fingerprints?.css
              ? utils.simpleHash(hit.ip_data.fingerprints.css)
              : undefined,
          ],
          [
            "DOM Properties Hash",
            hit.ip_data?.fingerprints?.dom
              ? utils.simpleHash(hit.ip_data.fingerprints.dom)
              : undefined,
          ],
          [
            "Error Handling Hash",
            hit.ip_data?.fingerprints?.errors
              ? utils.simpleHash(hit.ip_data.fingerprints.errors)
              : undefined,
          ],
          ["Composite Fingerprint", hit.ip_data?.compositeFingerprint],
        ])}

        ${this.renderDetailSection("CSS Feature Support", [
          ["Backdrop Filter", hit.ip_data?.fingerprints?.css?.backdropFilter],
          [
            "WebKit Backdrop Filter",
            hit.ip_data?.fingerprints?.css?.webkitBackdropFilter,
          ],
          ["Filter", hit.ip_data?.fingerprints?.css?.filter],
          ["Transform 3D", hit.ip_data?.fingerprints?.css?.transform3d],
          ["Perspective", hit.ip_data?.fingerprints?.css?.perspective],
          ["Text Shadow", hit.ip_data?.fingerprints?.css?.textShadow],
          ["Box Shadow", hit.ip_data?.fingerprints?.css?.boxShadow],
          ["Border Radius", hit.ip_data?.fingerprints?.css?.borderRadius],
          ["Opacity", hit.ip_data?.fingerprints?.css?.opacity],
          ["Column Count", hit.ip_data?.fingerprints?.css?.columnCount],
          ["Resize", hit.ip_data?.fingerprints?.css?.resize],
          ["Outline", hit.ip_data?.fingerprints?.css?.outline],
          ["Text Overflow", hit.ip_data?.fingerprints?.css?.textOverflow],
          ["Word Wrap", hit.ip_data?.fingerprints?.css?.wordWrap],
          ["Box Reflect", hit.ip_data?.fingerprints?.css?.boxReflect],
          [
            "WebKit Box Reflect",
            hit.ip_data?.fingerprints?.css?.webkitBoxReflect,
          ],
          ["Mask", hit.ip_data?.fingerprints?.css?.mask],
          ["WebKit Mask", hit.ip_data?.fingerprints?.css?.webkitMask],
          ["Clip Path", hit.ip_data?.fingerprints?.css?.clipPath],
          ["WebKit Clip Path", hit.ip_data?.fingerprints?.css?.webkitClipPath],
          ["Appearance", hit.ip_data?.fingerprints?.css?.appearance],
          [
            "WebKit Appearance",
            hit.ip_data?.fingerprints?.css?.webkitAppearance,
          ],
          ["User Select", hit.ip_data?.fingerprints?.css?.userSelect],
          [
            "WebKit User Select",
            hit.ip_data?.fingerprints?.css?.webkitUserSelect,
          ],
          ["Touch Action", hit.ip_data?.fingerprints?.css?.touchAction],
          ["Will Change", hit.ip_data?.fingerprints?.css?.willChange],
          ["Contain", hit.ip_data?.fingerprints?.css?.contain],
          [
            "Custom Properties",
            hit.ip_data?.fingerprints?.css?.customProperties,
          ],
        ])}

        ${this.renderDetailSection("DOM Features", [
          ["Document Mode", hit.ip_data?.fingerprints?.dom?.documentMode],
          ["Compat Mode", hit.ip_data?.fingerprints?.dom?.compatMode],
          ["Design Mode", hit.ip_data?.fingerprints?.dom?.designMode],
          ["Domain", hit.ip_data?.fingerprints?.dom?.domain],
          ["Ready State", hit.ip_data?.fingerprints?.dom?.readyState],
          ["Query Selector", hit.ip_data?.fingerprints?.dom?.querySelector],
          [
            "Add Event Listener",
            hit.ip_data?.fingerprints?.dom?.addEventListener,
          ],
          [
            "Get Elements By Class Name",
            hit.ip_data?.fingerprints?.dom?.getElementsByClassName,
          ],
          ["Create Event", hit.ip_data?.fingerprints?.dom?.createEvent],
          ["Local Storage", hit.ip_data?.fingerprints?.dom?.localStorage],
          ["Session Storage", hit.ip_data?.fingerprints?.dom?.sessionStorage],
          ["IndexedDB", hit.ip_data?.fingerprints?.dom?.indexedDB],
          ["WebSQL", hit.ip_data?.fingerprints?.dom?.webSQL],
        ])}

        ${this.renderDetailSection("System Preferences", [
          ["Timezone", hit.system?.timezone?.timeZone],
          [
            "Timezone Offset",
            hit.system?.timezone?.timeZoneOffset
              ? `${hit.system.timezone.timeZoneOffset} minutes`
              : undefined,
          ],
          ["Locale", hit.system?.timezone?.locale],
          ["Calendar", hit.system?.timezone?.calendar],
          ["Numbering System", hit.system?.timezone?.numberingSystem],
          ["Currency", hit.system?.timezone?.currency],
          ["Color Scheme", hit.system?.cssMediaQueries?.prefersColorScheme],
          ["Reduced Motion", hit.system?.cssMediaQueries?.prefersReducedMotion],
          ["Contrast Preference", hit.system?.cssMediaQueries?.prefersContrast],
          [
            "Reduced Transparency",
            hit.system?.cssMediaQueries?.prefersReducedTransparency,
          ],
          ["Inverted Colors", hit.system?.cssMediaQueries?.invertedColors],
          ["Forced Colors", hit.system?.cssMediaQueries?.forcedColors],
          ["Hover Capability", hit.system?.cssMediaQueries?.hoverCapability],
          [
            "Pointer Capability",
            hit.system?.cssMediaQueries?.pointerCapability,
          ],
          ["Display Mode", hit.system?.cssMediaQueries?.displayMode],
        ])}

        ${this.renderDetailSection("API Support", [
          ["Worker Support", hit.system?.misc?.workerSupport],
          ["WebAssembly Support", hit.system?.misc?.wasmSupport],
          [
            "SharedArrayBuffer Support",
            hit.system?.misc?.sharedArrayBufferSupport,
          ],
          ["Atomics Support", hit.system?.misc?.atomicsSupport],
          ["WebGL Support", hit.system?.misc?.webglSupport],
          ["WebGL2 Support", hit.system?.misc?.webgl2Support],
          ["OffscreenCanvas Support", hit.system?.misc?.offscreenCanvasSupport],
          [
            "BroadcastChannel Support",
            hit.system?.misc?.broadcastChannelSupport,
          ],
          [
            "IntersectionObserver Support",
            hit.system?.misc?.intersectionObserverSupport,
          ],
          ["ResizeObserver Support", hit.system?.misc?.resizeObserverSupport],
          [
            "MutationObserver Support",
            hit.system?.misc?.mutationObserverSupport,
          ],
          [
            "PerformanceObserver Support",
            hit.system?.misc?.performanceObserver,
          ],
          ["Promise Support", hit.system?.misc?.promiseSupport],
          ["Symbol Support", hit.system?.misc?.symbolSupport],
          ["Proxy Support", hit.system?.misc?.proxySupport],
          ["Map Support", hit.system?.misc?.mapSupport],
          ["Set Support", hit.system?.misc?.setSupport],
          ["WeakMap Support", hit.system?.misc?.weakMapSupport],
          ["WeakSet Support", hit.system?.misc?.weakSetSupport],
          ["BigInt Support", hit.system?.misc?.bigIntSupport],
          ["Crypto Support", hit.system?.misc?.crypto],
          ["Web Crypto Support", hit.system?.misc?.webCrypto],
          ["Bluetooth API", hit.system?.misc?.bluetooth],
          ["USB API", hit.system?.misc?.usb],
          ["Serial API", hit.system?.misc?.serial],
          ["HID API", hit.system?.misc?.hid],
          ["Presentation API", hit.system?.misc?.presentation],
          ["Wake Lock API", hit.system?.misc?.wakeLock],
          ["Share API", hit.system?.misc?.share],
          ["Contacts API", hit.system?.misc?.contacts],
          ["Scheduling API", hit.system?.misc?.scheduling],
          ["Trusted Types API", hit.system?.misc?.trustedTypes],
          ["Speech Synthesis", hit.device?.speech?.speechSynthesis],
          ["Speech Recognition", hit.device?.speech?.speechRecognition],
          ["Service Worker", hit.device?.serviceWorker?.supported],
          ["Payment Request", hit.device?.paymentRequest?.supported],
          ["Credentials API", hit.device?.credentials?.supported],
          ["Vibration API", hit.device?.vibration?.supported],
          ["Notification API", hit.device?.notification?.supported],
          ["Notification Permission", hit.device?.notification?.permission],
          ["Gamepad Support", hit.device?.gamepads?.supported],
          ["Gamepad Count", hit.device?.gamepads?.count],
          ["Clipboard Support", hit.device?.clipboard?.supported],
          ["Clipboard Read Support", hit.device?.clipboard?.readSupported],
        ])}

        ${this.renderPermissionsSection(hit.system?.permissions)}

        ${this.renderDetailSection("Media capabilities", [
          ["H264 Video", hit.system?.mediaCapabilities?.h264Video],
          ["AAC Audio", hit.system?.mediaCapabilities?.aacAudio],
        ])}

        ${this.renderDetailSection("WebGL", [
          ["Vendor", hit.ip_data?.fingerprints?.webgl?.detailed?.vendor],
          ["Renderer", hit.ip_data?.fingerprints?.webgl?.detailed?.renderer],
          ["Version", hit.ip_data?.fingerprints?.webgl?.detailed?.version],
          [
            "Shading Language Version",
            hit.ip_data?.fingerprints?.webgl?.detailed?.shadingLanguageVersion,
          ],
          [
            "Max Anisotropy",
            hit.ip_data?.fingerprints?.webgl?.detailed?.maxAnisotropy,
          ],
          [
            "Max Texture Size",
            hit.ip_data?.fingerprints?.webgl?.detailed?.MAX_TEXTURE_SIZE,
          ],
          [
            "Max Viewport Dims",
            Object.values(
              hit.ip_data?.fingerprints?.webgl?.detailed?.MAX_VIEWPORT_DIMS ||
                {}
            ).join("×"),
          ],
          [
            "Max Vertex Attribs",
            hit.ip_data?.fingerprints?.webgl?.detailed?.MAX_VERTEX_ATTRIBS,
          ],
          [
            "Supported Extensions",
            hit.ip_data?.fingerprints?.webgl?.detailed?.extensions?.length
              ? `${hit.ip_data.fingerprints.webgl.detailed.extensions.length} extensions`
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Audio", [
          [
            "Sample Rate",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.sampleRate
              ? `${hit.ip_data.fingerprints.webAudio.detailed.sampleRate} Hz`
              : undefined,
          ],
          [
            "Audio Context State",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.state,
          ],
          [
            "Max Channel Count",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.maxChannelCount,
          ],
          [
            "Number of Inputs",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.numberOfInputs,
          ],
          [
            "Number of Outputs",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.numberOfOutputs,
          ],
          [
            "Channel Count",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.channelCount,
          ],
          [
            "Channel Count Mode",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.channelCountMode,
          ],
          [
            "Channel Interpretation",
            hit.ip_data?.fingerprints?.webAudio?.detailed
              ?.channelInterpretation,
          ],
          [
            "Base Latency",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.baseLatency
              ? `${hit.ip_data.fingerprints.webAudio.detailed.baseLatency.toFixed(
                  6
                )}s`
              : undefined,
          ],
          [
            "Output Latency",
            hit.ip_data?.fingerprints?.webAudio?.detailed?.outputLatency
              ? `${hit.ip_data.fingerprints.webAudio.detailed.outputLatency.toFixed(
                  6
                )}s`
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Fonts", [
          [
            "Total Fonts Detected",
            hit.ip_data?.fingerprints?.fonts?.detailed?.total,
          ],
          [
            "Fonts Tested",
            hit.ip_data?.fingerprints?.fonts?.detailed?.testedFonts,
          ],
          [
            "Available Fonts",
            hit.ip_data?.fingerprints?.fonts?.detailed?.availableFonts?.join(
              ", "
            ),
          ],
        ])}

        ${this.renderDetailSection("WebRTC", [
          [
            "Gathering Time",
            hit.ip_data?.network?.webrtc?.gatheringTime
              ? `${hit.ip_data.network.webrtc.gatheringTime.toFixed(2)}ms`
              : undefined,
          ],
          [
            "Candidate Types",
            hit.ip_data?.network?.webrtc?.candidateTypes?.join(", "),
          ],
          [
            "Total Candidates",
            hit.ip_data?.network?.webrtc?.stats?.totalCandidates,
          ],
          ["Unique IPs", hit.ip_data?.network?.webrtc?.stats?.uniqueIPs],
          [
            "Host Candidates",
            hit.ip_data?.network?.webrtc?.stats?.hostCandidates,
          ],
          [
            "SRFLX Candidates",
            hit.ip_data?.network?.webrtc?.stats?.srflxCandidates,
          ],
          [
            "Relay Candidates",
            hit.ip_data?.network?.webrtc?.stats?.relayCandidates,
          ],
          [
            "ICE Gathering State",
            hit.ip_data?.network?.webrtc?.iceGatheringState,
          ],
          [
            "ICE Connection State",
            hit.ip_data?.network?.webrtc?.iceConnectionState,
          ],
        ])}

        ${this.renderDetailSection("Input Device Capabilities", [
          ["Pointer Type", hit.ip_data?.device?.inputCapabilities?.pointerType],
          [
            "Hover Capability",
            hit.ip_data?.device?.inputCapabilities?.hoverCapability,
          ],
          ["Any Pointer", hit.ip_data?.device?.inputCapabilities?.anyPointer],
          ["Any Hover", hit.ip_data?.device?.inputCapabilities?.anyHover],
          [
            "Max Touch Points",
            hit.ip_data?.device?.inputCapabilities?.maxTouchPoints,
          ],
          [
            "Touch Support",
            hit.ip_data?.device?.inputCapabilities?.touchSupport,
          ],
          [
            "Stylus Support",
            hit.ip_data?.device?.inputCapabilities?.stylusSupport,
          ],
        ])}

        ${this.renderDetailSection("Advanced API Support", [
          ["Speech Synthesis", hit.ip_data?.apis?.advanced?.speechSynthesis],
          [
            "Speech Recognition",
            hit.ip_data?.apis?.advanced?.speechRecognition,
          ],
          ["Bluetooth API", hit.ip_data?.apis?.advanced?.bluetoothApi],
          ["NFC API", hit.ip_data?.apis?.advanced?.nfcApi],
          ["USB API", hit.ip_data?.apis?.advanced?.usbApi],
          ["Serial API", hit.ip_data?.apis?.advanced?.serialApi],
          ["HID API", hit.ip_data?.apis?.advanced?.hidApi],
          ["Payment Request", hit.ip_data?.apis?.advanced?.paymentRequest],
          ["Virtual Reality", hit.ip_data?.apis?.advanced?.virtualReality],
          ["WebXR", hit.ip_data?.apis?.advanced?.webXR],
          [
            "Web Authentication",
            hit.ip_data?.apis?.advanced?.webAuthentication,
          ],
          ["Web Share", hit.ip_data?.apis?.advanced?.webShare],
          ["Web Locks", hit.ip_data?.apis?.advanced?.webLocks],
          ["Broadcast Channel", hit.ip_data?.apis?.advanced?.broadcastChannel],
          ["Screen Wake Lock", hit.ip_data?.apis?.advanced?.screenWakeLock],
          ["Eye Dropper", hit.ip_data?.apis?.advanced?.eyeDropper],
          ["File System Access", hit.ip_data?.apis?.advanced?.fileSystemAccess],
          ["Web Codecs", hit.ip_data?.apis?.advanced?.webCodecs],
          ["Trusted Types", hit.ip_data?.apis?.advanced?.trustedTypes],
        ])}

        ${this.renderDetailSection("CPU Architecture", [
          ["Platform", hit.ip_data?.os?.architecture?.platform],
          ["Architecture Hint", hit.ip_data?.os?.architecture?.archHint],
          ["WebAssembly Support", hit.ip_data?.os?.architecture?.wasmSupport],
          ["SIMD Support", hit.ip_data?.os?.architecture?.wasmFeatures?.simd],
          [
            "Threads Support",
            hit.ip_data?.os?.architecture?.wasmFeatures?.threads,
          ],
        ])}

        ${this.renderDetailSection("Accessibility Features", [
          ["Reduced Motion", hit.ip_data?.system?.accessibility?.reducedMotion],
          [
            "Reduced Transparency",
            hit.ip_data?.system?.accessibility?.reducedTransparency,
          ],
          ["High Contrast", hit.ip_data?.system?.accessibility?.highContrast],
          ["Low Contrast", hit.ip_data?.system?.accessibility?.lowContrast],
          ["Color Scheme", hit.ip_data?.system?.accessibility?.colorScheme],
          [
            "Inverted Colors",
            hit.ip_data?.system?.accessibility?.invertedColors,
          ],
          ["Forced Colors", hit.ip_data?.system?.accessibility?.forcedColors],
          [
            "Screen Reader Detection",
            hit.ip_data?.system?.accessibility?.screenReader,
          ],
        ])}

        ${this.renderDetailSection("Display Capabilities", [
          ["Color Gamut", hit.ip_data?.device?.display?.colorGamut],
          ["Dynamic Range", hit.ip_data?.device?.display?.dynamicRange],
          ["Display Mode", hit.ip_data?.device?.display?.displayMode],
          [
            "Refresh Rate",
            hit.ip_data?.device?.display?.refreshRate
              ? `${hit.ip_data.device.display.refreshRate} Hz`
              : undefined,
          ],
          ["Orientation Type", hit.ip_data?.device?.display?.orientation?.type],
          [
            "Orientation Angle",
            hit.ip_data?.device?.display?.orientation?.angle
              ? `${hit.ip_data.device.display.orientation.angle}°`
              : undefined,
          ],
        ])}

        ${this.renderDetailSection("Security Features", [
          ["Secure Context", hit.ip_data?.system?.security?.secureContext],
          [
            "Cross Origin Isolated",
            hit.ip_data?.system?.security?.crossOriginIsolated,
          ],
          ["Crypto API", hit.ip_data?.system?.security?.crypto],
          ["Permissions API", hit.ip_data?.system?.security?.permissions],
          ["Feature Policy", hit.ip_data?.system?.security?.featurePolicy],
          ["Content Security Policy", hit.ip_data?.system?.security?.csp],
          ["Trusted Types", hit.ip_data?.system?.security?.trustedTypes],
        ])}

        ${
          hit.ip_data?._metadata?.truncated
            ? this.renderDetailSection("Data", [
                [
                  "Original Size",
                  hit.ip_data._metadata.originalSize
                    ? `${(hit.ip_data._metadata.originalSize / 1024).toFixed(
                        2
                      )} KB`
                    : undefined,
                ],
                ["Data Truncated", hit.ip_data._metadata.truncated],
                [
                  "Max Allowed Size",
                  hit.ip_data._metadata.maxSize
                    ? `${(hit.ip_data._metadata.maxSize / 1024).toFixed(2)} KB`
                    : undefined,
                ],
              ])
            : ""
        }
        
        ${this.renderDetailSection("Advanced", [
          ["Referrer", hit.page?.referrer || "Direct visit"],
          ["Page URL", hit.page?.url],
          ["Domain", hit.page?.domain],
          ["Protocol", hit.page?.protocol],
        ])}
      </div>
    `;

    $("main").innerHTML = template
      .replace(/\btrue\b/g, '<span class="status-yes">Yes</span>')
      .replace(/\bfalse\b/g, '<span class="status-no">No</span>')
      .replace(/\bundefined\b/g, '<span class="status-unknown">Unknown</span>')
      .replace(/\bnull\b/g, '<span class="status-unknown">Unknown</span>');

    $(".back-btn").addEventListener("click", () => {
      this.showLinkDetails(slug, preloadedResponse);
      $("main").scrollTop = scrollTop;
    });
  },

  renderPermissionsSection(permissions) {
    if (!permissions || Object.keys(permissions).length === 0) return "";

    const permissionRows = Object.entries(permissions).map(([name, state]) => [
      name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
      state,
    ]);

    return this.renderDetailSection("API Permissions", permissionRows);
  },

  renderDetailSection(title, rows) {
    const validRows = rows.filter(([_, value]) => value != null);
    if (validRows.length === 0) return "";

    return `
      <div class="detail-section">
      <h3 class="section-title">${title}</h3>
      <div class="detail-grid">
        ${validRows
          .map(([label, value, dontEscape]) => {
            let displayValue = String(value);
            if (displayValue.length > 800) {
              displayValue = displayValue.slice(0, 800) + "...";
            }
            return `<div class="detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${
              dontEscape ? displayValue : utils.escapeHtml(displayValue)
            }</span>
          </div>`;
          })
          .join("")}
      </div>
      </div>
    `;
  },

  async showLinkDetails(slug, preloadedResponse = null) {
    const key = localStorage.getItem(`linklog--${slug}`);

    $("main").innerHTML =
      '<div class="loader-wrap"><div class="loader"></div></div>';

    let response;
    try {
      if (preloadedResponse) {
        response = preloadedResponse;
      } else {
        response = await utils.apiCall(
          `/api/get?slug=${encodeURIComponent(slug)}&key=${key}`
        );
      }
    } catch (error) {
      response = { error: error.message };
    }

    if (response.error) {
      $("main").innerHTML = `
        <div class="error-display">
          <h2>Something went wrong</h2>
          <p>${
            response.error === "Network error: HTTP 429: Too Many Requests"
              ? "You're making too many requests, wait 10 seconds then try again"
              : utils.escapeHtml(response.error)
          }</p>
        </div>
      `;
      return;
    }

    const template = `
      <div class="link-header">
        <div class="link-actions">
          <button class="action-btn reload" title="Refresh data">
            <b>Reload data</b>
          </button>
          <button class="action-btn delete" title="Delete permanently">
            Delete
          </button>
        </div>
        
        <h1 class="link-title">
          <span class="domain">${location.host}/</span>${utils.escapeHtml(slug)}
        </h1>
        
        <div class="link-meta">
          <div class="meta-item">
            <span class="meta-label">Target URL</span>
            <a href="${utils.escapeHtml(
              response.url
            )}" target="_blank" class="meta-value link-external">
              ${utils.escapeHtml(response.url)}
            </a>
          </div>
          <div class="meta-item">
            <span class="meta-label">Alternative URL</span>
            <a href="${utils.escapeHtml(
              response.masked?.spoodotme
            )}" target="_blank" class="meta-value link-external">
              ${utils.escapeHtml(response.masked?.spoodotme)}
            </a>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Visits</span>
            <span class="meta-value visit-count">${
              response.hits?.length || 0
            }</span>
          </div>
        </div>
      </div>
      
      <div class="hits-section">
        <h2>Visits</h2>
        <div class="hits-container">
          ${
            response.hits?.length > 0
              ? `
            <div class="hits-grid">
              ${response.hits
                .map((hit) => this.renderHitCard(hit, response, slug))
                .join("")}
            </div>
          `
              : `
            <div class="empty-hits">
              <p>No visitors yet. Share your link to start tracking!</p>
            </div>
          `
          }
        </div>
      </div>
    `;

    $("main").innerHTML = template;

    $(".reload").addEventListener("click", () => this.showLinkDetails(slug));
    $(".delete").addEventListener("click", () =>
      this.handleDeleteLink(slug, response)
    );

    $$(".hit-card").forEach((card) => {
      const viewDetailsBtn = card.querySelector(".btn-view-details");
      if (viewDetailsBtn) {
        const hitIndex = parseInt(card.dataset.hitIndex);
        const hit = response.hits[hitIndex];
        viewDetailsBtn.addEventListener("click", () => {
          this.showEventDetails(hit, response, slug, $("main").scrollTop);
        });
      }
    });
  },

  renderHitCard(hit, response) {
    const webglHash =
      hit.ip_data?.fingerprints?.webgl?.hash ||
      hit.ip_data?.fingerprints?.webgl;
    const webglVendor = hit.ip_data?.fingerprints?.webgl?.detailed?.vendor;
    const webglRenderer = hit.ip_data?.fingerprints?.webgl?.detailed?.renderer;

    const audioHash =
      hit.ip_data?.fingerprints?.webAudio?.hash ||
      hit.ip_data?.fingerprints?.webAudio;
    const audioSampleRate =
      hit.ip_data?.fingerprints?.webAudio?.detailed?.sampleRate;

    const fontCount = hit.ip_data?.fingerprints?.fonts?.detailed?.total;

    const truncated = hit.ip_data?._metadata?.truncated;

    return `
      <div class="hit-card" data-hit-index="${response.hits.indexOf(hit)}">
        <div class="hit-card-content">
          ${
            truncated
              ? '<div class="truncated-badge">⚠️ Data Truncated</div>'
              : ""
          }
          <div class="hit-primary">
            <div class="hit-location">
              <span class="location-icon">📍</span>
              <span class="location-text">
                ${utils.escapeHtml(hit.ip_data?.ip?.city || "Unknown")}, 
                ${utils.escapeHtml(hit.ip_data?.ip?.country_name || "Unknown")}
              </span>
            </div>
            <div class="hit-ip">
              ${utils.escapeHtml(hit.ip_data?.ip?.ip || "Unknown IP")}
            </div>
          </div>
          <div class="hit-secondary">
            <div class="hit-browser">
              ${utils.escapeHtml(
                hit.ip_data?.browser?.browserName || "Unknown"
              )} 
              ${utils.escapeHtml(hit.ip_data?.browser?.browserVersion || "")}
            </div>
            <div class="hit-os">
              ${utils.escapeHtml(hit.ip_data?.os?.name || "Unknown OS")}
              ${
                hit.ip_data?.os?.architecture?.archHint
                  ? ` (${hit.ip_data.os.architecture.archHint})`
                  : ""
              }
            </div>
            <div class="hit-device">
              ${hit.ip_data?.device?.screen?.width}×${
      hit.ip_data?.device?.screen?.height
    }
              ${hit.ip_data?.os?.mobile ? " (Mobile)" : " (Desktop)"}
              ${
                hit.ip_data?.device?.inputCapabilities?.pointerType
                  ? ` - ${hit.ip_data.device.inputCapabilities.pointerType}`
                  : ""
              }
            </div>
          </div>
          <div class="hit-fingerprint">
            <div class="fingerprint-info">
              <span class="label">Composite:</span>
              <span class="value">${utils.escapeHtml(
                hit.ip_data?.compositeFingerprint || "N/A"
              )}</span>
            </div>
            ${
              hit.ip_data?.fingerprints?.canvas
                ? `
              <div class="canvas-fingerprint">
                <span class="label">Canvas:</span>
                <span class="value">${utils.escapeHtml(
                  hit.ip_data.fingerprints.canvas
                )}</span>
              </div>
            `
                : ""
            }
            
            ${
              webglVendor || webglRenderer
                ? `
              <div class="gpu-info">
                <span class="label">GPU:</span>
                <span class="value">${utils.escapeHtml(
                  webglRenderer || webglVendor || "Unknown"
                )}</span>
              </div>
            `
                : ""
            }
            ${
              hit.ip_data?.device?.hardware?.cpuSpeed
                ? `
              <div class="hardware-fingerprint">
                <span class="label">CPU:</span>
                <span class="value">${hit.ip_data.device.hardware.cpuSpeed} ops/10ms</span>
              </div>
            `
                : ""
            }
          </div>
          <div class="hit-actions">
            <button class="btn-view-details btn-small">
              View details
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async handleDeleteLink(slug, response) {
    $("main").innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-content">
          <h1>Delete link?</h1>
          <p>This will permanently delete the link and all associated visitor data. This action cannot be undone.</p>
          <div class="confirm-actions">
            <button class="confirm-delete btn-danger">
              Delete permanently
            </button>
            <button class="cancel-delete btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    $(".confirm-delete").addEventListener("click", async () => {
      $("main").innerHTML =
        '<div class="loader-wrap"><div class="loader"></div></div>';

      const key = localStorage.getItem(`linklog--${slug}`);

      try {
        const deleteResponse = await utils.apiCall(
          `/api/delete?slug=${encodeURIComponent(slug)}&key=${key}`
        );

        if (deleteResponse.error) {
          $("main").innerHTML = `
            <div class="error-display">
              <h2>Error</h2>
              <p>${utils.escapeHtml(deleteResponse.error)}</p>
            </div>
          `;
          return;
        }

        localStorage.removeItem(`linklog--${slug}`);
        location.reload();
      } catch (error) {
        $("main").innerHTML = `
          <div class="error-display">
            <h2>Network Error</h2>
            <p>${utils.escapeHtml(error.message)}</p>
          </div>
        `;
      }
    });

    $(".cancel-delete").addEventListener("click", () =>
      this.showLinkDetails(slug, response)
    );
  },

  async createNewLink(url, captchaToken) {
    $("main").innerHTML =
      '<div class="loader-wrap"><div class="loader"></div></div>';

    try {
      const response = await utils.apiCall("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          cap: captchaToken,
        }),
      });

      if (response.error) {
        $("main").innerHTML = `
          <div class="error-display">
            <h2>Error</h2>
            <p>${utils.escapeHtml(response.error)}</p>
          </div>
        `;
        return;
      }

      localStorage.setItem(`linklog--${response.slug}`, response.key);
      this.addLinkToSidebar(response.slug);
      this.showLinkDetails(response.slug);
    } catch (error) {
      $("main").innerHTML = `
        <div class="error-display">
          <h2>Error</h2>
          <p>${utils.escapeHtml(error.message)}</p>
        </div>
      `;
    }
  },

  addLinkToSidebar(slug) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<a class="link" href="javascript:void(0)">/${utils.escapeHtml(
      slug
    )}</a>`;

    listItem.querySelector("a").addEventListener("click", () => {
      this.showLinkDetails(slug);
    });

    $("aside ul").appendChild(listItem);
  },
};

class App {
  constructor() {
    this.init();
  }

  init() {
    this.loadSavedLinks();
    this.setupEventListeners();
    this.handleInitialRoute();
  }

  loadSavedLinks() {
    const linkKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("linklog--")) {
        linkKeys.push(key);
      }
    }

    linkKeys.forEach((key) => {
      const slug = key.replace("linklog--", "");
      views.addLinkToSidebar(slug);
    });
  }

  setupEventListeners() {
    const newLinkInput = $("aside .new");

    if (newLinkInput) {
      newLinkInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const url = event.target.value.trim();

          if (!url) return;

          if (!utils.isValidUrl(url)) {
            event.target.setCustomValidity("Please enter a valid URL");
            event.target.reportValidity();
            return;
          }

          event.target.setCustomValidity("");
          event.target.value = "";
          views.confirmShorten(url);
        }
      });

      newLinkInput.addEventListener("input", (event) => {
        event.target.setCustomValidity("");
      });
    }
  }

  async handleInitialRoute() {
    const urlParams = new URLSearchParams(location.search);
    const newUrl = urlParams.get("new");

    if (newUrl) {
      views.confirmShorten(newUrl);
      return;
    }

    const firstLink = $("aside .link");
    if (firstLink) {
      firstLink.click();
    } else {
      $("main").innerHTML =
        '<div class="empty-state"><p>No links yet. Create one using the input above!</p></div>';
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new App());
} else {
  new App();
}
