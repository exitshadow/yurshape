// ! meant to be used with ipip_items.js or ipip_items_fr.js !
// the files are separated for legibility
// always reference the data script before the script
// (too lazy to write a json function today)
//
// let items_fr is declared in the files referenced above

// data

const bfas_scale_fr = items_fr.bfas_scoring_keys;
const likert_scale_fr = [
    "Pas du tout d'accord",
    "Pas vraiment d'accord",
    "Ni d'accord ou pas d'accord",
    "Assez d'accord",
    "Tout à fait d'accord"
];
const likert_scale_en = [
    "Strongly disagree",
    "Somewhat disagree",
    "Neither agree or disagree",
    "Somewhat agree",
    "Strongly agree"
];
const results_desc = ocean_desc_fr;

// settings & initializers

let lang = 'fr';
let shortVersion = true;

let test;

if (lang === 'fr') {
    if (shortVersion) test = items_fr.ipip_scale_fr;
    else test = items_fr.bfas_scoring_keys;
}
else test = items_fr.ipip_scale_fr; // to be changed

let currentItem = 0;

let value;
let highestScore = 0;
let isChecked = false;

// scores with subscales represented by attributes
let scores = {
    "extraversion" :{
        "enthusiasm" : 0,
        "assertiveness" : 0
        },
    "agreeableness" : {
        "compassion" : 0,
        "politeness" : 0,
    },
    "consciousness" : {
        "industriousness" : 0,
        "orderliness" : 0,
    },
    "neuroticism" : {
        "volatility" : 0,
        "withdrawal" : 0,
    },
    "openness" : {
        "intellect" : 0,
        "imagination" : 0
    }
}

let bufferScores = [];

// gl
var glCanvas;


// functions

// would be nice to have
function toggleLanguage() {
    if(lang === 'fr') lang = 'en';
    else lang = 'fr';
}

function previousQuestion() {
    if (currentItem > 0) {
        currentItem--;
        refreshQuestions();
    } else {
        console.log('there is no previous question...')
    }
}

function nextQuestion() {
    if (currentItem < test.length - 1) {
        submitAnswer();
        currentItem++;
        refreshQuestions();
    } else {
        console.log('there is no next question');
        if(!isChecked) {
            hideTest();
            calculateTotalScore();
            showResults();
            glCanvasInit();
        }
    }
}

function submitAnswer() {
    const radioButtons = document.querySelectorAll('input[name="likert"]');
    console.log(radioButtons);
 
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            value = Number(radioButton.value);
            console.log(value);
        }
    };

    // TODO assign score to arrays istead of hard coding it in scores
        // store answer at index currentItem
    // and use a damn switch case
    let score;
    if (test[currentItem].key) score = value;
    else score = likert_scale_en.length - value;

    bufferScores.push(score);

    switch (test[currentItem].scale) {
        case 1:
            
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        default:
            break;
    }

    if (test[currentItem].scale == 1) {
        if (test[currentItem].subscale == 1) scores.extraversion.enthusiasm += score;
        if (test[currentItem].subscale == 2) scores.extraversion.assertiveness += score;

    } else if (test[currentItem].scale == 2) {
        if (test[currentItem].subscale == 1) scores.agreeableness.compassion += score;
        if (test[currentItem].subscale == 2) scores.agreeableness.politeness += score;

    } else if (test[currentItem].scale == 3) {
        if (test[currentItem].subscale == 1) scores.consciousness.industriousness += score;
        if (test[currentItem].subscale == 2) scores.consciousness.orderliness += score;

    } else if (test[currentItem].scale == 4) {
        if (test[currentItem].subscale == 1) scores.neuroticism.volatility += score;
        if (test[currentItem].subscale == 2) scores.neuroticism.withdrawal += score;

    } else if (test[currentItem].scale == 5) {
        if (test[currentItem].subscale == 1) scores.openness.intellect += score;
        if (test[currentItem].subscale == 2) scores.openness.imagination += score;
    }

    console.log(scores);
}

function refreshQuestions() {
    itemBox.id = "item-" + (currentItem +1);
    itemIndicator.innerHTML = "Item n° " + (currentItem + 1);
    itemContent.innerHTML = test[currentItem].content;
}

function hideTest() {
    testBox.style.display = 'none';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
}

function calculateTotalScore() {
    // show dominant trait
    // sort by score

    scores.extraversion.totalScore =
    scores.extraversion.enthusiasm + scores.extraversion.assertiveness;

    scores.agreeableness.totalScore =
    scores.agreeableness.compassion + scores.agreeableness.politeness;

    scores.consciousness.totalScore =
    scores.consciousness.industriousness + scores.consciousness.orderliness;

    scores.neuroticism.totalScore =
    scores.neuroticism.volatility + scores.neuroticism.withdrawal;

    scores.openness.totalScore =
    scores.openness.intellect + scores.openness.imagination;

    // set highest score
    for (const key in scores) {
        for (const innerKey in scores[key]) {
            if (innerKey == 'totalScore') {
                if (scores[key][innerKey] > highestScore) {
                    highestScore = scores[key][innerKey]
                }
            }
        }
    }
}

