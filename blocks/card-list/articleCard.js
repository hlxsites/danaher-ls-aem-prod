import {
  formatDateUTCSeconds,
  imageHelper,
  makePublicUrl,
} from '../../scripts/scripts.js';
import {
  li, a, p, div, time, span, h3,
} from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

const template = getMetadata('template');
let linkText = '';
switch (template) {
  case 'new-lab':
    linkText = 'Unlock All Offers';
    break;
  case 'wsaw':
    linkText = 'Learn More';
    break;
  default:
    linkText = 'Read Article';
}

export default function createCard(article, firstCard = false) {
  const cardTitle = article.title.split('| Danaher Life Sciences')[0] || article.title;

  const cardWrapper = a(
    {
      class: 'group h-full ',
      target: article.path?.includes('http') ? '_blank' : '_self',
      href: makePublicUrl(article.path),
      title: article.title,
    },
    imageHelper(
      article.image ?? '/content/dam/danaher/system/icons/preview-image.png',
      article.title,
      firstCard,
    ),
    div(
      { class: '' },
      p({ class: 'eyebrow-sm' }, article.brand || 'Danaher Corporation'),
      h3(
        {
          class:
            'text-black font-medium mb-4 mt-4 line-clamp-3 break-words !h-24',
        },
        cardTitle,
      ),
      div(
        {
          class:
            'mt-auto items-center text-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800 hover:text-danaherpurple-800 inline-flex w-full py-5 text-base text-danaherpurple-500 font-semibold',
        },
        linkText,
        span({
          class:
            'icon icon-arrow-right  dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
    ),
  );
  const showDateTime = p(
    { class: 'text-base text-gray-500 font-extralight' },
    time(
      { datetime: formatDateUTCSeconds(article.publishDate) },
      formatDateUTCSeconds(article.publishDate, { month: 'long' }),
    ),
    span({ class: 'pl-2' }, `${article.readingTime} min read`),
  );
  if (template !== 'wsaw') cardWrapper.querySelector('.eyebrow-sm')?.after(showDateTime);

  return li(
    {
      class:
        'w-full  h-full article flex flex-col col-span-1 relative mx-auto justify-center overflow-hidden bg-white transform transition duration-500 hover:scale-105',
    },
    cardWrapper,
  );
}
