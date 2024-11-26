import { Cloud, Github, Menu, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import { useLocalStorage } from '../useLocalStorage';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <header className="w-full bg-black backdrop-blur-md ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <img
              src="https://cdn.prod.website-files.com/669061ee3adb95b628c3acda/66acd2a968324f3e610c1cae_zephyr%20logo.svg"
              alt="Zephyr Cloud"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-gray-400">
            <a
              href="https://docs.zephyr-cloud.io/"
              className="hover:text-gray-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/ZephyrCloudIO/zephyr-examples"
              className="inline-flex items-center hover:text-gray-600 transition-colors"
            >
              <Github className="h-5 w-5 mr-1" />
              <span>GitHub</span>
            </a>
            <a
              href="https://app.zephyr-cloud.io"
              className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-100">
            <a
              href="https://docs.zephyr-cloud.io/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/ZephyrCloudIO/zephyr-examples"
              className="inline-flex items-center text-gray-100 hover:text-gray-200 transition-colors"
            >
              <Github className="h-5 w-5 mr-1" />
              <span>GitHub</span>
            </a>
            <a
              href="https://app.zephyr-cloud.io"
              className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