function showResults() {
    //boilerplates the div where results will be shown
    const results = document.createElement('div');
        results.className = 'results-box';
        
    glCanvas = document.createElement('canvas');
        glCanvas.id = 'glCanvas';
        glCanvas.width = '600';
        glCanvas.height = '600';
        
    const resultsTitle = document.createElement('h2');
        resultsTitle.innerHTML = 'your results';
        
    main.appendChild(results);
    results.appendChild(glCanvas);
    results.appendChild(resultsTitle);

    // picks dominant trait and displays it as a title
    let dominantTrait;
    let dominantTraitBox;
        // this is a bit strange, without the stopping boolean it
        // checks the equality 3 times ?!
    for (const key in scores) {
        for (const innerKey in scores[key]) {
            console.log(scores[key].totalScore);
            if (highestScore == scores[key].totalScore && !isChecked) {
                dominantTrait = key;
                dominantTraitBox = document.createElement('div');
                dominantTraitBox.innerHTML = `<p>your dominant trait is <span class="dominant-trait">${key.toString()}</span></p>`;
                dominantTraitBox.className = 'dominant-trait-desc';
                results.appendChild(dominantTraitBox);
                isChecked = true;
            }
        }
    }

    // displays description for dominant trait
    for (const key in results_desc) {
        if (key == dominantTrait) {
            const dominantDesc = document.createElement('p');
                dominantDesc.innerHTML = results_desc[key];
            
                dominantTraitBox.appendChild(dominantDesc);
        }
    }

    let factor;
    if (shortVersion) factor = 2;
    else factor = 1;

    // display scoring bars
    for (const key in scores) {

        const scale1 = document.createElement('div');
            scale1.innerHTML = `<p><span class="scale1-def">${key.toString()} :</span> ${scores[key].totalScore}</p>`;
            scale1.className = 'scale1';
            
        const scale1Bar = document.createElement('div');
            scale1Bar.style.height = '8px';
            scale1Bar.style.width = "100%";
            scale1Bar.className = 'scale-bar-behind';
            
        const scale1BarResult = document.createElement('div');
            scale1BarResult.style.height = scale1Bar.style.height;
            scale1BarResult.style.width = `${(scores[key].totalScore * factor)}%`;
            scale1BarResult.className = 'scale-bar-front ' + key.toString();
            
        results.appendChild(scale1);
        scale1.appendChild(scale1Bar);
        scale1.appendChild(scale1BarResult);

        for (const innerKey in scores[key]) {
            if (innerKey != 'totalScore') {
                const scale2 = document.createElement('div');
                    scale2.innerHTML = `<p><span class="scale2-def">${innerKey.toString()} :</span> ${scores[key][innerKey]}</p>`;
                    scale2.className = 'scale2';
                
                scale1.appendChild(scale2);
            }
        }
    }
}

// drawing the content

let main = document.getElementsByTagName( 'main' )[0];

    const prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.innerHTML = 'previous';
        prevButton.value = 'previous'
        prevButton.addEventListener('click', previousQuestion);
        
    const testBox = document.createElement('div');
        testBox.className = 'test-box';
        testBox.style.display = 'block';
        
    const itemBox = document.createElement('div');
        itemBox.id = "item-" + (currentItem + 1);
        itemBox.className = "item-box";
        
    const itemIndicator = document.createElement('p');
        itemIndicator.className = "item-tab";
        itemIndicator.innerHTML = "Item n° " + (currentItem + 1);
        
    const itemContent = document.createElement('p');
        itemContent.innerHTML = test[currentItem].content;
        itemContent.className = "item-content";
        
    const answersBox = document.createElement('div');
        answersBox.className = 'answers-box';
        
        main.appendChild(prevButton);
        main.appendChild(testBox);
        
        testBox.appendChild(itemBox);
        testBox.appendChild(answersBox);
        itemBox.appendChild(itemIndicator);
        itemBox.appendChild(itemContent);
        

        // laying likert scale answers out

    for (let i = 0; i < likert_scale_fr.length; i++) {
        const answerBlock = document.createElement('div');
            answerBlock.className = 'single-answer-box';

            const likertScaleValue = document.createElement('input');
            likertScaleValue.type = 'radio';
            likertScaleValue.name = 'likert';
            likertScaleValue.value = i + 1;

            const likertScaleText = document.createElement('p');
                likertScaleText.innerHTML = likert_scale_fr[i];
                likertScaleText.id = "answer-" + (i + 1);

        answersBox.appendChild(answerBlock);
        answerBlock.appendChild(likertScaleValue);
        answerBlock.appendChild(likertScaleText);
    }

    const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.innerHTML = 'next';
        nextButton.value = 'next';
        nextButton.addEventListener('click', nextQuestion);

    main.appendChild(nextButton);

    //showResults();

// NOTES
// compiler throws a ReferenceError for likertScaleValue when called in refreshQuestions()
// why does it do it for likertScaleValue but not for likertScaleText?