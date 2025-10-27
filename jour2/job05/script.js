window.addEventListener('scroll', function() {
    const footer = document.getElementById('footer');
    const hauteurPage = document.body.scrollHeight - window.innerHeight;
    const pourcentageScroll = (window.scrollY / hauteurPage) * 100;
    
    
    const rouge = Math.min(255, Math.floor(pourcentageScroll * 2.55));
    const vert = Math.max(0, 255 - Math.floor(pourcentageScroll * 2.55));
    
    footer.style.backgroundColor = `rgb(${rouge}, ${vert}, 0)`;
});