import "./styles.css";

const TOTAL_POKES = 1025; //Hardcoded to avoid latency issues
const LOADING_IMG_SRC =
  "https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/refs/heads/main/svg-css/bars-rotate-fade.svg";

const NO_IMAGE_FOUND_SRC = "https://www.svgrepo.com/show/340721/no-image.svg";

function deslugify(string) {
  return string[0].toUpperCase() + string.substring(1);
}

function setPokemon(data) {
  console.log(data);
  const imageSrc =
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default;

  const name = document.getElementById("title");
  name.innerText = deslugify(data.name || "");
  const img = document.getElementById("main-image");
  img.src = imageSrc;
}

function fetchRandom() {
  const randomId = Math.floor(Math.random() * TOTAL_POKES) + 1;
  const url = `https://pokeapi.co/api/v2/pokemon/${randomId}/`;
  fetchPokemon(url);
}

function fetchPokemon(url) {
  const error = document.getElementById("error");
  error.innerText = "";
  const name = document.getElementById("title");
  name.innerText = "Loading...";
  const img = document.getElementById("main-image");
  img.src = LOADING_IMG_SRC;

  fetch(url)
    .then((data) => data.json())
    .then((data) => setPokemon(data))
    .catch(() => reportError(url));
}

function fetchByName(name) {
  fetchPokemon(`https://pokeapi.co/api/v2/pokemon/${name}/`);
}

function reportError(url) {
  const splitUrl = url.split("/");
  const searchTerm = splitUrl[splitUrl.length - 2];
  const error = document.getElementById("error");
  const name = document.getElementById("title");
  name.innerText = "Loading...";
  const img = document.getElementById("main-image");
  name.innerText = "";
  img.src = NO_IMAGE_FOUND_SRC;
  if (Number.isInteger(searchTerm)) {
    error.innerText = `Error finding a random pokemon with id ${searchTerm}.`;
  } else {
    error.innerText = `No pokemon with name ${searchTerm} exists.`;
  }
}

function onFormSubmit(e) {
  if (!e.target.form.checkValidity()) {
    return;
  }
  e.preventDefault();
  fetchByName(e.target.form.name.value || "ditto");
}

function initialRender() {
  const randomButton = document.getElementById("random-button");
  randomButton.addEventListener("click", fetchRandom);

  const submit = document.getElementById("submit");
  submit.addEventListener("click", onFormSubmit);

  fetchRandom();
}

initialRender();
