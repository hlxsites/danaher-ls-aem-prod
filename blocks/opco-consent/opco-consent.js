/* eslint-disable */
import {
  div,
  button,
  h2,
  h3,
  h4,
  span,
  p,
  label,
  input,
} from "../../scripts/dom-builder.js";

// ======================
// CONFIGURATION
// ======================

// Track initial state of subscriptions/channels
const initialSubscriptionState = {};
const markForDeleteOPCOs = []; // Track OPCOs with mail === true
const CONFIG = {
  debug: false, // Set to false in production
  allowedDomains: [
    "https://stage.lifesciences.danaher.com",
    "https://lifesciences.danaher.com",
    "http://localhost",
    "http://127.0.0.1",
  ],
};

// ======================
// SESSION TIMEOUT CONFIG
// ======================
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
let inactivityTimer = null;

let channelData = null;

// ======================
// ENVIRONMENT-SPECIFIC SUBSCRIPTION DATA
// ======================
function getSubscriptionData() {
  const isProduction = isEnvironment("production");

  if (isProduction) {
    // Production environment - only Danaher Group Companies
    return {
      subscriptions: [
        // {
        //   name: "Danaher Group Companies",
        //   logo: "/icons/danaher.png",
        //   description: "Receive marketing from Danaher Group Companies.",
        //   channels: ["email", "phone"],
        // },
      ],
    };
  } else {
    // Development environment - all subscriptions
    return {
      subscriptions: [
        // {
        //   name: "Danaher Group Companies",
        //   logo: "/icons/danaher.png",
        //   description: "Receive marketing from Danaher Group Companies.",
        //   channels: ["email", "phone"],
        // },
        {
          name: "Abcam",
          logo: "/icons/abcam.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Abcam. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "Aldevron",
          logo: "/icons/aldevron-4c.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Aldevron. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Beckman Coulter",
          logo: "/icons/beckmancoulter.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Beckman Coulter. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone"],
        },
        {
          name: "Beckman Coulter Life Sciences",
          logo: "/icons/beckmancoulterls.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Beckman Coulter Life Sciences. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone"],
        },
        {
          name: "Cepheid",
          logo: "/icons/cepheid.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Cepheid. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "Cytiva",
          logo: "/icons/cytiva.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Cytiva. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Genedata",
          logo: "/icons/genedata.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Genedata. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "HemoCue",
          logo: "/icons/HemoCue.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from HemoCue. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone"],
        },
        {
          name: "IDBS",
          logo: "/icons/idbs-4c.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from IDBS. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "IDT",
          logo: "/icons/idt.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from IDT. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "Leica Biosystems",
          logo: "/icons/leica-biosystems.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Leica Biosystems. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Leica Microsystems",
          logo: "/icons/leica-microsystems-4c.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Leica Microsystems. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "Mammotome",
          logo: "/icons/mammotome.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Mammotome. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Molecular Devices",
          logo: "/icons/molecular-devices-4c.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Molecular Devices. I consent to be contacted by phone / email as per given preference.",
          channels: ["email"],
        },
        {
          name: "Pall",
          logo: "/icons/pall.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Pall. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone"],
        },
        {
          name: "Phenomenex",
          logo: "/icons/phenomenex.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Phenomenex. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Radiometer",
          logo: "/icons/radiometer.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Radiometer. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Sciex",
          logo: "/icons/sciex-4c.png",
          description:
            "I am interested in receiving information about products, services, events (workshops, webinars), and educational content from Sciex. I consent to be contacted by phone / email as per given preference.",
          channels: ["email", "phone"],
        },
      ],
    };
  }
}

const subscriptionData = getSubscriptionData();

// OPCO URL Mapping - Update these URLs with actual links per OPCO
const OPCO_URLS = {
  "Danaher Group Companies": "https://www.danaher.com",
  "Abcam": "https://www.abcam.com",
  "Aldevron": "https://www.aldevron.com",
  "Beckman Coulter": "https://www.beckmancoulter.com",
  "Beckman Coulter Life Sciences": "https://www.beckman.com",
  "Cepheid": "https://www.cepheid.com",
  "Cytiva": "https://www.cytiva.com",
  "Genedata": "https://www.genedata.com",
  "HemoCue": "https://www.hemocue.com",
  "IDBS": "https://www.idbs.com",
  "IDT": "https://www.idtdna.com",
  "Leica Biosystems": "https://www.leicabiosystems.com",
  "Leica Microsystems": "https://www.leica-microsystems.com",
  "Mammotome": "https://www.mammotome.com",
  "Molecular Devices": "https://www.moleculardevices.com",
  "Pall": "https://www.pall.com",
  "Phenomenex": "https://www.phenomenex.com",
  "Radiometer": "https://www.radiometer.com",
  "Sciex": "https://www.sciex.com",
};

const TOPIC_TO_SUBSCRIPTION = [
  {
    sub: "Danaher Group Companies",
    patterns: ["cross_opco", "group_company", "danaher"],
  },
  { sub: "Abcam", patterns: ["abcam"] },
  { sub: "Aldevron", patterns: ["aldevron"] },
  {
    sub: "Beckman Coulter",
    patterns: ["beckman_coulter_test", "beckman_coulter"],
  },
  {
    sub: "Beckman Coulter Life Sciences",
    patterns: ["beckman_ls_marketing", "beckman_coulter_life_sciences_new"],
  },
  { sub: "Cepheid", patterns: ["cepheid"] },
  { sub: "Cytiva", patterns: ["cytiva"] },
  { sub: "Genedata", patterns: ["genedata"] },
  { sub: "HemoCue", patterns: ["hemocue"] },
  { sub: "IDBS", patterns: ["idbs"] },
  { sub: "IDT", patterns: ["idt"] },
  { sub: "Leica Biosystems", patterns: ["leica_biosystems"] },
  { sub: "Leica Microsystems", patterns: ["leica_microsystems"] },
  { sub: "Mammotome", patterns: ["mammotome"] },
  {
    sub: "Molecular Devices",
    patterns: ["moldev_marketing", "molecular_devices_new"],
  },
  { sub: "Pall", patterns: ["pall"] },
  { sub: "Phenomenex", patterns: ["phenomenex"] },
  { sub: "Radiometer", patterns: ["radiometer"] },
  { sub: "Sciex", patterns: ["sciex_marketing", "sciex"] },
];

function findSubscriptionFromTopic(topicKey) {
  const key = topicKey.toLowerCase();

  for (const map of TOPIC_TO_SUBSCRIPTION) {
    for (const pattern of map.patterns) {
      if (key.includes(pattern)) return map.sub;
    }
  }

  return null; // no match
}

// Loader management functions
function showLoader(message = "Loading your subscription data...") {
  let loader = document.getElementById("opco-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "opco-loader";
    loader.className = "opco-loader";
    document.body.appendChild(loader);
  }
  loader.innerHTML = `
    <div class="opco-loader-content">
      <div class="opco-spinner"></div>
      <p>${message}</p>
    </div>
  `;
  loader.style.display = "flex";
}

function hideLoader() {
  const loader = document.getElementById("opco-loader");
  if (loader) {
    loader.style.display = "none";
  }
}

async function fetchSubscriptions(identities) {
  const storageKey = getStorageKey();
  const endpoint =
    "https://" +
    `${window.location.host}` +
    `/bin/ketch/subscriptions?action=get&identities={"${storageKey}":"${identities}"}`;

  showLoader("Loading your subscription data...");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `API Error: HTTP ${response.status} - ${response.statusText}`
      );
    }
    // return await response.json();
    const data = await response.json();
    hideLoader();
    return data;
  } catch (error) {
    hideLoader();

    // For production/stage, show error modal
    showModalwithRefresh(
      "Unable to load your subscription data. Please refresh the page and try again.",
      false
    );
    throw error;
  }
}

