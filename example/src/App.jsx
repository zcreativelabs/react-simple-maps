import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// URL to the world map shape data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function App() {
  return (
    <div style={{ width: "100%", border: "1px solid black" }}>
      <h1>React Simple Maps with React 19 Test</h1>
      <ComposableMap projectionConfig={{ scale: 147 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#D6D6DA", outline: "none" },
                  hover: { fill: "#F53", outline: "none" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default App;