const themeBtn = document.getElementById("themeBtn");
const weatherVideo = document.getElementById("weatherVideo");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const refreshWeather = document.getElementById("refreshWeather");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const timer = document.getElementById("timer");
const timerStatus = document.getElementById("timerStatus");
const progressBar = document.getElementById("progressBar");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const goalChecks = document.querySelectorAll(".goalCheck");
const profileBtn = document.getElementById("profileBtn");
const profileSidebar = document.getElementById("profileSidebar");
const profileBackdrop = document.getElementById("profileBackdrop");
const closeProfile = document.getElementById("closeProfile");
const navLinks = document.querySelectorAll("aside nav a");
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
let totalSeconds = 25 * 60;
let plannerTimeout;
let interval;

if (darkMode) {
  document.body.classList.add("dark");
  themeBtn.innerHTML = '<i class="ri-moon-clear-fill text-xl"></i>';
}
profileBtn.addEventListener("click", function () {
  profileSidebar.style.right = "0";
  profileBackdrop.classList.remove("hidden");
});

function closeSidebar() {
  profileSidebar.style.right = "-400px";
  profileBackdrop.classList.add("hidden");
}

closeProfile.addEventListener("click", closeSidebar);

profileBackdrop.addEventListener("click", closeSidebar);
function applyTheme() {
  const cards = document.querySelectorAll(".bg-white, .bg-gray-800");
  const inputs = document.querySelectorAll("input, textarea");
  const topButtons = document.querySelectorAll("#themeBtn, #profileBtn");

  if (darkMode) {
    document.body.classList.replace("bg-gray-100", "bg-gray-900");

    cards.forEach((card) => {
      card.classList.remove("bg-white");
      card.classList.add("bg-gray-800", "text-white");
    });

    inputs.forEach((input) => {
      input.classList.add("bg-gray-700", "text-white", "border-gray-600");
    });
    topButtons.forEach((btn) => {
      btn.classList.remove("bg-gray-100");
      btn.classList.add("bg-gray-700", "text-white");
    });
  } else {
    document.body.classList.replace("bg-gray-900", "bg-gray-100");

    cards.forEach((card) => {
      card.classList.remove("bg-gray-800", "text-white");
      card.classList.add("bg-white");
    });

    inputs.forEach((input) => {
      input.classList.remove("bg-gray-700", "text-white", "border-gray-600");
    });
    topButtons.forEach((btn) => {
      btn.classList.remove("bg-gray-700", "text-white");
      btn.classList.add("bg-gray-100");
    });
  }
}

applyTheme();

themeBtn.addEventListener("click", function () {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", JSON.stringify(darkMode));

  if (darkMode) {
    themeBtn.innerHTML = '<i class="ri-moon-clear-fill text-xl"></i>';
  } else {
    themeBtn.innerHTML = '<i class="ri-sun-line text-xl"></i>';
  }

  applyTheme();
  renderTasks();
});

function updateDateTime() {
  const now = new Date();

  currentDate.textContent = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  currentTime.textContent = now.toLocaleTimeString("en-IN");
}

updateDateTime();

setInterval(updateDateTime, 1000);

function changeVideo() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 7) {
    weatherVideo.src = "videos/sunrise.mp4";
  } else if (hour >= 7 && hour < 17) {
    weatherVideo.src = "videos/day.mp4";
  } else if (hour >= 17 && hour < 19) {
    weatherVideo.src = "videos/sunset.mp4";
  } else {
    weatherVideo.src = "videos/night.mp4";
  }
}

changeVideo();

const links = document.querySelectorAll("aside a");

links.forEach(function (link) {
  link.addEventListener("click", function () {

    links.forEach(function (item) {
      item.classList.remove(
        "bg-blue-500",
        "bg-gray-100",
        "bg-gray-700",
        "text-white"
      );
    });

    this.classList.add("bg-blue-500", "text-white");
  });
});

async function getWeather() {
  const apiKey = "67278ffeda7517abda0cd35e29feed01";

  const city = "Mumbai";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather API Error");
    }
    const data = await response.json();

    temperature.textContent = Math.round(data.main.temp) + "°";

    cityName.textContent = data.name;

    weatherCondition.textContent = data.weather[0].main;

    humidity.textContent = data.main.humidity + "%";

    wind.textContent = data.wind.speed + " km/h";

    const condition = data.weather[0].main;

    if (condition === "Clear") {
      weatherIcon.className = "ri-sun-fill text-4xl";
    } else if (condition === "Clouds") {
      weatherIcon.className = "ri-cloudy-fill text-4xl";
    } else if (condition === "Rain") {
      weatherIcon.className = "ri-heavy-showers-fill text-4xl";
    } else if (condition === "Thunderstorm") {
      weatherIcon.className = "ri-thunderstorms-fill text-4xl";
    } else if (condition === "Snow") {
      weatherIcon.className = "ri-snowy-fill text-4xl";
    } else {
      weatherIcon.className = "ri-cloud-line text-4xl";
    }
  } catch (error) {
    cityName.textContent = "Unable to fetch weather";
  }
}