async function loadChannelData(emailHash) {
  resetInactivityTimer();
  try {
    const data = await fetchSubscriptions(emailHash);
    channelData = data;

    // Step 1: Identify OPCOs marked for deletion based on mail field
    identifyDeletedOPCOs();
    
    // Step 2: Clear existing cards and rebuild without deleted OPCOs
    const container = document.getElementById("consent-body");
    if (container) {
      container.innerHTML = "";
    }
    buildCards();
    
    // Step 3: Build the Mark for Delete drawer
    buildMarkForDeleteDrawer();

    // Step 4: Apply channel data states to all existing checkboxes
    applyChannelStates();

    // Step 5: Attach info icon listeners to newly created cards
    attachInfoIconListeners();

    storeInitialState();
    checkForChanges();
  } catch (error) {
    // Show error popup to user
    if (!isEnvironment("localhost")) {
      showModalwithRefresh(
        "Unable to load your subscription data. Please refresh the page and try again.",
        false
      );
    }
  }
}

function showMessage(text) {
  const msgBox = document.getElementById("message");
  msgBox.textContent = text;
  msgBox.style.display = "block";
  setTimeout(() => {
    msgBox.style.display = "none";
  }, 5000);
}

function createSwitch(id) {
  const label = document.createElement("label");
  label.className = "switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  const span = document.createElement("span");
  span.className = "slider";
  label.appendChild(input);
  label.appendChild(span);
  return label;
}

