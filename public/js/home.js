const countries = [
    { label: 'United Kingdom', value: 'UK' },
    { label: 'United States', value: 'US' }
];

window.addEventListener('load', () => {
    const input = document.getElementById("searchbar");
    input.addEventListener('focusout', () => {
        input.classList.remove('searching')
    })

    autocomplete({
        input: input,
        fetch: function(text, update) {
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            const suggestions = countries.filter(n => n.label.toLowerCase().startsWith(text))
            update(suggestions);
        },
        onSelect: function(item) {
            input.value = item.label;
        },
        customize: () => {
            input.classList.add('searching')
        }
    });
})
