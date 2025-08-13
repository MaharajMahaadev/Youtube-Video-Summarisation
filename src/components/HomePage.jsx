import React from 'react';
import { Video, Brain, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold text-center text-[#282828] mb-8 leading-tight">
            Summarize YouTube Videos <br />with AI
          </h1>
          <p className="text-xl text-center text-[#282828]/80 mb-16 max-w-2xl mx-auto">
            Get concise, accurate summaries of any YouTube video in seconds using our advanced AI technology.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Video,
                title: "Input Video URL",
                description: "Simply paste any YouTube video URL and let our system do the summarisation work for you."
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Our advanced AI model analyzes the video content for key information. The AIML model will take care of the summarisation of the video."
              },
              {
                icon: FileText,
                title: "Get Summary",
                description: "Receive a well-structured summary of the video's main points and the most important aspects in a well mannered layout for easy understanding."
              }
            ].map((item, index) => (
              <div key={index} className="glass glass-hover rounded-xl p-8">
                <div className="w-14 h-14 bg-[#FF0000]/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="text-[#FF0000]" size={28} />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-[#282828]">{item.title}</h2>
                <p className="text-[#282828]/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-3 bg-[#FF0000] text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-lg"
            >
              Try It Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>

      <footer className="glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <p className="text-[#282828]/70">Created by Maharaj Mahaadev</p>
        </div>
      </footer>
    </div>
  );
}