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
