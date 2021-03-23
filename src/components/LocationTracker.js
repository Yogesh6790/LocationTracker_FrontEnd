import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class LocationTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scooters: 0,
            radius: 0,
            xCoordinate: 0,
            yCoordinate: 0,
            locations: [],
            errorScooter: false,
            errorRadius: false,
            errorCoordinate: false,
            fetchedCoordinates: []
        };
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.findLocations = this.findLocations.bind(this);
        this.findMarkers = this.findMarkers.bind(this);
    }


    inputChangeHandler = (event) => {
        event.preventDefault();
        if (event.target.name === 'scooters') {
            if (this.state.errorScooter) {
                this.setState({ errorScooter: false });
            }
            this.setState({'scooters' : event.target.value});
        } else if (event.target.name === 'xCoordinate' || event.target.name === 'yCoordinate'){
            if (this.state.errorCoordinate) {
                this.setState({ errorCoordinate: false });
            }
        } else {
            if (this.state.errorRadius) {
                this.setState({ errorRadius: false });
            }
        }
        this.setState({[event.target.name] : event.target.value});
    }

    findLocations = async () => {
        console.log(" scooter ", this.state.scooters);
        console.log(" radius ", this.state.radius);
        console.log(" xCoordinate ", this.state.xCoordinate);
        console.log(" yCoordinate ", this.state.yCoordinate);
        let errorFound = false;
        if (this.state.scooters % 1 !== 0 || this.state.scooters == 0) {
            this.setState({ errorScooter: true });
            errorFound = true;
        }
        if (this.state.xCoordinate % 1 === 0 || this.state.yCoordinate % 1 === 0) {
            this.setState({ errorCoordinate: true });
            errorFound = true;
        }
        if (this.state.radius == 0) {
            this.setState({ errorRadius: true });
            errorFound = true;
        }
        if (!errorFound) {
            let data = this.state.fetchedCoordinates;
            console.log(data);
            for (let i = 0; i < data.length; i++){
                const distance = Math.sqrt(Math.pow(Math.abs(data[i].latitude - this.state.xCoordinate), 2) + Math.pow(Math.abs(data[i].longitude - this.state.yCoordinate), 2));
                data[i]["distance"] = distance;
                console.log(data[i]);
            }
            data.sort((a, b) => a.distance > b.distance ? 1 : -1);
            const filteredData = data.filter(a => a.distance <= this.state.radius);
            //limit the no of locations to display
            let viewData = [];
            const maxLocationsToDisplay = Math.min(this.state.scooters, filteredData.length);
            for (let i = 0; i < maxLocationsToDisplay; i++){
                viewData[i] = filteredData[i];
            }
            console.log(viewData);
            this.setState({ locations: viewData });
        }
    }

    findMarkers = () => {
        console.log("this.state.locations " , this.state.locations);
        return this.state.locations.map((location, index) => {
            return <Marker key={index} id={index} position={{ lat: location.latitude, lng: location.longitude }} />
        });
    }

    componentDidMount = async () => {
        await fetch('/location')
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            this.setState({ fetchedCoordinates: data });
        });  
    }


    render() {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div>
                        <h1>LOCATION TRACKER</h1>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <strong> No of Scooters : </strong>
                        <input type="number" name="scooters" value={this.state.scooters} onChange={e => this.inputChangeHandler(e)} step="1" />
                    </div>
                    {
                        this.state.errorScooter && <div style={{ marginTop: '20px' }}><label style={{fontStyle: 'italic', color: 'red'}}>Pls enter correct number for 'No of scooters' field!</label></div>
                    }
                    <div style={{ marginTop: '20px' }}>
                        <strong style={{marginLeft: '63px'}}> Radius : </strong>
                        <input type="number" name="radius" value={this.state.radius} onChange={e => this.inputChangeHandler(e)} step=".01"/>
                    </div>
                    {
                        this.state.errorRadius && <div style={{ marginTop: '20px' }}><label style={{fontStyle: 'italic', color: 'red'}}>Pls enter correct number for 'Radius' field!</label></div>
                    }
                    <div style={{ marginTop: '20px' }}>
                        <strong> x-coordinate : </strong>
                        <input type="number" name="xCoordinate" value={this.state.xCoordinate} onChange={e => this.inputChangeHandler(e)} step=".0001" />
                        <strong style={{marginLeft: '10px'}}> y-coordinate : </strong>
                        <input type="number" name="yCoordinate" value={this.state.yCoordinate} onChange={e => this.inputChangeHandler(e)} step=".0001" />
                        {
                            this.state.errorCoordinate && <div style={{ marginTop: '20px', marginLeft: '150px' }}><label style={{fontStyle: 'italic', color: 'red'}}>Pls enter exact dd co-ordinates</label></div>
                        }
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <button onClick={() => this.findLocations()}>
                            Find Locations
                        </button>
                    </div>
                </div>
                <div style={{ marginTop: '30px', display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%'}}>
                    <Map
                        google={this.props.google}
                        zoom={14}
                        style={{width: '50%', height: '50%'}}
                        initialCenter={
                        {
                            lat: 1.3148661,
                            lng: 103.7631417
                        }
                        
                        }>
                        {this.state.locations.length > 0 && <Marker position={{ lat: this.state.xCoordinate, lng: this.state.yCoordinate }} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />}
                        {this.state.locations.length > 0 && this.findMarkers()}
                    </Map>
                </div>
            </div>
            
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ''
  })(LocationTracker);