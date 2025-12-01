import { div, h2 } from '../../scripts/dom-builder.js';
import tabsOrder from '../../scripts/tabs-order.js';

// Global tracking for scroll behavior
let lastScrollY = window.scrollY;
let isManualScroll = false;

// This will be set dynamically inside decorate()
let dynamicTabMap = {};

function highlightActiveTab(forcedLabel = null) {
  if (isManualScroll && !forcedLabel) return;

  const offset = 100;
  const { scrollY } = window;
  const goingDown = scrollY > lastScrollY;
  lastScrollY = scrollY;

  const allTabs = document.querySelectorAll('.p-tab');

  const tabEntries = Object.entries(dynamicTabMap)
    .map(([label, selector]) => {
      const section = document.querySelector(`#${selector}`);
      return section
        ? {
          label,
          top: section.offsetTop - offset,
          bottom: section.offsetTop + section.offsetHeight - offset,
        }
        : null;
    })
    .filter(Boolean);

  let activeLabel = forcedLabel;

  if (!activeLabel && tabEntries.length > 0) {
    let matched = false;

    for (let i = 0; i < tabEntries.length; i += 1) {
      const { label, top, bottom } = tabEntries[i];

      if (scrollY >= top && scrollY < bottom) {
        activeLabel = label;
        matched = true;
        break;
      }

      const next = tabEntries[i + 1];
      if (!matched && next && scrollY >= bottom && scrollY < next.top) {
        activeLabel = goingDown ? next.label : label;
        matched = true;
        break;
      }
    }

    // Keep first tab active when above first section
    if (!matched && scrollY < tabEntries[0].top) {
      activeLabel = tabEntries[0].label;
      matched = true;
    }

    // No active tab when below the last section
    if (!matched) {
      activeLabel = null;
    }
  }

  // Update tab styles
  allTabs.forEach((tab, index) => {
    const label = tab.textContent.trim();
    const isActive = label === activeLabel;

    tab.classList.toggle('text-danaherpurple-500', isActive);
    tab.classList.toggle('font-bold', isActive);
    tab.classList.toggle('text-black', !isActive);
    tab.classList.toggle('font-medium', !isActive);

    const indicator = tab.previousElementSibling;
    if (indicator) {
      indicator.classList.toggle('bg-danaherpurple-500', isActive);
      indicator.classList.toggle('rounded-[5px]', isActive);
    }

    if (
      isActive
      && window.innerWidth < 768
      && !(index === 0 && scrollY < tabEntries[0].top)
    ) {
      tab.parentElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  });

  // --- ✅ Skip hidden tabs without scroll interference ---
  const activeTab = Array.from(allTabs).find((tab) => tab.classList.contains('text-danaherpurple-500'));

  if (activeTab && window.getComputedStyle(activeTab.parentElement).display === 'none') {
    let nextTab = activeTab.parentElement.nextElementSibling;

    // Find next visible tab
    while (nextTab && window.getComputedStyle(nextTab).display === 'none') {
      nextTab = nextTab.nextElementSibling;
    }

    if (nextTab) {
      const nextLabel = nextTab.querySelector('.p-tab')?.textContent.trim();
      if (nextLabel) {
        // Temporarily disable scroll tracking to avoid recursion
        const prevManualScroll = isManualScroll;
        isManualScroll = true;

        // Just visually update highlight
        allTabs.forEach((tab) => {
          const label = tab.textContent.trim();
          const isActive = label === nextLabel;
          tab.classList.toggle('text-danaherpurple-500', isActive);
          tab.classList.toggle('font-bold', isActive);
          tab.classList.toggle('text-black', !isActive);
          tab.classList.toggle('font-medium', !isActive);

          const indicator = tab.previousElementSibling;
          if (indicator) {
            indicator.classList.toggle('bg-danaherpurple-500', isActive);
            indicator.classList.toggle('rounded-[5px]', isActive);
          }
        });

        isManualScroll = prevManualScroll;
      }
    }
  }
}

function updatePageTabs(event) {
  const label = event.target.textContent.trim();
  const targetId = dynamicTabMap[label];
  const targetEl = document.querySelector(`#${targetId}`);
  if (!targetEl) return;
  const offset = 100;
  isManualScroll = true; // lock highlight updates
  highlightActiveTab(label); // manually set active tab now
  const rect = targetEl.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY - offset;
  // Smooth scroll
  window.scrollTo({
    top: absoluteTop,
    behavior: 'smooth',
  });
  // Poll scroll position until target reached (instead of fixed timeout)
  const scrollCheck = setInterval(() => {
    const distance = Math.abs(window.scrollY - absoluteTop);
    // When we’re within ~2px of target → scrolling finished
    if (distance < 2) {
      clearInterval(scrollCheck);
      setTimeout(() => {
        isManualScroll = false; // re-enable automatic highlighting
      }, 150);
    }
  }, 50);
}

export default async function decorate(block) {
  block.classList.add('bg-white');
  block.parentElement.parentElement.style.padding = '0px';

  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const tabsList = [];
  const authoredBlocks = document.querySelectorAll('.tab-authored');

  // Collect authored labels indexed by type
  const authoredTabMap = {};
  authoredBlocks.forEach((authoredBlock) => {
    const type = authoredBlock?.querySelector('.authored-tab-type')?.textContent?.trim();
    const titleEl = authoredBlock?.querySelector('.authored-tab-title');
    const authoredLabel = titleEl?.textContent.trim();
    if (type) {
      authoredTabMap[type] = authoredLabel;
    }
  });
  // Full map of static label to section ID/type
  const fullTabConfig = {
    overview: { label: 'Description', available: !!response?.raw?.richlongdescription?.trim() || ('overview' in authoredTabMap) },
    specifications: { label: 'Specifications', available: (!!response?.raw?.attributejson?.trim() && JSON.parse(response.raw.attributejson).length > 0) || ('specifications' in authoredTabMap) },
    products: { label: 'Products', available: response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0 && !(response?.raw?.familyskusizeflag?.includes('True|') || false) },
    resources: { label: 'Resources', available: !!response?.raw?.numresources > 0 },
    parts: { label: 'Product Parts List', available: (!!response?.raw?.bundlepreviewjson?.trim() && JSON.parse(response?.raw?.bundlepreviewjson).length > 0) || ('parts' in authoredTabMap) },
    citations: { label: 'Citations', available: !!response?.raw?.citations?.trim() || ('citations' in authoredTabMap) },
    faqs: {
      label: 'FAQs',
      available: (() => {
        try {
          const arr = JSON.parse(response?.raw?.faqpreviewjson || '[]');
          return (Array.isArray(arr) && arr.length > 0) || ('faqs' in authoredTabMap);
        } catch {
          return 'faqs' in authoredTabMap;
        }
      })() || false,
    },
    relatedproducts: { label: 'Related Products', available: JSON.parse(response?.raw?.associatedfamilys)?.length > 0 || ('relatedproducts' in authoredTabMap) },
  };

  // -------------- Generate tabsList in JSON order --------------
  const opco = response?.raw?.opco?.toLowerCase() || 'sciex';
  const opcoTabs = tabsOrder()[opco] || tabsOrder().sciex;
  opcoTabs.forEach(({ tabName }) => {
    const config = fullTabConfig[tabName];
    if (config?.available) {
      const label = authoredTabMap[tabName] || config.label || tabName;
      tabsList.push({ label, selector: `${tabName}-tab` });
    }
  });

  // Build dynamic map for scrolling logic
  dynamicTabMap = Object.fromEntries(tabsList.map((t) => [t.label, t.selector]));

  // ---------------- UI build ----------------
  const tabsDiv = div({
    class:
      'tabs-parent flex flex-row md:flex-col overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  });

  tabsList?.forEach((tab, index) => {
    tabsDiv.append(
      div(
        {
          class:
            'shrink-0 px-6 py-4 md:relative flex flex-col-reverse md:flex-row justify-start items-center gap-3',
        },
        div({
          class: `${
            index === 0 ? 'bg-danaherpurple-500 rounded-[5px]' : ''
          } w-12 h-1 md:w-1 md:h-12 md:left-0 md:top-[2px] md:absolute`,
        }),
        h2(
          {
            class: `p-tab m-0 !text-base ${
              index === 0
                ? 'text-danaherpurple-500 font-bold'
                : 'text-black font-medium'
            } text-base cursor-pointer`,
            onclick: updatePageTabs,
          },
          tab.label,
        ),
      ),
    );
  });

  const pageTabsSuperParent = div(
    { class: 'super-parent md:w-48 overflow-x-auto' },
    tabsDiv,
  );
  block.append(pageTabsSuperParent);

  // Activate scroll-based highlight
  window.addEventListener('scroll', () => highlightActiveTab());
}
