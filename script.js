// Select DOM elements
const cardsAll = document.querySelector(".cards-all");
const btnContainer = document.querySelector(".btn-container");
const clearBtn = document.querySelector(".clear");
const filteredCard = document.querySelector(".filtered-card");

// Data storage
const dataArray = [];
let filteredCardBtnsArray = [];

// Fetch and display data from JSON
async function fetchData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    dataArray.push(...data);
    displayCards();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Create and display cards based on data
function displayCards() {
  dataArray.forEach((item) => {
    const card = createCardElement(item);
    cardsAll.appendChild(card);
  });
  attachBtnEventListeners();
}

// Create a card element
function createCardElement(item) {
  const card = document.createElement("div");
  card.className = `card container ${item.featured ? "featured" : ""}`;
  card.innerHTML = `
    <div class="card-main">
      <div class="logo">
        <img src="${item.logo}" alt="${item.company} Logo" />
      </div>
      <div class="card-main-top">
        <div class="company">${item.company}</div>
      </div>
      <div class="card-main-position position">
        <h1>${item.position}</h1>
      </div>
      <div class="card-main-bottom">
        <div class="postedAt">${item.postedAt}</div>
        <div class="dot"></div>
        <div class="contract">${item.contract}</div>
        <div class="dot"></div>
        <div class="location">${item.location}</div>
      </div>
    </div>
    <div class="card-languages">
    </div>`;

  if (item.new) {
    card.querySelector(".card-main-top").appendChild(createButton("btn-new", "NEW!"));
  }
  if (item.featured) {
    card.querySelector(".card-main-top").appendChild(createButton("btn-featured", "FEATURED"));
  }
  const languagesContainer = card.querySelector(".card-languages");
  [item.role, item.level, ...item.languages, ...item.tools].forEach((type) => {
    languagesContainer.appendChild(createButton("btn-main-card", type, type));
  });

  return card;
}

// Create a button element
function createButton(className, textContent, dataType = "") {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = textContent;
  if (dataType) {
    button.dataset.type = dataType;
  }
  return button;
}

// Attach event listeners to filter buttons
function attachBtnEventListeners() {
  const btns = document.querySelectorAll(".btn-main-card");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnType = btn.dataset.type;
      if (!filteredCardBtnsArray.includes(btnType)) {
        filteredCardBtnsArray.push(btnType);
        displayFilteredCard();
        updateCardsVisibility();
      }
    });
  });
}

// Display the filtered card with selected buttons
function displayFilteredCard() {
  btnContainer.innerHTML = "";
  filteredCardBtnsArray.forEach((btnType) => {
    const btnFiltered = createFilteredButton(btnType);
    btnContainer.appendChild(btnFiltered);
  });
  filteredCard.style.visibility = filteredCardBtnsArray.length > 0 ? "visible" : "hidden";
}

// Create a filtered button with a remove icon
function createFilteredButton(btnType) {
  const btnFiltered = document.createElement("div");
  btnFiltered.className = "btn-filtered";
  btnFiltered.innerHTML = `
    <div>${btnType}</div>
    <button class="btn-remove">
      <img src="images/icon-remove.svg" alt="Remove ${btnType}" />
    </button>`;
  btnFiltered.querySelector(".btn-remove").addEventListener("click", () => {
    removeFilteredButton(btnType);
  });
  return btnFiltered;
}

// Remove a filtered button and update the card visibility
function removeFilteredButton(btnType) {
  const index = filteredCardBtnsArray.indexOf(btnType);
  if (index > -1) {
    filteredCardBtnsArray.splice(index, 1);
    displayFilteredCard();
    updateCardsVisibility();
  }
}

// Update the visibility of cards based on filters
function updateCardsVisibility() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const cardBtnTypes = Array.from(card.querySelectorAll(".btn-main-card")).map(btn => btn.dataset.type);
    const isMatch = filteredCardBtnsArray.every(btnType => cardBtnTypes.includes(btnType));
    card.classList.toggle("remove", !isMatch);
  });
}

// Clear all filters and reset card visibility
clearBtn.addEventListener("click", () => {
  filteredCardBtnsArray = [];
  btnContainer.innerHTML = "";
  updateCardsVisibility();
  filteredCard.style.visibility = "hidden";
});

// Initialize data fetch
fetchData();
