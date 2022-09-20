import { fetchMovieAvailability, fetchMovieList } from "./api.js";

// Get elements from DOM
const main = document.querySelector("main");
const loader = document.getElementById("loader");
const bookerEl = document.getElementById("booker");
const bookerGridHolderEl = document.getElementById("booker-grid-holder");
const vNone = document.querySelectorAll(".v-none");
const booker = document.querySelector("#booker");

// Fetch data
fetchMovieList().then((movieDetails) => movieCard(movieDetails));
// Main function

function movieCard(movies) {
  document.body.style.opacity = 10;
  loader.remove();
  main.innerHTML = "";
  const movieHolder = document.createElement("div");
  movieHolder.setAttribute("class", "movie-holder");
  movies.forEach((movie, index) => {
    const { name, imgUrl } = movie;
    const aEl = document.createElement("a");
    aEl.setAttribute("class", "movie-link");
    aEl.setAttribute("href", `/${name}`);
    aEl.innerHTML = `
    <div class="movie" data-id="moviename"> 
     <div class="movie-img-wrapper"> 
    </div> 
    <h4>${name}</h4>
     </div> 
    `;

    main.append(aEl);

    let movieImg = document.querySelectorAll(".movie-img-wrapper")[index];
    movieImg.style.backgroundImage = `url("${imgUrl}")`;
  });

  main.addEventListener("click", (e) => {
    e.preventDefault();
    let movieName = e.target.parentElement.querySelector("h4").innerHTML;
    let fetchMovieName = fetchMovieAvailability(movieName);
    fetchMovieName.then((availibleSeats) => createSeats(availibleSeats));
  });
}

function createSeats(availableSeats) {
  vNone[0].style.visibility = "visible";
  bookerGridHolderEl.innerHTML = "";
  const seats = document.createElement("div");
  seats.setAttribute("class", "seats");
  const gridDivLeft = document.createElement("div");
  gridDivLeft.setAttribute("class", "grid-div");
  gridDivLeft.setAttribute("id", "grid-div-left");

  for (let i = 1; i <= 12; i++) {
    const gridhead = document.createElement("div");
    gridhead.setAttribute("class", "booking-grid");
    const grid = document.createElement("div");
    grid.setAttribute("id", `booking-grid-${i}`);
    grid.innerText = `${i}`;
    if (availableSeats.includes(i)) {
      grid.setAttribute("class", "available");
    } else {
      grid.disabled = true;
      grid.setAttribute("class", "unavailable");
    }
    gridhead.append(grid);
    gridDivLeft.appendChild(gridhead);
  }
  const gridDivRight = document.createElement("div");
  gridDivRight.setAttribute("class", "grid-div");
  gridDivRight.setAttribute("id", "grid-div-right");

  for (let i = 13; i <= 24; i++) {
    const gridhead = document.createElement("div");
    gridhead.setAttribute("class", "booking-grid");
    const grid = document.createElement("div");
    grid.setAttribute("id", `booking-grid-${i}`);
    grid.innerText = `${i}`;
    if (availableSeats.includes(i)) {
      grid.setAttribute("class", "available");
    } else {
      grid.setAttribute("class", "unavailable");
      grid.disabled = true;
    }
    gridhead.appendChild(grid);
    gridDivRight.appendChild(gridhead);
  }
  bookerGridHolderEl.append(gridDivLeft, gridDivRight);
  const selected = bookerGridHolderEl.getElementsByClassName("booking-grid");
  console.log(selected);
  bookerGridHolderEl.addEventListener("click", (e) => {
    if (availableSeats.includes(Number(e.target.innerHTML))) {
      bookSeat(e);
    }
  });
}

let bookedSeats = [];
function bookSeat(e) {
  const selected = e.target.innerText;
  if (e.target.style.border === "4px outset rgb(0, 0, 0)") {
    e.target.style.border = "";
  } else {
    e.target.style.border = "4px outset rgb(0, 0, 0)";
  }

  if (!bookedSeats.includes(selected)) {
    bookedSeats.push(selected);
    e.target.style.backgroundColor = "red";
  } else if (bookedSeats.includes(selected)) {
    const index = bookedSeats.indexOf(selected);
    if (index > -1) {
      bookedSeats.splice(index, 1);
      e.target.style.backgroundColor = "green";
    }
  }
  if (bookedSeats.length !== 0) {
    vNone[1].style.visibility = "visible";
  } else {
    vNone[1].style.visibility = "hidden";
  }

  console.log(bookedSeats.join(""));
}

const bookBtn = document.querySelector("#book-ticket-btn");

bookBtn.addEventListener("click", finalBook);

function finalBook() {
  const booker = document.querySelector("#booker");
  booker.innerHTML = "";

  const displaySeats = document.createElement("div");
  displaySeats.innerHTML = `Confirm your booking for seat numbers :${bookedSeats}
  `;

  const form = document.createElement("form");
  form.setAttribute("id", "customer-detail-form");
  const labelEmail = document.createElement("label");
  labelEmail.innerHTML = "Email";
  const email = document.createElement("input");
  email.setAttribute("type", "email");
  email.setAttribute("id", "email");
  email.required = true;

  const labelPno = document.createElement("label");
  labelPno.innerHTML = "Phone Number";
  const pNumber = document.createElement("input");
  pNumber.setAttribute("type", "number");
  pNumber.setAttribute("id", "number");
  pNumber.required = true;

  const purchaseBtn = document.createElement("input");
  purchaseBtn.setAttribute("type", "submit");
  purchaseBtn.innerText = "Purchase";
  form.append(displaySeats, labelEmail, email, labelPno, pNumber, purchaseBtn);
  booker.append(form);

  const labels = document.querySelectorAll(".form-control label");
  purchaseBtn.addEventListener("click", (e) => {
    if (pNumber.value != "" && email.value != "") {
      e.preventDefault();

      purchase(bookedSeats, email, pNumber);
    } else {
      return;
    }
  });
}
function purchase(bookedSeats, email, pNumber) {
  booker.innerHTML = "";

  const BookingDetails = document.createElement("div");
  BookingDetails.setAttribute("id", "Success");
  BookingDetails.innerHTML = `<form >
  <b>Booking Details</b><br>
  Seats: ${bookedSeats.join(",")}<br>
  Phone number: ${pNumber.value}<br>
  Email: ${email.value}
  </form>
  `;
  booker.append(BookingDetails);
}
