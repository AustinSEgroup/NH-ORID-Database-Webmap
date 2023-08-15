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
    let NHwildlifeCorridorsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_WildlifeCorridors/FeatureServer";
    let NHwaterAccessLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Access_Sites_To_Public_Waters/FeatureServer";
    let NHtrailsPointsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreational_Trails_(Points)/FeatureServer";
    let NHtrailsLinesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreational_Trails_(Polylines)/FeatureServer";
    let NHrecAreasLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreation_Inventory_(Areas)/FeatureServer";
    let NHrecPointsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreation_Inventory_(Points)/FeatureServer";
    let NHstateLandsLink = "https://services8.arcgis.com/hg1B9Egwk1I5p300/ArcGIS/rest/services/State_Lands_View/FeatureServer&source=sd";
    let NHconsvLandLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_Conservation_Public_Lands/FeatureServer";
    let NHdncrStateLandsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_DCNRStateLands/FeatureServer";
  
    var allowedLayers = ["NHconsvLand", "NHrecAreas", "NHrecPoints", "NHtrailsLines", "NHtrailsPoints", "NHwaterAccess", "NHstateLands", "NHdncrstateLands"];
  
  
  /************************ CHANGE DATA SOURCE ********************** */
  
  let filterFieldsMap = {};
  
  const exclusiveCheckboxes = [
    'filterNationalChain',
    'filterRegionalChain',
    'filterLocalBusiness'
  ];
  
  function updateFields(datasetName) {
      const filterDiv = document.getElementById("filterDiv");
  
      switch (datasetName) {
        case 'retailBusiness':
            filterFieldsMap = filterFieldsRetBus;
            currentLayerLink = retailBusinessesLink;
            layer.popupTemplate = popTemp1;
            break;
        case 'recProviders':
            filterFieldsMap = filterFieldsRecProv;
            currentLayerLink = recreationProvidersLink;
            layer.popupTemplate = popTemp2;
            break;
        case 'b2bManufacturers':
            filterFieldsMap = filterFieldsB2B;
            currentLayerLink = b2bManufacturersLink;
            layer.popupTemplate = popTemp2;
            break;
        case 'nonProfits':
            filterFieldsMap = filterFieldsNonProfits;
            currentLayerLink = nonProfitsLink;
            layer.popupTemplate = popTemp2;
            break;
        default:
            filterFieldsMap = {};
            layer.popupTemplate = popTemp1;
            currentLayerLink = retailBusinessesLink;
      }
      console.log(layer.url);
      pseudoClusterLayer.removeAll();
      layer.url = currentLayerLink;
      map.layers.remove(layer);
  
      layer.load().then(() => {
          map.layers.add(layer);
      }).catch((error) => {
          console.error("Error loading the layer:", error);
      });
      // Clear the filterDiv
      filterDiv.innerHTML = "";
  
      // Populate filterDiv with the current fields
      for (const id in filterFieldsMap) {
          const input = document.createElement("input");
          input.type = "checkbox";
          input.id = id;
  
          // Check if this checkbox is part of the exclusiveCheckboxes array
          if (exclusiveCheckboxes.includes(id)) {
              input.addEventListener('change', function() {
                  if (this.checked) {
                      // Uncheck other exclusive checkboxes
                      for (let otherId of exclusiveCheckboxes) {
                          if (otherId !== id) {
                              document.getElementById(otherId).checked = false;
                          }
                      }
                  }
  
                  // Call your applyFilter function or any other logic you want to trigger on change
                  console.log(currentLayerLink);
                  applyFilter();
                  console.log(selectedBoundaryLayer);
              
            
              });
          }
  
          
          const label = document.createElement("label");
          label.setAttribute("for", id);
  
          // Convert underscores and double underscores in field names
          let displayName = filterFieldsMap[id].replace(/__/g, '&').replace(/_/g, ' ');
          label.innerText = displayName;
  
          filterDiv.appendChild(input);
          filterDiv.appendChild(label);
          filterDiv.appendChild(document.createElement("br"));
  
          const allCheckboxes = filterDiv.querySelectorAll('input[type="checkbox"]');
          allCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilter);
          });
        console.log(currentLayerLink);
      }
      if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
        pseudoClusterLayer.removeAll();
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
    }  if (isClusteringEnabled && (!tourismRegions.visible || !cedrRegions.visible || !newHampshireCounties.visible || !newHampshireTownships.visible)){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        drawCluster();
    }
       if (!isClusteringEnabled){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        applyFilter();
      }
    
  }
  
  // Initial load to show 'retailBusiness' fields
  window.onload = function() {
      updateFields('retailBusiness');
  }

  let popTemp1 = {
    title: "{Business_Name}",
    content:`
    Town or City: {Township}<br>
    Website: <a href='{Website}' target='_blank'>{Website}</a><br>
    Physical Address: {Physical_Address}<br>
    E-mail: <a href='mailto:{Email}'>{Email}</a><br>
    Phone: {Phone}<br>
    County: {County}<br>
    Tourism Region: {Tourism_Region}<br>
    CEDR: {CEDR}
  `,
  }
  
  let popTemp2 = {
    title: "{Name}",
    content:`
    Town or City: {Township}<br>
    Website: <a href='{Website}' target='_blank'>{Website}</a><br>
    Physical Address: {Physical_Address}<br>
    E-mail: <a href='mailto:{Email}'>{Email}</a><br>
    Phone: {Phone}<br>
    County: {County}<br>
    Tourism Region: {Tourism_Region}<br>
    CEDR: {CEDR}
  `,
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
        title: "{Business_Name}",
        content:`
        Town or City: {Township}<br>
        Website: <a href='{Website}' target='_blank'>{Website}</a><br>
        Physical Address: {Physical_Address}<br>
        E-mail: <a href='mailto:{Email}'>{Email}</a><br>
        Phone: {Phone}<br>
        County: {County}<br>
        Tourism Region: {Tourism_Region}<br>
        CEDR: {CEDR}
      `,
        
        fieldInfos: [
          // Add additional fieldInfos for other properties you want to display in the popup
        ]
      },
  renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          size: 5,
          color: "rgba(80, 249, 213, 0.1)",
          outline: {
            color: "rgba(80, 249, 213, 0.15)",
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
      type: "unique-value",  // renderer type
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
  
            // #7F3C8D,#11A579,#3969AC,#F2B701,#E73F74,#80BA5A,#E68310,#008695,#CF1C90,#f97b72,#4b4b8f,#A5AA99
          }
        },
        {
          value: "Parking",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#88A4E0",  // Color for Parking
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
          value: "Gate",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#F2B701",  // Color for Gate
            size: 2,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Wildlife Viewing",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#E73F74",  // Color for Wildlife Viewing
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
          value: "Park Office",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#E68310",  // Color for Park Office
            size: 3,
            outline: {
              width: 0
            }
          }
        },
        {
          value: "Lookout Tower",
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#002CFF",  // Color for Lookout Tower
            size: 4,
            outline: {
              width: 0
            }
          }
        },
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
          value: "Parking",
          symbol: {
            type: "picture-marker",  // symbol type
            url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/parking.png",
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
          value: "Gate",
          symbol: {
            type: "picture-marker",  // symbol type
            url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/entrance.png",
            width: 8,
            height: 8
          }
        },
        {
          value: "Wildlife Viewing",
          symbol: {
            type: "picture-marker",  // symbol type
            url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/wildlife.png",
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
        {
          value: "Park Office",
          symbol: {
            type: "picture-marker",  // symbol type
            url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/park office.png",
            width: 8,
            height: 8
          }
        },
        {
          value: "Lookout Tower",
          symbol: {
            type: "picture-marker",  // symbol type
            url:  "https://raw.githubusercontent.com/AustinSEgroup/NHOE-RetailBusinesses/main/img/lookout.png",
            width: 8,
            height: 8
          }
        },
      ]
    }
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
  
  });
  
   const NHtrailsPoints = new FeatureLayer({
    url: NHtrailsPointsLink,
    visible: false,
  //  labelingInfo: [stateLandsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: "rgba(174, 228, 187, .25)",
        outline: {
          color: "rgba(105, 141, 114 , .5)",
          width: 1
        }
      }
    },
  
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
  
  
  
  const NHconsvLand = new FeatureLayer({
    url: NHconsvLandLink,
    visible: false,
  //  labelingInfo: [stateLandsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(255, 220, 156, .25)",
        outline: {
          color: "rgba(105, 141, 114 , .5)",
          width: 1
        }
      }
    },
  
    popupTemplate: {
      title: "{NAME}",
      content: "Notes: {NOTES}"
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
          color: "rgba(174, 228, 187, .25)",
          outline: {
            color: "rgba(105, 141, 114 , .5)",
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
  
  // Toggle the active state of buttons
  function toggleActiveState(currentBtn, otherBtns) {
    if (currentBtn.classList.contains('active')) {
        // If button is already active, deactivate it
        currentBtn.classList.remove('active');
  
        
    } else {
        // Otherwise, activate the button
        currentBtn.classList.add('active');
  
        // Remove 'active' class from other buttons
        otherBtns.forEach(btnId => {
            let button = document.getElementById(btnId);
            if (button) {
                button.classList.remove('active');
            }
        });
    }
  }
  
  
  // Helper function to attach the event listeners
  function attachLayerToggleEvents(standardButtonId, dropdownButtonId, handlerFunction) {
      document.getElementById(standardButtonId).addEventListener('click', handlerFunction);
      document.getElementById(dropdownButtonId).addEventListener('click', handlerFunction);
      console.log("attachLayerToggleEvents")
  }
  
  
  function handleDataLayerToggle(selectedBoundaryLayer) {
    console.log("handleBoundaryLayerToggle")
    console.log(selectedBoundaryLayer);
  
    if (isClusteringEnabled && selectedBoundaryLayer .visible) {
        pseudoClusterLayer.removeAll();
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
    }  if (isClusteringEnabled && !selectedBoundaryLayer .visible){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        drawCluster();
    }
       if (!isClusteringEnabled){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        applyFilter();
      }
    }
  
  
  function handleBoundaryLayerToggle(layerToToggle, otherLayers) {
    selectedBoundaryLayer = layerToToggle;
    console.log(selectedBoundaryLayer.title)
    // Set visibility of the selected layer
    if (layerToToggle.visible) {
        layerToToggle.visible = false;
    } else {
        layerToToggle.visible = true;
        // Hide all other boundary layers
        for (let layer of otherLayers) {
            layer.visible = false;
        }
    }
    
    // If clustering is enabled and the selected boundary layer is visible, hide the main layer
    // and apply polygon clustering. Otherwise, make sure the main layer is visible.
    if (isClusteringEnabled && layerToToggle.visible) {
        pseudoClusterLayer.removeAll();
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        layer.visible = false;
    }  if (isClusteringEnabled && !layerToToggle.visible){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        drawCluster();
    }
       if (!isClusteringEnabled){
        pseudoClusterLayer.removeAll();
        layer.visible = true;
        applyFilter();
      }
    }
  
  attachLayerToggleEvents('toggleTownships', 'dropdownToggleTownships', function() {
    toggleActiveState(this, ['toggleCEDRregions', 'toggleTourismRegions', 'toggleCounties']);
    handleBoundaryLayerToggle(newHampshireTownships, [cedrRegions, tourismRegions, newHampshireCounties]);
     
  });
  attachLayerToggleEvents('toggleCEDRregions', 'dropdownToggleCEDRregions', function() {
    toggleActiveState(this, ['toggleTourismRegions', 'toggleCounties', 'toggleTownships']);
      handleBoundaryLayerToggle(cedrRegions, [tourismRegions, newHampshireCounties, newHampshireTownships]);
     
  });
  
  attachLayerToggleEvents('toggleTourismRegions', 'dropdownToggleTourismRegions', function() {
    toggleActiveState(this, ['toggleCEDRregions', 'toggleCounties', 'toggleTownships']);
      handleBoundaryLayerToggle(tourismRegions, [cedrRegions, newHampshireCounties, newHampshireTownships]);
      
  });
  
  attachLayerToggleEvents('toggleCounties', 'dropdownToggleCounties', function() {
    toggleActiveState(this, ['toggleCEDRregions', 'toggleTourismRegions', 'toggleTownships']);
      handleBoundaryLayerToggle(newHampshireCounties, [cedrRegions, tourismRegions, newHampshireTownships]);
      
  });
  
  
  /************************* MAP INITIALIZATION *************************/
    const map = new Map({
      layers: [baseLayer, NHconsvLand, NHstateLands, NHdncrstateLands, layer, NHrecAreas, NHrecPoints, NHtrailsLines, NHtrailsPoints, NHwaterAccess, NHwaterAccess2,  newHampshire, newHampshireTownships, newHampshireCounties, cedrRegions, tourismRegions,layer]
    });
    
    
    map.layers.add(baseLayerLabels);
    const view = new MapView({
      container: "viewDiv",
      center: [-71.5, 43.9],
      constraints: {
        minScale: 2800000
      },
      map: map
    });
  
    
    newHampshire.effect = "bloom(1, 0.1px, 15%)";
    
  
    const filterFieldsRetBus = {
      filterNationalChain: "National_Chain",
      filterRegionalChain: "Regional_Chain",
      filterLocalBusiness: "Local_Business",
      filterGuidingTraining: "Guiding_Training",
      filterSocialEvents: "Social_Events",
      filterUsedGear: "Used_Gear",
      filterHiking: "Hiking",
      filterSnowshoeing: "Snowshoeing",
      filterRunningTrailRunning: "Running_Trail_Running",
      filterMotorizedBoatingWaterSports: "Motorized_Boating___Water_sport",
      filterWhitewaterSports: "Whitewater_sports",
      filterPaddleSports: "Paddle_sports",
      filterMountainBiking: "Mountain_Biking",
      filterRoadGravelBiking: "Road_Gravel_Biking",
      filterBMX: "BMX",
      filterSkateboardingRollerskating: "Skateboarding_Rollerskating",
      filterOHRV: "OHRV",
      filterHunting: "Hunting",
      filterFishing: "Fishing",
      filterCamping: "Camping",
      filterWildlifeViewing: "Wildlife_Viewing",
      filterSurfing: "Surfing",
      filterSwimmingDiving: "Swimming_Diving",
      filterSnowmobiling: "Snowmobiling",
      filterDownhillSkiingSnowboarding: "Downhill_Skiing___Snowboarding",
      filterBackcountryAlpineSkiing: "	Backcountry_Alpine_Skiing",
      filterNordicSkiing: "Nordic_Skiing",
      filterRockClimbing: "Rock_Climbing",
      filterIceClimbing: "Ice_Climbing",
      filterMountaineering: "Mountaineering",
      filterHorseback: "Horseback",
      filterOther: "Other",
    };
  
  const filterFieldsRecProv = {
    filterLessonsGuiding: "Lessons_Guiding",
    filterDownhillSki: "Downhill_Ski",
    filterNordicSkiSnowshoe: "Nordic_Ski_Snowshoe",
    filterBiking: "Biking",
    filterWhitewater: "Whitewater_Paddle",
    filterOHRV: "OHRV",
    filterCampground: "Campground",
    filterClimbingMountaineeringHiking: "Climbing_Mountaineering_Hiking",
    filterMotorizedBoatingWaterSports: "Motorized_Boating_Water_Sports",
    filterSnowmobile: "Snowmobile",
    filterFishing: "Fishing",
    filterArcheryShootingHunting: "Archery_Shooting_Hunting",
    filterSurfing: "Surfing",
    filterHorsebackRiding: "Horseback_Riding",
    filterWildlifeViewing: "Wildlife_Viewing",
    filterSleepawaySummerCamps: "Sleepaway_Summer_Camps"
  };
  
  const filterFieldsB2B = {
  filterB2BSalesDistribution: "B2B Sales/Distribution",
  filterManufacturing: "Manufacturing",
  filterDesignConstruction: "Design/Construction",
  filterConsultingServices: "Consulting Services",
  filterOtherB2B: "Other",
  };
  
  const filterFieldsNonProfits = {
  filterIndustryAssociationAdvocate: "Industry Association/Advocate",
  filterOutdoorRecOutings: "Outdoor Rec. Outings",
  filterEnvEd: "Env. Ed.",
  filterTrailDevelopmentMaintenance: "Trail Development & Maintenance",
  filterLandConservationStewardship: "Land Conservation/Stewardship",
  };
  
  const trailFilterFieldsMap = {
    filterPED: "PED",
    filterMTNBIKE: "MTNBIKE",
    filterROADBIKE: "ROADBIKE",
    filterXCSKI: "XCSKI",
    filterSNOWMBL: 'SNOWMBL',
    filterATV: 'ATV',
    filterDIRTBIKE: 'DIRTBIKE',
    filterHORSE: 'HORSE',
    filterPADDLE: 'PADDLE',
    filterPAVED: 'PAVED',
    filterGROOMED: 'GROOMED',
    filterADA: 'ADA',
    filterWIDE: 'WIDE',
    filterALPINESKI: 'ALPINESKI',
    filterOther: 'Other'
  };
  /******************* DRAW CLUSTER FUNCTION  *******************/
  
  function drawCluster() {
  
    if (isClusteringEnabled && selectedBoundaryLayer.visible) {
      pseudoClusterLayer.removeAll();
      applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
      layer.visible = false;
    } 
    
    else if (!isAnyFieldSelected) {
      layer.visible = true;
      drawSimpleCluster();
    }
  
    else if (!isClusteringEnabled){
      layer.visible = true;
      applyFilter();
      return;
    }
    
  else {
    
    layer.visible = true;
    clusterConfig = {
    
    type: "cluster",
  
    popupTemplate: {
      title: "{cluster_count} Providers",
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
  
  /********************************* SPINNER FUNCTION ********************************************* */
  
  
  /********************************** CLUSTER BY POLYGON ******************************************** */
  
  
  
  
  const CHUNK_SIZE = 25;
  
  const pseudoClusterLayer = new GraphicsLayer();
  map.add(pseudoClusterLayer);
  
  function applyPolygonClustering(selectedBoundaryLayer, layer, selectedField) {
    
      // If clustering is not enabled, exit
      if (!isClusteringEnabled) {
          return;
      }
  
      showSpinner();
      pseudoClusterLayer.removeAll();
  
      let polygonsQuery = selectedBoundaryLayer.createQuery();
  
      selectedBoundaryLayer.queryFeatures(polygonsQuery).then(result => {
          const polygons = result.features;
          processChunk(polygons, layer, selectedField);
      });
  }
  
  function processChunk(polygons, layer, selectedField, index = 0) {
      if (index >= polygons.length) {
          hideSpinner();
          return;
      }
  
      const chunk = polygons.slice(index, index + CHUNK_SIZE);
  
      Promise.all(chunk.map(polygon => processPolygon(polygon, layer, selectedField)))
          .then(() => {
              setTimeout(() => {
                  processChunk(polygons, layer, selectedField, index + CHUNK_SIZE);
              }, 20);
          })
          .catch(error => {
              console.error("Error processing a chunk:", error);
              hideSpinner();
          });
  }
  
  function processPolygon(polygon, layer, selectedField) {
      return new Promise((resolve, reject) => {
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
  
          layer.queryFeatures(pointsQuery)
              .then(pointResults => {
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
                      }
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
  
                  pseudoClusterLayer.addMany([clusterGraphic, labelGraphic]);
                  resolve();
              })
              .catch(error => {
                  console.error("Error processing a polygon:", error);
                  reject(error);
              });
      });
  }
  
  function showSpinner() {
      document.getElementById('loadingDiv').style.display = 'block';
  }
  
  function hideSpinner() {
      document.getElementById('loadingDiv').style.display = 'none';
  }
  /************************** SIMPLER CLUSTER RENDERER ******************/
  
  
  function drawSimpleCluster() {
  clusterConfig = {
      type: "cluster",
      popupTemplate: {
          title: "{cluster_count} Providers",
          fieldInfos: [{
              fieldName: "cluster_count",
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
  
  
  
  
  /*********************** ONLY DISPLAY ONE BUSINESS CATEGORY *************/
  
  /* const exclusiveCheckboxes = [
    'filterNationalChain',
    'filterRegionalChain',
    'filterLocalBusiness'
  ];
  
  exclusiveCheckboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        if (this.checked) {
            // Uncheck other exclusive checkboxes
            for (let otherId of exclusiveCheckboxes) {
                if (otherId !== id) {
                    document.getElementById(otherId).checked = false;
                }
            }
        }
  
        // Call your applyFilter function or any other logic that you want to trigger on change
        applyFilter();
    });
  });
  
  
  
  /******************************** FILTER DATA BY SELECTED FIELD *****************/
  NHtrailsLines.visible = false;
  
  const boundaryLayerVisible = tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible;
  
  
  function applyClusterIfNecessary(boundaryLayerVisible, layer, selectedField) {
    if (isClusteringEnabled && boundaryLayerVisible) {
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
  
  function applyFilter() {
    const filters = {};
  
    const selectedFields = Object.entries(filterFieldsMap)
        .filter(([id, field]) => document.getElementById(id).checked)
        .map(([id, field]) => field);
  
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
  }
  
  Object.keys(filterFieldsMap).forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        isAnyFieldSelected = Object.keys(filterFieldsMap).some(key => document.getElementById(key).checked);
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
      /*************************** FILTER TRAILS ********************* */
      /* document.getElementById('NHtrailsLinesToggle').addEventListener('change', function() {
        const filterContainer = document.getElementById('NHtrailsFilterContainer');
        
        if (this.checked) {
            filterContainer.style.display = 'block';
        } else {
            filterContainer.style.display = 'none';
        }
      });
      
      function applyTrailsFilter() {
        const filters = {};
      
        if (isAnyTrailFieldSelected) {
            for (let [id, field] of Object.entries(trailFilterFieldsMap)) {
                if (document.getElementById(id).checked) {
                    selectedTrailField = field;
                    filters[field] = "1";
                }
            }
            
            let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
            NHtrailsLines.definitionExpression = definitionExpression;
            NHtrailsLines.renderer.symbol.color = "#F5475C";
            
            NHtrailsLines.renderer.symbol.width = "1";
            NHtrailsLines.effect = false;
  
        } else {
          NHtrailsLines.definitionExpression = null;
          NHtrailsLines.renderer.symbol.color = "rgba(224, 176, 136, .8)";
          NHtrailsLines.renderer.symbol.style = "short-dot";
        }
      }
      
      // Assuming trailFilterFieldsMap is an object you've defined elsewhere
      for (let id of Object.keys(trailFilterFieldsMap)) {
          document.getElementById(id).addEventListener('change', function() {
              isAnyTrailFieldSelected = Array.from(Object.keys(trailFilterFieldsMap)).some(key => document.getElementById(key).checked);
              applyTrailsFilter();
          });
      }
      
   
    /*************************** TOGGLE CLUSTERING  ***********************/
   
  
   document.getElementById('toggleClustering').addEventListener('click', function() {
      isClusteringEnabled = !isClusteringEnabled;
      
      if (isClusteringEnabled && (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible)) {
        applyPolygonClustering(selectedBoundaryLayer, layer, selectedField);
        this.classList.add('active');
        layer.visible = false;
      } 
  
      else if (isClusteringEnabled) {
          this.classList.add('active');
          layer.effect = "bloom(0, 0.1px, 15%)";
          pseudoClusterLayer.removeAll();
          let selectedFields = [];
          for (let [id, field] of Object.entries(filterFieldsMap)) {
              if (document.getElementById(id).checked) {
                  selectedFields.push(field);
              }
          }
          
          if (isAnyFieldSelected) {
              layer.visible = true;
              drawCluster();
          } else {
              layer.visible = true;
              drawSimpleCluster();
          }
      } else {
          pseudoClusterLayer.removeAll();
          this.classList.remove('active');
          layer.featureReduction = null;
          layer.visible = true;
          layer.effect = "bloom(4, 0.1px, 5%)";
      }
  });
  
     /*********************** QUERY AND HIGHLIGHT FUNCTION *************************/
  
  
     layer.cedrRegions = "cedrRegions";
     layer.tourismRegions = "tourismRegions";
     layer.newHampshireCounties = "newHampshireCounties";
     layer.ewHampshireTownships = "newHampshireTownships";
  
   const nameFieldArray = [
    { id: "cedrRegions", name: "CEDR" },
    { id: "tourismRegions", name: "TourismReg" },
    { id: "newHampshireCounties", name: "County" },
    { id: "newHampshireTownships", name: "pbpNAME" }
  ];
     
     const selectedFieldNameElement = document.getElementById("selectedFieldName");
     const statisticsValueElement = document.getElementById("statisticsValue");
     
   
     view.on("click", function(event) {
      
      if (selectedBoundaryLayer && selectedBoundaryLayer.visible) {
        const query = selectedBoundaryLayer.createQuery();
        query.geometry = event.mapPoint;
    
        selectedBoundaryLayer.queryFeatures(query).then(function(result) {
          if (result.features.length > 0) {
            const selectedPolygon = result.features[0];
            view.graphics.removeAll();
            console.log(selectedPolygon);
    
            const highlightSymbol = new SimpleFillSymbol({
              color: "white",
              style: "none",
              outline: {
                color: "#D5FF9C",
                width: 3
              }
            });
    
            const highlightGraphic = new Graphic({
              geometry: selectedPolygon.geometry,
              symbol: highlightSymbol
            });
    
            view.graphics.add(highlightGraphic);
    
            const currentNameField = nameFieldArray[selectedBoundaryLayer.id];
            console.log(selectedBoundaryLayer.layerId),
            selectedFieldNameElement.textContent = selectedPolygon.attributes[currentNameField];
    
            queryPointData(selectedPolygon);
          }
        }).catch(function(error) {
          console.error("Error during boundary layer query:", error);
        });
      }
    });
    
    function queryPointData(selectedPolygon) {
      const currentNameField = nameFieldArray[selectedBoundaryLayer.id];
    
      const query = layer.createQuery();
      query.geometry = selectedPolygon.geometry;
      query.where = `${selectedField} = '1'`; 
      query.outFields = [currentNameField];
    
      query.outStatistics = [
        {
          onStatisticField: `${selectedField}`,
          outStatisticFieldName: "sum",
          statisticType: "sum"
        }
      ];
    
      layer.queryFeatures(query).then(function(result) {
        if (result.features.length > 0) {
          const statistics = result.features[0].attributes.sum;
          const regionName = result.features[0].attributes[currentNameField];
   
          selectedFieldNameElement.textContent = regionName;
          statisticsValueElement.textContent = statistics;
        
        }
      }).catch(function(error) {
        console.error("Error during point data query:", error);
      });
    }
  
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
    view.ui.remove("zoom")
  
    const infoDiv = document.getElementById("infoDiv");
    view.ui.add(new Expand({
      view: view,
      content: infoDiv,
      expandIcon: "select-category",
      expanded: true
    }), "top-left");
  
    view.ui.add(new Expand({
      view: view,
      content: print,
      expandIcon: "print",
      expanded: false,
  
    }), "top-left");
  
    view.ui.add(new Home({
      view: view
    }), "top-left");
  
    const legend = new Legend({
      view: view,
      container: "legendDiv"
    });
  
  
    const layerMap = {
      'NHconsvLandToggle': NHconsvLand,
      'NHrecAreasToggle': NHrecAreas,
      'NHtrailsLinesToggle': NHtrailsLines,
      'NHrecPointsToggle' : NHrecPoints,
      'NHtrailsPointsToggle': NHtrailsPoints,
      'NHwaterAccessHeatToggle': NHwaterAccess, 
      'NHwaterAccessToggle': NHwaterAccess2, 
      'NHstateLandsToggle': NHstateLands,
      'NHdncrstateLandsToggle': NHdncrstateLands
  };
  
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
  
    // For larger screens
    document.getElementById("retailLink").addEventListener('click', function() {
      console.log("Button clicked!");
        updateFields('retailBusiness');
        if (this.classList.contains('active')) {
          // If button is already active, deactivate it
          this.classList.remove('active');
    
          
      } else {
          // Otherwise, activate the button
          this.classList.add('active');
    
          // Remove 'active' class from other buttons
          nonProfitLink.classList.remove('active');
      
          b2bManufacturersLink.classList.remove('active');
          recProvidersLink.classList.remove('active');
      }
        
    });
  
    const linkIds = [
      'recProviderLink', 
      'b2bManufacturerLink', 
      'nonProfitLink'
  ];
  
  const dataMappingForLinks = {
      'recProviderLink': 'recProviders',
      'b2bManufacturerLink': 'b2bManufacturers',
      'nonProfitLink': 'nonProfits'
  };
  
  linkIds.forEach(id => {
      document.getElementById(id).addEventListener('click', function() {
          updateFields(dataMappingForLinks[id]);
          toggleActiveState(this);
      });
  });
  
  function toggleActiveState(clickedElement) {
      linkIds.forEach(id => {
          const elem = document.getElementById(id);
          if (elem === clickedElement) {
              // Toggle 'active' state for clicked element
              if (elem.classList.contains('active')) {
                  elem.classList.remove('active');
              } else {
                  elem.classList.add('active');
              }
          } else {
              // Remove 'active' class from other elements
              elem.classList.remove('active');
          }
      });
  }
  
    // For smaller screens (dropdown links)
    document.getElementById("retailDropdownLink").addEventListener('click', function() {
        updateFields('retailBusiness');
  
        
    });
  
    document.getElementById("recProviderDropdownLink").addEventListener('click', function() {
        updateFields('recProviders');
  
        
    });
  
    document.getElementById("b2bManufacturerDropdownLink").addEventListener('click', function() {
        updateFields('b2bManufacturers');
  
    });
  
    document.getElementById("nonProfitDropdownLink").addEventListener('click', function() {
        updateFields('nonProfits');
   
  
  });
  
    });