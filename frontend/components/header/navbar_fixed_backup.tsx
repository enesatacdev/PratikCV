'use client';

import React, { useState, useRef, useEffect } from 're            <Link
              href="/hakkimizda"
              className={`hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/hakkimizda') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/premium"
              className={`hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/premium') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Premium
            </Link>rom 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, FileText, User, LogOut, Settings, Plus } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const isActive = (path: string) => pathname === path;

  // Kullanıcı menüsünü dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="absolute top-0 w-full z-50 mt-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PratikCV</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/hakkimizda"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/hakkimizda') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/istatistikler"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/istatistikler') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              İstatistikler
            </Link>
            <Link
              href="/sss"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/sss') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              S.S.S.
            </Link>
            <Link
              href="/iletisim"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/iletisim') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
            >
              İletişim
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            ) : isAuthenticated && user ? (
              <>
                <Link
                  href="/create-cv"
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  CV Oluştur
                </Link>
                
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        <span className={`px-2 py-1 text-white text-xs font-bold rounded-full shadow-sm ${
                          user.premiumCredits && user.premiumCredits > 0 
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse' 
                            : 'bg-gray-500'
                        }`}>
                          {user.premiumCredits || 0} KREDİ
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                        <span className="text-xs text-gray-600 font-medium">
                          {user.premiumCredits && user.premiumCredits > 0 ? 'Premium Aktif' : 'Ücretsiz Plan'}
                        </span>
                      </div>
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${user.premiumCredits && user.premiumCredits > 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-xs text-gray-600">
                                {user.premiumCredits && user.premiumCredits > 0 ? 'Premium Aktif' : 'Ücretsiz Plan'}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="block text-xs text-gray-500">Kalan Kredi</span>
                            <span className={`px-3 py-1 text-white text-sm font-bold rounded-full shadow-sm ${
                              user.premiumCredits && user.premiumCredits > 0
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                : 'bg-gray-500'
                            }`}>
                              {user.premiumCredits || 0}
                            </span>
                          </div>
                          {(!user.premiumCredits || user.premiumCredits === 0) && (
                            <Link 
                              href="/premium"
                              className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm hover:from-purple-600 hover:to-purple-700 transition-all"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Premium Al
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <Link
                          href="/my-cvs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          CV'lerim
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Profil Ayarları
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/hakkimizda"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/hakkimizda') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              href="/istatistikler"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/istatistikler') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              İstatistikler
            </Link>
            <Link
              href="/sss"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/sss') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              S.S.S.
            </Link>
            <Link
              href="/iletisim"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/iletisim') 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-700 hover:text-yellow-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-base font-medium text-gray-900">{user.name}</div>
                          <span className={`px-2 py-1 text-white text-xs font-semibold rounded-full shadow-sm ${
                            user.premiumCredits && user.premiumCredits > 0 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                              : 'bg-gray-500'
                          }`}>
                            {user.premiumCredits || 0} KREDİ
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${user.premiumCredits && user.premiumCredits > 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-gray-600">
                            {user.premiumCredits && user.premiumCredits > 0 ? 'Premium Aktif' : 'Ücretsiz Plan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/create-cv"
                    className="block mx-3 mb-3 px-4 py-2 bg-yellow-500 text-white text-center font-medium rounded-lg hover:bg-yellow-600"
                    onClick={() => setIsOpen(false)}
                  >
                    CV Oluştur
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/dashboard') 
                        ? 'text-yellow-600 bg-yellow-50' 
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-cvs"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/my-cvs') 
                        ? 'text-yellow-600 bg-yellow-50' 
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    CV'lerim
                  </Link>
                  <Link
                    href="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/profile') 
                        ? 'text-yellow-600 bg-yellow-50' 
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Profil Ayarları
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block mx-3 mt-2 px-4 py-2 bg-yellow-500 text-white text-center font-medium rounded-lg hover:bg-yellow-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}