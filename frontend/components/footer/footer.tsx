"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Main Footer Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <span className="w-8 h-8 from-yellow-500 to-amber-600 bg-gradient-to-tl mr-3 rounded"></span>
                <span className="text-2xl font-bold">PratikCV</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Yapay zeka destekli CV oluşturma platformumuz ile hayallerinizdeki işe kavuşun. 
                Hızlı, kolay ve profesyonel CV'ler oluşturun.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>info@pratikcv.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>+90 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>İstanbul, Türkiye</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Hızlı Linkler</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/istatistikler" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    İstatistikler
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    S.S.S.
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Destek</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Yardım Merkezi
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Bizimle İletişime Geçin
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-yellow-500 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Haberdar Olun</h3>
                <p className="text-gray-300">
                  Yeni özellikler ve kariyer ipuçları için bültenimize abone olun.
                </p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 font-medium">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 PratikCV. Tüm hakları saklıdır. | Designed by Enes Ataç
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-yellow-500 transition-all duration-300 group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-yellow-500 transition-all duration-300 group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-yellow-500 transition-all duration-300 group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-yellow-500 transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
