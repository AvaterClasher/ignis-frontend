# Ignis Frontend

A modern web application for code execution and job management, built with Next.js, TypeScript, and Clerk authentication.

## 🚀 Features

- **Code Playground**: Execute Python and Go code with real-time output
- **User Authentication**: Secure authentication via Clerk
- **API Key Management**: Create and manage API keys for backend access
- **Webhook Integration**: Configure webhooks for job status notifications
- **Dark/Light Theme**: Modern UI with theme switching
- **Responsive Design**: Mobile-first responsive design
- **Real-time Execution**: Live code execution with status polling

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: Clerk
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **Code Editor**: Monaco Editor
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with CSS Variables
- **Icons**: Lucide React, Tabler Icons
- **HTTP Client**: Axios
- **Package Manager**: pnpm
- **Linting/Formatting**: Biome

## 📋 Prerequisites

- Node.js 18+
- pnpm
- Backend API server running on `http://localhost:8080`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ignis-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables in `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # The URL where your Ignis backend API is running
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/       # Sign-in page
│   │   └── sign-up/       # Sign-up page
│   ├── (home)/            # Protected routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── playground/    # Code execution playground
│   │   ├── api-keys/      # API key management
│   │   ├── webhooks/      # Webhook management
│   │   └── layout.tsx     # Protected layout
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.tsx   # Main navigation sidebar
│   ├── navbar.tsx        # Top navigation bar
│   └── theme-*           # Theme related components
├── services/             # API service functions
│   ├── jobService.ts     # Code execution jobs
│   ├── apiKeyService.ts  # API key management
│   └── webhookService.ts # Webhook management
├── providers/           # React providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── middleware.ts        # Next.js middleware
```

## 🎯 Core Features

### Code Playground
- Support for Python and Go languages
- Monaco Editor with syntax highlighting
- Real-time code execution
- Live output display (stdout/stderr)
- Execution status tracking

### API Key Management
- Create API keys with custom expiration
- View and manage existing keys
- Rate limiting configuration
- Secure key storage

### Webhook Integration
- Configure webhooks for job events
- Support for `job.completed` and `job.failed` events
- Event delivery tracking
- Retry mechanism for failed deliveries

## 🏗 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linting

# Code Quality
pnpm lint:fix     # Auto-fix linting issues
```

## 🔒 Authentication

The application uses Clerk for authentication with the following routes:
- `/sign-in` - User sign-in
- `/sign-up` - User registration
- All other routes require authentication

## 🌐 API Integration

The frontend communicates with a backend API server. Key endpoints:

- `POST /api/v1/jobs` - Execute code
- `GET /api/v1/jobs/job_id/{id}` - Get job status
- `GET /api/v1/api-keys` - List API keys
- `POST /api/v1/api-keys` - Create API key
- `GET /api/v1/webhooks` - List webhooks
- `POST /api/v1/webhooks` - Create webhook

## 🎨 Theming

The application supports both dark and light themes:
- Default theme: Dark
- System theme detection
- Manual theme switching via theme switcher component

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
1. Build the application: `pnpm build`
2. Serve the `.next` folder with any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🔧 Development Notes

- Uses Biome for fast linting and formatting
- Turbopack for faster development builds
- TypeScript for type safety
- Follows Next.js 15 App Router conventions
- Responsive design with Tailwind CSS
