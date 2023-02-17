// Spotify API credentials
const clientId = "524ea17d26f64c1dbd8ba951ce483297";
const redirectUri = "http://localhost:8000/index.html";

// Spotify API endpoints
const authorizeEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const albumsEndpoint = "https://api.spotify.com/v1/me/albums";

// HTML elements
const loginBtn = document.getElementById("login-button");
const albumCollage = document.getElementById("collage-container");

// Retrieve the access token from the URL hash fragment
function getAccessToken() {
  const hashParams = window.location.hash.substr(1).split("&");
  for (let i = 0; i < hashParams.length; i++) {
    const [key, value] = hashParams[i].split("=");
    if (key === "access_token") {
      return value;
    }
  }
  return null;
}

// Display the album covers in an animated collage
function displayAlbumCollage(albums) {
  albumCollage.innerHTML = "";
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i].album;
    const img = document.createElement("img");
    img.src = album.images[0].url;
    img.alt = album.name;
    img.title = album.name;
    img.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    img.style.animationDuration = `${10 + Math.random() * 10}s`;
    albumCollage.appendChild(img);
  }
}

// Fetch the user's albums from the Spotify API
async function getAlbums() {
  const accessToken = getAccessToken();
  if (accessToken) {
    const response = await fetch(albumsEndpoint, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      const albums = data.items;
      displayAlbumCollage(albums);
    } else {
      console.error("Failed to fetch albums from the Spotify API");
    }
  }
}

// Prompt the user to log in with their Spotify account
function login() {
  const queryParams = new URLSearchParams({
    "response_type": "token",
    "client_id": clientId,
    "redirect_uri": redirectUri,
    "scope": "user-library-read"
  });
  const authorizeUrl = `${authorizeEndpoint}?${queryParams}`;
  window.location.href = authorizeUrl;
}

// Attach the login and animation functions to the HTML elements
loginBtn.addEventListener("click", login);

// Start the animation if there is an access token in the URL
const accessToken = getAccessToken();
if (accessToken) {
  getAlbums();
}
