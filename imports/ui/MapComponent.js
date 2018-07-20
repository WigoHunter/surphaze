import React from "react";
// import PropTypes from "prop-types";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapStyle from "../../map.json";
import { keys } from "../../keys.json";

import { connect } from "react-redux";

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
		center={props.isLoaded && props.user.surphaze && props.user.surphaze.location != null
			? 
			{
				lat: props.user.surphaze.location.lat,
				lng: props.user.surphaze.location.lng,
			}
			: 
			{ lat: 0, lng: 0 }
		}
		defaultOptions={{
			disableDefaultUI: true,
			styles: mapStyle,
		}}
	>
		<Marker
			position={{ lat: 0, lng: 0}}
			onClick={() => {}}
		/>
	</GoogleMap>
);

const mapStateToProps = state => {
	return {
		user: state.auths.user,
		isLoaded: state.auths.isLoaded,
	};
};

export default connect(mapStateToProps, null)(MapComponent);