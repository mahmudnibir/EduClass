# StudyApp - Collaborative Learning Platform

A web-based platform that allows students to collaborate in real-time, join study groups, share resources, track progress, and schedule study sessions.

## Features

- **User Authentication**
  - Email/Password and Google authentication
  - User profiles and settings

- **Study Groups**
  - Create and join study groups
  - Filter groups by subjects/topics
  - Real-time chat communication

- **Collaborative Tools**
  - Shared whiteboard for real-time drawing
  - Document sharing and collaboration
  - Real-time code editor (coming soon)

- **Study Session Management**
  - Schedule study sessions
  - Calendar integration
  - Session reminders

- **Progress Tracking**
  - Study time logging
  - Achievement system
  - Performance analytics

- **Quiz System**
  - Create and take practice quizzes
  - Track quiz scores
  - Review quiz history

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - HeadlessUI
  - Socket.io Client

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - SQLite Database
  - NextAuth.js
  - Socket.io

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
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [HeadlessUI](https://headlessui.dev/)
