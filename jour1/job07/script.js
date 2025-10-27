function jourtravaille(date) {
    const joursFeries2020 = [
        new Date(2020, 0, 1),
        new Date(2020, 3, 13),
        new Date(2020, 4, 1),  
        new Date(2020, 4, 8), 
        new Date(2020, 4, 21), 
        new Date(2020, 4, 31), 
        new Date(2020, 6, 14), 
        new Date(2020, 7, 15), 
        new Date(2020, 10, 1), 
        new Date(2020, 10, 11),
        new Date(2020, 11, 25)
    ];


    const mois = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    
    const jour = date.getDate();
    const moisIndex = date.getMonth();
    const annee = date.getFullYear();
    const jourSemaine = date.getDay();

    
    const dateFormatee = `${jour} ${mois[moisIndex]} ${annee}`;

    
    const estJourFerie = joursFeries2020.some(ferie => 
        ferie.getDate() === jour && 
        ferie.getMonth() === moisIndex && 
        ferie.getFullYear() === annee
    );

    
    const estWeekend = jourSemaine === 0 || jourSemaine === 6;

    
    if (estJourFerie) {
        console.log(`Le ${dateFormatee} est un jour férié`);
    } else if (estWeekend) {
        console.log(`Non, ${dateFormatee} est un week-end`);
    } else {
        console.log(`Oui, ${dateFormatee} est un jour travaillé`);
    }
}

jourtravaille(new Date(2020, 0, 1))
jourtravaille(new Date(2020, 0, 4));
jourtravaille(new Date(2020, 0, 6));
jourtravaille(new Date(2020, 4, 1));
jourtravaille(new Date(2020, 4, 2));