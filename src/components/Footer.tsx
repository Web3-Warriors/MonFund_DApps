import React from "react";
import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection, HoverAnimation } from "@/components/animations";

export const Footer: React.FC = () => {
  return (
    <AnimatedSection
      as="footer"
      className="bg-card/50 backdrop-blur-sm border-t border-border/40"
      animation="fadeUp"
      delay={0.1}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <AnimatedSection animation="fadeUp" delay={0.1} className="space-y-4">
            <HoverAnimation scale={1.05}>
              <Link to="/">
                <span className="font-space-grotesk font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                  <img src="/logo-long.png" alt="MonFund" className="h-8" />
                </span>
              </Link>
            </HoverAnimation>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform crowdfunding berbasis blockchain untuk mendukung
              program-program inovatif di kampus. Transparan, aman, dan
              terpercaya.
            </p>
            <div className="flex space-x-3">
              <HoverAnimation scale={1.15} y={-3}>
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="w-4 h-4" />
                </Button>
              </HoverAnimation>
              <HoverAnimation scale={1.15} y={-3}>
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="w-4 h-4" />
                </Button>
              </HoverAnimation>
              <HoverAnimation scale={1.15} y={-3}>
                <Button variant="ghost" size="sm" className="p-2">
                  <Mail className="w-4 h-4" />
                </Button>
              </HoverAnimation>
            </div>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection animation="fadeUp" delay={0.2} className="space-y-4">
            <h3 className="font-space-grotesk font-semibold text-lg">
              Tautan Cepat
            </h3>
            <nav className="flex flex-col space-y-2">
              <HoverAnimation scale={1.02} y={-1}>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Beranda
                </Link>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <Link
                  to="/programs"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Semua Program
                </Link>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <Link
                  to="/my-contributions"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Kontribusi Saya
                </Link>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Tentang Kami
                </a>
              </HoverAnimation>
            </nav>
          </AnimatedSection>

          {/* Support */}
          <AnimatedSection animation="fadeUp" delay={0.3} className="space-y-4">
            <h3 className="font-space-grotesk font-semibold text-lg">
              Dukungan
            </h3>
            <nav className="flex flex-col space-y-2">
              <HoverAnimation scale={1.02} y={-1}>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  FAQ
                </a>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <a
                  href="#help"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Panduan
                </a>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Hubungi Kami
                </a>
              </HoverAnimation>
              <HoverAnimation scale={1.02} y={-1}>
                <a
                  href="#privacy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Kebijakan Privasi
                </a>
              </HoverAnimation>
            </nav>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection animation="fadeUp" delay={0.4} className="space-y-4">
            <h3 className="font-space-grotesk font-semibold text-lg">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@monfund.id</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                Dapatkan update terbaru
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <HoverAnimation scale={1.1}>
                  <Button size="sm" variant="secondary">
                    <Heart className="w-4 h-4" />
                  </Button>
                </HoverAnimation>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Divider */}
        <AnimatedSection
          animation="fadeUp"
          delay={0.5}
          className="border-t border-border/40 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>&copy; 2025 MonFund. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center space-x-1">
                <span>Powered by</span>
                <span className="font-semibold text-primary">
                  Monad Network
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <HoverAnimation scale={1.05}>
                <a
                  href="#terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </HoverAnimation>
              <span className="text-muted-foreground">|</span>
              <HoverAnimation scale={1.05}>
                <a
                  href="#privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privasi
                </a>
              </HoverAnimation>
              <span className="text-muted-foreground">|</span>
              <HoverAnimation scale={1.05}>
                <a
                  href="#security"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Keamanan
                </a>
              </HoverAnimation>
            </div>
          </div>
        </AnimatedSection>

        {/* Web3 Badge */}
        <AnimatedSection
          animation="fadeUp"
          delay={0.6}
          className="flex justify-center mt-6"
        >
          <HoverAnimation scale={1.05}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-primary/10 border border-primary/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
                Decentralized & Secure
              </span>
            </div>
          </HoverAnimation>
        </AnimatedSection>
      </div>
    </AnimatedSection>
  );
};
