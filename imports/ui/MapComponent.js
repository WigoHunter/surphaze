import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { compose, withProps, withHandlers, withState } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapStyle from "../../map.json";
import { keys } from "../../keys.json";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import authActionCreators from "./actions/auth";
import uiActionCreators from "./actions/ui";
import mapActionCreators from "./actions/map";
import forumActionCreators from "./actions/forum-actions";

class MapComponent extends React.Component {
	static propTypes = {
		confirmingLocation: PropTypes.bool,
		uiActions: PropTypes.object,
		authActions: PropTypes.object,
		forumActions: PropTypes.object,
		user: PropTypes.object,
		history: PropTypes.object,
		mapActions: PropTypes.object,
		maxZoom: PropTypes.number,
	}

	constructor(props) {
		super(props);

		this.state = {
			updated: false,
		};

		this.setUserLocation = this.setUserLocation.bind(this);
		this.confirmLocation = this.confirmLocation.bind(this);
	}

	componentDidMount() {
		if (Meteor.userId()) {
			this.props.mapActions.allowZoom();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.maxZoom != this.props.maxZoom) {
			this.setState({ updated: !this.state.updated });
		}
	}

	setUserLocation() {
		if (Meteor.userId()) {
			this.props.uiActions.endConfirmingLocation();
			this.props.authActions.doneLocation();
			this.props.forumActions.openForum();

			Meteor.call("user.setLocation", this.props.user.surphaze.location);
		} else {
			alert("Wait... Seems you are not logged in yet!");
			this.props.history.push("/");
		}
	}

	confirmLocation() {
		// If User is not in the confirming stage
		if (!this.props.confirmingLocation) {
			toast.success(() =>
				<div className="toast-for-location">
					Confirm your location?
					<p>Can adjust anytime later!</p>
					<div>
						<button onClick={() => this.setUserLocation()}>Yep!</button>
						<button onClick={() => this.props.uiActions.endConfirmingLocation()}>Let me adjust now.</button>
					</div>
				</div>,
			{
				autoClose: false,
				position: "top-left",
				closeButton: <span></span>
			}
			);
		}

		// Turn to confirming stage
		this.props.uiActions.toggleConfirmingLocation();
	}


	render() {
		return <Map
			{...this.props}
			confirmLocation={this.confirmLocation}
		/>;
	}
}

const getLocation = props => 
	(props.isLoaded && props.user.surphaze && props.user.surphaze.location != null)
		? 
		{
			lat: props.user.surphaze.location.lat,
			lng: props.user.surphaze.location.lng,
		}
		: 
		{ lat: 0, lng: 0 };

const getProfilePic = user =>
	user && user.services.facebook
		? `https://res.cloudinary.com/outwerspace/image/facebook/w_50,h_50,r_max/${user.services.facebook.id}.png`
		: "";

const getZoom = props =>
	props.initLocation
		? props.user && props.user.surphaze && props.user.surphaze.location
			? 15
			: props.confirmingLocation ? 15 : 2
		: 2;

const Map = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${keys.googlemap}&v=3.exp&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "100vh" }} />,
		mapElement: <div style={{ height: "100%" }} />,	
	}),
	withState("zoom", "onZoomChange", 2),
	withHandlers(() => {
		const refs = {
			map: undefined,
		};

		return {
			onMapMounted: ({ onZoomChange }) => ref => {
				refs.map = ref;
				onZoomChange(getZoom(ref.props));
			},
			onZoomChanged: ({ onZoomChange }) => () => {
				onZoomChange(refs.map.getZoom());
			},
			onClicked: ({ onZoomChange }) => (e) => {
				if (refs.map.props.initLocation) {
					let loc = {
						lat: e.latLng.lat(),
						lng: e.latLng.lng(),
					};

					onZoomChange(13);
					refs.map.props.setUserLocation(loc);
					refs.map.props.confirmLocation();
				} else {
					refs.map.props.forumActions.closeForum();
				}
			},
			onMarkerClick: ({ onZoomChange }) => (data, id) => {
				refs.map.panTo(data);
				onZoomChange(13);
				refs.map.props.history.push(`/${id}`);
				refs.map.props.forumActions.openForum();
			},
		};
	}),
	withScriptjs,
	withGoogleMap
)((props) => 
	<GoogleMap
		ref={props.onMapMounted}
		onClick={props.onClicked}
		zoom={props.zoom}
		onZoomChanged={props.onZoomChanged}
		center={getLocation(props)}
		confirmingLocation={props.confirmingLocation}
		confirmLocation={props.confirmLocation}
		initLocation={props.initLocation}
		history={props.history}
		forumActions={props.forumActions}
		setUserLocation={props.authActions.setUserLocation}
		mapActions={props.mapActions}
		defaultOptions={{
			disableDefaultUI: true,
			styles: mapStyle,
			minZoom: 2,
			maxZoom: props.maxZoom,
		}}
		options={{
			disableDefaultUI: true,
			styles: mapStyle,
			minZoom: 2,
			maxZoom: props.maxZoom,
			zoom: props.zoom
		}}
	>
		<MarkerClusterer
			onClick={props.onMarkerClusterClick}
			defaultZoomOnClick
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.initLocation
				?
				<Marker
					position={getLocation(props)}
					defaultIcon={{ url: getProfilePic(props.user) }}
				/>
				:
				Meteor.users.find().fetch().map(user =>
					user.surphaze && user.surphaze.location != null &&
						<Marker
							key={user._id}
							position={{
								lat: user.surphaze.location.lat,
								lng: user.surphaze.location.lng,
							}}
							onClick={() => props.onMarkerClick({
								lat: user.surphaze.location.lat,
								lng: user.surphaze.location.lng,
							}, user.handle)}
							defaultIcon={{ url: getProfilePic(user) }}
						/>
				)
			}
		</MarkerClusterer>
	</GoogleMap>
);

const mapStateToProps = state => {
	return {
		user: state.auths.user,
		isLoaded: state.auths.isLoaded,
		initLocation: state.auths.initLocation,
		confirmingLocation: state.ui.confirmingLocation,
		maxZoom: state.map.maxZoom,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		authActions: bindActionCreators(authActionCreators, dispatch),
		uiActions: bindActionCreators(uiActionCreators, dispatch),
		forumActions: bindActionCreators(forumActionCreators, dispatch),
		mapActions: bindActionCreators(mapActionCreators, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MapComponent));