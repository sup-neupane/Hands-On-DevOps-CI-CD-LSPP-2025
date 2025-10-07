const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Calculator operations
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  },
  power: (a, b) => Math.pow(a, b),
  sqrt: (a) => {
    if (a < 0) throw new Error('Cannot calculate square root of negative number');
    return Math.sqrt(a);
  }
};

// API endpoint for calculations
app.post('/calculate', (req, res) => {
  try {
    const { operation, num1, num2 } = req.body;
    
    if (!operation) {
      return res.status(400).json({ error: 'Operation is required' });
    }
    
    if (num1 === undefined || num1 === null) {
      return res.status(400).json({ error: 'First number is required' });
    }
    
    const a = parseFloat(num1);
    const b = num2 !== undefined ? parseFloat(num2) : null;
    
    if (isNaN(a) || (num2 !== undefined && isNaN(b))) {
      return res.status(400).json({ error: 'Invalid number format' });
    }
    
    if (!operations[operation]) {
      return res.status(400).json({ error: 'Invalid operation' });
    }
    
    let result;
    if (operation === 'sqrt') {
      result = operations[operation](a);
    } else {
      if (b === null) {
        return res.status(400).json({ error: 'Second number is required' });
      }
      result = operations[operation](a, b);
    }
    
    res.json({ 
      result,
      operation,
      num1: a,
      num2: b
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve the calculator UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server and assign to variable for export
const server = app.listen(PORT, () => {
  console.log(`🧮 Calculator app running on port ${PORT}`);
});

// Export app, server, and operations for testing
module.exports = { app, server, operations };
