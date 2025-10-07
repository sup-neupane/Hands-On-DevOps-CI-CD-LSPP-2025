const http = require('http');

// Import calculator operations and server
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

// Unit Tests
console.log(' Unit Tests:');
assertEquals(operations.add(2, 3), 5, 'Addition: 2 + 3 = 5');
assertEquals(operations.subtract(5, 3), 2, 'Subtraction: 5 - 3 = 2');
assertEquals(operations.multiply(4, 3), 12, 'Multiplication: 4 * 3 = 12');
assertEquals(operations.divide(10, 2), 5, 'Division: 10 / 2 = 5');
assertEquals(operations.power(2, 3), 8, 'Power: 2^3 = 8');
assertEquals(operations.sqrt(16), 4, 'Square root: sqrt(16) = 4');

// Division by zero
try {
  operations.divide(5, 0);
  console.error(' FAIL: Division by zero should throw error');
  testsFailed++;
} catch {
  console.log(' PASS: Division by zero throws error');
  testsPassed++;
}

// Negative square root
try {
  operations.sqrt(-4);
  console.error(' FAIL: Square root of negative should throw error');
  testsFailed++;
} catch {
  console.log(' PASS: Square root of negative throws error');
  testsPassed++;
}

// Integration Tests
console.log('\n Integration Tests:');

function waitForServer() {
  return new Promise((resolve) => {
    if (server.listening) return resolve();
    server.on('listening', resolve);
  });
}

async function testAPI() {
  await waitForServer();

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ operation: 'add', num1: 10, num2: 5 });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          assertEquals(response.result, 15, 'API Test: 10 + 5 = 15');

          // Health endpoint
          http.get('http://localhost:3000/health', (healthRes) => {
            let healthData = '';
            healthRes.on('data', (chunk) => { healthData += chunk; });
            healthRes.on('end', () => {
              const health = JSON.parse(healthData);
              assert(health.status === 'healthy', 'Health check returns healthy status');
              resolve();
            });
          }).on('error', reject);

        } catch (err) {
          console.error(' FAIL: API Test -', err.message);
          testsFailed++;
          reject(err);
        }
      });
    });

    req.on('error', (err) => { testsFailed++; reject(err); });
    req.write(postData);
    req.end();
  });
}

testAPI()
  .then(() => {
    console.log('\n' + '='.repeat(50));
    console.log(` Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('='.repeat(50) + '\n');

    server.close();

    process.exit(testsFailed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('\n Test suite failed:', err.message);
    server.close();
    process.exit(1);
  });
