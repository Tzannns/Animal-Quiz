window.onload = function () {
  // Object containing quiz questions and answers
  var quiz_qa = {
    qa1: [
      "Apa yang dilakukan llama ketika marah?",
      "Meludah",
      "Menghentak-hentakkan kaki",
      "Pergi mengamuk",
      "Menulis surat protes",
      "1",
    ],
    qa2: [
      "Apa hal pertama yang dimakan ulat setelah lahir?",
      "Serangga lain",
      "Rumput",
      "Cangkang telurnya sendiri",
      "Sereal",
      "3",
    ],
    qa3: [
      "Berapa jumlah jantung yang dimiliki gurita?",
      "Satu",
      "Dua",
      "Tiga",
      "Delapan",
      "3",
    ],
    qa4: [
      "Apa yang dilakukan kelinci saat merasa terancam?",
      "Berlari cepat",
      "Menggali lubang",
      "Memesan Ojol",
      "Pura-pura mati",
      "1",
    ],
    qa5: [
      "Apa yang dilakukan berang-berang laut saat tidur agar tidak hanyut?",
      "Berbaring di atas batu",
      "Berpegangan tangan",
      "Berpegangan pada sesuatu",
      "Mereka tidak tidur",
      "2",
    ],
    qa6: [
      "Apa pola khas yang dimiliki zebra?",
      "Bintik-bintik berwarna-warni",
      "Hitam saja",
      "Garis-garis hitam dan putih",
      "Garis-garis biru dan hijau",
      "3",
    ],
    qa7: [
      "Apa makanan utama panda?",
      "Bambu",
      "Daging",
      "Daun-daun kering",
      "Ikan",
      "1",
    ],
    qa8: [
      "Berapa jumlah kaki laba-laba?",
      "Enam",
      "Delapan",
      "Sepuluh",
      "Dua Belas",
      "2",
    ],
    qa9: [
      "Berapa lama masa kehamilan seekor gajah berlangsung?",
      "12 bulan",
      "18 bulan",
      "22 bulan",
      "24 bulan",
      "3",
    ],
    qa10: [
      "Berapa jumlah mata lebah madu?",
      "Dua",
      "Tiga",
      "Lima",
      "Enam",
      "3",
    ],
  };

  var startEl = document.getElementById("start");
  var timerEl = document.getElementById("timer");
  var timer;
  var time = 100;
  var score = null;

  startEl.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("audio").play();
    addQuiz();
    timer = setInterval(function () {
      if (time > 0 && !score) {
        time--;
        timerEl.textContent = time;
      } else {
        result();
      }
    }, 1000);
  });

  var formEl = document.querySelector("form");

  function clearForm() {
    formEl.innerHTML = "";
  }

  var qNum = 0;
  var totalQuestions = Object.keys(quiz_qa).length;
  var h2Cr = document.createElement("h2");
  var imgCr = document.createElement("img");

  function addQuiz() {
    clearForm();
    qNum++;
    imgCr.setAttribute("src", "imgs/qa" + qNum + ".png");
    imgCr.setAttribute("class", "images");
    formEl.appendChild(imgCr);
    h2Cr.textContent = quiz_qa["qa" + qNum][0];
    formEl.appendChild(h2Cr);
    for (let i = 1; i <= 4; i++) {
      // Loop melalui 4 pilihan jawaban
      var choice = document.createElement("button");
      choice.textContent = quiz_qa["qa" + qNum][i];
      choice.setAttribute("class", "btn btn-warning m-1 choices");
      choice.setAttribute("id", i);
      formEl.appendChild(choice);
    }
  }

  function playSound(source) {
    const sX = new Audio(source);
    sX.play();
  }

  formEl.addEventListener("click", function (e) {
    e.preventDefault();
    var et = e.target;
    if (et.id === "backBtn") {
      location.reload();
    } else if (et.id === "clearBtn") {
      window.localStorage.clear();
      document.querySelector("ol").innerHTML = "";
    } else if (et.id === quiz_qa["qa" + qNum][5]) {
      playSound("sounds/correct.wav");
      et.setAttribute("style", "background-color: lawngreen");
      time = Math.min(time + 5, 100); // Add 5 seconds but cap at 100
      if (qNum !== totalQuestions) {
        setTimeout(function () {
          addQuiz();
        }, 500);
      } else {
        setTimeout(function () {
          result();
        }, 500);
      }
    } else if (parseInt(et.id) <= 4) {
      time = time - 10;
      playSound("sounds/wrong.wav");
      et.setAttribute("style", "background-color: red; color: white");
    }
  });

  function result() {
    clearForm();
    clearInterval(timer);
    timerEl.textContent = 0;
    score = time < 0 ? 0 : time;
    h2Cr.textContent = "Your Final Score: " + score;
    formEl.appendChild(h2Cr);
    var inputCr = document.createElement("input");
    inputCr.setAttribute("placeholder", "Enter Your Name");
    inputCr.setAttribute("class", "text-center align-self-center choices");
    inputCr.setAttribute("id", "nameInput");
    formEl.appendChild(inputCr);
    var submitCr = document.createElement("button");
    submitCr.textContent = "Submit";
    submitCr.setAttribute("class", "btn btn-warning m-3");
    formEl.appendChild(submitCr);
    submitCr.addEventListener("click", storeUser);
  }

  function storeUser(e) {
    e.preventDefault();
    var username = document.getElementById("nameInput").value.trim();
    localStorage.setItem(username, JSON.stringify(score));
    clearForm();
    viewHighScore();
  }

  function viewHighScore() {
    h2Cr.textContent = "Highscores";
    formEl.appendChild(h2Cr);
    formEl.appendChild(document.createElement("ol"));
    var names = Object.keys(localStorage);
    var scores = Object.values(localStorage).map(Number);

    // Combine names and scores into an array of objects, sort by score
    var highScores = names.map((name, index) => ({
      name,
      score: scores[index],
    }));
    highScores.sort((a, b) => b.score - a.score);

    // Render sorted high scores
    for (let i = 0; i < highScores.length; i++) {
      var item = document.createElement("li");
      item.textContent = highScores[i].name + " - " + highScores[i].score;
      document.querySelector("ol").appendChild(item);
    }

    var backCr = document.createElement("button");
    backCr.textContent = "Go Back";
    backCr.setAttribute("class", "btn btn-warning");
    backCr.setAttribute("id", "backBtn");
    formEl.appendChild(backCr);

    var clearCr = document.createElement("button");
    clearCr.textContent = "Clear Highscores";
    clearCr.setAttribute("class", "btn btn-warning m-3");
    clearCr.setAttribute("id", "clearBtn");
    formEl.appendChild(clearCr);
  }

  var hsBtn = document.getElementById("view-hs");
  hsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearForm();
    viewHighScore();
  });
};
