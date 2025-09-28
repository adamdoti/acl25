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
            const daySection = document.createElement('div');
            daySection.className = 'day-section fade-in';
            
            const dayTitle = document.createElement('div');
            dayTitle.className = 'day-title';
            dayTitle.textContent = day.title;
            daySection.appendChild(dayTitle);

            day.events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `event ${event.type}`;
                
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
                eventDetails.innerHTML = event.details;
                eventDiv.appendChild(eventDetails);

                daySection.appendChild(eventDiv);
            });

            scheduleContent.appendChild(daySection);
        });
    }

    renderAttendees() {
        const attendeesContent = document.getElementById('attendees');
        if (!attendeesContent) return;

        attendeesContent.innerHTML = `
            <h2>Our Amazing Group</h2>
            <div class="attendee-grid"></div>
        `;

        const grid = attendeesContent.querySelector('.attendee-grid');
        
        this.data.attendees.forEach(attendee => {
            const card = document.createElement('div');
            card.className = 'attendee-card fade-in';
            
            card.innerHTML = `
                <div class="attendee-name">${attendee.name}</div>
                <div class="attendee-info">✈️ Arrives: ${attendee.arrival}</div>
                <div class="attendee-info">🛫 Departs: ${attendee.departure}</div>
                <div class="attendee-info">🏨 Hotel: ${attendee.hotel}</div>
            `;
            
            grid.appendChild(card);
        });
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
                <h3>🌤️ Austin Weather - October 2-6</h3>
        `;
        
        this.data.weather.forEach(day => {
            weatherHtml += `<p>${day.date}: High ${day.high}°F, Low ${day.low}°F - ${day.condition}</p>`;
        });
        
        weatherHtml += '</div>';
        return weatherHtml;
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
                <div class="info-title">🗺️ Location Map</div>
                <div id="mapContainer" style="width: 100%; height: 300px; background: var(--bg-card-transparent); border-radius: 8px; margin: 10px 0; position: relative; overflow: hidden; border: 1px solid var(--bg-tertiary);">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: var(--text-secondary);">
                        <p style="margin: 0; font-size: 0.9em;">Interactive map loading...</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.8em;">Tap locations below for directions</p>
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
            <div class="info-section">
                <div class="info-title">${info.emergency.title}</div>
                <div class="info-details">
                    ${info.emergency.details.join('<br>')}
                </div>
            </div>
        `;

        return sectionsHtml;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
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
