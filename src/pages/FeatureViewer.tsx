import React, { useState, useEffect } from 'react';
import { Timer, ArrowUpDown, Search, RefreshCw, ChevronDown, Network, Trees as Tree, GitBranch, Workflow, Sun, Moon,ArrowLeft } from 'lucide-react';

type AlgorithmCategory = 'sorting' | 'searching' | 'graph';
type Theme = 'light' | 'dark';

interface AlgorithmResult {
  name: string;
  time: number;
  comparisons: number;
  timeComplexity: string;
  theoreticalTime: number;
  icon: React.ReactNode;
  description: string;
  category: AlgorithmCategory;
}

function App() {
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(50);
  const [arraySize, setArraySize] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'time' | 'comparisons' | 'theoretical'>('time');
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>('sorting');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    generateNewArray();
  }, [arraySize, activeCategory]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleBack = () => {
    window.history.back();
  };


  const generateNewArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100)
    );
    setArray(newArray);
    runAlgorithms(newArray);
  };

  const calculateTheoreticalTime = (n: number, complexity: string): number => {
    switch (complexity) {
      case 'O(n²)': return n * n;
      case 'O(n log n)': return n * Math.log2(n);
      case 'O(log n)': return Math.log2(n);
      case 'O(n)': return n;
      case 'O(V + E)': return n + Math.floor(n * 1.5);
      default: return n;
    }
  };

  const bubbleSort = (arr: number[]): { sorted: number[], comparisons: number } => {
    const array = [...arr];
    let comparisons = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        comparisons++;
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
      }
    }
    return { sorted: array, comparisons };
  };

  const quickSort = (arr: number[]): { sorted: number[], comparisons: number } => {
    const array = [...arr];
    let comparisons = 0;

    const partition = (low: number, high: number): number => {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      return i + 1;
    };

    const sort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    };

    sort(0, array.length - 1);
    return { sorted: array, comparisons };
  };

  const mergeSort = (arr: number[]): { sorted: number[], comparisons: number } => {
    const array = [...arr];
    let comparisons = 0;

    const merge = (left: number[], right: number[]): number[] => {
      const result: number[] = [];
      let i = 0, j = 0;

      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }

      return result.concat(left.slice(i)).concat(right.slice(j));
    };

    const sort = (arr: number[]): number[] => {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = sort(arr.slice(0, mid));
      const right = sort(arr.slice(mid));

      return merge(left, right);
    };

    const sorted = sort(array);
    return { sorted, comparisons };
  };

  const insertionSort = (arr: number[]): { sorted: number[], comparisons: number } => {
    const array = [...arr];
    let comparisons = 0;

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;
      while (j >= 0 && array[j] > key) {
        comparisons++;
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = key;
    }

    return { sorted: array, comparisons };
  };

  const linearSearch = (arr: number[], target: number): { found: boolean, comparisons: number } => {
    let comparisons = 0;
    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      if (arr[i] === target) return { found: true, comparisons };
    }
    return { found: false, comparisons };
  };

  const binarySearch = (arr: number[], target: number): { found: boolean, comparisons: number } => {
    const array = [...arr].sort((a, b) => a - b);
    let comparisons = 0;
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      comparisons++;
      const mid = Math.floor((left + right) / 2);
      if (array[mid] === target) return { found: true, comparisons };
      if (array[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return { found: false, comparisons };
  };

  const bfs = (adjacencyList: number[][]): { visited: number[], comparisons: number } => {
    const visited: boolean[] = new Array(adjacencyList.length).fill(false);
    const result: number[] = [];
    let comparisons = 0;
    const queue: number[] = [0];
    visited[0] = true;

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);

      for (const neighbor of adjacencyList[vertex]) {
        comparisons++;
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }

    return { visited: result, comparisons };
  };

  const dfs = (adjacencyList: number[][]): { visited: number[], comparisons: number } => {
    const visited: boolean[] = new Array(adjacencyList.length).fill(false);
    const result: number[] = [];
    let comparisons = 0;

    const traverse = (vertex: number) => {
      visited[vertex] = true;
      result.push(vertex);

      for (const neighbor of adjacencyList[vertex]) {
        comparisons++;
        if (!visited[neighbor]) {
          traverse(neighbor);
        }
      }
    };

    traverse(0);
    return { visited: result, comparisons };
  };

  const runAlgorithms = (arr: number[]) => {
    const algorithms: AlgorithmResult[] = [];
    
    if (activeCategory === 'sorting') {
      const sortingAlgos = [
        {
          name: 'Quick Sort',
          fn: quickSort,
          complexity: 'O(n log n)',
          description: 'A divide-and-conquer algorithm that picks a pivot element and partitions the array around it.'
        },
        {
          name: 'Merge Sort',
          fn: mergeSort,
          complexity: 'O(n log n)',
          description: 'A divide-and-conquer algorithm that recursively divides the array and merges sorted subarrays.'
        },
        {
          name: 'Bubble Sort',
          fn: bubbleSort,
          complexity: 'O(n²)',
          description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
        },
        {
          name: 'Insertion Sort',
          fn: insertionSort,
          complexity: 'O(n²)',
          description: 'Builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.'
        }
      ];

      for (const algo of sortingAlgos) {
        const startTime = performance.now();
        const result = algo.fn(arr);
        const endTime = performance.now();

        algorithms.push({
          name: algo.name,
          time: endTime - startTime,
          comparisons: result.comparisons,
          timeComplexity: algo.complexity,
          theoreticalTime: calculateTheoreticalTime(arr.length, algo.complexity),
          icon: <ArrowUpDown className="w-6 h-6" />,
          description: algo.description,
          category: 'sorting'
        });
      }
    } else if (activeCategory === 'searching') {
      const searchingAlgos = [
        {
          name: 'Binary Search',
          fn: () => binarySearch(arr, target),
          complexity: 'O(log n)',
          description: 'Efficiently finds an item in a sorted list by repeatedly dividing the search interval in half.'
        },
        {
          name: 'Linear Search',
          fn: () => linearSearch(arr, target),
          complexity: 'O(n)',
          description: 'Sequentially checks each element in the list until a match is found or the whole list has been searched.'
        }
      ];

      for (const algo of searchingAlgos) {
        const startTime = performance.now();
        const result = algo.fn();
        const endTime = performance.now();

        algorithms.push({
          name: algo.name,
          time: endTime - startTime,
          comparisons: result.comparisons,
          timeComplexity: algo.complexity,
          theoreticalTime: calculateTheoreticalTime(arr.length, algo.complexity),
          icon: <Search className="w-6 h-6" />,
          description: algo.description,
          category: 'searching'
        });
      }
    } else if (activeCategory === 'graph') {
      const size = Math.min(arraySize, 1000);
      const adjacencyList = Array.from({ length: size }, () => 
        Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => 
          Math.floor(Math.random() * size)
        )
      );

      const graphAlgos = [
        {
          name: 'Breadth-First Search',
          fn: () => bfs(adjacencyList),
          complexity: 'O(V + E)',
          description: 'Traverses the graph level by level, visiting all neighbors of a vertex before moving to the next level.'
        },
        {
          name: 'Depth-First Search',
          fn: () => dfs(adjacencyList),
          complexity: 'O(V + E)',
          description: 'Traverses the graph by exploring as far as possible along each branch before backtracking.'
        }
      ];

      for (const algo of graphAlgos) {
        const startTime = performance.now();
        const result = algo.fn();
        const endTime = performance.now();

        algorithms.push({
          name: algo.name,
          time: endTime - startTime,
          comparisons: result.comparisons,
          timeComplexity: algo.complexity,
          theoreticalTime: calculateTheoreticalTime(size, algo.complexity),
          icon: <Network className="w-6 h-6" />,
          description: algo.description,
          category: 'graph'
        });
      }
    }

    algorithms.sort((a, b) => {
      switch (sortBy) {
        case 'time': return a.time - b.time;
        case 'comparisons': return a.comparisons - b.comparisons;
        case 'theoretical': return a.theoreticalTime - b.theoreticalTime;
        default: return 0;
      }
    });

    setResults(algorithms);
  };

  const getCategoryTitle = (category: AlgorithmCategory) => {
    switch (category) {
      case 'sorting': return 'Sorting Algorithms';
      case 'searching': return 'Searching Algorithms';
      case 'graph': return 'Graph Algorithms';
    }
  };

  return (
    <div className={`min-h-screen theme-blue transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <button
                  onClick={handleBack}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                Algorithm Performance Analysis
              </h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
              {(['sorting', 'searching', 'graph'] as AlgorithmCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {getCategoryTitle(category)}
                </button>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeCategory === 'graph' ? 'Vertices:' : 'Array Size:'}
                </label>
                <select
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <option value="100">100</option>
                  <option value="1000">1,000</option>
                  <option value="10000">10,000</option>
                  <option value="100000">100,000</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'time' | 'comparisons' | 'theoretical')}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <option value="time">Actual Time</option>
                  <option value="comparisons">Comparisons</option>
                  <option value="theoretical">Theoretical Time</option>
                </select>
              </div>

              <button
                onClick={generateNewArray}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Data
              </button>
            </div>

            {results.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🏆 Category Leader
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      {results[0].icon}
                    </div>
                    <div>
                      <div className="font-medium text-blue-900 dark:text-blue-100">{results[0].name}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">{results[0].timeComplexity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Best {sortBy === 'time' ? 'Time' : sortBy === 'comparisons' ? 'Comparisons' : 'Theoretical Time'}
                    </div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {sortBy === 'time' 
                        ? `${results[0].time.toFixed(2)}ms`
                        : sortBy === 'comparisons'
                        ? results[0].comparisons.toLocaleString()
                        : results[0].theoreticalTime.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={result.name}>
                  <div
                    className={`relative flex items-center p-6 ${
                      index === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800/50'
                    } rounded-lg transition-all hover:scale-[1.02] cursor-pointer`}
                    onClick={() => setSelectedAlgo(selectedAlgo === result.name ? null : result.name)}
                  >
                    <div className="absolute -left-3 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center rounded-full">
                      {index + 1}
                    </div>
                    
                    <div className="ml-8 flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-blue-600 dark:text-blue-400">
                          {result.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {result.name}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Time Complexity: {result.timeComplexity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Comparisons</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.comparisons.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.time.toFixed(2)}ms
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${
                            selectedAlgo === result.name ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {selectedAlgo === result.name && (
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg ml-8">
                      <p className="text-gray-600 dark:text-gray-300">{result.description}</p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Theoretical Time</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.theoreticalTime.toLocaleString()} units
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Actual/Theory Ratio</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {(result.time / result.theoreticalTime).toFixed(6)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Testing with {activeCategory === 'graph' ? 'vertices' : 'array size'}: {arraySize.toLocaleString()} {activeCategory === 'graph' ? '' : 'elements'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;