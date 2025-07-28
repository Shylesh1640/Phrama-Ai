// Application State
let currentUser = null;
let currentOrg = null;
let selectedRating = 0;
let environmentChart = null;
let chatMessages = [];

// Application Data
const appData = {
  organizations: [
    {
      id: "org_001",
      name: "City General Hospital",
      type: "hospital",
      email: "admin@citygeneral.com",
      location: "New York, NY",
      established: "1985",
      size: "500+ beds"
    },
    {
      id: "org_002", 
      name: "MedSupply Pharmacy Chain",
      type: "pharmacy",
      email: "manager@medsupply.com",
      location: "California, CA",
      established: "2010",
      branches: "50+ locations"
    }
  ],
  demo_credentials: [
    {
      email: "admin@citygeneral.com",
      password: "admin123",
      org_type: "hospital",
      role: "administrator",
      name: "Dr. Sarah Johnson"
    },
    {
      email: "manager@medsupply.com", 
      password: "admin123",
      org_type: "pharmacy",
      role: "manager",
      name: "Mark Williams"
    }
  ],
  medicines: [
    {
      name: "Paracetamol",
      generic: "Acetaminophen",
      strength: "500mg",
      manufacturer: "Johnson & Johnson",
      batch: "B2025-001",
      trust_score: 94.5,
      verifications: 1250,
      org_id: "org_001"
    },
    {
      name: "Aspirin",
      generic: "Acetylsalicylic Acid", 
      strength: "325mg",
      manufacturer: "Bayer",
      batch: "B2025-002",
      trust_score: 96.8,
      verifications: 890,
      org_id: "org_002"
    },
    {
      name: "Amoxicillin",
      generic: "Amoxicillin",
      strength: "250mg",
      manufacturer: "Pfizer",
      batch: "B2025-003",
      trust_score: 92.3,
      verifications: 1100,
      org_id: "org_001"
    }
  ],
  sensor_data: [
    {
      id: "sensor_001",
      org_id: "org_001",
      location: "Storage Room A",
      temperature: 22.5,
      humidity: 45,
      light: 150,
      status: "optimal"
    },
    {
      id: "sensor_002",
      org_id: "org_001", 
      location: "Cold Storage",
      temperature: 4.2,
      humidity: 38,
      light: 0,
      status: "optimal"
    },
    {
      id: "sensor_003",
      org_id: "org_002",
      location: "Pharmacy Counter",
      temperature: 24.1,
      humidity: 52,
      light: 300,
      status: "warning"
    }
  ],
  historical_data: {
    temperature: [22, 22.5, 23, 22.8, 22.5, 22.2, 22.5, 22.7, 22.3, 22.5],
    humidity: [42, 45, 47, 46, 45, 44, 45, 46, 44, 45],
    timestamps: ["20:00", "20:10", "20:20", "20:30", "20:40", "20:50", "21:00", "21:10", "21:20", "21:30"]
  },
  navigation_pages: [
    {"name": "Dashboard", "url": "#dashboard", "icon": "🏠"},
    {"name": "AI Inspection", "url": "#ai-inspection", "icon": "🔍"},
    {"name": "IoT Sensors", "url": "#iot-sensors", "icon": "📊"},
    {"name": "Trust Network", "url": "#trust-network", "icon": "🤝"},
    {"name": "AI Chatbot", "url": "#chatbot", "icon": "💬"},
    {"name": "Profile", "url": "#profile", "icon": "👤"}
  ],
  verification_history: [],
  community_feedback: [],
  recent_activity: []
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Pharma AI Platform...');
  initializeApp();
});

function initializeApp() {
  // Check authentication status
  checkAuthStatus();
  
  // Setup routing
  setupRouting();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize chat
  initializeChat();
  
  console.log('Application initialized successfully');
}

function checkAuthStatus() {
  // Check if user is logged in
  const savedUser = localStorage.getItem('pharmaAI_currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      const org = appData.organizations.find(o => o.email === currentUser.email);
      if (org) {
        currentOrg = org;
        showAuthenticatedApp();
        return;
      }
    } catch (error) {
      console.error('Error parsing saved user data:', error);
      localStorage.removeItem('pharmaAI_currentUser');
    }
  }
  
  showLoginPage();
}

