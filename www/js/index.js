/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        screen.orientation.lock('landscape');
        Atom.init();
        
        bluetoothSerial.isEnabled(
            Atom.connectAtom,
            Atom.notEnabled
        );
        generateCodeAndLoadIntoInterpreter();
        workspacePlayground.addChangeListener(function(event) {
          if (!(event instanceof Blockly.Events.Ui)) {
            // Something changed. Parser needs to be reloaded.
            resetInterpreter();
            generateCodeAndLoadIntoInterpreter();
            }
        });

        
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

var Atom = Atom || {};
var toasted = new Toasted({
    position : 'bottom-left',
    theme : 'alive',
    duration: 1000,
});
var myInterpreter=null;
var latestCode='';
var runner;
var highlightPause = false;


Atom.connectAtom = function() {
    toasted.show('Connecting...');
    macAddress= "00:18:E4:00:63:FB";
    bluetoothSerial.connect(macAddress,Atom.onConnect,Atom.connectError);
}

Atom.onConnect = function(){
    toasted.show('Connected WOHO!');

}

Atom.connectError = function(){
    toasted.show('Not Connected :(');
}
Atom.notEnabled = function() {
            alert("Bluetooth is not enabled.")
        }

Atom.connectBoard = function() {
    
}
Atom.init = function() {
    Atom.bindFunctions();
    
}

Atom.exportCode = function() {

    
    runCode();
    

}

Atom.bindFunctions = function() {
     Atom.bindClick_('button_ide_large', function() {
        Atom.exportCode();});
}


Atom.bindClick_ = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  // Need to ensure both, touch and click, events don't fire for the same thing
  var propagateOnce = function(e) {
    e.stopPropagation();
    e.preventDefault();
    func();
  };
  el.addEventListener('ontouchend', propagateOnce);
  el.addEventListener('click', propagateOnce);
}

function highlightBlock(id) {
      workspacePlayground.highlightBlock(id);
      highlightPause = true;
}

function resetStepUi(clearOutput) {
  workspacePlayground.highlightBlock(null);
  highlightPause = false;
}


function generateCodeAndLoadIntoInterpreter() {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  latestCode = Blockly.JavaScript.workspaceToCode(workspacePlayground);
  toasted.show(latestCode);
  resetStepUi(true);
}


function resetInterpreter() {
    myInterpreter = null;
    if (runner) {
    clearTimeout(runner);
    runner = null;
    }
}


function runCode() {
  if (!myInterpreter) {
    // First statement of this code.
    // Clear the program output.
    resetStepUi(true);
    //runButton.disabled = 'disabled';

    // And then show generated code in an alert.
    // In a timeout to allow the outputArea.value to reset first.
    setTimeout(function() {
      
      // Begin execution
      highlightPause = false;
      myInterpreter = new Interpreter(latestCode, initApi);
      runner = function() {
        if (myInterpreter) {
          var hasMore = myInterpreter.run();
          if (hasMore) {
            // Execution is currently blocked by some async call.
            // Try again later.
            setTimeout(runner, 10);
          } else {
            // Program is complete.
            
            resetInterpreter();
            //resetStepUi(false);
          }
        }
      };
      runner();
    }, 1);
    return;
  }
}