function createInfoIcon() {
  const wrapper = document.createElement("div");
  wrapper.className = "info-icon-wrapper";
  wrapper.style.position = "relative";
  wrapper.style.overflow = "visible";
  const infoIcon = document.createElement("span");
  infoIcon.className = "info-icon";
  infoIcon.setAttribute("tabindex", "0");
  infoIcon.setAttribute("aria-hidden", "true");
  infoIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
  </svg>`;
  wrapper.appendChild(infoIcon);
  const tooltip = document.createElement("div");
  tooltip.className = "info-tooltip";
  tooltip.style.position = "absolute";
  tooltip.style.zIndex = "1200";
  tooltip.style.display = "none";
  tooltip.innerHTML = `
    <div class="info-bar">
      <div class="info-bar-content">
        <span style="margin-right:8px;">All Consent Given</span>
        <label class="switch dummy-toggle pointer-events">
          <input class="pointer-events" type="checkbox" checked disabled >
          <span class="slider granted" style="background-color:#1e51b0;"></span>
        </label>
      </div>
      <div class="info-bar-content">
        <span style="margin-right:8px;">Partial Consent Given/Withdrawn</span>
        <label class="switch dummy-toggle pointer-events">
          <input class="pointer-events" type="checkbox" checked disabled>
          <span class="slider denied" style="background-color:orange !important;"></span>
        </label>
      </div>
      <div class="info-bar-content">
        <span style="margin-right:8px;">All Consent Withdrawn</span>
        <label class="switch dummy-toggle pointer-events">
          <input class="pointer-events" type="uncheckbox" checked disabled>
          <span class="slider denied" style="background-color:red !important;"></span>
        </label>
      </div>
      <div class="info-bar-content">
        <span style="margin-right:8px;">No Consent Given</span>
        <label class="switch dummy-toggle pointer-events">
          <input class="pointer-events" type="uncheckbox" checked disabled>
          <span class="slider denied" style="background-color:#CCCCCC !important;"></span>
        </label>
      </div>
    </div>
  `;
  wrapper.appendChild(tooltip);
  return wrapper;
}

// Attach event listeners to info icons (can be called multiple times)
function attachInfoIconListeners() {
  const infoIcons = document.querySelectorAll(".info-icon");
  infoIcons.forEach((infoIcon) => {
    const wrapper = infoIcon?.closest(".info-icon-wrapper");
    const tooltip = wrapper?.querySelector(".info-tooltip");
    if (infoIcon && tooltip) {
      // Remove old listeners if any by cloning and replacing
      const newWrapper = wrapper.cloneNode(true);
      wrapper.parentNode.replaceChild(newWrapper, wrapper);
      const newIcon = newWrapper.querySelector(".info-icon");
      const newTooltip = newWrapper.querySelector(".info-tooltip");
      
      // Add new listeners
      let tooltipHideTimeout = null;
      newWrapper.addEventListener("mouseenter", () => {
        if (tooltipHideTimeout) {
          clearTimeout(tooltipHideTimeout);
          tooltipHideTimeout = null;
        }
        newTooltip.style.display = "block";
      });

      newWrapper.addEventListener("mouseleave", () => {
        tooltipHideTimeout = setTimeout(() => {
          newTooltip.style.display = "none";
          tooltipHideTimeout = null;
        }, 150);
      });
    }
  });
}

function updateToggleState(sub) {
  const checkboxes = document.querySelectorAll(
    `input[type=checkbox][data-sub='${sub}']`
  );
  // Find the master toggle input for this subscription. It may exist
  // as the regular toggle (`<id>-toggle`) or the delete-drawer toggle
  // (`<id>-delete-toggle`). Be defensive in case the element isn't present.
  const masterInput =
    document.getElementById(`${sub}-toggle`) ||
    document.getElementById(`${sub}-delete-toggle`);
  if (!masterInput) {
    // No master toggle found for this subscription (possible for
    // subscriptions that were removed from the main list). Safely exit.
    return;
  }
  const master = masterInput;
  let grantedCount = 0;
  let deniedCount = 0;
  checkboxes.forEach((cb) => {
    if (cb.classList.contains("granted")) grantedCount++;
    if (cb.classList.contains("denied")) deniedCount++;
  });
  // If there are no checkboxes for this subscription, clear master state
  // and return early.
  if (checkboxes.length === 0) {
    try {
      master.checked = false;
      master.classList.remove("partial", "denied-toggle");
    } catch (err) {
      /* ignore */
    }
    return;
  }

  if (grantedCount === checkboxes.length) {
    master.checked = true;
    master.classList.remove("partial");
    master.classList.remove("denied-toggle");
  } else if (grantedCount === 0 && deniedCount === 0) {
    master.checked = false;
    master.classList.remove("partial");
    master.classList.remove("denied-toggle");
  } else if (deniedCount === checkboxes.length) {
    master.checked = false;
    master.classList.remove("partial");
    master.classList.add("denied-toggle");
  } else {
    master.checked = true;
    master.classList.add("partial");
    master.classList.remove("denied-toggle");
  }
}
// ======================
// IDENTIFY DELETED OPCOs (only those with mail === granted)
// ======================
function identifyDeletedOPCOs() {
  if (!channelData?.data?.topics) {
    return;
  }

  // Clear the markForDeleteOPCOs array
  markForDeleteOPCOs.length = 0;

  subscriptionData.subscriptions.forEach((sub) => {
    const topics = channelData?.data?.topics || {};
    let topicKey = null;

    for (const key of Object.keys(topics)) {
      const mappedSub = findSubscriptionFromTopic(key);
      if (mappedSub === sub.name) {
        topicKey = key;
        break;
      }
    }
    const topicObj = channelData.data.topics[topicKey];

    // Check if this OPCO has mail === "granted"
    if (topicObj && topicObj.mail && topicObj.mail.status === "granted") {
      // Collect this OPCO for the "Mark for Delete" section
      markForDeleteOPCOs.push(sub.name);
    }
  });
}

// ======================
// APPLY CHANNEL STATES TO CHECKBOXES (after all checkboxes are created)
// ======================
function applyChannelStates() {
  if (!channelData?.data?.topics) {
    return;
  }

  subscriptionData.subscriptions.forEach((sub) => {
    const topics = channelData?.data?.topics || {};
    let topicKey = null;

    for (const key of Object.keys(topics)) {
      const mappedSub = findSubscriptionFromTopic(key);
      if (mappedSub === sub.name) {
        topicKey = key;
        break;
      }
    }
    const topicObj = channelData.data.topics[topicKey];

    // If this subscription is marked for deletion (mail === granted),
    // do NOT populate channel values — leave checkboxes and master
    // toggle in the NULL state.
    if (markForDeleteOPCOs.includes(sub.name)) {
      sub.channels.forEach((channel) => {
        const cbs = document.querySelectorAll(
          `input[type=checkbox][data-sub='${sub.name}'][data-channel='${channel}']`
        );
        cbs.forEach((cb) => {
          cb.classList.remove("granted", "denied");
          try {
            cb.checked = false;
          } catch (err) {
            /* ignore */
          }
        });
      });

      // Clear master toggle(s) for this subscription
      const master =
        document.getElementById(`${sub.name}-toggle`) ||
        document.getElementById(`${sub.name}-delete-toggle`);
      if (master) {
        try {
          master.checked = false;
          master.classList.remove("partial", "denied-toggle");
        } catch (err) {
          /* ignore */
        }
      }

      // Skip applying real channel states for deleted OPCOs
      return;
    }

    // Apply channel states to checkboxes for OPCOs not marked for deletion
    sub.channels.forEach((channel) => {
      const cb = document.querySelector(
        `input[type=checkbox][data-sub='${sub.name}'][data-channel='${channel}']`
      );

      if (!cb) return;

      // Always reset first
      cb.classList.remove("granted", "denied");

      // If topic or channel missing → leave NULL
      if (!topicObj || !topicObj[channel]) {
        return;
      }

      const status = topicObj[channel].status;

      if (status === "granted") {
        cb.classList.add("granted");
      } else if (status === "denied") {
        cb.classList.add("denied");
      }
    });

    // Update master toggle for this subscription
    updateToggleState(sub.name);
  });
}

// Legacy function for backward compatibility
function applyChannelDataToUI() {
  identifyDeletedOPCOs();
  applyChannelStates();
}

function buildCards() {
  const container = document.getElementById("consent-body");
  
  // Separate OPCOs into two groups: those with values and those without
  const opcoWithValues = [];
  const opcoWithoutValues = [];
  
  subscriptionData.subscriptions.forEach((sub) => {
    // Skip OPCOs marked for delete (mail === true)
    if (markForDeleteOPCOs.includes(sub.name)) {
      return;
    }
    
    // Check if this OPCO has any channel values (granted or denied)
    let hasValues = false;
    if (channelData?.data?.topics) {
      const topics = channelData.data.topics || {};
      let topicKey = null;
      for (const key of Object.keys(topics)) {
        const mappedSub = findSubscriptionFromTopic(key);
        if (mappedSub === sub.name) {
          topicKey = key;
          break;
        }
      }
      const topicObj = channelData.data.topics[topicKey];
      
      // Check if any channel has a value (granted or denied)
      if (topicObj) {
        hasValues = sub.channels.some(ch => topicObj[ch] && topicObj[ch].status);
      }
    }
    
    if (hasValues) {
      opcoWithValues.push(sub);
    } else {
      opcoWithoutValues.push(sub);
    }
  });
  
  // Sort both groups alphabetically
  opcoWithValues.sort((a, b) => a.name.localeCompare(b.name));
  opcoWithoutValues.sort((a, b) => a.name.localeCompare(b.name));
  
  // Combine: OPCOs with values first, then those without
  const sortedSubscriptions = [...opcoWithValues, ...opcoWithoutValues];
  
  // Now build cards in the sorted order
  sortedSubscriptions.forEach((sub) => {

    const card = document.createElement("div");
    card.className = "subscription-card";
    
    // Create logo (make it clickable)
    const logoDiv = document.createElement("div");
    logoDiv.className = "sub-logo-side";
    logoDiv.style.backgroundImage = `url(${sub.logo})`;
    logoDiv.style.cursor = "pointer";
    logoDiv.style.textDecoration = "underline";
    logoDiv.title = `Visit ${sub.name}`;
    logoDiv.onclick = () => {
      window.open(OPCO_URLS[sub.name] || "#", "_blank");
    };
    card.appendChild(logoDiv);
    const content = document.createElement("div");
    content.className = "subscription-content";

    const header = document.createElement("div");
    header.className = "subscription-header";
    
    // Create name link
    const nameLink = document.createElement("a");
    nameLink.href = OPCO_URLS[sub.name] || "#";
    nameLink.target = "_blank";
    nameLink.rel = "noopener noreferrer";
    nameLink.style.textDecoration = "none";
    nameLink.style.color = "inherit";
    nameLink.style.cursor = "pointer";
    nameLink.title = `Visit ${sub.name}`;
    nameLink.textContent = sub.name;
    header.appendChild(nameLink);

    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "toggle-with-info";

    const masterSwitch = createSwitch(`${sub.name}-toggle`);
    toggleWrapper.appendChild(masterSwitch);

    const infoIconWrapper = createInfoIcon();
    toggleWrapper.appendChild(infoIconWrapper);

    header.appendChild(toggleWrapper);
    content.appendChild(header);

    const desc = document.createElement("div");
    desc.className = "subscription-description";
    desc.textContent = sub.description;
    content.appendChild(desc);

    const channelsDiv = document.createElement("div");
    channelsDiv.className = "channels";
    
    // Check if mail is granted - if so, don't show email/phone/sms channels
    // Only check if channelData is loaded
    let hasMailGranted = false;
    if (channelData?.data?.topics) {
      const topics = channelData.data.topics || {};
      let topicKey = null;
      for (const key of Object.keys(topics)) {
        const mappedSub = findSubscriptionFromTopic(key);
        if (mappedSub === sub.name) {
          topicKey = key;
          break;
        }
      }
      const topicObj = channelData.data.topics[topicKey];
      hasMailGranted = topicObj && topicObj.mail && topicObj.mail.status === "granted";
    }
    
    // Only render channels if mail is NOT granted (or if no channel data yet)
    if (!hasMailGranted) {
      sub.channels.forEach((ch) => {
        const label = document.createElement("label");
        label.className = "channel";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.sub = sub.name;
        cb.dataset.channel = ch;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(ch.toUpperCase()));
        channelsDiv.appendChild(label);

        cb.addEventListener("click", (e) => {
          e.preventDefault();
          let newState = "";
          if (
            !cb.classList.contains("granted") &&
            !cb.classList.contains("denied")
          ) {
            newState = "granted";
          } else if (cb.classList.contains("granted")) {
            newState = "denied";
          } else if (cb.classList.contains("denied")) {
            newState = "granted";
          }

          cb.classList.remove("granted", "denied");
          if (newState) cb.classList.add(newState);

          updateToggleState(sub.name);
          // Toggle Save button if anything changed
          checkForChanges();
        });
      });
    }

    content.appendChild(channelsDiv);
    card.appendChild(content);
    container.appendChild(card);

    masterSwitch.querySelector("input").addEventListener("change", (e) => {
      const checked = e.target.checked;
      container
        .querySelectorAll(`input[type=checkbox][data-sub='${sub.name}']`)
        .forEach((cb) => {
          cb.classList.remove("granted", "denied");
          // Ensure the visual checked state and classes reflect the master toggle
          if (checked) {
            cb.classList.add("granted");
            try {
              cb.checked = true;
            } catch (err) {
              /* ignore if not supported */
            }
          } else {
            cb.classList.add("denied");
            try {
              cb.checked = false;
            } catch (err) {
              /* ignore if not supported */
            }
          }
        });
      updateToggleState(sub.name);
      // Toggle Save button if anything changed
      checkForChanges();
    });
  });
}

// ======================
// BUILD MARK FOR DELETE DRAWER
// ======================
function buildMarkForDeleteDrawer() {
  const pageContainer = document.querySelector(".page-container");
  if (!pageContainer) return;

  // If there are no OPCOs to mark for delete, remove the drawer completely
  if (!markForDeleteOPCOs || markForDeleteOPCOs.length === 0) {
    const existingDrawer = document.getElementById("mark-for-delete-drawer");
    if (existingDrawer) {
      existingDrawer.remove();
    }
    return;
  }

  // If drawer exists, remove it so we can rebuild with updated list
  const existingDrawer = document.getElementById("mark-for-delete-drawer");
  if (existingDrawer) {
    existingDrawer.remove();
  }

  // Sort deleted OPCOs alphabetically
  const sortedDeleteOPCOs = [...markForDeleteOPCOs].sort();

  // Create drawer container
  const drawerContainer = document.createElement("div");
  drawerContainer.id = "mark-for-delete-drawer";
  drawerContainer.style.cssText = ``;

  // Create drawer header with toggle
  const drawerHeader = document.createElement("div");
  drawerHeader.style.cssText = `
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    padding: 10px 0;
  `;

  // Arrow icon
  const arrowIcon = document.createElement("span");
  arrowIcon.id = "delete-drawer-arrow";
  arrowIcon.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg); transition: transform 0.3s ease;">
      <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  arrowIcon.style.cssText = `
    display: inline-block;
    margin-right: 12px;
    flex-shrink: 0;
  `;

  // Title
  const drawerTitle = document.createElement("h3");
  drawerTitle.textContent = "OpCo Where Data Deleted As Per Your Request";
  drawerTitle.style.cssText = `
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  `;

  drawerHeader.appendChild(arrowIcon);
  drawerHeader.appendChild(drawerTitle);

  // Content container (initially hidden)
  const drawerContent = document.createElement("div");
  drawerContent.id = "delete-drawer-content";
  drawerContent.style.cssText = `
    display: none;
    margin-top: 20px;
    animation: slideDown 0.3s ease;
  `;

  // Add confirmation checkbox and label
  const confirmationContainer = document.createElement("div");
  confirmationContainer.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 20px;
  `;

  // Create a simple default checkbox (without any class styling)
  const confirmCheckbox = document.createElement("input");
  confirmCheckbox.type = "checkbox";
  confirmCheckbox.id = "delete-confirm-checkbox";
  confirmCheckbox.checked = false; // Unchecked by default
  confirmCheckbox.style.cssText = `
    flex-shrink: 0;
    margin-top: 2px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  `;
  confirmationContainer.appendChild(confirmCheckbox);

  // Add label text as p tag (not clickable, no grey background)
  const testLabel = document.createElement("p");
  testLabel.style.cssText = `
    font-size: 14px;
    color: #333;
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
    padding: 0;
  `;
  testLabel.innerHTML = "Your data for below OpCo's has been permanently deleted as per your request.<strong>To resubscribe</strong> & manage Preferences please confirm here";
  confirmationContainer.appendChild(testLabel);
  drawerContent.appendChild(confirmationContainer);

  // Container for deleted OPCOs tiles
  const deletedCardsContainer = document.createElement("div");
  deletedCardsContainer.id = "deleted-opcos-container";
  deletedCardsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 20px;
  `;

  // Create tiles for deleted OPCOs (exactly like regular subscription cards)
  sortedDeleteOPCOs.forEach((opcoName) => {
    // Find the subscription data for this OPCO
    const sub = subscriptionData.subscriptions.find((s) => s.name === opcoName);
    if (!sub) return;

    const card = document.createElement("div");
    card.className = "subscription-card";
    
    // Create logo (make it clickable)
    const logoDiv = document.createElement("div");
    logoDiv.className = "sub-logo-side";
    logoDiv.style.backgroundImage = `url(${sub.logo})`;
    logoDiv.style.cursor = "pointer";
    logoDiv.style.textDecoration = "underline";
    logoDiv.title = `Visit ${sub.name}`;
    logoDiv.onclick = () => {
      window.open(OPCO_URLS[sub.name] || "#", "_blank");
    };
    card.appendChild(logoDiv);

    const content = document.createElement("div");
    content.className = "subscription-content";

    const header = document.createElement("div");
    header.className = "subscription-header";
    
    // Create name link
    const nameLink = document.createElement("a");
    nameLink.href = OPCO_URLS[sub.name] || "#";
    nameLink.target = "_blank";
    nameLink.rel = "noopener noreferrer";
    nameLink.style.textDecoration = "none";
    nameLink.style.color = "inherit";
    nameLink.style.cursor = "pointer";
    nameLink.title = `Visit ${sub.name}`;
    nameLink.textContent = sub.name;
    header.appendChild(nameLink);

    // Add toggle with info icon (exactly like regular cards)
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "toggle-with-info";

    const masterSwitch = createSwitch(`${opcoName}-delete-toggle`);
    toggleWrapper.appendChild(masterSwitch);

    const infoIconWrapper = createInfoIcon();
    toggleWrapper.appendChild(infoIconWrapper);

    header.appendChild(toggleWrapper);
    content.appendChild(header);

    const desc = document.createElement("div");
    desc.className = "subscription-description";
    desc.textContent = sub.description;
    content.appendChild(desc);

    // Add channels with checkboxes (exactly like regular cards)
    const channelsDiv = document.createElement("div");
    channelsDiv.className = "channels";
    sub.channels.forEach((ch) => {
      const label = document.createElement("label");
      label.className = "channel";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.sub = sub.name;
      cb.dataset.channel = ch;
      label.appendChild(cb);
      label.appendChild(document.createTextNode(ch.toUpperCase()));
      channelsDiv.appendChild(label);

      cb.addEventListener("click", (e) => {
        e.preventDefault();
        let newState = "";
        if (
          !cb.classList.contains("granted") &&
          !cb.classList.contains("denied")
        ) {
          newState = "granted";
        } else if (cb.classList.contains("granted")) {
          newState = "denied";
        } else if (cb.classList.contains("denied")) {
          newState = "granted";
        }

        cb.classList.remove("granted", "denied");
        if (newState) cb.classList.add(newState);

        updateToggleState(sub.name);
        // Toggle Save button if anything changed
        checkForChanges();
      });
    });

    content.appendChild(channelsDiv);
    card.appendChild(content);
    deletedCardsContainer.appendChild(card);

    // Master toggle functionality (exactly like regular cards)
    masterSwitch.querySelector("input").addEventListener("change", (e) => {
      const checked = e.target.checked;
      deletedCardsContainer
        .querySelectorAll(`input[type=checkbox][data-sub='${sub.name}']`)
        .forEach((cb) => {
          cb.classList.remove("granted", "denied");
          // Ensure the visual checked state and classes reflect the master toggle
          if (checked) {
            cb.classList.add("granted");
            try {
              cb.checked = true;
            } catch (err) {
              /* ignore if not supported */
            }
          } else {
            cb.classList.add("denied");
            try {
              cb.checked = false;
            } catch (err) {
              /* ignore if not supported */
            }
          }
        });
      updateToggleState(sub.name);
      // Toggle Save button if anything changed
      checkForChanges();
    });
  });

  drawerContent.appendChild(deletedCardsContainer);

  // Add confirmation checkbox event listener
  confirmCheckbox.addEventListener("change", (e) => {
    const isConfirmed = e.target.checked;
    
    // Get all checkboxes and toggles in the deleted OPCOs container
    const allChannelCheckboxes = deletedCardsContainer.querySelectorAll(
      `input[type=checkbox][data-channel]`
    );
    const allToggleInputs = deletedCardsContainer.querySelectorAll(
      `input[type=checkbox][id*="-delete-toggle"]`
    );
    
    const disabledTooltip = "Please provide your confirmation first for resubscribe";

    // If unchecked, reset all states to null
    if (!isConfirmed) {
      allChannelCheckboxes.forEach((cb) => {
        cb.classList.remove("granted", "denied");
        cb.checked = false;
        cb.disabled = true;
        cb.style.cursor = "not-allowed";
        cb.style.opacity = "0.5";
        cb.title = disabledTooltip;
      });

      allToggleInputs.forEach((toggle) => {
        toggle.checked = false;
        toggle.disabled = true;
        toggle.classList.remove("partial", "denied-toggle");
        toggle.title = disabledTooltip;
        const switchLabel = toggle.closest(".switch");
        if (switchLabel) {
          switchLabel.style.opacity = "0.5";
          switchLabel.style.cursor = "not-allowed";
          switchLabel.style.pointerEvents = "auto";
          switchLabel.title = disabledTooltip;
          const slider = switchLabel.querySelector(".slider");
          if (slider) {
            slider.title = disabledTooltip;
            slider.style.pointerEvents = "auto";
          }
        }
      });
    } else {
      // If checked, enable all checkboxes and toggles
      allChannelCheckboxes.forEach((cb) => {
        cb.disabled = false;
        cb.style.cursor = "pointer";
        cb.style.opacity = "1";
        cb.title = "";
      });

      allToggleInputs.forEach((toggle) => {
        toggle.disabled = false;
        toggle.title = "";
        const switchLabel = toggle.closest(".switch");
        if (switchLabel) {
          switchLabel.style.opacity = "1";
          switchLabel.style.cursor = "pointer";
          switchLabel.style.pointerEvents = "auto";
          switchLabel.title = "";
          const slider = switchLabel.querySelector(".slider");
          if (slider) {
            slider.title = "";
          }
        }
      });
    }
  });

  // Initialize disabled state on load (confirmation checkbox is unchecked by default)
  confirmCheckbox.dispatchEvent(new Event("change"));

  // Add animation styles if not already present
  if (!document.getElementById("delete-drawer-styles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "delete-drawer-styles";
    styleEl.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Toggle functionality
  drawerHeader.addEventListener("click", () => {
    const isHidden = drawerContent.style.display === "none";
    drawerContent.style.display = isHidden ? "block" : "none";

    // Rotate arrow
    const arrow = arrowIcon.querySelector("svg");
    if (arrow) {
      arrow.style.transform = isHidden ? "rotate(0deg)" : "rotate(-90deg)";
    }
  });

  drawerContainer.appendChild(drawerHeader);
  drawerContainer.appendChild(drawerContent);
  pageContainer.appendChild(drawerContainer);
}

function getChangedSubscriptions() {
  const storageSHAKey = getStorageKey();
  const shakey = localStorage.getItem(storageSHAKey);
  const hashedemail = localStorage.getItem("reference");
  const changed = [];
  subscriptionData.subscriptions.forEach((sub) => {
    const changedChannels = [];
    sub.channels.forEach((ch) => {
      const cb = document.querySelector(
        `input[type=checkbox][data-sub='${sub.name}'][data-channel='${ch}']`
      );
      if (!cb) return;
      const currentState = cb.classList.contains("granted")
        ? "granted"
        : cb.classList.contains("denied")
        ? "denied"
        : "none";
      const initialState = initialSubscriptionState[sub.name][ch];
      if (currentState !== initialState) {
        changedChannels.push({ channel: ch, state: currentState });
      }
    });
    if (changedChannels.length > 0) {
      changed.push({
        name: sub.name,
        changedChannels,
      });
    }
  });
  return {
    EMAIL: hashedemail,
    HASH_ID: shakey,
    data: changed,
  };
}

// Enable/disable the header Save button
function setSaveButtonEnabled(enabled) {
  const btn = document.querySelector(".header-btn");
  if (!btn) return;
  if (enabled) {
    btn.removeAttribute("disabled");
    btn.removeAttribute("aria-disabled");
    btn.style.opacity = "";
    btn.style.cursor = "pointer";
    // Apply inline color to ensure visibility (overrides any CSS)
    btn.style.backgroundColor = "#4000A5";
    btn.style.color = "#ffffff";
    btn.title = "";
  } else {
    btn.setAttribute("disabled", "true");
    btn.setAttribute("aria-disabled", "true");
    // visually indicate disabled via opacity and cursor only; keep original color
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
    // keep the same purple background and white text while disabled
    btn.style.backgroundColor = "#4000A5";
    btn.style.color = "#ffffff";
    // native tooltip on hover explaining why it's disabled
    btn.title = "You haven't changed any consent.";
  }
}

// Check whether anything changed compared to initial state; enable Save only if there are changes
function checkForChanges() {
  try {
    const changed = getChangedSubscriptions();
    const hasChanges = Array.isArray(changed.data) && changed.data.length > 0;
    setSaveButtonEnabled(hasChanges);
  } catch (err) {
    // If anything goes wrong, be conservative and enable the button so user can try to save
    setSaveButtonEnabled(true);
  }
}

function savePreferences() {
  resetInactivityTimer();
  showSaveModal("Really want to save preferences?", true);
}
// Store initial state of all subscriptions/channels
function storeInitialState() {
  subscriptionData.subscriptions.forEach((sub) => {
    initialSubscriptionState[sub.name] = {};
    sub.channels.forEach((ch) => {
      const cb = document.querySelector(
        `input[type=checkbox][data-sub='${sub.name}'][data-channel='${ch}']`
      );
      initialSubscriptionState[sub.name][ch] =
        cb && cb.classList.contains("granted")
          ? "granted"
          : cb && cb.classList.contains("denied")
          ? "denied"
          : "none";
    });
  });
}

window.savePreferences = savePreferences;

// ======================
// UTILITIES
// ======================

function closeAllPopups() {
  const modalIds = [
    "consent-modal",
    "verification-modal",
    "session-expired-modal",
  ];

  modalIds.forEach((id) => {
    const modal = document.getElementById(id);
    if (modal) {
      document.body.removeChild(modal);
    }
  });

  // Also close any generic overlay just in case
  document
    .querySelectorAll('[id$="modal"], .opco-modal')
    .forEach((el) => el.remove());
}

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    expireSession();
  }, SESSION_TIMEOUT_MS);
}

function expireSession() {
  // Clear timers
  if (inactivityTimer) clearTimeout(inactivityTimer);

  // Clear session-related storage
  sessionStorage.clear();
  localStorage.removeItem("reference");
  localStorage.removeItem(getStorageKey());

  // Show session expired modal
  showSessionExpiredModal();
}

function debugLog(...args) {
  // Debug logging disabled
}

function isEnvironment(env) {
  const host = window.location.host;
  if (env === "production") return host === "lifesciences.danaher.com";
  if (env === "stage") return host.includes("stage.lifesciences.danaher.com");
  return host.includes("localhost") || host.includes("127.0.0.1");
}

function getStorageKey() {
  return isEnvironment("production") ? "danaher_id" : "danaher_test_id";
}

function obfuscateEmail(email) {
  return btoa(email.split("").reverse().join(""));
}

function deobfuscateEmail(obfuscated) {
  return atob(obfuscated).split("").reverse().join("");
}

async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sendOTP(email, recaptchaToken = null) {
  resetInactivityTimer();
  showLoader("Sending OTP...");
  try {
    const response = await fetch(
      "https://" + `${window.location.host}` + "/bin/boomi/otp",
      // "http://localhost:4502/bin/boomi/otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ADD THIS LINE - Required to handle the boomi_otp_data cookie
        credentials: "include",
        body: JSON.stringify({ email, recaptchaToken }),
      }
    );
    hideLoader();
    if (!response.ok) {
      throw new Error(`Failed to send OTP: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    hideLoader();
    throw error;
  }
}

