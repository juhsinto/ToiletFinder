import React, { Component } from "react";
import ReactDOM from "react-dom";
import TagManager from "react-gtm-module";
import axios from "axios";
import "./index.css";
import toiletMarker from "./assets/marker.png";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

const tagManagerArgs = {
  gtmId: "GTM-NM4MJGQ",
};

TagManager.initialize(tagManagerArgs);

class App extends Component {
  state = {
    // 15 Queens Rd
    //   lat: -37.8390583,
    //   lng: 144.97499729999998
    markers: [],
    usersPositionObtained: "NO",
    toiletsFound: "NO",

    // initial value for distance range slider
    rangeSlider: 500,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.refreshComponent = this.refreshComponent.bind(this);
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      console.log(
        "Current user's location is " +
          position.coords.latitude +
          ", " +
          position.coords.longitude
      );

      this.setState({ usersPositionObtained: "YES" });

      // add to the markers ; i think there's a better way to do this (spread operator ?)
      const { markers } = this.state;
      console.log("before ", this.state.markers);
      markers.push([position.coords.latitude, position.coords.longitude]);
      this.setState({ markers });
      console.log("after", this.state.markers);

      axios
        .post("https://tiny-ruby-snapper-tie.cyclic.app/api/toilets-dist/", {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          distance: Number(this.state.rangeSlider),
        })
        .then((response) => {
          console.log(response);
          if (
            typeof response.data !== "undefined" &&
            response.data.length > 0
          ) {
            this.setState({ toiletsFound: "YES" });
            let toilets = response.data;

            toilets.forEach((item) => {
              let toilet_coordinate = item.loc;

              markers.push([
                toilet_coordinate.coordinates[1],
                toilet_coordinate.coordinates[0],
              ]);
              this.setState({ markers });

              console.log(
                "FROM POST REQUEST: coordinates lat: " +
                  toilet_coordinate.coordinates[1] +
                  " coordinates long: " +
                  toilet_coordinate.coordinates[0]
              );
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  refreshComponent() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      console.log(
        "Current user's location is " +
          position.coords.latitude +
          ", " +
          position.coords.longitude
      );

      this.setState({ usersPositionObtained: "YES" });

      // reset markers because we are refreshing
      this.setState({ markers: [] });
      this.setState({ toiletsFound: "NO" });

      // add to the markers ; i think there's a better way to do this (spread operator ?)
      const { markers } = this.state;
      this.setState({ markers });
      markers.push([position.coords.latitude, position.coords.longitude]);

      this.handleChange = this.handleChange.bind(this);

      axios
        .post("https://tiny-ruby-snapper-tie.cyclic.app/api/toilets-dist/", {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          distance: Number(this.state.rangeSlider),
        })
        .then((response) => {
          console.log(response);
          if (
            typeof response.data !== "undefined" &&
            response.data.length > 0
          ) {
            this.setState({ toiletsFound: "YES" });
            let toilets = response.data;

            toilets.forEach((item) => {
              let toilet_coordinate = item.loc;

              markers.push([
                toilet_coordinate.coordinates[1],
                toilet_coordinate.coordinates[0],
              ]);
              this.setState({ markers });

              console.log(
                "FROM POST REQUEST: coordinates lat: " +
                  toilet_coordinate.coordinates[1] +
                  " coordinates long: " +
                  toilet_coordinate.coordinates[0]
              );
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  openPopup(marker) {
    if (marker && marker.leafletElement) {
      window.setTimeout(() => {
        marker.leafletElement.openPopup();
      });
    }
  }

  handleChange(event) {
    this.setState({ rangeSlider: event.target.value });
  }

  userLocationObtained(idx, position) {
    const toiletIcon = new L.Icon({
      iconUrl: toiletMarker,
      popupAnchor: [-0, -0],
      iconSize: [32, 45],
    });

    // open the marker popup only for first marker!
    if (idx === 0) {
      return (
        <Marker key={`marker-${idx}`} position={position} ref={this.openPopup}>
          <Popup>
            <span>You are Here !</span>
          </Popup>
        </Marker>
      );
    } else {
      return (
        <Marker
          key={`marker-${idx}`}
          icon={toiletIcon}
          position={position}
          onClick={this.openPopup}
        >
          <Popup>
            Click&nbsp;
            <a
              href={`http://maps.google.com/maps?daddr=${position[0]},${position[1]}&amp;ll=`}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            &nbsp; to navigate to this location
          </Popup>
        </Marker>
      );
    }
  }

  render() {
    const toiletStatus = this.state.toiletsFound;
    let toiletRetrievalMessage;

    if (toiletStatus === "NO" && this.state.usersPositionObtained === "YES") {
      toiletRetrievalMessage = (
        <p>
          Sadly, there were no toilets found, this is likely because there are
          no toilets in the vicinity of {this.state.rangeSlider} meters
          <i>
            <br></br>
            For developers, and those interested, try overriding the GPS sensor
            to -37.818078, 144.96681
          </i>
        </p>
      );
    } else if (toiletStatus === "YES") {
      toiletRetrievalMessage = (
        <p>Bust before you rust! Your kidneys will thank you later!</p>
      );
    }

    // for setting the position obtained status color
    let positionStatus = "red";
    if (this.state.usersPositionObtained === "YES") {
      positionStatus = "green";
    }

    return (
      <div className="map">
        <h1 className="test"> LooCation </h1>
        <p>
          {" "}
          Note - the current search radius is {this.state.rangeSlider} meters
        </p>
        <p>
          {" "}
          User Position Obtained:{" "}
          <span className={positionStatus}>
            {" "}
            {this.state.usersPositionObtained}{" "}
          </span>{" "}
        </p>
        {toiletRetrievalMessage}

        <p>
          {" "}
          Change Toilet Search Radius :
          <input
            id="typeinp"
            type="range"
            min="100"
            max="3000"
            value={this.state.rangeSlider}
            onChange={this.handleChange}
            step="100"
          />
          <button onClick={this.refreshComponent}>Refresh</button>
        </p>

        <Map
          center={[-37.808163434, 144.957829502]}
          zoom={16}
          style={{ width: "80%", height: "40em", margin: "auto" }}
        >
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          />
          {this.state.markers.map((position, idx) =>
            this.userLocationObtained(idx, position)
          )}
        </Map>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
