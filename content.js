const broadcastEndDate = new Date("2018-04-30T15:00:00");
const broadcastStartDate = new Date("2018-04-16T09:00:00");
const publishDate = new Date("2018-04-09");
const nextBroadcastDate = new Date("2019-04-15");
const daysBetweenPublishAndStart = 8;
const broadcastDays = 15;
const TODAY = new Date();
const isBroadcastSeason =
  TODAY >= broadcastStartDate && TODAY <= broadcastEndDate;
let streamIsPlaying = false;
let audioElement;

const imgURL = chrome.extension.getURL("vyotista.png");
const playURL = chrome.extension.getURL("play.png");
const mp3StreamURL = "https://virta.radiodiodi.fi/radiodiodi-mp3";

const newHTML = `<div class="creditinfo col-md-9 col-xs-12">
                <div class="row">
                    <div class="pull-right">
                        <a class="btn btn-default btn-sm" href="https://wappu.fi" target="_blank">
                            <i>wappu.fi</i>
                        </a>
                        <a class="btn btn-default btn-sm" href="https://radiodiodi.fi" target="_blank">
                            <i>radiodiodi.fi</i>
                        </a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-3 col-xs-0">
                        <div class="totalscore">
                        </div>
                    </div>

                    <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12">
                        <div class="academicyear">
                            <h3>
                                <span id="main-title">Lähetyksen alkuun</span><span id="radio-clock"></span>
                            </h3>
                            <progress class="progress progress-success" role="progressbar" value="5" min="0" max="${daysBetweenPublishAndStart}" style="width:100%" id="radio-progress"></progress>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-xs-12" style="padding:5px;">
                                <div class="card-group">
                                    <div class="card" style="width:80px">
                                        <span class="goalicon" />
                                    </div>
                                    <div class="card">
                                        <p id="radio-motivational" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
`;
// Replace old html
document.getElementsByClassName(
  "creditinfo"
)[0].parentElement.innerHTML = newHTML;

function initializeStream() {
  audioElement = document.createElement("audio");
  audioElement.setAttribute("preload", "auto");
  audioElement.autobuffer = true;

  const source1 = document.createElement("source");
  source1.type = "audio/mpeg";
  source1.src = mp3StreamURL;
  audioElement.appendChild(source1);
}

function constructRadioLogo() {
  const div = document.createElement("DIV");
  div.id = "radio-logo";
  div.className = "totalscore";
  const img = document.createElement("IMG");
  img.src = imgURL;
  img.width = 120;
  div.appendChild(img);
  document.getElementsByClassName("totalscore")[0].replaceWith(div);
}

function constructPlayButton() {
  const playDiv = document.createElement("DIV");
  playDiv.id = "play-button";
  playDiv.className = "goalicon";
  playDiv.onclick = onPlayClick;
  const playImg = document.createElement("IMG");
  playImg.src = playURL;
  playImg.width = 64;
  playDiv.appendChild(playImg);
  document.getElementsByClassName("goalicon")[0].replaceWith(playDiv);
}

function getTimeRemaining(endtime) {
  const t = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

function initializeCountdown(endtime, countdownMax, countdownCurrent) {
  document.getElementById("radio-progress").value = countdownCurrent;
  document.getElementById("radio-progress").max = countdownMax;

  const element = "radio-clock";
  const clock = document.getElementById(element);
  const timeinterval = setInterval(function() {
    const t = getTimeRemaining(endtime);
    days = t;
    clock.innerHTML =
      " " +
      t.days +
      " pv, " +
      t.hours +
      " h, " +
      t.minutes +
      " min, " +
      t.seconds +
      " s";
    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }, 1000);
}

function constructMotivationalText() {
  document.getElementById("radio-motivational").innerHTML =
    "Radiodiodi - 105.8 MHz";
  /*const request = quoteURL;
  const element = "radio-motivational";
  window
    .fetch(request)
    .then(response => response.json())
    .then(body => {
      if (!body) {
        document.getElementById(element).innerHTML =
          "ToimitusJohtaja ToimitusJohtaja ToimitusJohtaja";
      } else {
        document.getElementById(element).innerHTML = body.quote;
      }
    })
    .catch(err => {
      // Unable to connect to radiodiodi.fi
      console.log(err);
      document.getElementById(element).innerHTML =
        "Nyt kuuluu: Päätoimittajan mouhoa<br /><br />ToimitusJohtaja ToimitusJohtaja ToimitusJohtaja";
    });*/
}

function constructNowPlayingText() {
  constructMotivationalText();
  /*
  const request = nowPlayingURL;
  const element = "radio-motivational";
  window
    .fetch(request)
    .then(response => response.json())
    .then(body => {
      if (!body) {
        document.getElementById(element).innerHTML =
          "ToimitusJohtaja ToimitusJohtaja ToimitusJohtaja";
      } else {
        document.getElementById(element).innerHTML = body.quote;
      }
    })
    .catch(err => {
      // Unable to connect to radiodiodi.fi
      console.log(err);
      document.getElementById(element).innerHTML =
        "Nyt kuuluu: Päätoimittajan mouhoa<br /><br />ToimitusJohtaja ToimitusJohtaja ToimitusJohtaja";
    });*/
}

function playAudioStream() {
  if (streamIsPlaying) {
    audioElement.pause();
    document.getElementById("play-button").style.transition = "";
    document.getElementById("play-button").style.transform = "";
    streamIsPlaying = false;
  } else {
    document.getElementById("play-button").style.transform = "rotate(360deg)";
    document.getElementById("play-button").style.animation =
      "rotation 2s infinite linear";

    audioElement.load();
    audioElement.play();
    streamIsPlaying = true;
  }
}

function spinPlayIcon() {
  document.getElementById("play-button").style.transition = "4s ease-in-out";
  document.getElementById("play-button").style.transform = "rotate(360deg)";

  setTimeout(() => {
    // Reset transition
    document.getElementById("play-button").style.transition = "";
    document.getElementById("play-button").style.transform = "";
  }, 4001);
}

function onPlayClick() {
  if (isBroadcastSeason) {
    playAudioStream();
    spinPlayIcon();
  } else {
    spinPlayIcon();
  }
}

function setTitle() {
  document.getElementById("main-title").innerText = "Lähetystä vielä";
}

function init() {
  if (isBroadcastSeason) {
    // During broadcast
    const countdownProgress =
      broadcastDays - getTimeRemaining(broadcastEndDate).days;

    initializeCountdown(broadcastEndDate, broadcastDays, countdownProgress);
    constructNowPlayingText();
    initializeStream();
    setTitle();
  } else if (TODAY < broadcastStartDate) {
    // Before broadcast
    const countdownProgress =
      daysBetweenPublishAndStart - getTimeRemaining(broadcastStartDate).days;

    initializeCountdown(
      broadcastStartDate,
      daysBetweenPublishAndStart,
      countdownProgress
    );
    constructMotivationalText();
  } else {
    // After broadcast
    const countdownProgress = 351 - getTimeRemaining(nextBroadcastDate).days;

    initializeCountdown(nextBroadcastDate, 351, countdownProgress);
    constructMotivationalText();
  }
  constructRadioLogo();
  constructPlayButton();
}

init();
