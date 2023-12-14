
require(["esri/chunks/panel"], (panel) => {
  Object.defineProperty(panel.Panel, "style", {
    get: function () {
      return `
@keyframes in {
  0% { opacity: 0 }
  100% { opacity: 1 }
}

@keyframes in-down {
  0% { opacity: 0; transform: translate3D(0, -5px, 0) }
  100% { opacity: 1; transform: translate3D(0, 0, 0) }
}

@keyframes in-up {
  0% { opacity: 0; transform: translate3D(0, 5px, 0) }
  100% { opacity: 1; transform: translate3D(0, 0, 0) }
}

@keyframes in-right {
  0% { opacity: 0; transform: translate3D(-5px, 0, 0) }
  100% { opacity: 1; transform: translate3D(0, 0, 0) }
}

@keyframes in-left {
  0% { opacity: 0; transform: translate3D(5px, 0, 0) }
  100% { opacity: 1; transform: translate3D(0, 0, 0) }
}

@keyframes in-scale {
  0% { opacity: 0; transform: scale3D(0.95, 0.95, 1) }
  100% { opacity: 1; transform: scale3D(1, 1, 1) }
}

:root {
  --calcite-animation-timing: calc(150ms * var(--calcite-internal-duration-factor));
  --calcite-internal-duration-factor: var(--calcite-duration-factor, 1);
  --calcite-internal-animation-timing-fast: calc(100ms * var(--calcite-internal-duration-factor));
  --calcite-internal-animation-timing-medium: calc(200ms * var(--calcite-internal-duration-factor));
  --calcite-internal-animation-timing-slow: calc(300ms * var(--calcite-internal-duration-factor));
  --calcite-ui-foreground-1: #13444b;
}

.calcite-animate {
  opacity: 0;
  animation-fill-mode: both;
  animation-duration: var(--calcite-animation-timing);
}

.calcite-animate__in {
  animation-name: in;
}

.calcite-animate__in-down {
  animation-name: in-down;
}

.calcite-animate__in-up {
  animation-name: in-up;
}

.calcite-animate__in-right {
  animation-name: in-right;
}

.calcite-animate__in-left {
  animation-name: in-left;
}

.calcite-animate__in-scale {
  animation-name: in-scale;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --calcite-internal-duration-factor: 0.01;
  }
}

:host {
  box-sizing: border-box;
  background-color: #13444b;
  color: var(--calcite-ui-text-2);
  font-size: var(--calcite-font-size--1);
}

:host * {
  box-sizing: border-box;
}

:root {
  --calcite-floating-ui-transition: var(--calcite-animation-timing);
  --calcite-floating-ui-z-index: var(--calcite-app-z-index-dropdown);
}

:host([hidden]) {
  display: none;
}

:host([disabled]) {
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
  opacity: var(--calcite-ui-opacity-disabled);
}

:host([disabled]) *,
:host([disabled]) ::slotted(*) {
  pointer-events: none;
}

:host {
  position: relative;
  display: flex;
  block-size: 100%;
  inline-size: 100%;
  flex: 1 1 auto;
  overflow: hidden;
  --calcite-min-header-height: calc(var(--calcite-icon-size) * 3);
  --calcite-panel-footer-padding: 0.5rem;
}

:host([disabled]) ::slotted([calcite-hydrated][disabled]),
:host([disabled]) [calcite-hydrated][disabled] {
  opacity: 1;
}

.header {
  margin: 0px;
  display: flex;
  align-content: space-between;
  align-items: center;
  fill: var(--calcite-ui-text-2);
  color: var(--calcite-ui-text-2);
}

.heading {
  margin: 0px;
  padding: 0px;
  font-weight: var(--calcite-font-weight-medium);
}

.header .heading {
  flex: 1 1 auto;
  padding: 0.5rem;
}

.container {
  margin: 0px;
  display: flex;
  inline-size: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  background-color: #13444b;
  padding: 0px;
  transition: max-block-size var(--calcite-animation-timing), inline-size var(--calcite-animation-timing);
}

.container[hidden] {
  display: none;
}

.header {
  border-block-end: 1px solid;
  z-index: var(--calcite-app-z-index-header);
  inline-size: 100%;
  align-items: stretch;
  justify-content: flex-start;
  background-color: var(--calcite-ui-foreground-1);
  border-block-end-color: var(--calcite-ui-border-3);
  flex: 0 0 auto;
}

.action-bar-container {
  border-block-end: 1px solid;
  z-index: var(--calcite-app-z-index-header);
  inline-size: 100%;
  border-block-end-color: var(--calcite-ui-border-3);
}

.action-bar-container ::slotted(calcite-action-bar) {
  inline-size: 100%;
}

.header-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-inline: 0.75rem;
  padding-block: 0.875rem;
  margin-inline-end: auto;
}

.header-content .heading,
.header-content .description {
  display: block;
  overflow-wrap: break-word;
  padding: 0px;
}

.header-content .heading {
  margin-inline: 0px;
  margin-block: 0px 0.25rem;
  font-size: var(--calcite-font-size-0);
  line-height: 1.25rem;
  font-weight: var(--calcite-font-weight-medium);
}

.header-content .heading:only-child {
  margin-block-end: 0px;
}

.header-content .description {
  font-size: var(--calcite-font-size--1);
  line-height: 1rem;
  color: var(--calcite-ui-text-2);
}

.back-button {
  border-width: 0px;
  border-style: solid;
  border-color: var(--calcite-ui-border-3);
  border-inline-end-width: 1px;
}

.header-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}

.header-actions--end {
  margin-inline-start: auto;
}

.content-wrapper {
  overflow: auto;
  padding-bottom: 3px;
}

.content-height {
  block-size: 100%;
}

.content-container {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  background-color: #13444b;
}

.footer {
  border-block-start: 1px solid;
  display: flex;
  inline-size: 100%;
  justify-content: space-evenly;
  background-color: var(--calcite-ui-foreground-1);
  border-block-start-color: var(--calcite-ui-border-3);
  flex: 0 0 auto;
  padding: var(--calcite-panel-footer-padding);
}

.fab-container {
  position: sticky;
  inset-block-end: 0px;
  z-index: var(--calcite-app-z-index-sticky);
  margin-block: 0px;
  margin-inline: auto;
  display: block;
  padding: 0.5rem;
  inset-inline: 0;
  inline-size: -moz-fit-content;
  inline-size: fit-content;
}

[hidden] {
  display: none;
}
      `;
    },
  });
});



