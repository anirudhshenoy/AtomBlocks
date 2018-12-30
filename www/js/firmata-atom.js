'use strict'; 

  /**
   * Asks the arduino to write a value to a digital pin
   * @param {number} pin The pin you want to write a value to.
   * @param {number} value The value you want to write. Must be board.HIGH or board.LOW
   * @param {boolean} enqueue When true, the local state is updated but the command is not sent to the Arduino
   */
class firmataBoard{

	constructor (){
	this.ports = new Array(16).fill(0);
    }

	digitalWrite(pin, value) {
        let port = this.updateDigitalPort(pin, value);
        this.writeDigitalPort(port);
    }

    updateDigitalPort(pin, value) {
        const port = pin >> 3;
        const bit = 1 << (pin & 0x07);

        if (value) {
            this.ports[port] |= bit;
        } 
        else {
            this.ports[port] &= ~bit;
        }
        return port;
    }

  /**
   * Update a digital port (group of 8 digital pins) on the Arduino
   * @param {number} port The port you want to update.
   */

  writeDigitalPort(port) {
      bluetoothSerial.write([(0x90 | port), (this.ports[port] & 0x7F), ((this.ports[port] >> 7) & 0x7F)]);
	}

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

function initApi(interpreter, scope) {
  
  // add
  var wrapper = function (pin, value) {
    let fBoard= new firmataBoard();
    fBoard.digitalWrite(pin, value);
  }

  interpreter.setProperty(scope,'digitalWrite', interpreter.createNativeFunction(wrapper));

  Blockly.JavaScript.addReservedWords('waitForSeconds');
  var wrapper = interpreter.createAsyncFunction(
    function(timeInSeconds, callback) {
      // Delay the call to the callback.
      setTimeout(callback, timeInSeconds * 1000);
    });
  interpreter.setProperty(scope, 'waitForSeconds', wrapper);

     // Add an API function for highlighting blocks.
  wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
  };      
  interpreter.setProperty(scope, 'highlightBlock',
          interpreter.createNativeFunction(wrapper));
}
  

 
