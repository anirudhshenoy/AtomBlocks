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
var receiveBuffer= new Uint8Array([]);
var lastCommand= [];
const MIDI_RESPONSE = {};


MIDI_RESPONSE[REPORT_VERSION] = function(board) {
  board.version.major = board.buffer[1];
  board.version.minor = board.buffer[2];
  return (board.version.major);
}


function firmataBoard (){

	this.ports = new Array(16).fill(0);
  this.buffer = [];
  this.version={};
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
  bluetoothSerial.subscribeRawData(this.receivedData, function(){console.log('failure')});
}

firmataBoard.prototype.receivedData = function(data){
    var bytes = new Uint8Array(data);
    var c = new Uint8Array(receiveBuffer.length + bytes.length);
    c.set(receiveBuffer);
    c.set(bytes, receiveBuffer.length);
    receiveBuffer=c;
    console.log('received' + receiveBuffer);
    if(c[0]===START_SYSEX && c[c.length-1]===END_SYSEX){
      lastCommand.push(receiveBuffer);
      receiveBuffer=new Uint8Array([]);
    }
    else if (c[0]!==START_SYSEX){
      if(c.length>=3){
        lastCommand.push(c.subarray(0,3));
        receiveBuffer=new Uint8Array([]);
      }
    }
  }

firmataBoard.prototype.decodeMessage = function(){
    var data=lastCommand[0];
    console.log("inside decodeMessage with" + data);
    var byte, currByte, response, first, last, handler;
    for (var i = 0; i < data.length; i++) {
      byte = data[i];
      // we dont want to push 0 as the first byte on our buffer
      if (this.buffer.length === 0 && byte === 0) {
        continue;
      } else {
        this.buffer.push(byte);

        first = this.buffer[0];
        last = this.buffer[this.buffer.length - 1];

        // [START_SYSEX, ... END_SYSEX]
        if (first === START_SYSEX && last === END_SYSEX) {

          handler = SYSEX_RESPONSE[this.buffer[1]];

          // Ensure a valid SYSEX_RESPONSE handler exists
          // Only process these AFTER the REPORT_VERSION
          // message has been received and processed.
          if (handler) {
            lastCommand=[];
            return(handler(this));
          }

          // It is possible for the board to have
          // existing activity from a previous run
          // that will leave any of the following
          // active:
          //
          //    - ANALOG_MESSAGE
          //    - SERIAL_READ
          //    - I2C_REQUEST, CONTINUOUS_READ
          //
          // This means that we will receive these
          // messages on transport "open", before any
          // handshake can occur. We MUST assert
          // that we will only process this buffer
          // AFTER the REPORT_VERSION message has
          // been received. Not doing so will result
          // in the appearance of the program "hanging".
          //
          // Since we cannot do anything with this data
          // until _after_ REPORT_VERSION, discard it.
          //
          lastCommand=[];
          this.buffer.length = 0;

        } else {
          /* istanbul ignore else */
          if (first !== START_SYSEX) {
            // Check if data gets out of sync: first byte in buffer
            // must be a valid response if not START_SYSEX
            // Identify response on first byte
            response = first < START_SYSEX ? (first & START_SYSEX) : first;
            // Check if the first byte is possibly
            // a valid MIDI_RESPONSE (handler)
            /* istanbul ignore else */
            if (response !== REPORT_VERSION &&
                response !== ANALOG_MESSAGE &&
                response !== DIGITAL_MESSAGE) {
              // If not valid, then we received garbage and can discard
              // whatever bytes have been been queued.
              lastCommand=[];
              this.buffer.length = 0;
            }
          }
        }

        // There are 3 bytes in the buffer and the first is not START_SYSEX:
        // Might have a MIDI Command
        if (this.buffer.length === 3 && first !== START_SYSEX) {
          // response bytes under 0xF0 we have a multi byte operation
          response = first < START_SYSEX ? (first & START_SYSEX) : first;

          /* istanbul ignore else */
          if (MIDI_RESPONSE[response]) {
            // It's ok that this.versionReceived will be set to
            // true every time a valid MIDI_RESPONSE is received.
            // This condition is necessary to ensure that REPORT_VERSION
            // is called first.
            if (first === REPORT_VERSION) {
              lastCommand=[];
              console.log(this.buffer);
              return(MIDI_RESPONSE[response](this));
            }
            lastCommand=[];
            this.buffer.length = 0;
          } else {
            // A bad serial read must have happened.
            // Reseting the buffer will allow recovery.
            lastCommand=[];
            this.buffer.length = 0;
          }
        }
      }
    }
    lastCommand=[];
  }
  /**
   * Asks the arduino to write a value to a digital pin
   * @param {number} pin The pin you want to write a value to.
   * @param {number} value The value you want to write. Must be board.HIGH or board.LOW
   * @param {boolean} enqueue When true, the local state is updated but the command is not sent to the Arduino
   */