getWeather();
refreshWeather.addEventListener("click", getWeather);

async function getQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");

    const data = await response.json();

    quoteText.textContent = `"${data.quote}"`;

    quoteAuthor.textContent = "- " + data.author;
  } catch (error) {
    quoteText.textContent = "Failed to load quote.";

    quoteAuthor.textContent = "";
  }
}

getQuote();

function updateTimer() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  timer.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  const percentage = (totalSeconds / (25 * 60)) * 100;
  progressBar.style.width = percentage + "%";
}

startBtn.addEventListener("click", function () {
  if (interval) return;
  timerStatus.textContent = "Focus Time";
  interval = setInterval(function () {
    totalSeconds--;
    updateTimer();

    if (totalSeconds <= 0) {
      clearInterval(interval);

      interval = null;

      timerStatus.textContent = "Time's Up!";

      alert("Pomodoro Completed 🎉");
    }
  }, 1000);
});

pauseBtn.addEventListener("click", function () {
  clearInterval(interval);

  interval = null;

  timerStatus.textContent = "Paused";
});

resetBtn.addEventListener("click", function () {
  clearInterval(interval);

  interval = null;

  totalSeconds = 25 * 60;

  updateTimer();

  timerStatus.textContent = "Ready to Focus";
});

updateTimer();

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const planner = document.getElementById("planner");
const taskCounter = document.getElementById("taskCounter");
const greeting = document.getElementById("greeting");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const div = document.createElement("div");

    div.className = `flex items-center justify-between p-4 rounded-lg ${
      darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
    }`;

    div.innerHTML = `
        <div class="flex items-center gap-3">
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } data-id="${task.id}" class="checkTask">

  <p class="${
    task.completed
      ? "line-through text-gray-400"
      : darkMode
        ? "text-white"
        : "text-gray-900"
  }">${task.name}</p>
        </div>

        <button class="deleteTask text-red-500" data-id="${task.id}">
            <i class="ri-delete-bin-line"></i>
        </button>
    `;

    taskList.appendChild(div);
  });

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  taskCounter.textContent =
    completedTasks + " / " + tasks.length + " Completed";

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", function () {
  const value = taskInput.value.trim();

  if (!value) return;

  tasks.push({
    id: Date.now(),
    name: value,
    completed: false,
  });

  taskInput.value = "";

  renderTasks();
});
taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

taskList.addEventListener("click", function (e) {
  if (e.target.closest(".deleteTask")) {
    const id = Number(e.target.closest(".deleteTask").dataset.id);

    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });

    renderTasks();
  }

  if (e.target.classList.contains("checkTask")) {
    const id = Number(e.target.dataset.id);

    tasks.forEach(function (task) {
      if (task.id === id) {
        task.completed = e.target.checked;
      }
    });

    renderTasks();
  }
});

planner.value = localStorage.getItem("planner") || "";

planner.addEventListener("input", function () {
  localStorage.setItem("planner", planner.value);

  clearTimeout(plannerTimeout);

  plannerTimeout = setTimeout(function () {
    timerStatus.classList.add("text-green-500");

    setTimeout(function () {
      timerStatus.textContent = "Ready to Focus";

      timerStatus.classList.remove("text-green-500");
    }, 1500);

    setTimeout(function () {
      timerStatus.textContent = "Ready to Focus";
    }, 1500);
  }, 500);
});

function updateGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.innerHTML =
      'Good Morning <i class="ri-sun-line text-yellow-500 ml-2"></i>';
  } else if (hour < 17) {
    greeting.innerHTML =
      'Good Afternoon <i class="ri-sun-cloudy-line text-yellow-500 ml-2"></i>';
  } else if (hour < 20) {
    greeting.innerHTML =
      'Good Evening <i class="ri-sunset-line text-orange-500 ml-2"></i>';
  } else {
    greeting.innerHTML =
      'Good Night <i class="ri-moon-clear-line text-blue-400 ml-2"></i>';
  }
}



navLinks.forEach(link => {
  link.addEventListener("mouseenter", () => {
    if (!link.classList.contains("bg-blue-500")) {
      link.classList.add(darkMode ? "bg-gray-700" : "bg-gray-100");
    }
  });

  link.addEventListener("mouseleave", () => {
    if (!link.classList.contains("bg-blue-500")) {
      link.classList.remove("bg-gray-700", "bg-gray-100");
    }
  });
});

setInterval(updateGreeting, 60000);
updateGreeting();

renderTasks();
applyTheme();

goalChecks.forEach(function (goal, index) {
  goal.checked = JSON.parse(localStorage.getItem("goal" + index)) || false;
  goal.addEventListener("change", function () {
    localStorage.setItem("goal" + index, JSON.stringify(goal.checked));
  });
});
