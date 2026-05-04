# Skill Bridge Frontend

![Skill Bridge Logo](public/logo.png)

**Skill Bridge** is a modern tutoring platform that connects students with expert tutors. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, it offers a seamless, premium experience for both learning and teaching.

---

## 🌟 Features

### For Students

- **Smart Tutor Discovery**: Browse tutors with advanced filters.
- **Secure Stripe Payments**: Upfront payment for sessions using Stripe Checkout.
- **Session Tracking**: Monitor confirmed bookings and session history.
- **Review System**: Rate tutors after successful completion.

### For Tutors

- **Payment Dashboard**: View transaction history and earnings in a dedicated, premium UI.
- **Professional Presence**: Showcase expertise, subjects, and pricing.
- **Availability Control**: Manage teaching hours and real-time booking status.
- **Session Management**: Handle student requests and session completion.

### For Admins (God Mode)

- **Advanced Analytics**: Real-time tracking of users, bookings, and platform revenue.
- **Financial Auditing**: Complete oversight of all transactions and payments.
- **User Moderation**: Manage accounts, roles, and suspension states.
- **Force Actions**: Ability to delete bookings and moderate profiles directly.

### Security & Account

- **HTML Email Notifications**: Modern email templates for verification and resets.
- **Password Management**: Change password from profile and secure reset flow.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_AUTH_URL=http://localhost:8000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📦 Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

- `app/`: Pages and layouts.
- `components/`: UI components (including new Payment and Security modules).
- `api/`: API client handlers.
- `actions/`: Server Actions for mutations.
- `lib/`: Utilities, types, and validations.

---

## 📄 License

ISC

---

<p align="center">
  <strong>Skill Bridge</strong> — Bridging knowledge and growth through learning.
</p>
