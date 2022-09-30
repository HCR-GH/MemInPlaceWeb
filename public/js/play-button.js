var yourAudio = document.getElementById('yourAudio'),
ctrl = document.getElementById('audioControl');

ctrl.onclick = function () {

// Update the Button
var pause = ctrl.innerHTML === '<span class="icon-text"><span class="icon"><i class="fa-solid fa-circle-pause"></i></span><span>Pause</span></span>'; //sets pause to  true / false
ctrl.innerHTML = pause ? '<span class="icon-text"><span class="icon"><i class="fa-solid fa-circle-play"></i></span><span>Play</span></span>' 
: '<span class="icon-text"><span class="icon"><i class="fa-solid fa-circle-pause"></i></span><span>Pause</span></span>'; //if pause is true set html to play else pause

// Update the Audio
var method = pause ? 'pause' : 'play'; //if pause is true set method to pause else play
yourAudio[method](); //calls pause or play (depending on what method is set to)


// Prevent Default Action
return false;
}
yourAudio.addEventListener('ended', function() {
    ctrl.innerHTML =  '<span class="icon-text"><span class="icon"><i class="fa-solid fa-circle-play"></i></span><span>Play</span></span>' 
})
;
