import { mycart } from './mycart.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  showPreLoader();
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';
  const myCartContainer = await mycart();
  removePreLoader();
  block.append(myCartContainer);
}
