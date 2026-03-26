import Carousel from '../../scripts/carousel.js';
import {
  div, li, ul, a, button, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { buildItemListSchema } from '../../scripts/schema.js';

const classActive = 'active';
const danaherPurpleClass = 'bg-danaherpurple-500';
const danaherPurple50Class = 'bg-danaherpurple-800';

function toggleClass(element, className, shouldAdd) {
  element.classList.toggle(className, shouldAdd);
}

function updateTabsNav(tabsNav, idx) {
  [...tabsNav.children].forEach((nav, i) => {
    const isClicked = i === idx;
    toggleClass(nav, classActive, isClicked);
    toggleClass(nav.querySelector('a'), danaherPurpleClass, isClicked);
  });
}

function updateTabItems(items, idx) {
  [...items].forEach((item, i) => {
    const isCurrentPane = i === idx;
    toggleClass(item, classActive, isCurrentPane);
    toggleClass(item.querySelector('a'), danaherPurpleClass, isCurrentPane);
    toggleClass(item.querySelector('a'), danaherPurple50Class, !isCurrentPane);
  });
}

function updatePanes(panes, idx) {
  [...panes].forEach((pane, i) => {
    const isCurrentPane = i === idx;
    toggleClass(pane, classActive, isCurrentPane);
    toggleClass(pane, 'off-screen', !isCurrentPane);
  });
}

function buildNav(tabNames, block) {
  const navList = ul({ class: 'tabs-nav flex justify-start flex flex-wrap gap-x-2 !ml-0' });

  tabNames.forEach((name, idx) => {
    const listItem = li(
      {
        class: 'tabs-nav-item h-max inline-flex items-center justify-center cursor-pointer overflow-hidden capitalize group !mt-0',
        onclick: (e) => {
          e.preventDefault();
          const tabsNav = e.target.closest('.tabs-nav');
          const items = tabsNav.querySelectorAll('.tabs-nav-item');
          const panes = block.querySelectorAll('.tab-pane');
          updateTabsNav(tabsNav, idx);
          updateTabItems(items, idx);
          updatePanes(panes, idx);
        },
        'aria-label': name,
      },
      a(
        { class: `${idx === 0 ? `${danaherPurpleClass} text-white` : `${danaherPurple50Class} text-white`} px-4 py-1 flex flex-col items-center justify-center w-full h-full hover:bg-danaherpurple-500 hover:text-white border border-solid border-gray-300 rounded-full shadow-md` },
        span({ class: 'text-xs font-medium leading-5' }, name),
      ),
    );
    navList.append(listItem);
  });

  navList.querySelector('li')?.classList.add(classActive);
  return div({ class: 'w-full md:w-2/5' }, navList);
}

function buildCarouselCard(cardCell, eleIndex) {
  const cardImage = cardCell.querySelector('picture');
  const link = cardCell.querySelector('p > a');
  if (!cardImage || !link) return null;

  const cardContent = div({ class: 'h-full flex flex-col p-4' });

  /* p:not(strong) ~ p selects the first p following any p = the category paragraph */
  const categoryPara = cardCell.querySelector('p:not(strong) ~ p');
  cardImage.querySelector('img').classList.add(...'flex-shrink-0 w-full h-36 object-cover rounded-sm'.split(' '));
  if (categoryPara) {
    categoryPara.classList.add(...'mt-2 mb-1 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
    if (categoryPara.children[0]) {
      categoryPara.children[0].classList.add(...'text-base text-gray-400 group-hover:font-bold group-hover:underline'.split(' '));
    }
  }
  link.classList.add(...'w-full flex-initial flex flex-row gap-1 items-center text-base text-danaherblue-600 font-semibold mt-auto'.split(' '));
  link.append(span({ class: 'icon icon-icon-arrow-right' }));

  if (categoryPara) cardContent.append(categoryPara);

  /* After categoryPara is moved, p ~ p now refers to the title paragraph */
  const titlePara = cardCell.querySelector('p ~ p');
  if (titlePara) {
    titlePara.classList.add(...'text-lg font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4 mb-3'.split(' '));
    cardContent.append(titlePara);
  }

  const linkPara = link.closest('p');
  if (linkPara) cardContent.append(linkPara);

  const anchor = a({
    class: 'card carousel-slider flex snap-start list-none bg-white flex-col rounded-md h-full mx-px relative flex flex-col border cursor-pointer shadow-md hover:shadow-lg rounded-md overflow-hidden group',
    'data-carousel-item': eleIndex,
    href: link?.href,
  });

  const imagePara = cardCell.querySelector('p');
  anchor.append(imagePara || cardImage, cardContent);
  return anchor;
}

function buildCarouselPane(tab, paneIndex) {
  const uuid = crypto.randomUUID().substring(0, 6);
  const isActive = paneIndex === 0;

  const carousel = div(
    { class: 'carousel grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 rounded-md scroll-smooth auto-cols-[calc(100%)] md:auto-cols-[calc((100%/2)-20px)] lg:auto-cols-[calc((100%/3)-20px)] pb-2' },
    ...tab.cards.map((cardCell, eleIndex) => buildCarouselCard(cardCell, eleIndex)).filter(Boolean),
  );

  const viewAllLink = tab.viewAllLink ? tab.viewAllLink.cloneNode(true) : null;
  if (viewAllLink) {
    viewAllLink.classList.add(...'flex h-full items-center gap-1 mr-2 text-sm text-danaherblue-600 font-semibold break-words'.split(' '));
    viewAllLink.append(span({ class: 'icon icon-icon-arrow-right' }));
  }

  const carouselActions = div(
    { class: 'flex justify-between items-center' },
    div(
      { class: 'inline-flex gap-x-4' },
      button({ type: 'button', 'aria-label': 'previous-workflow-carousel', id: `previous-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-left' })),
      button({ type: 'button', 'aria-label': 'next-workflow-carousel', id: `next-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-right' })),
    ),
    viewAllLink || div(),
  );

  const carouselWrapper = div({ id: uuid, class: 'carousel-wrapper flex flex-col gap-3 mt-4' });
  carouselWrapper.append(carouselActions, carousel);

  const pane = div({ class: `tab-pane${isActive ? ` ${classActive}` : ' off-screen'}` });
  pane.append(carouselWrapper);

  decorateIcons(carouselWrapper);

  setTimeout(() => {
    /* eslint-disable no-new */
    new Carousel({
      wrapperEl: uuid,
      mainEl: '.carousel',
      delay: 2000,
      isAutoPlay: false,
      previousElAction: `button#previous-${uuid}-workflow`,
      nextElAction: `button#next-${uuid}-workflow`,
    });
  }, 3000);

  return pane;
}

/**
 * Parse block rows into tab groups.
 * A row whose first cell has text starts a new tab; a row with an empty first cell
 * adds a carousel card to the current tab.
 */
function parseTabs(block) {
  const tabs = [];
  let currentTab = null;

  [...block.children].forEach((row) => {
    const [firstCell, secondCell] = row.children;
    const tabName = firstCell?.textContent?.trim();

    if (tabName) {
      const viewAllLink = secondCell?.querySelector('a') || null;
      currentTab = {
        name: tabName,
        viewAllLink: viewAllLink ? viewAllLink.cloneNode(true) : null,
        cards: [],
      };
      tabs.push(currentTab);
    } else if (currentTab && secondCell) {
      currentTab.cards.push(secondCell);
    }
  });

  return tabs;
}

export default function decorate(block) {
  const tabs = parseTabs(block);

  /* Build SEO ItemList schema from all carousel cards across all tabs */
  const allCards = tabs.flatMap((t) => t.cards);
  if (allCards.length > 0) {
    buildItemListSchema(allCards, 'workflow');
  }

  const nav = buildNav(tabs.map((t) => t.name), block);
  const tabsList = div({ class: 'tabs-list' });

  tabs.forEach((tab, idx) => {
    tabsList.append(buildCarouselPane(tab, idx));
  });

  block.innerHTML = '';
  block.append(nav, tabsList);
  block.classList.add(...'flex flex-col w-full mx-auto max-w-7xl'.split(' '));
}
