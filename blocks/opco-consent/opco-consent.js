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
const CONFIG = {
  debug: false, // Set to false in production
  allowedDomains: [
    "https://stage.lifesciences.danaher.com",
    "https://lifesciences.danaher.com",
    "http://localhost",
    "http://127.0.0.1",
  ],
};

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
        {
          name: "Danaher Group Companies",
          logo: "/icons/danaher.png",
          description: "Receive marketing from Danaher Group Companies.",
          channels: ["email", "phone"],
        },
      ],
    };
  } else {
    // Development environment - all subscriptions
    return {
      subscriptions: [
        {
          name: "Danaher Group Companies",
          logo: "/icons/danaher.png",
          description: "Receive marketing from Danaher Group Companies.",
          channels: ["email", "phone"],
        },
        {
          name: "Abcam",
          logo: "/icons/abcam.png",
          description: "Receive marketing from Abcam.",
          channels: ["email"],
        },
        {
          name: "Aldevron",
          logo: "/icons/aldevron-4c.png",
          description: "Receive marketing from Aldevron.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Beckman Coulter",
          logo: "/icons/beckmancoulter.png",
          description: "Receive marketing from Beckman Coulter.",
          channels: ["email", "phone"],
        },
        {
          name: "Beckman Coulter Life Sciences",
          logo: "/icons/beckmancoulterls.png",
          description: "Receive marketing from Beckman Coulter Life Sciences.",
          channels: ["email", "phone"],
        },
        {
          name: "Cepheid",
          logo: "/icons/cepheid.png",
          description: "Receive marketing from Cepheid.",
          channels: ["email"],
        },
        {
          name: "Cytiva",
          logo: "/icons/cytiva.png",
          description: "Receive marketing from Cytiva.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Genedata",
          logo: "/icons/genedata.png",
          description: "Receive marketing from Genedata.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "HemoCue",
          logo: "/icons/HemoCue.png",
          description: "Receive marketing from HemoCue.",
          channels: ["email", "phone"],
        },
        {
          name: "IDBS",
          logo: "/icons/idbs-4c.png",
          description: "Receive marketing from IDBS.",
          channels: ["email"],
        },
        {
          name: "IDT",
          logo: "/icons/idt.png",
          description: "Receive marketing from IDT.",
          channels: ["email"],
        },
        {
          name: "Leica Biosystems",
          logo: "/icons/leica-biosystems.png",
          description: "Receive marketing from Leica Biosystems.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Leica Microsystems",
          logo: "/icons/leica-microsystems-4c.png",
          description: "Receive marketing from Leica Microsystems.",
          channels: ["email"],
        },
        {
          name: "Mammotome",
          logo: "/icons/mammotome.png",
          description: "Receive marketing from Mammotome.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Molecular Devices",
          logo: "/icons/molecular-devices-4c.png",
          description: "Receive marketing from Molecular Devices.",
          channels: ["email"],
        },
        {
          name: "Pall",
          logo: "/icons/pall.png",
          description: "Receive marketing from Pall.",
          channels: ["email", "phone"],
        },
        {
          name: "Phenomenex",
          logo: "/icons/phenomenex.png",
          description: "Receive marketing from Phenomenex.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Radiometer",
          logo: "/icons/radiometer.png",
          description: "Receive marketing from Radiometer.",
          channels: ["email", "phone", "sms"],
        },
        {
          name: "Sciex",
          logo: "/icons/sciex-4c.png",
          description: "Receive marketing from Sciex.",
          channels: ["email", "phone"],
        },
      ],
    };
  }
}

const subscriptionData = getSubscriptionData();
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
    showModalwithRefresh(
      "Unable to load your subscription data. Please refresh the page and try again.",
      false
    );
    console.error("Subscription API Error:", error);
    throw error;
  }
}

