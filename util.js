// Utility functions

function setAction (action) {
    document.getElementById("action").innerText = action;
}

function clearAction () {
    document.getElementById("action").innerText = "No action";
}

function setNotification (notification) {
    document.getElementById("notification").innerText = notification;
}

function setPlayer (player) {
    document.getElementById("current").innerText = player.name;
}

// Global Presets
var keys = [];
const friction = 0.8;
const gravity = 0.5;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const width = 500;
const height = 200;
canvas.width = width;
canvas.height = height;

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});