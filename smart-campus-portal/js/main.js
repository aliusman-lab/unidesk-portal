/**
 * Smart Campus Student Portal - Core Shared Logic
 * Manages Theme Toggle, Navigation, Profile Store, Announcements & Toast System
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Light / Dark Mode with localStorage persistence)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'smart_campus_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = savedTheme ? savedTheme : 'dark';
    
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Student Profile Global State Sync
  // --------------------------------------------------------------------------
  const PROFILE_STORAGE_KEY = 'smart_campus_student_profile';

  const defaultProfile = {
    fullName: 'Ali Usman',
    regNumber: 'FA24-BCS-042',
    email: 'ali.usman@campus.edu.pk',
    department: 'Computer Science',
    semester: '5th Semester',
    phone: '+92 300 1234567',
    cgpa: '3.78',
    totalCredits: 134,
    completedCredits: 76,
    enrolledCredits: 18,
    attendanceRate: 88.5
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

  function getInitials(name) {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function syncHeaderProfile() {
    const profile = getStudentProfile();
    const initials = getInitials(profile.fullName);

    // Update avatar elements across header & pages
    document.querySelectorAll('.student-avatar, .profile-avatar-large').forEach(el => {
      el.textContent = initials;
    });

    document.querySelectorAll('.student-nav-name').forEach(el => {
      el.textContent = profile.fullName;
    });

    document.querySelectorAll('.student-nav-id').forEach(el => {
      el.textContent = profile.regNumber;
    });

    // Update greeting banner if present
    const greetingEl = document.getElementById('dashboardStudentGreeting');
    if (greetingEl) {
      greetingEl.textContent = profile.fullName;
    }

    const deptEl = document.getElementById('dashboardStudentDept');
    if (deptEl) {
      deptEl.textContent = `${profile.department} • ${profile.semester}`;
    }
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  function initMobileDrawer() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (!mobileMenuBtn || !mobileDrawer) return;

    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking outside of drawer content
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Active Navigation State Detection
  // --------------------------------------------------------------------------
  function initActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === pageName || (pageName === '' && href === 'index.html'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Toast Feedback Notification System
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
    
    // Icon by type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#880000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 6. Dynamic University Announcements Store & Filter
  // --------------------------------------------------------------------------
  const announcementsList = [
    {
      id: 'ann-1',
      title: 'Fall 2026 Midterm Examination Schedule Published',
      category: 'Examination',
      date: 'Oct 14, 2026',
      author: 'Office of the Controller of Examinations',
      summary: 'The formal midterm examination timetable is now published. Review your course exam slots and report any conflicting slots to your academic advisor by Friday 5:00 PM.',
      urgent: true
    },
    {
      id: 'ann-2',
      title: 'Annual Inter-University Hackathon "CodeVertex 2026" Open for Teams',
      category: 'Event',
      date: 'Oct 18, 2026',
      author: 'ACM & IEEE Student Chapters',
      summary: 'Form teams of up to 4 members for 36 hours of software development, AI tracks, and networking. Top teams receive cash prizes and industry internship fast-tracks.',
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
      summary: 'The central library commons and dedicated quiet study rooms on 3rd floor will operate 24 hours daily with uninterrupted power, high-speed Wi-Fi, and cafeteria support.',
      urgent: false
    },
    {
      id: 'ann-5',
      title: 'Senior Capstone Project Milestone 1 Blueprint Submissions',
      category: 'Academic',
      date: 'Nov 02, 2026',
      author: 'Department of Computer Science',
      summary: 'All enrolled capstone project teams must commit their Software Requirements Specification (SRS) documents and system architectural diagrams by the designated deadline.',
      urgent: false
    },
    {
      id: 'ann-6',
      title: 'Autumn Career Fair 2026: 45+ Technology Employers on Campus',
      category: 'Event',
      date: 'Nov 12, 2026',
      author: 'University Career & Placement Center',
      summary: 'Leading software enterprises, data analytics firms, and tech startups will conduct live screening interviews. Bring printed copies of your resume.',
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
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
          <h3 class="empty-state-title">No announcements found</h3>
          <p class="empty-state-desc">There are currently no published announcements in this specific category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(ann => {
      let badgeClass = 'badge-default';
      if (ann.category === 'Examination') badgeClass = 'badge-danger';
      else if (ann.category === 'Academic') badgeClass = 'badge-primary';
      else if (ann.category === 'Event') badgeClass = 'badge-info';
      else if (ann.category === 'General') badgeClass = 'badge-warning';

      return `
        <article class="announcement-card" data-category="${ann.category}">
          <div class="announcement-header">
            <span class="badge ${badgeClass}">${ann.category}</span>
            <span class="announcement-date">${ann.date}</span>
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
        const category = tab.getAttribute('data-category') || 'All';
        renderAnnouncements(category);
      });
    });

    // Initial render
    renderAnnouncements('All');
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Progress Bars Animation
  // --------------------------------------------------------------------------
  function animateProgressBars() {
    const bars = document.querySelectorAll('.progress-fill[data-percent]');
    bars.forEach(bar => {
      const targetPercent = parseFloat(bar.getAttribute('data-percent')) || 0;
      setTimeout(() => {
        bar.style.width = `${targetPercent}%`;
      }, 150);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Upcoming Tasks Preview Widget (Dashboard)
  // --------------------------------------------------------------------------
  function renderDashboardTasksPreview() {
    const container = document.getElementById('dashboardTasksList');
    if (!container) return;

    let tasks = [];
    try {
      const stored = localStorage.getItem('smart_campus_tasks');
      if (stored) {
        tasks = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading tasks', e);
    }

    // Filter pending tasks, take next 3
    const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

    if (pendingTasks.length === 0) {
      container.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No pending tasks due soon! You are all caught up.
        </div>
      `;
      return;
    }

    container.innerHTML = pendingTasks.map(t => {
      let priorityClass = 'priority-low';
      if (t.priority === 'High') priorityClass = 'priority-high';
      else if (t.priority === 'Medium') priorityClass = 'priority-medium';

      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle); gap: 0.75rem;">
          <div style="display: flex; flex-direction: column; gap: 0.2rem; min-width: 0;">
            <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
              ${t.title}
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              ${t.course} • Due ${t.dueDate || 'Soon'}
            </span>
          </div>
          <span class="priority-pill ${priorityClass}" style="flex-shrink: 0;">${t.priority}</span>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // Initialize Lifecycle
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    syncHeaderProfile();
    initMobileDrawer();
    initActiveNav();
    animateProgressBars();
    initAnnouncementTabs();
    renderDashboardTasksPreview();

    // Bind theme button
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
    syncHeaderProfile,
    renderDashboardTasksPreview
  };

})();
