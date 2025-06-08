const userInfo = async function () {
  function simpleHash(data) {
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
  }

  function generateEnhancedCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 300;

      ctx.fillStyle = "#f0f8ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const texts = [
        {
          text: "BrowserPrint 🔍",
          font: "28px 'Arial Black', Arial",
          color: "#1a73e8",
          x: 10,
          y: 35,
        },
        {
          text: "🌟 Fingerprinting Test 🚀",
          font: "16px 'Times New Roman', serif",
          color: "#ea4335",
          x: 10,
          y: 65,
        },
        {
          text: "Complex Emoji: 🎭🎨🎪🎯",
          font: "24px sans-serif",
          color: "#34a853",
          x: 10,
          y: 95,
        },
        {
          text: "ÀÁÂÃÄÅæßÇ",
          font: "18px 'Courier New', monospace",
          color: "#fbbc05",
          x: 10,
          y: 120,
        },
        {
          text: "中文字符",
          font: "20px sans-serif",
          color: "#9333ea",
          x: 10,
          y: 145,
        },
        {
          text: "العربية",
          font: "18px sans-serif",
          color: "#dc2626",
          x: 10,
          y: 170,
        },
      ];

      texts.forEach(({ text, font, color, x, y }) => {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
      });

      ctx.beginPath();
      ctx.arc(320, 80, 35, 0, Math.PI * 2);
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(50, 200);
      ctx.bezierCurveTo(70, 180, 120, 220, 150, 200);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();

      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 20;
      patternCanvas.height = 20;
      const patternCtx = patternCanvas.getContext("2d");
      patternCtx.fillStyle = "#10b981";
      patternCtx.fillRect(0, 0, 10, 10);
      patternCtx.fillRect(10, 10, 10, 10);
      const pattern = ctx.createPattern(patternCanvas, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(200, 180, 80, 60);

      const radialGradient = ctx.createRadialGradient(
        300,
        200,
        0,
        300,
        200,
        50
      );
      radialGradient.addColorStop(0, "#fbbf24");
      radialGradient.addColorStop(0.5, "#f59e0b");
      radialGradient.addColorStop(1, "#d97706");
      ctx.fillStyle = radialGradient;
      ctx.fillRect(250, 150, 100, 100);

      ctx.beginPath();
      ctx.moveTo(50, 250);
      ctx.lineTo(100, 230);
      ctx.quadraticCurveTo(125, 210, 150, 250);
      ctx.lineTo(200, 270);
      ctx.closePath();
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#4338ca";
      ctx.stroke();

      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#14b8a6";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("Shadowed", 250, 280);

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(300, 40, 40, 40);
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.fillRect(320, 60, 40, 40);
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(340, 80, 40, 40);
      ctx.globalCompositeOperation = "source-over";

      const dataURL = canvas.toDataURL("image/webp", 0.8);
      return simpleHash(dataURL);
    } catch (e) {
      return null;
    }
  }

  function generateWebGLFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2");
      if (!gl) {
        return null;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      let vendor, renderer;

      if (debugInfo) {
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      } else {
        vendor = gl.getParameter(gl.VENDOR);
        renderer = gl.getParameter(gl.RENDERER);
      }

      const params = [
        "VERSION",
        "SHADING_LANGUAGE_VERSION",
        "MAX_VERTEX_ATTRIBS",
        "MAX_VERTEX_UNIFORM_VECTORS",
        "MAX_FRAGMENT_UNIFORM_VECTORS",
        "MAX_VARYING_VECTORS",
        "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
        "MAX_TEXTURE_IMAGE_UNITS",
        "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
        "MAX_CUBE_MAP_TEXTURE_SIZE",
        "MAX_RENDERBUFFER_SIZE",
        "MAX_TEXTURE_SIZE",
        "MAX_VIEWPORT_DIMS",
        "RED_BITS",
        "GREEN_BITS",
        "BLUE_BITS",
        "ALPHA_BITS",
        "DEPTH_BITS",
        "STENCIL_BITS",
        "SUBPIXEL_BITS",
        "SAMPLE_BUFFERS",
        "SAMPLES",
      ];

      const glInfo = {
        vendor: vendor,
        renderer: renderer,
      };

      params.forEach((paramName) => {
        try {
          const paramValue = gl.getParameter(gl[paramName]);
          if (Array.isArray(paramValue)) {
            glInfo[paramName] = [...paramValue];
          } else {
            glInfo[paramName] = paramValue;
          }
        } catch (e) {
          glInfo[paramName] = "N/A";
        }
      });

      glInfo.extensions = gl.getSupportedExtensions()?.sort() || [];

      return simpleHash(glInfo);
    } catch (e) {
      return null;
    }
  }

  function generateWebAudioFingerprint() {
    return new Promise((resolve) => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        if (!audioContext) {
          resolve(null);
          return;
        }

        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gain = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

        gain.gain.setValueAtTime(0, audioContext.currentTime);

        oscillator.connect(analyser);
        analyser.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(0);

        const bufferSize = (analyser.fftSize = 2048);
        const dataArray = new Float32Array(bufferSize);

        setTimeout(() => {
          analyser.getFloatFrequencyData(dataArray);
          oscillator.stop(0);
          audioContext.close();
          resolve(simpleHash(Array.from(dataArray).join(",")));
        }, 100);
      } catch (e) {
        resolve(null);
      }
    });
  }

  function generateFontListFingerprint() {
    try {
      const fontsToTest = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Courier New",
        "Georgia",
        "Palatino",
        "Garamond",
        "Trebuchet MS",
        "Impact",
        "Comic Sans MS",
        "Segoe UI",
        "Roboto",
        "Noto Sans",
        "Apple Color Emoji",
        "Ubuntu",
        "Cantarell",
        "Papyrus",
        "Bradley Hand ITC",
        "Chalkboard SE",
        "Wingdings",
        "Webdings",
        "Helvetica",
        "Monaco",
        "Consolas",
        "Menlo",
        "Source Code Pro",
        "DejaVu Sans",
        "Liberation Sans",
        "Tahoma",
        "Lucida Console",
        "Courier",
        "Times",
        "serif",
        "sans-serif",
        "monospace",
        "cursive",
        "fantasy",
        "system-ui",
        "ui-serif",
        "ui-sans-serif",
        "ui-monospace",
        "ui-rounded",
      ];

      const detectedFonts = {};
      const testString = "mmmmmmmmmmlli";
      const dummyEl = document.createElement("span");
      dummyEl.style.fontSize = "72px";
      dummyEl.style.position = "absolute";
      dummyEl.style.top = "-9999px";
      dummyEl.style.left = "-9999px";
      dummyEl.style.whiteSpace = "nowrap";
      dummyEl.innerHTML = testString;

      document.body.appendChild(dummyEl);

      const getWidth = (fontFamily) => {
        dummyEl.style.fontFamily = `'${fontFamily}', monospace`;
        return dummyEl.offsetWidth;
      };

      const sansSerifWidth = getWidth("sans-serif");
      const serifWidth = getWidth("serif");
      const monospaceWidth = getWidth("monospace");

      fontsToTest.forEach((font) => {
        const width = getWidth(font);
        if (
          width !== sansSerifWidth &&
          width !== serifWidth &&
          width !== monospaceWidth
        ) {
          detectedFonts[font] = true;
        } else {
          detectedFonts[font] = false;
        }
      });

      document.body.removeChild(dummyEl);
      return simpleHash(detectedFonts);
    } catch (e) {
      return null;
    }
  }

  const grab = {
    orientation: function () {
      try {
        if (!screen.orientation) return {};
        switch (screen.orientation.type) {
          case "landscape-primary":
            return { landscape: true, upside_down: false };
          case "landscape-secondary":
            return { landscape: true, upside_down: true };
          case "portrait-primary":
            return { landscape: false, upside_down: false };
          case "portrait-secondary":
            return { landscape: false, upside_down: true };
          default:
            return {};
        }
      } catch (e) {
        return {};
      }
    },
    browser: async function () {
      !(function () {
        var e = {};
        !(function () {
          "use strict";
          var t = e;
          (t.detectIncognito = void 0),
            (t.detectIncognito = function () {
              return new Promise(function (e, t) {
                var o,
                  n,
                  r = "Unknown";
                function i(t) {
                  e({ isPrivate: t, browserName: r });
                }
                function a(e) {
                  return e === eval.toString().length;
                }
                void 0 !== (n = navigator.vendor) &&
                0 === n.indexOf("Apple") &&
                a(37)
                  ? ((r = "Safari"),
                    void 0 !== navigator.maxTouchPoints
                      ? (function () {
                          var e = String(Math.random());
                          try {
                            window.indexedDB.open(e, 1).onupgradeneeded =
                              function (t) {
                                var o,
                                  n,
                                  r =
                                    null === (o = t.target) || void 0 === o
                                      ? void 0
                                      : o.result;
                                try {
                                  r
                                    .createObjectStore("test", {
                                      autoIncrement: !0,
                                    })
                                    .put(new Blob()),
                                    i(!1);
                                } catch (e) {
                                  var a = e;
                                  return (
                                    e instanceof Error &&
                                      (a =
                                        null !== (n = e.message) && void 0 !== n
                                          ? n
                                          : e),
                                    i(
                                      "string" == typeof a &&
                                        /BlobURLs are not yet supported/.test(a)
                                    )
                                  );
                                } finally {
                                  r.close(), window.indexedDB.deleteDatabase(e);
                                }
                              };
                          } catch (e) {
                            return i(!1);
                          }
                        })()
                      : (function () {
                          var e = window.openDatabase,
                            t = window.localStorage;
                          try {
                            e(null, null, null, null);
                          } catch (e) {
                            return i(!0);
                          }
                          try {
                            t.setItem("test", "1"), t.removeItem("test");
                          } catch (e) {
                            return i(!0);
                          }
                          i(!1);
                        })())
                  : (function () {
                      var e = navigator.vendor;
                      return void 0 !== e && 0 === e.indexOf("Google") && a(33);
                    })()
                  ? ((o = navigator.userAgent),
                    (r = o.match(/Chrome/)
                      ? void 0 !== navigator.brave
                        ? "Brave"
                        : o.match(/Edg/)
                        ? "Edge"
                        : o.match(/OPR/)
                        ? "Opera"
                        : "Chrome"
                      : "Chromium"),
                    void 0 !== self.Promise &&
                    void 0 !== self.Promise.allSettled
                      ? navigator.webkitTemporaryStorage.queryUsageAndQuota(
                          function (e, t) {
                            var o;
                            i(
                              Math.round(t / 1048576) <
                                2 *
                                  Math.round(
                                    (void 0 !== (o = window).performance &&
                                    void 0 !== o.performance.memory &&
                                    void 0 !==
                                      o.performance.memory.jsHeapSizeLimit
                                      ? window.performance.memory
                                          .jsHeapSizeLimit
                                      : 1073741824) / 1048576
                                  )
                            );
                          },
                          function (e) {
                            t(
                              new Error(
                                "icognito: failed to query storage quota: " +
                                  e.message
                              )
                            );
                          }
                        )
                      : (0, window.webkitRequestFileSystem)(
                          0,
                          1,
                          function () {
                            i(!1);
                          },
                          function () {
                            i(!0);
                          }
                        ))
                  : void 0 !== document.documentElement &&
                    void 0 !== document.documentElement.style.MozAppearance &&
                    a(37)
                  ? ((r = "Firefox"), i(void 0 === navigator.serviceWorker))
                  : void 0 !== navigator.msSaveBlob && a(39)
                  ? ((r = "Internet Explorer"), i(void 0 === window.indexedDB))
                  : t(
                      new Error("detectIncognito cannot determine the browser")
                    );
              });
            });
        })(),
          (detectIncognito = e.detectIncognito);
      })();

      const v = function () {
        var ua = navigator.userAgent;
        var tem;
        var M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || [];
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
          return "IE " + (tem[1] || "");
        }
        if (M[1] === "Chrome") {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
          if (tem != null)
            return tem.slice(1).join(" ").replace("OPR", "Opera");
        }
        M = M[2]
          ? [M[1], M[2]]
          : [navigator.appName, navigator.appVersion, "-?"];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return parseInt(M[1]);
      };

      function get_js_version() {
        this.jsv = {
          versions: [
            "1.1",
            "1.2",
            "1.3",
            "1.4",
            "1.5",
            "1.6",
            "1.7",
            "1.8",
            "1.9",
            "2.0",
          ],
          version: "",
        };

        var d = document;
        for (let i = 0; i < this.jsv.versions.length; i++) {
          var g = d.createElement("script"),
            s = d.getElementsByTagName("script")[0];
          g.setAttribute("language", "JavaScript" + this.jsv.versions[i]);
          g.text = "this.jsv.version='" + this.jsv.versions[i] + "';";
          s.parentNode.insertBefore(g, s);
        }
        return this.jsv.version;
      }

      function isTorBrowser() {
        try {
          var img = document.createElement("img");
          img.src =
            "data:image/png;base64,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";
          var canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          var ctx = canvas.getContext("2d");
          var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
          return (
            imagedata.data[0] == 255 &&
            imagedata.data[1] == 255 &&
            imagedata.data[2] == 255 &&
            imagedata.data[3] == 255
          );
        } catch (e) {
          return false;
        }
      }

      var result = await detectIncognito();
      result.browserVersion = v();
      result.languages = navigator.languages || [];
      result.doNotTrack = !!(
        navigator.doNotTrack || navigator.globalPrivacyControl
      );
      result.jsVersion = get_js_version();
      result.torBrowser = isTorBrowser();
      result.userAgent = navigator.userAgent;

      result.platform = navigator.platform;
      result.hardwareConcurrency = navigator.hardwareConcurrency;
      result.deviceMemory = navigator.deviceMemory;
      result.maxTouchPoints = navigator.maxTouchPoints;
      result.cookieEnabled = navigator.cookieEnabled;
      result.appName = navigator.appName;
      result.appCodeName = navigator.appCodeName;
      result.appVersion = navigator.appVersion;
      result.product = navigator.product;
      result.productSub = navigator.productSub;
      result.vendor = navigator.vendor;
      result.vendorSub = navigator.vendorSub;
      result.webdriver = navigator.webdriver;
      result.pdfViewerEnabled = navigator.pdfViewerEnabled;

      try {
        result.javaEnabled = navigator.javaEnabled
          ? navigator.javaEnabled()
          : false;
      } catch (e) {
        result.javaEnabled = false;
      }

      result.pluginsLength = navigator.plugins ? navigator.plugins.length : 0;
      result.mimeTypesLength = navigator.mimeTypes
        ? navigator.mimeTypes.length
        : 0;

      return result;
    },
    isMobile: function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    getOS: function () {
      var OSName = "Unknown";
      if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
        OSName = "Windows 10/11";
      if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1)
        OSName = "Windows 8.1";
      if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
        OSName = "Windows 8";
      if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
        OSName = "Windows 7";
      if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
        OSName = "Windows Vista";
      if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
        OSName = "Windows XP";
      if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
        OSName = "Windows 2000";
      if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
      if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
      if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";

      return OSName;
    },
    speed: async function () {
      return new Promise(async (res) => {
        const fileUrl = "https://speed.cloudflare.com/__down?bytes=5000000"; // 5MB for better accuracy

        const iterations = 5;
        const results = [];

        for (let i = 0; i < iterations; i++) {
          const testUrl = `${fileUrl}?t=${Date.now()}-${i}`;

          const start = performance.now();
          const response = await fetch(testUrl);
          const blob = await response.blob();
          const end = performance.now();

          const durationSeconds = (end - start) / 1000;
          const fileSizeBits = blob.size * 8;
          const mbps = fileSizeBits / durationSeconds / 1_000_000;

          results.push(mbps);

          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const average = results.reduce((a, b) => a + b) / results.length;

        res({ time: average.toFixed(2) + " Mbps" });
      });
    },
    adblock: async function () {
      let adBlockEnabled = false;
      const googleAdUrl =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      try {
        await fetch(new Request(googleAdUrl)).catch(
          (_) => (adBlockEnabled = true)
        );
      } catch (e) {
        adBlockEnabled = true;
      } finally {
        return adBlockEnabled;
      }
    },
    grammarly: function () {
      return (
        typeof document.querySelector("grammarly-desktop-integration") ==
        "object"
      );
    },
    stylus: function () {
      if (typeof document.querySelector(".stylus") == "object") {
        return true;
      } else {
        return null;
      }
    },
    java: function () {
      try {
        return navigator.javaEnabled() || false;
      } catch {
        return false;
      }
    },
    flash: function () {
      try {
        var hasFlash = false;
        try {
          hasFlash = Boolean(
            new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
          );
        } catch (exception) {
          hasFlash =
            "undefined" !=
            typeof navigator.mimeTypes["application/x-shockwave-flash"];
        }
        return hasFlash;
      } catch {
        return false;
      }
    },
    crx: function () {
      return Promise.race([
        new Promise(async function (resolve) {
          if (!window.chrome) {
            resolve(["Only available for Chrome"]);
            return;
          }

          const crxdb = await (await fetch("/api/extensions.json")).json();

          let done = 0;
          let hasExt = [];
          const total = Object.keys(crxdb).length;

          Object.keys(crxdb).forEach((extension) => {
            const id = extension;
            const name = crxdb[extension].name;
            const file = crxdb[extension].file;

            fetch("chrome-extension://" + id + "/" + file)
              .then(() => {
                hasExt.push(name);
              })
              .catch(() => {})
              .finally(() => {
                done++;
              });
          });

          const checkInterval = setInterval(() => {
            if (done >= total) {
              clearInterval(checkInterval);
              resolve(hasExt);
            }
          }, 10);
        }),

        new Promise((resolve) => setTimeout(() => resolve(["Timeout"]), 5000)),
      ]);
    },
    fps: function () {
      return new Promise(function (resolve, reject) {
        var fp = 0;
        const funct = function () {
          fp++;
          requestAnimationFrame(funct);
        };

        setTimeout(function () {
          resolve(fp % 10 === 0 ? fp : Math.round(fp / 10) * 10);
        }, 1000);

        requestAnimationFrame(funct);
      });
    },
    mediaDev: async function () {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
          devices: JSON.parse(JSON.stringify(devices)),
          audioInputCount: devices.filter((d) => d.kind === "audioinput")
            .length,
          videoInputCount: devices.filter((d) => d.kind === "videoinput")
            .length,
          audioOutputCount: devices.filter((d) => d.kind === "audiooutput")
            .length,
        };
      } catch (e) {
        return { error: "Permission denied or API error" };
      }
    },

    battery: async function () {
      try {
        if ("getBattery" in navigator) {
          const battery = await navigator.getBattery();
          return {
            charging: battery.charging,
            chargingTime:
              battery.chargingTime === Infinity
                ? "infinity"
                : battery.chargingTime,
            dischargingTime:
              battery.dischargingTime === Infinity
                ? "infinity"
                : battery.dischargingTime,
            level: battery.level,
          };
        } else {
          return { supported: false };
        }
      } catch (e) {
        return { error: "Permission denied or API error" };
      }
    },

    permissions: async function () {
      const permissionsData = {};
      if (
        navigator.permissions &&
        typeof navigator.permissions.query === "function"
      ) {
        const permissionNames = [
          "geolocation",
          "notifications",
          "midi",
          "camera",
          "microphone",
          "background-sync",
          "persistent-storage",
          "clipboard-read",
          "clipboard-write",
          "speaker",
        ];

        for (const name of permissionNames) {
          try {
            const status = await navigator.permissions.query({ name: name });
            permissionsData[name] = status.state;
          } catch (e) {
            permissionsData[name] = "Not supported";
          }
        }
      }
      return permissionsData;
    },

    mediaCapabilities: async function () {
      const mediaCapabilitiesData = {};
      if (
        navigator.mediaCapabilities &&
        typeof navigator.mediaCapabilities.decodingInfo === "function"
      ) {
        try {
          const videoConfig = {
            type: "file",
            video: {
              contentType: 'video/mp4; codecs="avc1.42E01E"',
              width: 640,
              height: 480,
              bitrate: 1000000,
              framerate: 30,
            },
          };
          const audioConfig = {
            type: "file",
            audio: {
              contentType: 'audio/mp4; codecs="mp4a.40.2"',
              channels: 2,
              bitrate: 128000,
            },
          };

          const videoDecoding = await navigator.mediaCapabilities.decodingInfo(
            videoConfig
          );
          const audioDecoding = await navigator.mediaCapabilities.decodingInfo(
            audioConfig
          );

          mediaCapabilitiesData.h264Video =
            videoDecoding.supported &&
            videoDecoding.smooth &&
            videoDecoding.powerEfficient;
          mediaCapabilitiesData.aacAudio =
            audioDecoding.supported &&
            audioDecoding.smooth &&
            audioDecoding.powerEfficient;
        } catch (e) {
          mediaCapabilitiesData.error = "MediaCapabilities API error";
        }
      }
      return mediaCapabilitiesData;
    },

    cssMediaQueries: function () {
      return {
        prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light",
        prefersReducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches,
        prefersContrast: window.matchMedia("(prefers-contrast: more)").matches
          ? "more"
          : window.matchMedia("(prefers-contrast: less)").matches
          ? "less"
          : "no-preference",
        prefersReducedTransparency: window.matchMedia(
          "(prefers-reduced-transparency: reduce)"
        ).matches,
        invertedColors: window.matchMedia("(inverted-colors: inverted)")
          .matches,
        forcedColors: window.matchMedia("(forced-colors: active)").matches,
        hoverCapability: window.matchMedia("(hover: hover)").matches
          ? "hover"
          : "none",
        pointerCapability: window.matchMedia("(pointer: fine)").matches
          ? "fine"
          : "coarse",
        displayMode: window.matchMedia("(display-mode: standalone)").matches
          ? "standalone"
          : "browser",
      };
    },

    timezone: function () {
      return {
        timeZoneOffset: new Date().getTimezoneOffset(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
        numberingSystem:
          Intl.DateTimeFormat().resolvedOptions().numberingSystem,
        currency: (() => {
          try {
            return Intl.NumberFormat().resolvedOptions().currency;
          } catch (e) {
            return null;
          }
        })(),
      };
    },

    connection: function () {
      const conn =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      if (conn) {
        return {
          effectiveType: conn.effectiveType,
          type: conn.type,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData,
        };
      }
      return null;
    },

    clipboard: async function () {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          return { supported: true, readSupported: true };
        } else if (navigator.clipboard) {
          return { supported: true, readSupported: false };
        } else {
          return { supported: false };
        }
      } catch (e) {
        return { supported: false, error: e.message };
      }
    },

    gamepads: function () {
      try {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        return {
          supported: !!navigator.getGamepads,
          count: gamepads.filter((g) => g !== null).length,
        };
      } catch (e) {
        return { supported: false };
      }
    },

    webrtc: async function () {
      return new Promise((resolve) => {
        try {
          const RTCPeerConnection =
            window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
          if (!RTCPeerConnection) {
            resolve({ supported: false });
            return;
          }

          const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });

          const ips = [];
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              const ip =
                event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
              if (ip && !ips.includes(ip[1])) {
                ips.push(ip[1]);
              }
            }
          };

          pc.createDataChannel("test");
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .catch(() => {});

          setTimeout(() => {
            pc.close();
            resolve({
              supported: true,
              localIPs: ips,
              iceConnectionState: pc.iceConnectionState,
            });
          }, 2000);
        } catch (e) {
          resolve({ supported: false, error: e.message });
        }
      });
    },

    performance: function () {
      try {
        const perf = window.performance;
        if (!perf) return { supported: false };

        return {
          supported: true,
          memory: perf.memory
            ? {
                usedJSHeapSize: perf.memory.usedJSHeapSize,
                totalJSHeapSize: perf.memory.totalJSHeapSize,
                jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
              }
            : null,
          navigation: perf.navigation
            ? {
                type: perf.navigation.type,
                redirectCount: perf.navigation.redirectCount,
              }
            : null,
          timing: perf.timing
            ? {
                navigationStart: perf.timing.navigationStart,
                loadEventEnd: perf.timing.loadEventEnd,
                domContentLoadedEventEnd: perf.timing.domContentLoadedEventEnd,
              }
            : null,
        };
      } catch (e) {
        return { supported: false, error: e.message };
      }
    },

    storage: async function () {
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          return {
            supported: true,
            quota: estimate.quota,
            usage: estimate.usage,
            usageDetails: estimate.usageDetails,
          };
        } else {
          return { supported: false };
        }
      } catch (e) {
        return { supported: false, error: e.message };
      }
    },

    vibration: function () {
      return {
        supported: !!navigator.vibrate,
      };
    },

    notification: function () {
      return {
        supported: !!window.Notification,
        permission: window.Notification ? Notification.permission : null,
      };
    },

    serviceWorker: function () {
      return {
        supported: !!navigator.serviceWorker,
      };
    },

    speech: function () {
      return {
        speechSynthesis: !!window.speechSynthesis,
        speechRecognition: !!(
          window.SpeechRecognition || window.webkitSpeechRecognition
        ),
      };
    },

    paymentRequest: function () {
      return {
        supported: !!window.PaymentRequest,
      };
    },

    credentials: function () {
      return {
        supported: !!navigator.credentials,
      };
    },

    deviceSensors: async function () {
      const sensors = {};

      if (typeof DeviceMotionEvent !== "undefined") {
        sensors.deviceMotion = true;

        if (typeof DeviceMotionEvent.requestPermission === "function") {
          sensors.motionPermissionRequired = true;
        }
      }

      if (typeof DeviceOrientationEvent !== "undefined") {
        sensors.deviceOrientation = true;

        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          sensors.orientationPermissionRequired = true;
        }
      }

      try {
        if ("AmbientLightSensor" in window) {
          sensors.ambientLight = true;
        }
      } catch (e) {
        sensors.ambientLight = false;
      }

      try {
        if ("ProximitySensor" in window) {
          sensors.proximity = true;
        }
      } catch (e) {
        sensors.proximity = false;
      }

      return sensors;
    },

    hardwareFingerprint: function () {
      const hardware = {};

      const startTime = window.performance.now();
      let iterations = 0;
      const maxTime = 10;

      while (window.performance.now() - startTime < maxTime) {
        Math.random();
        iterations++;
      }

      hardware.cpuSpeed = iterations;
      hardware.hardwareConcurrency = navigator.hardwareConcurrency;
      hardware.deviceMemory = navigator.deviceMemory;

      try {
        const memoryInfo = window.performance.memory;
        if (memoryInfo) {
          hardware.memoryPressure = {
            used: memoryInfo.usedJSHeapSize,
            total: memoryInfo.totalJSHeapSize,
            limit: memoryInfo.jsHeapSizeLimit,
            ratio: memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize,
          };
        }
      } catch (e) {
        hardware.memoryError = e.message;
      }

      return hardware;
    },

    wasmFingerprint: async function () {
      try {
        if (typeof WebAssembly !== "object") {
          return { supported: false };
        }

        const wasmCode = new Uint8Array([
          0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01,
          0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07,
          0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01,
          0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
        ]);

        const startTime = window.performance.now();
        const module = await WebAssembly.compile(wasmCode);
        const instance = await WebAssembly.instantiate(module);
        const endTime = window.performance.now();

        return {
          supported: true,
          compilationTime: endTime - startTime,
          addFunction: instance.exports.add(2, 3),
        };
      } catch (e) {
        return { supported: false, error: e.message };
      }
    },

    cssFingerprint: function () {
      const css = {};

      const testDiv = document.createElement("div");
      const properties = [
        "backdropFilter",
        "webkitBackdropFilter",
        "filter",
        "transform3d",
        "perspective",
        "textShadow",
        "boxShadow",
        "borderRadius",
        "opacity",
        "columnCount",
        "resize",
        "outline",
        "textOverflow",
        "wordWrap",
        "boxReflect",
        "webkitBoxReflect",
        "mask",
        "webkitMask",
        "clipPath",
        "webkitClipPath",
        "appearance",
        "webkitAppearance",
        "userSelect",
        "webkitUserSelect",
        "touchAction",
        "willChange",
        "contain",
      ];

      properties.forEach((prop) => {
        css[prop] = prop in testDiv.style;
      });

      try {
        testDiv.style.setProperty("--test", "value");
        css.customProperties =
          testDiv.style.getPropertyValue("--test") === "value";
      } catch (e) {
        css.customProperties = false;
      }

      return css;
    },

    domFingerprint: function () {
      const dom = {};

      dom.documentMode = document.documentMode;
      dom.compatMode = document.compatMode;
      dom.designMode = document.designMode;
      dom.domain = document.domain;
      dom.readyState = document.readyState;

      dom.windowName = window.name;
      dom.windowStatus = window.status;
      dom.windowDefaultStatus = window.defaultStatus;

      dom.querySelector = typeof document.querySelector === "function";
      dom.addEventListener = typeof document.addEventListener === "function";
      dom.getElementsByClassName =
        typeof document.getElementsByClassName === "function";
      dom.createEvent = typeof document.createEvent === "function";

      dom.localStorage = typeof Storage !== "undefined";
      dom.sessionStorage = typeof Storage !== "undefined";
      dom.indexedDB = typeof indexedDB !== "undefined";
      dom.webSQL = typeof openDatabase !== "undefined";

      return dom;
    },

    errorFingerprint: function () {
      const errors = {};

      try {
        eval("undefined.property");
      } catch (e) {
        errors.evalError = {
          name: e.name,
          message: e.message.substring(0, 50),
          stack: e.stack ? e.stack.split("\n")[0] : null,
        };
      }

      try {
        new Function("invalid syntax {")();
      } catch (e) {
        errors.syntaxError = {
          name: e.name,
          message: e.message.substring(0, 50),
        };
      }

      const testError = new Error("test");
      errors.errorProperties = {
        hasStack: "stack" in testError,
        hasFileName: "fileName" in testError,
        hasLineNumber: "lineNumber" in testError,
        hasColumnNumber: "columnNumber" in testError,
      };

      return errors;
    },

    interactionFingerprint: function () {
      return new Promise((resolve) => {
        const interaction = {
          mouseSupport: typeof MouseEvent !== "undefined",
          touchSupport: typeof TouchEvent !== "undefined",
          pointerSupport: typeof PointerEvent !== "undefined",
          maxTouchPoints: navigator.maxTouchPoints || 0,
          timestamp: Date.now(),
        };

        let mouseMovements = [];
        let touchCount = 0;
        const startTime = Date.now();

        const mouseHandler = (e) => {
          if (Date.now() - startTime < 1000 && mouseMovements.length < 10) {
            mouseMovements.push({
              x: e.clientX,
              y: e.clientY,
              time: e.timeStamp,
            });
          }
        };

        const touchHandler = (e) => {
          touchCount++;
          if (touchCount > 10) {
            document.removeEventListener("touchstart", touchHandler);
          }
        };

        document.addEventListener("mousemove", mouseHandler, { passive: true });
        document.addEventListener("touchstart", touchHandler, {
          passive: true,
        });

        setTimeout(() => {
          document.removeEventListener("mousemove", mouseHandler);
          document.removeEventListener("touchstart", touchHandler);

          interaction.mouseMovements = mouseMovements.length;
          interaction.touchEvents = touchCount;
          interaction.avgMouseSpeed =
            mouseMovements.length > 1
              ? mouseMovements.reduce((sum, move, i) => {
                  if (i === 0) return 0;
                  const prev = mouseMovements[i - 1];
                  const dist = Math.sqrt(
                    Math.pow(move.x - prev.x, 2) + Math.pow(move.y - prev.y, 2)
                  );
                  const time = move.time - prev.time;
                  return sum + (time > 0 ? dist / time : 0);
                }, 0) /
                (mouseMovements.length - 1)
              : 0;

          resolve(interaction);
        }, 300);
      });
    },

    misc: function () {
      return {
        workerSupport: typeof Worker !== "undefined",
        wasmSupport:
          typeof WebAssembly === "object" &&
          typeof WebAssembly.instantiate === "function",
        sharedArrayBufferSupport: typeof SharedArrayBuffer !== "undefined",
        atomicsSupport: typeof Atomics !== "undefined",
        webglSupport: (() => {
          try {
            const canvas = document.createElement("canvas");
            return !!(
              canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl")
            );
          } catch (e) {
            return false;
          }
        })(),
        webgl2Support: (() => {
          try {
            const canvas = document.createElement("canvas");
            return !!canvas.getContext("webgl2");
          } catch (e) {
            return false;
          }
        })(),
        offscreenCanvasSupport: typeof OffscreenCanvas !== "undefined",
        broadcastChannelSupport: typeof BroadcastChannel !== "undefined",
        intersectionObserverSupport:
          typeof IntersectionObserver !== "undefined",
        resizeObserverSupport: typeof ResizeObserver !== "undefined",
        mutationObserverSupport: typeof MutationObserver !== "undefined",
        promiseSupport: typeof Promise !== "undefined",
        symbolSupport: typeof Symbol !== "undefined",
        proxySupport: typeof Proxy !== "undefined",
        mapSupport: typeof Map !== "undefined",
        setSupport: typeof Set !== "undefined",
        weakMapSupport: typeof WeakMap !== "undefined",
        weakSetSupport: typeof WeakSet !== "undefined",
        bigIntSupport: typeof BigInt !== "undefined",
        intersectionObserver: typeof IntersectionObserver !== "undefined",
        mutationObserver: typeof MutationObserver !== "undefined",
        resizeObserver: typeof ResizeObserver !== "undefined",
        performanceObserver: typeof PerformanceObserver !== "undefined",
        crypto:
          typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined",
        webCrypto:
          typeof crypto !== "undefined" &&
          typeof crypto.getRandomValues === "function",
        bluetooth: typeof navigator.bluetooth !== "undefined",
        usb: typeof navigator.usb !== "undefined",
        serial: typeof navigator.serial !== "undefined",
        hid: typeof navigator.hid !== "undefined",
        presentation: typeof navigator.presentation !== "undefined",
        wakeLock: typeof navigator.wakeLock !== "undefined",
        share: typeof navigator.share !== "undefined",
        contacts: typeof navigator.contacts !== "undefined",
        scheduling: typeof scheduler !== "undefined",
        trustedTypes: typeof trustedTypes !== "undefined",
      };
    },
  };

  const [
    browser,
    speed,
    fps,
    mediaDevices,
    adblock,
    crx,
    battery,
    permissions,
    mediaCapabilities,
    webAudioFingerprint,
    clipboard,
    gamepads,
    webrtc,
    performanceInfo,
    storage,
    vibration,
    notification,
    serviceWorker,
    speech,
    paymentRequest,
    credentials,
    deviceSensors,
    hardwareFingerprint,
    wasmFingerprint,
    cssFingerprint,
    domFingerprint,
    errorFingerprint,
    interactionFingerprint,
  ] = await Promise.all([
    grab.browser(),
    grab.speed(),
    grab.fps(),
    grab.mediaDev(),
    grab.adblock(),
    grab.crx(),
    grab.battery(),
    grab.permissions(),
    grab.mediaCapabilities(),
    generateWebAudioFingerprint(),
    grab.clipboard(),
    grab.gamepads(),
    grab.webrtc(),
    grab.performance(),
    grab.storage(),
    grab.vibration(),
    grab.notification(),
    grab.serviceWorker(),
    grab.speech(),
    grab.paymentRequest(),
    grab.credentials(),
    grab.deviceSensors(),
    grab.hardwareFingerprint(),
    grab.wasmFingerprint(),
    grab.cssFingerprint(),
    grab.domFingerprint(),
    grab.errorFingerprint(),
    grab.interactionFingerprint(),
  ]);

  const result = {
    browser,

    device: {
      screen: {
        height: window.screen.height,
        width: window.screen.width,
        pixelratio: window.devicePixelRatio,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
      },
      orientation: grab.orientation(),
      speed,
      fps,
      theme:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "Dark"
          : "Light",
      mediaDevices,
      battery,
      performanceInfo,
      storage,
      vibration,
      notification,
      serviceWorker,
      speech,
      paymentRequest,
      credentials,
      gamepads,
      clipboard,
      sensors: deviceSensors,
      hardware: hardwareFingerprint,
    },

    os: {
      mobile: grab.isMobile(),
      name: grab.getOS(),
    },

    page: {
      referrer: document.referrer,
      url: window.location.href,
      domain: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent,
    },

    plugins: {
      adblock,
      grammarly: grab.grammarly(),
      stylus: grab.stylus(),
      java: grab.java(),
      flash: grab.flash(),
      crx,
    },

    network: {
      connection: grab.connection(),
      webrtc,
    },

    fingerprints: {
      canvas: generateEnhancedCanvasFingerprint(),
      webgl: generateWebGLFingerprint(),
      webAudio: webAudioFingerprint,
      fonts: generateFontListFingerprint(),
      wasm: wasmFingerprint,
      css: cssFingerprint,
      dom: domFingerprint,
      errors: errorFingerprint,
      interaction: interactionFingerprint,
    },

    system: {
      timezone: grab.timezone(),
      cssMediaQueries: grab.cssMediaQueries(),
      permissions,
      mediaCapabilities,
      misc: grab.misc(),
    },

    compositeFingerprint: (() => {
      const data = {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
        timezone: new Date().getTimezoneOffset(),
        language: navigator.language,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        canvas: generateEnhancedCanvasFingerprint(),
        webgl: generateWebGLFingerprint(),
        fonts: generateFontListFingerprint(),
        hardware: hardwareFingerprint.cpuSpeed,
        css: simpleHash(cssFingerprint),
        dom: simpleHash(domFingerprint),
      };
      return simpleHash(data);
    })(),
  };

  return result;
};