firmataBoard.prototype.digitalWrite = function (pin, value) {
      let port = updateDigitalPort(this, pin, value);
      writeDigitalPort(this, port);
    }

function queryFirmware (board){
    console.log('sent request');
    bluetoothSerial.write([REPORT_VERSION]);
  }

function updateDigitalPort(board, pin, value) {
      const port = pin >> 3;
      const bit = 1 << (pin & 0x07);

      if (value) {
          board.ports[port] |= bit;
      } 
      else {
          board.ports[port] &= ~bit;
      }
      return port;
  }

  /**
   * Update a digital port (group of 8 digital pins) on the Arduino
   * @param {number} port The port you want to update.
   */

function  writeDigitalPort(board, port) {
      var data = [(DIGITAL_MESSAGE | port), (board.ports[port] & 0x7F), ((board.ports[port] >> 7) & 0x7F)];
      console.log(data);
      bluetoothSerial.write(data);
	}



  /*
    * mode (INPUT/OUTPUT/ANALOG/PWM/SERVO/I2C/ONEWIRE/STEPPER/ENCODER/SERIAL/PULLUP, 0/1/2/3/4/6/7/8/9/10/11)
  */
firmataBoard.prototype.pinMode = function(pin, mode) {
    bluetoothSerial.write([PIN_MODE, pin, mode]);
  }

 /**
   * Write a PWM value Asks the arduino to write an analog message.
   * @param {number} pin The pin to write analog data to.
   * @param {number} value The data to write to the pin between 0 and this.RESOLUTION.PWM.
   */

firmataBoard.prototype.reset = function() {
    bluetoothSerial.write([SYSTEM_RESET]);
  }

firmataBoard.prototype.pwmWrite = function(pin, value) {
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


  /*function (pin, value) {
    queryFirmware();
    let promise = new Promise((resolve, reject) => {
      setTimeout(()=> {resolve(fBoard.decodeMessage())},50);
    }).then(function(result){
      M.toast({html:result});
    });}*/



function initApi(interpreter, scope) {
  Blockly.JavaScript.addReservedWords('waitForSeconds');
  var wrapper = interpreter.createAsyncFunction(
    function(timeInSeconds, callback) {
      // Delay the call to the callback.
      setTimeout(callback, timeInSeconds * 1000);
    });
  interpreter.setProperty(scope, 'waitForSeconds', wrapper);

  //ANALOG READ
  Blockly.JavaScript.addReservedWords('analogRead');
  var wrapper = interpreter.createAsyncFunction(
    function (pin, callback) {
    queryFirmware();
    let promise = new Promise((resolve, reject) => {
      setTimeout(()=> {resolve(fBoard.decodeMessage())},100);
    }).then(function(result){
      console.log(result);
      callback();
    });
  });
  interpreter.setProperty(scope, 'analogRead', wrapper);
  


//ANALOG WRITE
  Blockly.JavaScript.addReservedWords('analogWrite');
  // Add API function for digitalWrite
  var wrapper = function (pin, value) {
    fBoard.pinMode(pin,fBoard.MODES.PWM);
    fBoard.pwmWrite(pin, value);
  }

  interpreter.setProperty(scope,'analogWrite', interpreter.createNativeFunction(wrapper));
  

  //DIGITAL WRITE
  Blockly.JavaScript.addReservedWords('digitalWrite');
  // Add API function for digitalWrite
  var wrapper = function (pin, value, callback) {
    fBoard.pinMode(pin,fBoard.MODES.OUTPUT);
    fBoard.digitalWrite(pin, value);
    callback();
  }

  interpreter.setProperty(scope,'digitalWrite', interpreter.createAsyncFunction(wrapper));

  //RESET
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
  

 
