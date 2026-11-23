"use client";
import { useState } from "react";
import LoginDialog from "../components/login/loginComponent";
import SignUpDialog from "../components/login/SignUpDialog";

import ThemeToggle from "../components/login/ThemeToggle";
export default function Home() {
  const [openlogInDialog, setOpenLogInDialog] = useState<boolean>(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-10 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
              </svg>
            </div>
            <span className="text-base font-medium text-foreground">
              Swift Clinic
            </span>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />

            <button
              onClick={() => setOpenLogInDialog(true)}
              className="px-5 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition"
            >
              Login
            </button>
            <button
              onClick={() => setSignUpOpen(true)}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center text-center px-6 pt-20 pb-12">
          <h1 className="text-5xl font-medium text-foreground leading-tight mb-4">
            Manage your clinic
            <br />
            <span className="text-accent">with ease</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10">
            An all-in-one platform to manage patients, appointments, and doctors
            in one place
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSignUpOpen(true)}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Get Started
            </button>
          </div>
        </main>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 pb-16 max-w-4xl mx-auto w-full">
          {[
            {
              title: "Patient Management",
              desc: "Complete medical records, easy to access anytime",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-accent"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              ),
            },
            {
              title: "Appointment Booking",
              desc: "Smart scheduling with automatic reminders",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-accent"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              title: "Reports & Analytics",
              desc: "Accurate data for better decisions",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-accent"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <p className="font-medium text-card-foreground mb-1">{f.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center py-5 border-t border-border text-xs text-muted-foreground">
          Swift Clinic 2026 — All rights reserved
        </footer>
      </div>
      <SignUpDialog isOpen={signUpOpen} onClose={() => setSignUpOpen(false)} />
      <LoginDialog
        isOpen={openlogInDialog}
        onClose={() => setOpenLogInDialog(false)}
      />
    </>
  );
}
