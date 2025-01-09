document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("closeBtn");
  const modalTitle = document.getElementById("modal-title");
  const modalCategories = document.getElementById("modal-categories");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const closeBtnNav = document.getElementById("close-btn-nav");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;
  const searchInput = document.getElementById("search-input");
  const movieGrid = document.getElementById("movie-grid");
  const channelCount = document.getElementById("channel-count");
  const categoryFilter = document.getElementById("categoryFilter");
  const suggestionsList = document.getElementById("suggestions-list");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  closeBtnNav.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    } else if (
      !suggestionsList.contains(event.target) &&
      event.target !== searchInput
    ) {
      suggestionsList.classList.add("hidden"); // Close suggestions if clicked outside
    }
  });

  fetch("channels.json")
    .then((response) => response.json())
    .then((data) => {
      // Sort the channels alphabetically
      const channels = data.channels.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      populateCats(channels);
      renderMovies(channels);
      updateChannelCount(channels.length);

      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const filteredChannels = filterChannels(
          channels,
          searchTerm,
          selectedCategory
        );
        renderMovies(filteredChannels);
        updateChannelCount(filteredChannels.length);
        showSuggestions(filteredChannels, searchTerm);
      });

      categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredChannels = filterChannels(
          channels,
          searchTerm,
          selectedCategory
        );
        renderMovies(filteredChannels);
        updateChannelCount(filteredChannels.length);
      });
    })
    .catch((error) => {
      console.error("Error loading channels data:", error);
    });
  function populateCats(channels) {
    const categoriesSet = new Set();
    channels.forEach((channel) => {
      channel.categories.forEach((category) => {
        // Split CSV categories and trim whitespace
        category
          .split(",")
          .map((c) => c.trim())
          .forEach((subCategory) => {
            categoriesSet.add(subCategory);
          });
      });
    });

    const sortedCategories = Array.from(categoriesSet).sort();

    sortedCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  function filterChannels(channels, searchTerm, selectedCategory) {
    return channels.filter((channel) => {
      const matchesSearchTerm =
        channel.name.toLowerCase().includes(searchTerm) ||
        channel.categories.some((category) =>
          category.toLowerCase().includes(searchTerm)
        ) ||
        (channel.keywords &&
          channel.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          ));

      const matchesCategory =
        selectedCategory === "all" ||
        channel.categories
          .map((c) => c.toLowerCase())
          .includes(selectedCategory.toLowerCase());

      return matchesSearchTerm && matchesCategory;
    });
  }

  function renderMovies(channelsToRender) {
    movieGrid.innerHTML = "";

    // Sort the channels alphabetically by name
    channelsToRender.sort((a, b) => a.name.localeCompare(b.name));

    channelsToRender.forEach((channel) => {
      const channelCard = document.createElement("div");
      channelCard.classList.add("movie-card");
      channelCard.innerHTML = `
          <img src="${channel.logo}" alt="${channel.name}">
          <div class="movie-details">
            <h3>${channel.name}</h3>
            <div class="rating" data-rating="${channel.rating}"></div>
          </div>
        `;

      channelCard.addEventListener("click", () => {
        if (!channel.embed || channel.embed.trim() == "") {
          // Navigate to the link
          window.location.href = channel.link;
        } else {
          // Open the modal
          modal.classList.remove("hidden");
          modalTitle.textContent = `${channel.name}`;

          // Clear previous categories
          modalCategories.innerHTML = "Categories: ";
          const categoriesSpan = document.createElement("span");
          categoriesSpan.style.color = "#ec4899";

          // Sort the categories alphabetically
          const sortedCategories = channel.categories
            .slice()
            .sort((a, b) => a.localeCompare(b));
          categoriesSpan.textContent = sortedCategories.join(", ");
          modalCategories.appendChild(categoriesSpan);

          // Display keywords
          //const modalKeywords = document.getElementById("modal-keywords");
          // modalKeywords.innerHTML = "Keywords: ";
          // const keywordsSpan = document.createElement("span");
          // keywordsSpan.style.color = "#ec4899";
          // if (channel.keywords && channel.keywords.length > 0) {
          //   const sortedKeywords = channel.keywords
          //     .slice()
          //     .sort((a, b) => a.localeCompare(b));
          //   keywordsSpan.textContent = sortedKeywords.join(", ");
          // } else {
          //   keywordsSpan.textContent = "None";
          // }
          // modalKeywords.appendChild(keywordsSpan);

          // Display rating in the modal
          // const modalRating = document.getElementById("modal-rating");
          // modalRating.innerHTML = `Rating: ${channel.rating} out of 5`;

          // **Update the video iframe's src attribute**
          const videoIframe = document.querySelector(".video-iframe");
          if (channel.embed && channel.embed.trim() !== "") {
            videoIframe.src = channel.embed;
          } else {
            // If no video URL is provided, you might want to hide the video container or display a placeholder
            videoIframe.src = ""; // Or set to a default video or image
          }
        }
      });

      movieGrid.appendChild(channelCard);
    });
  }

  function updateChannelCount(count) {
    channelCount.textContent = `Results found: ${count}`;
  }

  function showSuggestions(filteredChannels, searchTerm) {
    suggestionsList.innerHTML = "";
    if (searchTerm.length > 0) {
      // Sort the filtered channels alphabetically
      const sortedSuggestions = filteredChannels
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      const filteredSuggestions = sortedSuggestions.slice(0, 5);
      filteredSuggestions.forEach((channel) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.innerHTML = `
          ${channel.name}
          <div class="rating" data-rating="${channel.rating}"></div>
        `;
        suggestionItem.addEventListener("click", () => {
          searchInput.value = channel.name;
          suggestionsList.classList.add("hidden");
          renderMovies([channel]);
        });
        suggestionsList.appendChild(suggestionItem);
      });
      suggestionsList.classList.remove("hidden");
      suggestionsList.classList.add("show");
    } else {
      suggestionsList.classList.add("hidden");
      suggestionsList.classList.remove("show");
    }
  }
  closeBtn.addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hidden");

    // Reset the iframe src to stop the video
    const videoIframe = document.querySelector(".video-iframe");
    videoIframe.src = "";
  }
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    } else if (
      !suggestionsList.contains(event.target) &&
      event.target !== searchInput
    ) {
      suggestionsList.classList.add("hidden");
    }
  });
});
