# Study App

A modern study application built with Next.js, featuring AI-powered study assistance, interactive quizzes, and real-time collaboration.

## Features

- 🤖 AI Study Assistant
- 📚 Interactive Quizzes and Flashcards
- 💬 Real-time Chat
- 👥 Study Groups
- 🎯 Progress Tracking
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth.js
- PostgreSQL
- Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/studyapp.git
   cd studyapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="your_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── groups/            # Study group pages
│   ├── resources/         # Resource sharing pages
│   └── quizzes/          # Quiz system pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
└── types/                # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [HeadlessUI](https://headlessui.dev/)