async function hashOTP(otp) {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

async function verifyOTP(email, code) {
  resetInactivityTimer();

  try {
    // Get OTP data from cookie
    const otpCookieData = getCookie("boomi_otp_data");

    if (!otpCookieData) {
      return {
        success: false,
        message: "OTP not found. Please request a new OTP.",
      };
    }

    // Decode URL-encoded cookie data before parsing JSON
    const decodedOtpData = decodeURIComponent(otpCookieData);
    const otpData = JSON.parse(decodedOtpData);
    const { EMAIL, OTP: hashedOTP, OTPExpiration } = otpData;

    // Check if OTP has expired
    // Parse the backend UTC time format: "2026-01-27+07:41:13" (+ is separator between date and time)
    // Convert to ISO format that JavaScript can parse
    const formattedOTPExpiration = OTPExpiration.replace("+", "T");
    const expirationDate = new Date(formattedOTPExpiration + "Z"); // Add Z for UTC timezone
    const expirationTimeUTC = expirationDate.getTime();

    // Validate the parsed date
    if (isNaN(expirationTimeUTC)) {
      return {
        success: false,
        message: "Invalid OTP data. Please request a new OTP.",
      };
    }

    // Get current time in UTC (getTime() always returns UTC milliseconds since epoch)
    const currentTimeUTC = new Date().getTime();

    if (currentTimeUTC > expirationTimeUTC) {
      return {
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      };
    }

    // Hash the user-entered OTP
    const userHashedOTP = await hashOTP(code);

    // Compare hashes
    if (userHashedOTP !== hashedOTP) {
      return { success: false, message: "Invalid OTP code" };
    }

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Error verifying OTP. Please try again.",
    };
  }
}
async function updateConsent(changedSubs) {
  resetInactivityTimer();
  showLoader("Saving your preferences...");
  try {
    const response = await fetch(
      "https://" + `${window.location.host}` + "/bin/boomi/integration",
      {
        method: "POST",
        body: JSON.stringify(changedSubs),
        mode: "cors",
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.text();
    hideLoader();
    return data;
  } catch (error) {
    hideLoader();
    throw error;
  }
}

// ======================
// UI COMPONENTS
// ======================

let recaptchaToken = null;
let recaptchaWidgetId = null;

function renderRecaptcha(containerId) {
  const maxRetries = 50; // Retry up to 5 seconds (50 * 100ms)
  let retryCount = 0;

  const tryRender = () => {
    retryCount++;

    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      if (retryCount < maxRetries) {
        setTimeout(tryRender, 100);
      }
      return;
    }

    // Check if grecaptcha is available
    if (typeof grecaptcha === "undefined") {
      if (retryCount < maxRetries) {
        setTimeout(tryRender, 100);
      }
      return;
    }

    try {
      // Clear container before rendering (remove any existing widget)
      container.innerHTML = "";

      recaptchaWidgetId = grecaptcha.render(containerId, {
        sitekey: "6LdBcUosAAAAAJQ8DH4us83jDxEEsG4xHKfbLKvA",
        callback: onRecaptchaSuccess,
        "expired-callback": onRecaptchaExpired,
      });
    } catch (error) {
      if (retryCount < maxRetries) {
        setTimeout(tryRender, 100);
      }
    }
  };

  tryRender();
}

function onRecaptchaSuccess(token) {
  recaptchaToken = token;
  checkSendButton();
}

function onRecaptchaExpired() {
  recaptchaToken = null;
  checkSendButton();
}

function checkSendButton() {
  const emailInput = document.getElementById("email-input");
  const submitBtn = document.getElementById("email-submit");
  const val = emailInput ? emailInput.value.trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(val);
  const isRecaptchaDone = recaptchaToken !== null;
  submitBtn.disabled = !(isEmailValid && isRecaptchaDone);
  submitBtn.style.opacity = submitBtn.disabled ? "0.5" : "1";
  submitBtn.style.cursor = submitBtn.disabled ? "not-allowed" : "pointer";
}

function showSaveModal(message, isSuccess = true) {
  resetInactivityTimer();
  closeAllPopups();
  const modalId = "consent-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md text-center" },
    h4({ class: "text-xl mb-auto", style: "margin-bottom: 30px;" }, message),
    button(
      {
        class: `mb-4 px-4 py-2 mb-2 rounded ${
          isSuccess ? "bg-danaherpurple-800" : "bg-danaherpurple-800"
        } text-white`,
        onClick: async () => {
          document.body.removeChild(modal);
          const changedSubs = getChangedSubscriptions();
          try {
            const resp = await updateConsent(changedSubs);
            // debugLog("Changed subscriptions:", changedSubs, "response:", resp);
            showMessage("✅ Preferences saved successfully");
            const ob = localStorage.getItem("reference");
            const decodedEmail = ob ? deobfuscateEmail(ob) : null;
            const newUrl = new URL(window.location.href);
            if (decodedEmail) {
              newUrl.searchParams.set("emailid", decodedEmail);
            }
            window.history.replaceState({}, document.title, newUrl.toString());
            if (decodedEmail) {
              emailprocessing(decodedEmail, newUrl);
            }
          } catch (err) {
            showModal(
              "Failed to save preferences. Please try again later.",
              false
            );
          }
        },
      },
      "Save"
    ),
    button(
      {
        class: `mb-4 px-4 py-2 mb-2 rounded ${
          isSuccess ? "bg-danaherpurple-800" : "bg-danaherpurple-800"
        } text-white`,
        style: "margin-left: 20px;",
        onClick: () => {
          document.body.removeChild(modal);
          // window.location.reload();
        },
      },
      "Cancel"
    )
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function showModal(message, isSuccess = true) {
  closeAllPopups();
  const modalId = "consent-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md text-center" },
    h4({ class: "text-xl mb-auto" }, message),
    button(
      {
        class: `mb-4 px-4 py-2 mb-2 rounded ${
          isSuccess ? "bg-danaherpurple-800" : "bg-danaherpurple-800"
        } text-white`,
        onClick: () => {
          document.body.removeChild(modal);
          // window.location.reload();
        },
      },
      "OK"
    )
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function showModalwithRefresh(message, isSuccess = true) {
  closeAllPopups();
  const modalId = "consent-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md text-center" },
    h4({ class: "text-xl mb-auto" }, message),
    button(
      {
        class: `mb-4 px-4 py-2 mb-2 rounded ${
          isSuccess ? "bg-danaherpurple-800" : "bg-danaherpurple-800"
        } text-white`,
        onClick: () => {
          document.body.removeChild(modal);
          window.location.reload();
        },
      },
      "OK"
    )
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function showEmailPopup(message, isSuccess = true) {
  resetInactivityTimer();
  closeAllPopups();
  const modalId = "consent-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  recaptchaToken = null;

  // Reset existing reCAPTCHA widget safely
  if (recaptchaWidgetId !== null && typeof grecaptcha !== "undefined") {
    try {
      grecaptcha.reset(recaptchaWidgetId);
    } catch (err) {
      recaptchaWidgetId = null; // Reset the widget ID so it will be recreated
    }
  }

  // EMAIL INPUT FIELD WITH LIVE VALIDATION
  const emailInputField = input({
    id: "email-input",
    type: "email",
    placeholder: "Enter your email",
    autofocus: true,
    style: "width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;",
    onInput: () => {
      const val = document.getElementById("email-input").value.trim();
      const errorMsg = document.getElementById("email-error");
      const submitBtn = document.getElementById("email-submit");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(val)) {
        // INVALID EMAIL
        errorMsg.innerText = "Please enter a valid email address.";
        errorMsg.style.visibility = "visible";
      } else {
        // VALID EMAIL
        errorMsg.innerText = "";
        errorMsg.style.visibility = "hidden";
      }
      checkSendButton();
    },
  });

  // ERROR MESSAGE SPACE (RESERVED — NO SHIFTING)
  const emailError = div(
    {
      id: "email-error",
      style:
        "color:red;font-size:14px;visibility:hidden;margin-top:6px;height:16px;",
    },
    ""
  );

  // RECAPTCHA CONTAINER
  const recaptchaContainer = div({
    id: "recaptcha-container",
    style:
      "margin-top: 10px; transform: scale(0.8); transform-origin: top left;",
  });

  // SUBMIT BUTTON (DISABLED UNTIL EMAIL IS VALID AND RECAPTCHA COMPLETED)
  const submitButton = button(
    {
      id: "email-submit",
      disabled: true,
      class: `mb-4 px-4 py-2 mb-2 rounded bg-danaherpurple-800 text-white`,
      style:
        "margin-left:auto;display:block;margin-right:20px;margin-bottom:20px;opacity:0.5;cursor:not-allowed;",
      onClick: async () => {
        if (!recaptchaToken) {
          const errorMsg = document.getElementById("email-error");
          errorMsg.innerText = "Please complete the reCAPTCHA.";
          errorMsg.style.visibility = "visible";
          return;
        }

        const emailInput = document.getElementById("email-input");
        const inputEmail = emailInput.value.trim();
        const lowercaseInputEmail = inputEmail.toLowerCase();
        const safeEmail = obfuscateEmail(lowercaseInputEmail);
        sessionStorage.setItem("temp_ref", safeEmail);

        try {
          await sendOTP(safeEmail, recaptchaToken);
          closeAllPopups();
          showVerificationPopup(safeEmail);
        } catch (err) {
          // Reset reCAPTCHA on failure
          recaptchaToken = null;
          setTimeout(() => {
            if (
              recaptchaWidgetId !== null &&
              typeof grecaptcha !== "undefined"
            ) {
              try {
                grecaptcha.reset(recaptchaWidgetId);
              } catch (resetErr) {
                // Ignore reset error
              }
            }
            checkSendButton();
          }, 100);
          const errorMsg = document.getElementById("email-error");
          if (errorMsg) {
            errorMsg.innerText =
              "Failed to send OTP. Please complete reCAPTCHA again and try.";
            errorMsg.style.visibility = "visible";
          }
        }
      },
    },
    "Send OTP"
  );

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md" },
    div(
      { style: "margin: 20px;" },
      label(
        {
          for: "email-input",
          style: "display:block;margin-bottom:8px;margin-top:15px;",
        },
        "Please Enter Your Valid Email Address:"
      ),
      emailInputField,
      emailError,
      recaptchaContainer
    ),
    submitButton
  );

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Render reCAPTCHA after modal is in DOM
  renderRecaptcha("recaptcha-container");
}

