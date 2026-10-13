/**
 * Smart Campus Student Portal - Task & Assignment Manager
 * Handles Task CRUD operations, localStorage persistence, completion states,
 * dynamic progress bar calculation, and filtering.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'smart_campus_tasks';

  // Realistic starter seed tasks if localStorage is empty
  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Implement AVL Tree Balance & Deletion in C++',
      course: 'CS-301: Data Structures',
      dueDate: '2026-10-16',
      priority: 'High',
      completed: false,
      createdAt: '2026-10-10'
    },
    {
      id: 'task-2',
      title: 'Database Normalization BCNF Decomposition Exercise',
      course: 'CS-304: Database Systems',
      dueDate: '2026-10-18',
      priority: 'Medium',
      completed: true,
      createdAt: '2026-10-09'
    },
    {
      id: 'task-3',
      title: 'Submit SRS Document & Architectural Use-Case Diagrams',
      course: 'SE-310: Software Engineering',
      dueDate: '2026-10-22',
      priority: 'High',
      completed: false,
      createdAt: '2026-10-11'
    },
    {
      id: 'task-4',
      title: 'Multi-threaded Producer-Consumer Semaphore Lab',
      course: 'CS-320: Operating Systems',
      dueDate: '2026-10-25',
      priority: 'Low',
      completed: false,
      createdAt: '2026-10-12'
    },
    {
      id: 'task-5',
      title: 'Review Midterm Chapter 1-4 Past Paper Problems',
      course: 'CS-301: Data Structures',
      dueDate: '2026-10-28',
      priority: 'Medium',
      completed: false,
      createdAt: '2026-10-12'
    }
  ];

  let currentFilter = 'all'; // 'all', 'pending', 'completed'
  let currentPriorityFilter = 'all';

  // DOM Elements
  const taskForm = document.getElementById('addTaskForm');
  const taskListContainer = document.getElementById('taskListContainer');
  const taskProgressBar = document.getElementById('tasksProgressBar');
  const taskProgressPercent = document.getElementById('tasksProgressPercent');
  const taskProgressFraction = document.getElementById('tasksProgressFraction');
  const taskFilterTabs = document.querySelectorAll('.task-filter-tab');
  const priorityFilterSelect = document.getElementById('taskPriorityFilter');

  // --------------------------------------------------------------------------
  // Storage Handlers
  // --------------------------------------------------------------------------
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing stored tasks', e);
    }
    // Set seed data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
  }

  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to storage', e);
    }
    // Also notify main.js dashboard preview if needed
    if (window.SmartCampus && window.SmartCampus.renderDashboardTasksPreview) {
      window.SmartCampus.renderDashboardTasksPreview();
    }
  }

  // --------------------------------------------------------------------------
  // Progress Bar Calculation
  // --------------------------------------------------------------------------
  function updateProgress(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (taskProgressBar) {
      taskProgressBar.style.width = `${percentage}%`;
      taskProgressBar.setAttribute('data-percent', percentage);
      
      // Update color based on achievement
      if (percentage >= 80) {
        taskProgressBar.className = 'progress-fill fill-success';
      } else if (percentage >= 40) {
        taskProgressBar.className = 'progress-fill';
      } else {
        taskProgressBar.className = 'progress-fill fill-warning';
      }
    }

    if (taskProgressPercent) {
      taskProgressPercent.textContent = `${percentage}% Completed`;
    }

    if (taskProgressFraction) {
      taskProgressFraction.textContent = `${completed} of ${total} tasks finished`;
    }
  }

  // --------------------------------------------------------------------------
  // Formatting Due Dates & Relative Badges
  // --------------------------------------------------------------------------
  function formatDueDate(dueDateStr) {
    if (!dueDateStr) return 'No due date';
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `<span style="color: var(--danger); font-weight: 600;">Overdue (${Math.abs(diffDays)}d ago)</span>`;
    } else if (diffDays === 0) {
      return `<span style="color: var(--danger); font-weight: 600;">Due today!</span>`;
    } else if (diffDays === 1) {
      return `<span style="color: var(--warning); font-weight: 600;">Due tomorrow</span>`;
    } else {
      return `Due in ${diffDays} days (${dueDateStr})`;
    }
  }

  // --------------------------------------------------------------------------
  // Render Task List
  // --------------------------------------------------------------------------
  function renderTaskList() {
    if (!taskListContainer) return;

    const allTasks = loadTasks();
    updateProgress(allTasks);

    // Apply filters
    const filteredTasks = allTasks.filter(task => {
      // Status filter
      if (currentFilter === 'pending' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Priority filter
      if (currentPriorityFilter !== 'all' && task.priority.toLowerCase() !== currentPriorityFilter.toLowerCase()) {
        return false;
      }

      return true;
    });

    if (filteredTasks.length === 0) {
      taskListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <h3 class="empty-state-title">No tasks found</h3>
          <p class="empty-state-desc">There are no tasks matching the selected filter criteria. Create a new task or adjust your filters above.</p>
        </div>
      `;
      return;
    }

    taskListContainer.innerHTML = filteredTasks.map(task => {
      let priorityClass = 'priority-low';
      if (task.priority === 'High') priorityClass = 'priority-high';
      else if (task.priority === 'Medium') priorityClass = 'priority-medium';

      return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <div class="task-left-col">
            <input 
              type="checkbox" 
              class="task-checkbox-custom" 
              id="check_${task.id}" 
              ${task.completed ? 'checked' : ''} 
              data-id="${task.id}"
              aria-label="Mark task as complete"
            />
            <div class="task-info">
              <label for="check_${task.id}" class="task-title" style="cursor: pointer;">
                ${task.title}
              </label>
              <div class="task-meta-row">
                <span style="font-weight: 600; color: var(--text-primary);">${task.course}</span>
                <span>•</span>
                <span class="task-date-badge">${formatDueDate(task.dueDate)}</span>
                ${task.completed ? '<span class="badge badge-success">Completed</span>' : ''}
              </div>
            </div>
          </div>

          <div class="task-actions">
            <span class="priority-pill ${priorityClass}">${task.priority}</span>
            <button 
              type="button" 
              class="task-delete-btn" 
              data-id="${task.id}" 
              title="Delete task"
              aria-label="Delete ${task.title}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind checkboxes & delete buttons
    document.querySelectorAll('.task-checkbox-custom').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        toggleTaskCompletion(id, e.target.checked);
      });
    });

    document.querySelectorAll('.task-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteTask(id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Task Actions: Toggle Completion & Delete
  // --------------------------------------------------------------------------
  function toggleTaskCompletion(taskId, isChecked) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = isChecked;
    saveTasks(tasks);
    renderTaskList();

    if (window.SmartCampus && window.SmartCampus.showToast) {
      window.SmartCampus.showToast(
        isChecked ? `Marked "${task.title}" as completed!` : `Reopened "${task.title}"`,
        isChecked ? 'success' : 'info'
      );
    }
  }

  function deleteTask(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasks(updated);
    renderTaskList();

    if (window.SmartCampus && window.SmartCampus.showToast) {
      window.SmartCampus.showToast(`Deleted task "${task ? task.title : 'Task'}"`, 'warning');
    }
  }

  // --------------------------------------------------------------------------
  // Add Task Form Handler
  // --------------------------------------------------------------------------
  function handleAddTaskSubmit(e) {
    e.preventDefault();

    const titleInput = document.getElementById('taskTitle');
    const courseInput = document.getElementById('taskCourse');
    const dueDateInput = document.getElementById('taskDueDate');
    const priorityInput = document.getElementById('taskPriority');

    const title = titleInput.value.trim();
    const course = courseInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (!title) {
      if (window.SmartCampus && window.SmartCampus.showToast) {
        window.SmartCampus.showToast('Please provide a task title', 'danger');
      }
      titleInput.focus();
      return;
    }

    if (!course) {
      if (window.SmartCampus && window.SmartCampus.showToast) {
        window.SmartCampus.showToast('Please select an enrolled course', 'danger');
      }
      courseInput.focus();
      return;
    }

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      course,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const tasks = loadTasks();
    tasks.unshift(newTask); // prepend
    saveTasks(tasks);

    // Reset form
    taskForm.reset();
    renderTaskList();

    if (window.SmartCampus && window.SmartCampus.showToast) {
      window.SmartCampus.showToast(`New task "${title}" added successfully!`, 'success');
    }
  }

  // --------------------------------------------------------------------------
  // Lifecycle Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Set min date on dueDate picker to today
    const dueDateInput = document.getElementById('taskDueDate');
    if (dueDateInput) {
      const todayStr = new Date().toISOString().split('T')[0];
      dueDateInput.setAttribute('min', todayStr);
    }

    renderTaskList();

    if (taskForm) {
      taskForm.addEventListener('submit', handleAddTaskSubmit);
    }

    // Filter tabs
    if (taskFilterTabs) {
      taskFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          taskFilterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          currentFilter = tab.getAttribute('data-filter') || 'all';
          renderTaskList();
        });
      });
    }

    // Priority filter
    if (priorityFilterSelect) {
      priorityFilterSelect.addEventListener('change', (e) => {
        currentPriorityFilter = e.target.value;
        renderTaskList();
      });
    }
  });

})();
