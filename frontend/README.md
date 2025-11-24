# BookFlix - Netflix-Style Book Browser

A modern, Netflix-inspired book browsing UI built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Netflix-style UI with horizontal scrolling rows
- 📚 Multiple pages: Dashboard, Book Details, Saved Books
- 🎭 Dark mode design with smooth animations
- 📱 Fully responsive (desktop, tablet, mobile)
- ⚡ Built with Vite for fast development
- 🎯 TypeScript for type safety
- 💅 Tailwind CSS for styling
- 🧩 Reusable shadcn-inspired components

## Installation

1. **Clone or download this project**

2. **Install dependencies:**

\`\`\`bash
pnpm install
\`\`\`

If you don't have pnpm installed, install it first:
\`\`\`bash
npm install -g pnpm
\`\`\`

3. **Start the development server:**

\`\`\`bash
pnpm dev
\`\`\`

4. **Open your browser to** `http://localhost:5173`

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── BookCard.tsx     # Individual book card
│   ├── BookRow.tsx      # Horizontal scrolling row
│   ├── GenreRow.tsx     # Genre-specific row
│   ├── HeroBanner.tsx   # Featured book banner
│   └── Navbar.tsx       # Navigation bar
├── pages/
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── BookDetails.tsx  # Book details page
│   └── SavedBooks.tsx   # Saved books page
├── data/
│   └── mockData.ts      # Hardcoded book data
├── types/
│   └── index.ts         # TypeScript interfaces
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app with routing
├── main.tsx             # App entry point
└── index.css            # Global styles
\`\`\`

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Features Breakdown

### Dashboard Page
- Hero banner with featured book
- Top Reviewed Books section
- My Saved Books section
- Genre rows (Fiction, Mystery, Fantasy)
- Horizontal scrolling for all rows

### Book Details Page
- Large cover image
- Book information (title, author, date, genre)
- Tabs for Details and Reviews
- Review cards with ratings
- Similar books section

### Saved Books Page
- Grid layout of saved books
- Responsive grid columns
- Empty state message

## Customization

All book data is hardcoded in `src/data/mockData.ts`. You can easily:
- Add more books
- Create new genres
- Modify reviews
- Change the featured book

## Notes

- No backend required - all data is hardcoded
- No API calls or data fetching
- Pure UI/UX implementation
- Ready to integrate with a real backend when needed
