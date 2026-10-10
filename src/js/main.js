import Handlebars from "handlebars";
import photoListTemplate from "bundle-text:../template/photo-list.hbs";

const KEY_API = "57664455-db92fc868593049058aa7ddbc";

const container = document.querySelector("[data-container]");
const loadBtn = document.querySelector("[data-load-more]");

let per_page = 9;
let page = 1;

const createMurkup = Handlebars.compile(photoListTemplate);

const normalizaPhoto = (hit) => {
  return {
    url: hit.webformatURL,
    alt: hit.tags,
  };
};

const fetchPhotoList = (params) => {
  const url = `https://pixabay.com/api/?key=${KEY_API}&editors_choice=true&${params}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Mistake: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (page >= data.totalHits) {
        loadBtn.disabled = true;
        loadBtn.textContent = "Nothing more";
        return;
      }

      const photoList = data.hits;
      const photoPromise = photoList.map((photo) => {
        return normalizaPhoto(photo);
      });

      Promise.all(photoPromise).then((data) => {
        const galleryMurkup = createMurkup(data);
        container.insertAdjacentHTML("beforeend", galleryMurkup);
      });
    });
};

fetchPhotoList(`page=${page}`);

const handleLoadMore = () => {
  page += 1;
  const params = new URLSearchParams({ per_page: per_page, page: page });
  fetchPhotoList(params);
};

loadBtn.addEventListener("click", handleLoadMore);
