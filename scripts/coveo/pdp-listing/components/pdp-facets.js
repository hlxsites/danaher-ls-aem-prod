/* eslint-disable */
import {
  productTypeFacetController,
  brandFacetController,
  documentTypeFacetController,
  searchBoxController,
  modificationFacetController,
  //specificationsFacetController,
  unitOfMeasureFacetController,
  skuSizeDetailsFacetController,
  //specificationsjsonFacetController,
} from "../controllers/pdp-controllers.js";
import { createFiltersPanel } from "./pdp-side-panel.js";
import { renderFacetBreadcurm } from "./pdp-facet-breadcrumb.js";

let persistentSearchText = "";

export function renderCreateFacet() {
  const container = document.getElementById("filters-container");
  if (container) container.innerHTML = "";
  // === Main Filters Row ===
  const mainRow = document.createElement("div");
  mainRow.className = "flex flex-wrap md:flex-row items-start md:items-center gap-2 sm:gap-4 md:gap-6 bg-white";

  // All Filters button
  const allFiltersBtn = document.createElement("button");
  allFiltersBtn.className =
    "flex mr-[70px] md:m-auto md:w-auto w-40 items-center gap-1 border px-3 py-[6px] rounded hover:bg-gray-100 text-black text-sm leading-5 font-normal";
  allFiltersBtn.innerHTML = `<span><img src="/icons/adjustments-black.svg" alt="arrow icon" width="20" height="21" /></span> All Filters`;
  allFiltersBtn.id = "openFiltersBtn";

  allFiltersBtn.addEventListener("click", async () => {
    let panel = document.getElementById("filtersPanel");

    if (!panel) {
      panel = createFiltersPanel();
      renderFacetBreadcurm();
    }

    let modalOverlay = document.getElementById("modalOverlay");
    panel.style.transform = "translateX(0)";
    modalOverlay.classList.remove("hidden");
  });

  mainRow.appendChild(allFiltersBtn);

  // Create and append selects
  function createCustomDropdown(controller, placeholderText) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = "relative inline-block";

    // Button
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "w-full border border-danahergray-300 bg-danahergray-100 px-3 py-[6px] rounded text-left focus:outline-none flex items-center gap-1 text-gray-500 text-sm leading-5 font-normal";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = placeholderText;
    button.appendChild(labelSpan);

    const chevron = document.createElement("span");
    chevron.innerHTML = `<img src="/icons/chevron-down.svg" alt="arrow icon" width="20" height="21" />`;
    button.appendChild(chevron);

    // Dropdown Menu
    const menu = document.createElement("ul");
    menu.className =
      "absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto hidden";

    // Recursive renderer
    function renderTreeNodes(nodes, level = 0) {
      let isOpen = false;
      const ul = document.createElement("ul");
      ul.className = `${level > 0 ? "ml-7" : ""} list-none m-0 p-0`;

      nodes.forEach((node) => {
        const li = document.createElement("li");
        li.className = "mb-1";

        const row = document.createElement("div");
        row.className =
          "flex gap-2 items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700";

        const label = document.createElement("span");
        label.textContent = `${node.value} (${node.numberOfResults})`;
        if (node.state === "selected") {
          label.classList.add("font-semibold", "text-danaherpurple-500");
        }

        // If has children -> add chevron
        if (node.children && node.children.length > 0) {
          const arrow = document.createElement("span");
          arrow.innerHTML = `<img src="/icons/chevron-left-pdp.svg" alt="arrow icon" width="20" height="21" />`;
          row.appendChild(arrow);
          row.appendChild(label);

          // Toggle children visibility
          row.addEventListener("click", (e) => {
            e.stopPropagation();
            controller.deselectAll();
            labelSpan.textContent = node.value;
            setTimeout(rebuildMenu, 100);
          });
        } else {
          row.appendChild(label);
          const arrow = document.createElement("span");
          arrow.innerHTML = `<img src="/icons/chevron-right.svg" alt="arrow icon" width="20" height="21" />`;
          if (node.path.length === 1) {
            row.appendChild(arrow);
          }
          row.addEventListener("click", (e) => {
            e.stopPropagation();
            controller.toggleSelect(node);
            labelSpan.textContent = node.value;
            setTimeout(rebuildMenu, 100);
          });
        }

        li.appendChild(row);

        // Render children
        if (node.children && node.children.length > 0) {
          const childUl = renderTreeNodes(node.children, level + 1);
          li.appendChild(childUl);
        }
        ul.appendChild(li);
      });

      return ul;
    }

    function rebuildMenu() {
      menu.innerHTML = "";
      if (controller.state.valuesAsTrees &&
          controller.state.valuesAsTrees.length > 0) {
        menu.appendChild(renderTreeNodes(controller.state.valuesAsTrees));
      } else {
        const { values } = controller.state;
        if (values && values.length > 0) {
          values.forEach((item) => {
            const option = document.createElement("li");
            option.textContent = item.label || item.value;
            option.className =
              "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700";

            if (item.state === "selected") {
              labelSpan.textContent = item.label || item.value;
              option.classList.add("font-semibold", "text-indigo-600");
            }

            option.addEventListener("click", () => {
              controller.toggleSelect(item);
              menu.classList.add("hidden");
              // chevron.querySelector('svg').classList.remove('rotate-180');
              setTimeout(rebuildMenu, 100);
            });
            menu.appendChild(option);
          });
        }
      }
    }

    // Initial build
    rebuildMenu();

    // Toggle dropdown and rotate chevron
    button.addEventListener("click", () => {
      const isHiddenNow = menu.classList.toggle("hidden");
      chevron.querySelector("svg")?.classList.toggle("rotate-180", !isHiddenNow);
    });

    // Click outside closes dropdown and resets chevron
    document.addEventListener("click", (e) => {
      if (!dropdownContainer.contains(e.target)) {
        menu.classList.add("hidden");
        chevron.querySelector("svg")?.classList.remove("rotate-180");
      }
    });

    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(menu);
    return dropdownContainer;
  }

  if (productTypeFacetController.state.valuesAsTrees.length >= 1) {
    mainRow.appendChild(createCustomDropdown(productTypeFacetController, "Product Type"));
  }
  if (brandFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(brandFacetController, "Brand"));
  }
  //Modification filter
  if (modificationFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(modificationFacetController, "Modification"));
  }
  //Specifications filter
  // if (specificationsFacetController.state.values.length >= 1) {
  //   mainRow.appendChild(createCustomDropdown(specificationsFacetController, "Specifications"));
  // }
  //Unit of Measure filter
  if (unitOfMeasureFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(unitOfMeasureFacetController, "Unit of Measure"));
  }
  //Sku Size filter filter
  if (skuSizeDetailsFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(skuSizeDetailsFacetController, "Sku Size Details"));
  }
  // //Specifications Json filter
  // if (specificationsjsonFacetController.state.values.length >= 1) {
  //   mainRow.appendChild(createCustomDropdown(specificationsjsonFacetController, "ModificationSJ"));
  // }
  if (documentTypeFacetController.state.values.length >= 1) {
    mainRow.appendChild(createCustomDropdown(documentTypeFacetController, "Document Type"));
  }

  // === Search Box ===
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "relative w-full md:flex-1";

  const search = document.createElement("input");
  search.type = "text";
  search.id = "pdpSearchInput";
  search.placeholder = "Search by product name";
  search.className =
    "border p-8 pr-9 py-[6px] rounded w-full text-sm bg-gray-100 focus:outline-none";

  // Restore persistent text
  search.value = persistentSearchText !== "" ? persistentSearchText : (searchBoxController.state.q || "");

  searchWrapper.appendChild(search);

  search.addEventListener("input", (e) => {
    persistentSearchText = e.target.value;
    // Optionally if blank, you may want to clear state
    if (persistentSearchText.trim() === "") {
      // Only clear internal state; don't force a re-render or form submit
      searchBoxController.clear();
      searchBoxController.submit();
    }
  });

  const iconSpan = document.createElement("span");
  iconSpan.className =
    "absolute top-0 flex items-center justify-center pointer-events-none p-3";
  iconSpan.innerHTML = `<img src="/icons/search-icon-pdp.svg" alt="search icon" width="20" height="21" />`;
  searchWrapper.appendChild(iconSpan);

  mainRow.appendChild(searchWrapper);

  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();  
      // Use the current persistentSearchText
      searchBoxController.updateText(persistentSearchText);
      searchBoxController.submit();
    }
  });

  // Append both rows
  if (container) container.appendChild(mainRow);
}
