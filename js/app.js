// ACL 2025 - Modern JavaScript Application

class ACLApp {
    constructor() {
        this.data = null;
        this.currentTheme = localStorage.getItem('acl-theme') || 'dark';
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.initializeTheme();
            this.renderApp();
            this.setupEventListeners();
            this.showTab('schedule');
            this.initializeBackgroundRotation();
        } catch (error) {
            this.showError('Failed to load app data');
            console.error('Initialization error:', error);
        }
    }

    async loadData() {
        try {
            const response = await fetch('./data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    renderApp() {
        this.renderHeader();
        this.renderNavigation();
        this.renderSchedule();
        this.renderAttendees(); 
        this.renderLineup();
        this.renderInfo();
    }

    renderHeader() {
        const header = document.querySelector('.header h1');
        if (header) {
            header.textContent = this.data.tripInfo.title;
        }
    }

    renderNavigation() {
        // Navigation is already in HTML, just setup functionality
    }

    renderSchedule() {
        const scheduleContent = document.getElementById('schedule');
        if (!scheduleContent) return;

        scheduleContent.innerHTML = '';
        
        this.data.schedule.forEach(day => {
            const dayTitle = document.createElement('div');
            dayTitle.className = 'day-title fade-in';
            dayTitle.textContent = day.title;
            scheduleContent.appendChild(dayTitle);

            day.events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `event ${event.type} fade-in`;
                
                const eventTime = document.createElement('div');
                eventTime.className = 'event-time';
                eventTime.textContent = event.time;
                eventDiv.appendChild(eventTime);

                const eventTitle = document.createElement('div');
                eventTitle.className = 'event-title';
                eventTitle.innerHTML = event.title;
                eventDiv.appendChild(eventTitle);

                const eventDetails = document.createElement('div');
                eventDetails.className = 'event-details';
                
                // Wrap attendee names with card-names class
                let detailsHtml = event.details;
                if (detailsHtml.includes('<small')) {
                    detailsHtml = detailsHtml.replace(
                        /<small[^>]*>(.*?)<\/small>/g, 
                        '<div class="card-names">$1</div>'
                    );
                }
                
                eventDetails.innerHTML = detailsHtml;
                eventDiv.appendChild(eventDetails);

                scheduleContent.appendChild(eventDiv);
            });
        });
    }

    renderAttendees() {
        const attendeesContent = document.getElementById('attendees');
        if (!attendeesContent) return;

        attendeesContent.innerHTML = `
            <h2>Friends</h2>
            <div class="attendee-grid"></div>
        `;

        const grid = attendeesContent.querySelector('.attendee-grid');
        
        this.data.attendees.forEach(attendee => {
            const card = document.createElement('div');
            card.className = 'attendee-card fade-in';
            
            // Add ACL badge for Ash & Mandy
            const aclBadge = attendee.name === 'Ash & Mandy' ? 
                '<div class="acl-badge">ACL x 5</div>' : '';
            
            card.innerHTML = `
                <div class="attendee-name">${attendee.name}</div>
                <div class="attendee-info">✈️ Arrives: ${attendee.arrival}</div>
                <div class="attendee-info">🛫 Departs: ${attendee.departure}</div>
                <div class="attendee-info">🏨 Hotel: ${attendee.hotel}</div>
                ${aclBadge}
            `;
            
            grid.appendChild(card);
        });
    }

    renderLineup() {
        const lineupContent = document.getElementById('lineup');
        if (!lineupContent) return;

        lineupContent.innerHTML = `
            <h2>ACL 2025 Lineup</h2>
            ${this.renderLineupDays()}
        `;
    }

    renderLineupDays() {
        let lineupHtml = '';
        
        // Render each day
        ['friday', 'saturday', 'sunday'].forEach(day => {
            const dayData = this.data.lineup[day];
            
            lineupHtml += `
                <div class="lineup-day fade-in">
                    <div class="lineup-day-title">${dayData.title}</div>
                    
                    <div class="lineup-list">
                        ${dayData.headliners.map(artist => 
                            `<div class="lineup-item headliner-item">
                                <span class="artist-name headliner-name">${artist.name}</span>
                                <span class="artist-time">${artist.time}</span>
                            </div>`
                        ).join('')}
                        
                        ${dayData.artists.map(artist => 
                            `<div class="lineup-item">
                                <span class="artist-name">${artist.name}</span>
                                <span class="artist-time">${artist.time}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
        });
        
        lineupHtml += `
            <div class="lineup-note">
                <p><strong>Note:</strong> This lineup is based on available information and may be updated as official details are announced. Check <a href="https://aclfestival.com" target="_blank">aclfestival.com</a> for the most current lineup.</p>
            </div>
        `;
        
        return lineupHtml;
    }

    renderInfo() {
        const infoContent = document.getElementById('info');
        if (!infoContent) return;

        infoContent.innerHTML = `
            <h2>Important Info</h2>
            ${this.renderWeatherWidget()}
            ${this.renderInfoSections()}
        `;
    }

    renderWeatherWidget() {
        let weatherHtml = `
            <div class="weather-widget">
                <h3>🌤️ Austin Weather - Oct 2-6</h3>
                <div class="weather-forecast">
        `;
        
        this.data.weather.forEach(day => {
            const dayAbbr = day.date.split(' ')[0]; // Get abbreviated day (Thu, Fri, etc.)
            const weatherIcon = this.getWeatherIcon(day.condition);
            
            weatherHtml += `
                <div class="weather-day">
                    <div class="weather-day-name">${dayAbbr}</div>
                    <div class="weather-icon">${weatherIcon}</div>
                    <div class="weather-temps">
                        <span class="temp-high">${day.high}°</span>
                        <span class="temp-low">${day.low}°</span>
                    </div>
                </div>
            `;
        });
        
        weatherHtml += `
                </div>
            </div>
        `;
        return weatherHtml;
    }

    getWeatherIcon(condition) {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('sunny')) return '☀️';
        if (conditionLower.includes('partly cloudy')) return '⛅';
        if (conditionLower.includes('cloudy')) return '☁️';
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('storm')) return '⛈️';
        if (conditionLower.includes('clear')) return '🌤️';
        return '🌤️'; // Default
    }

    renderInfoSections() {
        const info = this.data.info;
        let sectionsHtml = '';

        // Festival Info
        sectionsHtml += `
            <div class="info-section" style="border-left: 3px solid var(--accent-blue);">
                <div class="info-title">${info.festival.title}</div>
                <div class="info-details">
                    ${info.festival.details.join('<br>')}
                </div>
            </div>
        `;

        // GA Plus Benefits
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">${info.gaPlus.title}</div>
                <div class="info-details">
                    ${info.gaPlus.details.join('<br>')}
                </div>
            </div>
        `;

        // Accommodations
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">${info.accommodations.title}</div>
                <div class="info-details">
        `;
        info.accommodations.hotels.forEach(hotel => {
            sectionsHtml += `
                <strong>${hotel.name}</strong><br>
                <a href="${hotel.link}" target="_blank">${hotel.address}</a><br><br>
            `;
        });
        sectionsHtml += '</div></div>';

        // Map Container
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">🗺️ Austin Area Map</div>
                <div class="map-container">
                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=30.2672,-97.7431&zoom=11&size=800x500&maptype=roadmap&markers=color:red%7Clabel:L%7C30.2644,-97.7361&markers=color:red%7Clabel:F%7C30.2654,-97.7397&markers=color:blue%7Clabel:Z%7C30.2672,-97.7731&markers=color:green%7Clabel:1%7C30.2638,-97.7480&markers=color:green%7Clabel:2%7C30.3916,-97.8547&markers=color:green%7Clabel:3%7C30.2518,-97.8008&markers=color:orange%7Clabel:S%7C30.1575,-97.8431&markers=color:purple%7Clabel:D%7C30.2500,-97.7500&style=feature:poi%7Cvisibility:on&style=feature:transit%7Cvisibility:on&style=feature:road%7Cvisibility:on" alt="Austin Area Map with ACL Trip Locations" class="static-map" />
                    <div class="map-legend">
                        <small>🏨 Red: Hotels (L=LINE, F=Fairfield) | 🎵 Blue: ACL/Zilker (Z) | 🍽️ Green: Restaurants (1=Lamberts, 2=Quince, 3=Jacoby's) | 🍖 Orange: Salt Lick (S) | 🎉 Purple: Disco Lines (D)</small>
                    </div>
                </div>
            </div>
        `;

        // Key Locations
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">📍 Key Locations</div>
                <div class="info-details">
        `;
        info.locations.forEach(location => {
            sectionsHtml += `📌 <strong>${location.name}</strong> - <a href="${location.link}" target="_blank">${location.address}</a><br>`;
        });
        sectionsHtml += '</div></div>';

        // Walking Times
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">${info.walkingTimes.fromLine.title}</div>
                <div class="info-details">
                    ${info.walkingTimes.fromLine.times.join('<br>')}
                </div>
            </div>
        `;

        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">${info.walkingTimes.fromFairfield.title}</div>
                <div class="info-details">
                    ${info.walkingTimes.fromFairfield.times.join('<br>')}
                </div>
            </div>
        `;

        // Transportation
        sectionsHtml += `
            <div class="info-section">
                <div class="info-title">${info.transportation.title}</div>
                <div class="info-details">
                    ${info.transportation.details.join('<br>')}
                </div>
            </div>
        `;

        // Emergency Contacts
        sectionsHtml += `
            
        `;

        return sectionsHtml;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle-btn');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            console.log('Theme toggle event listener attached');
        } else {
            console.error('Theme toggle button not found');
        }

        // Tab navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                if (tabName) {
                    this.showTab(tabName);
                }
            });
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        if (newTheme === 'light') {
            body.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light';
        } else {
            body.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark';
        }
        
        // Save theme preference
        localStorage.setItem('acl-theme', newTheme);
        this.currentTheme = newTheme;
    }

    initializeTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        
        if (this.currentTheme === 'light') {
            body.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light';
        } else {
            body.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark';
        }
    }

    showTab(tabName) {
        // Hide all tab contents
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.remove('active'));
        
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Show selected tab content
        const targetContent = document.getElementById(tabName);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Add active class to clicked tab
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    showError(message) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <h2>Error</h2>
                    <p>${message}</p>
                    <p>Please check the console for more details.</p>
                </div>
            `;
        }
    }

    showLoading() {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <h2>Loading ACL 2025...</h2>
                    <p>Please wait while we load your trip information.</p>
                </div>
            `;
        }
    }

    initializeBackgroundRotation() {
        // Set initial background
        this.updateHeaderBackground();
        
        // Update every hour (3600000 ms)
        setInterval(() => {
            this.updateHeaderBackground();
        }, 3600000);
        
        // Also update every minute for testing (can be removed later)
        // setInterval(() => {
        //     this.updateHeaderBackground();
        // }, 60000);
    }

    updateHeaderBackground() {
        const header = document.getElementById('aclheader');
        if (!header) return;

        const now = new Date();
        const hour = now.getHours();
        
        let backgroundImage = '';
        
        // Time-based background selection
        if (hour >= 6 && hour < 17) {
            // Morning/Day: 6 AM to 5 PM
            backgroundImage = './images/austin-morning.jpg';
        } else if (hour >= 17 && hour < 20) {
            // Sunset: 5 PM to 8 PM
            backgroundImage = './images/austin-sunset.jpg';
        } else {
            // Night: 8 PM to 6 AM
            backgroundImage = './images/austin-night.jpg';
        }
        
        header.style.backgroundImage = `url('${backgroundImage}')`;
        
        console.log(`Background updated for ${hour}:00 - Using: ${backgroundImage}`);
    }

}

// Legacy function support for inline onclick handlers
function showTab(tabName) {
    if (window.aclApp) {
        window.aclApp.showTab(tabName);
    }
}

function toggleTheme() {
    if (window.aclApp) {
        window.aclApp.toggleTheme();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aclApp = new ACLApp();
});