require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/WebTileLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/widgets/Zoom",
    "esri/widgets/Print",
    "esri/symbols/SimpleLineSymbol",
    "esri/core/Collection",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/widgets/LayerList",
    "esri/rest/support/Query",
    
  ], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home, Zoom, Print, SimpleLineSymbol, Collection, GraphicsLayer, Graphic, SimpleFillSymbol, LayerList, Query, SimpleMarkerSymbol, PictureMarkerSymbol) => {
    let selectedField;
    let selectedTrailField;
    let clusterConfig;
    let isAnyFieldSelected = false;
    let isAnyTrailFieldSelected = false;
    let isClusteringEnabled = false;
    let isTaskRunning = false;

    console.log('Script loaded!');
    /******************** LAYER LINKS  *********************/
    
    let baseLayerLink = "https://api.mapbox.com/styles/v1/anovak/cll6duwmo00at01pw0c28g05a/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg";
    let baseLayerLabelsLink = "https://api.mapbox.com/styles/v1/anovak/clkvo8z6e001j01q0b8ln9s7j/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg";

    // boundaries

    let tourismRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Tourism_Regions/FeatureServer";
    let cedrRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_CEDR/FeatureServer";
    let newHampshireCountiesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Counties/FeatureServer";
    let newHampshireTownshipsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_Political_Boundaries/FeatureServer";
    let newHampshireLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_State_Boundary/FeatureServer";
    
    // business census data

    let retailBusinessesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Retail_Service_Businesses/FeatureServer";
    let recreationProvidersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Recreation_Providers/FeatureServer";
    let b2bManufacturersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/B2B_and_Manufacturers/FeatureServer";
    let nonProfitsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Non_Profit_Organizations/FeatureServer";
    let currentLayerLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Retail_Service_Businesses/FeatureServer";
  
    // NH rec layers

    let NHwaterAccessLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Access_Sites_To_Public_Waters/FeatureServer";
    let NHtrailsLinesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreational_Trails_(Polylines)/FeatureServer";
    let NHrecAreasLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreation_Inventory_(Areas)/FeatureServer";
    let NHrecPointsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreational_Trails_(Points)/FeatureServer";
    let NHstateLandsLink = "https://services8.arcgis.com/hg1B9Egwk1I5p300/ArcGIS/rest/services/State_Lands_View/FeatureServer&source=sd";
    let NHconsvLandLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_Conservation_Public_Lands/FeatureServer";
    let NHdncrStateLandsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_DCNRStateLands/FeatureServer";
  
    var allowedLayers = ["NHconsvLand", "NHrecAreas", "NHrecPoints", "NHtrailsLines", "NHwaterAccess", "NHstateLands", "NHdncrstateLands"];
    
    let currentQueryId = null;
    let controller = new AbortController();
    let signal = controller.signal;




  /************************ DEBOUNCE FUNCTION ***********************/



  function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}




  /************************ POPULATE FILTER FIELDS AND CHANGE DATA SOURCE ********************** */
  
  let filterFieldsMap = [];
  function populateFilterDiv(filterFields) {
    filterDiv.innerHTML = '';

    // Create a container for the category title and buttons
    const headerContainer = document.createElement('div');
    headerContainer.className = 'header-container';
    filterDiv.appendChild(headerContainer);

    // Initialize variable for the category title
    let categoryTitleElement = null;

    // Handle filterFields items
    filterFields.forEach(item => {
        if (item.fieldlabel) {
            // Create category title element
            categoryTitleElement = document.createElement('h3');
            categoryTitleElement.className = 'category-title';
            categoryTitleElement.textContent = item.fieldlabel;
        } else if (item.label) {
            // Handle additional text as separate elements
            const textElement = document.createElement('p');
            textElement.innerHTML = item.label;
            filterDiv.appendChild(textElement);
        } else {
            // Handle checkbox creation
            const div = document.createElement('div');
            div.className = 'checkbox-container'; // Assign class to the container
            
            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = item.id;
            checkbox.className = 'checkbox-style'; // Assign class to the checkbox
            checkbox.addEventListener('change', function() {
              applyFilter();
           
          });
            div.appendChild(checkbox);
            
            // Create label
            const label = document.createElement('label');
            label.htmlFor = item.id;
            label.textContent = item.displayName;
            label.className = 'checkbox-label'; // Assign class to the label
            div.appendChild(label);
            
            filterDiv.appendChild(div);
        }
    });

    // Add category title to the header container
    if (categoryTitleElement) {
        headerContainer.appendChild(categoryTitleElement);
    }

    // Create the Filter Mode toggle button
    const filterModeButton = document.createElement('button');
    filterModeButton.id = 'toggleFilterMode';
    filterModeButton.textContent = 'Filter Mode: AND';
    headerContainer.appendChild(filterModeButton);
    
    // Create the Clear Filters button
    const clearFiltersButton = document.createElement('button');
    clearFiltersButton.id = 'clearFilters';
    clearFiltersButton.textContent = 'Clear Filters';
    headerContainer.appendChild(clearFiltersButton);

    // Attach event listeners to buttons
    document.getElementById('toggleFilterMode').addEventListener('click', toggleFilterMode);
    document.getElementById('clearFilters').addEventListener('click', clearSelectedLayers);
}

function handleExclusiveCheckboxes(selectedCheckboxId) {
    console.log("Called handleExclusiveCheckboxes with:", selectedCheckboxId);

    const exclusiveCheckboxes = ['filterNationalChain', 'filterRegionalChain', 'filterLocalBusiness'];
    if (exclusiveCheckboxes.includes(selectedCheckboxId)) {
        exclusiveCheckboxes.forEach(checkboxId => {
            if (checkboxId !== selectedCheckboxId) {
                document.getElementById(checkboxId).checked = false;
            }
        });
    }
}

function toggleFilterMode() {
  filterMode = filterMode === 'AND' ? 'OR' : 'AND';
  this.textContent = `Filter Mode: ${filterMode}`;

  // Check if any checkbox is active before applying filters
  const isAnyCheckboxActive = filterFieldsMap.some(item => document.getElementById(item.id) && document.getElementById(item.id).checked);
  if (isAnyCheckboxActive) {
      applyFilter(); // Apply filters only if at least one checkbox is active
  }
}

function updateFields(datasetName) {
  console.log('[updateFields] Initialization started for:', datasetName);

  // Set layer visibility to false and remove any existing clusters
  layer.visible = false;
  pseudoClusterLayer.removeAll();

  let selectedCategoryTitle;
  switch (datasetName) {
      case 'retailBusiness':
          selectedCategoryTitle = "Retail-Service Businesses";
          filterFieldsMap = filterFieldsRetBus;
          currentLayerLink = retailBusinessesLink;
          break;
      case 'recreationProviders':
          selectedCategoryTitle = "Recreation Providers";
          filterFieldsMap = filterFieldsRecProv;
          currentLayerLink = recreationProvidersLink;
          break;
      case 'b2bManufacturers':
          selectedCategoryTitle = "Services and Manufacturers";
          filterFieldsMap = filterFieldsB2B;
          currentLayerLink = b2bManufacturersLink;
          break;
      case 'nonProfits':
          selectedCategoryTitle = "Non-Profit Organizations";
          filterFieldsMap = filterFieldsNonProfits;
          currentLayerLink = nonProfitsLink;
          break;
      default:
          console.log('[updateFields] Unknown dataset:', datasetName);
          return; // Exit the function for unknown dataset
  }

  layer.url = currentLayerLink;
  map.layers.remove(layer);
  layer.load().then(() => {
      map.layers.add(layer);
  }).catch(error => {
      console.error("[updateFields] Error loading the layer:", error);
  });

  // Populate the filter div with checkboxes, toggle button, and category title
  populateFilterDiv(filterFieldsMap);

  // Apply filters based on the selected dataset
  applyFilter();

  // Check clustering status and boundary layer visibility
  if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
      console.log('[updateFields] Applying polygon clustering.');
      debouncedApplyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
      layer.visible = false;
  } else if (isClusteringEnabled) {
      console.log('[updateFields] Drawing clusters.');
      drawCluster();
  } else {
      console.log('[updateFields] Clustering is disabled. Applying filter.');
      layer.visible = true; // Ensure layer is visible when clustering is disabled
      applyFilter();
  }

  console.log('[updateFields] End of function execution. Layer URL:', layer.url, 'Layer visibility:', layer.visible);
}

const debouncedUpdateFields = debounce(updateFields, 20);

