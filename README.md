# Splinde Tree Data Visualization

A full-stack TypeScript application that renders hierarchical tree data with interactive editing capabilities and real-time sum calculations.

## Overview

This project displays a nested tree structure representing an "Annual Report" with various sections, subsections, and entries. Users can:
- View computed sums for all sections (automatically calculated from child entries)
- Edit entry values and see computed sums update in real-time
- Edit notes for any entry
- Edit names of sections and entries inline
- Add new entries and sections dynamically
- Delete entries and sections (except root node)
- Collapse/expand sections for better navigation
- Get instant feedback through toast notifications

## Technical Implementation

### Backend
- **API Endpoint**: `/api/data` serves the demo data as a static JSON endpoint
- **Data Structure**: Hierarchical tree with sections containing either subsections or entries with values

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: React Icons for interactive buttons
- **Notifications**: React Hot Toast for user feedback
- **State Management**: React hooks for local state and real-time updates
- **Sum Calculation**: Frontend computation of nested sums with automatic recalculation on edits

### Key Features
- ✅ Backend API serving demo data
- ✅ Computed sum calculation and display
- ✅ Interactive tree visualization with collapse/expand
- ✅ Real-time sum updates when editing entry values (onBlur)
- ✅ Editable notes for all entries
- ✅ Inline editing of names for sections and entries
- ✅ Dynamic add/remove functionality for entries and sections
- ✅ Toast notifications for user feedback
- ✅ Unique ID system preventing data corruption during operations
- ✅ Responsive design supporting deeply nested trees

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd splinde-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install the required packages including:
- `react-icons` for interactive UI icons
- `react-hot-toast` for toast notifications

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

- **View Data**: The application loads and displays the hierarchical tree structure
- **Edit Values**: Click on any sum value, edit it, and press Enter or click outside to update
- **Edit Notes**: Click on any note to edit it inline
- **Edit Names**: Click on any section or entry name to edit it inline
- **Add Items**: 
  - Click the green "+" button to add a new entry to a section
  - Click the blue folder "+" button to add a new subsection
- **Delete Items**: Click the red trash button to delete entries or sections
- **Navigate**: Use the expand/collapse buttons (▼/▶) to navigate large trees
- **Real-time Updates**: All computed sums update automatically when you edit individual values
- **Feedback**: Toast notifications appear for all actions (add, delete, update)

## Data Structure

The application uses the following TypeScript types:

```typescript
type TreeNode = { 
    name: string
    id: string
}

type Entry = TreeNode & {
    note: string
    sum: number
}

type Section = TreeNode & {
    children: (Entry | Section)[]
}

type ComputedSection = TreeNode & {
    children: (Entry | ComputedSection)[]
    computedSum: number
}
```

## Architecture Decisions

- **Frontend Sum Calculation**: Sums are computed on the frontend for real-time updates without server round-trips
- **Immutable Updates**: State updates create new objects to ensure React re-renders correctly
- **Unique ID System**: Each node has a unique ID to prevent data corruption during add/delete operations
- **Type Safety**: Full TypeScript implementation with strict typing for data integrity
- **Component Design**: Recursive TreeNode component handles arbitrary nesting levels
- **Event Handling**: Proper event propagation prevention for nested interactive elements
- **User Feedback**: Toast notifications provide immediate feedback for all user actions
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

## Development

The codebase is organized as follows:
- `/app` - Next.js pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions, types, and demo data
- `/public` - Static assets
