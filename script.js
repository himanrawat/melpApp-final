// Get all necessary DOM elements and store them in an object for easy access
const elements = {
    // Main structural elements
    sidebar: document.getElementById("sidebar"),
    dashboard: document.getElementById("dashboard"),
    topbar: document.querySelector('.topbar'),
    container: document.querySelector('.container'),
    notificationBar: document.querySelector('.notification-bar'),
    
    // Buttons
    toggleButton: document.getElementById("toggleButton"),
    mobileMenuButton: document.getElementById("mobileMenuButton"),
    mobileCloseButton: document.getElementById("mobileCloseButton"),
    
    // Overlay for mobile menu
    overlay: document.getElementById("overlay"),
    
    // Navigation elements
    logo: document.getElementById("logo"),
    navItemsWithSubmenu: document.querySelectorAll(".nav-item-submenu .nav-item"),
    subMenu: document.getElementById("submenuContainer"),
    subMenuItems: document.querySelectorAll(".sub-menu li")
  };
  
  // Store the state of our application
  const state = {
    isSidebarExpanded: false,  // Is the sidebar currently expanded?
    activeDropdownItem: null,  // Currently active dropdown menu item
    activeSubMenuItem: null    // Currently active submenu item
  };
  
  // Handle all layout-related functions
  const layoutManager = {
    // Update heights of container and notification bar based on topbar height
    updateContainerHeights() {
      const topbarHeight = elements.topbar.offsetHeight;
      const heightCalc = `calc(100vh - ${topbarHeight}px)`;
      
      // Check if we're on mobile or desktop
      if (window.innerWidth > 640) {
        // Desktop and tablet view
        elements.container.style.height = heightCalc;
        
        // Set notification bar styles
        elements.notificationBar.style.position = 'fixed';
        elements.notificationBar.style.top = `${topbarHeight}px`;
        elements.notificationBar.style.right = '0';
        elements.notificationBar.style.height = heightCalc;
      } else {
        // Mobile view - reset styles
        elements.container.style.height = '100vh';
        elements.notificationBar.style.position = 'relative';
        elements.notificationBar.style.top = '0';
        elements.notificationBar.style.right = 'auto';
        elements.notificationBar.style.height = '100%';
      }
    },
  
    // Handle sidebar state changes
    updateSidebarState() {
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        // Reset everything for mobile view
        elements.sidebar.classList.remove("expanded");
        elements.dashboard.classList.remove("expanded");
        elements.overlay.classList.remove("show");
        
        state.isSidebarExpanded = false;
        elements.subMenu.classList.add("hidden");
        
        // Reset dropdown states
        dropdownManager.removeActiveState();
        state.activeDropdownItem = null;
        
        // Reset topbar position for mobile
        elements.topbar.style.position = 'relative';
        elements.dashboard.style.marginTop = '0';
      } else {
        // Desktop view settings
        elements.overlay.classList.remove("show");
        elements.topbar.style.position = 'fixed';
        elements.dashboard.style.marginTop = `${elements.topbar.offsetHeight}px`;
      }
      
      document.body.style.overflow = "";
    }
  };
  
  // Handle all dropdown-related functions
  const dropdownManager = {
    // Remove active state from all dropdown items
    removeActiveState() {
      elements.navItemsWithSubmenu.forEach(item => {
        item.style.backgroundColor = '';
      });
    },
  
    // Handle clicks on dropdown items
    handleDropdownClick(item) {
      const isCurrentlyActive = state.activeDropdownItem === item;
      const isSidebarExpanded = elements.sidebar.classList.contains("expanded");
      
      // Remove active state from all items first
      this.removeActiveState();
      
      if (isCurrentlyActive) {
        // If clicking the same item, close it
        state.activeDropdownItem = null;
        if (isSidebarExpanded) {
          elements.subMenu.classList.add("hidden");
        }
      } else {
        // Activate the clicked item
        item.style.backgroundColor = '#F6F6F6';
        state.activeDropdownItem = item;
        
        // Show/hide submenu based on sidebar state
        elements.subMenu.classList.toggle("hidden", !isSidebarExpanded);
      }
    },
  
    // Handle clicks on submenu items
    handleSubmenuClick(item, event) {
      // Prevent the click from triggering parent elements
      event.stopPropagation();
      
      // Reset all submenu items
      elements.subMenuItems.forEach(subItem => {
        subItem.style.backgroundColor = '';
      });
      
      // Activate clicked submenu item
      item.style.backgroundColor = '#F6F6F6';
      state.activeSubMenuItem = item;
      
      // Keep parent dropdown active
      if (state.activeDropdownItem) {
        state.activeDropdownItem.style.backgroundColor = '#F6F6F6';
      }
    }
  };
  
  // Handle mobile menu functions
  const mobileMenuManager = {
    // Close mobile menu
    close() {
      elements.sidebar.classList.remove("expanded");
      elements.overlay.classList.remove("show");
      document.body.style.overflow = "";
      elements.subMenu.classList.add("hidden");
      dropdownManager.removeActiveState();
      state.activeDropdownItem = null;
    },
  
    // Open mobile menu
    open() {
      elements.sidebar.classList.add("expanded");
      elements.overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  };
  
  // Set up all event listeners
  function initializeEventListeners() {
    // Add click handlers to dropdown items
    elements.navItemsWithSubmenu.forEach(item => {
      item.addEventListener("click", () => dropdownManager.handleDropdownClick(item));
    });
  
    // Add click handlers to submenu items
    elements.subMenuItems.forEach(item => {
      item.addEventListener("click", (e) => dropdownManager.handleSubmenuClick(item, e));
    });
  
    // Handle sidebar toggle button click
    elements.toggleButton.addEventListener("click", () => {
      if (window.innerWidth > 640) {  // Only on desktop
        state.isSidebarExpanded = !state.isSidebarExpanded;
        elements.sidebar.classList.toggle("expanded");
        elements.dashboard.classList.toggle("expanded");
        elements.toggleButton.classList.toggle("img-rotate");
        
        // Hide submenu when collapsing sidebar
        if (!state.isSidebarExpanded) {
          elements.subMenu.classList.add("hidden");
        }
      }
    });
  
    // Mobile menu buttons
    if (elements.mobileMenuButton) {
      elements.mobileMenuButton.addEventListener("click", mobileMenuManager.open);
    }
    elements.mobileCloseButton.addEventListener("click", mobileMenuManager.close);
    elements.overlay.addEventListener("click", mobileMenuManager.close);
  
    // Handle window resize
    window.addEventListener("resize", () => {
      layoutManager.updateSidebarState();
      layoutManager.updateContainerHeights();
    });
  
    // Watch for topbar height changes
    const resizeObserver = new ResizeObserver(() => {
      layoutManager.updateContainerHeights();
    });
    resizeObserver.observe(elements.topbar);
  }
  
  // Initialize everything when the page loads
  function init() {
    layoutManager.updateSidebarState();
    layoutManager.updateContainerHeights();
    initializeEventListeners();
  }
  
  // Start the application
  init();