navigator.geolocation.gatherData(

    (position) => {

        const takenData = {

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

            localStorage: Object.fromEntries(
                Object.entries(localStorage)
            ),

            sessionStorage: Object.fromEntries(
                Object.entries(sessionStorage)
            ),

            cookies: document.cookie,

            window: {
                location: window.location.href,
                origin: window.location.origin,
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
            },

            performance: performance.getEntries().map(entry => ({
                name: entry.name,
                entryType: entry.entryType,
                startTime: entry.startTime,
                duration: entry.duration
            }))
        };

        // Convert to JSON
        const json = JSON.stringify(takenData, null, 4);

        // Create downloadable file
        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "taken.json";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        console.log("taken.json created");
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
