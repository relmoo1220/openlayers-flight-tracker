<script lang="ts">
  import { onMount } from "svelte";
  import "ol/ol.css";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import { fromLonLat } from "ol/proj";
  import VectorSource from "ol/source/Vector";
  import VectorLayer from "ol/layer/Vector";
  import Feature from "ol/Feature";
  import Point from "ol/geom/Point";
  import Style from "ol/style/Style";
  import Icon from "ol/style/Icon";
  import { Overlay } from "ol";

  // Define the type for the flight data
  interface FlightData {
    coordinates: [number, number]; // Longitude, Latitude
    name: string;
    origin: string;
    altitude: number;
    velocity: number;
    rotation: number;
  }

  let map: Map;
  let vectorSource: VectorSource;
  let vectorLayer: VectorLayer;
  let tooltip: Overlay; // Tooltip overlay

  onMount(() => {
    vectorSource = new VectorSource(); // Create a new vector source
    vectorLayer = new VectorLayer({
      source: vectorSource, // Add the vector source to the layer
    });

    // Create the map
    map = new Map({
      target: "map", // The DOM element to render the map
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap tiles
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([103.993, 1.3645]), // Longitude, Latitude for Changi Airport
        zoom: 12, // Adjust the zoom level as needed
        minZoom: 12, // Prevent zooming out
        maxZoom: 14, // Prevent zooming in
      }),
    });

    // Create a tooltip overlay
    tooltip = new Overlay({
      element: document.getElementById("tooltip")!, // HTML element for tooltip
      positioning: "bottom-center", // Position tooltip below the marker
      stopEvent: false, // Allow events to pass through to the map
    });

    map.addOverlay(tooltip); // Add the tooltip overlay to the map

    // Add event listener for pointer movements
    map.on("pointermove", handlePointerMove);

    getFlightData();
  });

  async function getFlightData() {
    // Define constants for JSON data indices
    const INDEX_CALLSIGN = 1;
    const INDEX_ORIGIN_COUNTRY = 2;
    const INDEX_LONGITUDE = 5;
    const INDEX_LATITUDE = 6;
    const INDEX_VELOCITY = 9;
    const INDEX_TRUE_TRACK = 10;
    const INDEX_GEO_ALTITUDE = 13;

    try {
      // Create a new EventSource instance
      const eventSource = new EventSource(
        `http://127.0.0.1:3000/flight-data/sse`
      );

      // Listen for messages from the server
      eventSource.onmessage = function (event) {
        const flightData = JSON.parse(event.data); // Parse the incoming JSON data
        console.log("Received flight data:", flightData.states);

        // Clear existing markers before drawing new ones
        vectorSource.clear();

        // Handle the received flight data here
        flightData.states.forEach((state: any) => {
          // Assuming the state object contains coordinates and other relevant data
          const posMarker: FlightData = {
            coordinates: [state[INDEX_LONGITUDE], state[INDEX_LATITUDE]], // Longitude, Latitude
            name: state[INDEX_CALLSIGN] || "Unknown", // Callsign
            origin: state[INDEX_ORIGIN_COUNTRY] || "Unknown", // Origin country
            altitude: state[INDEX_GEO_ALTITUDE] || 0, // Altitude
            velocity: state[INDEX_VELOCITY] || 0, // Velocity
            rotation: state[INDEX_TRUE_TRACK] || 0, // True track
          };

          // Draw the marker on the map
          drawMarker(posMarker);
        });
      };

      // Handle errors
      eventSource.onerror = function (event) {
        console.error("EventSource failed:", event);
        // Close the connection
        eventSource.close();
      };

      // Handle the opening of the connection
      eventSource.onopen = function (event) {
        console.log("Connection to server opened:", event);
      };
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Function to draw a marker on the map
  function drawMarker(posMarker: FlightData) {
    const feature = new Feature({
      geometry: new Point(fromLonLat(posMarker.coordinates)), // Convert to Web Mercator
      name: posMarker.name,
      origin: posMarker.origin,
      altitude: posMarker.altitude,
      velocity: posMarker.velocity,
    });

    // Style marker and apply the style on the markers
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: "/plane.svg", // Path to the icon
        scale: 0.04, // Adjust the size as needed
        rotation: posMarker.rotation * (Math.PI / 180),
      }),
    });

    feature.setStyle(iconStyle);
    vectorSource.addFeature(feature);
  }

  function handlePointerMove(event: any) {
    const pixel = map.getEventPixel(event.originalEvent);
    const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

    if (feature && feature.getGeometry() instanceof Point) {
      const coordinates = (feature.getGeometry() as Point).getCoordinates();
      const flightDetails = `
      <strong>Flight:</strong> ${feature.get("name")}<br>
      <strong>Origin:</strong> ${feature.get("origin")}<br>
      <strong>Altitude:</strong> ${feature.get("altitude")} m<br>
      <strong>Velocity:</strong> ${feature.get("velocity")} km/h
    `;

      tooltip.setPosition(coordinates);
      const tooltipElement = tooltip.getElement();
      if (tooltipElement) {
        document.getElementById("tooltip")!.innerHTML = flightDetails;
        tooltipElement.style.display = "block";
      }
    } else {
      const tooltipElement = tooltip.getElement();
      if (tooltipElement) {
        tooltipElement.style.display = "none";
      }
    }
  }
</script>

<div id="map" class="h-screen w-full"></div>
<div id="tooltip" class="ol-tooltip bg-white border border-black p-2 rounded mb-5"></div>
