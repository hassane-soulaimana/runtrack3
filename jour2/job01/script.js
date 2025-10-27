function citation() {
    const elementCitation = document.getElementById("citation");
    const contenu = elementCitation.textContent;
    console.log(contenu);
}

document.getElementById("button").addEventListener("click", citation);