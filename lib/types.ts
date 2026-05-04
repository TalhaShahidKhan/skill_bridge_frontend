export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING_PAYMENT";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type Group = "NONE" | "SCIENCE" | "HUMANITIES" | "BUSINESS_STUDIES";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  studentId: string;
  userId: string;
  class: string;
  institute: string;
  address: string;
  phone: string;
  bio: string | null;
  profilePic: string | null;
  group: string;
  user?: User;
}

export interface TutorProfile {
  tutorId: string;
  userId: string;
  subjects: string[];
  experience: string;
  address: string;
  phone: string;
  bio: string | null;
  profilePic: string | null;
  institute: string | null;
  group: string;
  availableFrom: string | null;
  availableTo: string | null;
  isAvailable: boolean;
  pricePerDay: string;
  categoryId: string;
  user?: User;
  category?: Category;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    student?: {
      user: {
        name: string;
        image: string | null;
      };
    };
  }[];
  avgRating?: number;
  reviewsCount?: number;
  _count: {
    reviews: number;
    bookings: number;
  };
}

export interface Category {
  categoryId: string;
  name: string;
  subjects?: string[];
  _count?: {
    tutors: number;
  };
}

export interface Booking {
  id: string;
  bookingId?: string;
  studentId: string;
  tutorId: string;
  status: BookingStatus;
  date: string;
  time: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  meetingLink?: string | null;
  student?: StudentProfile;
  tutor?: TutorProfile;
  review?: Review | null;
}

export interface Review {
  id: string;
  reviewId?: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student?: StudentProfile;
  tutor?: TutorProfile;
}

export interface PaginatedResponse<T> {
  data?: T[];
  [key: string]: unknown; // To allow for 'bookings', 'sessions', etc. and 'pagination'
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Analytics {
  range: { from: string; to: string };
  totals: {
    users: number;
    students: number;
    tutors: number;
    categories: number;
    bookings: number;
    reviews: number;
    totalRevenue: number;
  };
  users: {
    byRole: { role: string; count: number }[];
    byStatus: { status: string; count: number }[];
  };
  bookings: {
    byStatus: { status: string; count: number }[];
    perDay: { day: string; count: number }[];
  };
  reviews: {
    averageRating: number;
    count: number;
  };
}

export interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    userAgent: string | null;
    ipAddress: string | null;
  };
}
export interface Tutor {
  tutorId: string;
  subject?: string;
  subjects?: string[];
  experience: number;
  pricePerDay: number;
  avgRating?: number;
  reviewsCount?: number;
  bio?: string | null;
  institute?: string | null;
  address?: string;
  availableFrom?: string | null;
  availableTo?: string | null;
  user?: {
    name: string;
    image: string | null;
    email?: string;
  };
  category?: {
    name: string;
  };
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}

export interface TutorStats {
  totalSessions: number;
  confirmedSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  averageRating: number;
  totalReviews: number;
}

export interface StudentStats {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalReviews: number;
}

export interface Payment {
  paymentId: string;
  studentId: string;
  tutorId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
  student?: StudentProfile;
  tutor?: TutorProfile;
  booking?: Booking;
}

export interface ActionState {
  success: boolean;
  error?: string;
  data?: unknown;
}

