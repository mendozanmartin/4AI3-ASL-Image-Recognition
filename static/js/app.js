
//LOAD FUNCTION
function loadFunction() {
    cdreset();
    document.getElementById("Next").disabled = true;
    document.getElementById("Reset").disabled = true;
}
// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;
let text = ""
let points = 0;
let something = 0;

//Overlay box
// var canvas = document.getElementById("overlayBox");
// var ctx = canvas.getContext("2d");
// let canvasWidth = $("#overlayBox").width();
// let canvasHeight = $("#overlayBox").height();



// ctx.rect(0, 0, 245, 245);
// ctx.fillStyle = "rgba(0,0, 0, 0.01)";
// ctx.fill();
// ctx.lineWidth = 5;
// ctx.strokeStyle = "red";
// ctx.stroke();

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
function cameraSnap() {
    // cameraSensor.width = cameraView.videoWidth;
    // cameraSensor.height = cameraView.videoHeight;
    cameraSensor.width = 100;
    cameraSensor.height = 100;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0, 450, 337.5);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    console.log(cameraOutput.src);
    let splitString = cameraOutput.src.split('base64,');

    $.ajax({
        type: 'POST',
        // url: 'http://localhost:5000/form-example',
        url: 'https://asl-image-recognition.nn.r.appspot.com/form-example',
        data: JSON.stringify({
            'baseurl': splitString[1]
        }),
        contentType: 'application/json;charset=UTF-8',
        error: function (e) {
            console.log(e)
        },
        success: function (response, textStatus, jqXHR) {
            console.log(response);
            $("#prediction").text(response)
            console.log(text)
            if (text === response) {
                console.log("You are correct");
                points += 1
                $("#numPoints").text(points);
                $("#indicator").css({ "background-color": "#7cfc00", "color": "white" })
            } else {
                $("#indicator").css({ "background-color": "#dc143c", "color": "white" })
            }
        }
    })
    cameraOutput.classList.add("taken");
    // track.stop();
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);


// Install ServiceWorker
if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('/camera-app/part-2/sw.js', { scope: ' ' }).then(function () {
        console.log('CLIENT: service worker registration complete.');
    }, function () {
        console.log('CLIENT: service worker registration failure.');
    });
} else {
    console.log('CLIENT: service worker is not supported.');
}

//LETTER GENERATOR
function stringGen(len) {
    text = "";
    var charset = "LYRMIVF"; //Character pool to choose from

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function randLetter() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            $('.random-letter').text(stringGen(1));
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//COUNTDOWN
var CCOUNT = 3; //Timer length in seconds

var t, count;

function cddisplay() {
    // displays time in span
    document.getElementById('timespan').innerHTML = count;
};

function countdown() {
    // starts countdown
    cddisplay();
    if (count == 0) {
        // time is up, take a picture
        cameraSnap();
        document.getElementById("Next").disabled = false;
    } else {
        count--;
        t = setTimeout("countdown()", 1000);
        document.getElementById("Start").disabled = true;
    }
};

function cdnext() {
    // resets countdown
    count = CCOUNT;
    cddisplay();
    countdown();
};

function cdreset() {
    // resets countdown
    count = CCOUNT;
    cddisplay();
    clearTimeout(t);
    document.getElementById("Start").disabled = false;
    points = 0;
    $("#numPoints").text(points);
    $('.random-letter').text("");

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//START & NEXT BUTTONS 
function startAndGen() {
    randLetter();
    countdown();
    document.getElementById("Reset").disabled = false;
};

function nextAndGen() {
    randLetter();
    cdnext();
    document.getElementById("Next").disabled = true;
};
