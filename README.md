# Skill Bridge Frontend

![Skill Bridge Logo](/public/skillbridge_logo.png)

**Skill Bridge** is a modern tutoring platform that connects students with expert tutors. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, it offers a seamless, premium experience for both learning and teaching.

---

## 🌟 Features

### For Students

- **Smart Tutor Discovery**: Browse tutors with advanced filters (category, price, availability, featured).
- **Seamless Booking**: Easy scheduling for tutoring sessions.
- **Review System**: Rate and review tutors after completed sessions.
- **Personal Dashboard**: Track upcoming bookings and session history.

### For Tutors

- **Profile Management**: Showcase expertise, subjects, and pricing.
- **Availability Control**: Manage teaching hours and booking status.
- **Earnings Tracking**: Monitor performance and reviews.
- **Session Management**: Handle incoming student requests and mark sessions as complete.

### For Admins

- **Analytics Dashboard**: High-level overview of platform growth and metrics.
- **Moderation**: Manage users, tutors, and categories.
- **User Management**: Control user roles and account statuses.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Custom premium UI components with glassmorphism and modern aesthetics.
- **State Management**: React `useActionState` and Server Actions for form handling.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- NPM / PNPM / Yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TalhaShahidKhan/skill_bridge.git
   cd skill_bridge/skill_bridge_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_AUTH_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📦 Production Deployment

The application is optimized for deployment on **Vercel**.

### Build

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Set the environment variables in the Vercel project settings.
4. Click **Deploy**.

---

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Student, Tutor, Admin, Auth cores).
- `api/`: API client and endpoint handlers.
- `actions/`: Server Actions for data mutations.
- `lib/`: Utility functions, shared types, and constants.
- `public/`: Static assets and images.

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  <strong>Skill Bridge</strong> — Bridging knowledge and growth through learning.
</p>
