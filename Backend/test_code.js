const readline = require('readline');

function addTwoNumbers(a, b) {
    // Write your code here
    // Return the sum of a and b
    return a + b;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputLines = [];

rl.on('line', (line) => {
    inputLines = line.split(' ');
    rl.close();
}).on('close', () => {
    const a = parseInt(inputLines[0], 10);
    const b = parseInt(inputLines[1], 10);
    console.log(addTwoNumbers(a, b));
});
