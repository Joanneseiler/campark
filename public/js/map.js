
    let map;

    function initMap(loc) {
        map = L.map('mapid').setView(loc, 10);
        L.tileLayer.provider('CartoDB.Positron').addTo(map);

        //L.marker(loc).addTo(map)
        //.bindPopup('<a href="/">now Home, later add the place</a>')

        map.on("click", (async (event)=> {    
            let addressData = await getAddressData(event.latlng.lat, event.latlng.lng)
            let popupContent = getHTMLPopupContent(addressData)
            displayPopup(event.latlng, popupContent)
        }))
    }

    async function getAddressData(lat, lng) {
        let addressApiHost = 'https://nominatim.openstreetmap.org/reverse'
        let addressApiParams = `?lat=${lat}&lon=${lng}&format=json`
        let response = await fetch(`${addressApiHost}${addressApiParams}`)
        
        if (response.ok !== true) {
            alert("There was an error fetching the data")
            return
        }

        let data = await response.json()
        return data.address;
    }

    function getHTMLPopupContent(addressData) {
        let displayAddress = createDisplayableAddressFromAddressData(addressData)
        let popupContent = document.querySelector('.custom-popup-content').cloneNode(true)
        popupContent.querySelector('#address').innerHTML = displayAddress
        popupContent.classList.remove('hidden')
        return popupContent.outerHTML
    }

    function createDisplayableAddressFromAddressData(addressData) {
        let road = addressData.road ?? ''
        let houseNumber = addressData.house_number ?? ''
        let postcode = addressData.postcode ?? ''
        let city = addressData.village ?? addressData.town ?? addressData.city ?? ""
        let country = addressData.country ?? ''
        return `${road} ${houseNumber}\n${postcode} ${city}\n${country}`
    }

    function displayPopup(latlng, popupContent) {
        // setContent() expects valid HTML (https://leafletjs.com/reference-1.7.1.html#popup-option)
        L.popup({keepInView: true})
            .setLatLng(latlng)
            .setContent(popupContent)
            .openOn(map);
    }