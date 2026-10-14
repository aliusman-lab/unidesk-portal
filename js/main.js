/**
 * UpGradely / Smart Campus Portal - Core Interactive Logic
 * Handles Theme Toggle, Navigation, Profile Store, Quick Task Creation,
 * Interactive Attendance Matrix, Schedule Filters, and Toast Feedback System.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Default: Light Mode matching reference screenshot)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'upgradely_portal_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = savedTheme ? savedTheme : 'light';
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcons(theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateThemeToggleIcons(nextTheme);

    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  }

  function updateThemeToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      } else {
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Student Profile Global State Sync
  // --------------------------------------------------------------------------
  const PROFILE_STORAGE_KEY = 'unidesk_student_profile';

  const defaultProfile = {
    fullName: 'Ali Usman',
    regNumber: 'FA24-BCS-042',
    email: 'ali.usman@campus.edu.pk',
    department: 'Computer Science',
    semester: '5th Semester',
    phone: '+92 300 1234567',
    cgpa: '4.7',
    onTimeRate: '96%',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  };

  function getStudentProfile() {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading student profile', e);
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  function setStudentProfile(data) {
    const updated = { ...getStudentProfile(), ...data };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    syncHeaderProfile();
    return updated;
  }

  function syncHeaderProfile() {
    const profile = getStudentProfile();

    // Update names in top bar & summary cards
    const topNameEl = document.getElementById('topStudentName');
    if (topNameEl) topNameEl.textContent = profile.fullName;

    const avatarImg = document.getElementById('topAvatarImg');
    if (avatarImg) avatarImg.src = profile.avatarUrl;

    const summaryNameEl = document.getElementById('summaryFullName');
    if (summaryNameEl) summaryNameEl.textContent = profile.fullName;

    const summaryRegEl = document.getElementById('summaryRegNumber');
    if (summaryRegEl) summaryRegEl.textContent = profile.regNumber;

    const summaryEmailEl = document.getElementById('summaryEmail');
    if (summaryEmailEl) summaryEmailEl.textContent = profile.email;

    const summaryPhoneEl = document.getElementById('summaryPhone');
    if (summaryPhoneEl) summaryPhoneEl.textContent = profile.phone;

    const summaryDeptEl = document.getElementById('summaryDeptText');
    if (summaryDeptEl) summaryDeptEl.textContent = `Department of ${profile.department}`;

    const summarySemEl = document.getElementById('summarySemester');
    if (summarySemEl) summarySemEl.textContent = profile.semester;

    // Populate inputs if on profile page
    const nameInput = document.getElementById('fullNameInput');
    if (nameInput) nameInput.value = profile.fullName;

    const regInput = document.getElementById('regNumberInput');
    if (regInput) regInput.value = profile.regNumber;

    const emailInput = document.getElementById('emailInput');
    if (emailInput) emailInput.value = profile.email;

    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) phoneInput.value = profile.phone;
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Sidebar Toggle & Outside Click
  // --------------------------------------------------------------------------
  function initMobileSidebar() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('appSidebar');

    if (!mobileToggle || !sidebar) return;

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Toast Feedback Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`;

    toast.innerHTML = `
      <span>${iconSvg}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 5. Dashboard Interactive Task Filtering
  // --------------------------------------------------------------------------
  function initDashboardTaskFilters() {
    const pillTabs = document.querySelectorAll('.pill-tab[data-task-filter]');
    const taskItems = document.querySelectorAll('#dashboardTaskList .task-item');

    if (!pillTabs.length) return;

    pillTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        pillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-task-filter');

        taskItems.forEach(item => {
          const status = item.getAttribute('data-status');
          if (filter === 'all' || status === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Attendance & Schedule Dropdown Filter Interactive Toggles
  // --------------------------------------------------------------------------
  function initDropdownPills() {
    // Attendance Month Dropdown
    const attDropdown = document.getElementById('attMonthDropdownBtn');
    if (attDropdown) {
      const views = ['month', 'week', 'term'];
      let viewIdx = 0;
      attDropdown.addEventListener('click', () => {
        viewIdx = (viewIdx + 1) % views.length;
        const span = attDropdown.querySelector('span');
        if (span) span.textContent = views[viewIdx];
        showToast(`Attendance view switched to ${views[viewIdx]}`, 'info');
      });
    }

    // Schedule Day Dropdown
    const schedDropdown = document.getElementById('scheduleDayDropdownBtn');
    if (schedDropdown) {
      const dayViews = ['today', 'tomorrow', 'this week'];
      let dIdx = 0;
      schedDropdown.addEventListener('click', () => {
        dIdx = (dIdx + 1) % dayViews.length;
        const span = schedDropdown.querySelector('span');
        if (span) span.textContent = dayViews[dIdx];
        showToast(`Schedule view filtered by ${dayViews[dIdx]}`, 'info');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. Quick Task Modal (Dashboard)
  // --------------------------------------------------------------------------
  function initQuickTaskModal() {
    const openBtn = document.getElementById('openQuickTaskBtn');
    const modal = document.getElementById('quickTaskModal');
    const closeBtn = document.getElementById('closeQuickTaskModal');
    const form = document.getElementById('quickTaskForm');
    const listContainer = document.getElementById('dashboardTaskList');

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitleInput').value.trim();
        const subject = document.getElementById('taskSubjectInput').value.trim();
        const status = document.getElementById('taskStatusInput').value;

        if (!title || !subject) return;

        let badgeHtml = '<span class="badge-todo">To do</span>';
        let progressHtml = '';

        if (status === 'in_progress') {
          badgeHtml = '<span class="badge-in-progress">In progress</span>';
          progressHtml = `
            <div class="progress-striped-container" title="Progress: 50%">
              <div class="progress-striped-fill fill-orange" style="width: 50%;"></div>
            </div>`;
        } else if (status === 'done') {
          badgeHtml = '<span class="badge-done">Done</span>';
          progressHtml = `
            <div class="progress-striped-container" title="Progress: 100%">
              <div class="progress-striped-fill fill-lime" style="width: 100%;"></div>
            </div>`;
        }

        const newTaskEl = document.createElement('div');
        newTaskEl.className = 'task-item';
        newTaskEl.setAttribute('data-status', status);
        newTaskEl.innerHTML = `
          <div class="task-item-top">
            <h3 class="task-title">${title}</h3>
            ${badgeHtml}
          </div>
          <div class="task-meta-row">
            <div class="task-meta-left">
              <span class="task-subject">${subject}</span>
              <span>Today</span>
            </div>
            <span class="task-comments">No comments</span>
          </div>
          ${progressHtml}
        `;

        if (listContainer) {
          listContainer.prepend(newTaskEl);
        }

        form.reset();
        modal.classList.remove('open');
        showToast('New task created successfully!', 'success');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Profile Form Handler
  // --------------------------------------------------------------------------
  function initProfileForm() {
    const form = document.getElementById('studentRegistrationForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        fullName: document.getElementById('fullNameInput').value.trim(),
        regNumber: document.getElementById('regNumberInput').value.trim(),
        email: document.getElementById('emailInput').value.trim(),
        phone: document.getElementById('phoneInput').value.trim(),
        department: document.getElementById('departmentSelect') ? document.getElementById('departmentSelect').value : 'Computer Science',
        semester: document.getElementById('semesterSelect') ? document.getElementById('semesterSelect').value : '5th Semester'
      };

      setStudentProfile(updated);
      showToast('Profile information updated successfully!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 9. Global Search Filter
  // --------------------------------------------------------------------------
  function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      
      // Filter dashboard tasks
      const dashboardTasks = document.querySelectorAll('#dashboardTaskList .task-item');
      dashboardTasks.forEach(task => {
        const text = task.textContent.toLowerCase();
        task.style.display = text.includes(q) ? 'flex' : 'none';
      });

      // Filter schedule rows if on dashboard
      const schedRows = document.querySelectorAll('.schedule-rows-list .schedule-row');
      schedRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? 'grid' : 'none';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. University Announcements Store & Filter (Preserved from Previous Portal)
  // --------------------------------------------------------------------------
  const announcementsList = [
    {
      id: 'ann-1',
      title: 'Fall 2026 Midterm Examination Schedule Published',
      category: 'Examination',
      date: 'Oct 14, 2026',
      author: 'Office of Controller of Examinations',
      summary: 'The formal midterm examination timetable is now published. Review your course exam slots and report any conflicting slots to your academic advisor.',
      urgent: true
    },
    {
      id: 'ann-2',
      title: 'Annual Inter-University Hackathon "CodeVertex 2026" Open for Teams',
      category: 'Event',
      date: 'Oct 18, 2026',
      author: 'ACM & IEEE Student Chapters',
      summary: 'Form teams of up to 4 members for 36 hours of software development, AI tracks, and networking. Top teams receive cash awards and interview fast-tracks.',
      urgent: false
    },
    {
      id: 'ann-3',
      title: 'Merit-Based Academic Scholarship Applications for Semester 5',
      category: 'Academic',
      date: 'Oct 20, 2026',
      author: 'Financial Aid & Academic Advisory',
      summary: 'Undergraduate students maintaining a minimum CGPA of 3.60 are eligible to submit financial scholarship portfolios for the academic year 2026-2027.',
      urgent: true
    },
    {
      id: 'ann-4',
      title: 'Campus Central Library Extended 24/7 Hours for Midterm Preparation',
      category: 'General',
      date: 'Oct 22, 2026',
      author: 'Campus Library Administration',
      summary: 'The central library commons and dedicated quiet study rooms on the 3rd floor will operate 24 hours daily with high-speed Wi-Fi and power support.',
      urgent: false
    }
  ];

  function renderAnnouncements(categoryFilter = 'All') {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;

    const filtered = categoryFilter === 'All'
      ? announcementsList
      : announcementsList.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h4 class="empty-state-title">No announcements found</h4>
          <p class="empty-state-desc">There are no notices in this category.</p>
        </div>`;
      return;
    }

    container.innerHTML = filtered.map(ann => {
      let badgeClass = 'badge-default';
      if (ann.category === 'Examination') badgeClass = 'badge-danger';
      else if (ann.category === 'Academic') badgeClass = 'badge-primary';
      else if (ann.category === 'Event') badgeClass = 'badge-info';
      else if (ann.category === 'General') badgeClass = 'badge-warning';

      return `
        <article class="announcement-card">
          <div class="announcement-header">
            <span class="badge ${badgeClass}">${ann.category}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${ann.date}</span>
          </div>
          <h3 class="announcement-title">${ann.title}</h3>
          <p class="announcement-body">${ann.summary}</p>
          <div class="announcement-footer">
            <span>By ${ann.author}</span>
            ${ann.urgent ? '<span class="badge badge-danger">Important</span>' : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  function initAnnouncementTabs() {
    const tabs = document.querySelectorAll('.announcement-filter-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-category') || 'All';
        renderAnnouncements(cat);
      });
    });

    renderAnnouncements('All');
  }

  // --------------------------------------------------------------------------
  // 11. Interactive Study Group Live Chat (UniDesk Study Lounge)
  // --------------------------------------------------------------------------
  function initLiveChat() {
    const chatDrawer = document.getElementById('chatDrawer');
    const closeBtn = document.getElementById('closeChatDrawer');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatTextInput');
    const messagesContainer = document.getElementById('chatMessagesContainer');

    window.openChatDemo = function () {
      if (chatDrawer) {
        chatDrawer.classList.toggle('open');
        if (chatDrawer.classList.contains('open') && input) {
          input.focus();
        }
      }
    };

    if (closeBtn && chatDrawer) {
      closeBtn.addEventListener('click', () => {
        chatDrawer.classList.remove('open');
      });
    }

    if (form && input && messagesContainer) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // Append student message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-bubble outbound';
        userMsg.innerHTML = `
          <div class="chat-sender-name" style="color: rgba(255,255,255,0.7);">You (Ali Usman)</div>
          <div>${text}</div>
        `;
        messagesContainer.appendChild(userMsg);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Auto-reply simulation from classmate
        setTimeout(() => {
          const peers = ['Terry Melton', 'Olive Castillo', 'Jeromy Curry', 'Eleanor Padilla'];
          const randomPeer = peers[Math.floor(Math.random() * peers.length)];
          const peerReplies = [
            'Got it, Ali! Let\'s review this in the lab tomorrow at 9:00 AM.',
            'Thanks for sharing! I was just completing that chemistry assignment.',
            'Great question! That theorem is covered in chapter 4 of data structures.',
            'Agreed! Room B2 is reserved for group revision after 2:00 PM.'
          ];
          const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

          const peerMsg = document.createElement('div');
          peerMsg.className = 'chat-bubble inbound';
          peerMsg.innerHTML = `
            <div class="chat-sender-name">${randomPeer}</div>
            <div>${randomReply}</div>
          `;
          messagesContainer.appendChild(peerMsg);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 850);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Helper Global UI Callbacks
  // --------------------------------------------------------------------------
  window.showMetricDetail = function (metricName, info) {
    showToast(`${metricName}: ${info}`, 'info');
  };

  window.showNotificationAlert = function () {
    showToast('You have 2 unread academic notices from the Controller of Examinations.', 'info');
  };

  window.handleLogout = function () {
    showToast('Logged out securely. Session ended.', 'info');
  };

  // --------------------------------------------------------------------------
  // Lifecycle Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    syncHeaderProfile();
    initMobileSidebar();
    initDashboardTaskFilters();
    initDropdownPills();
    initQuickTaskModal();
    initProfileForm();
    initGlobalSearch();
    initAnnouncementTabs();
    initLiveChat();

    // Theme toggling button listener
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Export to global scope
  window.SmartCampus = {
    getStudentProfile,
    setStudentProfile,
    showToast,
    syncHeaderProfile
  };

})();
