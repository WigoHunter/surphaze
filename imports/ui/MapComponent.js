import React from "react";
// import PropTypes from "prop-types";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapStyle from "../../map.json";
import { keys } from "../../keys.json";

class MapComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Map {...this.props} />;
	}
}

const Map = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${keys.googlemap}&v=3.exp&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "100vh" }} />,
		mapElement: <div style={{ height: "100%" }} />,	
	}),
	withHandlers(() => {
		const refs = {
			map: undefined,
		};

		return {
			onMapMounted: () => ref => {
				refs.map = ref;
			},
			onClicked: () => (e) => {
				console.log(e);	//eslint-disable-line
			}
		};
	}),
	withScriptjs,
	withGoogleMap
)((props) => 
	<GoogleMap
		ref={props.onMapMounted}
		onClick={props.onClicked}
		zoom={2}
		center={{ lat: 0, lng: 0 }}
		defaultOptions={{
			styles: mapStyle,
			fullscreenControl: false,
			fullscreenControlOptions: false,
			mapTypeControl: false,
			mapTypeControlOptions: false,
		}}
	>
		<Marker
			position={{ lat: 0, lng: 0}}
			onClick={() => {}}
		/>
	</GoogleMap>
);

export default MapComponent;