// Initial load to show 'retailBusiness' fields
window.onload = function() {
  updateFields('retailBusiness');
  layer.featureReduction = null;
  layer.effect = "bloom(3.5, 0.1px, 5%)";
};
  /************************ LABEL CLASSES***************************/
  const trailsLabelClass = {
    // autocasts as new LabelClass()
    symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "rgba(254, 250, 181  , 1)",
        haloSize: 1,
        haloColor: "#13444b"
    },
    labelPlacement: "center-along",  // This will make the label follow the path of the line
    labelExpressionInfo: {
        expression: "$feature.TRAILNAME"
    },
    minScale: 150000,  // Example scale value; adjust this for the desired zoom level
    maxScale: 0
  };
  
  const stateLandsLabels = { 
    symbol: {
      type: "text",  
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: {  
         family: "Montserrat",
         size: 10
       }
    },
    labelPlacement: "above-right",
    labelExpressionInfo: {
      expression: "$feature.Property"
    },
    maxScale: 0,
    minScale: 250000,
  };
  
  const cedrRegionsLabels = { 
    symbol: {
      type: "text",  
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: {  
         family: "Montserrat",
         style: "italic",
         size: 8
       },
       yoffset: 10 
    },
    labelPlacement: "above-right",
    labelExpressionInfo: {
      expression: "$feature.CEDR"
    },
    maxScale: 0,
    minScale: 25000000,
  };
  
  const townshipLabels = { 
    symbol: {
      type: "text",  
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: {  
         family: "Montserrat",
         size: 8
       },
       yoffset: 10
    },
    labelPlacement: "above-right",
    labelExpressionInfo: {
      expression: "$feature.pbpNAME"
    },
    maxScale: 0,
    minScale: 750000,
  };
  
  const countyLabels = { 
    symbol: {
      type: "text",  
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: { 
         family: "Montserrat",
         style: "italic",
         size: 10
       },
      // Add vertical offset to the symbol. Positive value moves label downwards, negative moves it upwards.
      yoffset: 10  // adjust this value as needed
    },
    labelPlacement: "below-along",
    labelExpressionInfo: {
      expression: "$feature.County"
    },
    maxScale: 0,
    minScale: 25000000,
  };
    const tourismRegionsLabels = { 
      symbol: {
        type: "text",  
        color: "white",
        haloColor: "#285a62",
        haloSize: 1,
        font: { 
           family: "Montserrat",
           style: "italic",
           size: 10,
           weight: 500 
         },
         yoffset: 10 
      },
      labelPlacement: "above-right",
      labelExpressionInfo: {
        expression: "$feature.TourismReg"
      },
      maxScale: 0,
      minScale: 25000000,
    };
  
  /************************** LAYER IMPORTS **********************/
  

  

  const layer = new FeatureLayer({
    url: currentLayerLink,
    featureReduction: clusterConfig,
    popupTemplate: {
      title: "{Name}",
      content:`
      Town or City: {Town_or_City}<br>
      Website: <a href='{Website}' target='_blank'>{Website}</a><br>
      Physical Address: {Physical_Address}<br>
      E-mail: <a href='mailto:{E_mail}'>{E_mail}</a><br>
      Phone: {Phone}<br>
    `,
      
      fieldInfos: [
        // Add additional fieldInfos for other properties you want to display in the popup
      ]
    },
  renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          size: 4,
          color: "rgba(158, 243, 171, 0.4)",
          outline: {
            color: "rgba(158, 243, 171, 0.07)",
            width: 8
          }
        }
      }
    });
  
    const abaseLayer = new FeatureLayer({
      portalItem: {
        id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
      },
      legendEnabled: false,
      popupEnabled: false,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [23, 65, 65, .2],
          outline: {
            color: [50, 50, 50, 0.0],
            width: 0.5
          }
        }
      },
      spatialReference: {
        wkid: 102113
      }
    });
  
    const baseLayer = new WebTileLayer({
      urlTemplate: baseLayerLink,
    });
  
    const baseLayerLabels = new WebTileLayer({
      urlTemplate: baseLayerLabelsLink,
    });
  
  
    /********************* REC POINTS RENDERS *************** */
    let dotRenderer = {
      type: "unique-value",
      field: "TYPE",
      uniqueValueInfos: [
        {
          value: "Trailhead",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#9C4C86",  // Color for Trailhead
            size: 2,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Landmark",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#11A579",  // Color for Landmark
            size: 2,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Scenic View",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#7F3C8D",  // Color for Scenic View
            size: 2,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Natural Attraction",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#11A579",  // Color for Natural Attraction
            size: 2,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Shelter",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#3969AC",  // Color for Shelter
            size: 2,
            outline: {
              width: 0
            }
          }
        },

        {
          value: "Cultural Attraction",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#E73F74",  // Color for Cultural Attraction
            size: 3,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Hut/Lodge/Cabin",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#F64747",  // Color for Hut/Lodge/Cabin
            size: 3,
            outline: {
              width: 0
            }
          }
        },

        {
          value: "Landmark",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#4b4b8f",  // Color for Landmark
            size: 3,
            outline: {
              width: 0
            }
          }
        }
      ]
    }
    
    let picRenderer = {
      type: "unique-value",  // renderer type
      field: "TYPE",
      uniqueValueInfos: [
          {
              value: "Trailhead",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/trailhead.png",
                  width: 7,
                  height: 7
              }
          },
          {
              value: "Landmark",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/landmark.png",
                  width: 8,
                  height: 8
              }
          },
          {
              value: "Scenic View",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/scenicview.png",
                  width: 8,
                  height: 8
              }
          },
          {
              value: "Natural Attraction",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/natural.png",
                  width: 8,
                  height: 8
              }
          },
          {
              value: "Shelter",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/shelter.png",
                  width: 8,
                  height: 8
              }
          },

          {
              value: "Cultural Attraction",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/cultural.png",
                  width: 8,
                  height: 8
              }
          },
          {
              value: "Hut/Lodge/Cabin",
              symbol: {
                  type: "picture-marker",  // symbol type
                  url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/cabin.png",
                  width: 8,
                  height: 8
              }
          },

      ]
  };
   /********************** SUPPLEMENTAL RECREATION LAYERS ****************/
  
   const NHrecAreas = new FeatureLayer({
    url: NHrecAreasLink,
    visible: false,
    minScale: 10000000,  // Layer will not be visible when the map is zoomed out beyond this scale
    maxScale: 0,   
  //  labelingInfo: [stateLandsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(218, 107, 93, .5)",
        outline: {
          color: "rgba(218, 107, 93 , .25)",
          width: .5
        }
      }
    },
  
    popupTemplate: {
      title: "{SITE}",
      content: "Operator: {OPERATOR} <br> Owner Type: {OWN_TYP} <br> Primary Use: {PRIM_USE}"
    },
  
  });
  
  const NHrecPoints = new FeatureLayer({
    url: NHrecPointsLink,
    visible: false,
    renderer: picRenderer,
  
       // No max scale limit
  });
  
  
   const NHtrailsLines = new FeatureLayer({
    url: NHtrailsLinesLink,
    labelingInfo: [trailsLabelClass],
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-line", // Change from "simple-fill" to "simple-line"
      color: "rgba(224, 176, 136   , .8)",
      width: 1,
      style: "short-dot",  // Add this line for a dashed style
      cap: "round",   // Optional: This makes the ends of the dash round.
      join: "round"   // Optional: This makes the junctions between dashes round.
    }
    },
    popupTemplate: {
      title: "{TRAILNAME}",
      content: "Trail System: {TRAILSYS} <br> Community: {COMMUNITY}"
    }
  });

const heatmapRenderer = {
  type: "heatmap",
  colorStops: [
    { color: "rgba(232, 239, 255 , .3)", ratio: 0 },    // Transparent Light Pastel Yellow
    { color: "#A9B9E0", ratio: 0.1 },               // Cornsilk
    { color: "#697ECB", ratio: 0.2 },                // Gold
    { color: "#2F4C99", ratio: 0.3 },               // DarkOrange
    { color: "#1D2882", ratio: 0.4 }  
  ],
  minPixelIntensity: 0,
  maxPixelIntensity: 100,
  radius: 25,
};

const NHwaterAccess = new FeatureLayer({
  url: NHwaterAccessLink,
  visible: false,
  renderer: heatmapRenderer
});


  const NHwaterAccess2 = new FeatureLayer({
    url: NHwaterAccessLink,
    visible: false,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "diamond",
        size: 5,
        color: "rgba(255, 254, 240 , 0.8)",
        outline: {
          color: "rgba(0, 158, 255 , 0.2)",
          width: 4
        }
      }
    }
  });
  

  
  NHwaterAccess2.effect = "bloom(1, 2px, 15%)";
  

  const NHconsvLandRenderer = {
    type: "unique-value",
    field: "OWNERTYPE",
    uniqueValueInfos: [
        {
            value: "1",
            symbol: {
                type: "simple-fill",
                color: "rgba(252, 222, 106  , 0.7)", // Allowed
                outline: {
                    color: "black",
                    width: 0
                }
            },
            label: "Municipal"
        },
        {
            value: "2",
            symbol: {
                type: "simple-fill",
                color: "rgba(252, 222, 106  , 0.7)", // Restricted to Certain Areas
                outline: {
                    color: "black",
                    width: 0
                }
            },
            label: "Federal"
        },
        {
          value: "3",
          symbol: {
              type: "simple-fill",
              color: "rgba(252, 222, 106  , 0.7)", // Restricted to Certain Areas
              outline: {
                  color: "black",
                  width: 0
              }
          },
          label: "State"
      },
      {
        value: "4",
        symbol: {
            type: "simple-fill",
            color: "rgba(252, 222, 106  , 0.7)", // Restricted to Certain Areas
            outline: {
                color: "black",
                width: 0
            }
        },
        label: "Other Public"
    },
    {
      value: "5",
      symbol: {
          type: "simple-fill",
          color: "rgba(252, 222, 106  , 0.7)", // Restricted to Certain Areas
          outline: {
              color: "black",
              width: 0
          }
      },
      label: "Private"
  },
  {
    value: "6",
    symbol: {
        type: "simple-fill",
        color: "rgba(252, 222, 106  , 0.7)", // Restricted to Certain Areas
        outline: {
            color: "black",
            width: 0
        }
    },
    label: "County"
},

    ]
};
  
  const NHconsvLand = new FeatureLayer({
    url: NHconsvLandLink,
    visible: false,
  //  labelingInfo: [stateLandsLabels],
    renderer: NHconsvLandRenderer,
  
  
  });
  
 
  
    const NHstateLands = new FeatureLayer({
      url: NHstateLandsLink,
    //  labelingInfo: [stateLandsLabels],
      visible: false,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(223, 255, 176 , .5",
          outline: {
            color: "rgba(223, 255, 176  , .1)",
            width: 1
          }
        }
      },
  
    });
  
    const NHdncrstateLands = new FeatureLayer({
      url: NHdncrStateLandsLink,
      visible: false,
     // labelingInfo: [stateLandsLabels],
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(174, 228, 187, .25)",
          outline: {
            color: "rgba(105, 141, 114 , .5)",
            width: 1
          }
        }
      },
  
    });
  
  /******************** BOUNDARY LAYERS  *****************/
  
    const cedrRegions = new FeatureLayer({
      url: cedrRegionsLink,
      labelingInfo: [cedrRegionsLabels],
      outFields: ["*"],
     
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(168, 0, 0, 0.00)",
          outline: {
            color: "rgba(201, 255, 238, .5)",
            width: 1.5
          }
        }
      },
      
    });
  
  
    const tourismRegions = new FeatureLayer({
      url: tourismRegionsLink,
      labelingInfo: [tourismRegionsLabels],
      
      outFields: ["*"],
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(168, 0, 0, 0.00)",
          outline: {
            color: "rgba(201, 255, 238, .5)",
            width: 1.5
          }
        }
      },
      
    });
  
    const newHampshireCounties = new FeatureLayer({
      url: newHampshireCountiesLink,
      labelingInfo: [countyLabels],
      
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(168, 0, 0, 0.00)",
          outline: {
            color: "rgba(201, 255, 238, .5)",
            width: 1.5
          }
        }
      },
      
    });
  
    const newHampshireTownships = new FeatureLayer({
      url: newHampshireTownshipsLink,
      labelingInfo: [townshipLabels],
      outFields: ["*"],
      
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(168, 0, 0, 0.00)",
          outline: {
            color: "rgba(201, 255, 238, .25)",
            width: 0.5
          }
        }
      },
      
    });
  
    const newHampshire = new FeatureLayer({
      url: newHampshireLink,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(168, 0, 0, 0.00)",
          outline: {
            color: "rgba(179, 255, 152, 1)",
            width: 1
          }
        }
      },
     
    });
  
  
  /*********************** REC POINTS TOGGLE ****************************/
  document.getElementById('NHconsvLandToggle').addEventListener('change', function() {
    const isChecked = this.checked;
    NHconsvLand.visible = isChecked;
    document.getElementById('NHconsvLandAccessOptions').style.display = isChecked ? 'block' : 'none';
  });
  
  const checkboxFilters = document.querySelectorAll('.NHrecAreasFilter');
  
  const updateNHconsvLandFilter = () => {
    // Collect all selected checkbox values
    const selectedValues = [];
    checkboxFilters.forEach(function(checkbox) {
      if (checkbox.checked) {
        selectedValues.push(checkbox.value);
      }
    });
  
    // Construct the definition expression using the selected values
    let definitionExpression = "";
    if (selectedValues.length > 0) {
      const expressionParts = selectedValues.map(value => `OWNERTYPE = ${value}`);
      definitionExpression = expressionParts.join(' OR ');
    }
  
    // Apply the definition expression to your layer
    NHconsvLand.definitionExpression = definitionExpression;
  };
  
  // Add change event listener to each checkbox
  checkboxFilters.forEach(function(checkbox) {
    checkbox.addEventListener('change', updateNHconsvLandFilter);
  });
  
  // Initialize the filter on page load
  updateNHconsvLandFilter();

