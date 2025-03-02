let searchEl = document.getElementById('searchInput');
let searchResult = document.getElementById('searchResults');
let spinnerEl = document.getElementById('spinner');

function createAndAppendSearchResult(result) {
    // Create Result Item (div)
    let resultEl = document.createElement('div');
    resultEl.classList.add('result-item');
    searchResult.appendChild(resultEl);

    // Extract data from result
    let { link, title, description } = result;

    // Create Title Element
    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultEl.appendChild(titleEl);

    // Create Break Element
    resultEl.appendChild(document.createElement('br'));

    // Create URL Element
    let urlEl = document.createElement("a");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    urlEl.classList.add("result-url");
    resultEl.appendChild(urlEl);

    // Create Break Element
    resultEl.appendChild(document.createElement('br'));

    // Create Description Element
    let descriptionEl = document.createElement("p");
    descriptionEl.textContent = description;
    descriptionEl.classList.add("link-description");
    resultEl.appendChild(descriptionEl);
}

function displayResults(search_results) {
    // Hide Spinner
    spinnerEl.classList.add("d-none");

    // Clear previous search results
    searchResult.innerHTML = "";

    if (search_results.length === 0) {
        let noResultsEl = document.createElement("p");
        noResultsEl.textContent = "No results found. Try another search.";
        noResultsEl.style.color = "red";
        searchResult.appendChild(noResultsEl);
        return;
    }

    for (let result of search_results) {
        createAndAppendSearchResult(result);
    }
}

function searchWikipedia(event) {
    if (event.key === 'Enter') {
        let input = searchEl.value.trim();
        if (input === "") {
            searchResult.innerHTML = "<p style='color:red;'>Please enter a search term.</p>";
            return;
        }

        // Show Spinner
        spinnerEl.classList.remove("d-none");
        searchResult.innerHTML = "";

        let url = "https://apis.ccbp.in/wiki-search?search=" + encodeURIComponent(input);

        let options = {
            method: "GET"
        };

        fetch(url, options)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                let { search_results } = jsonData;
                displayResults(search_results);
            })
            .catch(function(error) {
                spinnerEl.classList.add("d-none");
                searchResult.innerHTML = "<p style='color:red;'>An error occurred. Please try again.</p>";
                console.error("Error fetching data:", error);
            });
    }
}

// Function to fetch Wikipedia history as default search results when the page loads
function fetchDefaultResults() {
    let defaultSearch = "Wikipedia history";  // Default topic to show
    let url = "https://apis.ccbp.in/wiki-search?search=" + encodeURIComponent(defaultSearch);

    // Show Spinner
    spinnerEl.classList.remove("d-none");
    searchResult.innerHTML = "";

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            let { search_results } = jsonData;
            displayResults(search_results);
        })
        .catch(error => {
            spinnerEl.classList.add("d-none");
            searchResult.innerHTML = "<p style='color:red;'>Failed to load default results.</p>";
            console.error("Error fetching default data:", error);
        });
}

// Run the default search when the page loads
window.onload = fetchDefaultResults;

// Add event listener for search
searchEl.addEventListener('keydown', searchWikipedia);
