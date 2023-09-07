// LOAD APP
const endpoint = "http://localhost:3005";

let artist;

window.addEventListener("load", initApp);

function initApp() {
  artistsToList();
  document
    .querySelector("#add-artist-button")
    .addEventListener("click", showAddArtistDialog);
  document
    .querySelector("#form-add-artist")
    .addEventListener("submit", addArtistClicked);

  document
    .querySelector("#form-delete-artist")
    .addEventListener("submit", deleteArtistClicked);
  document
    .querySelector("#form-update-artist")
    .addEventListener("submit", editArtistClicked);
  document
    .querySelector("#sort-by-select")
    .addEventListener("change", sortByChanged);
  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
}

// EVENTS

function showAddArtistDialog() {
  document.querySelector("#dialog-add-artist").showModal();
}

function addArtistClicked(event) {
  console.log("New Artist Button Clicked");
  const form = event.target;
  const name = form.name.value;
  const image = form.image.value;
  const birthdate = form.birthdate.value;
  const active = form.active.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const description = form.description.value;
  addArtist(
    name,
    image,
    birthdate,
    active,
    genres,
    labels,
    website,
    description
  );
  form.reset();
}

function deleteArtistClicked(event) {
  console.log("Delete Post Button Submit Clicked");
  const uid = event.target.getAttribute("data-uid");
  console.log(uid);
  deleteArtist(uid);
}

function editArtistClicked(event) {
  const form = event.target;
  const active = form.active.value;
  const favorite = event.target.getAttribute("data - favorite");
  const name = form.name.value;
  const image = form.image.value;
  const birthdate = form.birthdate.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const description = form.description.value;
  const uid = event.target.getAttribute("data-uid");
  console.log(birthdate);
  editArtist(
    favorite,
    uid,
    name,
    image,
    birthdate,
    active,
    genres,
    labels,
    website,
    description
  );
}

async function inputSearchChanged(event) {
  const value = event.target.value;
  const artistsToShow = await searchArtists(value);
  showArtists(artistsToShow);
}

//IMPORT AND SHOW USERS

async function artistsToList() {
  let artists = await getArtists();
  return showArtists(artists);
}

function showArtists(listOfArtists) {
  document.querySelector("#artist-list").innerHTML = "";
  for (let artist of Object.keys(listOfArtists)) {
    showArtist(listOfArtists[artist]);
  }
  console.log("updating list");
}

function showFavorites(listOfArtists) {
  document.querySelector("#artist-list").innerHTML = "";
  for (const artist of listOfArtists) {
    if (artist.favorite) {
      showArtist(artist);
    }
  }
}
async function showArtistInformation(artistObject) {
  const html = /*html*/ `
        <article class="artist-item">
            <h3>${artistObject.name}</h3>
            <img src="${artistObject.image}" />
            <p>${artistObject.birthdate}</p>
            <p>${artistObject.active}</p>
            <p>${artistObject.genres}</p>
            <p>${artistObject.labels}</p>
            <a href="url">${artistObject.website}</a>
            <p>${artistObject.description}</p>
            </div>
        </article>
    `;
  document
    .querySelector("#artists-info")
    .insertAdjacentHTML("afterbegin", html);
}

function showArtist(artistObject) {
  var node = document.createElement(`li`);
  node.appendChild(document.createTextNode(artistObject.name));
  document.querySelector("#artist-list").appendChild(node);
  document
    .querySelector("#artist-list")
    .setAttribute("data-uid", artistObject.uid);
  node.addEventListener("click", artistInformationClicked);
  console.log(artistObject.uid);
  function artistInformationClicked() {
    console.log("info clicked");
    buttonsForShowArtist();
    showArtistInformation(artistObject);
  }
  function buttonsForShowArtist() {
    document.querySelector(
      "#artists-info"
    ).innerHTML = `<button id="edit-button">Edit</button> 
    <button id="delete-button">Delete</button>
    <button id="favorite-button"></button>`;
    if (artistObject.favorite) {
      document.querySelector("#favorite-button").textContent = "Unfavourite";
    } else if (!artistObject.favorite) {
      document.querySelector("#favorite-button").textContent = "Favorite";
    }
    document
      .querySelector("#edit-button")
      .addEventListener("click", editClicked);
    document
      .querySelector("#delete-button")
      .addEventListener("click", deleteClicked);
    document
      .querySelector("#favorite-button")
      .addEventListener("click", favoriteClicked);
  }

  function favoriteClicked() {
    function updateArtist(artistObject) {
      const name = artistObject.name;
      const image = artistObject.image;
      const uid = artistObject.uid;
      const birthdate = artistObject.birthdate;
      console.log(birthdate);
      const active = artistObject.active;
      const genres = artistObject.genres;
      const labels = artistObject.labels;
      const website = artistObject.website;
      const description = artistObject.description;
      let favorite = artistObject.favorite;
      if (artistObject.favorite) {
        favorite = false;
      } else {
        favorite = true;
      }
      editArtist(
        favorite,
        uid,
        name,
        image,
        birthdate,
        active,
        genres,
        labels,
        website,
        description
      );
    }
    if (artistObject.favorite) {
      updateArtist(artistObject);
      document.querySelector("#favorite-button").textContent = "Favorite";
      return (artistObject.favorite = false);
    } else if (!artistObject.favorite) {
      updateArtist(artistObject);
      document.querySelector("#favorite-button").textContent = "Unfavourite";
      return (artistObject.favorite = true);
    }
  }
  function deleteClicked() {
    console.log("Delete button clicked");
    document.querySelector("#dialog-delete-artist-title").textContent =
      artistObject.name;
    document
      .querySelector("#form-delete-artist")
      .setAttribute("data-uid", artistObject.uid);
    document.querySelector("#dialog-delete-artist").showModal();
  }
  function editClicked() {
    document.querySelector("#dialog-update-artist-title").textContent =
      artistObject.name;
    document
      .querySelector("#form-update-artist")
      .setAttribute("data-uid", artistObject.uid);
    console.log(artistObject.uid + "Edit Clicked");
    document
      .querySelector("#form-update-artist")
      .setAttribute("data-favorite", artistObject.favorite);
    const updateForm = document.querySelector("#form-update-artist");
    updateForm.name.value = artistObject.name;
    updateForm.image.value = artistObject.image;
    updateForm.birthdate.value = artistObject.birthdate;
    updateForm.active.value = artistObject.active;
    updateForm.genres.value = artistObject.genres;
    updateForm.labels.value = artistObject.labels;
    updateForm.website.value = artistObject.website;
    updateForm.description.value = artistObject.description;
    document.querySelector("#dialog-update-artist").showModal();
  }
}

