var app = new Vue({
    el: 'body',

    data: {
        toilets: tlts,
        address: '',
        yourLoc: {}
    },

    ready: function(){
		this.yourLocation();
	},

    methods: {
    	yourLocation: function(){
    		navigator.geolocation.getCurrentPosition(function(position) {
				this.yourLoc.longitude = position.coords.longitude;
				this.yourLoc.latitude = position.coords.latitude;
				console.log("your location: "+this.yourLoc.longitude, this.yourLoc.latitude);
			}.bind(this));
    	},

    	findAddress: function(){
    		if (this.address !== ''){
    			var geocoder = new google.maps.Geocoder();
	    		geocoder.geocode({ address: this.address }, function(result, status){
	    			if (status === google.maps.GeocoderStatus.OK){
	    	 			var loc = {};
						loc.longitude = result[0].geometry.location.lng();
						loc.latitude = result[0].geometry.location.lat();

						this.fetchEm(loc);
	    			}
	    		}.bind(this));
    		} else {
    			// this.yourLocation();
    		}
    	},

    	fetchEm: function(location){
    		var that = this;
    		$.post('/api/coords', {coords: location}, function(response){
				// console.log('here we go' + response['coords[latitude]']);
				that.toilets = response;
			}).then(function(){
				that.initMap(location);
			});
    	},

    	initMap: function(location){
    		console.log("called");
			
			this.map = new google.maps.Map(document.querySelector("#map"), {
				center: { lat: location.latitude , lng: location.longitude },
				zoom: 14
			});
			this.marker = new google.maps.Marker({
				map: this.map,
				position: { lat: location.latitude , lng: location.longitude }
			});

			console.log('here :' + directionsDisplay);
		},

    	goThere: function(obj){
    		var latLng = {lat: obj.Latitude, lng: obj.Longitude};
			
			this.map.setCenter(latLng);
			this.marker.setPosition(latLng);
    	}
    }
});