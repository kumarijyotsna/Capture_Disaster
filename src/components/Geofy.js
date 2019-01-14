/*importing required modules*/
import React, { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Circle, Marker, InfoWindow } from "react-google-maps";
import Geocode from "react-geocode";
import './Geofy.css';
import axios from 'axios';
import Axios from "axios";
import Chat from "./Chat.js";
/*enabling key for geocode api*/
Geocode.setApiKey("API_KEY");
 
// Enable or disable logs. Its optional.
Geocode.enableDebug();
/*function to find address from latitude and longitude*/
var result = "add";
function findAddress(lat,lng) {
    
    Geocode.fromLatLng(lat, lng).then(
    response => {

    result = response.results[0].formatted_address;
    }
);
return result;
}
/* functional component to get map with marker and infowindow*/
const Mapl = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            defaultZoom={10}
            center={{ lat: props.latc, lng: props.lngc }}
            onClick={e => props.onMapClick(e)}
        >
            {props.marks.map((mark, index) => (
                <Circle
                    key={index}
                    center={mark}
                    radius={1000}
                    options={{
                        strokeColor: "#66009a",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: `#66009a`,
                        fillOpacity: 0.35,
                        zIndex: 1
                    }}
                	/>
         ))}
	{props.latlng.map((ll,index) => (
	<Marker 
	key={index}
	
	draggable={false}
	
	position={ll}
	onClick={() => props.onmarkerClick(ll)}
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
/* class componet geofy to render map on page*/
class Geofy extends Component {
	/*states*/
    state = {
        marks: [],
	latlng: [{lat: -33.34, lng: 145.56, con:"flood"}, {lat: -36.34, lng: 144.56, con:"earthquake"},{lat: -34.397, lng: 150.644, con:"flood"}, {lat: -30.34, lng: 145.56, con:"flood"}, {lat: -33.34, lng: 145.56, con:"flood"}, {lat: -33.34, lng: 145.56, con:"flood"}, {lat: -33.34, lng: 145.56, con:"flood"}],
	latc: 150.42,
	lngc: 152.41,
	latcu:18.18,
	lngcu:18.18,	
	input:"",
    cont:"",
	address:"",
	
    };
	/* function to get latitude and longitude of map wherever we click on map and saving data in mongo database through server using api created using nodejs*/
    setMark = e => {
		this.setState({ marks: [...this.state.marks, e.latLng] });
        let loc= window.prompt();
        this.setState((prevState) =>{return{ latlng: prevState.latlng.concat({lat:e.latLng.lat(),lng:e.latLng.lng(),con:loc})}})
        axios.post("http://localhost:5000/save",{input: findAddress(e.latLng.lat(),e.latLng.lng()), cont: loc})
        .then((data) => {
          console.log("data",data);
        })
        .catch((err) => console.log('erro',err))
       	//console.log("location",loc);
       	

	};
	/*fuction to get latitude and longitude from address on submitting address and problem*/
    handleClick = () =>{
	
	Geocode.fromAddress(`${this.state.input}`).then(
  		response => {
    		    this.setState((prevState) =>{return{ latlng: prevState.latlng.concat({lat:response.results[0].geometry.location.lat,lng:response.results[0].geometry.location.lng,con:prevState.cont})}})
    		    console.log("geocdoe",this.state.latlng);
  },
  		error => {
    			console.error(error);
  }
);    
	};
	/*getting alert on clicking marker on map*/
    markerClick=(l)=>
		(alert(l))

	/*setting value of address input box*/
    handleChangeAdd= (e)=>{
		this.setState({input:e.target.value});	
	}
	/*setting value of problem input field*/
    handleChangeCon=(e)=>{
		this.setState({cont:e.target.value});    
	}

	/*this is for making map center about a given latitude and longitude*/
    handleLocation=(lat,lng)=>{
			console.log(lat,lng)
			this.setState({latc:parseFloat(lat),lngc:parseFloat(lng)})
			console.log(this.state.latc,this.state.lngc)	
	}

	/*this is for fetching data from mongodb using api created using nodejs*/
	fetchData=()=>{
		fetch('http://localhost:5000/find')
			.then(res => res.json())
			.then(data => {
				//console.log(data[1].input);
				data.map((d,i)=>{
					Geocode.fromAddress(`${d.input}`).then(
  				response => {
    		    	this.setState((prevState) =>{return{ latlng: prevState.latlng.concat({lat:response.results[0].geometry.location.lat,lng:response.results[0].geometry.location.lng,con:d.cont})}})
    		    	console.log("geocdoe",this.state.latlng);
 		 		},
  			error => {
    			console.error(error);
 	 			}
				);    		
				})
		
			});	
	}
	/* this is to get current location of user*/
    showCurrentLocation=()=>{
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position =>{
			this.setState({latcu:position.coords.latitude,lngcu:position.coords.longitude})
			console.log(this.state.latcu,this.state.lngcu);
		})
	}
	}
	
	myFunction=()=> {
  var x = document.getElementById("chatbox");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
    componentWillMount(){
		//console.log("will mount")
		this.showCurrentLocation();
			
	}
    componentDidMount(){
		
		
		this.fetchData();
		//console.log("did");	
	}
	/* this is to render web page*/
    render() {
        const { marks,latlng,latc,lngc } = this.state;
        return (
            <div className="body">
		<div>
		<form method="post" action='http://localhost:5000/save' className="form">
			<input type="text" onChange={this.handleChangeAdd} value={this.state.input} name='input' placeholder="enter address..." className="location"/>
			<input type="text" onChange={this.handleChangeCon} value={this.state.cont} name='cont'  placeholder="enter problem..." className="disaster"/>
		
            <input type="submit" className="submit" placeholder="submit"/>
		</form>
		<button className="currloc"  onClick={()=>this.handleLocation(this.state.latcu,this.state.lngcu)}>CURRENT LOCATION</button><br/>
		</div>
		<div className="map"> 
		               
		<Mapl
            googleMapURL="http://maps.googleapis.com/maps/api/js?key=API_KEY"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            onMapClick={this.setMark}
            marks={marks}
		    latlng={latlng}
		    onmarkerClick={this.markerClick}
		    latc={latc}
		    lngc={lngc}
		/>
		</div>

		<hr/>
		<div>
			<ul className="list">
		
			<center><div className="heading">DISASTER UPDATES</div></center>
			<br/>
			{latlng.map((lt,id)=>(
				<li key={id} onClick={()=>this.handleLocation(lt.lat,lt.lng)}  className="listPart"><p> Address: {findAddress(lt.lat,lt.lng)}</p><p> Problem: {lt.con}</p> </li>)
			)}
			</ul>
		</div>
		<div className="button1" style={{"background-color":"#13a753"}}><button onClick={this.myFunction}>OPEN CHATBOX</button></div>
          <div className="chatbox fadeIn" id="chatbox">  <Chat/> </div>
        </div>
        );
    }
}

export default Geofy;
