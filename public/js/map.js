
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
        let displayAddress = `${addressData.road ?? ''} ${addressData.house_number ?? ''}\n${addressData.postcode ?? ''} ${addressData.town ?? ''}\n${addressData.country ?? ''}`
        
        let mainHeader = document.createElement('h1')
        mainHeader.innerText = 'ADD A NEW PLACE'
        
        let addressHeader = document.createElement('h2')
        addressHeader.innerText = 'Address'
        
        let descriptionHeader = document.createElement('h2')
        descriptionHeader.innerText = 'Description'

        let form = document.createElement('form')
        
        let textarea = document.createElement('textarea')
        textarea.style.fontSize = '10px'
        textarea.style.resize = 'none'
        textarea.rows = '3'
        textarea.innerHTML = displayAddress

        form.appendChild(mainHeader)
        form.appendChild(addressHeader)
        form.appendChild(textarea)
        form.appendChild(descriptionHeader)

        return form.outerHTML
    }

    function displayPopup(latlng, popupContent) {
        // setContent() expects valid HTML (https://leafletjs.com/reference-1.7.1.html#popup-option)
        L.popup({keepInView: true})
            .setLatLng(latlng)
            .setContent(popupContent)
            .openOn(map);
    }