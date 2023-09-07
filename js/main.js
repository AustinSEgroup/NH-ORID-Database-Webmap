require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/WebTileLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Home",
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
    
  ], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home, Print, SimpleLineSymbol, Collection, GraphicsLayer, Graphic, SimpleFillSymbol, LayerList, Query, SimpleMarkerSymbol, PictureMarkerSymbol) => {
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


  /************************ CHANGE DATA SOURCE ********************** */
  
  let filterFieldsMap = [];

  function handleExclusiveCheckboxes(selectedCheckbox) {
    console.log("Called handleExclusiveCheckboxes with:", selectedCheckbox);
    
    const exclusiveCheckboxes = ['filterNationalChain', 'filterRegionalChain', 'filterLocalBusiness'];

    if (exclusiveCheckboxes.includes(selectedCheckbox)) {
        console.log("Inside exclusive checkboxes condition");
        for (let checkbox of exclusiveCheckboxes) {
            console.log("Checking checkbox:", checkbox);
            if (checkbox !== selectedCheckbox) {
                console.log("Unchecking checkbox:", checkbox);
                let checkboxElement = document.getElementById(checkbox);
                if (checkboxElement) {
                    checkboxElement.checked = false;
                } else {
                    console.error("Checkbox with ID:", checkbox, "not found!");
                }
            }
        }
    }

    // Log the state of checkboxes after they've been modified
    for (let checkbox of exclusiveCheckboxes) {
        let checkboxElement = document.getElementById(checkbox);
        if (checkboxElement) {
            console.log(checkbox, checkboxElement.checked);
        } else {
            console.error("Checkbox with ID:", checkbox, "not found!");
        }
    }
}



function updateFields(datasetName) {
  console.log('[updateFields] Initialization started for:', datasetName);
  layer.visible = false;
  pseudoClusterLayer.removeAll();
  console.log('[updateFields] Layer visibility set to false and pseudo clusters removed.');

  const infoDivText = document.querySelector('#infoDiv p3');
  switch (datasetName) {
      case 'retailBusiness':
          console.log('[updateFields] Processing retailBusiness dataset.');
          filterFieldsMap = filterFieldsRetBus;
          currentLayerLink = retailBusinessesLink;
          layer.url = currentLayerLink;
          layer.visible = true;
          break;
      case 'recreationProviders':
          console.log('[updateFields] Processing recreationProviders dataset.');
          filterFieldsMap = filterFieldsRecProv;
          currentLayerLink = recreationProvidersLink;
          layer.url = currentLayerLink;
          layer.visible = true;
          break;
      case 'b2bManufacturers':
          console.log('[updateFields] Processing b2bManufacturers dataset.');
          filterFieldsMap = filterFieldsB2B;
          currentLayerLink = b2bManufacturersLink;
          layer.url = currentLayerLink;
          layer.visible = true;
          break;
      case 'nonProfits':
          console.log('[updateFields] Processing nonProfits dataset.');
          filterFieldsMap = filterFieldsNonProfits;
          currentLayerLink = nonProfitsLink;
          layer.url = currentLayerLink;
          layer.visible = true;
          break;
  }

  console.log('[updateFields] Removing layer from the map and updating its URL.');
  map.layers.remove(layer);
  layer.url = currentLayerLink;

  console.log('[updateFields] Reloading layer and adding it back to the map.');
  layer.load().then(() => {
      console.log('[updateFields] Layer loaded successfully.');
      map.layers.add(layer);
  }).catch((error) => {
      console.error("[updateFields] Error loading the layer:", error);
  });

  console.log('[updateFields] Populating filter div with filter fields.');
  filterDiv.innerHTML = '';
  for (let item of filterFieldsMap) {
      const div = document.createElement('div');
      if (item.label) {
          div.innerHTML = `<strong>${item.label}</strong>`;
      } else if (item.fieldlabel) {
          div.innerHTML = `<strong style="font-size: larger;">${item.fieldlabel}</strong>`;
      } else {
          div.innerHTML = `<input type='checkbox' id='${item.id}'><label for='${item.id}'>${item.displayName}</label>`;
      }
      filterDiv.appendChild(div);
      if (item.id) {
          document.getElementById(item.id).addEventListener('click', function() {
              console.log('[updateFields] Checkbox clicked:', item.id);
              handleExclusiveCheckboxes(item.id);
          });
          document.getElementById(item.id).addEventListener('change', function() {
              console.log('[updateFields] Checkbox value changed:', item.id);
              applyFilter();
          });
      }
  }

  console.log('[updateFields] Applying filters.');
  applyFilter();

  console.log('[updateFields] Checking clustering status and boundary layer visibility.');
  if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
      console.log('[updateFields] Applying polygon clustering.');
      pseudoClusterLayer.removeAll();
      debouncedApplyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
      layer.visible = false;
  } else if (isClusteringEnabled) {
      console.log('[updateFields] Drawing clusters.');
      pseudoClusterLayer.removeAll();
      layer.visible = true;
      drawCluster();
  } else {
      console.log('[updateFields] Clustering is disabled. Removing pseudo clusters and applying filter.');
      pseudoClusterLayer.removeAll();
      layer.visible = true;
      applyFilter();
  }

  console.log('[updateFields] End of function execution. Layer URL:', layer.url, 'Layer visibility:', layer.visible);
}

