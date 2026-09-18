export default function Landing() {
  const handleGetStarted = () => {
    // This will be handled by parent component to show login
    window.dispatchEvent(new CustomEvent('showLogin'));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-bright/80 backdrop-blur-md shadow-sm border-b border-outline">
        <div className="max-w-container-max mx-auto px-page-gutter-mobile md:px-page-gutter-desktop flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
            <span className="text-card-title font-black text-primary">DugsiHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-primary text-label-sm" href="#home">
              Home
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#features">
              Features
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#about">
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 rounded-pill border border-outline text-primary font-bold hover:bg-surface-soft transition-all duration-200 active:scale-95"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 rounded-pill bg-primary text-on-primary font-bold shadow-md hover:bg-primary-strong transition-all duration-200 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-container-max mx-auto px-page-gutter-mobile md:px-page-gutter-desktop grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <h1 className="font-display text-hero-title-mobile md:text-hero-title text-on-surface tracking-tight">
                Empower Your School with <span className="text-primary">DugsiHub</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-xl">
                A unified platform designed to streamline administration, enhance instructional clarity, and boost
                operational efficiency. Experience soft precision in educational management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="h-12 px-8 rounded-pill bg-primary text-on-primary font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="h-12 px-8 rounded-pill border border-outline text-primary font-bold text-lg hover:bg-surface-soft transition-all active:scale-95 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-outline bg-white p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-surface-container rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">people</span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-on-surface">2,847</div>
                      <div className="text-sm text-on-surface-variant">Active Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-container rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">groups</span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-on-surface">124</div>
                      <div className="text-sm text-on-surface-variant">Teaching Staff</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-container rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-on-surface">98.5%</div>
                      <div className="text-sm text-on-surface-variant">Attendance Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-section-gap-mobile md:py-section-gap-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-page-gutter-mobile md:px-page-gutter-desktop">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">Complete School Management</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Everything you need to run a modern educational institution, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group p-8 rounded-xl bg-surface-bright border border-outline hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">account_circle</span>
                </div>
                <h4 className="text-card-title mb-2">Student Portal</h4>
                <p className="text-on-surface-variant text-sm mb-4">
                  Access attendance, grades, and schedules for individual students.
                </p>
              </div>

              <div className="group p-8 rounded-xl bg-surface-bright border border-outline hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <h4 className="text-card-title mb-2">Staff Directory</h4>
                <p className="text-on-surface-variant text-sm mb-4">
                  Manage instructor profiles, availability, and payroll settings.
                </p>
              </div>

              <div className="group p-8 rounded-xl bg-surface-bright border border-outline hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <h4 className="text-card-title mb-2">Finance Center</h4>
                <p className="text-on-surface-variant text-sm mb-4">
                  Process fee payments, track expenses, and view fiscal reports.
                </p>
              </div>

              <div className="group p-8 rounded-xl bg-surface-bright border border-outline hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">campaign</span>
                </div>
                <h4 className="text-card-title mb-2">Notice Board</h4>
                <p className="text-on-surface-variant text-sm mb-4">
                  Broadcast announcements to parents, students, and teachers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-page-gutter-mobile md:px-page-gutter-desktop py-section-gap-desktop">
          <div className="bg-primary rounded-xl p-8 md:p-16 text-center text-on-primary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-section-title mb-6">Ready to Transform Your School?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
                Join over 500 institutions managing their operations with modern precision and efficiency.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="h-14 px-10 rounded-pill bg-white text-primary font-bold text-lg hover:bg-surface-container-highest transition-all active:scale-95 shadow-lg"
                >
                  Start Free Trial
                </button>
                <button className="h-14 px-10 rounded-pill border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-panel text-primary-fixed">
        <div className="max-w-container-max mx-auto px-page-gutter-mobile md:px-page-gutter-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant/20">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed">school</span>
              <span className="text-primary-fixed font-black text-xl">DugsiHub</span>
            </div>
            <p className="text-label-sm text-dark-on-surface-muted text-center md:text-left max-w-xs">
              © 2024 DugsiHub School Management. All rights reserved. Leading the way in educational operations.
            </p>
          </div>
          <div className="flex gap-8">
            <a className="text-dark-on-surface-muted hover:text-white text-label-sm transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-dark-on-surface-muted hover:text-white text-label-sm transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-dark-on-surface-muted hover:text-white text-label-sm transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
