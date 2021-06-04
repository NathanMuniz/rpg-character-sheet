(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
},{}],2:[function(require,module,exports){
function read(field) {
  try {
    return document.forms.ficha.elements[field].value;
  }
  catch(err) {
    console.log('error reading field ' + field, err);
    return '';
  }
}

var nomepersonagem = window.document.querySelector("input#name")
var vidaAtual = window.document.querySelector("#input#current")


function readForm() {
  return {
    nome: nomepersonagem.value,
    vidaatual: vidaAtual.value
  };
}

function persistForm(name) {
  window.localStorage[name] = JSON.stringify(readForm());
}

function restoreForm(name) {
  if (!window.localStorage[name]) {
    return;
  }

  try{
    var data = JSON.parse(window.localStorage[name]);
    var elements = document.forms.ficha.elements;

    nomepersonagem.value = "joão";
    elements.vidaAtual.value = data.vidaAtual;
  }
  catch(err) {
    console.log('Error reading form from localstorage', err);
  }
}

function getPageName() {
  var search = document.location.search;
  if (search === '') {
    return null;
  }

  var nameRegex = /[\?&]name=([^&]*)/;
  var match = search.match(nameRegex);

  if (!match) {
    return null;
  }
  return match[1];
}

module.exports = {
  getPageName: getPageName,
  persistForm: persistForm,
  restoreForm: restoreForm
}
},{}],3:[function(require,module,exports){
var ficha = require('./ficha');
var debounce = require('./debounce');

function initForm() {
  var name = ficha.getPageName();
  if (name) {
    ficha.restoreForm(name);
  }
}

var updatePersistence = debounce(function() {
  ficha.persistForm(ficha.getPageName());
}, 250);

function addListeners() {
  document.querySelectorAll('input,textarea').forEach(function(input) {
    input.addEventListener('change', function(e) {
      updatePersistence();
    });
  });
}

function init() {
  if (!ficha.getPageName()) {
    history.pushState({}, 'default', '?name=default');
  }

  initForm();
  addListeners();
}

init();
},{"./debounce":1,"./ficha":2}]},{},[3]);