const debouncedUpdateFields = debounce(updateFields, 20);

  // Initial load to show 'retailBusiness' fields

  window.onload = function() {
      updateFields('retailBusiness');
      drawCluster();
      layer.featureReduction = null;
      layer.effect = "bloom(3.5, 0.1px, 5%)";
  }

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
  
    popupTemplate: {
      title: "Name: {POINAME}",
      content: "Notes: {NOTES}"
    },
  
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
    field: "ACCESS",
    uniqueValueInfos: [
        {
            value: "1",
            symbol: {
                type: "simple-fill",
                color: "rgba(173, 252, 106, 0.4)", // Allowed
                outline: {
                    color: "black",
                    width: 0
                }
            },
            label: "Allowed"
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
            label: "Restricted to Certain Areas"
        },
  
    ]
};
  
  const NHconsvLand = new FeatureLayer({
    url: NHconsvLandLink,
    visible: false,
  //  labelingInfo: [stateLandsLabels],
    renderer: NHconsvLandRenderer,
  
    popupTemplate: {
      title: "{NAME}",
    },
  
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


const radioButtons = document.querySelectorAll('[name="NHconsvLandAccess"]');
radioButtons.forEach(function(radio) {
    radio.addEventListener('change', function() {
        const selectedValue = this.value;
        NHconsvLand.definitionExpression = `ACCESS = ${selectedValue}`;
    });
});
  
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
  

  // Toggle the active state of primary buttons
  function togglePrimaryActiveState(clickedElement) {
    // Deactivate all primary buttons
    primaryBtns.forEach(id => {
        const elem = document.getElementById(id);
        elem.classList.remove('active');
    });

    // Activate the clicked button
    clickedElement.classList.add('active');
}

// Toggle the active state of boundary buttons
function toggleBoundaryActiveState(clickedElement, otherBtns) {
  // If the clicked button is already active, deactivate it and return.
  if (clickedElement.classList.contains('active')) {
      clickedElement.classList.remove('active');
      return; // exit the function early
  }

  // Deactivate all other boundary buttons
  otherBtns.forEach(id => {
      const elem = document.getElementById(id);
      if (elem !== clickedElement) {
          elem.classList.remove('active');
      }
  });

  // Activate the clicked button
  clickedElement.classList.add('active');
}
  // Toggle the active state of buttons
  function toggleActiveState(currentBtn, category) {
    // Determine which set of buttons to deactivate based on the category
    const otherBtns = category === "primary" ? primaryBtns : boundaryBtns;

    // If the clicked button is already active, deactivate it
    if (currentBtn.classList.contains('active')) {
        currentBtn.classList.remove('active');
    } else {
        // Otherwise, activate the clicked button and deactivate the other buttons in its category
        currentBtn.classList.add('active');
        otherBtns.forEach(btn => {
            if (btn !== currentBtn) {
                document.getElementById(btn).classList.remove('active');
            }
        });
    }
}

// List of button IDs for each category
const primaryBtns = ['retailLink', 'recProviderLink', 'b2bManufacturerLink', 'nonProfitLink'];
const boundaryBtns = ['toggleCEDRregions', 'toggleTourismRegions', 'toggleCounties', 'toggleTownships'];
  
  // Helper function to attach the event listeners
  function attachLayerToggleEvents(standardButtonId, dropdownButtonId, handlerFunction) {
      document.getElementById(standardButtonId).addEventListener('click', handlerFunction);
      document.getElementById(dropdownButtonId).addEventListener('click', handlerFunction);
      console.log("attachLayerToggleEvents")
  }
  
  
  function handleBoundaryLayerToggle(layerToToggle, otherLayers, isSwitching = true) {
    
    pseudoClusterLayer.removeAll();
    // Create a new instance of AbortController for subsequent operations
    controller = new AbortController();
    signal = controller.signal;

    selectedBoundaryLayer = layerToToggle;

    // If switching layers
    if (isSwitching) {
        if (layerToToggle.visible) {
            layerToToggle.visible = false;
        } else {
            layerToToggle.visible = true;
            // Hide all other boundary layers
            for (let layer of otherLayers) {
                layer.visible = false;
            }
        }
    } else {
        // If turning off the current layer
        layerToToggle.visible = false;
    }

    if (isClusteringEnabled) {
        if (selectedBoundaryLayer.visible) {
            applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
            layer.visible = false;
        } else {
            layer.visible = true;
            drawCluster();
        }
    } else if (isClusteringEnabled) {
        layer.effect = "bloom(0, 0.1px, 15%)";
        layer.visible = true;
        applyFilter();
    }
}
function abortOngoingTasks() {
  controller.abort();
  pseudoClusterLayer.removeAll();

  // Create a new instance of AbortController for subsequent operations
  controller = new AbortController();
  signal = controller.signal;
}

attachLayerToggleEvents('toggleTownships', 'dropdownToggleTownships', function() {
  abortOngoingTasks(); // This stops any ongoing queries
  pseudoClusterLayer.removeAll();

  toggleBoundaryActiveState(this, ['toggleCEDRregions', 'toggleTourismRegions', 'toggleCounties']);
  handleBoundaryLayerToggle(newHampshireTownships, [cedrRegions, tourismRegions, newHampshireCounties]);
});

attachLayerToggleEvents('toggleCEDRregions', 'dropdownToggleCEDRregions', function() {
  abortOngoingTasks(); // This stops any ongoing queries
  pseudoClusterLayer.removeAll();

  toggleBoundaryActiveState(this, ['toggleTownships', 'toggleTourismRegions', 'toggleCounties']);
  handleBoundaryLayerToggle(cedrRegions, [tourismRegions, newHampshireCounties, newHampshireTownships]);
});

attachLayerToggleEvents('toggleTourismRegions', 'dropdownToggleTourismRegions', function() {
  abortOngoingTasks(); // This stops any ongoing queries
  pseudoClusterLayer.removeAll();

  toggleBoundaryActiveState(this, ['toggleCEDRregions', 'toggleTownships', 'toggleCounties']);
  handleBoundaryLayerToggle(tourismRegions, [cedrRegions, newHampshireCounties, newHampshireTownships]);
});

attachLayerToggleEvents('toggleCounties', 'dropdownToggleCounties', function() {
  abortOngoingTasks(); // This stops any ongoing queries
  pseudoClusterLayer.removeAll();

  toggleBoundaryActiveState(this, ['toggleCEDRregions', 'toggleTourismRegions', 'toggleTownships']);
  handleBoundaryLayerToggle(newHampshireCounties, [cedrRegions, tourismRegions, newHampshireTownships]);
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
    NHstateLands.effect = "bloom(0.5px, 0.1px, 1%)";
    newHampshire.effect = "bloom(1, 0.1px, 15%)";
    
  
    const filterFieldsRetBus = [
      { fieldlabel: "Retail-Service Business"},
      { id: 'filterNationalChain', field: 'National_Chain', displayName: '<br style="line-height: 10px" />National Chain' },
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
    fields: [{
      name: `${selectedField}`,
      alias: `${selectedField}`,
      onStatisticField: `${selectedField}`,
      statisticType: "sum"
    }],
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
          field: `${selectedField}`,
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

        if (isAnyFieldSelected) {
            pointsQuery.where = `${selectedField} = 1`;
        }

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
                  clusterGraphic.effect = "bloom(1, 0.1px, 15%)";
                  
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
                    // Handle the abort error
                    if (error.name === 'AbortError') {
                        console.log('Query aborted');
                        // Create a new instance of AbortController for subsequent operations
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
        let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
        layer.definitionExpression = definitionExpression;
        console.log(definitionExpression);
    } else {
        layer.definitionExpression = null;
    }
  }
  
  window.applyFilter = function() {
    console.log('Applying filter...');
    const filters = {};

    const selectedFields = filterFieldsMap
        .filter(item => item.id && document.getElementById(item.id).checked)
        .map(item => item.field);

    if (selectedFields.length) {
        selectedFields.forEach(field => {
            filters[field] = "1";
        });

        setLayerDefinitionExpression(layer, filters);

        if (applyClusterIfNecessary(boundaryLayerVisible, layer, selectedField)) return;

        if (isClusteringEnabled) {
            drawCluster();
            return;
        }
    } else {
        layer.definitionExpression = null; // Ensure all points are displayed when no fields are checked

        if (applyClusterIfNecessary(boundaryLayerVisible, layer, selectedField)) return;

        if (isClusteringEnabled) {
            drawSimpleCluster();
            return;
        }
    }
    console.log('Selected fields for filtering:', selectedFields);
    console.log('Final layer visibility after applyFilter:', layer.visible);
}

  // DEBOUNCE VERSION

  const debounceApplyFilter = debounce(applyFilter, 20);

  Object.keys(filterFieldsMap).forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
const selectedFieldIds = filterFieldsMap.filter(item => document.getElementById(item.id).checked).map(item => item.id);
        applyFilter();
        drawCluster();
    });
  });
  
   NHtrailsLines.effect = "bloom(1, 5px, 15%)";
        
   document.getElementById('NHtrailsBloomToggle').addEventListener('change', function() {
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
  
  document.getElementById('NHrecPointsSymbolToggle').addEventListener('change', function() {
    if (this.checked) {
      NHrecPoints.renderer = picRenderer;
      NHrecPoints.effect = null;
    } else {
      NHrecPoints.renderer = dotRenderer;
      NHrecPoints.effect = "bloom(3, .3px, 15%)";
    }
  });
      
   
    /*************************** TOGGLE CLUSTERING  ***********************/
   
  
   document.getElementById('toggleClustering').addEventListener('click', function() {
      isClusteringEnabled = !isClusteringEnabled;
      const textSpan = this.querySelector('span');
      if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
        console.log("Cluster toggled ON");
        textSpan.innerText = "Turn Point Clustering: OFF";
        
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        this.classList.add('active');
        layer.visible = false;
      } 
  
      else if (isClusteringEnabled) {
          this.classList.add('active');
          textSpan.innerText = "Turn Point Clustering: OFF";
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
          textSpan.innerText = "Turn Point Clustering: ON";
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
const closeBtn = document.getElementById("closeBtn");

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
  } else {
    info.style.display = "none"; // hide the info window when the widget is collapsed
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

const customLegend = document.getElementById("customLegend");

const legendExpand = new Expand({
  view: view,
  content: customLegend,  // Use the custom legend container as the content for the Expand widget
  expanded: false,  
  group: "top-right",  
  expandIconClass: "esri-icon-layer-list",  
  expandTooltip: "Show Legend"
});

view.ui.add(legendExpand, 'bottom-right');

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

    /************************************** TERMS AND CONDITIONS  ********************************************/

    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popupContainer');
    const closePopupButton = document.getElementById('closePopup');
    
// Show the popup when the page loads
window.addEventListener('load', () => {
  popupContainer.style.display = 'block';
});

// Close the popup when the "Close" button is clicked
closePopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});


// Watch 'loaded' property
layer.watch('loaded', function(newValue, oldValue, propertyName, target) {
  console.log(`Layer property ${propertyName} changed from ${oldValue} to ${newValue}`);
});

// Watch 'visible' property
layer.watch('visible', function(newValue, oldValue, propertyName, target) {
  console.log(`Layer property ${propertyName} changed from ${oldValue} to ${newValue}`);
});

// Watch 'popupTemplate' property
layer.watch('popupTemplate', function(newValue, oldValue, propertyName, target) {
  console.log(`Layer property ${propertyName} changed. Has value:`, !!newValue);
});

// 'layerview-create' event
view.on('layerview-create', function(event) {
  if (event.layer === layer) {
      console.log('LayerView for the layer was created:', event.layerView);
  }
});

// 'layerview-destroy' event
view.on('layerview-destroy', function(event) {
  if (event.layer === layer) {
      console.log('LayerView for the layer was destroyed:', event.layerView);
  }
});
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


// Show the popup and overlay with a fade-in animation when the page loads
window.addEventListener('load', () => {
  overlay.style.opacity = '1';
  popupContainer.style.opacity = '1';
  popupContainer.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Close the popup and overlay with a fade-out animation when the "Close" button is clicked
closePopupButton.addEventListener('click', () => {
  overlay.style.opacity = '0';
  popupContainer.style.opacity = '0';
  popupContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
  setTimeout(() => {
    overlay.style.display = 'none';
    popupContainer.style.display = 'none';
  }, 300); // Wait for the animation to complete (300ms)
});





    });
