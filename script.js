const sidebar = document.getElementById("sidebar");
const dashboard = document.getElementById("dashboard");
const toggleButton = document.getElementById("toggleButton");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileCloseButton = document.getElementById("mobileCloseButton");
const overlay = document.getElementById("overlay");
const logo = document.getElementById("logo");

const navItemsWithSubmenu = document.querySelectorAll(".nav-item-submenu .nav-item");
const subMenu = document.getElementById("submenuContainer");
const subMenuItems = document.querySelectorAll(".sub-menu li");

let isSidebarExpanded = false;
let activeDropdownItem = null;
let activeSubMenuItem = null;

// Function to remove active state from dropdown items
function removeDropdownActiveState() {
    navItemsWithSubmenu.forEach(item => {
        item.style.backgroundColor = '';
    });
}

// Add click event for nav items with dropdowns
navItemsWithSubmenu.forEach(item => {
    item.addEventListener("click", (e) => {
        // If clicking the same dropdown item that's already active
        if (activeDropdownItem === item) {
            removeDropdownActiveState();
            activeDropdownItem = null;
            if (sidebar.classList.contains("expanded")) {
                subMenu.classList.add("hidden");
            }
        } else {
            removeDropdownActiveState();
            item.style.backgroundColor = '#F6F6F6';
            activeDropdownItem = item;
            
            if (sidebar.classList.contains("expanded")) {
                subMenu.classList.remove("hidden");
            } else {
                subMenu.classList.add("hidden");
            }
        }
    });
});

// Add click event for submenu items
subMenuItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event bubbling
        
        // Remove active state from other submenu items
        subMenuItems.forEach(subItem => {
            subItem.style.backgroundColor = '';
        });
        
        // Set active state for clicked submenu item
        item.style.backgroundColor = '#F6F6F6';
        activeSubMenuItem = item;
        
        // Keep parent dropdown item active
        if (activeDropdownItem) {
            activeDropdownItem.style.backgroundColor = '#F6F6F6';
        }
    });
});

// Desktop toggle
toggleButton.addEventListener("click", () => {
    if (window.innerWidth > 640) {
        isSidebarExpanded = !isSidebarExpanded;
        sidebar.classList.toggle("expanded");
        dashboard.classList.toggle("expanded");
        toggleButton.classList.toggle("img-rotate");
        
        // If sidebar is collapsed, hide submenu
        if (!isSidebarExpanded) {
            subMenu.classList.add("hidden");
        }
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
    subMenu.classList.add("hidden");
    removeDropdownActiveState();
    activeDropdownItem = null;
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
        subMenu.classList.add("hidden");
        removeDropdownActiveState();
        activeDropdownItem = null;
    } else {
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }
}

window.addEventListener("resize", updateSidebarState);
updateSidebarState();