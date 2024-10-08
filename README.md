# AI-powered Firmware Optimization Model for Western Digital

This project is an AI-powered Firmware Optimization Model designed specifically for Western Digital SSDs. It provides a web-based interface for optimizing C code related to SSD operations, taking into account various hardware specifications and constraints.

## Features

1. **Code Optimization**: Utilizes OpenAI's GPT-3.5-turbo model to optimize C code for SSD operations.
2. **Hardware-Specific Optimization**: Considers SSD model, queue depth, data compressibility, power constraints, I/O workload type, wear leveling policy, memory constraints, latency sensitivity, and security requirements.
3. **Real-time Monitoring**: Simulates CPU usage with a real-time progress bar.
4. **Code Compilation**: Compiles both unoptimized and optimized code using the JDoodle API.
5. **Performance Comparison**: Visualizes the execution time difference between unoptimized and optimized code using charts.
6. **Optimization Analysis**: Provides a detailed analysis of the optimizations made to the code.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables:
   - `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key
   - `REACT_APP_JDOODLE_CLIENT_ID`: Your JDoodle Client ID
   - `REACT_APP_JDOODLE_CLIENT_SECRET`: Your JDoodle Client Secret
4. Run the application with `npm start`

## How It Works

1. Users input unoptimized C code and set hardware specifications.
2. The AI model optimizes the code based on the given parameters.
3. Users can compile both unoptimized and optimized code.
4. The application displays execution times and a visual comparison of performance.
5. An optimization analysis is provided to explain the changes made by the AI.

## Technologies Used

- React.js
- Axios for API requests
- Chart.js for data visualization
- OpenAI API for code optimization
- JDoodle API for code compilation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
