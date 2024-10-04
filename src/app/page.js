//import '../globals.css'
"use client";
import '../app/globals.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
      <div className="max-w-4xl mx-auto text-center p-6">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to AI Features</h1>
        <p className="text-lg text-white mb-8">
          Explore our advanced AI applications designed to transform your content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* News Anchor Feature */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-black mb-2">News Anchor</h2>
            <p className="text-balck-200 mb-4">
              Generate professional news presentations with a virtual news anchor.
            </p>
            <Link href="/pages/news-anchor" legacyBehavior>
              <a className="inline-black px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Try it Now
              </a>
            </Link>
          </div>

          {/* Video to Cartoon Feature */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-balck mb-2">Video to Cartoon</h2>
            <p className="text-black mb-4">
              Transform your videos into fun cartoon animations effortlessly.
            </p>
            <Link href="/video-to-cartoon" legacyBehavior>
              <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Try it Now
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
