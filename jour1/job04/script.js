function bisextile(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const annees =[ 2001, 2002, 2003, 2004, 2005 ];

annees.forEach(annee => {
    const isTrue = bisextile(annee);
    if(isTrue) {
        console.log(annee);
        console.log ("l'annee est bisextile", annee);
    } else {
        console.log("l'annee n'est pas bisextile");
    }
})