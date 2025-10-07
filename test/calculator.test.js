const http = require('http');

// Import calculator operations
const { operations, server } = require('../src/calculator.js');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(` PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(` FAIL: ${testName}`);
    testsFailed++;
  }
}

function assertEquals(actual, expected, testName) {
  if (actual === expected) {
    console.log(` PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(` FAIL: ${testName} - Expected ${expected}, got ${actual}`);
    testsFailed++;
  }
}

console.log('\n Running Calculator Tests...\n');

// Unit Tests for Calculator Operations
console.log(' Unit Tests:');
assertEquals(operations.add(2, 3), 5, 'Addition: 2 + 3 = 5');
assertEquals(operations.add(-1, 1), 0, 'Addition with negatives: -1 + 1 = 0');
assertEquals(operations.subtract(5, 3), 2, 'Subtraction: 5 - 3 = 2');
assertEquals(operations.multiply(4, 3), 12, 'Multiplication: 4 * 3 = 12');
assertEquals(operations.divide(10, 2), 5, 'Division: 10 / 2 = 5');
assertEquals(operations.power(2, 3), 8, 'Power: 2^3 = 8');
assertEquals(operations.sqrt(16), 4, 'Square root: sqrt(16) = 4');
assertEquals(operations.sqrt(25), 5, 'Square root: sqrt(25) = 5');

// Test division by zero
try {
  operations.divide(5, 0);
  console.error(' FAIL: Division by zero should throw error');
  testsFailed++;
} catch (e) {
  console.log(' PASS: Division by zero throws error');
  testsPassed++;
}

// Test negative square root
try {
  operations.sqrt(-4);
  console.error(' FAIL: Square root of negative should throw error');
  testsFailed++;
} catch (e) {
  console.log(' PASS: Square root of negative throws error');
  testsPassed++;
}

// Integration Test - API endpoint
console.log('\n Integration Tests:');

function testAPI() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postData = JSON.stringify({
        operation: 'add',
        num1: 10,
        num2: 5
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/calculate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            assertEquals(response.result, 15, 'API Test: 10 + 5 = 15');
            
            // Test health endpoint
            http.get('http://localhost:3000/health', (healthRes) => {
              let healthData = '';
              healthRes.on('data', (chunk) => { healthData += chunk; });
              healthRes.on('end', () => {
                const health = JSON.parse(healthData);
                assert(health.status === 'healthy', 'Health check returns healthy status');
                resolve();
              });
            }).on('error', reject);
            
          } catch (error) {
            console.error('FAIL: API Test -', error.message);
            testsFailed++;
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error(' FAIL: API request failed -', error.message);
        testsFailed++;
        reject(error);
      });

      req.write(postData);
      req.end();
    }, 1000);
  });
}

// Run API tests and display results
testAPI()
  .then(() => {
    console.log('\n' + '='.repeat(50));
    console.log(` Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('='.repeat(50) + '\n');
    
    server.close();
    
    if (testsFailed > 0) {
      console.error(' Tests failed!');
      process.exit(1);
    } else {
      console.log(' All tests passed!');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n Test suite failed:', error.message);
    server.close();
    process.exit(1);
  });