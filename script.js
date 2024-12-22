// DOM Elements
const elements = {
  sidebar: document.getElementById("sidebar"),
  dashboard: document.getElementById("dashboard"),
  topbar: document.querySelector('.topbar'),
  container: document.querySelector('.container'),
  notificationBar: document.querySelector('.notification-bar'),
  toggleButton: document.getElementById("toggleButton"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  sidebarCloseButton: document.getElementById("sidebarCloseButton"),
  notificationToggle: document.getElementById("notificationToggle"),
  notificationCloseButton: document.getElementById("notificationCloseButton"),
  overlay: document.getElementById("overlay"),
  navItemsWithSubmenu: document.querySelectorAll(".nav-item-submenu .nav-item"),
  subMenu: document.getElementById("submenuContainer"),
  subMenuItems: document.querySelectorAll(".sub-menu li"),
  searchBar: document.querySelector('.search-bar'),
  navTitles: document.querySelectorAll(".nav-title")
};

// Application State
const state = {
  isSidebarVisible: false,
  isNotificationBarVisible: false,
  activeDropdownItem: null,
  activeSubMenuItem: null,
  isMobileView: window.innerWidth <= 1024,
  isTabletView: window.innerWidth <= 1024 && window.innerWidth > 768
};

// Layout Manager
const layoutManager = {
  updateLayout() {
      const width = window.innerWidth;
      state.isMobileView = width <= 768;
      state.isTabletView = width <= 1024 && width > 768;

      if (state.isMobileView || state.isTabletView) {
          elements.sidebar.classList.remove("expanded");
          elements.dashboard.classList.remove("expanded");
          this.resetAllStates();
      }
  },

  resetAllStates() {
      sidebarManager.close();
      notificationManager.close();
      dropdownManager.closeAllDropdowns();
      elements.overlay.classList.remove("show");
      document.body.style.overflow = "";
  },


  toggleOverlay(show) {
      elements.overlay.classList.toggle("show", show);
      document.body.style.overflow = show ? "hidden" : "";
  }
};

// Sidebar Manager
const sidebarManager = {
  open() {
      elements.sidebar.classList.add("show");
      layoutManager.toggleOverlay(true);
      state.isSidebarVisible = true;

      if (state.isNotificationBarVisible) {
          notificationManager.close();
      }
  },

  close() {
      elements.sidebar.classList.remove("show");
      layoutManager.toggleOverlay(false);
      state.isSidebarVisible = false;
      dropdownManager.closeAllDropdowns();
  },

  toggle() {
      if (state.isSidebarVisible) {
          this.close();
      } else {
          this.open();
      }
  },

  toggleDesktop() {
      elements.sidebar.classList.toggle("expanded");
      elements.dashboard.classList.toggle("expanded");
      elements.toggleButton.classList.toggle("img-rotate");
  }
};

// Notification Manager
const notificationManager = {
  open() {
      elements.notificationBar.classList.add("show");
      layoutManager.toggleOverlay(true);
      state.isNotificationBarVisible = true;

      if (state.isSidebarVisible) {
          sidebarManager.close();
      }
  },

  close() {
      elements.notificationBar.classList.remove("show");
      layoutManager.toggleOverlay(false);
      state.isNotificationBarVisible = false;
  },

  toggle() {
      if (state.isNotificationBarVisible) {
          this.close();
      } else {
          this.open();
      }
  }
};

// Dropdown Manager
const dropdownManager = {
  toggleDropdown(item) {
      const submenu = item.closest('.nav-item-submenu').querySelector('.submenu-container');
      const isCurrentlyActive = state.activeDropdownItem === item;

      this.closeAllDropdowns();

      if (!isCurrentlyActive) {
          item.style.backgroundColor = '#F6F6F6';
          submenu.classList.remove('hidden');
          state.activeDropdownItem = item;
      } else {
          state.activeDropdownItem = null;
      }
  },

  closeAllDropdowns() {
      elements.navItemsWithSubmenu.forEach(item => {
          item.style.backgroundColor = '';
      });
      
      document.querySelectorAll('.submenu-container').forEach(submenu => {
          submenu.classList.add('hidden');
      });

      state.activeDropdownItem = null;
  },

  handleSubmenuClick(item, event) {
      event.stopPropagation();

      elements.subMenuItems.forEach(subItem => {
          subItem.style.backgroundColor = '';
      });

      item.style.backgroundColor = '#F6F6F6';
      state.activeSubMenuItem = item;

      if (state.isMobileView || state.isTabletView) {
          setTimeout(() => {
              sidebarManager.close();
          }, 300);
      }
  }
};

// Event Listeners
function initializeEventListeners() {
  // Sidebar Controls
  elements.mobileMenuButton.addEventListener("click", () => sidebarManager.toggle());
  elements.sidebarCloseButton.addEventListener("click", () => sidebarManager.close());
  elements.toggleButton.addEventListener("click", () => {
      if (!state.isMobileView && !state.isTabletView) {
          sidebarManager.toggleDesktop();
      }
  });

  // Notification Controls
  elements.notificationToggle.addEventListener("click", () => notificationManager.toggle());
  elements.notificationCloseButton.addEventListener("click", () => notificationManager.close());

  // Overlay
  elements.overlay.addEventListener("click", () => {
      sidebarManager.close();
      notificationManager.close();
  });

  // Dropdown Controls
  elements.navItemsWithSubmenu.forEach(item => {
      item.addEventListener("click", () => dropdownManager.toggleDropdown(item));
  });

  elements.subMenuItems.forEach(item => {
      item.addEventListener("click", (e) => dropdownManager.handleSubmenuClick(item, e));
  });

  // Window Resize
  window.addEventListener("resize", _.debounce(() => {
      layoutManager.updateLayout();
  }, 250));

  // Document Ready
  document.addEventListener("DOMContentLoaded", () => {
      layoutManager.updateLayout();
  });
}

// Handle Page Load
function init() {
  layoutManager.updateLayout();
  initializeEventListeners();
}

// Initialize Application
init();