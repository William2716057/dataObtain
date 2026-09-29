navigator.geolocation.getCurrentPosition(

    async (position) => {

        const takenData = {

            collection: {
                timestamp: new Date().toISOString(),
                collector: "Browser Forensics",
                version: "1.0"
            },

            location: {
                timestamp: new Date(position.timestamp).toISOString(),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed
            },

            browser: {
                userAgent: navigator.userAgent,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                platform: navigator.platform,
                vendor: navigator.vendor,
                language: navigator.language,
                languages: navigator.languages,
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,
                onLine: navigator.onLine,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory || null,
                maxTouchPoints: navigator.maxTouchPoints
            },

            page: {
                href: window.location.href,
                origin: window.location.origin,
                protocol: window.location.protocol,
                hostname: window.location.hostname,
                port: window.location.port,
                pathname: window.location.pathname,
                referrer: document.referrer,
                title: document.title,
                characterSet: document.characterSet,
                readyState: document.readyState
            },

            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                devicePixelRatio: window.devicePixelRatio,

                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },

                outerWindow: {
                    width: window.outerWidth,
                    height: window.outerHeight
                }
            },

            time: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezoneOffset: new Date().getTimezoneOffset(),
                locale: Intl.DateTimeFormat().resolvedOptions().locale
            },

            storage: {
                localStorage: Object.fromEntries(
                    Object.entries(localStorage)
                ),

                sessionStorage: Object.fromEntries(
                    Object.entries(sessionStorage)
                )
            },

            cookies: document.cookie,

            performance: performance.getEntries().map(entry => ({
                name: entry.name,
                entryType: entry.entryType,
                startTime: entry.startTime,
                duration: entry.duration
            })),

            permissions: {},

            network: {},

            battery: null,

            webgl: null,

            media: null,

            serviceWorkers: [],

            caches: [],

            indexedDB: []
        };


        // --------------------------------------------------
        // Permissions
        // --------------------------------------------------

        if (navigator.permissions) {

            const permissions = [
                "geolocation",
                "notifications",
                "camera",
                "microphone",
                "clipboard-read",
                "clipboard-write"
            ];

            for (const name of permissions) {

                try {

                    const result =
                        await navigator.permissions.query({
                            name
                        });

                    takenData.permissions[name] = result.state;

                } catch {

                    takenData.permissions[name] = "unsupported";

                }
            }
        }


        // --------------------------------------------------
        // Network information
        // --------------------------------------------------

        if (navigator.connection) {

            takenData.network = {
                effectiveType:
                    navigator.connection.effectiveType,

                downlink:
                    navigator.connection.downlink,

                rtt:
                    navigator.connection.rtt,

                saveData:
                    navigator.connection.saveData,

                type:
                    navigator.connection.type || null
            };
        }


        // --------------------------------------------------
        // Battery
        // --------------------------------------------------

        if (navigator.getBattery) {

            try {

                const battery =
                    await navigator.getBattery();

                takenData.battery = {
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                    level: battery.level
                };

            } catch {

                takenData.battery = "unavailable";
            }
        }


        // --------------------------------------------------
        // WebGL information
        // --------------------------------------------------

        try {

            const canvas =
                document.createElement("canvas");

            const gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");

            if (gl) {

                const debugInfo =
                    gl.getExtension(
                        "WEBGL_debug_renderer_info"
                    );

                takenData.webgl = {

                    vendor:
                        debugInfo
                            ? gl.getParameter(
                                debugInfo.UNMASKED_VENDOR_WEBGL
                            )
                            : null,

                    renderer:
                        debugInfo
                            ? gl.getParameter(
                                debugInfo.UNMASKED_RENDERER_WEBGL
                            )
                            : null,

                    version:
                        gl.getParameter(
                            gl.VERSION
                        ),

                    shadingLanguageVersion:
                        gl.getParameter(
                            gl.SHADING_LANGUAGE_VERSION
                        )
                };
            }

        } catch {

            takenData.webgl = "unavailable";
        }


        // --------------------------------------------------
        // Media capabilities
        // --------------------------------------------------

        if (navigator.mediaDevices) {

            try {

                const devices =
                    await navigator.mediaDevices.enumerateDevices();

                takenData.media = devices.map(device => ({
                    kind: device.kind,
                    deviceId: device.deviceId,
                    groupId: device.groupId,
                    label: device.label
                }));

            } catch {

                takenData.media = "unavailable";
            }
        }


        // --------------------------------------------------
        // Service workers
        // --------------------------------------------------

        if (navigator.serviceWorker) {

            try {

                const registrations =
                    await navigator.serviceWorker.getRegistrations();

                takenData.serviceWorkers =
                    registrations.map(registration => ({
                        scope: registration.scope,
                        active:
                            registration.active
                                ? registration.active.scriptURL
                                : null,
                        installing:
                            registration.installing
                                ? registration.installing.scriptURL
                                : null,
                        waiting:
                            registration.waiting
                                ? registration.waiting.scriptURL
                                : null
                    }));

            } catch {

                takenData.serviceWorkers =
                    "unavailable";
            }
        }


        // --------------------------------------------------
        // Cache Storage
        // --------------------------------------------------

        if (window.caches) {

            try {

                takenData.caches =
                    await caches.keys();

            } catch {

                takenData.caches =
                    "unavailable";
            }
        }


        // --------------------------------------------------
        // IndexedDB
        // --------------------------------------------------

        if (indexedDB.databases) {

            try {

                const databases =
                    await indexedDB.databases();

                takenData.indexedDB =
                    databases.map(db => ({
                        name: db.name,
                        version: db.version
                    }));

            } catch {

                takenData.indexedDB =
                    "unavailable";
            }
        }


        // --------------------------------------------------
        // Export
        // --------------------------------------------------

        const json =
            JSON.stringify(
                takenData,
                null,
                4
            );

        const blob =
            new Blob(
                [json],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "taken.json";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        console.log(
            "Browser forensic data saved to taken.json"
        );
    },

    (error) => {

        console.error(
            "Error getting location:",
            error.message
        );

    },

    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
);
