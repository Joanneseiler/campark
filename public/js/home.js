window.addEventListener('load', () => {
    const input = document.getElementById("searchbar");
    input.addEventListener('focusout', () => {
        input.classList.remove('searching')
    })

    autocomplete({
        input: input,
        fetch: async function(text, update) {
            input.classList.add('searching')
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            const data = await fetch(`https://nominatim.openstreetmap.org/search.php?city=${text}&format=json&accept-language=en`);
            const cities = await data.json()
            const suggestions = cities.map(city => ({label: city.display_name, value: {lon: city.lon, lat: city.lat}}))
            input.classList.remove('searching')
            update(suggestions)
        },
        debounceWaitMs: 200,
        onSelect: function(city) {
            input.value = city.label;
            window.location.href = `/map?lon=${city.value.lon}&lat=${city.value.lat}`
        }
    });
})
