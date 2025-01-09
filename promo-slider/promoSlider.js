// EDIT THIS TEMPLATE TO CHANGE THE PROMO SLIDE'S LAYOUT
function createPromoSlide(movie) {
  return `
      <div class="keen-slider__slide promo_slides">
        <img class="promo-image" src="${movie.image}" alt="${movie.title}">
        <div id="promo-content-wrapper"> 
            <div class="promo-content">
          <h2>${movie.title}</h2>
          <div class="movie-meta">
            <span class="rating">${movie.rating}</span>
            <span class="genre">${movie.genre}</span>
          </div>
          <p class="description">${movie.description}</p>
          <a href=${movie.link} class="watch-now" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Now
          </a>
        </div>
          </div>
      </div>
    `;
}

// EDIT THIS TEMPLATE TO CHANGE THE THUMBNAIL SLIDE'S LAYOUT
function createThumbnail(movie) {
  return `
      <div class="keen-slider__slide thumbnail_slides">
        <img class="thumbnail-image" src="${movie.image}" alt="${movie.title}">
      </div>
    `;
}

// FETCH THE SLIDER DATA
async function fetchSliderData() {
  try {
    // get the slider's from the dom
    const promoSliderContainer = document.getElementById("promo-slider");
    const thumbnailContainer = document.getElementById("thumbnails");

    //get the data from the json fil
    const response = await fetch("/promo-slider/promoSlider.json");
    const movieData = await response.json();

    // dynamically create the slides
    movieData["promoSlides"].forEach((movie) => {
      promoSliderContainer.innerHTML += createPromoSlide(movie);
      thumbnailContainer.innerHTML += createThumbnail(movie);
    });

    // inialize the sliders after populating the dom
    initializeSliders();
  } catch (error) {
    console.error("Error fetching slider data:", error);
  }
}

function initializeSliders() {
  const mainSlider = new KeenSlider("#promo-slider");
  const thumbnailSlider = new KeenSlider(
    "#thumbnails",
    {
      loop: true,
      breakpoints: {
        "(max-width: 2549px)": {
          slides: { perView: 4, spacing: 8 },
        },
        "(max-width: 1439px)": {
          slides: { perView: 3, spacing: 8 },
        },
        "(max-width: 767px)": {
          slides: { perView: 1.5, spacing: 8 },
        },
      },
    },
    [ThumbnailPlugin(mainSlider)]
  );
}

function ThumbnailPlugin(mainSlider) {
  return (thumbnailSlider) => {
    function removeActive() {
      thumbnailSlider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx) {
      thumbnailSlider.slides[idx].classList.add("active");
    }
    function addClickEvents() {
      thumbnailSlider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          mainSlider.moveToIdx(idx);
        });
      });
    }

    thumbnailSlider.on("created", () => {
      addActive(thumbnailSlider.track.details.rel);
      addClickEvents();
      mainSlider.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        thumbnailSlider.moveToIdx(
          Math.min(thumbnailSlider.track.details.maxIdx, next)
        );
      });
    });
  };
}

fetchSliderData();
