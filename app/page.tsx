import { authClient } from "@/api/betterAuth";
import FeaturedTutors from "@/components/home/FeaturedTutors";
import {
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  MessageCircle,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default async function HomePage() {
  const h = await headers();
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: h },
  });

  const features = [
    {
      icon: Users,
      title: "Expert Tutors",
      description:
        "Connect with qualified and experienced tutors across various subjects and skill levels.",
      color: "bg-linear-to-br from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Book sessions that fit your schedule with our easy-to-use booking system.",
      color: "bg-linear-to-br from-purple-500 to-purple-600",
    },
    {
      icon: Award,
      title: "Verified Profiles",
      description:
        "All tutors are verified and rated by students to ensure quality education.",
      color: "bg-linear-to-br from-emerald-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed session history and reviews.",
      color: "bg-linear-to-br from-amber-500 to-amber-600",
    },
  ];

  const stats = [
    { value: "500+", label: "Expert Tutors" },
    { value: "10,000+", label: "Sessions Completed" },
    { value: "50+", label: "Subjects Covered" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "SSC Student",
      content:
        "SkillBridge helped me improve my math grades significantly. The tutors are amazing!",
      rating: 5,
    },
    {
      name: "Mohammad Khan",
      role: "HSC Student",
      content:
        "The platform is very user-friendly and the tutors are highly professional.",
      rating: 5,
    },
    {
      name: "Fatima Rahman",
      role: "University Student",
      content:
        "I found the perfect tutor for my advanced physics course. Highly recommend!",
      rating: 5,
    },
  ];

  const dashboardPath = session
    ? session.user.role === "ADMIN"
      ? "/admin"
      : session.user.role === "TUTOR"
        ? "/tutor"
        : "/student"
    : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-semibold">
                Bangladesh&apos;s Premier Tutoring Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              Learn from the{" "}
              <span className="bg-linear-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Best Tutors
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto font-medium">
              Connect with expert tutors, schedule flexible sessions, and
              achieve your academic goals with SkillBridge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {dashboardPath ? (
                <Link
                  href={dashboardPath}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/tutors"
                    className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Find a Tutor
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl sm:text-4xl font-black mb-2">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-sm font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We provide everything you need for a successful learning
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        }
      >
        <FeaturedTutors />
      </Suspense>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description:
                  "Sign up as a student or tutor and complete your profile with your details and preferences.",
              },
              {
                step: "2",
                title: "Find the Perfect Match",
                description:
                  "Browse through verified tutors, check their ratings, and find the one that fits your needs.",
              },
              {
                step: "3",
                title: "Start Learning",
                description:
                  "Book sessions, attend classes, and track your progress all in one place.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
              >
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="pt-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Hear from our community of learners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their grades
            with SkillBridge&apos;s expert tutors.
          </p>
          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
              >
                Sign Up Now
              </Link>
              <Link
                href="/tutors"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                Browse Tutors
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
