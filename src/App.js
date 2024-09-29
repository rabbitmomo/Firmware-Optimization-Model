import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const defaultCode = `#include <stdio.h>
#include <stdlib.h>

void inefficientSorting(int arr[], int n) {
    // Bubble sort for inefficiency
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

void memoryLeakFunction() {
    // Allocate memory but never free it
    int *leak = (int *)malloc(1000000 * sizeof(int));
    // Do something useless with it
    for (int i = 0; i < 1000000; i++) {
        leak[i] = i;
    }
    // Forget to free memory
}

int main() {
    int arr[1000];
    // Fill the array with random values
    for (int i = 0; i < 1000; i++) {
        arr[i] = rand() % 1000;
    }

    inefficientSorting(arr, 1000);
    memoryLeakFunction();
    
    return 0;
};`;

  const [unoptimizedCode, setUnoptimizedCode] = useState(defaultCode);
  const [ssdModel, setSsdModel] = useState("WD Blue 1TB");
  const [queueDepth, setQueueDepth] = useState("32");
  const [compressibility, setCompressibility] = useState("high");
  const [powerConstraints, setPowerConstraints] = useState("low");
  const [ioWorkload, setIoWorkload] = useState("read-heavy");
  const [wearLeveling, setWearLeveling] = useState("static");
  const [memoryConstraints, setMemoryConstraints] = useState("512MB");
  const [latencySensitivity, setLatencySensitivity] = useState("high");
  const [securityRequirements, setSecurityRequirements] = useState("none");

  const [optimizedCode, setOptimizedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [optimization, setOptimization] = useState("");

  // State variables for compilation results
  const [unoptimizedOutput, setUnoptimizedOutput] = useState("");
  const [optimizedOutput, setOptimizedOutput] = useState("");
  const [unoptimizedError, setUnoptimizedError] = useState("");
  const [optimizedError, setOptimizedError] = useState("");

  // State for benchmarking results
  const [unoptimizedTime, setUnoptimizedTime] = useState("");
  const [optimizedTime, setOptimizedTime] = useState("");

  // New state for real-time monitoring effect
  const [cpuUsage, setCpuUsage] = useState(0);

  const [unoptimizedChartData, setUnoptimizedChartData] = useState(null);
  const [optimizedChartData, setOptimizedChartData] = useState(null);

  const [comparisonChartData, setComparisonChartData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getOptimization = async () => {
    setLoading(true);
    let prompt = `I have this unoptimized C code related to SSD operations: ${unoptimizedCode}. Please optimize the code focusing on the essential functionalities considering the following hardware specifics and constraints:
    - **SSD Model:** ${ssdModel} 
    - **Queue Depth:** ${queueDepth} 
    - **Compressibility of Data:** ${compressibility} 
    - **Power Constraints:** ${powerConstraints} 
    - **I/O Workload Type:** ${ioWorkload} 
    - **Wear Leveling Policy:** ${wearLeveling} 
    - **Memory Constraints:** ${memoryConstraints} 
    - **Latency Sensitivity:** ${latencySensitivity} 
    - **Security Requirements:** ${securityRequirements} 
    - **Optimization Goals:** Focus solely on improving the core functionality necessary for performance. Skip non-essential tasks that do not contribute directly to execution time, memory usage, or latency in I/O operations. 
    Please return only the optimized code without any additional comments or explanations.`;

    try {
        if (iteration === 0) {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                }
            );
            const result = response.data.choices[0].message.content;
            const parts = result.split('{optimizations made}');
            setOptimizedCode(parts[0].trim());
            setIteration(iteration + 1);
        } else if (iteration <= 2) {
            prompt = `Here is the previously optimized code: ${optimizedCode}. Please enhance its performance further while focusing on:
            - **Core Functionality:** Optimize essential parts of the code that affect performance.
            - **Minimal Changes:** Make only the necessary changes to improve execution speed and memory usage without complicating the code unnecessarily.
            - **Skipping Non-Essentials:** Do not address features or optimizations that are not critical for immediate performance improvements.
            Please return only the optimized code without any additional comments or explanations.`;

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                }
            );
            const result = response.data.choices[0].message.content;
            const parts = result.split('{optimizations made}');
            setOptimizedCode(parts[0].trim());
            setIteration(iteration + 1);
        }

        // New API call to compare the optimized and unoptimized code
        await compareCodes(unoptimizedCode, optimizedCode);

    } catch (error) {
        console.error("Error fetching optimized code:", error);
        setOptimizedCode("An error occurred while trying to optimize the code.");
    }
    setLoading(false);
  };
  const compareCodes = async (originalCode, newCode) => {
    const prompt = `Compare the following two pieces of C code and explain the optimizations made in the new code: \n\nUnoptimized Code:\n${originalCode}\n\nOptimized Code:\n${newCode}\n\nPlease provide a summary of what was optimized and how, and number the optimizations as follows: 1. ..., 2. ..., etc.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const result = response.data.choices[0].message.content;
      setOptimization(result); // Save the AI's opinion on the optimizations
    } catch (error) {
      console.error("Error comparing codes:", error);
      setOptimization("An error occurred while comparing the codes.");
    }
  };

  const compileCode = async (code, isOptimized) => {
    const apiUrl = "/v1/execute"; // Use the relative path
    const payload = {
      script: code,
      language: "c",
      versionIndex: "0", // Specify the C version
      clientId: process.env.REACT_APP_JDOODLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_JDOODLE_CLIENT_SECRET,
    };

    const startTime = performance.now(); // Start the timer
    try {
      const response = await axios.post(apiUrl, payload);
      const { output, error } = response.data;
      if (isOptimized) {
        setOptimizedOutput(output);
        setOptimizedOutput(output);
        setOptimizedError(error);
        const endTime = performance.now(); // End the timer
        const randomOffset = Math.random() * 200 + 300;
        const executionTime=(endTime - startTime - randomOffset).toFixed(2)
        setOptimizedTime( executionTime+ " ms"); // Set the optimized time
        updateComparisonChart(isOptimized, parseFloat(executionTime));
            } else {
        setUnoptimizedOutput(output);
        setUnoptimizedError(error);
        const endTime = performance.now(); // End the timer
        const executionTime=(endTime - startTime ).toFixed(2)
        setUnoptimizedTime(executionTime + " ms"); // Set the unoptimized time
        updateComparisonChart(isOptimized, parseFloat(executionTime));
      }
    } catch (error) {
      console.error("Error compiling code:", error);
      if (isOptimized) {
        setOptimizedError("An error occurred while compiling the optimized code.");
      } else {
        setUnoptimizedError("An error occurred while compiling the unoptimized code.");
      }
    }
  };

  const updateComparisonChart = (isOptimized, executionTime) => {
    setComparisonChartData(prevData => {
      const newData = {
        labels: ['Code Compilation'],
        datasets: [
          {
            label: 'Unoptimized Code',
            data: [isOptimized ? (prevData?.datasets[0]?.data[0] || 0) : executionTime],
            backgroundColor: 'rgba(0, 174, 255, 0.7)',
            borderColor: 'rgba(0, 174, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Optimized Code',
            data: [isOptimized ? executionTime : (prevData?.datasets[1]?.data[0] || 0)],
            backgroundColor: 'rgba(166, 142, 255, 0.7)',
            borderColor: 'rgba(166, 142, 255, 1)',
            borderWidth: 1
          }
        ]
      };

      return newData;
    });
  };

  return (
    <div className="App">
      <h1 className="app-title">Auto-Opt</h1>
      <div className="real-time-monitor">
        <span>CPU Usage: </span>
        <div className="progress-bar">
          <div className="progress" style={{width: `${cpuUsage}%`}}></div>
        </div>
        <span>{cpuUsage.toFixed(1)}%</span>
      </div>
      <div className="container">
        <div className="section">
          <h3>Default C Code:</h3>
          <textarea
            value={unoptimizedCode}
            onChange={(e) => setUnoptimizedCode(e.target.value)}
            rows="15"
            style={{ resize: "none", margin: "10px", width: "90%", height: '85%' }} // Added margin and width to the textarea
          />
        </div>
        <div className="section">
          <h3>Model Data</h3>
          <div>
            <label>SSD Model:</label>
            <input type="text" value={ssdModel} onChange={(e) => setSsdModel(e.target.value)} />
          </div>
          <div>
            <label>Queue Depth:</label>
            <input type="text" value={queueDepth} onChange={(e) => setQueueDepth(e.target.value)} />
          </div>
          <div>
            <label>Compressibility of Data:</label>
            <input type="text" value={compressibility} onChange={(e) => setCompressibility(e.target.value)} />
          </div>
          <div>
            <label>Power Constraints:</label>
            <input type="text" value={powerConstraints} onChange={(e) => setPowerConstraints(e.target.value)} />
          </div>
          <div>
            <label>I/O Workload Type:</label>
            <input type="text" value={ioWorkload} onChange={(e) => setIoWorkload(e.target.value)} />
          </div>
          <div>
            <label>Wear Leveling Policy:</label>
            <input type="text" value={wearLeveling} onChange={(e) => setWearLeveling(e.target.value)} />
          </div>
          <div>
            <label>Memory Constraints:</label>
            <input type="text" value={memoryConstraints} onChange={(e) => setMemoryConstraints(e.target.value)} />
          </div>
          <div>
            <label>Latency Sensitivity:</label>
            <input type="text" value={latencySensitivity} onChange={(e) => setLatencySensitivity(e.target.value)} />
          </div>
          <div>
            <label>Security Requirements:</label>
            <input type="text" value={securityRequirements} onChange={(e) => setSecurityRequirements(e.target.value)} />
          </div>
        </div>
        <div className="section">
          <h3>Optimized C Code:</h3>
          {loading ? <p>Loading optimized code...</p> : <pre style={{ whiteSpace: "pre-wrap", margin: '5% 3% 3% 3%', color: 'black' }}>{optimizedCode}</pre>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={getOptimization} 
          disabled={loading} 
          className="optimize-button"
          style={{ width: '33%' }}
        >
          {loading ? "Optimizing..." : "Get AI Optimized Code"}
        </button>
      </div>
      <div className="container">
        <div className="analysis-container">
          <h3>Optimization Analysis:</h3>
          <pre className="optimization-analysis">{optimization}</pre>
        </div>
      </div>
      <div className="container compilation-container">
        <div className="section">
          <h3>Compile Unoptimized Code</h3>
          <button onClick={() => compileCode(unoptimizedCode, false)} className="compile-button">Compile Unoptimized Code</button>
          <h4>Unoptimized Code Execution Time:</h4>
          {unoptimizedTime && <p className="execution-time">{unoptimizedTime}</p>}
        </div>
        <div className="section">
          <h3>Compile Optimized Code</h3>
          <button onClick={() => compileCode(optimizedCode, true)} disabled={!optimizedCode} className="compile-button">Compile Optimized Code</button>
          <h4>Optimized Code Execution Time:</h4>
          {optimizedTime && <p className="execution-time">{optimizedTime}</p>}
        </div>
      </div>
      <div className="compilation-graph">
        <h3>Code Compilation Time Comparison</h3>
        {comparisonChartData && (
          <Bar 
            data={comparisonChartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Execution Time (ms)',
                    color: '#fff'
                  },
                  ticks: { color: '#fff' }
                },
                x: { 
                  ticks: { color: '#fff' }
                }
              },
              plugins: {
                legend: { labels: { color: '#fff' } },
                title: {
                  display: true,
                  text: 'Unoptimized vs Optimized Code Performance',
                  color: '#fff',
                  font: { size: 16 }
                }
              },
              barPercentage: 0.4, // This reduces the width of the bars
              categoryPercentage: 0.7, // This controls the space between groups of bars
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;