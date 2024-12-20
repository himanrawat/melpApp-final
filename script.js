
const sidebar = document.getElementById("sidebar");
const dashboard = document.getElementById("dashboard");
const toggleButton = document.getElementById("toggleButton");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileCloseButton = document.getElementById("mobileCloseButton");
const overlay = document.getElementById("overlay");
const logo = document.getElementById("logo");

let isSidebarExpanded = false;

// Desktop toggle
toggleButton.addEventListener("click", () => {
    if (window.innerWidth > 640) {
        isSidebarExpanded = !isSidebarExpanded;
        sidebar.classList.toggle("expanded");
        dashboard.classList.toggle("expanded");
    }
});

// Mobile menu open
mobileMenuButton.addEventListener("click", () => {
    sidebar.classList.add("expanded");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
});

// Mobile menu close
function closeMobileMenu() {
    sidebar.classList.remove("expanded");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
}

mobileCloseButton.addEventListener("click", closeMobileMenu);
overlay.addEventListener("click", closeMobileMenu);

function updateSidebarState() {
    if (window.innerWidth < 640) {
        sidebar.classList.remove("expanded");
        dashboard.classList.remove("expanded");
        overlay.classList.remove("show");
        document.body.style.overflow = "";
        isSidebarExpanded = false;
    } else {
        // Reset mobile-specific states when returning to desktop
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }
}

window.addEventListener("resize", updateSidebarState);
updateSidebarState();
