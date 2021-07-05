
    let map;

    async function initMap(loc) {
        map = L.map('mapid').setView(loc, 10);
        L.tileLayer.provider('CartoDB.Positron').addTo(map);

        let response = await fetch('/places')
        
        if (response.ok !== true) {
            return
        }

        let data = await response.json()

        data.places.forEach((place) => {
            let latlng = L.latLng(place.latitude, place.longitude)
            const icon = L.icon({
                iconUrl: '/images/marker.png',
                iconSize:     [30, 27], // size of the icon
                iconAnchor:   [28, 27], // point of the icon which will correspond to marker's location
                popupAnchor:  [28, 27] // point from which the popup should open relative to the iconAnchor
            })
            let marker = L.marker(latlng, {icon: icon}).addTo(map)
            marker.on('click', () => {
                let popupContent = getHTMLPlaceDetailsPopupContent(place)
                displayPlaceDetailsPopup(latlng, popupContent)
            })
        })

        map.on("click", (async (event)=> {
            let addressData = await getAddressData(event.latlng.lat, event.latlng.lng)
            let popupContent = getHTMLPopupContent(addressData, event.latlng)
            displayPlacePopup(event.latlng, popupContent)
        }))
    }

    async function getAddressData(lat, lng) {
        let addressApiHost = 'https://nominatim.openstreetmap.org/reverse'
        let addressApiParams = `?lat=${lat}&lon=${lng}&format=json&accept-language=en`
        let response = await fetch(`${addressApiHost}${addressApiParams}`)
        
        if (response.ok !== true) {
            alert("There was an error fetching the data")
            return
        }

        let data = await response.json()
        return data.address;
    }

    function getHTMLPopupContent(addressData, latlng) {
        let displayAddress = createDisplayableAddressFromAddressData(addressData)
        let popupContent = document.querySelector('.custom-popup-content').cloneNode(true)
        popupContent.querySelector('#address').innerHTML = displayAddress
        popupContent.querySelector('#latitude').value = latlng.lat
        popupContent.querySelector('#longitude').value = latlng.lng
        popupContent.classList.remove('hidden')
        return popupContent.outerHTML
    }

    function getHTMLPlaceDetailsPopupContent(place) {
        let popupContent = document.querySelector('.custom-place-details-popup-content').cloneNode(true)
        let newlineSplit = place.address.split('\n')
        let cityLine = newlineSplit[1]
        let spaceSplit = cityLine.split(' ')

        let [, ...city] = spaceSplit

        popupContent.querySelector('#details-city').innerHTML = city.join(' ')

        let detailAddress = place.address
        detailAddress = detailAddress.replaceAll('\r\n', '<br>') // "neue Zeile" mit "HTML Umbruch" tauschen 
        // \r\n' damit es für alle Betriebssysteme geht
        popupContent.querySelector('#details-address').innerHTML = detailAddress
        //popupContent.querySelector('#details-description').innerHTML = place.description
        //popupContent.querySelector('#details-price').innerHTML = place.price
        popupContent.querySelector('#details-rate').innerHTML = "★".repeat(place.rate) + "☆".repeat(5-place.rate)
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

    function displayPlacePopup(latlng, popupContent) {
        // setContent() expects valid HTML (https://leafletjs.com/reference-1.7.1.html#popup-option)
        L.popup({keepInView: true, className: 'popup-add-place'})
            .setLatLng(latlng)
            .setContent(popupContent)
            .openOn(map);
    }

    function displayPlaceDetailsPopup(latlng, popupContent) {
        L.popup({keepInView: true, className: 'popup-details'})
            .setLatLng(latlng)
            .setContent(popupContent)
            .openOn(map);
    }