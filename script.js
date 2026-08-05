let word = document.querySelectorAll(".word");
word.forEach((word) => {
    let letters = word.textContent.split("");
    word.textContent="";
    letters.forEach((letter)=>{
        let span = document.createElement("span");
        span.textContent=letter;
        span.className = "letter";
        word.append(span);
    });
});

let currentWordIndex =0;
let maxWordIndex = word.length-1;
word[currentWordIndex].style.opacity ="1";

let changeText = ()=>{
    let currentWord = word[currentWordIndex];
    let nextWord = currentWordIndex ===  maxWordIndex ? word[0] : word[currentWordIndex+ 1];

    Array.from(currentWord.children).forEach((letter, i)=>{
        setTimeout(() => {
            letter.className = "letter out";

        }, i* 80);
    });

    Array.from(nextWord.children).forEach((letter,i)=>{
        letter.className = "letter behind";
        setTimeout(()=>{
            letter.className="letter in";
        } ,340+i *80);

    });
    setTimeout(() => {
        nextWord.style.opacity = "1";
    }, 340 + nextWord.children.length * 80);

    currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex +1;
};

changeText()
setInterval(changeText, 3000)

// circle skills ////////////////////////////////////////
const circle = document.querySelectorAll('.circle');

circle.forEach(elem => {
  const dots = elem.getAttribute("data-dots");
  const marked = elem.getAttribute("data-percent");
  const percent = Math.floor(dots * marked / 100);
  const rotate = 360 / dots;
  let points = "";

  for (let i = 0; i < dots; i++) {
    points += `<div class="points" style="--i:${i}; --rot:${rotate}deg"></div>`;
  }

  elem.innerHTML = points;

  const pointsMarked = elem.querySelectorAll('.points');
  for (let i = 0; i < percent; i++) {
    pointsMarked[i].classList.add('marked');
  }
});

// Mobile sidebar navigation toggle //////////////////////////////////////
const menuIcon = document.getElementById('menu-icon');
const navList = document.querySelector('.navlist');

if (menuIcon && navList) {
    menuIcon.addEventListener('click', () => {
        navList.classList.toggle('show');
        menuIcon.classList.toggle('bx-menu');
        menuIcon.classList.toggle('bx-x');
    });

    // Close nav when a link is clicked (mobile UX)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('show');
            menuIcon.classList.add('bx-menu');
            menuIcon.classList.remove('bx-x');
        });
    });
}

// Force-download handler for CV links (fetch + blob -> download)
async function fetchAndDownload(url, filename) {
    try {
        const res = await fetch(url, {cache: 'no-store'});
        if (!res.ok) throw new Error('Network response was not ok');
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
        console.error('Download failed', err);
        // fallback: navigate to file (browser default behavior)
        window.location.href = url;
    }
}

// Attach handler to all links with `.js-download-cv`
document.querySelectorAll('.js-download-cv').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        const filename = link.dataset.filename || link.getAttribute('download') || 'resume.pdf';
        fetchAndDownload(url, filename);
    });
});

// Contact form popup message
const contactForm = document.querySelector('.contactme form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your message has been sent!');
    });
}

// Click-to-copy email ////////////////////////////////////////
const emailElem = document.getElementById('email');
if (emailElem) {
    emailElem.addEventListener('click', async (e) => {
        const email = emailElem.dataset.email || emailElem.textContent.trim();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = email;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            // show tooltip
            let tip = emailElem.querySelector('.copy-tooltip');
            if (!tip) {
                tip = document.createElement('span');
                tip.className = 'copy-tooltip';
                tip.textContent = 'Copied!';
                emailElem.appendChild(tip);
                // small delay to allow transition when adding class
                requestAnimationFrame(() => tip.classList.add('show'));
            } else {
                tip.classList.remove('show');
                // reflow then show
                void tip.offsetWidth;
                tip.classList.add('show');
            }
            setTimeout(() => {
                tip.classList.remove('show');
            }, 1400);
        } catch (err) {
            console.error('Copy failed', err);
        }
    });
}
