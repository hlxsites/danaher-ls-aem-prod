import { button, div } from '../../scripts/dom-builder.js';

const videoModalSelector = '.hero .video-modal';

const toggleVideoOverlay = () => {
  const modal = document.querySelector(videoModalSelector);
  if (modal?.classList.contains('hidden')) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
};

const buildVideoModal = (href) => {
  const videoClose = button({ class: 'video-modal-close', 'aria-label': 'close' });
  videoClose.addEventListener('click', toggleVideoOverlay);
  const videoContent = div({ class: 'relative h-0 overflow-hidden max-w-full' });
  videoContent.innerHTML = `<iframe src="${href}" width="1378" height="775"
    frameborder="0" allow="autoplay; fullscreen; picture-in-picture"
    title="DHLS-003_We See a Way Campaign Video_SmallSpeaker-H264_06072023_F"
    data-ready="true"></iframe>`;

  const videoContainer = div(
    { class: 'flex flex-col' },
    videoClose,
    div({ class: 'bg-transparent p-2 rounded' }, videoContent)
  );
  const videoModal = div(
    {
      class:
        'video-modal hidden fixed inset-0 bg-black/25 backdrop-brightness-50 flex item-center justify-center overflow-hidden z-50',
      'aria-modal': 'true',
      role: 'dialog',
    },
    videoContainer,
  );

  return videoModal;
};

export default function decorate(block) {
  const img = block.querySelector('img');
  const imgWrapper = img.parentElement;
  const content = block.querySelector('div > div > div:nth-child(2)');
  const contentWrapper = content.parentElement;
  const heroNumber = content.querySelector('strong');

  img.closest('div.block').prepend(img);
  imgWrapper.remove();

  // add video overlay
  const videoButton = content.querySelector('a');
  if (videoButton && videoButton.href.indexOf('player.vimeo.com/') > -1) {
    videoButton.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = block.querySelector(videoModalSelector);
      if (!modal && videoButton.href) {
        const videoModal = buildVideoModal(videoButton.href);
        block.append(videoModal);
      }
      toggleVideoOverlay();
    });
  }

  // decorate styles
  block.classList.add('relative', 'w-full');
  img.className = 'h-72 w-full md:h-full object-cover z-50';
  contentWrapper.className = 'absolute top-0 left-0 w-full';
  content.className = 'relative mx-auto max-w-7xl mt-8 md:mt-16 p-4 md:p-6 z-10';
  heroNumber.className = 'mb-1 lg:mb-8 font-normal text-6xl lg:text-[11rem] leading-none font-fort';
  videoButton.className =
    'btn bg-transparent rounded-lg md:px-8 border border-purple-200 hover:text-white hover:bg-purple-200 text-purple-200 md:btn-lg';
}
