// EDIT THIS TEMPLATE TO CHANGE THE PROMO SLIDE'S LAYOUT
function createPromoSlide(movie) {
  return `
      <div class="keen-slider__slide promo_slides">
        <div class="image-overlay"> 
          <img class="promo-image" src="${movie.image}" alt="${movie.title}">
        </div>
        <div id="promo-content-wrapper"> 
            <div class="promo-content">
          <h2>${movie.title}</h2>
          <div class="movie-meta">
            <span class="rating rating-promo" data-rating="${movie.rating}"></span>
            <span class="genre">${movie.genre}</span>
          </div>
          <p class="description">${movie.description}</p>
          <div class="watch-now-container"> 
               <a href=${movie.link} class="watch-now" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Now
          </a>
           
          <a href=${movie.link2} class="info-button" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8h.01M11 12h2v5h-2z" />
    </svg>
    More Info
  </a>
          </div>
        </div>
          </div>
      </div>
    `;
}

// FETCH THE SLIDER DATA
async function fetchSliderData() {
  try {
    // get the slider's from the dom
    const promoSliderContainer = document.getElementById("promo-slider");

    //get the data from the json fil
    const response = await fetch("/promo-slider/promoSlider.json");
    const movieData = await response.json();

    // dynamically create the slides
    movieData["promoSlides"].forEach((movie) => {
      promoSliderContainer.innerHTML += createPromoSlide(movie);
    });

    // inialize the sliders after populating the dom
    initializeSliders();
  } catch (error) {
    console.error("Error fetching slider data:", error);
  }
}

function initializeSliders() {
  function navigation(slider) {
    let wrapper, dots, arrowLeft, arrowRight;

    function markup(remove) {
      wrapperMarkup(remove);
      dotMarkup(remove);
      arrowMarkup(remove);
    }

    function removeElement(element) {
      element.parentNode.removeChild(element);
    }

    function createDiv(className) {
      var div = document.createElement("div");
      var classNames = className.split(" ");
      classNames.forEach((name) => div.classList.add(name));
      return div;
    }

    function arrowMarkup(remove) {
      if (remove) {
        removeElement(arrowLeft);
        removeElement(arrowRight);
        return;
      }
      arrowLeft = createDiv("arrow arrow--left");
      arrowLeft.addEventListener("click", () => slider.prev());
      arrowRight = createDiv("arrow arrow--right");
      arrowRight.addEventListener("click", () => slider.next());

      wrapper.appendChild(arrowLeft);
      wrapper.appendChild(arrowRight);
    }

    function wrapperMarkup(remove) {
      if (remove) {
        var parent = wrapper.parentNode;
        while (wrapper.firstChild)
          parent.insertBefore(wrapper.firstChild, wrapper);
        removeElement(wrapper);
        return;
      }
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function dotMarkup(remove) {
      if (remove) {
        removeElement(dots);
        return;
      }
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        var dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    function updateClasses() {
      var slide = slider.track.details.rel;
      slide === 0
        ? arrowLeft.classList.add("arrow--disabled")
        : arrowLeft.classList.remove("arrow--disabled");
      slide === slider.track.details.slides.length - 1
        ? arrowRight.classList.add("arrow--disabled")
        : arrowRight.classList.remove("arrow--disabled");
      Array.from(dots.children).forEach(function (dot, idx) {
        idx === slide
          ? dot.classList.add("dot--active")
          : dot.classList.remove("dot--active");
      });
    }

    slider.on("created", () => {
      markup();
      updateClasses();
    });
    slider.on("optionsChanged", () => {
      markup(true);
      markup();
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    slider.on("destroyed", () => {
      markup(true);
    });
  }

  const slider = new KeenSlider(
    "#promo-slider",
    {
      loop: true, // Added loop
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [navigation]
  );
}
fetchSliderData();
