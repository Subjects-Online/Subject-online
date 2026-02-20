document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generatorForm');
    const generatedCodeEl = document.getElementById('generatedCode');
    const copyBtn = document.getElementById('copyBtn');

    // Function to format the date correctly (YYYY-MM-DD to YYYY-MM-DD which is exactly what the input type date returns)
    // Actually input[type="date"] gives YYYY-MM-DD which is perfect for parsing.

    // Format syntax highliter
    function syntaxHighlight(jsonStr) {
        return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'val';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key'; // It's a key
                    match = match.replace(/"/g, ''); // Object properties in JS don't need quotes if they are standard words
                } else {
                    cls = 'str'; // It's a string
                }
            } 
            return '<span class="' + cls + '">' + match + '</span>';
        }).replace(/([{}:,])/g, '<span class="punc">$1</span>');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('contentType').value;
        const title = document.getElementById('contentTitle').value;
        const path = document.getElementById('contentPath').value;
        const size = document.getElementById('contentSize').value;
        const date = document.getElementById('contentDate').value;

        // Determine Icon based on Type
        let icon = "";
        if (type === 'pdf') {
            icon = "<i class='fas fa-book-open'></i>";
        } else if (type === 'video') {
            icon = "<i class='fas fa-brands fa-youtube'></i>";
        }

        // Generate JSON String Block
        const snippetTemplate = `{
    path: "${path}",
    title: "${title}",
    size: "${size}",
    date: "${date}",
    icon: "${icon}"
},`;
        
        // Output raw text and set dataset for copying
        generatedCodeEl.innerHTML = syntaxHighlight(snippetTemplate);
        generatedCodeEl.dataset.rawCode = snippetTemplate;
        
        copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy code';
        copyBtn.classList.remove('copied');
    });

    // Handle Copy
    copyBtn.addEventListener('click', () => {
        const rawCode = generatedCodeEl.dataset.rawCode;
        if (!rawCode) return;

        navigator.clipboard.writeText(rawCode).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy code';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
});