function showLoginPage() {
  console.log('Showing login page');
  hideAllPages();
  document.getElementById('loginPage').classList.add('active');
  window.location.hash = '';
}

function showAuthenticatedApp() {
  console.log('Showing authenticated app');
  hideAllPages();
  
  // Update user display across all pages
  const userDisplays = document.querySelectorAll('[id^="userNameDisplay"]');
  const orgDisplays = document.querySelectorAll('[id^="orgNameDisplay"]');
  
  userDisplays.forEach(el => {
    if (el) el.textContent = currentUser.name;
  });
  
  orgDisplays.forEach(el => {
    if (el) el.textContent = currentOrg.name;
  });
  
  // Navigate to dashboard if no hash
  if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#login') {
    window.location.hash = '#dashboard';
  } else {
    handleRoute();
  }
}

function hideAllPages() {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
}

function setupRouting() {
  window.addEventListener('hashchange', handleRoute);
  
  // Setup navigation links
  document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
      const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
      e.preventDefault();
      const hash = link.getAttribute('href');
      if (hash && hash !== '#') {
        window.location.hash = hash;
      }
    }
  });
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  
  console.log('Handling route:', hash);
  
  if (!currentUser && hash !== 'login') {
    showLoginPage();
    return;
  }
  
  // Update active navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + hash) {
      link.classList.add('active');
    }
  });
  
  // Show appropriate page
  hideAllPages();
  
  switch(hash) {
    case 'dashboard':
      showDashboardPage();
      break;
    case 'ai-inspection':
      showAIInspectionPage();
      break;
    case 'iot-sensors':
      showIoTSensorsPage();
      break;
    case 'trust-network':
      showTrustNetworkPage();
      break;
    case 'chatbot':
      showChatbotPage();
      break;
    case 'profile':
      showProfilePage();
      break;
    case 'login':
    case '':
      if (currentUser) {
        window.location.hash = '#dashboard';
      } else {
        showLoginPage();
      }
      break;
    default:
      if (currentUser) {
        showDashboardPage();
        window.location.hash = '#dashboard';
      } else {
        showLoginPage();
      }
  }
}

function navigateToPage(page) {
  window.location.hash = '#' + page;
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Login form submitted');
      handleLogin(e);
    });
  }
  
  // Logout buttons
  const logoutBtns = document.querySelectorAll('#logoutBtn, [onclick="handleLogout()"]');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  });
  
  // File upload
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (fileInput) fileInput.click();
    });
  }
  
  if (uploadArea) {
    uploadArea.addEventListener('click', function(e) {
      e.preventDefault();
      if (fileInput) fileInput.click();
    });
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
  
  // Sensor controls
  const refreshSensors = document.getElementById('refreshSensors');
  const exportData = document.getElementById('exportData');
  
  if (refreshSensors) refreshSensors.addEventListener('click', refreshSensorData);
  if (exportData) exportData.addEventListener('click', exportSensorData);
  
  // Feedback
  const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
  const closeFeedbackModal = document.getElementById('closeFeedbackModal');
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (submitFeedbackBtn) submitFeedbackBtn.addEventListener('click', openFeedbackModal);
  if (closeFeedbackModal) closeFeedbackModal.addEventListener('click', closeFeedbackModal);
  if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  
  // Chat
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatUploadBtn = document.getElementById('chatUploadBtn');
  const chatFileInput = document.getElementById('chatFileInput');
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
  
  if (chatUploadBtn) {
    chatUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (chatFileInput) chatFileInput.click();
    });
  }
  
  if (chatFileInput) chatFileInput.addEventListener('change', handleChatImageUpload);
  
  // Quick actions
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      handleQuickAction(e.target.dataset.action);
    });
  });
  
  // Profile settings
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const addUserBtn = document.getElementById('addUserBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const backupDataBtn = document.getElementById('backupDataBtn');
  
  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
  if (editProfileBtn) editProfileBtn.addEventListener('click', editProfile);
  if (addUserBtn) addUserBtn.addEventListener('click', addUser);
  if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
  if (importDataBtn) importDataBtn.addEventListener('click', importData);
  if (backupDataBtn) backupDataBtn.addEventListener('click', backupData);
  
  // Rating system
  setupRatingSystem();
  
  // Modal click outside to close
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
  
  // Notification close
  const closeNotification = document.getElementById('closeNotification');
  if (closeNotification) closeNotification.addEventListener('click', closeNotificationHandler);
  
  console.log('Event listeners setup complete');
}

