/**
 * Smart Campus Student Portal - Course Management & Search
 * Dynamic DOM rendering, instant multifaceted search & filter, course details modal
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Course Dataset (8 comprehensive university courses)
  // --------------------------------------------------------------------------
  const coursesData = [
    {
      id: 'cs-301',
      code: 'CS-301',
      name: 'Data Structures & Algorithms',
      instructor: 'Prof. Dr. Tariq Mahmood',
      instructorEmail: 'tariq.mahmood@campus.edu.pk',
      creditHours: 4,
      semester: '5th Semester',
      status: 'Enrolled',
      department: 'Computer Science',
      room: 'CS-Lab 2 (Block C)',
      schedule: 'Mon & Wed • 08:30 AM - 10:00 AM',
      attendance: 92,
      description: 'Advanced study of algorithm analysis, algorithmic complexity (Big-O), balanced binary search trees, hash structures, graph algorithms, dynamic programming, and greedy methodologies.',
      topics: ['Red-Black Trees & AVL Trees', 'Graph Traversal (BFS/DFS)', 'Dijkstra & Minimum Spanning Tree', 'Dynamic Programming & Memoization', 'Asymptotic Complexity Analysis']
    },
    {
      id: 'cs-304',
      code: 'CS-304',
      name: 'Database Management Systems',
      instructor: 'Dr. Sarah Jenkins',
      instructorEmail: 'sarah.jenkins@campus.edu.pk',
      creditHours: 3,
      semester: '5th Semester',
      status: 'Enrolled',
      department: 'Computer Science',
      room: 'Hall B-104 (Academic Wing)',
      schedule: 'Tue & Thu • 10:15 AM - 11:45 AM',
      attendance: 86,
      description: 'Relational database model foundations, SQL declarative querying, normalization (1NF through BCNF), indexing (B+ trees), ACID transaction processing, concurrency isolation, and modern NoSQL paradigms.',
      topics: ['Relational Algebra & Calculus', 'Complex SQL & Views', 'Functional Dependencies & BCNF', 'ACID Transactions & Two-Phase Locking', 'PostgreSQL & MongoDB Internals']
    },
    {
      id: 'se-310',
      code: 'SE-310',
      name: 'Software Engineering & Architecture',
      instructor: 'Assoc. Prof. Michael Chang',
      instructorEmail: 'm.chang@campus.edu.pk',
      creditHours: 3,
      semester: '5th Semester',
      status: 'Enrolled',
      department: 'Software Engineering',
      room: 'Room 302 (Engineering Complex)',
      schedule: 'Mon & Wed • 11:30 AM - 01:00 PM',
      attendance: 88,
      description: 'Principles of modern software lifecycle methodologies, Agile/Scrum processes, architectural design patterns (Microservices, Hexagonal, Event-driven), UML behavioral modeling, and CI/CD automation.',
      topics: ['Domain Driven Design (DDD)', 'Architectural Pattern Styles', 'UML Structural & Behavioral Modeling', 'DevOps & Automated Pipeline Testing', 'Software Refactoring Best Practices']
    },
    {
      id: 'cs-320',
      code: 'CS-320',
      name: 'Operating Systems & Concurrency',
      instructor: 'Dr. Elena Rostova',
      instructorEmail: 'elena.rostova@campus.edu.pk',
      creditHours: 4,
      semester: '5th Semester',
      status: 'Enrolled',
      department: 'Computer Science',
      room: 'CS-Lab 1 (Systems Lab)',
      schedule: 'Tue & Thu • 01:15 PM - 02:45 PM',
      attendance: 82,
      description: 'Core operating system architecture, process lifecycle, multi-threaded concurrency, mutexes & semaphores, deadlock prevention, virtual memory paging, cache paging algorithms, and POSIX system call programming.',
      topics: ['Process Synchronization & Mutexes', 'CPU Scheduling Algorithms', 'Virtual Memory & Page Replacement', 'Inter-Process Communication (IPC)', 'Linux Kernel Architecture & Syscalls']
    },
    {
      id: 'math-210',
      code: 'MATH-210',
      name: 'Linear Algebra & Numerical Methods',
      instructor: 'Dr. David Miller',
      instructorEmail: 'david.miller@campus.edu.pk',
      creditHours: 3,
      semester: '4th Semester',
      status: 'Completed',
      department: 'Mathematics',
      room: 'Lecture Hall 1 (Science Wing)',
      schedule: 'Completed • Grade A (4.0)',
      attendance: 95,
      description: 'Vector spaces, matrix operations, determinants, eigenvalues and eigenvectors, singular value decomposition (SVD), numerical solving of linear systems, and error propagation analysis.',
      topics: ['Vector Spaces & Subspaces', 'Eigenvalue Decomposition & SVD', 'Gaussian Elimination & Matrix Factorization', 'Numerical Differential Equations', 'Principal Component Analysis Foundation']
    },
    {
      id: 'cs-202',
      code: 'CS-202',
      name: 'Object-Oriented Programming in C++',
      instructor: 'Prof. Alan Vance',
      instructorEmail: 'alan.vance@campus.edu.pk',
      creditHours: 4,
      semester: '4th Semester',
      status: 'Completed',
      department: 'Computer Science',
      room: 'Software Lab 3',
      schedule: 'Completed • Grade A- (3.7)',
      attendance: 90,
      description: 'In-depth paradigm of object-oriented design: encapsulation, abstract data types, inheritance hierarchies, runtime polymorphism via virtual dispatch, templates, operator overloading, and RAII memory safety.',
      topics: ['Classes, Objects & RAII Semantics', 'Polymorphism & Vtables', 'Generic Template Programming', 'C++ Standard Template Library (STL)', 'Exception Safety Guarantees']
    },
    {
      id: 'ai-401',
      code: 'AI-401',
      name: 'Artificial Intelligence & Machine Learning',
      instructor: 'Dr. Sofia Chen',
      instructorEmail: 'sofia.chen@campus.edu.pk',
      creditHours: 3,
      semester: '6th Semester',
      status: 'Upcoming',
      department: 'Computer Science',
      room: 'TBD (Enrolling Next Term)',
      schedule: 'Elective Selection • Prerequisite: CS-301',
      attendance: 0,
      description: 'Foundations of intelligent agents, state-space search (A*, Minimax), probabilistic reasoning, supervised learning algorithms (linear, logistic, decision trees), neural networks, and reinforcement learning principles.',
      topics: ['Heuristic Search & Adversarial Games', 'Bayesian Networks', 'Supervised Learning Regressors', 'Deep Feedforward Networks', 'Model Evaluation & Cross-Validation']
    },
    {
      id: 'cy-410',
      code: 'CY-410',
      name: 'Network Security & Cryptography',
      instructor: 'Prof. Robert Sterling',
      instructorEmail: 'robert.sterling@campus.edu.pk',
      creditHours: 3,
      semester: '6th Semester',
      status: 'Upcoming',
      department: 'Cyber Security',
      room: 'TBD (Enrolling Next Term)',
      schedule: 'Elective Selection • Prerequisite: CS-320',
      attendance: 0,
      description: 'Classical and modern cryptographic primitives, symmetric ciphers (AES), asymmetric systems (RSA, Elliptic Curves), cryptographic hashes, digital signatures, TLS/SSL handshake protocols, and network intrusion defenses.',
      topics: ['Symmetric & Public-Key Cryptography', 'Hash Functions & Message Authentication', 'TLS/SSL & Cryptographic Key Exchange', 'Packet Sniffing & Firewall Defense', 'Vulnerability Assessment Protocols']
    }
  ];

  // DOM Elements
  const coursesContainer = document.getElementById('coursesGrid');
  const searchInput = document.getElementById('courseSearchInput');
  const semesterFilter = document.getElementById('semesterFilter');
  const statusFilter = document.getElementById('statusFilter');
  const courseCountText = document.getElementById('coursesCountText');

  // Modal elements
  const courseModal = document.getElementById('courseDetailModal');
  const modalCloseBtn = document.getElementById('closeCourseModalBtn');
  const modalCloseAction = document.getElementById('modalActionClose');

  // --------------------------------------------------------------------------
  // Render Courses Cards
  // --------------------------------------------------------------------------
  function renderCourses(courses) {
    if (!coursesContainer) return;

    if (courses.length === 0) {
      coursesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 class="empty-state-title">No matching courses found</h3>
          <p class="empty-state-desc">We couldn't find any courses matching your search criteria or filter parameters. Try clearing your filters or searching with a different keyword.</p>
          <button type="button" class="btn btn-secondary" id="resetCoursesFilterBtn">
            Reset Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetCoursesFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
      }
      updateSummaryCount(0, 0);
      return;
    }

    const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);
    updateSummaryCount(courses.length, totalCredits);

    coursesContainer.innerHTML = courses.map(course => {
      let statusBadge = 'badge-primary';
      if (course.status === 'Completed') statusBadge = 'badge-success';
      else if (course.status === 'Upcoming') statusBadge = 'badge-default';

      return `
        <div class="course-card" data-course-id="${course.id}">
          <div class="course-card-top">
            <div class="course-code-row">
              <span class="course-code">${course.code}</span>
              <span class="badge ${statusBadge}">${course.status}</span>
            </div>
            
            <h3 class="course-name">${course.name}</h3>
            
            <div class="course-instructor">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${course.instructor}</span>
            </div>

            <div class="course-meta-list">
              <div class="course-meta-item">
                <span class="course-meta-label">Credit Hours</span>
                <span class="course-meta-val">${course.creditHours} Credits</span>
              </div>
              <div class="course-meta-item">
                <span class="course-meta-label">Semester</span>
                <span class="course-meta-val">${course.semester}</span>
              </div>
              <div class="course-meta-item">
                <span class="course-meta-label">Location / Lab</span>
                <span class="course-meta-val">${course.room}</span>
              </div>
              <div class="course-meta-item">
                <span class="course-meta-label">Attendance</span>
                <span class="course-meta-val">${course.status === 'Enrolled' ? `${course.attendance}%` : (course.status === 'Completed' ? '100%' : 'N/A')}</span>
              </div>
            </div>
          </div>

          <div class="course-card-bottom">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${course.department}</span>
            <button type="button" class="view-course-btn" data-id="${course.id}">
              <span>Course Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to view detail buttons
    document.querySelectorAll('.view-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openCourseModal(id);
      });
    });
  }

  function updateSummaryCount(count, credits) {
    if (courseCountText) {
      courseCountText.textContent = `Showing ${count} of ${coursesData.length} courses (${credits} total credit hours)`;
    }
  }

  // --------------------------------------------------------------------------
  // Instant Search & Filtering Engine
  // --------------------------------------------------------------------------
  function filterCourses() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const semester = semesterFilter ? semesterFilter.value : 'all';
    const status = statusFilter ? statusFilter.value : 'all';

    const filtered = coursesData.filter(course => {
      // Query check across code, name, instructor, department
      const matchesQuery = query === '' || 
        course.code.toLowerCase().includes(query) ||
        course.name.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.department.toLowerCase().includes(query);

      // Semester check
      const matchesSemester = semester === 'all' || 
        course.semester.toLowerCase().includes(semester.toLowerCase());

      // Status check
      const matchesStatus = status === 'all' || 
        course.status.toLowerCase() === status.toLowerCase();

      return matchesQuery && matchesSemester && matchesStatus;
    });

    renderCourses(filtered);
  }

  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (semesterFilter) semesterFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    filterCourses();
  }

  // --------------------------------------------------------------------------
  // Course Details Modal
  // --------------------------------------------------------------------------
  function openCourseModal(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !courseModal) return;

    document.getElementById('modalCourseTitle').textContent = `${course.code}: ${course.name}`;
    document.getElementById('modalCourseCode').textContent = course.code;
    document.getElementById('modalCourseInstructor').textContent = course.instructor;
    document.getElementById('modalCourseEmail').textContent = course.instructorEmail;
    document.getElementById('modalCourseEmail').setAttribute('href', `mailto:${course.instructorEmail}`);
    document.getElementById('modalCourseCredits').textContent = `${course.creditHours} Credit Hours`;
    document.getElementById('modalCourseTerm').textContent = course.semester;
    document.getElementById('modalCourseSchedule').textContent = course.schedule;
    document.getElementById('modalCourseRoom').textContent = course.room;
    document.getElementById('modalCourseDesc').textContent = course.description;

    const topicsList = document.getElementById('modalCourseTopics');
    if (topicsList) {
      topicsList.innerHTML = course.topics.map(t => `<li style="margin-bottom: 0.35rem; color: var(--text-secondary);">${t}</li>`).join('');
    }

    courseModal.classList.add('open');
  }

  function closeCourseModal() {
    if (courseModal) {
      courseModal.classList.remove('open');
    }
  }

  // --------------------------------------------------------------------------
  // Event Bindings
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderCourses(coursesData);

    // Event listeners
    if (searchInput) {
      searchInput.addEventListener('input', filterCourses);
    }

    if (semesterFilter) {
      semesterFilter.addEventListener('change', filterCourses);
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', filterCourses);
    }

    // Modal listeners
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeCourseModal);
    }
    if (modalCloseAction) {
      modalCloseAction.addEventListener('click', closeCourseModal);
    }
    if (courseModal) {
      courseModal.addEventListener('click', (e) => {
        if (e.target === courseModal) closeCourseModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && courseModal && courseModal.classList.contains('open')) {
        closeCourseModal();
      }
    });
  });

})();
