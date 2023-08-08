require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/layers/WebTileLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/Home",
], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home) => {
  let selectedField;
  let isClusteringEnabled = true;
  let clusterConfig;


function drawCluster() {
  console.log(`${selectedField}`)
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
            { value: 1, size: 4 },
            { value: 2, size: 6 },
            { value: 4, size: 12 },
            { value: 8, size: 18 },
            { value: 16, size: 26 },
            { value: 32, size: 36 },
            { value: 64, size: 48 }
          ]
        }
      ]
    },

    clusterRadius: "120px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
 
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

const countyLabels = {  // autocasts as new LabelClass(){  // autocasts as new LabelClass()
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: {  // autocast as new Font()
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

  const tourismRegionsLabels = {  // autocasts as new LabelClass(){  // autocasts as new LabelClass()
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "white",
      haloColor: "#285a62",
      haloSize: 1,
      font: {  // autocast as new Font()
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
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer",
    featureReduction: clusterConfig,
    popupTemplate: {
      title: "{Name}",
      content: "Town or City: {Town or City}<br>Website: <a href='{Website}' target='_blank'>{Website}</a>",
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

  // background layer for geographic context
  const baseLayer = new WebTileLayer({
    urlTemplate: "https://api.mapbox.com/styles/v1/anovak/clkvo8z6e001j01q0b8ln9s7j/tiles/256/{level}/{col}/{row}?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg",
    id: "custom-basemap",
    title: "Custom Basemap",
  });


  const retailServiceProviders = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceProviders/FeatureServer?",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(179, 255, 152, 000)",
          width: 0.25
        }
      }
    },
  });

  const tourismRegions = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Tourism_Regions/FeatureServer",
    labelingInfo: [tourismRegionsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(201, 255, 238, .75)",
          width: 1
        }
      }
    },
    
  });

  const newHampshireCounties = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Counties/FeatureServer",
    labelingInfo: [countyLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(201, 255, 238, .75)",
          width: 1
        }
      }
    },
    
  });

  const newHampshire = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_State_Boundary/FeatureServer",
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
/********************** LAYER TOGGLES *****************************/

tourismRegions.visible = false;

  // Toggle visibility of newHampshireCounties layer when the button is clicked
  document.getElementById('toggleTourismRegions').addEventListener('click', function() {
    tourismRegions.visible = !tourismRegions.visible;
    if (tourismRegions.visible) {
      this.textContent = "Hide Tourism Regions";
    } else {
      this.textContent = "Show Tourism Regions";
    }
  });

newHampshireCounties.visible = false;

  // Toggle visibility of newHampshireCounties layer when the button is clicked
  document.getElementById('toggleCounties').addEventListener('click', function() {
    newHampshireCounties.visible = !newHampshireCounties.visible;
    if (newHampshireCounties.visible) {
      this.textContent = "Hide Counties";
    } else {
      this.textContent = "Show Counties";
    }
  });

/************************* MAP INITIALIZATION *************************/
  const map = new Map({
    layers: [baseLayer, newHampshire, newHampshireCounties, tourismRegions, retailServiceProviders, layer]
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-71.6, 43.75],
    constraints: {
      minScale: 4000000
    },
    map: map
  });
  
  newHampshire.effect = "bloom(1, 0.1px, 15%)";
  

    const filterFieldsMap = {
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
  layer.effect = "bloom(3, 0.1px, 15%)";
  function applyFilter() {
    const filters = {};
    
    for (let [id, field] of Object.entries(filterFieldsMap)) {
      if (document.getElementById(id).checked) {
        selectedField = field;
        filters[field] = "1";
      }
    }
  
    let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
    layer.definitionExpression = definitionExpression;
  
    if (Object.keys(filters).length > 0) {
      // Filters are selected, enable clustering and redraw cluster
      drawCluster();
      layer.featureReduction = clusterConfig;
      layer.effect = "bloom(0, 0.1px, 15%)";
    } else {
      // No filters selected, disable clustering
      layer.featureReduction = null;
      layer.effect = "bloom(3, 0.1px, 15%)";
    }
  }
  
  for (let id of Object.keys(filterFieldsMap)) {
      document.getElementById(id).addEventListener("change", applyFilter);
  }
  
  document.getElementById('toggleClustering').addEventListener('click', function() {
      if (isClusteringEnabled) {
          layer.featureReduction = null;
          isClusteringEnabled = false;
          this.textContent = "Toggle Clustering";
          layer.effect = "bloom(3, 0.1px, 15%)";
      } else {
          layer.featureReduction = clusterConfig;
          isClusteringEnabled = true;
          this.textContent = "Toggle Clustering";
          layer.effect = "bloom(0, 0.1px, 15%)";
      }
  });
 
   
  view.whenLayerView(layer).then(function (layerView) {
    view.goTo(layerView.fullExtent.expand(1.2));
  });
  const infoDiv = document.getElementById("infoDiv");
  view.ui.add(new Expand({
    view: view,
    content: infoDiv,
    expandIcon: "filter",
    expanded: true
  }), "top-left");

  view.ui.add(new Home({
    view: view
  }), "top-left");

  const legend = new Legend({
    view: view,
    container: "legendDiv"
  });

});
  