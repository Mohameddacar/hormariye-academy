"use client";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Star, Users, Zap, CheckCircle, Play } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Only redirect if user is already signed in and clicks a button
  const handleSignIn = () => {
    if (isSignedIn) {
      router.push('/workspace');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hormariye Academy
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleSignIn}
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Go to Dashboard
                </Button>
                <UserButton />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="cursor-pointer">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="cursor-pointer">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Unlock Your Potential with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Online Learning
            </span>{" "}
            🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience personalized learning paths, instant feedback, and intelligent insights that adapt to your pace and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Button 
                size="lg" 
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              >
                Go to Dashboard
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer">
                  Start Free Trial
                </Button>
              </SignUpButton>
            )}
            <Button size="lg" variant="outline" className="flex items-center gap-2 cursor-pointer">
              <Play className="w-4 h-4" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes our platform the future of education
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Online Personalization</h3>
              <p className="text-gray-600">Tailored learning paths based on your progress and goals.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
              <p className="text-gray-600">Receive immediate feedback on your assignments and quizzes.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600">Comprehensive analytics to monitor your learning journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey? 🚀
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners achieving their goals with our AI platform.
          </p>
          {isSignedIn ? (
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleSignIn}
              className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer"
            >
              Go to Dashboard
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer">
                Sign Up for Free
              </Button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say 😊
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Mohamed Isak</h4>
                  <p className="text-gray-600">Student</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The feedback has been a game-changer for my learning. It's like having a personal tutor!"
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Mohamed Dacar</h4>
                  <p className="text-gray-600">Educator</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Integrating feedback into my teaching has never been easier. The platform is intuitive and powerful."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hormariye Academy Online Learning</h3>
              <p className="text-gray-400">
                Empowering the next generation of learners with cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">Twitter</Link>
                <Link href="#" className="text-gray-400 hover:text-white">LinkedIn</Link>
                <Link href="#" className="text-gray-400 hover:text-white">GitHub</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Hormariye Academy Online Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
