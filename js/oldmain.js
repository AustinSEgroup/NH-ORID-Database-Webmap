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
], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home, Print, SimpleLineSymbol) => {
  let selectedField;
  let isClusteringEnabled = true;
  let clusterConfig;
  let filterFieldsMap;

  /******************** LAYER LINKS  *********************/

  let baseLayerLink = "https://api.mapbox.com/styles/v1/anovak/clkvo8z6e001j01q0b8ln9s7j/tiles/256/{level}/{col}/{row}?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg";
  
  // boundaries
  let tourismRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Tourism_Regions/FeatureServer";
  let cedrRegionsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_CEDR/FeatureServer";
  let newHampshireCountiesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Counties/FeatureServer";
  let newHampshireLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_State_Boundary/FeatureServer";
  
  // business census data
  let retailBusinessesLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer";
  let recreationProvidersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RecreationProviders_with1s/FeatureServer";
  let b2bManufacturersLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/B2B_with1s/FeatureServer";
  let nonProfitsLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NonProfit_with1s/FeatureServer";
  let currentLayerLink = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer";

  // NH rec layers
  let NHrecPoints = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_Recreation_Inventory_(Points)/FeatureServer";
  let NHstateLands = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NH_StateLands/FeatureServer";
  let NHconsPublicLands = "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_Conservation_Public_Lands/FeatureServer";
 
  /******************* DRAW CLUSTER FUNCTION  *******************/

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
            { value: 50, size: 42 },
            { value: 64, size: 48 },
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

const cedrRegionsLabels = {  // autocasts as new LabelClass(){  // autocasts as new LabelClass()
  symbol: {
    type: "text",  // autocasts as new TextSymbol()
    color: "white",
    haloColor: "#285a62",
    haloSize: 1,
    font: {  // autocast as new Font()
       family: "Montserrat",
       style: "italic",
       size: 8
     }
  },
  labelPlacement: "center",
  labelExpressionInfo: {
    expression: "$feature.CEDR"
  },
  maxScale: 0,
  minScale: 25000000,
};

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

  const baseLayer = new WebTileLayer({
    urlTemplate: baseLayerLink,
    id: "custom-basemap",
    title: "Custom Basemap",
  });


  const cedrRegions = new FeatureLayer({
    url: cedrRegionsLink,
    labelingInfo: [cedrRegionsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(201, 255, 238, .75)",
          width: 1.5
        }
      }
    },
    
  });


  const tourismRegions = new FeatureLayer({
    url: tourismRegionsLink,
    labelingInfo: [tourismRegionsLabels],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(201, 255, 238, .75)",
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
          color: "rgba(201, 255, 238, .75)",
          width: 1.5
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
/********************** LAYER TOGGLES *****************************/

cedrRegions.visible = false;
tourismRegions.visible = false;
newHampshireCounties.visible = false;

// Toggle visibility of cedrRegions layer when the button is clicked
document.getElementById('toggleCEDRregions').addEventListener('click', function() {
  cedrRegions.visible = !cedrRegions.visible;
  tourismRegions.visible = false; // Turn off tourismRegions
  newHampshireCounties.visible = false; // Turn off newHampshireCounties

  updateToggleButtonText();
});

// Toggle visibility of tourismRegions layer when the button is clicked
document.getElementById('toggleTourismRegions').addEventListener('click', function() {
  tourismRegions.visible = !tourismRegions.visible;
  cedrRegions.visible = false; // Turn off cedrRegions
  newHampshireCounties.visible = false; // Turn off newHampshireCounties

  updateToggleButtonText();
});

// Toggle visibility of newHampshireCounties layer when the button is clicked
document.getElementById('toggleCounties').addEventListener('click', function() {
  newHampshireCounties.visible = !newHampshireCounties.visible;
  cedrRegions.visible = false; // Turn off cedrRegions
  tourismRegions.visible = false; // Turn off tourismRegions

  updateToggleButtonText();
});

function updateToggleButtonText() {
  document.getElementById('toggleCEDRregions').textContent = cedrRegions.visible ? "Hide CEDR Regions" : "Show CEDR Regions";
  document.getElementById('toggleTourismRegions').textContent = tourismRegions.visible ? "Hide Tourism Regions" : "Show Tourism Regions";
  document.getElementById('toggleCounties').textContent = newHampshireCounties.visible ? "Hide Counties" : "Show Counties";
}

/************************* MAP INITIALIZATION *************************/
  const map = new Map({
    layers: [baseLayer, newHampshire, newHampshireCounties, cedrRegions, tourismRegions, layer]
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
  




/********************************* SET ATTRIBUTE FILTERS *************************/
  const filterFieldsRetailBusiness = {
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

let filterFieldsRecreationProviders = {
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

const filterFieldsMapB2B = {
filterB2BSalesDistribution: "B2B Sales/Distribution",
filterManufacturing: "Manufacturing",
filterDesignConstruction: "Design/Construction",
filterConsultingServices: "Consulting Services",
filterOtherB2B: "Other",
};

const filterFieldsMapNonProfits = {
filterIndustryAssociationAdvocate: "Industry Association/Advocate",
filterOutdoorRecOutings: "Outdoor Rec. Outings",
filterEnvEd: "Env. Ed.",
filterTrailDevelopmentMaintenance: "Trail Development & Maintenance",
filterLandConservationStewardship: "Land Conservation/Stewardship",
};


/****************************** UPDATE CHECKBOXES WITH ATTRIBUTES *************************/

filterFieldsMap = filterFieldsRetailBusiness;

updateFilterCheckboxes(filterFieldsMap);

function updateFilterCheckboxes() {
  const filterCheckboxesContainer = document.createElement('div'); 

  const filterFields = filterFieldsMap;

  for (let [id, field] of Object.entries(filterFields)) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.value = field;

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = field;

    filterCheckboxesContainer.appendChild(checkbox);
    filterCheckboxesContainer.appendChild(label);
    filterCheckboxesContainer.appendChild(document.createElement('br'));
  }

  const filterDiv = document.getElementById('filterDiv');
  const previousFilterCheckboxesContainer = document.querySelector('#filterCheckboxesContainer');

  // Replace the previous filter checkboxes container with the updated one
  if (previousFilterCheckboxesContainer) {
    filterDiv.removeChild(previousFilterCheckboxesContainer);
  }

  filterCheckboxesContainer.id = 'filterCheckboxesContainer';
  filterDiv.appendChild(filterCheckboxesContainer);

}

/********************************* CHANGE CURRENTLY SELECTED DATA *************************/



document.getElementById('toggleRetailService').addEventListener('click', function() {
  currentLayerLink = retailBusinessesLink;
  filterFieldsMap = filterFieldsRetailBusiness;
  updateFilterCheckboxes(filterFieldsMap);
  layer.url = currentLayerLink; // Update the layer with new data source
  layer.refresh();
});

document.getElementById('toggleRecreationProviders').addEventListener('click', function() {
  console.log(currentLayerLink);
  currentLayerLink = recreationProvidersLink;
  filterFieldsMap = filterFieldsRecreationProviders;
  updateFilterCheckboxes(filterFieldsMap);
  console.log(currentLayerLink);
  layer.url = currentLayerLink; // Update the layer with new data source
  console.log(currentLayerLink);
  layer.refresh();
});

document.getElementById('toggleB2BManufacturers').addEventListener('click', function() {
  currentLayerLink = b2bManufacturersLink;
  filterFieldsMap = filterFieldsMapB2B;
  updateFilterCheckboxes(filterFieldsMap);
  layer.url = currentLayerLink; // Update the layer with new data source
});
console.log(currentLayerLink);
document.getElementById('toggleNonProfit').addEventListener('click', function() {
  currentLayerLink = nonProfitsLink;
  filterFieldsMap = filterFieldsMapNonProfits;
  updateFilterCheckboxes(filterFieldsMap);
  layer.url = nonProfitsLink; // Update the layer with new data source

});

  /************************* FILTER DATAPOINTS  *****************/
  function applyFilter() {
    const filters = {};
    
    console.log(filters);

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

    const isAnyFilterSelected = Object.values(filterFieldsMap).some(field => {
      return document.getElementById(field).checked;
    });
  
    const toggleClusteringButton = document.getElementById('toggleClustering');
    if (isAnyFilterSelected) {
      toggleClusteringButton.removeAttribute('disabled');
    } else {
      toggleClusteringButton.setAttribute('disabled', 'true');
    }
  }
  
  for (let id of Object.keys(filterFieldsMap)) {
    const element = document.getElementById(id);
    if (element) {
       // console.log(`Checkbox with ID: ${id}`);
        element.addEventListener("change", applyFilter);
    } else {
       // console.log(`Checkbox with ID ${id} not found`);
    }
}

  document.getElementById('toggleClustering').addEventListener('click', function() {
      if (isClusteringEnabled) {
          layer.featureReduction = null;
          isClusteringEnabled = false;
          this.textContent = "Enable/Disable Point Clustering";
          layer.effect = "bloom(3, 0.1px, 15%)";
      } else {
          layer.featureReduction = clusterConfig;
          isClusteringEnabled = true;
          this.textContent = "Enable/Disable Point Clustering";
          layer.effect = "bloom(0, 0.1px, 15%)";
      }
  });
 
  

  /*********************** PRINT FUNCTION *************************/

 const print = new Print({
  view: view,
  // specify your own print service
  printServiceUrl:
     "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
});


/***************** INITIALIZE MAP UI ITEMS***********************/
   
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

});
  