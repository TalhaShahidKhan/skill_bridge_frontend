import {
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { name: "Browse Tutors", href: "/tutors" },
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Become a Tutor", href: "/auth/signup" },
      { name: "Subjects", href: "/tutors" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
    ],
    Support: [
      { name: "Help Center", href: "#" },
      { name: "Safety", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  };

  return (
    <footer className="relative bg-[#0B0F1A] text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2.5 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-all duration-500">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter font-outfit">
                SkillBridge
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-lg font-medium">
              Empowering learners through personalized 1-on-1 tutoring. Connect
              with Bangladesh&apos;s best experts today.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                { icon: Linkedin, href: "#", color: "hover:bg-blue-700" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-3 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 group ${social.color}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Send className="w-24 h-24 -rotate-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-outfit">
                Join our newsletter
              </h3>
              <p className="text-slate-400 mb-8 font-medium">
                Get the latest education tips, tutor spotlights, and platform
                updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Subscribe
                  <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12 pb-20 border-b border-white/5">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 text-[15px] font-semibold"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">
                  talhashahidkhan49@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">+880 1717051054</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm font-semibold">
            © {currentYear} SkillBridge. All rights reserved. Made for the
            pioneers of learning.
          </p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Cookies Settings"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-slate-500 hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