// Clear Filters Function
function clearSelectedLayers() {
  // Uncheck all checkboxes and reset filters
  const filters = {};
  filterFieldsMap.forEach(item => {
      if (item.id) {
          document.getElementById(item.id).checked = false;
      }
  });
  setLayerDefinitionExpression(layer, filters);

  // Wait for the filters to be applied, then reevaluate clustering
  setTimeout(() => {
      applyFilter();  // Ensures filters are applied
      reevaluateClusteringAndVisibility();
  }, 0);  // Using setTimeout to allow UI and other processes to complete

  console.log("Filters cleared");
}

function clearBoundaryLayers() {
  // Turn off all boundary layers
  [cedrRegions, tourismRegions, newHampshireCounties, newHampshireTownships].forEach(layer => {
      layer.visible = false;
  });

  // Deactivate all boundary buttons
  boundaryBtns.forEach(id => {
      const elem = document.getElementById(id);
      elem.classList.remove('active');
  });

  // Reset the selected boundary layer
  selectedBoundaryLayer = null;

  // Immediately reevaluate filters and clustering
  applyFilter();  // This will handle filter reapplication and clustering logic
  console.log("Boundary layers cleared");
}


// Attach event listeners for the clear buttons
document.getElementById('clearBoundaries').addEventListener('click', clearBoundaryLayers);

// Function to Reevaluate Clustering and Visibility
function reevaluateClusteringAndVisibility() {
  if (selectedBoundaryLayer && selectedBoundaryLayer.visible) {
      if (!layer.visible || layer.featureReduction === null) {
          applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
      }
  } else if (isClusteringEnabled) {
      drawCluster();
  } else {
      if (layer.visible === false || layer.featureReduction !== null) {
          layer.visible = true;
          layer.featureReduction = null;
      }
  }
}
// ADD CLEAR BUTTON FOR REC LAYERS

document.getElementById('clearAllButton').addEventListener('click', function() {
  // Reset checkboxes within #infoDiv2
  document.querySelectorAll('#infoDiv2 input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
  });


  // Reset the display of filter containers within #infoDiv2
  document.querySelectorAll('#infoDiv2 #NHrecPointsFilterContainer, #infoDiv2 #NHrecAreasFilterContainer, #infoDiv2 #NHconsvLandAccessOptions').forEach(container => {
      container.style.display = 'none';
  });

  // Hide and reset NH layers
  if (NHconsvLand) {
      NHconsvLand.definitionExpression = '';
      NHconsvLand.visible = false; // Hide the layer
  }
  if (NHrecAreas) {
      NHrecAreas.definitionExpression = '';
      NHrecAreas.visible = false; // Hide the layer
  }
  if (NHrecPoints) {
      NHrecPoints.definitionExpression = '';
      NHrecPoints.visible = false; // Hide the layer
  }
  if (NHstateLands) {
    NHstateLands.definitionExpression = '';
    NHstateLands.visible = false; // Hide the layer
}
if (NHwaterAccess) {
  NHwaterAccess.definitionExpression = '';
  NHwaterAccess.visible = false; // Hide the layer
}
if (NHwaterAccess2) {
  NHwaterAccess2.definitionExpression = '';
  NHwaterAccess.visible = false; // Hide the layer
}
  // Repeat similar steps for other layers as necessary
});

//***  CLEAR FOR PROTECTED LANDS 
/* clearButton.addEventListener("click", function() {
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    NHconsvLand.definitionExpression = ""; // Reset the definition expression
});
*/
  document.getElementById('NHrecPointsToggle').addEventListener('change', function() {
    const filterContainer = document.getElementById('NHrecPointsFilterContainer');
    if (this.checked) {
        filterContainer.style.display = 'block';
    } else {
        filterContainer.style.display = 'none';
  
        // Optionally, uncheck all the filter checkboxes when the main checkbox is unchecked
        const filters = document.querySelectorAll('.NHrecPointsFilter');
        filters.forEach(filter => {
            filter.checked = false;
        });
    }
  });
  
  document.getElementById('NHrecAreasToggle').addEventListener('change', function() {
    const filterContainer = document.getElementById('NHrecAreasFilterContainer');
    if (this.checked) {
      filterContainer.style.display = 'block';
    } else {
      filterContainer.style.display = 'none';
  
      // Optionally, uncheck all the filter checkboxes when the main checkbox is unchecked
      const filters = document.querySelectorAll('.NHrecAreasFilter');
      filters.forEach(filter => {
        filter.checked = false;
      });
    }
  });
  
  document.querySelectorAll('.NHrecPointsFilter, .NHrecAreasFilter').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (checkbox.classList.contains('NHrecPointsFilter')) {
            filterNHrecPoints();
        } else if (checkbox.classList.contains('NHrecAreasFilter')) {
            filterNHrecAreas();
        }
    });
  });
  
  function filterNHrecAreas() {
    const selectedValues = [];
    document.querySelectorAll('.NHrecAreasFilter:checked').forEach(checkbox => {
        selectedValues.push(checkbox.value);
    });
    
    if (selectedValues.length > 0) {
      NHrecAreas.effect = "bloom(2, .3px, 5%)";
        NHrecAreas.definitionExpression = `PRIM_USE IN ('${selectedValues.join("','")}')`;
      
    } else {
      NHrecAreas.effect = "bloom(0, 0.1px, 15%)";
        NHrecAreas.definitionExpression = '';  // Clear the filter
       
    }
  }
  
  function filterNHrecPoints() {
      const selectedValues = [];
      document.querySelectorAll('.NHrecPointsFilter:checked').forEach(checkbox => {
          selectedValues.push(checkbox.value);
      });
      
      if (selectedValues.length > 0) {
          NHrecPoints.definitionExpression = `TYPE IN ('${selectedValues.join("','")}')`;
      } else {
          NHrecPoints.definitionExpression = '';  // Clear the filter
      }
  }
  
  /********************** MAIN LAYER TOGGLES *****************************/
 let selectedBoundaryLayer = null;

