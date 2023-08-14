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
  "esri/widgets/LayerList",
  
], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home, Print, SimpleLineSymbol, Collection, GraphicsLayer, Graphic, SimpleFillSymbol, LayerList) => {
  let selectedField;
  let clusterConfig;
  let isAnyFieldSelected = false;
  let isClusteringEnabled = false;

  

  /******************** LAYER LINKS  *********************/

  let baseLayerLink = "https://api.mapbox.com/styles/v1/anovak/cll6duwmo00at01pw0c28g05a/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg";
  let baseLayerLabelsLink = "";
  // boundaries
  let tourismRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Tourism_Regions/FeatureServer";
  let cedrRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_CEDR/FeatureServer";
  let newHampshireCountiesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Counties/FeatureServer";
  let newHampshireTownshipsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_Political_Boundaries/FeatureServer";
  let newHampshireLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_State_Boundary/FeatureServer";
  
  // business census data
  let retailBusinessesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer";
  let recreationProvidersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RecreationProviders_with1s/FeatureServer";
  let b2bManufacturersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/B2B_with1s/FeatureServer";
  let nonProfitsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NonProfit_with1s/FeatureServer";
  let currentLayerLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer";

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

/********************* CLUSTER BASED ON POLYGON  ***************/






  /******************* DRAW CLUSTER FUNCTION  *******************/

  function drawCluster() {
    if (tourismRegions.visible || cedrRegions.visible || newHampshireCounties.visible || newHampshireTownships.visible) {
      applyPolygonClustering();
    } 
  else {
    
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
            { value: 1, size: 3 },
            { value: 3, size: 9 },
            { value: 9, size: 18},
            { value: 16, size: 32 },
            { value: 24, size: 48 },
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
function applyPolygonClustering() {
  let selectedPolygonLayer;

  if (tourismRegionLayer.visible) {
      selectedPolygonLayer = tourismRegionLayer;
  } else if (cedrRegionLayer.visible) {
      selectedPolygonLayer = cedrRegionLayer;
  } else if (NHcountiesLayer.visible) {
      selectedPolygonLayer = NHcountiesLayer;
  } else if (townshipsLayer.visible) {
      selectedPolygonLayer = townshipsLayer;
  } else {
      return; 
  }

  // For each polygon in the selectedPolygonLayer
  selectedPolygonLayer.queryFeatures().then(result => {
      const polygons = result.features;

      for (let polygon of polygons) {
          const query = new Query();
          query.geometry = polygon.geometry;  // Spatially constrain to this polygon
          query.spatialRelationship = "intersects";
          query.where = `${selectedField} = 1`;

          mainPointsLayer.queryFeatures(query).then(pointsInPolygon => {
              // For this example, I'm simply using the count of points inside the polygon 
              // as a way to mimic clustering. The more points inside, the bigger the cluster representation.
              
              const countOfPoints = pointsInPolygon.features.length;

              const clusterConfig = {
                  type: "simple",
                  symbol: {
                      type: "simple-marker",
                      style: "circle",
                      color: "#83DBBB",
                      size: determineSize(countOfPoints),
                      outline: {
                          color: "#9BF1D2",
                          width: 5
                      }
                  },
                  label: countOfPoints.toString(), // To display count on the cluster
                  geometry: polygon.geometry.centroid // Use the centroid of the polygon as the "cluster" center
              };
              layer.featureReduction = clusterConfig;
              // Here, you'd apply clusterConfig to a graphics layer or similar. 
              // This might require creating new Graphic objects and adding them to a layer.
              // Or, if you have a custom rendering logic in place, integrate it here.
          });
      }
  });
}

function determineSize(count) {
  if (count <= 3) return 9;
  if (count <= 9) return 18;
  if (count <= 16) return 32;
  if (count <= 24) return 48;
  return 64
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
                  { value: 1, size: 3 },
                  { value: 3, size: 9 },
                  { value: 9, size: 18 },
                  { value: 16, size: 32 },
                  { value: 24, size: 48 },
                  { value: 32, size: 64 },
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


/************************ LABEL CLASSES***************************/
const trailsLabelClass = {
  // autocasts as new LabelClass()
  symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "black",
      haloSize: 1,
      haloColor: "white"
  },
  labelPlacement: "center-along",  // This will make the label follow the path of the line
  labelExpressionInfo: {
      expression: "$feature.TRAILNAME"
  },
  minScale: 50000,  // Example scale value; adjust this for the desired zoom level
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
     }
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
     }
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
       }
    },
    labelPlacement: "above-right",
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
         size: 10
       }
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
      content: "Town or City: {Township}<br>Website: <a href='{Website}' target='_blank'>{Website}</a>",
      fieldInfos: [
        // Add additional fieldInfos for other properties you want to display in the popup
      ]
    },
renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 3,
        color: "rgba(80, 249, 213, 0.4)",
        outline: {
          color: "rgba(80, 249, 213, 0.4)",
          width: 1
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
 /********************** SUPPLEMENTAL RECREATION LAYERS ****************/

 const NHrecAreas = new FeatureLayer({
  url: NHrecAreasLink,
  visible: false,
//  labelingInfo: [stateLandsLabels],
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

 const NHrecPoints = new FeatureLayer({
  url: NHrecPointsLink,
  visible: false,
//  labelingInfo: [stateLandsLabels],
  
});


 const NHtrailsLines = new FeatureLayer({
  url: NHtrailsLinesLink,
  visible: false,
  labelingInfo: [trailsLabelClass],
renderer: {
  type: "simple",
  symbol: {
    type: "simple-line", // Change from "simple-fill" to "simple-line"
    color: "rgba(105, 141, 114 , .5)",
    width: 1,
    style: "dash",  // Add this line for a dashed style
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
      type: "simple-fill",
      color: "rgba(174, 228, 187, .25)",
      outline: {
        color: "rgba(105, 141, 114 , .5)",
        width: 1
      }
    }
  },

});

const NHwaterAccess = new FeatureLayer({
  url: NHwaterAccessLink,
  visible: false,
//  labelingInfo: [stateLandsLabels],
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

});


const NHwildlifeCorridors = new FeatureLayer({
  url: NHwildlifeCorridorsLink,
  visible: false,
//  labelingInfo: [stateLandsLabels],
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

  const NHstateLands = new FeatureLayer({
    url: NHstateLandsLink,
  //  labelingInfo: [stateLandsLabels],
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

/********************** REC LAYER TOGGLES **************************** */

/********************** MAIN LAYER TOGGLES *****************************/
let selectedBoundaryLayer = null;

cedrRegions.visible = false;
tourismRegions.visible = false;
newHampshireCounties.visible = false;
newHampshireTownships.visible = false;

// Toggle visibility of cedrRegions layer when the button is clicked
document.getElementById('toggleCEDRregions').addEventListener('click', function() {
  selectedBoundaryLayer = cedrRegions;
  cedrRegions.visible = !cedrRegions.visible;
  tourismRegions.visible = false; // Turn off tourismRegions
  newHampshireCounties.visible = false; // Turn off newHampshireCounties
  newHampshireTownships.visible = false;

  // Add active class to the clicked button and remove it from other buttons
  if (this.classList.contains('active')) {
    this.classList.remove('active');
    view.graphics.removeAll();
  }
  else {
    this.classList.add('active');
  }

  document.getElementById('toggleTourismRegions').classList.remove('active');
  document.getElementById('toggleCounties').classList.remove('active');
  document.getElementById('toggleTownships').classList.remove('active');
  view.graphics.removeAll();
 ;
});

document.getElementById('toggleTourismRegions').addEventListener('click', function() {
  selectedBoundaryLayer = tourismRegions;
  tourismRegions.visible = !tourismRegions.visible;
  cedrRegions.visible = false; // Turn off cedrRegions
  newHampshireCounties.visible = false; // Turn off newHampshireCounties
  newHampshireTownships.visible = false;

  // Add active class to the clicked button and remove it from other buttons
    if (this.classList.contains('active')) {
    this.classList.remove('active');
    view.graphics.removeAll();
 ;
  }
  else {
    this.classList.add('active');
  }

  document.getElementById('toggleCEDRregions').classList.remove('active');
  document.getElementById('toggleCounties').classList.remove('active');
  document.getElementById('toggleTownships').classList.remove('active');
  view.graphics.removeAll();
 
});

document.getElementById('toggleCounties').addEventListener('click', function() {
  selectedBoundaryLayer = newHampshireCounties;
  newHampshireCounties.visible = !newHampshireCounties.visible;
  cedrRegions.visible = false; // Turn off cedrRegions
  tourismRegions.visible = false; // Turn off tourismRegions
  newHampshireTownships.visible = false;
    console.log(selectedBoundaryLayer)
  // Add active class to the clicked button and remove it from other buttons
    if (this.classList.contains('active')) {
    this.classList.remove('active');
    view.graphics.removeAll();    
  }
  else {
    this.classList.add('active');
  }

  document.getElementById('toggleCEDRregions').classList.remove('active');
  document.getElementById('toggleTourismRegions').classList.remove('active');
  document.getElementById('toggleTownships').classList.remove('active');
  view.graphics.removeAll();

});

document.getElementById('toggleTownships').addEventListener('click', function() {
  selectedBoundaryLayer = newHampshireTownships;
  newHampshireTownships.visible = !newHampshireTownships.visible;
  cedrRegions.visible = false; // Turn off cedrRegions
  tourismRegions.visible = false; // Turn off tourismRegions
  newHampshireCounties.visible = false; // Turn off newHampshireCounties

  // Add active class to the clicked button and remove it from other buttons
    if (this.classList.contains('active')) {
    this.classList.remove('active');
    view.graphics.removeAll();
  }
  else {
    this.classList.add('active');
  }

  document.getElementById('toggleCEDRregions').classList.remove('active');
  document.getElementById('toggleTourismRegions').classList.remove('active');
  document.getElementById('toggleCounties').classList.remove('active');
  
  view.graphics.removeAll();
});


/************************* MAP INITIALIZATION *************************/
  const map = new Map({
    layers: [baseLayer, NHconsvLand, NHrecAreas, NHrecPoints, NHtrailsLines, NHtrailsPoints, NHwaterAccess, NHstateLands, NHdncrstateLands, newHampshire, newHampshireTownships, newHampshireCounties, cedrRegions, tourismRegions, layer]
  });
  map.layers.add(baseLayerLabels);
  const view = new MapView({
    container: "viewDiv",
    center: [-71.5, 43.9],
    constraints: {
      minScale: 2250000
    },
    map: map
  });

  
  newHampshire.effect = "bloom(1, 0.1px, 15%)";
  

    const filterFieldsMap = {
      filterNationalChain: "National_Chain",
      filterRegionalChain: "Regional_Chain",
      filterLocalBusiness: "Local_Business",
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
  layer.effect = "bloom(3, 0.1px, 15%)";



/*********************** ONLY DISPLAY ONE BUSINESS CATEGORY *************/

const exclusiveCheckboxes = [
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

function applyFilter() {
  
  const filters = {};
  
  if (isAnyFieldSelected) {
      for (let [id, field] of Object.entries(filterFieldsMap)) {
          if (document.getElementById(id).checked) {
              selectedField = field;
              filters[field] = "1";
          }
      }
      
      let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
      layer.definitionExpression = definitionExpression;
      
      if (isClusteringEnabled) {
          drawCluster();
      }
  } else {
      layer.definitionExpression = null;
      
      if (isClusteringEnabled) {
          drawSimpleCluster();
      }
  }
}
  
  for (let id of Object.keys(filterFieldsMap)) {
    document.getElementById(id).addEventListener('change', function() {
        
        isAnyFieldSelected = Array.from(Object.keys(filterFieldsMap)).some(key => document.getElementById(key).checked);
        
        applyFilter();
    });
}

  /*************************** TOGGLE CLUSTERING  ***********************/
 

 document.getElementById('toggleClustering').addEventListener('click', function() {
    isClusteringEnabled = !isClusteringEnabled;
    
    if (isClusteringEnabled) {
        this.classList.add('active');
        this.textContent = "Disable Point Clustering";
        layer.effect = "bloom(0, 0.1px, 15%)";
        
        let selectedFields = [];
        for (let [id, field] of Object.entries(filterFieldsMap)) {
            if (document.getElementById(id).checked) {
                selectedFields.push(field);
            }
        }

        if (isAnyFieldSelected) {
            drawCluster();
        } else {
            drawSimpleCluster();
        }
    } else {
        this.classList.remove('active');
        layer.featureReduction = null;
        this.textContent = "Enable Point Clustering";
        layer.effect = "bloom(3, 0.1px, 15%)";
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
    query.where = `${selectedField} = '1'`;  // As you had it originally
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
    'NHtrailsPointsToggle': NHtrailsPoints,
    'NHwaterAccessToggle': NHwaterAccess,
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
  expanded: false
}), "top-left");
  });