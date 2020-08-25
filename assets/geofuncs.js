$(document).ready(function(){
    console.log('Geofuncs READY');
        let places = [
            { 'Italy': { coords: [12, 43], code: 'it' } },
            { 'Napa Valley': { coords: [-95.712891, 37.09024] } },
            { 'Piedmont': { coords: [-95.712891, 37.09024] } },
            { 'Russian River Valley': { coords: [-95.712891, 37.09024] } },
            { 'United States': { coords: [-95.712891, 37.09024], code: 'us' } }
        ]
    
        let country = document.getElementById("tag-country").innerText;
    
        let getFlag = function(){
            for (let i = 0; i < places.length; i++) {
                for (let key in places[i]) {
                    if (key === country) {            
                        let result = `<span class="flag-icon flag-icon-${places[i][key].code}"></span>`;
                        $( "#origin-line" ).append( result );
                    }   
                }
            }
        }
    
        let getCoords = function(){
            let
            region = document.getElementById("tag-region").innerText.slice(0, -2);
            mapPoint = region ? region : country;
            // if(region){
            //     mapPoint = region;
            // } else {
            //     mapPoint = country; 
            // }
            for (let i = 0; i < places.length; i++) {
                for (let key in places[i]) {
                    if (key === mapPoint) {            
                        //return coords for map
                        console.log(places[i][key].coords)
                    }   
                }
            }
        }
        getFlag();
        getCoords();
    })