/*importing modules*/
import React, { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Circle, Marker, InfoWindow } from "react-google-maps";
import Geocode from "react-geocode";
import axios from 'axios';
import './Weather.css';
/*connecting to geocode*/
Geocode.setApiKey("API_KEY");
 
// Enable or disable logs. Its optional.
Geocode.enableDebug();
/*function to find address from latitude and longitude*/
function findAddress(lat,lng) {
  var result = "add";
   Geocode.fromLatLng(lat, lng).then(
  response => {

    result = response.results[0].formatted_address;
   
    //console.log("1",result);
    }
);
//console.log(result);
return result;
}

/* functional component to get map with marker and infowindow*/
const Map = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            defaultZoom={12}
            center={{ lat: props.latc, lng: props.lngc }}
            
        >
           
    {props.latlng.map((ll,index) => (
    <Marker 
    key={index}
    
    draggable={true}
    
    position={ll}
    onClick={() => alert(ll.con)}
    />
    ))}
    {props.latlng.map((ll,index) => (<InfoWindow key={index}
    position={ll} 
    >
    <div >
    <span style={{ padding: 0, margin: 0 }}>{ ll.con }</span>
    </div>
    </InfoWindow>))}
        </GoogleMap>
    ))
);

/* class componet Weather to render map on page*/
class Weather extends Component {

   state = {
    latlng: [{lat: -33.34, lng: 145.56, con:"flood"}, {lat: -36.34, lng: 144.56, con:"earthquake"},{lat: -34.397, lng: 150.644, con:"flood"}],
	latc: 150.42,
	lngc: 152.41
	};

componentDidMount() {
    this.fetchData();
}
/*this is for fetching data from relief web api*/
fetchData() {
   
    axios.get(`https://api.reliefweb.int/v1/reports?appname=apidoc&filter[operator]=OR&filter[conditions][0][operator]=AND&filter[conditions][0][conditions][0][field]=primary_country&filter[conditions][0][conditions][1][operator]=OR&filter[conditions][0][conditions][1][field]=date&fields[include][]=country.name&fields[include][]=primary_country.name&fields[include][]=headline.title&fields[include][]=disaster.name&fields[include][]=disaster_type.name&fields[include][]=date.original&limit=50`)
    
    .then((data) => {
        let c = data.data;
         //var count=0;
        // console.log(c);
        let da=c.data
        //console.log(da)
        console.log(da);
        for(let y of da){ 
            //console.log(Object.keys(y.fields));
            let k=Object.keys(y.fields);
          //  console.log(k,k.length);
            if(k.indexOf("disaster_type")> -1 ) 
            {//console.log("1...",k.indexOf("disaster_type"))
            var name = (y.fields.country[0] || {}).name;
            var disaster_type= (y.fields.disaster_type[0] || {}).name;
            Geocode.fromAddress(`${name}`).then(
            response => {
                this.setState((prevState) =>{return{ latlng: prevState.latlng.concat({lat:response.results[0].geometry.location.lat,lng:response.results[0].geometry.location.lng,con:disaster_type})}})
                //console.log("geocdoe",this.state.latlng);
            },
            error => {
                console.error(error);
            });    		
	        }
            else{
            console.log(k.indexOf("disaster_type"),"false");
            }}
    })
    .catch((error) => {
        console.log(error);
    });
}

    /*this is for making map center about a given latitude and longitude*/
     handleLocation=(lat,lng)=>{
			console.log(lat,lng)
			this.setState({latc:parseFloat(lat),lngc:parseFloat(lng)})
			console.log(this.state.latc,this.state.lngc)
    }
    /* this is to render web page*/
    render() {
        const { marks,latlng,latc,lngc } = this.state;
        return (
            <div className="map1">
        
                <Map
                    googleMapURL="http://maps.googleapis.com/maps/api/js?key=API_KEY"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    
            latlng={latlng}
		   latc={latc}
		   lngc={lngc}
                />
		<center><div className="heading1">DISASTER UPDATES</div><br/></center>
		<ul className="list1">
		
		
		
		{latlng.map((lt,id)=>(
			<li key={id} onClick={()=>this.handleLocation(lt.lat,lt.lng)}  className="listPart1"> <p> Address: {findAddress(lt.lat,lt.lng)} </p><p> Problem: {lt.con} </p></li>)
		)}
		</ul>
            </div>
        );
    }
}

export default Weather;