cedrRegions.visible = false;
tourismRegions.visible = false;
newHampshireCounties.visible = false;
newHampshireTownships.visible = false;

// Function to handle the boundary layer toggle
function handleBoundaryLayerToggle(selectedButtonId, layerToToggle) {
    abortOngoingTasks(); // Abort any ongoing tasks

    // Toggle the visibility of the selected layer
    layerToToggle.visible = !layerToToggle.visible;
    selectedBoundaryLayer = layerToToggle.visible ? layerToToggle : null;

    // Update the active state of the buttons
    if (layerToToggle.visible) {
        // Activate the selected button
        document.getElementById(selectedButtonId).classList.add('active');
    } else {
        // Deactivate the button if the layer was turned off
        document.getElementById(selectedButtonId).classList.remove('active');
    }

    // Manage the visibility of other layers
    [cedrRegions, tourismRegions, newHampshireCounties, newHampshireTownships].forEach(layer => {
        if (layer !== layerToToggle) {
            layer.visible = false;
            const btnId = getDropdownButtonId(layer);
            if (btnId) {
                document.getElementById(btnId).classList.remove('active');
            }
        }
    });

    applyMapUpdates();
}

// Helper function to get the corresponding button ID for a layer
function getDropdownButtonId(layer) {
    if (layer === cedrRegions) return 'dropdownToggleCEDRregions';
    if (layer === tourismRegions) return 'dropdownToggleTourismRegions';
    if (layer === newHampshireCounties) return 'dropdownToggleCounties';
    if (layer === newHampshireTownships) return 'dropdownToggleTownships';
    return null;
}
function abortOngoingTasks() {
  controller.abort();
  pseudoClusterLayer.removeAll();
  controller = new AbortController();
  signal = controller.signal;
}

function applyMapUpdates() {
  // Check if a boundary layer is selected and visible
  if (selectedBoundaryLayer && selectedBoundaryLayer.visible) {
      if (isClusteringEnabled) {
          // Apply advanced clustering for the selected boundary layer
          applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
          // Ensure the layer with point data is not visible when clustering is applied
          layer.visible = false;
      } else {
          // Show the layer with point data if clustering is not enabled
          layer.visible = true;
      }
  } else {
      // If no boundary layer is selected
      if (isClusteringEnabled) {
          // Apply the default clustering method and hide the layer with point data
          drawCluster();
          layer.visible = false;
      } else {
          // Show the layer with point data if clustering is not enabled
          layer.visible = true;
      }
  }

  // Check if any field is selected (filter is active) and apply the filter
  if (isAnyFieldSelected) {
      applyFilter();
  }
}

// Boundary dropdown button IDs
const boundaryBtns = ['dropdownToggleCEDRregions', 'dropdownToggleTourismRegions', 'dropdownToggleCounties', 'dropdownToggleTownships'];