function handleLogin(e) {
  e.preventDefault();
  console.log('Handling login...');
  
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  
  if (!emailInput || !passwordInput) {
    console.error('Login form inputs not found');
    showNotification('Login form error', 'error');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Attempting login with email:', email);
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Find user in demo credentials
  const user = appData.demo_credentials.find(u => 
    u.email === email && u.password === password
  );
  
  if (user) {
    console.log('User found:', user);
    currentUser = user;
    const org = appData.organizations.find(o => o.email === email);
    if (org) {
      currentOrg = org;
      localStorage.setItem('pharmaAI_currentUser', JSON.stringify(user));
      showNotification('Login successful!', 'success');
      showAuthenticatedApp();
    } else {
      showNotification('Organization not found', 'error');
    }
  } else {
    console.log('Invalid credentials for:', email);
    showNotification('Invalid email or password', 'error');
  }
}

function handleLogout() {
  console.log('Handling logout...');
  currentUser = null;
  currentOrg = null;
  localStorage.removeItem('pharmaAI_currentUser');
  showNotification('Logged out successfully', 'success');
  showLoginPage();
}

// Page Display Functions
function showDashboardPage() {
  console.log('Showing dashboard page');
  document.getElementById('dashboardPage').classList.add('active');
  populateDashboard();
}

function showAIInspectionPage() {
  console.log('Showing AI inspection page');
  document.getElementById('aiInspectionPage').classList.add('active');
  populateVerificationHistory();
}

function showIoTSensorsPage() {
  console.log('Showing IoT sensors page');
  document.getElementById('iotSensorsPage').classList.add('active');
  populateSensors();
  setTimeout(() => {
    initializeChart();
  }, 100);
  populateAlerts();
}

function showTrustNetworkPage() {
  console.log('Showing trust network page');
  document.getElementById('trustNetworkPage').classList.add('active');
  populateTrustNetwork();
}

function showChatbotPage() {
  console.log('Showing chatbot page');
  document.getElementById('chatbotPage').classList.add('active');
  populateChat();
}

function showProfilePage() {
  console.log('Showing profile page');
  document.getElementById('profilePage').classList.add('active');
  populateProfile();
}

// Dashboard Functions
function populateDashboard() {
  if (!currentOrg) return;
  
  console.log('Populating dashboard for org:', currentOrg.name);
  
  // Get organization-specific data
  const orgMedicines = appData.medicines.filter(med => med.org_id === currentOrg.id);
  const orgSensors = appData.sensor_data.filter(sensor => sensor.org_id === currentOrg.id);
  
  // Update stats
  const totalMedicinesEl = document.getElementById('totalMedicines');
  const avgTrustScoreEl = document.getElementById('avgTrustScore');
  const totalFeedbackEl = document.getElementById('totalFeedback');
  const activeSensorsEl = document.getElementById('activeSensors');
  
  if (totalMedicinesEl) totalMedicinesEl.textContent = orgMedicines.length;
  if (avgTrustScoreEl) {
    avgTrustScoreEl.textContent = orgMedicines.length > 0 ? 
      (orgMedicines.reduce((sum, med) => sum + med.trust_score, 0) / orgMedicines.length).toFixed(1) : 
      '0';
  }
  if (totalFeedbackEl) totalFeedbackEl.textContent = appData.community_feedback.length;
  if (activeSensorsEl) activeSensorsEl.textContent = orgSensors.length;
  
  // Populate recent activity
  populateRecentActivity();
}

function populateRecentActivity() {
  const activityList = document.getElementById('recentActivityList');
  if (!activityList) return;
  
  const activities = [
    { type: 'verification', message: 'Medicine verification completed for Paracetamol 500mg', time: '2 hours ago' },
    { type: 'sensor', message: 'Temperature alert resolved in Storage Room A', time: '4 hours ago' },
    { type: 'feedback', message: 'New community feedback received', time: '6 hours ago' },
    { type: 'trust', message: 'Trust score updated for Aspirin 325mg', time: '8 hours ago' }
  ];
  
  activityList.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-content">
        <p>${activity.message}</p>
        <small class="text-secondary">${activity.time}</small>
      </div>
    </div>
  `).join('');
}

// AI Inspection Functions
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showNotification('Please select a valid image file', 'error');
    return;
  }
  
  showLoadingState();
  
  // Simulate AI analysis
  setTimeout(() => {
    simulateAIAnalysis(file);
  }, 3000);
}

function showLoadingState() {
  const analysisContent = document.getElementById('analysisContent');
  if (!analysisContent) return;
  
  analysisContent.innerHTML = `
    <div class="loading-state">
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
        <p><strong>Analyzing image...</strong></p>
        <p class="text-secondary">AI is processing the medicine photo using computer vision</p>
      </div>
    </div>
  `;
}

function simulateAIAnalysis(file) {
  const analysisContent = document.getElementById('analysisContent');
  if (!analysisContent) return;
  
  // Generate random analysis results
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100
  const scoreClass = confidence >= 90 ? 'high' : confidence >= 70 ? 'medium' : 'low';
  
  const analysis = {
    confidence: confidence,
    medicine: 'Paracetamol 500mg',
    findings: {
      packaging: confidence > 85 ? 'Excellent' : 'Good',
      labeling: confidence > 80 ? 'Perfect' : 'Minor Issues', 
      color: confidence > 75 ? 'Matching' : 'Slight Variation',
      batch: confidence > 85 ? 'Verified' : 'Needs Review',
      expiry: 'Valid'
    }
  };
  
  analysisContent.innerHTML = `
    <div class="analysis-result">
      <h4>AI Analysis Complete</h4>
      <div class="analysis-score">
        <div class="score-circle ${scoreClass}">${confidence}%</div>
        <div>
          <h5>Authenticity Score</h5>
          <p class="text-secondary">Based on visual inspection</p>
        </div>
      </div>
      <ul class="analysis-details">
        <li><span>Packaging Quality</span><span>${analysis.findings.packaging}</span></li>
        <li><span>Label Alignment</span><span>${analysis.findings.labeling}</span></li>
        <li><span>Color Consistency</span><span>${analysis.findings.color}</span></li>
        <li><span>Batch Code</span><span>${analysis.findings.batch}</span></li>
        <li><span>Expiry Date</span><span>${analysis.findings.expiry}</span></li>
      </ul>
      ${confidence < 80 ? '<div class="status status--warning" style="margin-top: 1rem;">Manual review recommended</div>' : ''}
    </div>
  `;
  
  // Add to verification history
  appData.verification_history.unshift({
    id: Date.now(),
    medicine: analysis.medicine,
    confidence: confidence,
    timestamp: new Date().toISOString(),
    status: confidence >= 80 ? 'verified' : 'needs_review'
  });
  
  populateVerificationHistory();
  showNotification('Image analysis completed successfully!', 'success');
}

function populateVerificationHistory() {
  const historyList = document.getElementById('verificationHistory');
  if (!historyList) return;
  
  if (appData.verification_history.length === 0) {
    historyList.innerHTML = '<p class="text-secondary">No verification history yet. Upload images to get started.</p>';
    return;
  }
  
  historyList.innerHTML = appData.verification_history.map(item => `
    <div class="history-item">
      <div class="history-content">
        <h5>${item.medicine}</h5>
        <p>Confidence: ${item.confidence}%</p>
        <small class="text-secondary">${new Date(item.timestamp).toLocaleString()}</small>
      </div>
      <div class="history-status">
        <span class="status status--${item.status === 'verified' ? 'success' : 'warning'}">${item.status}</span>
      </div>
    </div>
  `).join('');
}

// IoT Sensors Functions
function populateSensors() {
  if (!currentOrg) return;
  
  const sensorsGrid = document.getElementById('sensorsGrid');
  if (!sensorsGrid) return;
  
  const orgSensors = appData.sensor_data.filter(sensor => sensor.org_id === currentOrg.id);
  
  if (orgSensors.length === 0) {
    sensorsGrid.innerHTML = '<p class="text-secondary">No sensors configured for your organization.</p>';
    return;
  }
  
  sensorsGrid.innerHTML = orgSensors.map(sensor => `
    <div class="sensor-card">
      <div class="sensor-header">
        <h4 class="sensor-name">${sensor.location}</h4>
        <span class="sensor-status ${sensor.status}">${sensor.status}</span>
      </div>
      <div class="sensor-readings">
        <div class="reading">
          <div class="reading-value">${sensor.temperature.toFixed(1)}<span class="reading-unit">°C</span></div>
          <div class="reading-label">Temperature</div>
        </div>
        <div class="reading">
          <div class="reading-value">${Math.round(sensor.humidity)}<span class="reading-unit">%</span></div>
          <div class="reading-label">Humidity</div>
        </div>
        <div class="reading">
          <div class="reading-value">${Math.round(sensor.light)}<span class="reading-unit">lx</span></div>
          <div class="reading-label">Light</div>
        </div>
      </div>
      <div class="last-reading">Last reading: ${new Date().toLocaleTimeString()}</div>
    </div>
  `).join('');
}

function initializeChart() {
  const chartCanvas = document.getElementById('environmentChart');
  if (!chartCanvas) return;
  
  // Destroy existing chart if it exists
  if (environmentChart) {
    environmentChart.destroy();
  }
  
  try {
    const ctx = chartCanvas.getContext('2d');
    
    environmentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: appData.historical_data.timestamps,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: appData.historical_data.temperature,
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: 'Humidity (%)',
            data: appData.historical_data.humidity,
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)',
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left'
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
}

function populateAlerts() {
  const alertsList = document.getElementById('alertsList');
  if (!alertsList) return;
  
  const alerts = [
    { type: 'warning', message: 'Temperature slightly elevated in Pharmacy Counter', time: '1 hour ago' },
    { type: 'info', message: 'Humidity levels optimal across all sensors', time: '2 hours ago' },
    { type: 'success', message: 'All environmental parameters within normal range', time: '4 hours ago' }
  ];
  
  alertsList.innerHTML = alerts.map(alert => `
    <div class="alert-item">
      <div class="alert-content">
        <span class="status status--${alert.type}">${alert.type}</span>
        <p>${alert.message}</p>
        <small class="text-secondary">${alert.time}</small>
      </div>
    </div>
  `).join('');
}

function refreshSensorData() {
  // Simulate refreshing sensor data
  appData.sensor_data.forEach(sensor => {
    sensor.temperature += (Math.random() - 0.5) * 2;
    sensor.humidity += (Math.random() - 0.5) * 5;
    sensor.light += (Math.random() - 0.5) * 50;
  });
  
  populateSensors();
  showNotification('Sensor data refreshed successfully!', 'success');
}

function exportSensorData() {
  showNotification('Sensor data exported to CSV!', 'success');
}

// Trust Network Functions
function populateTrustNetwork() {
  // Update trust score metrics
  const totalReviewsEl = document.getElementById('totalReviews');
  const partnerOrgsEl = document.getElementById('partnerOrgs');
  const verifiedMedicinesEl = document.getElementById('verifiedMedicines');
  
  if (totalReviewsEl) totalReviewsEl.textContent = appData.community_feedback.length;
  if (partnerOrgsEl) partnerOrgsEl.textContent = appData.organizations.length;
  if (verifiedMedicinesEl) verifiedMedicinesEl.textContent = appData.medicines.length;
  
  // Populate medicine trust scores
  populateMedicinesTrust();
  
  // Populate community feedback
  populateCommunityFeedback();
}

function populateMedicinesTrust() {
  const medicinesList = document.getElementById('medicinesTrustList');
  if (!medicinesList) return;
  
  medicinesList.innerHTML = appData.medicines.map(medicine => `
    <div class="medicine-trust-item">
      <div class="medicine-info">
        <h5>${medicine.name}</h5>
        <p>${medicine.manufacturer} - ${medicine.batch}</p>
      </div>
      <div class="trust-score">
        <span class="score">${medicine.trust_score}</span>
        <span class="stars">${'★'.repeat(Math.floor(medicine.trust_score / 20))}</span>
      </div>
    </div>
  `).join('');
}

function populateCommunityFeedback() {
  const feedbackList = document.getElementById('communityFeedbackList');
  if (!feedbackList) return;
  
  if (appData.community_feedback.length === 0) {
    feedbackList.innerHTML = '<p class="text-secondary">No community feedback yet. Be the first to submit feedback!</p>';
    return;
  }
  
  feedbackList.innerHTML = appData.community_feedback.map(feedback => `
    <div class="feedback-item">
      <div class="feedback-header">
        <h5>${feedback.medicine}</h5>
        <span class="rating">${'★'.repeat(feedback.rating)}</span>
      </div>
      <p>${feedback.comment}</p>
      <small class="text-secondary">By ${feedback.organization} - ${feedback.time}</small>
    </div>
  `).join('');
}

function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (!modal) return;
  
  // Populate medicine select
  const medicineSelect = document.getElementById('medicineSelect');
  if (medicineSelect) {
    medicineSelect.innerHTML = '<option value="">Select Medicine</option>' +
      appData.medicines.map(med => `<option value="${med.name}">${med.name} - ${med.strength}</option>`).join('');
  }
  
  modal.classList.remove('hidden');
}

function closeFeedbackModalHandler() {
  const modal = document.getElementById('feedbackModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  const medicine = document.getElementById('medicineSelect').value;
  const rating = selectedRating;
  const comment = document.getElementById('feedbackComment').value;
  
  if (!medicine || !rating || !comment) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Add feedback to data
  appData.community_feedback.push({
    medicine: medicine,
    rating: rating,
    comment: comment,
    organization: currentOrg.name,
    time: new Date().toLocaleDateString()
  });
  
  showNotification('Feedback submitted successfully!', 'success');
  closeFeedbackModalHandler();
  
  // Reset form
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) feedbackForm.reset();
  selectedRating = 0;
  updateStarRating(0);
  
  // Refresh trust network display
  populateTrustNetwork();
}

// Chat Functions
function initializeChat() {
  chatMessages = [
    {
      type: 'ai',
      content: "Hello! I'm your AI medicine verification assistant. I can help you analyze medicine authenticity, provide safety information, and answer questions about pharmaceutical verification. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ];
}

function populateChat() {
  const chatMessagesContainer = document.getElementById('chatMessages');
  if (!chatMessagesContainer) return;
  
  chatMessagesContainer.innerHTML = chatMessages.map(message => `
    <div class="message ${message.type}-message">
      <div class="message-avatar">${message.type === 'ai' ? '🤖' : '👤'}</div>
      <div class="message-content">
        <p>${message.content}</p>
      </div>
    </div>
  `).join('');
  
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  if (!chatInput || !chatInput.value.trim()) return;
  
  const message = chatInput.value.trim();
  chatInput.value = '';
  
  // Add user message
  chatMessages.push({
    type: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });
  
  // Generate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    chatMessages.push({
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    });
    populateChat();
  }, 1000);
  
  populateChat();
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('verify') || lowerMessage.includes('authentic')) {
    return "I can help you verify medicine authenticity! Please upload an image of your medicine using the upload button, and I'll analyze it for you using advanced computer vision technology.";
  } else if (lowerMessage.includes('safety') || lowerMessage.includes('safe')) {
    return "For medicine safety, I recommend: 1) Check expiration dates, 2) Verify packaging integrity, 3) Ensure proper storage conditions, 4) Validate manufacturer information. Would you like me to analyze a specific medicine image?";
  } else if (lowerMessage.includes('side effects')) {
    return "I can provide general safety information, but for specific side effects, please consult with a healthcare professional or pharmacist. They can give you personalized advice based on your medical history.";
  } else if (lowerMessage.includes('help')) {
    return "I can assist you with: • Medicine image analysis and verification • Safety information and guidelines • Authenticity checking • Storage recommendations • General pharmaceutical questions. What would you like help with?";
  } else {
    return "I understand you're asking about medicine verification. I'm here to help with authenticity checks, safety information, and pharmaceutical guidance. You can upload medicine images for analysis or ask me specific questions about drug safety and verification.";
  }
}

function handleChatImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showNotification('Please select a valid image file', 'error');
    return;
  }
  
  // Add user message with image info
  chatMessages.push({
    type: 'user',
    content: `Uploaded image: ${file.name}`,
    timestamp: new Date().toISOString()
  });
  
  // Simulate AI image analysis
  setTimeout(() => {
    const analysisResponse = `🔍 **Image Analysis Complete**

I've analyzed your medicine image and here are my findings:

**Medicine Identified:** Paracetamol 500mg
**Confidence Score:** 94%
**Authenticity:** Likely genuine

**Visual Analysis:**
• Shape: Round tablet ✓
• Color: White, consistent ✓ 
• Markings: Clear embossing ✓
• Size: Standard 12mm diameter ✓

**Recommendation:** This medicine appears to be authentic based on visual analysis. All packaging and physical characteristics match expected standards.

Would you like me to generate a detailed verification report?`;

    chatMessages.push({
      type: 'ai',
      content: analysisResponse,
      timestamp: new Date().toISOString()
    });
    populateChat();
  }, 2000);
  
  populateChat();
  e.target.value = ''; // Reset file input
}

function handleQuickAction(action) {
  const responses = {
    'verify': 'Please upload an image of your medicine for quick verification. I\'ll analyze it using computer vision technology and provide an authenticity assessment.',
    'safety': 'For a comprehensive safety check, please tell me: 1) Medicine name, 2) Expiration date, 3) Storage conditions, 4) Any visible damage. Or upload an image for automated analysis.',
    'identify': 'I can help identify medicines from images! Upload a clear photo of the medicine, including any packaging or markings, and I\'ll do my best to identify it.',
    'report': 'I can generate detailed verification reports after analyzing your medicine. Upload an image to get started, and I\'ll provide a comprehensive analysis report.'
  };
  
  const response = responses[action] || 'How can I help you with medicine verification today?';
  
  chatMessages.push({
    type: 'ai',
    content: response,
    timestamp: new Date().toISOString()
  });
  
  populateChat();
}

// Profile Functions
function populateProfile() {
  if (!currentOrg) return;
  
  const profileDisplay = document.getElementById('orgProfileDisplay');
  if (profileDisplay) {
    profileDisplay.innerHTML = `
      <div class="profile-item">
        <span class="profile-label">Organization Name</span>
        <span class="profile-value">${currentOrg.name}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Type</span>
        <span class="profile-value">${currentOrg.type}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Location</span>
        <span class="profile-value">${currentOrg.location}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Email</span>
        <span class="profile-value">${currentOrg.email}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Established</span>
        <span class="profile-value">${currentOrg.established}</span>
      </div>
    `;
  }
  
  // Populate team members
  const teamList = document.getElementById('teamMembersList');
  if (teamList) {
    teamList.innerHTML = `
      <div class="team-member">
        <div class="member-info">
          <h5>${currentUser.name}</h5>
          <p>${currentUser.role} • ${currentUser.email}</p>
        </div>
        <span class="status status--success">Active</span>
      </div>
    `;
  }
}

// Utility Functions
function setupRatingSystem() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.dataset.rating);
      const selectedRatingInput = document.getElementById('selectedRating');
      if (selectedRatingInput) selectedRatingInput.value = selectedRating;
      updateStarRating(selectedRating);
    });
  });
}

function updateStarRating(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function saveSettings() {
  showNotification('Settings saved successfully!', 'success');
}

function editProfile() {
  showNotification('Profile editing feature coming soon!', 'info');
}

function addUser() {
  showNotification('User management feature coming soon!', 'info');
}

function exportData() {
  showNotification('Data exported successfully!', 'success');
}

function importData() {
  showNotification('Data import feature coming soon!', 'info');
}

function backupData() {
  showNotification('Database backup created!', 'success');
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageElement = document.getElementById('notificationMessage');
  
  if (!notification || !messageElement) {
    console.log('Notification:', message);
    return;
  }
  
  messageElement.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    closeNotificationHandler();
  }, 4000);
}

function closeNotificationHandler() {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.classList.add('hidden');
  }
}