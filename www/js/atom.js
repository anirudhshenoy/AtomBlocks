
'use strict';

/** Create a namespace for the application. */
var Atom = Atom || {};


Atom.init = function() {
	Atom.bindFunctions();
}



Atom.bindFunctions = function() {
	 Atom.bindClick_('button_ide_large', function() {
    Atom.MaterialToast("Hello");
  });
}

Atom.shortMessage = function(message) {
  Atom.MaterialToast(message);
};

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