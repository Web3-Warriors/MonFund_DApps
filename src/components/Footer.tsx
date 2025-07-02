import React from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  Heart,
  Github,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-space-grotesk font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                MonFund
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform crowdfunding berbasis blockchain untuk mendukung
              program-program inovatif di kampus. Transparan, aman, dan
              terpercaya.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-space-grotesk font-semibold text-lg">
              Tautan Cepat
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Beranda
              </Link>
              <Link
                to="/programs"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Semua Program
              </Link>
              <Link
                to="/my-contributions"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Kontribusi Saya
              </Link>
              <a
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Tentang Kami
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-space-grotesk font-semibold text-lg">
              Dukungan
            </h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="#faq"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                FAQ
              </a>
              <a
                href="#help"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Panduan
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Hubungi Kami
              </a>
              <a
                href="#privacy"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Kebijakan Privasi
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
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
                <Button size="sm" variant="secondary">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mt-8 pt-8">
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
              <a
                href="#terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Syarat & Ketentuan
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href="#privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privasi
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href="#security"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Keamanan
              </a>
            </div>
          </div>
        </div>

        {/* Web3 Badge */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-primary/10 border border-primary/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              Decentralized & Secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
