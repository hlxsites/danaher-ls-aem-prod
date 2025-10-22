import {
  div, h1, p, span, a,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import recentOrders from './recentOrder.js';
import { orderDetails, requestedQuotes } from './dashboardutils.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { checkoutSkeleton, miniSkeleton } from '../../scripts/cart-checkout-utils.js';

// eslint-disable-next-line
export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const dashboardSideBarContent = await dashboardSidebar();
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row !mt-0 dhls-container dhlsBp:py-12 md:pb-0 pb-[7px]',
  });
  const dashboardTitle = 'Dashboard';
  const contentWrapper = div({
    class: 'w-full md:w-[70%] self-stretch inline-flex flex-col justify-start items-start gap-5',
  });
  const content = div(
    {
      id: 'dashboardContent',
      class: 'flex p-6 pt-0 w-full flex-col gap-5 md:w-[80%]',
    },
    h1(
      {
        class: 'p-0 m-0',
      },
      dashboardTitle ?? '',
    ),
    div(
      {
        id: 'dashboardContentWrapper',
        class: 'flex md:flex-row flex-col gap-5',
      },
    ),
  );
  contentWrapper.append(content);
  wrapper.append(dashboardSideBarContent);
  const openOrdersWrapper = a(
    {
      class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
      href: window.EbuyConfig?.orderStatusPageUrl,
    },
    span({
      class:
        'icon icon-shopping-cart [&_svg>use]:stroke-danaherpurple-500  bg-danaherpurple-25  rounded-full !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
    }),
    div(
      {
        class: 'flex flex-col',
      },
      p(
        {
          id: 'openOrdersCount',
          class: 'text-black !text-4xl font-medium leading-[48px]',
        },
        miniSkeleton(),
      ),
      p(
        {
          class: 'w-[178px] text-black',
        },
        'Open Order',
      ),
    ),
  );
  const shippedOrdersWrapper = a(
    {
      class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
      href: window.EbuyConfig?.orderStatusPageUrl,
    },
    span({
      class:
        'icon icon-shopping-cart [&_svg>use]:stroke-danaherpurple-500  bg-danaherpurple-25  rounded-full !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
    }),
    div(
      {
        class: 'flex flex-col',
      },
      p(
        {
          id: 'shippedOrdersCount',
          class: 'text-black !text-4xl font-medium leading-[48px]',
        },
        miniSkeleton(),
      ),
      p(
        {
          class: 'w-[178px] text-black',
        },
        'Shipped Order',
      ),
    ),
  );
  const requestedQuotesCard = a(
    {
      class: 'w-[310px] h-[118px] bg-white flex gap-6 p-6  items-center justify-center ',
      href: `${window.EbuyConfig?.requestedQuotesPageUrl}`,
    },
    span({
      class:
        'icon  icon-chat [&_svg>use]:stroke-danaherpurple-500 bg-danaherpurple-25 rounded-full  !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
    }),
    div(
      {
        class: 'flex flex-col',
      },
      p(
        {
          id: 'requestedQuotesCount',
          class: 'text-black !text-4xl font-medium leading-[48px]',
        },
        miniSkeleton(),
      ),
      p(
        {
          class: 'w-[178px] text-black',
        },
        'Requested Quote Item',
      ),
    ),
  );
  content?.querySelector('#dashboardContentWrapper')?.append(requestedQuotesCard);
  content?.querySelector('#dashboardContentWrapper')?.append(openOrdersWrapper);
  content?.querySelector('#dashboardContentWrapper')?.append(shippedOrdersWrapper);

  const ordersWrapper = div(
    {
      id: 'ordersQuoyesSkeleton',
      class: 'self-stretch w-full flex md:pl-6  md:flex-row flex-col justify-start items-start gap-6',
    },
    div(
      {
        class: 'self-stretch w-full md:w-1/2 p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-4',
      },
      div(
        {
          class: 'self-stretch inline-flex flex-col justify-start gap-5',
          id: 'recentOrderWrap',
        },
        div({
          class: 'justify-start text-gray-900 text-[20px] font-medium leading-7',
        }, 'Recent Orders'),

        checkoutSkeleton(),
      ),
    ),
    div(
      {
        class: 'self-stretch w-full md:w-1/2 p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-4',
      },
      div(
        {
          class: 'self-stretch inline-flex flex-col justify-start gap-5',
          id: 'recentQuotesWrap',
        },
        div({
          class: 'justify-start text-gray-900 text-[20px] font-medium leading-7',
        }, 'Recent Requested Quotes'),
        checkoutSkeleton(),
      ),
    ),
  );
  contentWrapper.append(ordersWrapper);
  setTimeout(async () => {
    const orderDetailResponse = await orderDetails();

    const shippedItems = orderDetailResponse?.filter((item) => item.status.toLowerCase() === 'shipped');
    const excludedStatuses = ['cancelled', 'shipped'];
    const openOrder = orderDetailResponse?.filter(
      (item) => !excludedStatuses.includes(item.status.toLowerCase()),
    );
    openOrdersWrapper.querySelector('#openOrdersCount').textContent = openOrder?.length;
    shippedOrdersWrapper.querySelector('#shippedOrdersCount').textContent = shippedItems?.length;

    const requestedQuotesResponse = await requestedQuotes();
    requestedQuotesCard.querySelector('#requestedQuotesCount').textContent = requestedQuotesResponse?.length;

    contentWrapper.append(content);
    // const orderBlock = await orderStatus();
    const order = await recentOrders(orderDetailResponse, requestedQuotesResponse);
    // contentWrapper.append(orderBlock);
    contentWrapper?.querySelector('#ordersQuoyesSkeleton')?.remove();
    contentWrapper.append(order);
  }, 0);
  wrapper.append(contentWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
}