async function loadChannelData(emailHash) {
  try {
    const data = await fetchSubscriptions(emailHash);
    channelData = data;

    // ADD THIS LINE ↓↓↓
    applyChannelDataToUI();

    storeInitialState();
  } catch (error) {
    console.error("Error fetching subscription:", error);
    // Show error popup to user
    showModalwithRefresh(
      "Unable to load your subscription data. Please refresh the page and try again.",
      false
    );
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

function updateToggleState(sub) {
  const checkboxes = document.querySelectorAll(
    `input[type=checkbox][data-sub='${sub}']`
  );
  const master = document
    .getElementById(`${sub}-toggle`)
    .parentElement.querySelector("input");
  let grantedCount = 0;
  let deniedCount = 0;
  checkboxes.forEach((cb) => {
    if (cb.classList.contains("granted")) grantedCount++;
    if (cb.classList.contains("denied")) deniedCount++;
  });
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
// APPLY CHANNEL DATA TO UI
// ======================
function applyChannelDataToUI() {
  if (!channelData?.data?.topics) {
    console.warn("No channel data found — skipping UI mapping");
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

    if (topicObj && topicObj.mail && topicObj.mail.status === "granted") {
      sub.channels.forEach((channel) => {
        const cb = document.querySelector(
          `input[type=checkbox][data-sub='${sub.name}'][data-channel='${channel}']`
        );
        if (!cb) return;

        cb.classList.remove("granted", "denied"); // force NULL
      });

      updateToggleState(sub.name);
      return; // skip rest for this OPCO
    }

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

function buildCards() {
  const container = document.getElementById("consent-body");
  subscriptionData.subscriptions.forEach((sub) => {
    const card = document.createElement("div");
    card.className = "subscription-card";
    const logoDiv = document.createElement("div");
    logoDiv.className = "sub-logo-side";
    logoDiv.style.backgroundImage = `url(${sub.logo})`;
    card.appendChild(logoDiv);
    const content = document.createElement("div");
    content.className = "subscription-content";

    const header = document.createElement("div");
    header.className = "subscription-header";
    const name = document.createElement("span");
    name.textContent = sub.name;
    header.appendChild(name);

    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "toggle-with-info";

    const masterSwitch = createSwitch(`${sub.name}-toggle`);
    toggleWrapper.appendChild(masterSwitch);

    header.appendChild(toggleWrapper);
    content.appendChild(header);

    const desc = document.createElement("div");
    desc.className = "subscription-description";
    desc.textContent = sub.description;
    content.appendChild(desc);

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
    console.error("checkForChanges failed:", err);
    setSaveButtonEnabled(true);
  }
}

function savePreferences() {
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
function debugLog(...args) {
  if (CONFIG.debug) console.log("[DEBUG]", ...args);
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
async function updateConsent(changedSubs) {
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
    console.error("Boomi API Error:", error);
    throw error;
  }
}

// ======================
// UI COMPONENTS
// ======================

function showSaveModal(message, isSuccess = true) {
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
            console.error("Failed to save preferences:", err);
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
  let isEmailValid = false;

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

        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
      } else {
        // VALID EMAIL
        errorMsg.innerText = "";
        errorMsg.style.visibility = "hidden";

        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
      }
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

  // SUBMIT BUTTON (DISABLED UNTIL EMAIL IS VALID)
  const submitButton = button(
    {
      id: "email-submit",
      disabled: true,
      class: `mb-4 px-4 py-2 mb-2 rounded bg-danaherpurple-800 text-white`,
      style:
        "margin-left:auto;display:block;margin-right:20px;margin-bottom:20px;opacity:0.5;cursor:not-allowed;",
      onClick: () => {
        const emailInput = document.getElementById("email-input");
        const emailValue = emailInput.value.trim();
        emailprocessing(emailValue);
        document.body.removeChild(modal);
      },
    },
    "Submit"
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
      emailError
    ),
    submitButton
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
        console.error("Email processing failed:", error);
      }
    })();
  } else {
    showEmailPopup();
  }
}
export default async function decorate(block) {
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
           <div class="info-icon-wrapper">
              <span class="info-icon" tabindex="0" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
                </svg>
              </span>
              <label class="switch dummy-toggle header-dummy-toggle pointer-events" aria-hidden="true" title="Dummy toggle">
                <input type="checkbox" disabled>
                <span class="slider"></span>
              </label>
              <div class="info-tooltip">
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
              </div>
           </div>
           <button class="header-btn" onclick="savePreferences()">Save</button>
        </div>
   </div>
   <div id="message">Msg</div>
   <div class="preferences-sticky-bar">
      <h2>Your Preferences</h2>
      <p>
         Here you can manage your preferences regarding the marketing you currently receive. By ticking relevant boxes below
         you can manage whether and how Danaher group companies can contact you. You can withdraw your consent at any time.
         For more information please review our <a href="https://danaher.com/data-privacy-notice" target="_blank">privacy
         policy</a>.
      </p>
   </div>
   <div id="consent-body" class="subs"></div>
</div>
  `;

  buildCards();
  setSaveButtonEnabled(false);
  try {
    applyChannelDataToUI();
    storeInitialState();
    checkForChanges();
  } catch (err) {
    console.warn(
      "applyChannelDataToUI/storeInitialState initial run failed:",
      err
    );
  }

  setTimeout(() => {
    const infoIcon = document.querySelector(".info-icon");
    const wrapper = infoIcon?.closest(".info-icon-wrapper");
    const tooltip = wrapper?.querySelector(".info-tooltip");
    if (infoIcon && tooltip) {
      // add a small delay when hiding so quick moves between icon and toggle don't hide tooltip
      let tooltipHideTimeout = null;
      wrapper.addEventListener("mouseenter", () => {
        if (tooltipHideTimeout) {
          clearTimeout(tooltipHideTimeout);
          tooltipHideTimeout = null;
        }
        tooltip.style.display = "block";
      });

      wrapper.addEventListener("mouseleave", () => {
        tooltipHideTimeout = setTimeout(() => {
          tooltip.style.display = "none";
          tooltipHideTimeout = null;
        }, 150);
      });

      // Ensure the dummy toggle is clickable/hoverable and shows pointer cursor
      const headerToggle = wrapper.querySelector(".header-dummy-toggle");
      if (headerToggle) {
        headerToggle.style.cursor = "pointer";
        headerToggle.style.pointerEvents = "auto";
        // remove aria-hidden so it can receive focus if needed
        if (headerToggle.getAttribute("aria-hidden") === "true") {
          headerToggle.removeAttribute("aria-hidden");
        }
      }

      // show tooltip on hover/focus
      infoIcon.addEventListener("mouseenter", () => {
        tooltip.style.display = "block";
      });
      infoIcon.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
      infoIcon.addEventListener("focus", () => {
        tooltip.style.display = "block";
      });
      infoIcon.addEventListener("blur", () => {
        tooltip.style.display = "none";
      });
    }
  }, 0);
  const url = new URL(window.location.href);
  const emailParamRaw = url.searchParams.get("emailid");
  emailprocessing(emailParamRaw, url);
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
    console.error("Floating email icon failed to initialize", err);
  }
}
