let searchBox = document.getElementById("searchContainer");
let search = document.getElementById("search");

searchBox.onclick = function(){
    closeSearch();
}

search.onclick = function(){
    window.event.stopPropagation();
}

function showSearch(){
    searchBox.style.display = "block"
}

function closeSearch(){
    searchBox.style.display = "none"
}

function gotoTop(){
    window.scrollTo(0, 0);
}



