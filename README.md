# DugsiHub - Modern School Management System

DugsiHub is a production-ready school management platform built with React, Vite, TypeScript, and Convex. It provides comprehensive tools for managing students, teachers, classes, exams, payments, library, and more.

## Features

- 🎓 **Student Management** - Track student records, attendance, and performance
- 👨‍🏫 **Teacher Portal** - Manage staff, assignments, and timetables
- 📚 **Library System** - Book inventory and issue tracking
- 💰 **Finance Module** - Fee collection, payments, and financial reports
- 📝 **Exam & Grading** - Create exams, record marks, and generate report cards
- 📢 **Notice Board** - Announcements and event management
- 🔒 **Role-Based Access** - Super Admin, Admin, Accountant, Librarian, Teacher, Student, Parent
- 📊 **Dashboard & Analytics** - Real-time insights and reporting
- 🔐 **Secure Authentication** - Session-based auth with Convex

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Convex (hosted real-time database)
- **Design System**: Custom DugsiHub design tokens with professional blue palette
- **Icons**: Material Symbols

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex Backend

Authenticate with Convex:

```bash
npx convex login
```

Create a new Convex project or select an existing one in the [Convex dashboard](https://dashboard.convex.dev).

### 3. Configure Environment

Create a `.env.local` file in the root directory:

```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### 4. Deploy Convex Functions

Deploy the schema and backend functions:

```bash
npm run convex:deploy
```

### 5. Seed Initial Data (Optional)

Open the Convex dashboard and run the `seed` mutation to create demo users and data:

```javascript
// In Convex dashboard, run:
seed({})
```

This creates test accounts:
- **Super Admin**: superadmin@dugsihub.com / admin123
- **Admin**: admin@dugsihub.com / admin123
- **Teacher**: amina@dugsihub.com / admin123
- **Student**: ayaan@dugsihub.com / admin123
- **Parent**: hassan@dugsihub.com / admin123
- **Accountant**: accountant@dugsihub.com / admin123
- **Librarian**: librarian@dugsihub.com / admin123

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your app.

## Production Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_CONVEX_URL`: Your Convex deployment URL

### Deploy Convex with CI/CD

For automated deployments, use a Convex deploy key:

```bash
CONVEX_DEPLOY_KEY=your-production-deploy-key npm run convex:deploy
```

Get your deploy key from the Convex dashboard under Settings → Deploy Keys.

## Project Structure

```
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication
│   ├── users.ts           # User management
│   ├── students.ts        # Student records
│   ├── classes.ts         # Class management
│   ├── exams.ts           # Exam and grading
│   ├── payments.ts        # Fee collection
│   ├── library.ts         # Library system
│   └── seed.ts            # Initial data seeding
├── src/
│   ├── pages/             # React pages
│   │   ├── Landing.tsx    # Landing page
│   │   ├── Login.tsx      # Login page
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Students.tsx   # Student management
│   │   ├── Users.tsx      # User management
│   │   └── ...           # Other modules
│   ├── lib/               # Utilities and types
│   ├── index.css          # DugsiHub design system
│   └── main.tsx           # App entry point
└── tailwind.config.js     # Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run convex:deploy` - Deploy Convex backend
- `npm run convex:dashboard` - Open Convex dashboard

## Design System

DugsiHub uses a professional blue color palette with custom design tokens:

- **Primary**: `#004ac6` (Professional Blue)
- **Background**: `#f6f8fb` (Light Gray)
- **Typography**: Roboto & Inter fonts
- **Components**: Pre-styled with consistent spacing, shadows, and animations

All styles are in `src/index.css` using CSS custom properties.

## Verification

```bash
npm run lint
npm run build
```

## License

MIT
