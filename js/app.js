// Application logic for forma studio
(function() {
  const chairVariants = window.chairVariants || [];
  let currentIndex = 0; // Starts at Sapphire (Blue) matching the screenshot
  let currentMode = 'photo'; // 'photo' or '3d'
  let activeHotspotId = 'cushion'; // Cushion hotspot starts open like the screenshot

  document.addEventListener('DOMContentLoaded', () => {
    renderSwatches();
    renderHotspots();
    renderCatalogGrid();
    attachEventListeners();
    initSearch();
    initNavbarPills();
    updateVariant(0, false);
  });

  // Render the primary color swatches on the right side (matching reference image)
  function renderSwatches() {
    const container = document.getElementById('swatchesContainer');
    if (!container) return;

    container.innerHTML = '';
    // Show every variant in the compact horizontal scroller.
    const primaryVariants = chairVariants;
    primaryVariants.forEach((variant, index) => {
      const item = document.createElement('div');
      item.className = `swatch-item flex flex-col items-center gap-1.5 ${index === currentIndex ? 'active' : ''}`;
      item.setAttribute('data-index', index);

      item.innerHTML = `
        <div class="swatch-circle" style="background-color: ${variant.colorHex};">
          <img src="${variant.image}" alt="${variant.name}" />
        </div>
        <span class="text-[11px] text-white/90 font-medium text-center leading-tight max-w-[66px] transition-opacity ${index === currentIndex ? 'opacity-100 font-semibold' : 'opacity-80'}">
          ${variant.name.replace(' ', '<br/>')}
        </span>
      `;

      item.addEventListener('click', () => {
        updateVariant(index, true);
      });

      container.appendChild(item);
    });
  }

  // Update the active variant
  function updateVariant(index, animate = true) {
    if (!chairVariants.length) return;
    currentIndex = (index + chairVariants.length) % chairVariants.length;
    const chair = chairVariants[currentIndex];

    // Update background gradient of the hero card
    const heroCard = document.getElementById('heroCard');
    if (heroCard) {
      heroCard.style.background = chair.bgGradient;
    }

    // Synchronize sticky navigation bar color with the active home color theme
    const variantNavColors = {
      sapphire: 'rgba(21, 69, 173, 0.90)',
      emerald: 'rgba(14, 64, 46, 0.90)',
      terracotta: 'rgba(124, 45, 18, 0.90)',
      ivory: 'rgba(42, 49, 61, 0.90)',
      berry: 'rgba(93, 15, 51, 0.90)',
      ochre: 'rgba(94, 67, 8, 0.90)',
      sage: 'rgba(35, 67, 51, 0.90)',
      cognac: 'rgba(70, 32, 10, 0.90)'
    };
    const activeNavBg = variantNavColors[chair.id] || 'rgba(15, 23, 42, 0.90)';
    document.documentElement.style.setProperty('--active-nav-bg', activeNavBg);

    const contactBadge = document.getElementById('navContactPhoneBadge');
    if (contactBadge) {
      contactBadge.style.backgroundColor = chair.accentColor || chair.colorHex;
    }

    // Update chair photo image with smooth crossfade
    const chairImg = document.getElementById('chairPhoto');
    if (chairImg) {
      if (animate) {
        chairImg.style.opacity = '0';
        chairImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
          chairImg.src = chair.image;
          chairImg.alt = chair.name;
          chairImg.style.opacity = '1';
          chairImg.style.transform = 'scale(1)';
        }, 180);
      } else {
        chairImg.src = chair.image;
        chairImg.alt = chair.name;
      }
    }

    // Update Three.js material color if 3D is active
    if (window.updateChairColor) {
      window.updateChairColor(chair.colorHex);
    }

    // Update active class on swatches
    const swatchElements = document.querySelectorAll('.swatch-item');
    swatchElements.forEach((el, idx) => {
      if (idx === currentIndex) {
        el.classList.add('active');
        const span = el.querySelector('span');
        if (span) {
          span.classList.remove('opacity-70');
          span.classList.add('opacity-100', 'font-bold');
        }
      } else {
        el.classList.remove('active');
        const span = el.querySelector('span');
        if (span) {
          span.classList.add('opacity-70');
          span.classList.remove('opacity-100', 'font-bold');
        }
      }
    });

    // Scroll active swatch into view
    const activeSwatch = swatchElements[currentIndex];
    if (activeSwatch) {
      activeSwatch.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Rebuild pins so every variant keeps working after a color change.
    renderHotspots();

    // Synchronize Shopping Bag Drawer item
    updateCartDrawer();
  }

  let cartQuantity = 1;

  function updateCartDrawer() {
    if (!chairVariants.length) return;
    const chair = chairVariants[currentIndex];
    
    const imgWrap = document.getElementById('cartItemImgWrap');
    const img = document.getElementById('cartItemImg');
    const name = document.getElementById('cartItemName');
    const price = document.getElementById('cartItemPrice');
    const swatch = document.getElementById('cartItemSwatch');
    const category = document.getElementById('cartItemCategory');
    const qtyVal = document.getElementById('cartQtyVal');
    const subtotal = document.getElementById('cartSubtotal');
    const total = document.getElementById('cartTotal');
    const badge = document.getElementById('cartCountBadge');
    const headerCount = document.getElementById('cartHeaderCount');

    if (imgWrap) imgWrap.style.background = chair.bgGradient;
    if (img) {
      img.src = chair.image;
      img.alt = chair.name;
    }
    if (name) name.textContent = chair.name;
    if (swatch) swatch.style.backgroundColor = chair.colorHex;
    if (category) category.textContent = `${chair.category} • ${chair.name.split(' ')[0]}`;

    // Calculate numeric price
    const unitPrice = parseInt(chair.price.replace(/[^0-9]/g, ''), 10) || 1450;
    const totalPrice = unitPrice * cartQuantity;
    const formattedTotal = `$${totalPrice.toLocaleString()}`;

    if (price) price.textContent = chair.price;
    if (qtyVal) qtyVal.textContent = cartQuantity;
    if (subtotal) subtotal.textContent = formattedTotal;
    if (total) total.textContent = formattedTotal;
    if (badge) badge.textContent = cartQuantity;
    if (headerCount) headerCount.textContent = `${cartQuantity} Item${cartQuantity > 1 ? 's' : ''} in Bag`;
  }

  // Render the 3 interactive hotspots on the chair
  function renderHotspots() {
    const container = document.getElementById('hotspotsContainer');
    if (!container || !chairVariants.length) return;

    const currentChair = chairVariants[currentIndex];
    container.innerHTML = '';

    currentChair.hotspots.forEach((hs) => {
      const pin = document.createElement('button');
      pin.className = `hotspot-pin ${hs.id === activeHotspotId ? 'active' : ''}`;
      pin.type = 'button';
      pin.id = `pin-${hs.id}`;
      pin.style.left = hs.x;
      pin.style.top = hs.y;
      pin.setAttribute('data-id', hs.id);
      pin.setAttribute('aria-label', `Show ${hs.title}`);
      pin.innerHTML = hs.id === activeHotspotId ? '✕' : '+';

      container.appendChild(pin);
    });

    updateHotspotContent();
  }

  function updateHotspotContent() {
    if (!chairVariants.length) return;
    const currentChair = chairVariants[currentIndex];
    const callout = document.getElementById('glassCallout');
    if (!callout) return;

    const currentHs = currentChair.hotspots.find(h => h.id === activeHotspotId);
    if (currentHs) {
      const titleEl = callout.querySelector('.callout-title');
      if (titleEl) titleEl.textContent = currentHs.title;
      callout.querySelector('.callout-text').textContent = currentHs.text;
      callout.style.left = `calc(${currentHs.x} + 18px)`;
      callout.style.top = `calc(${currentHs.y} + 30px)`;
      callout.classList.add('show');
    } else {
      callout.classList.remove('show');
    }

    currentChair.hotspots.forEach(hs => {
      const pin = document.getElementById(`pin-${hs.id}`);
      if (pin) {
        if (hs.id === activeHotspotId) {
          pin.innerHTML = '✕';
          pin.classList.add('active');
        } else {
          pin.innerHTML = '+';
          pin.classList.remove('active');
        }
      }
    });
  }

  function toggleHotspot(id) {
    if (activeHotspotId === id) {
      activeHotspotId = null;
    } else {
      activeHotspotId = id;
    }
    updateHotspotContent();
  }

  // Attach all event listeners
  function attachEventListeners() {
    document.addEventListener('pointerdown', (e) => {
      const target = e.target.closest && e.target.closest('.hotspot-pin');
      const pin = target || [...document.querySelectorAll('.hotspot-pin')].find((candidate) => {
        const rect = candidate.getBoundingClientRect();
        return e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
      });
      if (!pin) return;
      e.preventDefault();
      e.stopPropagation();
      toggleHotspot(pin.getAttribute('data-id'));
    }, true);

    const prevBtn = document.getElementById('prevChairBtn');
    const nextBtn = document.getElementById('nextChairBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateVariant(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateVariant(currentIndex + 1);
      });
    }

    // Sticky navigation bar on scroll
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
      const handleNavScroll = () => {
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', handleNavScroll, { passive: true });
      handleNavScroll();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateVariant(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateVariant(currentIndex + 1);
      }
    });

    const bottomScroll = document.getElementById('bottomScrollNotch');
    if (bottomScroll) {
      bottomScroll.addEventListener('click', () => {
        const target = document.getElementById('collectionSection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const calloutClose = document.getElementById('calloutClose');
    if (calloutClose) {
      calloutClose.addEventListener('click', (e) => {
        e.stopPropagation();
        activeHotspotId = null;
        updateHotspotContent();
      });
    }

    const consultForm = document.getElementById('consultationForm');
    if (consultForm) {
      consultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('consultEmail');
        const email = emailInput ? emailInput.value.trim() : '';
        if (!email) return;

        showToast(`Request received! Our consultant will call you at ${email} within 15 minutes.`);
        if (emailInput) emailInput.value = '';
      });
    }

    const photoModeBtn = document.getElementById('photoModeBtn');
    const threeModeBtn = document.getElementById('threeModeBtn');
    const chairPhoto = document.getElementById('chairPhoto');
    const chair3DCanvas = document.getElementById('chair3DCanvas');
    const hotspotsContainer = document.getElementById('hotspotsContainer');

    if (photoModeBtn && threeModeBtn) {
      photoModeBtn.addEventListener('click', () => {
        currentMode = 'photo';
        photoModeBtn.classList.add('active');
        threeModeBtn.classList.remove('active');
        chairPhoto.style.display = 'block';
        chair3DCanvas.style.display = 'none';
        if (hotspotsContainer) hotspotsContainer.style.display = 'block';
      });

      threeModeBtn.addEventListener('click', () => {
        currentMode = '3d';
        threeModeBtn.classList.add('active');
        photoModeBtn.classList.remove('active');
        chairPhoto.style.display = 'none';
        chair3DCanvas.style.display = 'block';
        if (hotspotsContainer) hotspotsContainer.style.display = 'none';

        if (window.initThreeScene) {
          window.initThreeScene(chair3DCanvas);
          const currentChair = chairVariants[currentIndex];
          if (window.updateChairColor) {
            window.updateChairColor(currentChair.colorHex);
          }
        }
      });
    }

    const viewAllBtn = document.getElementById('viewAllBtn');
    const modalClose = document.getElementById('modalClose');
    const collectionsModal = document.getElementById('collectionsModal');

    if (viewAllBtn && collectionsModal) {
      viewAllBtn.addEventListener('click', () => {
        collectionsModal.classList.add('active');
      });
    }

    if (modalClose && collectionsModal) {
      modalClose.addEventListener('click', () => {
        collectionsModal.classList.remove('active');
      });

      collectionsModal.addEventListener('click', (e) => {
        if (e.target === collectionsModal) {
          collectionsModal.classList.remove('active');
        }
      });
    }

    // CART DRAWER LISTENERS
    const navCartBtn = document.getElementById('navCartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartQtyMinus = document.getElementById('cartQtyMinus');
    const cartQtyPlus = document.getElementById('cartQtyPlus');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (navCartBtn) {
      navCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const chair = chairVariants[currentIndex];
        localStorage.setItem('forma_selected_variant', chair.id);
        localStorage.setItem('forma_selected_qty', cartQuantity);

        // Smooth fade out transition
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.22s ease-out';
        setTimeout(() => {
          window.location.href = `./cart.html?variant=${chair.id}&qty=${cartQuantity}`;
        }, 200);
      });
    }

    if (cartCloseBtn && cartDrawer) {
      cartCloseBtn.addEventListener('click', () => {
        cartDrawer.classList.add('hidden');
        cartDrawer.classList.remove('flex');
      });

      cartDrawer.addEventListener('click', (e) => {
        if (e.target === cartDrawer) {
          cartDrawer.classList.add('hidden');
          cartDrawer.classList.remove('flex');
        }
      });
    }

    if (cartQtyMinus && cartQtyPlus) {
      cartQtyMinus.addEventListener('click', () => {
        if (cartQuantity > 1) {
          cartQuantity--;
          updateCartDrawer();
        }
      });
      cartQtyPlus.addEventListener('click', () => {
        if (cartQuantity < 10) {
          cartQuantity++;
          updateCartDrawer();
        }
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const chair = chairVariants[currentIndex];
        localStorage.setItem('forma_selected_variant', chair.id);
        localStorage.setItem('forma_selected_qty', cartQuantity);
        window.location.href = `./cart.html?variant=${chair.id}&qty=${cartQuantity}`;
      });
    }

    // LUXURY CONTACT MODAL LISTENERS
    const navContactBtn = document.getElementById('navContactBtn');
    const contactModal = document.getElementById('contactModal');
    const contactModalClose = document.getElementById('contactModalClose');
    const directCallbackForm = document.getElementById('directCallbackForm');

    if (navContactBtn && contactModal) {
      navContactBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
      });
    }

    if (contactModalClose && contactModal) {
      contactModalClose.addEventListener('click', () => {
        contactModal.classList.remove('active');
      });

      contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
          contactModal.classList.remove('active');
        }
      });
    }

    if (directCallbackForm) {
      directCallbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cbName')?.value.trim() || 'Client';
        const contact = document.getElementById('cbContact')?.value.trim() || '';
        const atelier = document.getElementById('cbAtelier')?.value || 'Milan';

        showToast(`Thank you ${name}! A specialist from our ${atelier} Atelier will connect with you at ${contact} within 15 minutes.`);
        directCallbackForm.reset();
        if (contactModal) {
          contactModal.classList.remove('active');
        }
      });
    }

    // Interactive mouse parallax in photo mode
    const centerStage = document.getElementById('chairCenterStage');
    if (centerStage) {
      centerStage.addEventListener('mousemove', (e) => {
        if (currentMode !== 'photo') return;
        const rect = centerStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const chairImg = document.getElementById('chairPhoto');
        if (chairImg) {
          chairImg.style.transform = `scale(1.02) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        }
      });

      centerStage.addEventListener('mouseleave', () => {
        if (currentMode !== 'photo') return;
        const chairImg = document.getElementById('chairPhoto');
        if (chairImg) {
          chairImg.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
        }
      });
    }
  }

  // Initialize Animated Navbar Sliding Pill Indicator & Scrollspy
  function initNavbarPills() {
    const leftNav = document.getElementById('navLeftLinks');
    const rightNav = document.getElementById('navRightLinks');
    const leftPill = document.getElementById('navLeftPill');
    const rightPill = document.getElementById('navRightPill');
    const navLinks = Array.from(document.querySelectorAll('.nav-pill-link'));

    if (!navLinks.length) return;

    let activeLink = navLinks[0];
    let isManualClick = false;
    let manualClickTimer = null;

    function positionPill(targetLink, animate = true) {
      if (!targetLink) return;
      activeLink = targetLink;

      // Update active text styles across all links
      navLinks.forEach(link => {
        if (link === targetLink) {
          link.classList.add('text-slate-900', 'font-semibold', 'active-pill');
          link.classList.remove('text-white/80', 'font-medium');
        } else {
          link.classList.remove('text-slate-900', 'font-semibold', 'active-pill');
          link.classList.add('text-white/80', 'font-medium');
        }
      });

      const isLeft = leftNav && leftNav.contains(targetLink);

      if (isLeft && leftPill) {
        if (!animate) {
          leftPill.style.transition = 'none';
        }
        leftPill.style.opacity = '1';
        leftPill.style.left = `${targetLink.offsetLeft}px`;
        leftPill.style.top = `${targetLink.offsetTop}px`;
        leftPill.style.width = `${targetLink.offsetWidth}px`;
        leftPill.style.height = `${targetLink.offsetHeight}px`;

        if (!animate) {
          leftPill.offsetHeight; // Force reflow
          leftPill.style.transition = '';
        }

        if (rightPill) rightPill.style.opacity = '0';
      } else if (rightPill) {
        if (!animate) {
          rightPill.style.transition = 'none';
        }
        rightPill.style.opacity = '1';
        rightPill.style.left = `${targetLink.offsetLeft}px`;
        rightPill.style.top = `${targetLink.offsetTop}px`;
        rightPill.style.width = `${targetLink.offsetWidth}px`;
        rightPill.style.height = `${targetLink.offsetHeight}px`;

        if (!animate) {
          rightPill.offsetHeight; // Force reflow
          rightPill.style.transition = '';
        }

        if (leftPill) leftPill.style.opacity = '0';
      }
    }

    // Click handler on links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetEl = document.getElementById(targetId);

          isManualClick = true;
          clearTimeout(manualClickTimer);
          manualClickTimer = setTimeout(() => {
            isManualClick = false;
          }, 900);

          positionPill(link, true);

          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Sections order for scrollspy
    const sectionIds = ['home', 'collectionSection', 'about', 'team', 'faqs'];

    function handleScrollspy() {
      if (isManualClick) return;

      const scrollY = window.scrollY;

      // Top of page: home
      if (scrollY < 180) {
        const homeLink = navLinks.find(l => l.getAttribute('href') === '#home');
        if (homeLink && homeLink !== activeLink) {
          positionPill(homeLink, true);
        }
        return;
      }

      // Bottom of page: faqs
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
        const faqsLink = navLinks.find(l => l.getAttribute('href') === '#faqs');
        if (faqsLink && faqsLink !== activeLink) {
          positionPill(faqsLink, true);
        }
        return;
      }

      // Find visible section
      let currentSectionId = null;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260) {
            currentSectionId = id;
            break;
          }
        }
      }

      if (currentSectionId) {
        const targetLink = navLinks.find(l => l.getAttribute('href') === `#${currentSectionId}`);
        if (targetLink && targetLink !== activeLink) {
          positionPill(targetLink, true);
        }
      }
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          handleScrollspy();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      positionPill(activeLink, false);
    });

    // Initial setup with fallbacks for font rendering
    positionPill(activeLink, false);
    setTimeout(() => positionPill(activeLink, false), 60);
    setTimeout(() => positionPill(activeLink, false), 250);
  }

  // Render the 8-chair catalog grid below the fold
  function renderCatalogGrid() {
    const catalogGrid = document.getElementById('catalogGrid');
    const modalGrid = document.querySelector('#collectionsModal .grid');
    
    if (catalogGrid) catalogGrid.innerHTML = '';
    if (modalGrid) modalGrid.innerHTML = '';

    chairVariants.forEach((chair, index) => {
      // Catalog card
      if (catalogGrid) {
        const card = document.createElement('div');
        card.className = 'group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col justify-between cursor-pointer';
        card.innerHTML = `
          <div class="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden flex items-center justify-center p-4" style="background: ${chair.bgGradient}">
            <img src="${chair.image}" alt="${chair.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
            <span class="absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-slate-800">
              ${chair.price}
            </span>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-slate-900 text-lg">${chair.name}</h3>
              <span class="w-3.5 h-3.5 rounded-full border border-slate-200" style="background-color: ${chair.colorHex}"></span>
            </div>
            <p class="text-xs text-slate-500 mb-4 line-clamp-2">${chair.description}</p>
            <button class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2">
              Select & View in 3D
            </button>
          </div>
        `;
        card.addEventListener('click', () => {
          updateVariant(index);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        catalogGrid.appendChild(card);
      }

      // Modal card
      if (modalGrid) {
        const modalItem = document.createElement('div');
        modalItem.className = 'bg-slate-50 hover:bg-slate-100 rounded-2xl p-4 cursor-pointer transition-all border border-slate-200 text-center flex flex-col items-center';
        modalItem.innerHTML = `
          <div class="w-24 h-24 mb-2 flex items-center justify-center">
            <img src="${chair.image}" alt="${chair.name}" class="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span class="text-xs font-bold text-slate-800">${chair.name}</span>
          <span class="text-[11px] text-blue-600 font-semibold">${chair.price}</span>
        `;
        modalItem.addEventListener('click', () => {
          updateVariant(index);
          const modal = document.getElementById('collectionsModal');
          if (modal) {
            modal.classList.remove('active');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        modalGrid.appendChild(modalItem);
      }
    });
  }

  // Initialize Spotlight Search Modal
  function initSearch() {
    const searchNavBtn = document.getElementById('searchNavBtn');
    const searchModal = document.getElementById('searchModal');
    const searchModalClose = document.getElementById('searchModalClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const tagButtons = document.querySelectorAll('.search-tag-btn');

    if (!searchModal || !searchInput) return;

    function openSearch() {
      searchModal.classList.add('active');
      setTimeout(() => searchInput.focus(), 60);
      renderSearchResults(searchInput.value.trim());
    }

    function closeSearch() {
      searchModal.classList.remove('active');
    }

    if (searchNavBtn) {
      searchNavBtn.addEventListener('click', openSearch);
    }

    if (searchModalClose) {
      searchModalClose.addEventListener('click', closeSearch);
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === '/' && document.activeElement !== searchInput && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape') {
        if (searchModal.classList.contains('active')) {
          closeSearch();
        }
        const contactModal = document.getElementById('contactModal');
        if (contactModal && contactModal.classList.contains('active')) {
          contactModal.classList.remove('active');
        }
        const collectionsModal = document.getElementById('collectionsModal');
        if (collectionsModal && collectionsModal.classList.contains('active')) {
          collectionsModal.classList.remove('active');
        }
      }
    });

    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });

    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const term = btn.getAttribute('data-term') || '';
        searchInput.value = term;
        renderSearchResults(term);
      });
    });

    function renderSearchResults(query) {
      if (!searchResults) return;
      searchResults.innerHTML = '';

      const q = query.toLowerCase();

      // Static knowledge topics
      const knowledgeItems = [
        {
          type: 'Technical Specs',
          title: 'Dimensions & Proportions',
          subtitle: '84 cm (W) × 82 cm (D) × 78 cm (H) | Seat 44 cm | 26 kg | Dynamic load 450 lbs',
          target: '#collectionSection',
          keywords: ['dimensions', 'width', 'height', 'depth', 'seat', 'weight', 'blueprint', 'specs', 'size', 'load']
        },
        {
          type: 'Materials',
          title: 'Italian Velvet & FSC Nordic Ash',
          subtitle: '100,000+ Martindale rub count, liquid-repelling nano-shield, kiln-dried Nordic ash',
          target: '#about',
          keywords: ['materials', 'velvet', 'fabric', 'ash', 'timber', 'wood', 'oeko-tex', 'microfiber', 'martindale']
        },
        {
          type: 'Logistics',
          title: 'Global White-Glove Delivery',
          subtitle: 'Two-person team, in-room placement, unpacking & 100% packaging recycling at zero charge',
          target: '#faqs',
          keywords: ['delivery', 'shipping', 'white-glove', 'freight', 'carrier', 'arrive', 'transport']
        },
        {
          type: 'Coverage',
          title: '10-Year Structural Frame Warranty',
          subtitle: 'Guarantees solid European beech & ash timber frame and monolithic arch integrity',
          target: '#faqs',
          keywords: ['warranty', 'guarantee', 'frame', 'defect', 'coverage', '10-year', 'ten year']
        },
        {
          type: 'Care Guide',
          title: 'Velvet Cleaning & Nano-Shield',
          subtitle: 'Liquid droplets bead on surface. Blot with dry cloth or use soft velvet lint brush',
          target: '#faqs',
          keywords: ['cleaning', 'clean', 'stain', 'spill', 'wash', 'coffee', 'wine', 'brush', 'care']
        },
        {
          type: 'Policy',
          title: '30-Day In-Home Trial & Free Returns',
          subtitle: 'Experience in your interior for 30 days. Complimentary return pickup with 100% full refund',
          target: '#faqs',
          keywords: ['trial', 'return', 'refund', '30-day', '30 days', 'exchange', 'policy']
        },
        {
          type: 'Atelier Team',
          title: 'Design Collective & Master Artisans',
          subtitle: 'Elena Rossi (Milan), Lars Lindqvist (Copenhagen), Kenji Takahashi (Tokyo), Sofia Al-Mansoor',
          target: '#team',
          keywords: ['team', 'designer', 'architect', 'elena', 'rossi', 'lars', 'kenji', 'sofia', 'consultant', 'artisans']
        }
      ];

      // 1. Matched chairs
      const matchedChairs = chairVariants.filter((c) => {
        if (!q) return true; // show all when empty
        return c.name.toLowerCase().includes(q) ||
               c.category.toLowerCase().includes(q) ||
               c.description.toLowerCase().includes(q) ||
               c.price.toLowerCase().includes(q);
      });

      // 2. Matched knowledge
      const matchedKnowledge = q ? knowledgeItems.filter(item => {
        return item.title.toLowerCase().includes(q) ||
               item.subtitle.toLowerCase().includes(q) ||
               item.type.toLowerCase().includes(q) ||
               item.keywords.some(k => k.includes(q) || q.includes(k));
      }) : [];

      if (matchedChairs.length === 0 && matchedKnowledge.length === 0) {
        searchResults.innerHTML = `
          <div class="py-12 text-center">
            <div class="text-3xl mb-2">🔍</div>
            <h4 class="font-bold text-slate-800 text-sm">No exact matches found for "${escapeHtml(query)}"</h4>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try searching for color names like "Sapphire", "Emerald", or topics like "Velvet", "Warranty", or "Dimensions".</p>
          </div>
        `;
        return;
      }

      // Group 1: Armchair Collections
      if (matchedChairs.length > 0) {
        const chairSection = document.createElement('div');
        chairSection.className = 'pb-4';
        chairSection.innerHTML = `
          <div class="flex items-center justify-between py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Armchair Colorways (${matchedChairs.length})</span>
            <span>Instant 3D Preview</span>
          </div>
        `;

        matchedChairs.forEach(chair => {
          const originalIdx = chairVariants.findIndex(cv => cv.id === chair.id);
          const item = document.createElement('div');
          item.className = 'flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group';
          item.innerHTML = `
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center p-1 relative border border-slate-100 shadow-sm" style="background: ${chair.bgGradient}">
                <img src="${chair.image}" alt="${chair.name}" class="w-full h-full object-contain drop-shadow" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">${chair.name}</h4>
                  <span class="w-2.5 h-2.5 rounded-full border border-slate-200" style="background-color: ${chair.colorHex}"></span>
                </div>
                <p class="text-xs text-slate-500 line-clamp-1">${chair.description}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-xs text-slate-900">${chair.price}</span>
              <span class="text-xs font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                View <span>→</span>
              </span>
            </div>
          `;

          item.addEventListener('click', () => {
            updateVariant(originalIdx >= 0 ? originalIdx : 0);
            closeSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });

          chairSection.appendChild(item);
        });

        searchResults.appendChild(chairSection);
      }

      // Group 2: Specs, Help & Guides
      if (matchedKnowledge.length > 0) {
        const knowledgeSection = document.createElement('div');
        knowledgeSection.className = 'pt-4';
        knowledgeSection.innerHTML = `
          <div class="py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Specifications & Guides (${matchedKnowledge.length})
          </div>
        `;

        matchedKnowledge.forEach(k => {
          const item = document.createElement('div');
          item.className = 'p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group flex items-start justify-between gap-4';
          item.innerHTML = `
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  ${k.type}
                </span>
                <h4 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">${k.title}</h4>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">${k.subtitle}</p>
            </div>
            <span class="text-xs text-slate-400 group-hover:text-blue-600 font-bold transition-colors shrink-0 pt-1">
              Jump →
            </span>
          `;

          item.addEventListener('click', () => {
            closeSearch();
            const targetEl = document.querySelector(k.target);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          });

          knowledgeSection.appendChild(item);
        });

        searchResults.appendChild(knowledgeSection);
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  }

  // Toast notification
  function showToast(message) {
    const existing = document.getElementById('customToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'customToast';
    toast.className = 'fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-bounce';
    toast.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
})();
