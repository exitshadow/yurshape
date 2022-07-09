// ! meant to be used with ipip_items.js or ipip_items_fr.js !
// the files are separated for legibility
// always reference the data script before the script
// (too lazy to write a json function today)
//
// let items_fr is declared in the files referenced above

// data

const ipip_scale_fr = items_fr.ipip_scale_fr;
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

// settings & initializers

let lang;
let test_version;
let toggleDebug = true;
let scoring;
let currentItem = 0;
let value;

// scores with subscales represented by attributes
let scores = {
    "extraversion" :{
        "enthusiasm" : 0,
        "assertiveness" : 0
        },
    "amability" : {
        "compassion" : 0,
        "politeness" : 0,
    },
    "organisation" : {
        "industriousness" : 0,
        "orderliness" : 0,
    },
    "neuroticism" : {
        "volatility" : 0,
        "withdrawal" : 0,
    },
    "invention" : {
        "intellect" : 0,
        "imagination" : 0
    }
}

// functions

function previousQuestion() {
    if (currentItem > 0) {
        currentItem--;
        refreshQuestions();
    } else {
        console.log('there is no previous question...')
    }
}

function nextQuestion() {
    if (currentItem < ipip_scale_fr.length) {
        currentItem++;
        refreshQuestions();
    } else {
        console.log('there is no next question');
        // show end of quizz
    }
}

function refreshQuestions() {
    itemBox.id = "item-" + (currentItem +1);
    itemIndicator.innerHTML = "Item n° " + (currentItem + 1);
    itemContent.innerHTML = ipip_scale_fr[currentItem].content;

    if (toggleDebug) {
        for (const key in scores) {
            scoring.innerHTML = key.toString() + " : ";
            for (const innerKey in scores[key]) {
                scoring.innerHTML += innerKey.toString() + ":" + scores[key][innerKey] + " ";
            }
        }
    }
}

function registerAnswers() {
    let score;
    if (scores[currentItem].key) score = value + 1;
    else score = likert_scale_en.length - value;

    if (scores[currentItem].scale == 1) {
        if (scores[currentItem].subscale == 1) scores.extraversion.enthusiasm += score;
        if (scores[currentItem].subscale == 2) scores.extraversion.assertiveness += score;

    } else if (scores[currentItem].scale == 2) {
        if (scores[currentItem].subscale == 1) scores.amability.compassion += score;
        if (scores[currentItem].subscale == 2) scores.amability.politeness += score;

    } else if (scores[currentItem].scale == 3) {
        if (scores[currentItem].subscale == 1) scores.organisation.industriousness += score;
        if (scores[currentItem].subscale == 2) scores.organisation.orderliness += score;

    } else if (scores[currentItem].scale == 4) {
        if (scores[currentItem].subscale == 1) scores.neuroticism.volatility += score;
        if (scores[currentItem].subscale == 2) scores.neuroticism.withdrawal += score;

    } else if (scores[currentItem].scale == 5) {
        if (scores[currentItem].subscale == 1) scores.invention.intellect += score;
        if (scores[currentItem].subscale == 2) scores.invention.imagination += score;
    }
}

// structure

let main = document.getElementsByTagName( 'main' )[0];

    // main div p .question-item
    // initializing question values at 0 to be replaced later on


    let itemBox = document.createElement('div');
    itemBox.id = "item-" + (currentItem + 1);
    itemBox.className = "item-box";

    let itemIndicator = document.createElement('p');
    itemIndicator.className = "item-tab";
    itemIndicator.innerHTML = "Item n° " + (currentItem + 1);

    let itemContent = document.createElement('p');
    itemContent.innerHTML = ipip_scale_fr[currentItem].content;
    itemContent.className = "item-content";

    let answersDiv = document.createElement('div');
    answersDiv.className = 'answers-box';

    main.appendChild(itemBox);
    main.appendChild(answersDiv);
    itemBox.appendChild(itemIndicator);
    itemBox.appendChild(itemContent);


        // laying likert scale answers out

        for (let i = 0; i < likert_scale_fr.length; i++) {
            const answerBlock = document.createElement('div');
            answerBlock.className = 'single-answer-box';

            const likertScaleText = document.createElement('p');
            likertScaleText.innerHTML = likert_scale_fr[i];
            likertScaleText.id = "answer-" + (i + 1);

            const likertScaleValue = document.createElement('input');
            likertScaleValue.type = 'radio';
            likertScaleValue.name = 'likert';
            likertScaleValue.value = i + 1;

            answersDiv.appendChild(answerBlock);
            answerBlock.appendChild(likertScaleValue);
            answerBlock.appendChild(likertScaleText);

            console.log(likertScaleValue);
        }
    
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.innerHTML = 'previous';
    prevButton.value = 'previous'
    main.appendChild(prevButton);
    prevButton.addEventListener('click', previousQuestion);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.innerHTML = 'next';
    nextButton.value = 'next';
    main.appendChild(nextButton);
    nextButton.addEventListener('click', nextQuestion);

    if (toggleDebug) {
        const debugBox = document.createElement('div');
        debugBox.id = 'debug-box';
        main.appendChild(debugBox);

        for (const key in scores) {
            scoring = document.createElement('div');
            scoring.innerHTML = key.toString() + " : ";
            for (const innerKey in scores[key]) {
                scoring.innerHTML += innerKey.toString() + ":" + scores[key][innerKey] + " ";
            }
            debugBox.appendChild(scoring);
        }


    }

// NOTES
// compiler throws a ReferenceError for likertScaleValue when called in refreshQuestions()
// why does it do it for likertScaleValue but not for likertScaleText?