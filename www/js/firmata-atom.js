'use strict'; 

/**
 * constants
 */

const ANALOG_MAPPING_QUERY = 0x69;
const ANALOG_MAPPING_RESPONSE = 0x6A;
const ANALOG_MESSAGE = 0xE0;
const CAPABILITY_QUERY = 0x6B;
const CAPABILITY_RESPONSE = 0x6C;
const DIGITAL_MESSAGE = 0x90;
const END_SYSEX = 0xF7;
const EXTENDED_ANALOG = 0x6F;
const I2C_CONFIG = 0x78;
const I2C_REPLY = 0x77;
const I2C_REQUEST = 0x76;
const I2C_READ_MASK = 0x18;   // 0b00011000
// const I2C_END_TX_MASK = 0x40; // 0b01000000
const ONEWIRE_CONFIG_REQUEST = 0x41;
const ONEWIRE_DATA = 0x73;
const ONEWIRE_DELAY_REQUEST_BIT = 0x10;
const ONEWIRE_READ_REPLY = 0x43;
const ONEWIRE_READ_REQUEST_BIT = 0x08;
const ONEWIRE_RESET_REQUEST_BIT = 0x01;
const ONEWIRE_SEARCH_ALARMS_REPLY = 0x45;
const ONEWIRE_SEARCH_ALARMS_REQUEST = 0x44;
const ONEWIRE_SEARCH_REPLY = 0x42;
const ONEWIRE_SEARCH_REQUEST = 0x40;
const ONEWIRE_WITHDATA_REQUEST_BITS = 0x3C;
const ONEWIRE_WRITE_REQUEST_BIT = 0x20;
const PIN_MODE = 0xF4;
const PIN_STATE_QUERY = 0x6D;
const PIN_STATE_RESPONSE = 0x6E;
const PING_READ = 0x75;
// const PULSE_IN = 0x74;
// const PULSE_OUT = 0x73;
const QUERY_FIRMWARE = 0x79;
const REPORT_ANALOG = 0xC0;
const REPORT_DIGITAL = 0xD0;
const REPORT_VERSION = 0xF9;
const SAMPLING_INTERVAL = 0x7A;
const SERVO_CONFIG = 0x70;
const SERIAL_MESSAGE = 0x60;
const SERIAL_CONFIG = 0x10;
const SERIAL_WRITE = 0x20;
const SERIAL_READ = 0x30;
const SERIAL_REPLY = 0x40;
const SERIAL_CLOSE = 0x50;
const SERIAL_FLUSH = 0x60;
const SERIAL_LISTEN = 0x70;
const START_SYSEX = 0xF0;
const STEPPER = 0x72;
const ACCELSTEPPER = 0x62;
const STRING_DATA = 0x71;
const SYSTEM_RESET = 0xFF;

const MAX_PIN_COUNT = 128;



class firmataBoard{

	constructor (){
	this.ports = new Array(16).fill(0);
  this.MODES = {
      INPUT: 0x00,
      OUTPUT: 0x01,
      ANALOG: 0x02,
      PWM: 0x03,
      SERVO: 0x04,
      SHIFT: 0x05,
      I2C: 0x06,
      ONEWIRE: 0x07,
      STEPPER: 0x08,
      SERIAL: 0x0A,
      PULLUP: 0x0B,
      IGNORE: 0x7F,
      PING_READ: 0x75,
      UNKOWN: 0x10,
    };

    }

  /**
   * Asks the arduino to write a value to a digital pin
   * @param {number} pin The pin you want to write a value to.
   * @param {number} value The value you want to write. Must be board.HIGH or board.LOW
   * @param {boolean} enqueue When true, the local state is updated but the command is not sent to the Arduino
   */

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
      bluetoothSerial.write([(DIGITAL_MESSAGE | port), (this.ports[port] & 0x7F), ((this.ports[port] >> 7) & 0x7F)]);
	}



  /*
    * mode (INPUT/OUTPUT/ANALOG/PWM/SERVO/I2C/ONEWIRE/STEPPER/ENCODER/SERIAL/PULLUP, 0/1/2/3/4/6/7/8/9/10/11)
  */
  pinMode(pin, mode) {
    bluetoothSerial.write([PIN_MODE, pin, mode]);
  }

 /**
   * Write a PWM value Asks the arduino to write an analog message.
   * @param {number} pin The pin to write analog data to.
   * @param {number} value The data to write to the pin between 0 and this.RESOLUTION.PWM.
   */

  reset() {
    bluetoothSerial.write([SYSTEM_RESET]);
  }

  pwmWrite(pin, value) {
    const data = [];

    if (pin > 15) {
      data[0] = START_SYSEX;
      data[1] = EXTENDED_ANALOG;
      data[2] = pin;
      data[3] = value & 0x7F;
      data[4] = (value >> 7) & 0x7F;

      if (value > 0x00004000) {
        data[data.length] = (value >> 14) & 0x7F;
      }

      if (value > 0x00200000) {
        data[data.length] = (value >> 21) & 0x7F;
      }

      if (value > 0x10000000) {
        data[data.length] = (value >> 28) & 0x7F;
      }

      data[data.length] = END_SYSEX;
    } else {
      data.push(ANALOG_MESSAGE | pin, value & 0x7F, (value >> 7) & 0x7F);
    }

    bluetoothSerial.write(data);
    
  }


}



function initApi(interpreter, scope) {

  Blockly.JavaScript.addReservedWords('analogWrite');
  // Add API function for digitalWrite
  var wrapper = function (pin, value) {
    fBoard.pinMode(pin,fBoard.MODES.PWM);
    fBoard.pwmWrite(pin, value);
  }

  interpreter.setProperty(scope,'analogWrite', interpreter.createNativeFunction(wrapper));
  
  Blockly.JavaScript.addReservedWords('digitalWrite');
  // Add API function for digitalWrite
  var wrapper = function (pin, value) {
    fBoard.pinMode(pin,fBoard.MODES.OUTPUT);
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

  Blockly.JavaScript.addReservedWords('reset');
  var wrapper = interpreter.createAsyncFunction(
    function() {
      // Delay the call to the callback.
      fBoard.reset();
    });
  interpreter.setProperty(scope, 'reset', wrapper);

     // Add an API function for highlighting blocks.
  wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
  };      
  interpreter.setProperty(scope, 'highlightBlock',
          interpreter.createNativeFunction(wrapper));
}
  

 
