const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Calculation route
app.post('/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;
  let result;

  try {
    switch (operation) {
      case 'add': result = num1 + num2; break;
      case 'subtract': result = num1 - num2; break;
      case 'multiply': result = num1 * num2; break;
      case 'divide':
        if (num2 === 0) throw new Error('Division by zero');
        result = num1 / num2;
        break;
      case 'power': result = Math.pow(num1, num2); break;
      case 'sqrt': result = Math.sqrt(num1); break;
      default: throw new Error('Invalid operation');
    }

    res.json({ operation, num1, num2, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
