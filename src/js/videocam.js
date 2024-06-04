window.addEventListener("load", startVideo());
// spørger om man må få tilladelse til at bruge deres indbyggede webcam
async function startVideo() {
  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Error accessing camera: ", err);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("background-video");
  var playButton = document.getElementById("play-button");
  var pauseButton = document.getElementById("pause-button");
  var forwardButton = document.getElementById("forward-button");
  var backwardButton = document.getElementById("backward-button");
  var h1Con1 = document.querySelector(".con-1 h1");
  var pCon1 = document.querySelector(".con-1 p");
  var h2Con2 = document.querySelector(".con-2 h2");
  var pCon2 = document.querySelector(".con-2 p");
  var closeButton = document.querySelector(".close-v");

  async function fetchData() {
    await fetch("https://jlgsxiynwqvvhwheexwo.supabase.co/rest/v1/exercises", {
      method: "GET",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZ3N4aXlud3F2dmh3aGVleHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NzA5MjksImV4cCI6MjAzMDA0NjkyOX0.U40ZZWRh_MC7612vdwFHVKFZxwRHq_TECCnnzovEXKE",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dataList(data);
      });
  }
  fetchData();

  video.pause();

  playButton.style.display = "inline-block";
  pauseButton.style.display = "none";

  playButton.addEventListener("click", function () {
    video.play();
    video.muted = false;
    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
  });

  pauseButton.addEventListener("click", function () {
    video.pause();
    playButton.style.display = "inline-block";
    pauseButton.style.display = "none";
  });

  let programArray = [];
  let exercisesList = [];
  let videoData = [];

  function dataList(data) {
    if (sessionStorage.getItem("program-list")) {
      exercisesList = JSON.parse(sessionStorage.getItem("program-list"));
      programArray = exercisesList.map((arr) => arr[0]);
    }
    const filteredData = data.filter((item) =>
      programArray.includes(item.image)
    );
    videoData = filteredData.map((data, index) => {
      const object = {};
      object.src = `../assets/videos/v${data.image}.mp4`;
      object.h1Con1 = "Repetition 1";
      object.pCon1 = `1/5`;
      object.h2Con2 = `Øvelse ${data.id}`;
      object.pCon2 = data.title;
      return object;
    });
    updateVideoAndText(videoData, 0);
  }

  closeButton.addEventListener(
    "click",
    () => (window.location.href = "/gemte-programmer")
  );

  function updateVideoAndText(videoData, currentVideoIndex) {
    console.log(videoData);
    forwardButton.addEventListener("click", function () {
      if (currentVideoIndex < videoData.length - 1) {
        currentVideoIndex++;
      } else {
        currentVideoIndex = videoData.length - 1;
      }
      updateVideoAndText(videoData, currentVideoIndex);
    });
    backwardButton.addEventListener("click", function () {
      if (currentVideoIndex > 0) {
        currentVideoIndex--;
      } else {
        currentVideoIndex = 0;
      }
      updateVideoAndText(videoData, currentVideoIndex);
    });
    var currentVideo = videoData[currentVideoIndex];
    video.src = currentVideo.src;
    h1Con1.textContent = currentVideo.h1Con1;
    pCon1.textContent = currentVideo.pCon1;
    h2Con2.textContent = currentVideo.h2Con2;
    pCon2.textContent = currentVideo.pCon2;
    video.pause();
    playButton.style.display = "inline-block";
    pauseButton.style.display = "none";
  }
});
