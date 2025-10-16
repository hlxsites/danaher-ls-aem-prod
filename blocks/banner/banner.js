export default function decorate(block) {
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  const innerContent = content?.querySelector('div');
  const contentH1 = innerContent?.querySelector('h1');
  const contentH2 = innerContent?.querySelector('h2');
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');
  const isLibraryPath = window.location.pathname.startsWith('/us/en/library');
  const isVideosPath = window.location.pathname.startsWith('/us/en/videos');
  const isSpecialPath = isBlogPath || isNewsPath || isLibraryPath || isVideosPath;

  if (isSpecialPath) {
    // White background styling for special paths
    content.parentNode.setAttribute('style', 'background: white');
    content.parentNode.classList.add('px-6');
    content.classList.add(
      'relative',
      'min-h-[6rem]',
      'h-max',
      'w-full',
      'flex',
      'justify-start',
      'items-center',
    );

    if (innerContent) {
      innerContent.classList.add(
        'relative',
        'max-w-7xl',
        'mx-auto',
        'w-full',
        'p-4',
        'text-black',
      );
    }

    // Handle H1 styling
    if (contentH1) {
      if (isVideosPath) {
        contentH1.style.marginTop = '2rem';
        contentH1.style.marginBottom = '1rem';
      } else {
        contentH1.style.marginBottom = '-2rem';
      }
      contentH1.style.marginLeft = '-1rem';
      contentH1.classList.add(
        '!text-4xl',
        'font-extrabold',
        'tracking-tight',
        'text-black',
      );
    }

    // Handle H2 styling
    if (contentH2) {
      if (isVideosPath) {
        contentH2.style.marginLeft = '-1rem';
      }
      contentH2.classList.add(
        'w-full',
        'md:w-3/4',
        '!text-lg',
        'font-normal',
        'tracking-tight',
        'text-black',
      );
    }

    // Remove button container if present
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.remove();
    }
  } else {
    // Purple gradient background for other paths
    content.parentNode.setAttribute(
      'style',
      'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)',
    );
    content.parentNode.classList.add('px-6');
    content.classList.add(
      'relative',
      'min-h-[13rem]',
      'h-max',
      'w-full',
      'flex',
      'justify-start',
      'items-center',
    );

    if (innerContent) {
      innerContent.classList.add(
        'relative',
        'max-w-7xl',
        'mx-auto',
        'w-full',
        'p-4',
        'text-white',
      );
    }

    if (contentH1) {
      contentH1.classList.add(
        '!text-4xl',
        'font-extrabold',
        'tracking-tight',
        'text-white',
      );
    }

    if (contentH2) {
      contentH2.classList.add(
        'w-full',
        'md:w-3/4',
        '!text-lg',
        'font-normal',
        'tracking-tight',
        'text-white',
      );
    }
  }
  main.parentNode.insertBefore(block, main);
}
