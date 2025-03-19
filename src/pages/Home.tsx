import React, { useState, useEffect } from 'react';
import { Moon, Sun, Code, Timer, Braces, Binary, Network, GitGraph, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const complexityData = [
  { name: 'O(1)', value: 1 },
  { name: 'O(log n)', value: 2 },
  { name: 'O(n)', value: 4 },
  { name: 'O(n log n)', value: 5 },
  { name: 'O(n²)', value: 8 },
];

const categories = [
  { icon: Timer, title: "Time Complexity", description: "Understand how algorithms scale with input size" },
  { icon: Braces, title: "Space Complexity", description: "Learn about memory usage patterns" },
  { icon: Binary, title: "Binary Operations", description: "Master bit manipulation techniques" },
  { icon: Network, title: "Graph Algorithms", description: "Explore network and tree traversals" },
  { icon: GitGraph, title: "Dynamic Programming", description: "Solve complex problems efficiently" },
];

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-amber-500 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="w-6 h-6 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
        )}
      </button>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Logo Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Code className="w-48 h-48 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="relative text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient">
            AlgoLens
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Visualize algorithms like never before
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link 
            to="/algorithm-viewer"
            className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:scale-105 transition-transform duration-300"
          >
            <Code className="h-8 w-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Algorithm Viewer</h3>
            <p className="text-gray-600 dark:text-gray-300">Visualize algorithms in real-time with step-by-step execution</p>
          </Link>
          <Link 
            to="/race-mode"
            className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:scale-105 transition-transform duration-300"
          >
            <Play className="h-8 w-8 mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Race Mode</h3>
            <p className="text-gray-600 dark:text-gray-300">Compare different algorithms head-to-head in real-time</p>
          </Link>
        </div>

        {/* Complexity Chart */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-16 backdrop-blur-sm bg-opacity-90">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Time Complexity Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complexityData}>
                <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#4B5563'} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#4B5563'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" fill={isDark ? '#60A5FA' : '#3B82F6'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div 
              key={category.title}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <category.icon className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium mb-1 text-gray-800 dark:text-white">{category.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;