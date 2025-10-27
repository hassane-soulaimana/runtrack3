function showhide() {
    let article = document.getElementById("citation");
    
    if (article) {
        article.remove();
    } else {
        article = document.createElement("article");
        article.id = "citation";
        article.textContent = "L'important n'est pas la chute, mais l'atterrissage.";
        
        const button = document.getElementById("button");
        button.parentNode.insertBefore(article, button.nextSibling);
    }
}

document.getElementById("button").addEventListener("click", showhide);
