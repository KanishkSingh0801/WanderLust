// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('input[name="q"]');
  const categorySelect = document.querySelector('select[name="category"]');
  const listingContainer = document.getElementById("listing-container");

  const fetchListings = async (query, category) => {
    try {
      const url = new URL("/listings", window.location.origin);

      if (query) url.searchParams.set("q", query);
      if (category) url.searchParams.set("category", category);

      const res = await fetch(url);
      const data = await res.text();

      listingContainer.innerHTML = data;
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      const category = categorySelect?.value || "";
      fetchListings(query, category);
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      const query = searchInput?.value.trim() || "";
      const category = categorySelect.value;
      fetchListings(query, category);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-category");
      window.location.href = `/listings?category=${category}`;
    });
  });
});

