// Fetch movieData from a JSON file or API
fetch('/category-slider/categorySlider.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load movie data');
    }
    return response.json();
  })
  .then((movieData) => {
    // Create sliders for each category
    Object.entries(movieData).forEach(([category, data]) => {
      createSlider(category, data);
    });
  })
  .catch((error) => {
    console.error('Error fetching movie data:', error);
  });

function createSlider(category, data) {
  const container = document.getElementById('category-slide-container');

  // Create category section
  const section = document.createElement('div');
  section.className = 'category-section';

  // Add header
  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `<h2 class="category-title">${data.title}</h2>`;
  section.appendChild(header);

  // Create navigation wrapper
  const navigationWrapper = document.createElement('div');
  navigationWrapper.className = 'category-navigation-wrapper';

  // Create slider container
  const sliderContainer = document.createElement('div');
  sliderContainer.id = `category-keen-slider-${category}`;
  sliderContainer.className = 'keen-slider category-keen-slider';

  // Add slides
  data.items.forEach((item) => {
    const slide = document.createElement('div');
    slide.className = 'keen-slider__slide category-slide';
    slide.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="category-slide-content">
        <div class="category-slide-title">${item.title}</div>
        <div class="category-slide-count">${item.count}</div>
      </div>
    `;
    sliderContainer.appendChild(slide);
  });

  // Add navigation arrows
  const arrowLeft = document.createElement('button');
  arrowLeft.className = 'category-arrow category-arrow--left';

  const arrowRight = document.createElement('button');
  arrowRight.className = 'category-arrow category-arrow--right';

  navigationWrapper.appendChild(sliderContainer);
  navigationWrapper.appendChild(arrowLeft);
  navigationWrapper.appendChild(arrowRight);
  section.appendChild(navigationWrapper);
  container.appendChild(section);

  // Initialize Keen Slider
  const slider = new KeenSlider(`#category-keen-slider-${category}`, {
    loop: true,
    slides: { perView: 1, spacing: 4 }, // Default for mobile screens
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 4, spacing: 8 }, // Desktop
      },
      "(min-width: 2000px)": {
        slides: { perView: 6, spacing: 12 }, // Laptop
      },
    },
  });
  

  // Add arrow functionality
  arrowLeft.addEventListener('click', () => slider.prev());
  arrowRight.addEventListener('click', () => slider.next());
}
