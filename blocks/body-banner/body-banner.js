import {
  div, p, h2, img, a, section,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const [
    bodyBannerTitle,
    bodyBannerHeading,
    bodyBannerSubHeading,
    bodyBannerDescription,
    bodyBannerImage,
    bodyBannerLink,
    bodyBannerLinkTarget,
    bodyBannerLinkLabel,
    bodyBannerBg,
  ] = block.children;
  const title1 = bodyBannerTitle?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const title2 = bodyBannerHeading?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const title3 = bodyBannerSubHeading?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const descriptionHTML = bodyBannerDescription?.innerHTML || '';
  const imgEl = bodyBannerImage?.querySelector('img');
  const ctaLink = bodyBannerLink?.textContent.trim() || '#';
  const newTab = bodyBannerLinkTarget?.textContent?.trim();
  const ctaText = bodyBannerLinkLabel?.textContent?.trim() || '';
  const rightColor = bodyBannerBg?.textContent.trim().replace(/<[^>]*>/g, '') || '#660099';

  const imgSrc = imgEl?.getAttribute('src') || '';
  const imgAlt = imgEl?.getAttribute('alt') || title1;

  const bannerSection = section({
    class:
      'flex flex-col md:flex-row  items-stretch  dhls-container px-5 lg:px-10 dhlsBp:p-0  w-full overflow-hidden',
  });

  // === Left Image Section ===
  const leftSection = div(
    {
      class: 'flex md:w-1/2 flex-col items-start',
    },
    div(
      {
        class: 'flex items-center justify-center h-full w-full',
      },
      img({
        src: imgSrc || '/content/dam/danaher/products/fallbackImage.jpeg',
        alt: imgAlt,
        class: 'w-full h-full object-contain',
      }),
    ),
  );

  // === Right Text Section ===
  const rightSection = div(
    {
      class: 'flex md:w-1/2 justify-center items-center p-8 min-h-[413px]',
      style: `background-color: ${rightColor};`,
    },
    div(
      {
        class: 'flex flex-col gap-4',
      },
      p(
        {
          class: `text-white text-lg font-medium px-0 m-0 flex justify-left items-center ${
            title1 ? '' : 'hidden'
          }`,
        },
        title1,
      ),

      h2(
        {
          class: `text-white ${
            title2 ? '' : 'hidden'
          } !text-2xl leading-loose !font-medium m-0`,
        },
        title2,
      ),

      p(
        {
          class: `text-white  ${
            title3 ? '' : 'hidden'
          } text-base font-semibold leading-snug`,
        },
        title3,
      ),

      div({
        id: 'bodyBannerDescription',
        class: 'body-banner-description text-white text-base leading-snug ',
      }),
      a(
        {
          href: ctaLink,
          target: newTab === 'true' ? '_blank' : '_self',
          class: `flex justify-center ${
            ctaText ? '' : 'hidden'
          } items-center px-[25px] py-[13px] bg-white text-danaherpurple-500 rounded-full text-base font-semibold hover:bg-danaherpurple-500 hover:text-white transition duration-300 self-start`,
        },
        ctaText,
      ),
    ),
  );
  rightSection
    ?.querySelector('#bodyBannerDescription')
    ?.insertAdjacentHTML('beforeend', descriptionHTML);
  const descriptionLinks = rightSection
    ?.querySelector('#bodyBannerDescription')
    ?.querySelectorAll('a');
  descriptionLinks?.forEach((link) => {
    link.classList.add(
      'underline',
      'decoration-danaherpurple-500',
      'hover:bg-danaherpurple-500',
      'hover:text-white',
    );
    const linkHref = link?.getAttribute('href');

    link.setAttribute('target', linkHref?.includes('http') ? '_blank' : '_self');
  });
  bannerSection.append(leftSection, rightSection);
  block.innerHTML = '';
  block.appendChild(bannerSection);
}
