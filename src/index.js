import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";
import toiletMarker from './assets/marker.png';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

class App extends Component {
  state = {
    // 15 Queens Rd
    //   lat: -37.8390583,
    //   lng: 144.97499729999998
    markers: [],
    usersPositionObtained: "NO",
    toiletsFound: "NO"
  };

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(position => {
      console.log(
        "Current user's location is " +
          position.coords.latitude +
          ", " +
          position.coords.longitude
      );

      this.setState({ usersPositionObtained: "YES" });

      // add to the markers ; i think there's a better way to do this (spread operator ?)
      const { markers } = this.state;
      markers.push([position.coords.latitude, position.coords.longitude]);
      this.setState({ markers });

      

      axios
        .post("https://www.jacintomendes.com:8443/api/toilets/", {
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
        .then(response => {
          //   console.log(response);
          if (
            typeof response.data.data !== "undefined" &&
            response.data.data.length > 0
          ) {
            this.setState({ toiletsFound: "YES" });
            let toilets = response.data.data;

            toilets.forEach(item => {
              let toilet_coordinate = item.loc;

              markers.push([
                toilet_coordinate.coordinates[1],
                toilet_coordinate.coordinates[0]
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
        .catch(function(error) {
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

  userLocationObtained(idx, position) {


    const myIcon = new L.Icon({
      iconUrl: toiletMarker,
      popupAnchor:  [-0, -0],
      iconSize: [32,45],     
    });
    
    // const iconMarkup = renderToStaticMarkup(<i className="fa fa-map-marker-alt fa-3x" />);
    // const customMarkerIcon = divIcon({
    //   html: iconMarkup,
    // });

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
          icon={myIcon}
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
          no toilets in the vicinity of 1km
          <i>
            <br></br>
            For developers, and those interested, try overriding the GPS sensor
            to -37.818078, 144.96681
          </i>
        </p>
      );
    } else if (toiletStatus === "YES") {
      toiletRetrievalMessage = <p>Bust before you rust! Your kidneys will thank you later!</p>;
    }

    // for setting the position obtained status color
    let positionStatus = 'red';
    if (this.state.usersPositionObtained === "YES") {
      positionStatus = 'green';
    }

    return (
      
      <div className="map">
        <h1 className="test"> LooCation </h1>
        <p>Note - the current search radius is 1km</p>
        <p> User Position Obtained: <span className={positionStatus}> {this.state.usersPositionObtained} </span> </p>
        {toiletRetrievalMessage}

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
