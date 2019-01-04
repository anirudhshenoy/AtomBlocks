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

var Atom = Atom || {};
var myInterpreter=null;
var latestCode='';
var runner;
var highlightPause = false;
var workspacePlayground=null;
var fboard;
var attachFastClick;

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
            function(){},
            Atom.notEnabled
        );
  
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};




Atom.connectAtom = function() {
    M.toast({html:'Connecting...', displayLength: 1000});
    //macAddress= "00:18:E4:00:63:FB";
    bluetoothSerial.list(Atom.connectBluetooth, Atom.connectError);
 
}

Atom.connectBluetooth = function(devices){
  var deviceId=null;
  var foundFlag=false;
  devices.forEach(function(device){
        if (device.name=="ATOM"){
          deviceId=device.address;
          foundFlag=true;
        }
    });
  if (foundFlag){
  //M.toast({html:deviceId, displayLength: 1000});
  bluetoothSerial.connect(deviceId,Atom.onConnect,Atom.connectError);

  }
  else{
    alert('Atom was not found. Please make sure ATOM is paired in Bluetooth settings! ');
  }
}



Atom.onConnect = function(){
    document.getElementById('button_connect').classList.remove('connect-button-not-connected');
    document.getElementById('button_connect').classList.remove('pulse');
    document.getElementById('button_connect').classList.add('connect-button-connected');

}

Atom.connectError = function(){
    M.toast({html:'Not Connnected', displayLength: 1000});
}
Atom.notEnabled = function() {
            alert("Please Enable Bluetooth to connect to Atom!")
        }

Atom.connectBoard = function() {
    
}

Atom.init = function() 
{  

  attachFastClick = Origami.fastclick;
  attachFastClick(document.body);
  var toolbox = document.getElementById('toolbox-categories');
  workspacePlayground = Blockly.inject('blocks_panel',
  {
    disable: true,
    media: 'js/blockly/media/',
    scrollbars: false,
    trashcan:false,
    toolbox: toolbox,
    toolboxPosition: 'start',
    toolboxOptions:
      {
        color: true,
        inverted: true
      },
    zoom:
         {
          startScale: 0.7
          }

  });


 

    Atom.bindFunctions();
}

Atom.exportCode = function() {
    if (myInterpreter){
      resetInterpreter();
    }
    else {
      runCode();  
    }
}

Atom.bindFunctions = function() {
     Atom.bindClick_('button_ide_large', function() {
        Atom.exportCode();});
    Atom.bindClick_('button_connect', function() {
       Atom.connectAtom();});
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
  //M.toast({html:code});
  resetStepUi(true);
}


function resetInterpreter() {
    myInterpreter = null;
    if (runner) {
    clearTimeout(runner);
    runner = null;
    }
    togglePlayButton(0);
}

function togglePlayButton(toggle){
  if(toggle===1){

    document.getElementById('button_ide_large').classList.add('pulse');
    document.getElementById('play-icon').classList.remove('fa-play');
    document.getElementById('play-icon').classList.add('fa-stop');

  }
  else{
    
    document.getElementById('button_ide_large').classList.remove('pulse');
    document.getElementById('play-icon').classList.remove('fa-stop');
    document.getElementById('play-icon').classList.add('fa-play');
  }
}

function runCode() {
  resetInterpreter();
  togglePlayButton(1);
  generateCodeAndLoadIntoInterpreter();
  fBoard= new firmataBoard();
  fBoard.reset();
  if (!myInterpreter) {
    // First statement of this code.
    // Clear the program output.
    resetStepUi(true);

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
            resetStepUi(false);
          }
        }
      };
      runner();
    }, 1);
    
    return;
  }
}

