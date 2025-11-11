document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("sidebar");
  const dropdownButtons = document.querySelectorAll(".dropdown-btn");

  // Sidebar toggle
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
      sidebar.classList.remove("active");
    }
  });

  // Dropdown toggle
  dropdownButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dropdownContent = btn.nextElementSibling;
      dropdownContent.classList.toggle("show");
      btn.querySelector("i").classList.toggle("fa-caret-up");
      btn.querySelector("i").classList.toggle("fa-caret-down");
    });
  });
});