// Attach event listeners to dropdown items
boundaryBtns.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', function() {
            switch (btnId) {
                case 'dropdownToggleCEDRregions':
                    handleBoundaryLayerToggle(btnId, cedrRegions);
                    break;
                case 'dropdownToggleTourismRegions':
                    handleBoundaryLayerToggle(btnId, tourismRegions);
                    break;
                case 'dropdownToggleCounties':
                    handleBoundaryLayerToggle(btnId, newHampshireCounties);
                    break;
                case 'dropdownToggleTownships':
                    handleBoundaryLayerToggle(btnId, newHampshireTownships);
                    break;
            }
        });
    }
});
  
  /************************* MAP INITIALIZATION *************************/
  const nhExtent = {
    xmin: -72.557247,
    ymin: 42.3,
    xmax: -70.610620,
    ymax: 45.5,
    spatialReference: { wkid: 4326 }
  };
  
  const map = new Map({
    layers: [baseLayer, NHconsvLand, NHstateLands, NHdncrstateLands, layer, NHrecAreas, NHrecPoints, NHtrailsLines, NHwaterAccess, NHwaterAccess2,  newHampshire, newHampshireTownships, newHampshireCounties, cedrRegions, tourismRegions,layer]
  });
  
  map.layers.add(baseLayerLabels);
  
  const view = new MapView({
    container: "viewDiv",
    extent: nhExtent,
    constraints: {
      maxExtent: nhExtent,
      minScale: 5000000
    },
    map: map
  });
  NHconsvLand.effect = "bloom(1px, 0.1px, 1%)";
    NHstateLands.effect = "bloom(0.5px, 0.1px, 1%)";
    newHampshire.effect = "bloom(1, 0.1px, 15%)";
    
 

    const filterFieldsRetBus = [
      { fieldlabel: "Retail-Service Businesses"},
      { id: 'filterNationalChain', field: 'National_Chain', displayName: 'National Chain' },
      { id: 'filterRegionalChain', field: 'Regional_Chain', displayName: 'Regional Chain' },
      { id: 'filterLocalBusiness', field: 'Local_Business', displayName: 'Local Business' },
      { label: "<br>Filter by Activity Type"},
      { label: "<p4>Select one or multiple to change displayed points/clusters<p4>"},
     //{ id: 'filterGuidingTraining', field: 'Guiding_Training', displayName: 'Guiding Training' },
     // { id: 'filterSocialEvents', field: 'Social_Events', displayName: 'Social Events' },
     // { id: 'filterUsedGear', field: 'Used_Gear', displayName: 'Used Gear' },
      { id: 'filterHiking', field: 'Hiking', displayName: 'Hiking' },
      { id: 'filterSnowshoeing', field: 'Snowshoeing', displayName: 'Snowshoeing' },
      { id: 'filterRunningTrailRunning', field: 'Running_Trail_Running', displayName: 'Running & Trail Running' },
      { id: 'filterMotorizedBoatingWaterSports', field: 'Motorized_Boating___Water_sport', displayName: 'Motorized Boating & Water Sports' },
      { id: 'filterWhitewaterSports', field: 'Whitewater_sports', displayName: 'Whitewater Sports' },
      { id: 'filterPaddleSports', field: 'Paddle_sports', displayName: 'Paddle Sports' },
      { id: 'filterMountainBiking', field: 'Mountain_Biking', displayName: 'Mountain Biking' },
      { id: 'filterRoadGravelBiking', field: 'Road_Gravel_Biking', displayName: 'Road & Gravel Biking' },
     // { id: 'filterBMX', field: 'BMX', displayName: 'BMX' },
     // { id: 'filterSkateboardingRollerskating', field: 'Skateboarding_Rollerskating', displayName: 'Skateboarding & Rollerskating' },
      { id: 'filterOHRV', field: 'OHRV', displayName: 'OHRV' },
      { id: 'filterHunting', field: 'Hunting', displayName: 'Hunting' },
      { id: 'filterFishing', field: 'Fishing', displayName: 'Fishing' },
      { id: 'filterCamping', field: 'Camping', displayName: 'Camping' },
      { id: 'filterWildlifeViewing', field: 'Wildlife_Viewing', displayName: 'Wildlife Viewing' },
      { id: 'filterSurfing', field: 'Surfing', displayName: 'Surfing' },
      { id: 'filterSwimmingDiving', field: 'Swimming_Diving', displayName: 'Swimming & Diving' },
      { id: 'filterSnowmobiling', field: 'Snowmobiling', displayName: 'Snowmobiling' },
      { id: 'filterDownhillSkiingSnowboarding', field: 'Downhill_Skiing___Snowboarding', displayName: 'Downhill Skiing & Snowboarding' },
      { id: 'filterBackcountryAlpineSkiing', field: 'Backcountry_Alpine_Skiing', displayName: 'Backcountry Alpine Skiing' },
      { id: 'filterNordicSkiing', field: 'Nordic_Skiing', displayName: 'Nordic Skiing' },
      { id: 'filterRockClimbing', field: 'Rock_Climbing', displayName: 'Rock Climbing' },
      { id: 'filterIceClimbing', field: 'Ice_Climbing', displayName: 'Ice Climbing' },
      { id: 'filterMountaineering', field: 'Mountaineering', displayName: 'Mountaineering' },
      { id: 'filterHorseback', field: 'Horseback', displayName: 'Horseback' },
     // { id: 'filterOther', field: 'Other', displayName: 'Other' },
  ];
  
  const filterFieldsRecProv = [
    { fieldlabel: "Recreation Providers"},
    { label: "<br>Filter by Activity Type"},
    { label: "<p4>Select one or multiple to change displayed points/clusters<p4>"},
    { id: 'filterLessonsGuiding', field: 'Lessons_Guiding', displayName: 'Lessons & Guiding' },
    { id: 'filterDownhillSki', field: 'Downhill_Ski', displayName: 'Downhill Skiing' },
    { id: 'filterNordicSkiSnowshoe', field: 'Nordic_Ski_Snowshoe', displayName: 'Nordic Skiing & Snowshoeing' },
    { id: 'filterBiking', field: 'Biking', displayName: 'Biking' },
    { id: 'filterWhitewater', field: 'Whitewater_Paddle', displayName: 'Whitewater Paddling' },
    { id: 'filterOHRV', field: 'OHRV', displayName: 'OHRV' },
    { id: 'filterCampground', field: 'Campground', displayName: 'Camping' },
    { id: 'filterClimbingMountaineeringHiking', field: 'Climbing_Mountaineering_Hiking', displayName: 'Climbing, Mountaineering, & Hiking' },
    { id: 'filterMotorizedBoatingWaterSports', field: 'Motorized_Boating_Water_Sports', displayName: 'Motorized Boating & Water Sports' },
    { id: 'filterSnowmobile', field: 'Snowmobile', displayName: 'Snowmobiling' },
    { id: 'filterFishing', field: 'Fishing', displayName: 'Fishing' },
    { id: 'filterArcheryShootingHunting', field: 'Archery_Shooting_Hunting', displayName: 'Archery, Shooting, & Hunting' },
    { id: 'filterSurfing', field: 'Surfing', displayName: 'Surfing' },
    { id: 'filterHorsebackRiding', field: 'Horseback_Riding', displayName: 'Horseback Riding' },
    { id: 'filterWildlifeViewing', field: 'Wildlife_Viewing', displayName: 'Wildlife Viewing' },
    { id: 'filterSleepawaySummerCamps', field: 'Sleepaway_Summer_Camps', displayName: 'Sleepaway Summer Camps' }
];
  
  const filterFieldsB2B = [
    { fieldlabel: "Business Services and Manufacturers"},
    { label: "<br>Filter by Category"},
    { label: "<p4>Select one or multiple to change displayed points/clusters<p4>"},
    { id: 'filterB2BSalesDistribution', field: 'B2B_Sales_Distribution', displayName: 'Business to Business Sales & Distribution' },
    { id: 'filterManufacturing', field: 'Manufacturing', displayName: 'Manufacturing' },
    { id: 'filterDesignConstruction', field: 'Design_Construction', displayName: 'Design & Construction' },
    { id: 'filterConsultingService', field: 'Consulting_Services', displayName: 'Consulting Services' },
   // { id: 'filterOtherB2B', field: 'Other', displayName: 'Other' },
   
];
  
  const filterFieldsNonProfits = [
    { fieldlabel: "Non-Profit Organizations"},
      { label: "<br>Filter by Category"},
      { label: "<p4>Select one or multiple to change displayed points/clusters<p4>"},
      { id: 'filterIndustryAssociationAdvocate', field: 'Industry_Association_Advocate', displayName: 'Industry Association Advocate' },
      { id: 'filterOutdoorRecOutings', field: 'Outdoor_Rec__Outings', displayName: 'Outdoor Recreation Outings' },
      { id: 'filterEnvEd', field: 'Env__Ed_', displayName: 'Environmental Education' },
      { id: 'filterTrailDevelopmentMaintenance', field: 'Trail_Development___Maintenance', displayName: 'Trail Development & Maintenance' },
      { id: 'filterLandConservationStewardship', field: 'Land_Conservation_Stewardship', displayName: 'Land Conservation Stewardship' },
];
  

  /******************* DRAW CLUSTER FUNCTION  *******************/
  
  function drawCluster() {

    console.log('Applying drawCluster...');
    layer.effect = "bloom(0, 2px, 15%)";

    currentQueryId = Date.now();
    
    if (isClusteringEnabled && selectedBoundaryLayer && selectedBoundaryLayer.visible) {
        pseudoClusterLayer.removeAll();
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
    } else if (!isAnyFieldSelected) {
        layer.visible = true;
        drawSimpleCluster();
    } else if (!isClusteringEnabled) {
        layer.visible = true;
        applyFilter();
        return;
    } else {
        layer.visible = true;
        
        clusterConfig = {
          type: "cluster",
          // If there is a filter applied, use it in the cluster query
          where: layer.definitionExpression ? layer.definitionExpression : "1=1",
          popupTemplate: {
              title: "{cluster_count} Features",
              fieldInfos: [
                  {
                      fieldName: "cluster_count",
                      format: {
                          places: 0,
                          digitSeparator: true,
                      },
                  },
                  {
                      fieldName: "cluster_size",
                      format: {
                          places: 0,
                          digitSeparator: true,
                      },
                  },
              ],
          },
          renderer: {
              type: "simple",
              symbol: {
                  type: "simple-marker",
                  style: "circle",
                  color: "#83DBBB",
                  size: 24,
                  outline: {
                      color: "#9BF1D2",
                      width: 5
                  }
              },
              visualVariables: [
                  {
                      type: "size",
                      field: "cluster_count", 
                      stops: [
                          { value: 1, size: 5 },
                          { value: 3, size: 15 },
                          { value: 9, size: 27},
                          { value: 16, size: 48 },
                          { value: 24, size: 72 },
                          { value: 32, size: 64 },
                      ]
                  }
              ]
          },
          clusterRadius: "120px",
          labelingInfo: [{
              deconflictionStrategy: "none",
              labelExpressionInfo: {
                  expression: "Text($feature.cluster_count, '#,###')"
              },
              symbol: {
                  type: "text",
                  color: "#004a5d",
                  font: {
                      weight: "bold",
                      family: "Noto Sans",
                      size: "12px"
                  }
              },
              labelPlacement: "center-center",
          }]
      };
  
      // Apply the cluster configuration to the layer
      layer.featureReduction = clusterConfig;
  }

  }
  

  
  
  /********************************** CLUSTER BY POLYGON ******************************************** */
  
  
  
  
  const CHUNK_SIZE = 20;
  
  const pseudoClusterLayer = new GraphicsLayer();
  map.add(pseudoClusterLayer);
  
 function applyPolygonClustering(selectedBoundaryLayer, layer, selectedField) {

  
  console.log('Attempting to apply polygon clustering...');
    if (isTaskRunning) {
        console.log('Task already running. Exiting applyPolygonClustering.');
        return; // If a task is already running, don't start a new one.
    }
    console.log("Starting applyPolygonClustering...");
    isTaskRunning = true;

    if (!isClusteringEnabled) {
      console.log("Exiting because clustering is disabled.");
        return;
    }

    showSpinner();
    pseudoClusterLayer.removeAll();
    layer.visible = false;
    // Update the currentQueryId with a new unique identifier
    currentQueryId = Date.now();
    let queryIdAtTimeOfExecution = currentQueryId;

    let polygonsQuery = selectedBoundaryLayer.createQuery();

    selectedBoundaryLayer.queryFeatures(polygonsQuery, { signal: signal }).then(result => {
        // If the currentQueryId doesn't match, it means a new query has been initiated
        if (currentQueryId !== queryIdAtTimeOfExecution) {
            hideSpinner();
            return;
        }

        const polygons = result.features;
        processChunk(polygons, layer, selectedField);

      }).catch(error => {
        console.error("Error during applyPolygonClustering:", error);
        isTaskRunning = false; // Make sure to reset the flag in case of errors too

    }).finally(() => {
        isTaskRunning = false; // Reset the flag when all processing is done or if there's an early exit
        console.log("Finished applyPolygonClustering.");
    });
}

function processChunk(polygons, layer, selectedField, index = 0) {
  console.log('Processing chunk starting at index:', index);
    if (index >= polygons.length) {
        hideSpinner();
        return;
    }

    const chunk = polygons.slice(index, index + CHUNK_SIZE);
    let queryIdAtTimeOfExecution = currentQueryId;

    Promise.all(chunk.map(polygon => processPolygon(polygon, layer, selectedField)))
        .then(() => {
            // If the currentQueryId doesn't match, it means a new query has been initiated
            if (currentQueryId !== queryIdAtTimeOfExecution) {
                return;
            }

            setTimeout(() => {
                processChunk(polygons, layer, selectedField, index + CHUNK_SIZE);
            }, 25);
        })
        .catch(error => {
            console.error("Error processing a chunk:", error);
            hideSpinner();
        });
}
  
