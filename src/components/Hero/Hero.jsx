import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const Hero = ({ user }) => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById('books-section');
    if (booksSection) {
      booksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Full Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Welcome to{" "}
                  <span
                    className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    style={{ fontFamily: "Caveat, cursive" }}
                  >
                    Library Management
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                  Discover, borrow, and manage books with our modern library
                  system. Access thousands of books, track your loans, and enjoy
                  a seamless reading experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={scrollToBooks}
                  size="lg"
                  className="text-lg px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Books
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
