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
const loadingSpinner = document.getElementById("loading-spinner");

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
    img.style.center = 0.5;
    
    albumCollage.appendChild(img);
    //if click on image, it will open spotify
    img.addEventListener("click", () => {
      window.open(album.external_urls.spotify, "_blank");
    } 
    );
  }
}

// Fetch 10 of the user's liked songs
function getAlbums() {
  const accessToken = getAccessToken();
  const headers = new Headers({
    "Authorization": `Bearer ${accessToken}`
  });
  const queryParams = new URLSearchParams({
    "limit": 50
  });
  const url = `${albumsEndpoint}?${queryParams}`;
  const request = new Request(url, {
    method: "GET",
    headers: headers
  });
  fetch(request)
    .then(response => response.json())
    .then(data => {
      displayAlbumCollage(data.items);
    });
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

// Show the loading spinner while the albums are being fetched
loadingSpinner.style.display = "block";
albumCollage.style.display = "none";
window.addEventListener("load", () => {
  loadingSpinner.style.display = "none";
  albumCollage.style.display = "block";
});

// Start the animation if there is an access token in the URL
const accessToken = getAccessToken();
if (accessToken) {
  getAlbums();
}