// CRUD

async function addArtist(
  name,
  image,
  birthdate,
  active,
  genres,
  labels,
  website,
  description
) {
  uid = new Date().getTime();
  const newArtist = {
    favorite: false,
    name: name,
    uid: uid,
    image: image,
    birthdate: birthdate,
    active: active,
    genres: genres,
    labels: labels,
    website: website,
    description: description,
  };
  const json = JSON.stringify(newArtist);
  console.log(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  });
  if (response.ok) {
    artistsToList();
    console.log("New artist added");
  }
}

async function deleteArtist(uid) {
  console.log(uid);
  const response = await fetch(`${endpoint}/artists/${uid}`, {
    method: "DELETE",
  });
  if (response.ok) {
    artistsToList();
    console.log(`${uid} has been deleted.`);
  }
}

async function editArtist(
  favoriteEdit,
  uidEdit,
  name,
  image,
  birthdate,
  active,
  genres,
  labels,
  website,
  description
) {
  const uid = Number(uidEdit);
  const favorite = Boolean(favoriteEdit);
  const updateArtist = {
    active,
    birthdate,
    description,
    favorite,
    genres,
    image,
    labels,
    name,
    uid,
    website,
  };
  console.log(updateArtist);
  const json = JSON.stringify(updateArtist);
  console.log(updateArtist);
  const response = await fetch(`${endpoint}/artists/${uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  });
  if (response.ok) {
    console.log("updated person");
    artistsToList();
  }
}

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  const artists = prepareData(data);
  return artists;
}

function prepareData(dataObject) {
  const array = [];
  for (const key in dataObject) {
    const object = dataObject[key];
    object.id = key;
    array.push(object);
  }
  return array;
}

//SEARCH

async function searchArtists(searchValue) {
  searchValue = searchValue.toLowerCase();
  let artists = await getArtists();
  let results = artists.filter(checkName);
  function checkName(artist) {
    const name = artist.name.toLowerCase();
    return name.includes(searchValue);
  }
  return results;
}

//SORT

async function sortByChanged(event) {
  const value = event.target.selectedIndex;
  let artists = await getArtists();

  if (value === 1) {
    artists.sort(compareArtistsNameAtoZ);
    showArtists(artists);
  } else if (value === 2) {
    artists.sort(compareArtistsNameZtoA);
    showArtists(artists);
  } else if (value === 3) {
    artists.sort(compareYears);
    showArtists(artists);
  } else if (value === 4) {
    artists.sort(compareCreatedTime);
    showArtists(artists);
  } else if (value === 5) {
    compareFavoriteAtoZ();
  } else if (value === 6) {
    compareFavoriteZtoA();
  }

  document.getElementById("sort-by-select").selectedIndex = "0";
}

function compareYears(artist1, artist2) {
  artist1 = artist1.year;
  artist2 = artist2.year;
  artists.sort(function (artist1, artist2) {
    return artist1 - artist2;
  });
}

function compareArtistsNameAtoZ(artist1, artist2) {
  return artist1.name.localeCompare(artist2.name);
}

function compareArtistsNameZtoA(artist1, artist2) {
  return artist2.name.localeCompare(artist1.name);
}

function compareCreatedTime(artist1, artist2) {
  artist1 = artist1.id;
  artist2 = artist2.id;
  artists.sort(function (artist1, artist2) {
    return artist1 - artist2;
  });
}

function compareFavoriteAtoZ() {
  artists.sort(compareArtistsNameAtoZ);
  showFavorites(artists);
}

function compareFavoriteZtoA() {
  artists.sort(compareArtistsNameZtoA);
  showFavorites(artists);
}
