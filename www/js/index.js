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
        
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

var Atom = Atom || {};


Atom.connectAtom = function() {
    M.toast({html: 'Connecting...'});
    macAddress= "00:18:E4:00:63:FB";
    bluetoothSerial.connect(macAddress,Atom.onConnect,Atom.connectError);
}

Atom.onConnect = function(){
    M.toast({html: 'Connected WOHO!'});

}

Atom.connectError = function(){
    M.toast({html: 'Not Connected :('});
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

    var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
    M.toast({html: code});
    try {
	  eval(code);
	} catch (e) {
	  alert(e);
	}


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
};