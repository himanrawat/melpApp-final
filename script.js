const sidebar = document.getElementById("sidebar");
const dashboard = document.getElementById("dashboard");
const toggleButton = document.getElementById("toggleButton");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileCloseButton = document.getElementById("mobileCloseButton");
const overlay = document.getElementById("overlay");
const logo = document.getElementById("logo");
// Get all nav items including both regular and submenu items
const allNavItems = document.querySelectorAll(".nav-item");
const navItemsWithSubmenu = document.querySelectorAll(".nav-item-submenu .nav-item");
const subMenu = document.getElementById("submenuContainer");
const subMenuItems = document.querySelectorAll(".sub-menu li");

let isSidebarExpanded = false;
let activeNavItem = null;
let activeSubMenuItem = null;

// Function to remove active state from all items
function removeActiveState() {
    allNavItems.forEach(item => {
        item.style.backgroundColor = '';
    });
    subMenuItems.forEach(item => {
        item.style.backgroundColor = '';
    });
}

// Add click event for all nav items
allNavItems.forEach(item => {
    item.addEventListener("click", (e) => {
        removeActiveState();
        item.style.backgroundColor = '#F6F6F6';
        activeNavItem = item;
        
        // If this item has a submenu
        const parentSubmenu = item.closest('.nav-item-submenu');
        if (parentSubmenu) {
            if (sidebar.classList.contains("expanded")) {
                subMenu.classList.toggle("hidden");
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
        
        // Keep parent nav item active
        if (activeNavItem && activeNavItem.closest('.nav-item-submenu')) {
            activeNavItem.style.backgroundColor = '#F6F6F6';
        }
    });
});

// Desktop toggle
toggleButton.addEventListener("click", () => {
    if (window.innerWidth > 640) {
        isSidebarExpanded = !isSidebarExpanded;
        sidebar.classList.toggle("expanded");
        dashboard.classList.toggle("expanded");
        toggleButton.classList.toggle("active");
        
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
    } else {
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }
}

window.addEventListener("resize", updateSidebarState);
updateSidebarState();