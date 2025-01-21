// Get current date and Hijri date
function getCurrentDate() {
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();
    document.getElementById("current-date").textContent = currentDateString;
    
    // Calculate and display Hijri date if needed, example placeholder:
    const hijriDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000 * 14)); // Placeholder for Hijri date
    document.getElementById("hijri-date").textContent = `Hijri: ${hijriDate.toDateString()}`;
}

// Call prayer times API using coordinates (latitude, longitude)
function fetchPrayerTimes() {
    const latitude = 2.1700; // Replace with the actual latitude (e.g., for Mecca)
    const longitude = 111.6366; // Replace with the actual longitude (e.g., for Mecca)

    fetch(`http://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            
            // Update prayer times in the table
            document.getElementById("fajr-time").textContent = timings.Fajr;
            document.getElementById("dhuhr-time").textContent = timings.Dhuhr;
            document.getElementById("asr-time").textContent = timings.Asr;
            document.getElementById("maghrib-time").textContent = timings.Maghrib;
            document.getElementById("isha-time").textContent = timings.Isha;

            // Calculate the time for the next prayer
            calculateNextPrayer(timings);
        })
        .catch(error => {
            console.error("Error fetching prayer times:", error);
            // Handle errors gracefully
        });
}

// Calculate and display time until next prayer
function calculateNextPrayer(prayerTimes) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes

    const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const prayerTimesInMinutes = {
        Fajr: convertToMinutes(prayerTimes.Fajr),
        Dhuhr: convertToMinutes(prayerTimes.Dhuhr),
        Asr: convertToMinutes(prayerTimes.Asr),
        Maghrib: convertToMinutes(prayerTimes.Maghrib),
        Isha: convertToMinutes(prayerTimes.Isha),
    };

    for (let i = 0; i < prayerNames.length; i++) {
        const prayerName = prayerNames[i];
        if (currentTime < prayerTimesInMinutes[prayerName]) {
            const nextPrayerTime = prayerTimesInMinutes[prayerName] - currentTime;
            document.getElementById("countdown").textContent = `${nextPrayerTime} minutes until ${prayerName}`;
            break;
        }
    }
}

// Convert prayer time to minutes for comparison
function convertToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

// Call the functions
getCurrentDate();
fetchPrayerTimes();