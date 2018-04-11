const input = require('fs').createReadStream('input.txt');
const reader = require('readline').createInterface({input});

let circuit = {};
let solved = {};

const addWireToCircuit = (line) => {
  const [, signal, wire] = line.match(/^(.*) -> (\w+)$/);
  circuit[wire] = signal;
}

const evaluateWire = (wire) => {
	if (!isNaN(wire)) return parseInt(wire);
	if (typeof solved[wire] === 'undefined') solved[wire] = evaluateSignal(circuit[wire]);
  return solved[wire];
}

const evaluateSignal = (signal) => {
  let definition;

  if (definition = signal.match(/^(\w+)$/)) {
  	return evaluateWire(definition[1]);
  } else if (definition = signal.match(/^NOT (\w+)$/)) {
  	return ~ evaluateWire(definition[1]);
  } else if (definition = signal.match(/^(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+)$/)) {
  	switch(definition[2]) {
  		case 'AND':
  			return evaluateWire(definition[1]) & evaluateWire(definition[3]);
  			break;
  		case 'OR':
  			return evaluateWire(definition[1]) | evaluateWire(definition[3]);
  			break;
  		case 'LSHIFT':
  			return evaluateWire(definition[1]) << evaluateWire(definition[3]);
  			break;
  		case 'RSHIFT':
  			return evaluateWire(definition[1]) >> evaluateWire(definition[3]);
  			break;
  	}
  }
  return;
}

reader.on('line', addWireToCircuit);
reader.on('close', () => {
	const part1 = evaluateWire('a');
	console.log("The signal ultimately provided to wire a is: " + part1);
	solved = { b: part1 };
	const part2 = evaluateWire('a');
	console.log("After overriding wire b's signal with " + part1 + ", the new signal provided to wire a is: " + part2);
});
