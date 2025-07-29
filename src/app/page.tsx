import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// This will be replaced with actual components in later phases
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-obsidian">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-obsidian via-luxury-obsidian-light to-luxury-obsidian opacity-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-pink/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-neon-cyan/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-purple/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 gradient-luxury animate-in">
          LuxeVerse
        </h1>
        <p className="text-xl md:text-2xl text-luxury-platinum mb-8 max-w-2xl mx-auto animate-in animation-delay-200">
          Where Luxury Meets Intelligence. Where Shopping Becomes Cinema.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in animation-delay-400">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md btn-luxury hover-lift focus-ring"
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 hover-lift focus-ring"
          >
            Our Story
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-luxury-platinum"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: 'AI Personal Stylist',
      description:
        'Get personalized recommendations powered by advanced AI that understands your unique style.',
      icon: '🤖',
    },
    {
      title: 'Virtual Try-On',
      description:
        'See how items look on you with our AR-powered virtual fitting room.',
      icon: '👗',
    },
    {
      title: 'Sustainable Luxury',
      description:
        'Shop consciously with our curated selection of sustainable and ethical brands.',
      icon: '🌱',
    },
    {
      title: 'Exclusive Access',
      description:
        'Be the first to access limited editions and designer collaborations.',
      icon: '✨',
    },
  ]
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
          Redefining Luxury E-Commerce
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-luxury hover-lift text-center p-8 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-luxury-gold">
                {feature.title}
              </h3>
              <p className="text-luxury-platinum-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-luxury-obsidian to-luxury-obsidian-light">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-neon">
          Ready to Experience the Future?
        </h2>
        <p className="text-xl text-luxury-platinum mb-8 max-w-2xl mx-auto">
          Join thousands of fashion-forward individuals who have discovered a new
          way to shop luxury.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md btn-neon hover-grow focus-ring"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main id="main-content" className="flex-1">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </Suspense>
    </main>
  )
}
