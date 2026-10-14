/**
 * UniDesk — Main Interactive Script
 * Handles: Theme Toggle, Mobile Nav, Announcements, Highlight Filters,
 * Metric Detail Modals, Notification Alerts and Toast System.
 * Website: www.UniDesk2026.com
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Switcher (Light / Dark Mode)
  // -------------------------------------------------------------------------
  const THEME_KEY = 'UniDesk_theme';

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcons(next);
    showToast(`Switched to ${next === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode`);
  };

  // Alias for pages that call toggleThemeGlobal()
  window.toggleThemeGlobal = window.toggleTheme;

  function updateThemeIcons(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Sidebar Toggle
  // -------------------------------------------------------------------------
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('appSidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') &&
          !sidebar.contains(e.target) &&
          e.target !== toggleBtn) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Theme Toggle Button (top bar button click)
  // -------------------------------------------------------------------------
  function initThemeBtn() {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.addEventListener('click', window.toggleTheme);
  }

  // -------------------------------------------------------------------------
  // 4. Event Announcements (Homepage)
  // -------------------------------------------------------------------------
  const ANNOUNCEMENTS = [
    {
      id: 1,
      category: 'Registration',
      title: '🎟️ Early Bird Registration Now Open!',
      body: 'Register before February 28, 2026 to secure your seat and receive a complimentary UniDesk welcome kit. Limited seats available for workshops.',
      date: 'Oct 10, 2025',
      badge: 'registration',
      badgeClass: 'badge-lime-high',
    },
    {
      id: 2,
      category: 'Schedule',
      title: '📅 Full Event Schedule Published',
      body: 'The complete programme for UniDesk is now available. Download the PDF from the Schedule page. Sessions run from 9:00 AM to 5:30 PM on March 15, 2026.',
      date: 'Oct 8, 2025',
      badge: 'schedule',
      badgeClass: 'badge-todo',
    },
    {
      id: 3,
      category: 'Venue',
      title: '📍 Venue Confirmed: Grand University Auditorium',
      body: 'UniDesk will be held at the Grand University Auditorium, Main Campus Block D. Parking is available in Lot C. Shuttle service from Gate 1 every 15 minutes.',
      date: 'Oct 5, 2025',
      badge: 'venue',
      badgeClass: 'badge-in-progress',
    },
    {
      id: 4,
      category: 'General',
      title: '🎤 Call for Workshop Proposals Closing Soon',
      body: 'Faculty members and industry professionals may submit workshop proposals until November 15, 2025. Submit via the Contact page using subject "Speaker Nomination".',
      date: 'Oct 1, 2025',
      badge: 'general',
      badgeClass: 'badge-todo',
    },
  ];

  function renderAnnouncements(filter) {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;

    const filtered = filter === 'All'
      ? ANNOUNCEMENTS
      : ANNOUNCEMENTS.filter(a => a.category === filter);

    if (filtered.length === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem;">No announcements in this category.</p>`;
      return;
    }

    container.innerHTML = filtered.map(a => `
      <div class="task-item" style="padding:1.1rem 0;">
        <div class="task-item-top">
          <h3 class="task-title">${a.title}</h3>
          <span class="${a.badgeClass}">${a.category}</span>
        </div>
        <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;margin:0.4rem 0 0.5rem;">${a.body}</p>
        <div class="task-meta-row">
          <span class="task-subject">UniDesk Team</span>
          <span>${a.date}</span>
        </div>
      </div>
    `).join('');
  }

  function initAnnouncements() {
    renderAnnouncements('All');

    document.querySelectorAll('.announcement-filter-tab').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.announcement-filter-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderAnnouncements(this.dataset.category);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Event Highlights Filter (Homepage)
  // -------------------------------------------------------------------------
  function initHighlightsFilter() {
    const pills = document.querySelectorAll('[data-highlight-filter]');
    if (!pills.length) return;

    pills.forEach(btn => {
      btn.addEventListener('click', function () {
        pills.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.highlightFilter;

        document.querySelectorAll('#highlightsList .task-item').forEach(item => {
          if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Metric Detail Modal (Homepage stat cards)
  // -------------------------------------------------------------------------
  window.showMetricDetail = function (title, message) {
    const modal = document.getElementById('infoModal');
    if (!modal) return;
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalBody').textContent = message;
    modal.style.display = 'flex';
  };

  function initModal() {
    const modal = document.getElementById('infoModal');
    const closeBtn = document.getElementById('closeInfoModal');
    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }

  // -------------------------------------------------------------------------
  // 7. Notification Alert
  // -------------------------------------------------------------------------
  window.showNotificationAlert = function () {
    showToast('🔔 You have 3 new announcements! Check Registration & Schedule updates.');
  };

  // -------------------------------------------------------------------------
  // 8. Download PDF helper (sidebar button)
  // -------------------------------------------------------------------------
  window.downloadSchedule = function (e) {
    e.preventDefault();
    showToast('📄 Opening schedule PDF... (documents/schedule.pdf)');
    setTimeout(() => { window.open('documents/schedule.pdf', '_blank'); }, 300);
  };

  // -------------------------------------------------------------------------
  // 9. Toast Notification System
  // -------------------------------------------------------------------------
  window.showToast = function (message, type = 'info') {
    const existing = document.querySelector('.tv-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'tv-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--color-black);
      color: #ffffff;
      padding: 0.85rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 28px rgba(0,0,0,0.2);
      transform: translateY(10px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      max-width: 380px;
      font-family: var(--font-main, sans-serif);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // -------------------------------------------------------------------------
  // 10. Search Bar — basic highlight filter for schedule search
  // -------------------------------------------------------------------------
  function initSearchBar() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      if (!query) return;
      showToast(`🔍 Searching for "${this.value}"...`);
    });
  }

  // -------------------------------------------------------------------------
  // 11. Auto-count countdown to event day (March 15, 2026)
  // -------------------------------------------------------------------------
  function updateCountdown() {
    const metricEl = document.querySelector('.metric-number');
    if (!metricEl || metricEl.textContent.includes('%')) return;

    const eventDate = new Date('2026-03-15T00:00:00');
    const today = new Date();
    const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) metricEl.textContent = diff;
    else if (diff === 0) metricEl.textContent = 'Today!';
    else metricEl.textContent = 'Done';
  }

  // -------------------------------------------------------------------------
  // Init All
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initThemeBtn();
    initMobileNav();
    initAnnouncements();
    initHighlightsFilter();
    initModal();
    initSearchBar();
    updateCountdown();
  });

})();
