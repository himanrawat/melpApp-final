const elements = {
  sidebar: document.getElementById("sidebar"),
  dashboard: document.getElementById("dashboard"),
  topbar: document.querySelector('.topbar'),
  container: document.querySelector('.container'),
  notificationBar: document.querySelector('.notification-bar'),
  toggleButton: document.getElementById("toggleButton"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  mobileCloseButton: document.getElementById("mobileCloseButton"),
  overlay: document.getElementById("overlay"),
  logo: document.getElementById("logo"),
  navItemsWithSubmenu: document.querySelectorAll(".nav-item-submenu .nav-item"),
  subMenu: document.getElementById("submenuContainer"),
  subMenuItems: document.querySelectorAll(".sub-menu li")
};

const state = {
  isSidebarExpanded: false,
  activeDropdownItem: null,
  activeSubMenuItem: null
};

const layoutManager = {
  updateSidebarState() {
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
          elements.sidebar.classList.remove("expanded");
          elements.dashboard.classList.remove("expanded");
          elements.overlay.classList.remove("show");
          
          state.isSidebarExpanded = false;
          elements.subMenu.classList.add("hidden");
          
          dropdownManager.removeActiveState();
          state.activeDropdownItem = null;
      } else {
          elements.overlay.classList.remove("show");
      }
      
      document.body.style.overflow = "";
  }
};

const dropdownManager = {
  removeActiveState() {
      elements.navItemsWithSubmenu.forEach(item => {
          item.style.backgroundColor = '';
      });
  },

  handleDropdownClick(item) {
      const isCurrentlyActive = state.activeDropdownItem === item;
      const isSidebarExpanded = elements.sidebar.classList.contains("expanded");
      
      this.removeActiveState();
      
      if (isCurrentlyActive) {
          state.activeDropdownItem = null;
          if (isSidebarExpanded) {
              elements.subMenu.classList.add("hidden");
          }
      } else {
          item.style.backgroundColor = '#F6F6F6';
          state.activeDropdownItem = item;
          elements.subMenu.classList.toggle("hidden", !isSidebarExpanded);
      }
  },

  handleSubmenuClick(item, event) {
      event.stopPropagation();
      
      elements.subMenuItems.forEach(subItem => {
          subItem.style.backgroundColor = '';
      });
      
      item.style.backgroundColor = '#F6F6F6';
      state.activeSubMenuItem = item;
      
      if (state.activeDropdownItem) {
          state.activeDropdownItem.style.backgroundColor = '#F6F6F6';
      }
  }
};

const mobileMenuManager = {
  close() {
      elements.sidebar.classList.remove("expanded");
      elements.overlay.classList.remove("show");
      document.body.style.overflow = "";
      elements.subMenu.classList.add("hidden");
      dropdownManager.removeActiveState();
      state.activeDropdownItem = null;
  },

  open() {
      elements.sidebar.classList.add("expanded");
      elements.overlay.classList.add("show");
      document.body.style.overflow = "hidden";
  }
};

function initializeEventListeners() {
  elements.navItemsWithSubmenu.forEach(item => {
      item.addEventListener("click", () => dropdownManager.handleDropdownClick(item));
  });

  elements.subMenuItems.forEach(item => {
      item.addEventListener("click", (e) => dropdownManager.handleSubmenuClick(item, e));
  });

  elements.toggleButton.addEventListener("click", () => {
      if (window.innerWidth > 640) {
          state.isSidebarExpanded = !state.isSidebarExpanded;
          elements.sidebar.classList.toggle("expanded");
          elements.dashboard.classList.toggle("expanded");
          elements.toggleButton.classList.toggle("img-rotate");
          
          if (!state.isSidebarExpanded) {
              elements.subMenu.classList.add("hidden");
          }
      }
  });

  if (elements.mobileMenuButton) {
      elements.mobileMenuButton.addEventListener("click", mobileMenuManager.open);
  }
  elements.mobileCloseButton.addEventListener("click", mobileMenuManager.close);
  elements.overlay.addEventListener("click", mobileMenuManager.close);

  window.addEventListener("resize", () => {
      layoutManager.updateSidebarState();
  });
}

function init() {
  layoutManager.updateSidebarState();
  initializeEventListeners();
}

init();