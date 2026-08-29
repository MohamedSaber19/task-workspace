# 📋 Task Workspace / Kanban Board

> **🔗 Live Demo:** [https://task-workspace-drab.vercel.app/](https://task-workspace-drab.vercel.app/)

A modern, accessible, and responsive Task Management & Kanban Board application built with React, TypeScript, and Tailwind CSS. The app features real-time drag-and-drop column management, dynamic search & filtering, interactive modals with Zod validation, and comprehensive integration testing via Vitest.

---

## ✨ Features

- **Interactive Kanban Board**: Categorize tasks into status columns (_To Do_, _In Progress_, _In Review_, _Done_).
- **Drag & Drop Reordering**: Easily update task status across columns.
- **Task Search & Filtering**: Real-time title and description filtering across all columns.
- **Form Validation & Schemas**: Type-safe modal forms with React Hook Form and Zod validation.
- **Comprehensive Test Suite**: Full integration coverage for modals, validation rules, search filters, and component rendering using Vitest and React Testing Library.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Drag & Drop**: `@hello-pangea/dnd` / `@dnd-kit`
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and your preferred package manager (`pnpm`, `npm`, or `yarn`) installed.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MohamedSaber19/task-workspace.git
   cd task-workspace
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### 🧪 Running Tests

The project includes unit and integration tests covering component lifecycle, form validations, search behaviors, and accessibility.

```bash
# Run tests in watch mode
pnpm test

# Run tests with coverage report
pnpm test --coverage

# Run tests once (CI mode)
pnpm test --run
```

### 📁 Project Structure

```bash
src/
├── api/                  # Global API client & HTTP configuration
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Shared UI primitives (shadcn/ui, buttons, modals)
├── context/              # React context providers (e.g., ThemeContext)
├── features/
│   └── tasks/            # Task domain module (feature-driven)
│       ├── components/   # KanbanBoard, TaskModal, TaskCard
│       ├── hooks/        # Task-specific custom hooks
│       ├── schemas/      # Zod validation schemas
│       ├── services/     # Feature API integration (taskApi.ts)
│       └── store/        # State management (Zustand / Redux slice)
├── hooks/                # Shared custom hooks
├── lib/                  # Utility functions & library wrappers (cn, utils)
├── test/                 # Test setup, mocks, and custom RTL renders
├── types/                # Global TypeScript interfaces & types
├── App.tsx               # Root application component
├── index.css             # Global styles & Tailwind CSS imports
└── main.tsx              # Application entry point
```

### 📄 License

Distributed under the MIT License.
