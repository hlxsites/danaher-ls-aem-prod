// import { loadScript } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const rows = block.querySelectorAll('tr');
  const config = {};
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length === 2) {
      config[cells[0].textContent.trim()] = cells[1].textContent.trim();
    }
  });

  const tileSrc = config['tile-src'];

  if (tileSrc) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div style="position:relative;width: 100%;padding-top:56.25%;">
      <iframe src="${tileSrc}" frameborder="0" allowfullscreen style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0;"></iframe>
    </div>`;
    block.innerHTML = '';
    block.append(wrapper);
  } else {
    block.textContent = 'Tiled Viewer configuration is missing.';
  }

  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.paddingTop = '56.25%';

  const iframe = document.createElement('iframe');
  iframe.src = config['tile-src'];
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';

  container.appendChild(iframe);
  block.innerHTML = '';
  block.appendChild(container);
}