function processPolygon(polygon, layer, selectedField) {
  console.log('Processing polygon:', polygon);
  return new Promise((resolve, reject) => {
      let queryIdAtTimeOfExecution = currentQueryId;
      let pointsQuery = layer.createQuery();
      pointsQuery.geometry = polygon.geometry;
      pointsQuery.spatialRelationship = "intersects";
      pointsQuery.returnGeometry = true;

      // Construct the filter query based on the selected fields and filter mode
      let filterQuery = '';
      const selectedFields = filterFieldsMap
          .filter(item => item.id && document.getElementById(item.id).checked)
          .map(item => item.field);

      if (selectedFields.length > 0) {
          filterQuery = selectedFields.map(field => `${field} = 1`).join(filterMode === 'AND' ? ' AND ' : ' OR ');
      }
      pointsQuery.where = filterQuery;

      const countStatistic = {
          onStatisticField: "1",
          outStatisticFieldName: "countValue",
          statisticType: "count",
      };

      pointsQuery.outStatistics = [countStatistic];
      pointsQuery.signal = signal;

      layer.queryFeatures(pointsQuery)
          .then(pointResults => {
              if (currentQueryId !== queryIdAtTimeOfExecution) {
                  resolve();
                  return;
              }

              const pointCount = pointResults.features[0].attributes.countValue;
              if (pointCount === 0) {
                  resolve();
                  return;
              }

              let clusterSize = 5;
              let stops = clusterConfig.renderer.visualVariables[0].stops;

              for (let i = 0; i < stops.length; i++) {
                  if (pointCount >= stops[i].value && (i === stops.length - 1 || pointCount < stops[i + 1].value)) {
                      clusterSize = stops[i].size;
                      break;
                  }
              }

              const clusterGraphic = new Graphic({
                  geometry: polygon.geometry.centroid,
                  symbol: {
                      type: "simple-marker",
                      style: "circle",
                      color: "#83DBBB",
                      size: clusterSize,
                      outline: {
                          color: "#9BF1D2",
                          width: 5
                      }
                  },
                  effect: "bloom(150%, 25%, 1%)"
              });

              const labelGraphic = new Graphic({
                  geometry: polygon.geometry.centroid,
                  symbol: {
                      type: "text",
                      text: pointCount.toString(),
                      color: "#004a5d",
                      font: {
                          weight: "bold",
                          family: "Noto Sans",
                          size: "12px"
                      },
                      verticalAlignment: "middle",
                      horizontalAlignment: "center"
                  }
              });

              console.log('Drawing clusters....');
              pseudoClusterLayer.addMany([clusterGraphic, labelGraphic]);

              resolve();
          })
          .catch(error => {
              if (error.name === 'AbortError') {
                  console.log('Query aborted');
                  controller = new AbortController();
                  signal = controller.signal;
                  resolve();
                  return;
              }
          });
  });
}

    const debouncedApplyPolygonClustering = debounce(applyPolygonClustering, 20);

  /********************************* SPINNER FUNCTION ********************************************* */
  function showSpinner() {
      
      document.getElementById('loadingDiv').style.display = 'block';
      const overlayElement = document.getElementById("overlay");

  if(overlayElement) {
    overlayElement.style.opacity = "100";
    setTimeout(() => { overlayElement.style.display = "block"; }, 0);  // Delay should match the transition duration to ensure opacity completes
  }
  }
  function hideSpinner() {
    
      document.getElementById('loadingDiv').style.display = 'none';
      const overlayElement = document.getElementById("overlay");

  if(overlayElement) {
    overlayElement.style.opacity = "0";
    setTimeout(() => { overlayElement.style.display = "none"; }, 0);  // Delay should match the transition duration to ensure opacity completes
  }
  }

  Object.keys(filterFieldsMap).forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        showSpinner(); // Show spinner when filters are changed
const selectedFieldIds = filterFieldsMap.filter(item => document.getElementById(item.id).checked).map(item => item.id);
        applyFilter();
        drawCluster();
    });
});
  /************************** SIMPLER CLUSTER RENDERER ******************/
  
  
  function drawSimpleCluster() {
  
  console.log('Applying drawSimpleCluster...');
  layer.effect = "bloom(0, 2px, 15%)";
  layer.visible = true;
  pseudoClusterLayer.removeAll();
  currentQueryId = Date.now();

  clusterConfig = {
      type: "cluster",
      popupTemplate: {
          title: "{cluster_count} Locations",
          content:  `
          Click browse features to view extent of coverage and individual features.
          `,
          
          fieldInfos: [{
              fieldName: "Point Cluster Size",
              format: {
                  places: 0,
                  digitSeparator: true,
              }
          }]
      },
      renderer: {
          type: "simple",
          symbol: {
              type: "simple-marker",
              style: "circle",
              color: "#83DBBB",
              size: 24,
              outline: {
                  color: "#9BF1D2",
                  width: 5
              }
          },
          visualVariables: [{
              type: "size",
              field: "cluster_count", 
              stops: [
                  { value: 1, size: 5 },
                  { value: 2, size: 7 },
                  { value: 4, size: 10 },
                  { value: 9, size: 18 },
                  { value: 19, size: 32 },
                  { value: 28, size: 48 },
                  { value: 44, size: 64 },
                  
              ]
          }]
      },
      clusterRadius: "120px",
      labelingInfo: [{
          deconflictionStrategy: "none",
          labelExpressionInfo: {
              expression: "Text($feature.cluster_count, '#,###')"
          },
          symbol: {
              type: "text",
              color: "#004a5d",
              font: {
                  weight: "bold",
                  family: "Noto Sans",
                  size: "12px"
              }
          },
          labelPlacement: "center-center",
      }]
  };
  layer.featureReduction = clusterConfig;

  }
  
  
    /******************************** TERMINATE PSUEDO CLUSTERING *****************/
  
  function terminateOngoingClustering() {
    isTaskRunning = false;
     // Abort any ongoing queries
    // Perform any other necessary cleanup here
}
  

  /******************************** FILTER DATA BY SELECTED FIELD *****************/


  
  NHtrailsLines.visible = false;

  let filterMode = 'AND'; // Possible values: 'AND', 'OR'
  const boundaryLayerVisible = tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible;
  
  
  function applyClusterIfNecessary(boundaryLayerVisible, layer, selectedField) {
    
    if (isClusteringEnabled && boundaryLayerVisible) {
      
        terminateOngoingClustering() ;
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
        return true;
        
    }
    
    return false;
  }
  