function showVerificationPopup(email) {
  resetInactivityTimer();
  closeAllPopups();
  const DecodedEmail = deobfuscateEmail(email);
  const modalId = "verification-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const otpInputs = [];
  const otpContainer = div({
    style: "display: flex; gap: 8px; justify-content: center; margin: 20px 0;",
  });

  let resendCount = 0;

  for (let i = 0; i < 6; i++) {
    const otpInput = input({
      type: "text",
      maxlength: "1",
      pattern: "[0-9]",
      style:
        "width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ccc; border-radius: 4px;",
      onInput: (e) => {
        const value = e.target.value;
        if (!/^\d$/.test(value)) {
          e.target.value = "";
          checkVerifyButton();
          return;
        }
        if (i < 5 && value) {
          otpInputs[i + 1].focus();
        }
        checkVerifyButton();
      },
      onKeydown: (e) => {
        if (e.key === "Backspace" && !e.target.value && i > 0) {
          otpInputs[i - 1].focus();
          checkVerifyButton();
        }
      },
      onPaste: (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        if (/^\d{6}$/.test(paste)) {
          paste.split("").forEach((digit, idx) => {
            if (otpInputs[idx]) otpInputs[idx].value = digit;
          });
          checkVerifyButton();
        }
      },
    });
    otpInputs.push(otpInput);
    otpContainer.appendChild(otpInput);
  }

  const errorDiv = div(
    {
      id: "otp-error",
      style:
        "color: red; font-size: 14px; visibility: hidden; margin-top: 10px; height: 16px;",
    },
    ""
  );

  const verifyButton = button(
    {
      id: "verify-btn",
      disabled: true,
      class: "mb-4 px-4 py-2 mb-2 rounded bg-danaherpurple-800 text-white",
      style:
        "margin: 20px auto; display: block; opacity: 0.5; cursor: not-allowed;",
      onClick: async () => {
        const code = otpInputs.map((inp) => inp.value).join("");
        try {
          const result = await verifyOTP(email, code);
          if (result.success) {
            document.body.removeChild(modal);
            emailprocessing(DecodedEmail);
          } else {
            showOTPError(result.message || "Invalid OTP. Please try again.");
          }
        } catch (err) {
          showOTPError("Verification failed. Please try again.");
        }
      },
    },
    "Verify Code"
  );

  const resendWrapper = div(
    {
      style: "text-align:center;margin-top:16px;font-size:14px;color:#555;",
    },
    span({}, "Didn't receive the code? "),
    span(
      {
        id: "resend-link",
        style: "color:#007bff;cursor:pointer;font-weight:500;",
      },
      "Resend Code"
    )
  );

  const emailIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  emailIcon.setAttribute("width", "16");
  emailIcon.setAttribute("height", "16");
  emailIcon.setAttribute("viewBox", "0 0 24 24");
  emailIcon.setAttribute("fill", "none");
  emailIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M2 6.5C2 5.67157 2.67157 5 3.5 5H20.5C21.3284 5 22 5.67157 22 6.5V17.5C22 18.3284 21.3284 19 20.5 19H3.5C2.67157 19 2 18.3284 2 17.5V6.5Z"
  );
  path1.setAttribute("stroke", "currentColor");
  path1.setAttribute("stroke-width", "1.4");
  path1.setAttribute("stroke-linecap", "round");
  path1.setAttribute("stroke-linejoin", "round");
  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M3 7L12 13L21 7");
  path2.setAttribute("stroke", "currentColor");
  path2.setAttribute("stroke-width", "1.4");
  path2.setAttribute("stroke-linecap", "round");
  path2.setAttribute("stroke-linejoin", "round");
  emailIcon.appendChild(path1);
  emailIcon.appendChild(path2);
  emailIcon.style.display = "inline-block";
  emailIcon.style.verticalAlign = "middle";
  emailIcon.style.marginRight = "4px";
  emailIcon.style.color = "#000";

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md text-center" },
    h3({ style: "margin-bottom: 10px;" }, "Verify your identity"),
    p(
      { style: "margin-bottom: 10px;" },
      `Enter the 6-digit code sent to`,
      span(
        { style: "display: block; margin-top: 4px;" },
        emailIcon,
        ` ${DecodedEmail}`
      )
    ),
    otpContainer,
    errorDiv,
    verifyButton,
    resendWrapper
  );

  modal.appendChild(content);
  document.body.appendChild(modal);

  otpInputs[0].focus();

  // Start resend cooldown immediately
  startResendCooldown();

  function checkVerifyButton() {
    const filled = otpInputs.every((inp) => inp.value);
    const btn = document.getElementById("verify-btn");
    btn.disabled = !filled;
    btn.style.opacity = filled ? "1" : "0.5";
    btn.style.cursor = filled ? "pointer" : "not-allowed";
  }

  function showOTPError(message) {
    const err = document.getElementById("otp-error");
    err.innerText = message;
    err.style.visibility = "visible";
  }

  function startResendCooldown() {
    const link = document.getElementById("resend-link");
    let timeLeft = 60;
    link.style.cursor = "not-allowed";
    link.style.color = "#ccc";
    link.innerText = `Resend Code in ${timeLeft}s`;
    link.onclick = null; // Clear any existing handler

    const timer = setInterval(() => {
      timeLeft--;
      link.innerText = `Resend Code in ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        link.innerText = "Resend Code";
        link.style.cursor = "pointer";
        link.style.color = "#007bff";

        // Set single handler for resend action
        link.onclick = async (e) => {
          e.preventDefault();
          // Clear any existing error message
          const err = document.getElementById("otp-error");
          err.innerText = "";
          err.style.visibility = "hidden";
          
          // Clear all OTP input boxes
          otpInputs.forEach((inp) => {
            inp.value = "";
          });
          
          // Only allow click if button is enabled (cursor is pointer)
          if (link.style.cursor !== "pointer") {
            return;
          }
          if (resendCount >= 3) {
            showOTPError("Resend limit exceeded.");
            link.style.cursor = "not-allowed";
            link.style.color = "#ccc";
            link.onclick = null;
            return;
          }
          try {
            // Send OTP without recaptchaToken (pass null)
            await sendOTP(email, null);
            // Only increment count on successful send
            resendCount++;
            startResendCooldown();
          } catch (err) {
            showOTPError("Failed to resend code. Please try again.");
          }
        };
      }
    }, 1000);
  }
}

function showSessionExpiredModal() {
  closeAllPopups();
  const modalId = "session-expired-modal";
  let modal = document.getElementById(modalId);

  if (modal) document.body.removeChild(modal);

  modal = document.createElement("div");
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;

  const content = div(
    { class: "bg-white rounded-lg p-6 w-full max-w-md text-center" },
    h4({ class: "text-xl mb-4" }, "Session expired. Please login again."),
    button(
      {
        class: "px-4 py-2 rounded bg-danaherpurple-800 text-white",
        onClick: () => {
          document.body.removeChild(modal);
          showEmailPopup(); // 👈 Redirect to email popup
        },
      },
      "OK"
    )
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function emailprocessing(rawEmail, rawUrl) {
  const emailParam = rawEmail ? rawEmail.toLowerCase() : null;

  // Ensure rawUrl is a URL object
  let urlObj = rawUrl;
  if (!urlObj || typeof urlObj.href !== "string") {
    urlObj = new URL(window.location.href);
  }

  if (
    emailParam &&
    CONFIG.allowedDomains.some((domain) => urlObj.href.startsWith(domain))
  ) {
    (async () => {
      try {
        // debugLog("Processing email parameter");
        const storageKey = getStorageKey();
        const emailHash = await hashEmail(emailParam);
        const obfuscatedEmail = obfuscateEmail(emailParam);

        localStorage.setItem("reference", obfuscatedEmail);
        localStorage.setItem(storageKey, emailHash);

        // debugLog("Stored data:", {
        //   email: obfuscatedEmail,
        //   hashId: emailHash,
        //   storageKey,
        // });

        loadChannelData(emailHash);

        // Clean URL
        urlObj.searchParams.delete("emailid");
        window.history.replaceState({}, document.title, urlObj.toString());
      } catch (error) {
        // Email processing failed
      }
    })();
  } else {
    showEmailPopup();
  }
}
export default async function decorate(block) {
  // Load reCAPTCHA script
  const recaptchaScript = document.createElement("script");
  recaptchaScript.src = "https://www.google.com/recaptcha/api.js";
  recaptchaScript.async = true;
  recaptchaScript.defer = true;
  document.head.appendChild(recaptchaScript);

  function initializeSessionTimeoutTracking() {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) =>
      document.addEventListener(event, resetInactivityTimer, true)
    );

    // Start timer immediately
    resetInactivityTimer();
  }

  // Check if screen width is below 769px (mobile)
  if (window.innerWidth < 769) {
    block.innerHTML = `
      <div class="desktop-only-message">
        <div class="desktop-only-content">
          <h1>Desktop Only</h1>
          <p>This page can be accessed only on Desktop.</p>
          <p>Please open this page on a desktop device for the best experience.</p>
        </div>
      </div>
    `;
    return;
  }

  // Also listen for resize events
  window.addEventListener("resize", () => {
    if (window.innerWidth < 769) {
      block.innerHTML = `
        <div class="desktop-only-message">
          <div class="desktop-only-content">
            <h1>Desktop Only</h1>
            <p>This page can be accessed only on Desktop.</p>
            <p>Please open this page on a desktop device for the best experience.</p>
          </div>
        </div>
      `;
    }
  });

  block.innerHTML = `
 <div class="page-container">
   <div class="header-bar">
      <div class="header-left">
         <img src="/icons/danaher.png" alt="Logo" class="header-logo" />
         <span>Marketing Preference Center</span>
      </div>
        <div class="header-actions">
           <button class="header-btn" onclick="savePreferences()">Save</button>
        </div>
   </div>
   <div id="message">Msg</div>
   <div class="preferences-sticky-bar">
      <h2>Your Preferences</h2>
      <p>
        By providing consent to receive marketing communications from any Danaher operating company <a href="https://www.danaher.com/business-directory" target="_blank">(“OpCos”)</a>, you understand and agree that your personal data and consent preferences may be shared within Danaher Corporation and its affiliated OpCos identified in this Preference Center, for marketing and related purposes, in accordance with the <a href="https://danaher.com/data-privacy-notice" target="_blank">Danaher Privacy Policy</a>.
        You may manage, modify, or withdraw your consent for each OpCo at any time. Withdrawal of consent will not affect the lawfulness of processing based on consent before its withdrawal.
      </p>
   </div>
   <div id="consent-body" class="subs"></div>
</div>
  `;

  buildCards();
  setSaveButtonEnabled(false);

  // Add spinner animation style to head
  const spinnerStyle = document.createElement("style");
  spinnerStyle.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Responsive gap between preferences-sticky-bar and consent-body for screens below 1350px */
    @media (max-width: 1350px) {
      #consent-body {
        margin-top: 80px;
      }
    }
    
    @media (max-width: 1200px) {
      #consent-body {
        margin-top: 100px;
      }
    }
    
    @media (max-width: 1000px) {
      #consent-body {
        margin-top: 120px;
      }
    }
    
    @media (max-width: 800px) {
      #consent-body {
        margin-top: 150px;
      }
    }
    
    @media (max-width: 600px) {
      #consent-body {
        margin-top: 180px;
      }
    }
  `;
  document.head.appendChild(spinnerStyle);

  // Don't call applyChannelDataToUI() here - wait for loadChannelData() after user logs in
  
  setTimeout(() => {
    attachInfoIconListeners();
  }, 0);
  const url = new URL(window.location.href);
  const emailParamRaw = url.searchParams.get("emailid");
  emailprocessing(emailParamRaw, url);
  initializeSessionTimeoutTracking();
  if (CONFIG.debug) {
    const style = document.createElement("style");
    style.textContent = `
      /* #lanyard_root * {
        --ketch-debug-outline: 1px solid red;
      } */
     #lanyard_root * .\\!ketch-bg-\\[--k-preference-header-background-color\\] {
        border-bottom: 1px solid #112233 !important;
      }
      body #lanyard_root * .\\!ketch-bg-\\[--k-preference-tabs-subscriptions-unsubscribeAll-background-color\\] {
          background-color: #FFFFFF !important;
      }
      html {
        --k-preference-tabs-subscriptions-unsubscribeAll-switchButton-on-background-color: var(--k-preference-tabs-subscriptions-footer-actionButton-background-color) !important;
      }
      #lanyard_root * .ketch-w-15 {
        width: 15%;
      }
      #lanyard_root * .ketch-w-79 {
        width: 79%;
      }
      #lanyard_root * .ketch-w-6 {
        width: 6%;
      }
      #lanyard_root * .ketch-font-semibold {
        font-weight: 600 !important;
      }
      #lanyard_root * .ketch-text-ketch-h3 {
        font-size: 18px !important;
        line-height: 22.5px !important;
      }
      #lanyard_root * .ketch-text-ketch-h1 {
        font-size: 28px !important;
        line-height: 39px !important;
      }

      #lanyard_root * .ketch-gap-5 {
        gap: 20px !important;
      }
      #lanyard_root * .\!ketch-p-0 {
        padding: 16px 0 !important;
      }

      #lanyard_root * .\!ketch-bg-\[--k-preference-header-background-color\] {
        border-bottom: 1px solid #112233 !important;
      }
      body #lanyard_root * .\!ketch-bg-\[--k-preference-tabs-subscriptions-unsubscribeAll-background-color\] {
        background-color: #FFFFFF !important;
      }
      html {
        --k-preference-tabs-subscriptions-unsubscribeAll-switchButton-on-background-color: var(--k-preference-tabs-subscriptions-footer-actionButton-background-color) !important;
      }

      label[aria-label*="via Mail"].ketch-relative.\!ketch-m-0.ketch-inline-flex.\!ketch-p-0 {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  try {
    const existing = document.getElementById("opco-email-icon");
    if (!existing) {
      // Create the floating email icon button
      const emailBtn = document.createElement("a");
      emailBtn.id = "opco-email-icon";
      emailBtn.setAttribute(
        "aria-label",
        "Email Danaher about marketing preferences query"
      );
      emailBtn.setAttribute("role", "button");
      emailBtn.href = "#";
      emailBtn.innerHTML = `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 6.5C2 5.67157 2.67157 5 3.5 5H20.5C21.3284 5 22 5.67157 22 6.5V17.5C22 18.3284 21.3284 19 20.5 19H3.5C2.67157 19 2 18.3284 2 17.5V6.5Z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 7L12 13L21 7" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      emailBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        const to = "DHR_Privacy_Techteam@dhlifesciences.com";
        const subject = "Marketing Preferences Query";
        const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailto;
      });

      document.body.appendChild(emailBtn);

      // Create the floating sticky note
      const stickyNote = document.createElement("div");
      stickyNote.id = "opco-sticky-note";
      stickyNote.innerHTML = `
        <span class="opco-sticky-close" aria-label="Close">&times;</span>
        <span class="opco-sticky-content">If you have any query contact us here</span>
      `;
      document.body.appendChild(stickyNote);

      // Sticky note close logic
      stickyNote
        .querySelector(".opco-sticky-close")
        .addEventListener("click", () => {
          stickyNote.style.display = "none";
        });
    }
  } catch (err) {
    // Floating email icon initialization error
  }
}
