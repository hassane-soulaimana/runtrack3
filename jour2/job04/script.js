(function() {
    const textarea = document.getElementById('keylogger');
    let countForCurrentKey = 0;

    document.addEventListener('keydown', function(event) {
        if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            const letter = event.key.toLowerCase();
            const textareaIsFocused = (document.activeElement === textarea);
            
            if (textareaIsFocused) {
                event.preventDefault();
            }
            
            if (countForCurrentKey < 2) {
                const numberOfLetters = textareaIsFocused ? 2 : 1;
                
                for (let i = 0; i < numberOfLetters; i++) {
                    textarea.value += letter;
                }
                
                countForCurrentKey++;
            }
        }
    });

    document.addEventListener('keyup', function() {
        countForCurrentKey = 0;
    });
})();