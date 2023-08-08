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
    let selectedFieldRecProv;
    let isClusteringEnabled = true;
    let clusterConfig1;
    let clusterConfig2;
    let clusterConfig3;
    let clusterConfig4;
    
  // RETAIL BUSINESS DRAW CLUSTER
    function drawClusterRetBus() {
      console.log(`${selectedFieldRetBus}`)
       clusterConfig1 = {
        
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
          name: `${selectedFieldRetBus}`,
          alias: `${selectedFieldRetBus}`,
          onStatisticField: `${selectedFieldRetBus}`,
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
              field: `${selectedFieldRetBus}`,
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
      retailBusinesses.featureReduction = clusterConfig1;
    }
     
  // RECREATION PROVIDERS DRAW CLUSTER
  
  function drawClusterRecProv() {
    console.log(`${selectedFieldRecProv}`)
     clusterConfig2 = {
      
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
        name: `${selectedFieldRecProv}`,
        alias: `${selectedFieldRecProv}`,
        onStatisticField: `${selectedFieldRecProv}`,
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
            field: `${selectedFieldRecProv}`,
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
    recProv.featureReduction = clusterConfig2;
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
  
    const recProv= new FeatureLayer({
      url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RecreationProviders_with1s/FeatureServer",
      featureReduction: clusterConfig2,
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
  
    const nonProfits = new FeatureLayer({
      url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/NonProfit_with1s/FeatureServer",
      featureReduction: clusterConfig4,
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
          size: 4,
          color: "rgba(41, 110, 214 ,  0.5)",
          outline: {
            color: "rgba(41, 110, 214 ,  0.5)",
            width: 1
          }
        }
      }
    });
  
    
    const B2B = new FeatureLayer({
      url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/B2B_with1s/FeatureServer",
      featureReduction: clusterConfig3,
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
          size: 6,
          color: "rgba(214, 104, 41  ,  0.5)",
          outline: {
            color: "rgba(214, 104, 41  ,  0.5)",
            width: 1
          }
        }
      }
    });
  
    const retailBusinesses = new FeatureLayer({
      url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceBusinesses_with1s/FeatureServer",
      featureReduction: clusterConfig1,
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
          size: 4,
          color: "rgba(36, 207, 227 ,  0.5)",
          outline: {
            color: "rgba(36, 207, 227 ,  0.5)",
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
      layers: [baseLayer, newHampshire, newHampshireCounties, tourismRegions, retailServiceProviders, recProv, retailBusinesses, B2B, nonProfits]
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
    
      const filterFieldsMap = {
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
    
    recProv.effect = "bloom(3, 0.1px, 15%)";
  // RETAIL BUSINESS APPLY FILTER
  
    function applyFilterRetBus() {
      const filters = {};
      
      for (let [id, field] of Object.entries(filterFieldsRetailBusiness)) {
        if (document.getElementById(id).checked) {
          selectedFieldRetBus = field;
          filters[field] = "1";
        }
      }
    
      let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
      recProv.definitionExpression = definitionExpression;
    
      if (Object.keys(filters).length > 0) {
        // Filters are selected, enable clustering and redraw cluster
        drawClusterRetBus();
        recProv.featureReduction = clusterConfig1;
        recProv.effect = "bloom(0, 0.1px, 15%)";
      } else {
        // No filters selected, disable clustering
        recProv.featureReduction = null;
        recProv.effect = "bloom(3, 0.1px, 15%)";
      }
    }
    
    for (let id of Object.keys(filterFieldsRetailBusiness)) {
        document.getElementById(id).addEventListener("change", applyFilterRetBus);
    }
    
    document.getElementById('toggleClustering').addEventListener('click', function() {
        if (isClusteringEnabled) {
          retailBusinesses.featureReduction = null;
            isClusteringEnabled = false;
            this.textContent = "Toggle Clustering";
            retailBusinesses.effect = "bloom(3, 0.1px, 15%)";
        } else {
          retailBusinesses.featureReduction = clusterConfig1;
            isClusteringEnabled = true;
            this.textContent = "Toggle Clustering";
            retailBusinesses = "bloom(0, 0.1px, 15%)";
        }
    });
  // RECREATION PROVIDERS APPLY FILTER
  
    function applyFilterRecProv() {
      const filters = {};
      
      for (let [id, field] of Object.entries(filterFieldsMap)) {
        if (document.getElementById(id).checked) {
          selectedFieldRecProv = field;
          filters[field] = "1";
        }
      }
    
      let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
      recProv.definitionExpression = definitionExpression;
    
      if (Object.keys(filters).length > 0) {
        // Filters are selected, enable clustering and redraw cluster
        drawClusterRecProv();
        recProv.featureReduction = clusterConfig2;
        recProv.effect = "bloom(0, 0.1px, 15%)";
      } else {
        // No filters selected, disable clustering
        recProv.featureReduction = null;
        recProv.effect = "bloom(3, 0.1px, 15%)";
      }
    }
    
    for (let id of Object.keys(filterFieldsMap)) {
        document.getElementById(id).addEventListener("change", applyFilterRecProv);
    }
    
    document.getElementById('toggleClustering').addEventListener('click', function() {
        if (isClusteringEnabled) {
          recProv.featureReduction = null;
            isClusteringEnabled = false;
            this.textContent = "Toggle Clustering";
            recProv.effect = "bloom(3, 0.1px, 15%)";
        } else {
          recProv.featureReduction = clusterConfig2;
            isClusteringEnabled = true;
            this.textContent = "Toggle Clustering";
            recProv.effect = "bloom(0, 0.1px, 15%)";
        }
    });
     
    view.whenLayerView(recProv).then(function (layerView) {
      view.goTo(layerView.fullExtent.expand(1.2));
    });
  
    const infoDivRetailBusiness = document.getElementById("infoDivRetailBusiness");
    view.ui.add(new Expand({
      view: view,
      content: infoDivRetailBusiness,
      expandIcon: "filter",
      expanded: true
    }), "top-left");
  
    const infoDivRecreationProvider = document.getElementById("infoDivRecreationProvider");
    view.ui.add(new Expand({
      view: view,
      content: infoDivRecreationProvider,
      expandIcon: "filter",
      expanded: true
    }), "top-left");
  
    const infoDivB2B = document.getElementById("infoDivB2B");
    view.ui.add(new Expand({
      view: view,
      content: infoDivB2B,
      expandIcon: "filter",
      expanded: true
    }), "top-right");
  
  
    view.ui.add(new Home({
      view: view
    }), "top-left");
  
    const infoDivNonProfits = document.getElementById("infoDivNonProfits");
    view.ui.add(new Expand({
      view: view,
      content: infoDivNonProfits,
      expandIcon: "filter",
      expanded: true
    }), "top-right");
  
    const legend = new Legend({
      view: view,
      container: "legendDiv"
    });
  
  });
    