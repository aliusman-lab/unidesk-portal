# 🎓 UniDesk — Smart Campus Student Portal

> **A modern, minimalist academic command center designed for university students.**  
> Crafted with a clean pill-and-card design aesthetic, high-contrast typography, interactive metrics, and zero heavy dependencies.

---

## 🌟 Key Highlights

- **✨ Clean & Elegant Design System**: Built with modern 28px rounded cards, soft diffused shadows, deep black pill active states (`#121212`), and a pristine neutral background (no distracting rainbow gradients).
- **🌗 Seamless Dark & Light Mode**: Instant, flicker-free toggle with tailored color palettes, glowing status badges, and `localStorage` persistence.
- **📱 100% Fully Responsive**: Adapts fluidly across widescreen monitors, laptops, tablets, and smartphones with mobile drawer navigation.
- **⚡ Zero Framework Overhead**: Pure semantic HTML5, Vanilla CSS3 (custom CSS custom properties), and modular vanilla JavaScript (ES6+).
- **💾 LocalStorage Persistence**: Student profile credentials, tasks, and theme preferences sync automatically across all pages and browser sessions.

---

## 📸 Overview & Dashboard Structure

```
UniDesk Portal
 ├── 🧭 Left Sidebar (Navigation, UniDesk Brand, Settings, Logout)
 ├── 🔍 Top Header Bar (Instant Search, Theme Switcher, Student Profile, Notifications)
 └── 📊 Main Dashboard Grid:
      ├── 📈 GPA Metric Card (4.7 • High Performance Indicator • Quick Details)
      ├── ⏰ On-time Rate Card (96% • Semester Improvement Trend)
      ├── 📝 My Tasks Widget (Filter Pills: All, To do, In progress, Done • Diagonal Striped Progress Tracks)
      ├── 🗓️ Class Attendance Matrix (5-Week Visual Dot Grid • Present Checks • Absent Crosses • Tooltips)
      ├── 🕒 Daily Lecture Timetable (Subject, Time, Instructor Avatars, Room Allocations)
      └── 📢 Campus Announcements & Notices (Midterms, Scholarships, Hackathons, Library Hours)
```

---

## 📂 Multi-Page Architecture

| Page | File | Description |
| :--- | :--- | :--- |
| **Dashboard** | [`index.html`](./index.html) | Main command center featuring GPA, On-time rate, task previews, 5-week attendance matrix, schedule preview, and university notices. |
| **Weekly Schedule** | [`schedule.html`](./schedule.html) | Complete weekly timetable with day-by-day filters (Monday – Friday), printable schedule view, and lab room badges. |
| **Task Manager** | [`tasks.html`](./tasks.html) | Full assignment manager with task creation form, status checkboxes, priority badges, completion tracker, and delete actions. |
| **Courses & Tests** | [`courses.html`](./courses.html) | Comprehensive curriculum catalog with real-time keyword search, semester filtering, and interactive syllabus modals. |
| **Student Profile** | [`profile.html`](./profile.html) | Official student identification record, CGPA breakdown, credit hour statistics, and editable profile form with instant synchronization. |

---

## 🎨 Color Palette & Design Tokens

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-app` (Light) | `#F4F5F8` | Clean, neutral soft off-white canvas |
| `--bg-app` (Dark) | `#0B0D13` | Deep obsidian dark theme canvas |
| `--color-black` | `#121212` | Active sidebar pills, primary CTA buttons |
| `--color-lime` | `#BEF264` | High performance badge, present attendance dots, progress fill |
| `--color-orange` | `#FF7844` | In-progress tasks badge, striped progress fill |
| `--color-blue` | `#38BDF8` | "To do" status badge, lecture info |
| `--color-red` | `#FF5C38` | Missed lecture circle, high-priority alert |
| `--progress-stripe` | `Diagonal 45°` | Custom striped progress track for unfinished tasks |

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required!

### 1. Clone or Download the Repository
```bash
git clone https://github.com/aliusman-lab/unidesk-portal.git
cd "Smart Campus Student Portal"
```

### 2. Run Locally in Your Browser
You can run it using any simple local server or open `index.html` directly:

#### Option A: Python HTTP Server (Recommended)
```bash
python -m http.server 8000
```
Then visit **`http://localhost:8000`** in your browser.

#### Option B: VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

#### Option C: Direct File Open
Simply double-click [`index.html`](./index.html) in your file explorer.

---

## 🛠️ Project Directory Tree

```
Smart Campus Student Portal/
├── index.html            # Main Student Dashboard
├── schedule.html         # Weekly Class Timetable
├── tasks.html            # Task & Assignment Manager
├── courses.html          # Course Catalog & Tests Directory
├── profile.html          # Student Profile & Registration
├── readme.md             # Project Documentation
├── css/
│   └── style.css         # Master Stylesheet & Design System Tokens
└── js/
    ├── main.js           # Core Shared Logic (Theme, Profile Sync, Chat, Search, Toast)
    ├── tasks.js          # Task CRUD Engine & Completion Bar Calculations
    └── courses.js        # Course Catalog Search, Filters & Modal Logic
```

---

## 💡 Interactive Features Built-In

1. **UniDesk Study Lounge (Live Peer Chat)**: Click **Chat** in the sidebar to open the real-time student study group drawer. Type messages as Ali Usman and receive simulated peer replies.
2. **Attendance Month & Schedule Day Dropdowns**: Interactive black pill buttons (`month ⌵` and `today ⌵`) that toggle filter views with instant toast alerts.
3. **Quick Task Creator**: Click the circular `+` button on the Dashboard to instantly register a task with dynamic striped progress bars.
4. **Global Real-Time Search**: Search input filters lectures, tasks, and syllabus items in real time.
5. **Toast Feedback Notification System**: Native floating notifications for user actions (theme switches, logins, task creations).

---

## 👤 Student Profile Data

- **Student Name**: Ali Usman
- **Registration Number**: `FA24-BCS-042`
- **Department**: Department of Computer Science
- **Current Semester**: 5th Semester (Junior Year)
- **Cumulative GPA**: `4.7`
- **On-time Submission Rate**: `96%`

---

## 📜 License

This project is created for educational and academic web design purposes. Feel free to use and customize it for your university projects!