function setLayerDefinitionExpression(layer, filters) {
    if (Object.keys(filters).length > 0) {
        let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`);
        definitionExpression = filterMode === 'AND' ? definitionExpression.join(" AND ") : definitionExpression.join(" OR ");
        layer.definitionExpression = definitionExpression;
        console.log(definitionExpression);
    } else {
        layer.definitionExpression = null;
    }
}
  
window.applyFilter = function() {
    console.log('Applying filter...');
    const filters = {};
    let areAnyFiltersSelected = false;

    // Build the filter based on selected checkboxes and check if any filter is selected
    filterFieldsMap.forEach(item => {
        if (item.id && document.getElementById(item.id).checked) {
            filters[item.field] = "1";
            areAnyFiltersSelected = true;
        }
    });

    if (areAnyFiltersSelected) {
        setLayerDefinitionExpression(layer, filters);
    } else {
        layer.definitionExpression = null; // Clear the definition expression
    }

    // Apply polygon clustering or reevaluate clustering and visibility
    if (boundaryLayerVisible && isClusteringEnabled) {
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
    } else {
        reevaluateClusteringAndVisibility();
    }

    console.log('Final layer visibility after applyFilter:', layer.visible);
}


  Object.keys(filterFieldsMap).forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
const selectedFieldIds = filterFieldsMap.filter(item => document.getElementById(item.id).checked).map(item => item.id);
        applyFilter();
        drawCluster();
    });
  });
  
   NHtrailsLines.effect = "bloom(1, 5px, 15%)";
        
   document.getElementById('NHtrailsBloomToggle').addEventListener
   ('change', function() {
    if (this.checked) {
      NHtrailsLines.effect = "bloom(.7, 3px, 15%)";
      NHtrailsLines.renderer.symbol.color = "#FFC1AD";
      NHtrailsLines.renderer.symbol.style = "solid";
      NHtrailsLines.renderer.symbol.width = ".5";
    } else {
      NHtrailsLines.effect = null;
      NHtrailsLines.renderer.symbol.color = "rgba(224, 176, 136, .5)";
      NHtrailsLines.renderer.symbol.style = "short-dot";
    }
  });
  

      
   
    /*************************** TOGGLE CLUSTERING  ***********************/
   
  
   document.getElementById('toggleClustering').addEventListener('click', function() {
      isClusteringEnabled = !isClusteringEnabled;
      const textSpan = this.querySelector('span');
      if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
        console.log("Cluster toggled ON");
        textSpan.innerText = "Point Clustering: ON";
        
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        this.classList.add('active');
        layer.visible = false;
      } 
  
      else if (isClusteringEnabled) {
          this.classList.add('active');
          textSpan.innerText = "Point Clustering: ON";
          layer.effect = "bloom(0, 0.1px, 15%)";
          pseudoClusterLayer.removeAll();
          let selectedFields = [];
          for (let item of filterFieldsMap) {
        let id = item.id;
        let field = item.field;
        if (item.id && document.getElementById(item.id)) {
          console.log("Checking element with ID:", item.id);
          if (document.getElementById(item.id).checked) {
              selectedFields.push(field);
              console.log("Pushing checked fields...");
          }
      } else {
          console.warn("Undefined or null ID encountered in filterFieldsMap item:", item);
      }
          }
          
          if (isAnyFieldSelected) {
              layer.visible = true;
              drawCluster();
              console.log("Applying drawCluster...");
          } else {
              layer.visible = true;
              drawSimpleCluster();
              console.log("Applying drawSimpleCluster...");
          }
      } else {
          pseudoClusterLayer.removeAll();
          textSpan.innerText = "Point Clustering: OFF";
          this.classList.remove('active');
          layer.featureReduction = null;
          layer.visible = true;
          layer.effect = "bloom(3.5, 0.1px, 5%)";
          console.log("Cluster toggled OFF");
      }
  });
  
    
  /*********************** PRINT FUNCTION *************************/
  
   const print = new Print({
    view: view,
    printServiceUrl:
       "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
  });
  
  /************************ LIMIT MAP EXTENT  *************************/
  
  view.when(function() {
    limitMapView(view);
  });
  
  function limitMapView(view) {
    let initialExtent = view.extent;
    let initialZoom = view.zoom;
    view.watch('stationary', function(event) {
      if (!event) {
        return;
      }
      // If the center of the map has moved outside the initial extent,
      // then move back to the initial map position (i.e. initial zoom and extent
      let currentCenter = view.extent.center;
      if (!initialExtent.contains(currentCenter)) {
        view.goTo({
          target: initialExtent,
          zoom: initialZoom
        });
      }
    });
  }
  
  /************************ VIEW FUNCTIONS ******************************/
  view.ui.remove("zoom");

const infoDiv = document.getElementById("infoDiv");
view.ui.add(new Expand({
    view: view,
    content: infoDiv,
    expandIcon: "select-category",
    expanded: true
}), "top-left");

const infoText = document.getElementById("infoText");
const info = document.getElementById("info");
const closeBtn = document.getElementById("xBtn");

const expandWidget = new Expand({
  view: view,
  content: infoText,
  expandIcon: "information-f",
  expanded: false
});

view.ui.add(expandWidget, "top-left");

expandWidget.watch("expanded", function(expanded) {
  if (expanded) {
    info.style.display = "block"; // show the info window when the widget is expanded
    showOverlay();
  } else {
    info.style.display = "none"; // hide the info window when the widget is collapsed
    hideOverlay();
  }
});

closeBtn.addEventListener("click", function() {
  info.style.display = "none";
  expandWidget.collapse(); // also collapse the expand widget when close button is clicked
});



view.ui.add(new Expand({
    view: view,
    content: print,
    expandIcon: "print",
    expanded: false
}), "top-left");

view.ui.add(new Home({
    view: view
}), "top-left");

var zoom = new Zoom({
  view: view
});
view.ui.add(zoom, "top-left");

document.querySelectorAll('.esri-widget--button svg').forEach(svg => {
  svg.style.width = '35px';
  svg.style.height = '35px';
});

/* const customLegend = document.getElementById("customLegend");

const legendExpand = new Expand({
  view: view,
  content: customLegend,  // Use the custom legend container as the content for the Expand widget
  expanded: false,  
  group: "top-right",  
  expandIconClass: "esri-icon-layer-list",  
  expandTooltip: "Show Legend"
});

view.ui.add(legendExpand, 'bottom-right');
*/
const layerMap = {
  'NHconsvLandToggle': NHconsvLand,
  'NHrecAreasToggle': NHrecAreas,
  'NHtrailsLinesToggle': NHtrailsLines,
  'NHrecPointsToggle' : NHrecPoints,
  'NHwaterAccessHeatToggle': NHwaterAccess, 
  'NHwaterAccessToggle': NHwaterAccess2, 
  'NHdncrstateLandsToggle': NHdncrstateLands
};

Object.keys(layerMap).forEach((toggleId) => {
  document.getElementById(toggleId).addEventListener('change', function() {
      layerMap[toggleId].visible = this.checked;
  });
});

Object.keys(layerMap).forEach((toggleId) => {
    document.getElementById(toggleId).addEventListener('change', function() {
        layerMap[toggleId].visible = this.checked;
    });
});

const infoDiv2 = document.getElementById("infoDiv2");
view.ui.add(new Expand({
    view: view,
    content: infoDiv2,
    expandIcon: "collection",
    expanded: true
}), "top-right");

document.getElementById("retailLink").addEventListener('click', function() {
  console.log("Button clicked!");
  debouncedUpdateFields('retailBusiness');
  if (this.classList.contains('active')) {
      this.classList.remove('active');
  } else {
      this.classList.add('active');
      if (nonProfitLink) nonProfitLink.classList.remove('active');
      if (recProvidersLink) recProvidersLink.classList.remove('active');
      if (b2bManufacturersLink) b2bManufacturersLink.classList.remove('active');
  }
});

const linkIds = [
    'retailLink',
    'recProviderLink',
    'b2bManufacturerLink',
    'nonProfitLink'
];

const dataMappingForLinks = {
    'retailLink': 'retailBusiness',
    'recProviderLink': 'recreationProviders',
    'b2bManufacturerLink': 'b2bManufacturers',
    'nonProfitLink': 'nonProfits'
};

linkIds.forEach(id => {
    document.getElementById(id).addEventListener('click', function() {
        updateFields(dataMappingForLinks[id]);
        // togglePrimaryActiveState should handle the toggling of the active class to avoid conflicts
        togglePrimaryActiveState(this);
    });
});
  
    // For smaller screens (dropdown links)
    document.getElementById("retailDropdownLink").addEventListener('click', function() {
      debouncedUpdateFields('retailBusiness');
  
        
    });
  
    document.getElementById("recProviderDropdownLink").addEventListener('click', function() {
      debouncedUpdateFields('recreationProviders');
     
        
    });
  
    document.getElementById("b2bManufacturerDropdownLink").addEventListener('click', function() {
      debouncedUpdateFields('b2bManufacturers');
    
    });
  
    document.getElementById("nonProfitDropdownLink").addEventListener('click', function() {
      debouncedUpdateFields('nonProfits');
      
  
    });

    /************************************** SPLASH LOGO CALCS  ********************************************/




    
//
/**************************************** CHANGE BORDER COLOR  ********************************/
function setNewHampshireRenderer() {
  const symbology = {
      [retailBusinessesLink]: '#E5A359',
      [recreationProvidersLink]: '#59A2E5',
      [b2bManufacturersLink]: '#59E594',
      [nonProfitsLink]: '#ECFB6C',
  };

  const currentColor = symbology[currentLayerLink];
  
  if (currentColor) {
      const newHampshireRenderer = {
          type: 'simple',
          symbol: {
              type: 'simple-line',
              color: currentColor,
              width: '2px'
          }
      };
      newHampshire.renderer = newHampshireRenderer;
  }
}
/**************************************** PAGE MASK ********************************************/



// Elements for the second popup
const popupContent = document.getElementById('popup-content');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const popupContainer = document.getElementById('popupContainer');
const closePopupButton = document.getElementById('closePopupButton');
const infoPopup = document.getElementById('info'); // Ensure this ID matches your HTML
const closeInfoButton = document.getElementById('xBtn'); // Ensure this ID matches your HTML

// Function to show the overlay
function showOverlay() {
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
}

// Function to hide the overlay
function hideOverlay() {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300); // Match this delay with your CSS transition
}

// Initial setup on window load
window.addEventListener('load', () => {
    popupContainer.style.display = 'block'; // Show disclaimer popup
    showOverlay();
    infoPopup.style.display = 'none'; // Initially hide the info popup
});

// Event listener for closing the disclaimer and showing the info popup
closePopupButton.addEventListener('click', () => {
    popupContent.style.display = 'none';
    popup.style.display = 'none';
    popupContainer.style.display = 'none'; // Hide disclaimer popup
    infoPopup.style.display = 'block';

    // Optionally, adjust overlay here if needed
    // showOverlay(); // If you want to keep the overlay visible
});

// Event listener for closing the info popup and hiding the overlay
closeInfoButton.addEventListener('click', () => {
    infoPopup.style.display = 'none'; // Hide info popup
    hideOverlay(); // Hide overlay
});





    });
