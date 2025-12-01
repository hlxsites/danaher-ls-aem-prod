import {
  div, a, form, button, p, ul, li, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { getAuthenticationToken, triggerLogin } from '../../scripts/token-utils.js';
import { getAuth0UserProfile } from '../../scripts/commerce.js';
import { checkoutSkeleton, defaultCountryStateSelectBox } from '../../scripts/cart-checkout-utils.js';
import {
  // eslint-disable-next-line max-len
  buildInputElement, removePreLoader, showNotification, showPreLoader, submitForm, countriesArray, getCountryNameByIsoCode,
} from '../../scripts/common-utils.js';

// eslint-disable-next-line consistent-return
export default async function decorate(block) {
  block.append(checkoutSkeleton());
  block?.querySelector('#checkoutSkeleton')?.classList?.add('dhls-container', '!mt-0');
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken || authenticationToken?.user_type === 'guest') {
    triggerLogin();
    // window.location.href = window.EbuyConfig?.loginPageUrl;
    return { status: 'error', data: 'Unauthorized access.' };
  }
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full !mt-0  dhls-container dhlsBp:py-12',
  });
  const myProfileWrapper = div({
    class:
      'w-full md:w-[70%] self-stretch inline-flex flex-col justify-start items-start gap-5 md:p-0 p-4',
  });
  const profileWrapper = div({
    class:
      'w-full md:ml-[20px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center',
    id: 'profileWrapper',
  });
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper?.append(dashboardSideBarContent);
  const profileTitleDiv = div(
    {
      class: 'self-stretch p-6 flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class:
          'self-stretch justify-start text-black text-3xl font-normal leading-10',
      },
      'My Profile',
    ),
    div(
      {
        class:
          'self-stretch justify-start text-black text-base font-extralight leading-snug',
      },
      'Welcome to your profile—everything you need to manage your account is right here',
    ),
  );
  myProfileWrapper.append(profileTitleDiv);
  const auth0Profile = await getAuth0UserProfile();
  const profileData = auth0Profile?.data;

  const profileForm = div(
    {
      id: 'userProfileFormWrapper',
      class: 'self-stretch flex flex-col justify-start items-start gap-6 w-full max-w-72 hidden',
    },
    form(
      {
        id: 'userProfileForm',
        class: 'user-profile-form flex gap-4 w-full',
      },
      div(
        {
          class:
            'w-1/2 self-stretch flex flex-col justify-start items-start gap-3',
        },
        buildInputElement(
          'given_name',
          'First Name',
          'text',
          'given_name',
          false,
          false,
          'given_name',
          profileData?.given_name || '',
        ),
        buildInputElement(
          'family_name',
          'Last Name',
          'text',
          'family_name',
          false,
          false,
          'family_name',
          profileData?.family_name || '',
        ),
        buildInputElement(
          'email',
          'Email',
          'text',
          'email',
          false,
          false,
          'email',
          profileData?.email || '',
        ),
        buildInputElement(
          'phone_number',
          'Contact Number',
          'text',
          'phone_number',
          false,
          false,
          'phone_number',
          profileData?.user_metadata?.phone_number || '',
        ),
      ),
      div(
        {
          class: 'self-stretch flex flex-col justify-start items-start gap-3 w-1/2',
        },
        defaultCountryStateSelectBox(
          'country',
          'Country / Region',
          'country',
          true,
          'country',
          countriesArray(),
          profileData?.user_metadata?.country ?? '',
          profileData?.user_metadata?.country || '',
        ),
        buildInputElement(
          'org',
          'org',
          'text',
          'org',
          false,
          false,
          'org',
          profileData?.user_metadata?.org || '',
        ),
        buildInputElement(
          'title',
          'Title',
          'text',
          'title',
          false,
          false,
          'title',
          profileData?.user_metadata?.title || '',
        ),
      ),
    ),
    div(
      {
        class: 'flex justify-start items-start justify-between w-full gap-6',
      },
      button(
        {
          id: 'saveProfileChanges',
          class: 'text-xl w-1/2 border-danaherblue-500 !mt-0 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'Save Changes',
      ),
      button(
        {
          id: 'cancelProfileChanges',
          class: 'w-1/2 hover:text-white hover:bg-danaherpurple-500 text-xl !mt-0 border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6',
        },
        'Cancel',
      ),
    ),
  );
  profileForm?.querySelector('#userProfileForm')?.querySelectorAll('label')?.forEach((labe) => {
    if (labe?.classList?.contains('pl-4')) {
      labe?.classList?.remove('pl-4');
    }
  });
  profileForm?.querySelector('#userProfileForm')?.querySelectorAll('input')?.forEach((inp) => {
    inp.className = 'input-focus  left-0 text-base w-full block  border border-solid border-gray-600 peer px-3 py-2 text-black font-bold leading-snug';
    if (inp?.id === 'email') {
      inp.setAttribute('readonly', true);
      inp?.classList?.add('pointer-events-none', 'bg-gray-100');
    }
  });
  profileForm?.querySelector('#userProfileForm')?.querySelectorAll('select')?.forEach((sel) => {
    sel.className = 'input-focus  left-0 text-base w-full block  border border-solid border-gray-600 peer px-3 py-2 text-black font-bold leading-snug';
    if (sel?.parentElement?.classList?.contains('mt-4')) sel?.parentElement?.classList?.remove('mt-4');
  });

  const passwordWrapper = div(
    {
      id: 'passwordWrapper',
      class: 'flex w-full flex-col gap-3 hidden',
    },

    form(
      {
        id: 'userPasswordForm',
        class: 'user-password-form flex flex-col gap-4 w-full',
      },
      buildInputElement(
        'password',
        'Password',
        'password',
        'password',
        false,
        true,
        'password',
        '',
      ),
      buildInputElement(
        'confirmPassword',
        'Confirm Password',
        'password',
        'confirmPassword',
        false,
        true,
        'confirmPassword',
        '',
      ),
    ),
    div(
      { class: 'flex flex-col gap-2 password-validation-show' },
      div(
        {
          class: '',
          id: 'messageBox',
        },
      ),
      p({ class: 'font-semibold' }, 'Password must contain all of the following:'),
      ul(
        {
          class: 'font-extralight text-gray-500 font-serif',
        },
        li(
          {
            id: 'passMaxLength',
            class: 'text-base flex items-center gap-3',
          },
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at most 50 characters',
          ),
        ),
        li(
          {
            id: 'passMinLength',
            class: 'text-base flex items-center gap-3',
          },
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at least 10 characters',
          ),
        ),
        li(
          {
            id: 'passUppercase',
            class: 'text-base flex items-center gap-3',
          },
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at least one uppercase letter',
          ),
        ),
        li(
          {
            id: 'passLowercase',
            class: 'text-base flex items-center gap-3',
          },

          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at least one lowercase letter',
          ),
        ),
        li(
          {
            id: 'passNumber',
            class: 'text-base flex items-center gap-3',
          },

          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at least one number',
          ),
        ),
        li(
          {
            id: 'passSpecial',
            class: 'text-base flex items-center gap-3',
          },

          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-50 icon-failed',
            },
          ),
          span(
            {
              class: 'icon icon-check-circle !w-[24px] !h-[24px] [&_svg>use]:stroke-danaherpurple-500 icon-passed hidden',
            },
          ),
          span(
            {
              class: 'rule-text text-gray-700',
            },
            'at least one special character',
          ),
        ),
      ),
      div(
        {
          class: 'flex justify-start items-start justify-between w-full gap-6 mt-4',
        },
        button(
          {
            id: 'savePasswordChanges',
            class: 'text-xl w-1/2 border-danaherblue-500 !mt-0 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6 pointer-events-none',
          },
          'Update Password',
        ),
        button(
          {
            id: 'cancelPasswordChanges',
            class: 'w-1/2 hover:text-white hover:bg-danaherpurple-500 text-xl !mt-0 border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6',
          },
          'Cancel',
        ),
      ),
    ),
  );
  decorateIcons(passwordWrapper);
  passwordWrapper?.querySelectorAll('label')?.forEach((labe) => {
    if (labe?.classList?.contains('pl-4')) {
      labe?.classList?.remove('pl-4');
    }
  });
  passwordWrapper?.querySelectorAll('input')?.forEach((inp) => {
    inp.className = 'input-focus  left-0 text-base w-full block  border border-solid border-gray-600 peer px-3 py-2 text-black font-bold leading-snug';
  });
  const passwordInput = passwordWrapper.querySelector('#password');
  const confirmPasswordInput = passwordWrapper.querySelector('#confirmPassword');
  const rules = {
    passMinLength: passwordWrapper.querySelector('#passMinLength'),
    passMaxLength: passwordWrapper.querySelector('#passMaxLength'),
    passUppercase: passwordWrapper.querySelector('#passUppercase'),
    passLowercase: passwordWrapper.querySelector('#passLowercase'),
    passNumber: passwordWrapper.querySelector('#passNumber'),
    passSpecial: passwordWrapper.querySelector('#passSpecial'),
  };

  passwordInput.addEventListener('keyup', () => {
    const pwd = passwordInput.value;
    const checks = {
      passMinLength: pwd.length >= 10,
      passMaxLength: pwd.length >= 10 && pwd.length <= 50,
      passUppercase: /[A-Z]/.test(pwd),
      passLowercase: /[a-z]/.test(pwd),
      passNumber: /[0-9]/.test(pwd),
      passSpecial: /[^A-Za-z0-9]/.test(pwd),
    };

    Object.entries(checks).forEach(([key, passed]) => {
      const rule = rules[key];
      if (rule?.querySelector('.rule-text')) {
        rule.querySelector('.rule-text').textContent = `${rule.textContent}`;
        // eslint-disable-next-line no-unused-expressions
        if (passed) {
          if (passwordWrapper?.querySelector('#savePasswordChanges')?.classList?.contains('pointer-events-none')) {
            passwordWrapper?.querySelector('#savePasswordChanges')?.classList?.remove('pointer-events-none');
          }
          rule?.querySelector('.rule-text')?.classList?.add('text-black');
          if (rule?.querySelector('.rule-text')?.classList?.contains('text-gray-700')) {
            rule?.querySelector('.rule-text')?.classList?.toggle('text-gray-700');
          }
          rule?.querySelector('.icon-failed')?.classList?.add('hidden');
          if (rule?.querySelector('.icon-passed')?.classList?.contains('hidden')) {
            rule?.querySelector('.icon-passed')?.classList?.toggle('hidden');
          }
        } else {
          passwordWrapper?.querySelector('#savePasswordChanges')?.classList?.add('pointer-events-none');
          rule?.querySelector('.rule-text')?.classList?.add('text-gray-700');
          if (rule?.querySelector('.rule-text')?.classList?.contains('text-black')) {
            rule?.querySelector('.rule-text')?.classList?.toggle('text-black');
          }
          rule?.querySelector('.icon-passed')?.classList?.add('hidden');
          if (rule?.querySelector('.icon-failed')?.classList?.contains('hidden')) {
            rule?.querySelector('.icon-failed')?.classList?.toggle('hidden');
          }
        }
      }
    });
  });
  passwordWrapper?.querySelector('#savePasswordChanges')?.addEventListener('click', async () => {
    if (passwordInput?.value !== confirmPasswordInput?.value) {
      const passwordMissMatch = p(
        {
          class: 'text-red-500 text-base',
        },
        'Password and confirm password not same.',
      );
      passwordWrapper?.querySelector('#messageBox')?.append(passwordMissMatch);
      setTimeout(() => {
        passwordWrapper?.querySelector('#messageBox')?.querySelector('p')?.remove();
      }, 3000);
    } else {
      showPreLoader();
      const passwordObject = {
        password: passwordInput?.value,
      };
      const updatePasswordResponse = await submitForm(
        'userProfileForm',
        'auth0profile',
        'POST',
        passwordObject,
      );
      removePreLoader();
      const passwordToggle = document?.querySelector('#changePasswordToggle');
      const passwordFieldsWrapper = document?.querySelector('#passwordWrapper');
      if (updatePasswordResponse?.status === 'success' && !updatePasswordResponse?.data?.error) {
        passwordToggle?.classList?.toggle('hidden');
        passwordFieldsWrapper?.classList?.toggle('hidden');
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        showNotification('Profile updated successfully.', 'success');
      } else {
        showNotification(updatePasswordResponse?.data?.message, 'error');
      }
    }
  });
  const profileContainer = div(
    {
      id: 'userProfileWrapper',
      class: 'self-stretch px-5 py-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-6',
    },
    div(
      {
        class:
          'self-stretch flex flex-col justify-start items-start gap-6',
      },
      div(
        {
          class:
            'self-stretch bg-white flex flex-col justify-start items-start gap-6',
        },
        div(
          {
            class:
              'self-stretch h-10 border-b-2 border-dashed flex flex-col justify-start items-start gap-2.5',
          },
          div(
            {
              class: 'self-stretch inline-flex justify-start items-start gap-5',
            },
            div(
              {
                class:
                  'justify-start text-black text-xl font-extralight leading-relaxed',
              },
              'Account Information',
            ),
          ),
        ),
        div(
          {
            id: 'userProfileContainer',
            class: 'self-stretch flex justify-start items-start gap-3',
          },
          div(
            {
              class:
                'w-72 self-stretch flex flex-col justify-start items-start gap-3',
            },
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'First Name',
              ),
              div(
                {
                  id: 'user_given_name',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.given_name,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Last Name',
              ),
              div(
                {
                  id: 'user_family_name',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.family_name,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Email',
              ),
              div(
                {
                  id: 'user_email',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.email,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Contact Number',
              ),
              div(
                {
                  id: 'user_phone_number',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.user_metadata?.phone_number || 'N/A',
              ),
            ),
          ),
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-start gap-3',
            },
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Country/Region',
              ),
              div(
                {
                  id: 'user_country',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                getCountryNameByIsoCode(profileData?.user_metadata?.country),
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Organization',
              ),
              div(
                {
                  id: 'user_org',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.user_metadata?.org,
              ),
            ),
            div(
              {
                class: 'self-stretch flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-sm font-normal leading-tight',
                },
                'Title',
              ),
              div(
                {
                  id: 'user_title',
                  class:
                    'self-stretch justify-start text-black text-base font-bold leading-snug',
                },
                profileData?.user_metadata?.title || 'N/A',
              ),
            ),
          ),
        ),
        profileForm,
        a(
          {
            id: 'editProfileButton',
            class:
              'justify-start text-danaherpurple-500 text-base font-bold leading-snug cursor-pointer',
          },
          'Edit Profile',
        ),
        div(
          {
            class:
              'self-stretch h-10 border-b-2 border-dashed border-gray-300 flex flex-col justify-start items-start gap-2.5',
          },
          div(
            {
              class: 'self-stretch inline-flex justify-start items-start gap-5',
            },
            div(
              {
                class:
                  'justify-start text-black text-xl font-extralight leading-relaxed',
              },
              'Password and Security',
            ),
          ),
        ),
        passwordWrapper,
        div(
          {
            id: 'changePasswordToggle',
            class: 'inline-flex justify-start items-start gap-6',
          },
          div(
            {
              class: 'flex justify-start items-start gap-2',
            },
            a(
              {
                id: 'changePasswordToggleButton',
                class:
                  'justify-start text-danaherpurple-500 text-base font-bold leading-snug cursor-pointer',
              },
              'Change Password',
            ),
          ),
        ),
        div({
          class: 'self-stretch h-px border-b-2 border-dashed border-gray-300',
        }),
      ),
    ),
  );
  profileContainer?.addEventListener('click', async (e) => {
    e.preventDefault();
    const userProfileContainer = profileContainer?.querySelector('#userProfileContainer');
    const userProfileFormWrapper = profileContainer?.querySelector('#userProfileFormWrapper');
    const editProfileButton = profileContainer?.querySelector('#editProfileButton');
    if (e.target?.id === 'editProfileButton' || e.target?.id === 'cancelProfileChanges') {
      userProfileContainer?.classList?.toggle('hidden');
      userProfileFormWrapper?.classList?.toggle('hidden');
      editProfileButton?.classList?.toggle('hidden');
    }
    if (e.target?.id === 'saveProfileChanges') {
      showPreLoader();
      const getProfileForm = profileContainer?.querySelector('#userProfileForm');
      const formData = new FormData(getProfileForm);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      Object.assign(formObject, {
        name: `${formObject.given_name} ${formObject.family_name}`,
        user_metadata: {
          country: formObject.country,
          org: formObject.org,
          phone_number: formObject.phone_number,
          title: formObject.title,
        },
      });
      delete formObject.country;
      delete formObject.org;
      delete formObject.phone_number;
      delete formObject.title;

      const saveChangesResponse = await submitForm(
        'userProfileForm',
        'auth0profile',
        'POST',
        formObject,
      );
      if (saveChangesResponse?.status === 'success') {
        showNotification('Profile updated successfully.', 'success');
        const userGivenName = profileContainer?.querySelector('#user_given_name');
        const userFamilyName = profileContainer?.querySelector('#user_family_name');
        const userEmail = profileContainer?.querySelector('#user_email');
        const userPhoneNumber = profileContainer?.querySelector('#user_phone_number');
        const userOrg = profileContainer?.querySelector('#user_org');
        const userTitle = profileContainer?.querySelector('#user_title');
        const userCountry = profileContainer?.querySelector('#user_country');
        if (userGivenName) {
          userGivenName.textContent = saveChangesResponse?.data?.given_name;
        }
        if (userFamilyName) {
          userFamilyName.textContent = saveChangesResponse?.data?.family_name;
        }
        if (userEmail) {
          userEmail.textContent = saveChangesResponse?.data?.email;
        }
        if (userPhoneNumber) {
          userPhoneNumber.textContent = saveChangesResponse?.data?.user_metadata?.phone_number;
        }
        if (userOrg) {
          userOrg.textContent = saveChangesResponse?.data?.user_metadata?.org;
        }
        if (userTitle) {
          userTitle.textContent = saveChangesResponse?.data?.user_metadata?.title;
        }
        if (userCountry) {
          // eslint-disable-next-line max-len
          userCountry.textContent = getCountryNameByIsoCode(saveChangesResponse?.data?.user_metadata?.country);
        }
        userProfileContainer?.classList?.toggle('hidden');
        userProfileFormWrapper?.classList?.toggle('hidden');
        editProfileButton?.classList?.toggle('hidden');
      } else {
        showNotification('Issue updating profile.', 'error');
      }
      removePreLoader();
    }
    if (e.target?.id === 'changePasswordToggleButton' || e.target?.id === 'cancelPasswordChanges') {
      const passwordToggle = profileContainer?.querySelector('#changePasswordToggle');
      const passwordFieldsWrapper = profileContainer?.querySelector('#passwordWrapper');
      passwordToggle?.classList?.toggle('hidden');
      passwordFieldsWrapper?.classList?.toggle('hidden');
      passwordFieldsWrapper?.querySelectorAll('.rule-text')?.forEach((rt) => {
        if (rt?.classList?.contains('text-black')) {
          rt?.classList?.remove('text-black');
        }
      });
      passwordFieldsWrapper?.querySelectorAll('.icon-passed')?.forEach((rp) => {
        rp?.classList?.add('hidden');
      });
      passwordFieldsWrapper?.querySelectorAll('.icon-failed')?.forEach((rf) => {
        if (rf?.classList?.contains('hidden')) {
          rf?.classList?.remove('hidden');
        }
      });
      if (passwordInput && confirmPasswordInput) {
        passwordInput.value = '';
        confirmPasswordInput.value = '';
      }
    }
  });
  profileWrapper.append(profileContainer);
  myProfileWrapper.append(profileWrapper);
  wrapper.append(myProfileWrapper);
  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
}
