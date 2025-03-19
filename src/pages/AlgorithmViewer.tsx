import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RefreshCw, Search, SortAsc, Network, Sun, Moon } from 'lucide-react';

// Types
type AlgorithmCategory = 'sorting' | 'searching' | 'graph';
type SortingAlgorithm = 'bubble' | 'insertion' | 'selection' | 'quick' | 'merge';
type SearchingAlgorithm = 'linear' | 'binary' | 'jump';
type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra';
type Theme = 'light' | 'dark';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
  weight?: number;
}

interface Step {
  description: string;
  detail: string;
  comparisons: number;
  swaps: number;
  timeElapsed: number;
}

interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  startTime: number;
}

interface Distance {
  [key: number]: number;
}

const DEFAULT_ARRAY = [15, 8, 23, 12,34,67,8,34,56,23,1,23,12,90];
const DEFAULT_SEARCH_TARGET = 15;

const AlgorithmViewer = () => {
  const [category, setCategory] = useState<AlgorithmCategory>('sorting');
  const [theme, setTheme] = useState<Theme>('dark');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [currentStep, setCurrentStep] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [customInput, setCustomInput] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [stepDescription, setStepDescription] = useState<string>('');
  const [stepDetail, setStepDetail] = useState<string>('');
  const [searchTarget, setSearchTarget] = useState<number>(DEFAULT_SEARCH_TARGET);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [metrics, setMetrics] = useState<AlgorithmMetrics>({
    comparisons: 0,
    swaps: 0,
    startTime: 0
  });
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [sortingAlgo, setSortingAlgo] = useState<SortingAlgorithm>('bubble');
  const [searchingAlgo, setSearchingAlgo] = useState<SearchingAlgorithm>('linear');
  const [graphAlgo, setGraphAlgo] = useState<GraphAlgorithm>('bfs');
  const runningRef = useRef(false);

  useEffect(() => {
    if (category === 'graph') {
      generateGraph();
    } else {
      generateArray();
    }
  }, [category]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const addStep = (description: string, detail: string) => {
    const newStep: Step = {
      description,
      detail,
      comparisons: metrics.comparisons,
      swaps: metrics.swaps,
      timeElapsed: Date.now() - metrics.startTime
    };
    setSteps(prev => [...prev, newStep]);
    setCurrentStepIndex(prev => prev + 1);
    setStepDescription(description);
    setStepDetail(detail);
  };

  const generateArray = () => {
    const newArray = category === 'searching' 
      ? [...DEFAULT_ARRAY].sort((a, b) => a - b)
      : DEFAULT_ARRAY;
    setArray(newArray);
    resetState();
  };

  const generateGraph = () => {
    const graphSize = 8; // Reduced from 8 to 6 for better visibility
    const radius = 100; // Reduced from 120 to 100
    const centerX = 150;
    const centerY = 150;
    
    const newNodes: Node[] = Array.from({ length: graphSize }, (_, i) => {
      const angle = (i * 2 * Math.PI) / graphSize;
      return {
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        connections: [
          (i + 1) % graphSize,
          (i + graphSize - 1) % graphSize
        ],
        weight: Math.floor(Math.random() * 10) + 1 // Reduced weights from 10 to 5
      };
    });
    
    setNodes(newNodes);
    resetState();
  };

  const resetState = () => {
    setCurrentStep([]);
    setCompleted([]);
    setRunning(false);
    runningRef.current = false;
    setStepDescription('Ready to start');
    setStepDetail('Select an algorithm and press Start');
    setSteps([]);
    setCurrentStepIndex(0);
    setMetrics({ comparisons: 0, swaps: 0, startTime: 0 });
  };

  const compare = (a: number, b: number): boolean => {
    setMetrics(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
    return a > b;
  };

  const swap = (arr: number[], i: number, j: number) => {
    setMetrics(prev => ({ ...prev, swaps: prev.swaps + 1 }));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  // Sorting Algorithms
  const bubbleSort = async () => {
    let arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!runningRef.current) return;
        
        setCurrentStep([j, j + 1]);
        addStep(
          `Comparing ${arr[j]} and ${arr[j + 1]}`,
          `Pass ${i + 1}, Step ${j + 1}`
        );
        await sleep(animationSpeed);
        
        if (compare(arr[j], arr[j + 1])) {
          swap(arr, j, j + 1);
          setArray([...arr]);
        }
      }
      setCompleted(prev => [...prev, n - 1 - i]);
    }
    setCompleted(Array.from({ length: n }, (_, i) => i));
  };

  const insertionSort = async () => {
    let arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      if (!runningRef.current) return;
      let key = arr[i];
      let j = i - 1;
      
      setCurrentStep([i]);
      addStep(
        `Current element: ${key}`,
        `Finding correct position for ${key}`
      );
      await sleep(animationSpeed);
      
      while (j >= 0 && compare(arr[j], key)) {
        if (!runningRef.current) return;
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setCurrentStep([j]);
        await sleep(animationSpeed);
        j--;
      }
      
      arr[j + 1] = key;
      setArray([...arr]);
      setCompleted(prev => [...prev, i]);
    }
    setCompleted(Array.from({ length: n }, (_, i) => i));
  };

  const selectionSort = async () => {
    let arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (!runningRef.current) return;
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        if (!runningRef.current) return;
        setCurrentStep([minIdx, j]);
        addStep(
          `Comparing ${arr[j]} with current minimum ${arr[minIdx]}`,
          `Finding minimum element`
        );
        await sleep(animationSpeed);
        
        if (compare(arr[minIdx], arr[j])) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        swap(arr, i, minIdx);
        setArray([...arr]);
      }
      
      setCompleted(prev => [...prev, i]);
    }
    setCompleted(Array.from({ length: n }, (_, i) => i));
  };

  // Searching Algorithms
  const linearSearch = async () => {
    for (let i = 0; i < array.length; i++) {
      if (!runningRef.current) return;
      
      setCurrentStep([i]);
      addStep(
        `Checking ${array[i]}`,
        `Comparing with target ${searchTarget}`
      );
      await sleep(animationSpeed);
      
      if (array[i] === searchTarget) {
        setCompleted([i]);
        addStep(
          `Found ${searchTarget}`,
          `Target found at index ${i}`
        );
        return;
      }
    }
    addStep(
      `${searchTarget} not found`,
      `Target value not present in array`
    );
  };

  const binarySearch = async () => {
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right && runningRef.current) {
      const mid = Math.floor((left + right) / 2);
      setCurrentStep([mid]);
      addStep(
        `Checking middle element ${array[mid]}`,
        `Comparing with target ${searchTarget}`
      );
      await sleep(animationSpeed);
      
      if (array[mid] === searchTarget) {
        setCompleted([mid]);
        addStep(
          `Found ${searchTarget}`,
          `Target found at index ${mid}`
        );
        return;
      }
      
      if (array[mid] < searchTarget) {
        left = mid + 1;
        addStep(
          `Moving right`,
          `Target is larger than middle element`
        );
      } else {
        right = mid - 1;
        addStep(
          `Moving left`,
          `Target is smaller than middle element`
        );
      }
      await sleep(animationSpeed);
    }
    addStep(
      `${searchTarget} not found`,
      `Target value not present in array`
    );
  };

  // Graph Algorithms
  const bfs = async () => {
    const visited = new Set<number>();
    const queue = [0];
    visited.add(0);
    
    while (queue.length > 0 && runningRef.current) {
      const current = queue.shift()!;
      setCurrentStep([current]);
      addStep(
        `Visiting node ${current}`,
        `Exploring neighbors`
      );
      await sleep(animationSpeed);
      
      for (const neighbor of nodes[current].connections) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          visited.add(neighbor);
          setCompleted(Array.from(visited));
          addStep(
            `Adding node ${neighbor}`,
            `New node discovered`
          );
          await sleep(animationSpeed);
        }
      }
    }
  };

  const dfs = async (current = 0, visited = new Set<number>()) => {
    if (!runningRef.current) return;
    
    visited.add(current);
    setCurrentStep([current]);
    setCompleted(Array.from(visited));
    addStep(
      `Visiting node ${current}`,
      `Exploring depth-first`
    );
    await sleep(animationSpeed);
    
    for (const neighbor of nodes[current].connections) {
      if (!visited.has(neighbor)) {
        await dfs(neighbor, visited);
      }
    }
  };

  const dijkstra = async () => {
    const distances: Distance = {};
    const previous: Distance = {};
    const unvisited = new Set<number>();

    nodes.forEach((_, index) => {
      distances[index] = index === 0 ? 0 : Infinity;
      previous[index] = -1;
      unvisited.add(index);
    });

    while (unvisited.size > 0 && runningRef.current) {
      let current = Array.from(unvisited).reduce((min, node) => 
        distances[node] < distances[min] ? node : min
      , Array.from(unvisited)[0]);

      if (distances[current] === Infinity) break;

      unvisited.delete(current);
      setCompleted(Array.from(unvisited));
      setCurrentStep([current]);
      
      addStep(
        `Visiting node ${current}`,
        `Current distance: ${distances[current]}`
      );
      await sleep(animationSpeed);

      for (let i = 0; i < nodes[current].connections.length; i++) {
        const neighbor = nodes[current].connections[i];
        if (!unvisited.has(neighbor)) continue;

        const weight = nodes[current].weight || 1;
        const newDistance = distances[current] + weight;

        setCurrentStep([current, neighbor]);
        addStep(
          `Checking neighbor ${neighbor}`,
          `Distance through ${current}: ${newDistance} (Current best: ${distances[neighbor]})`
        );
        await sleep(animationSpeed);

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
          addStep(
            `Updated distance to node ${neighbor}`,
            `New shortest distance: ${newDistance}`
          );
          await sleep(animationSpeed);
        }
      }
    }

    return { distances, previous };
  };

  const handleStart = async () => {
    if (running) {
      runningRef.current = false;
      setRunning(false);
      return;
    }

    setRunning(true);
    runningRef.current = true;
    setCurrentStep([]);
    setCompleted([]);
    setSteps([]);
    setCurrentStepIndex(0);
    setMetrics({ comparisons: 0, swaps: 0, startTime: Date.now() });

    switch (category) {
      case 'sorting':
        switch (sortingAlgo) {
          case 'bubble':
            await bubbleSort();
            break;
          case 'insertion':
            await insertionSort();
            break;
          case 'selection':
            await selectionSort();
            break;
        }
        break;
      case 'searching':
        switch (searchingAlgo) {
          case 'linear':
            await linearSearch();
            break;
          case 'binary':
            await binarySearch();
            break;
        }
        break;
      case 'graph':
        switch (graphAlgo) {
          case 'bfs':
            await bfs();
            break;
          case 'dfs':
            await dfs();
            break;
          case 'dijkstra':
            await dijkstra();
            break;
        }
        break;
    }

    setRunning(false);
    runningRef.current = false;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-xl p-4 md:p-8`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Algorithm Visualizer
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <label className={theme === 'light' ? 'text-gray-300' : 'text-gray-700'}>Speed:</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-24 md:w-32"
                />
              </div>
              <button
                onClick={handleStart}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white transition-colors`}
              >
                {running ? (
                  <>
                    <Pause size={20} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={20} /> Start
                  </>
                )}
              </button>
              <button
                onClick={category === 'graph' ? generateGraph : generateArray}
                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} /> Reset
              </button>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setCategory('sorting')}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                category === 'sorting' 
                  ? 'bg-indigo-500 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100'
              }`}
            >
              <SortAsc size={20} /> Sorting
            </button>
            <button
              onClick={() => setCategory('searching')}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                category === 'searching' 
                  ? 'bg-indigo-500 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100'
              }`}
            >
              <Search size={20} /> Searching
            </button>
            <button
              onClick={() => setCategory('graph')}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                category === 'graph' 
                  ? 'bg-indigo-500 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100'
              }`}
            >
              <Network size={20} /> Graph
            </button>
          </div>

          {/* Algorithm Controls */}
          <div className="mb-8">
            {category === 'sorting' && (
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={sortingAlgo}
                  onChange={(e) => setSortingAlgo(e.target.value as SortingAlgorithm)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="selection">Selection Sort</option>
                </select>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Custom input (comma-separated numbers)"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                /><button
                onClick={() => {
                  const numbers = customInput
                    .split(',')
                    .map(n => n.trim()) // Trim spaces
                    .filter(n => n !== '') // Remove empty entries
                    .map(n => Number(n)); // Convert to numbers
              
                  if (numbers.every(n => !isNaN(n)) && numbers.length > 0) {
                    setArray(numbers);
                    resetState(); // Ensures sorting starts with the new array
                  } else {
                    alert('Invalid input! Please enter a valid list of numbers.');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap"
              >
                Apply
              </button>
              
              </div>
            )}
            {category === 'searching' && (
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={searchingAlgo}
                  onChange={(e) => setSearchingAlgo(e.target.value as SearchingAlgorithm)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="linear">Linear Search</option>
                  <option value="binary">Binary Search</option>
                </select>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(parseInt(e.target.value))}
                  placeholder="Search target"
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                />
              </div>
            )}
            {category === 'graph' && (
              <div className="flex gap-4">
                <select
                  value={graphAlgo}
                  onChange={(e) => setGraphAlgo(e.target.value as GraphAlgorithm)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="bfs">Breadth First Search</option>
                  <option value="dfs">Depth First Search</option>
                  <option value="dijkstra">Dijkstra's Algorithm</option>
                </select>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visualization Area */}
            <div className="md:col-span-2">
              <div className={`h-96 rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {category !== 'graph' ? (
                  <div className="overflow-x-auto w-full">
                  <div
                    className="flex items-end justify-center h-full gap-1 md:gap-2 lg:gap-4"
                    style={{
                      flexWrap: array.length > 20 ? "wrap" : "nowrap", // Wrap if too many elements
                    }}
                  >
                    {array.map((value, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`rounded-t-lg transition-all duration-300 ${
                            currentStep.includes(idx)
                              ? 'bg-yellow-400'
                              : completed.includes(idx)
                              ? 'bg-green-400'
                              : theme === 'dark'
                              ? 'bg-blue-600'
                              : 'bg-blue-400'
                          }`}
                          style={{
                            height: `${value * 2}px`, // Scale height dynamically
                            width: `${Math.max(100 / array.length, 5)}%`, // Scale width based on element count
                            minWidth: "10px", // Prevent too small bars
                          }}
                        />
                        <span className={`mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    {/* Edges */}
                    {nodes.map(node => 
                      node.connections.map(conn => (
                        <g key={`${node.id}-${conn}`}>
                          <line
                            x1={node.x}
                            y1={node.y}
                            x2={nodes[conn].x}
                            y2={nodes[conn].y}
                            stroke={
                              currentStep.includes(node.id) && currentStep.includes(conn)
                                ? '#FBBF24'
                                : theme === 'dark'
                                ? '#4B5563'
                                : '#94A3B8'
                            }
                            strokeWidth={
                              currentStep.includes(node.id) && currentStep.includes(conn)
                                ? '3'
                                : '2'
                            }
                          />
                          <text
                            x={(node.x + nodes[conn].x) / 2}
                            y={(node.y + nodes[conn].y) / 2}
                            fill={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                            textAnchor="middle"
                            className="text-sm"
                          >
                            {node.weight}
                          </text>
                        </g>
                      ))
                    )}
                    {/* Nodes */}
                    {nodes.map((node, idx) => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="20"
                          className={`transition-all duration-300 ${
                            currentStep.includes(idx)
                              ? 'fill-yellow-400'
                              : completed.includes(idx)
                              ? 'fill-green-400'
                              : theme === 'dark'
                              ? 'fill-blue-600'
                              : 'fill-blue-400'
                          }`}
                        />
                        <text
                          x={node.x}
                          y={node.y}
                          textAnchor="middle"
                          dy=".3em"
                          fill={theme === 'dark' ? 'white' : 'black'}
                          className="text-sm font-bold"
                        >
                          {idx}
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {/* Steps and Metrics */}
            <div className="space-y-4">
              {/* Current Step */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Current Step
                </h2>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                  {stepDescription}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stepDetail}
                </p>
              </div>

              {/* Metrics */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Metrics
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Comparisons
                    </p>
                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {metrics.comparisons}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Swaps
                    </p>
                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {metrics.swaps}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Time
                    </p>
                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {metrics.startTime ? `${((Date.now() - metrics.startTime) / 1000).toFixed(1)}s` : '0.0s'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step History */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} overflow-y-auto max-h-64`}>
                <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Step History
                </h2>
                 <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        idx === currentStepIndex - 1
                          ? theme === 'dark'
                            ? 'bg-gray-600'
                            : 'bg-blue-100'
                          : ''
                      }`}
                    >
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                        {step.description}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step.detail}
                      </p>
                      <div className="mt-1 text-xs grid grid-cols-3 gap-2">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Comparisons: {step.comparisons}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Swaps: {step.swaps}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Time: {(step.timeElapsed / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmViewer;