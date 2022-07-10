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
const results_desc = ocean_desc_fr;

// settings & initializers

let lang;
let test_version;
let scale2;
let currentItem = 0;
let value;
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
    if (currentItem < ipip_scale_fr.length - 1) {
        submitAnswer();
        currentItem++;
        refreshQuestions();
    } else {
        console.log('there is no next question');
        if(!isChecked) showResults();
    }
}

function refreshQuestions() {
    itemBox.id = "item-" + (currentItem +1);
    itemIndicator.innerHTML = "Item n° " + (currentItem + 1);
    itemContent.innerHTML = ipip_scale_fr[currentItem].content;
}

// this works as expected
function submitAnswer() {
    const radioButtons = document.querySelectorAll('input[name="likert"]');
    console.log(radioButtons);
 
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            value = Number(radioButton.value);
            console.log(value);
            // this works
        }
    };

    let score;
    if (ipip_scale_fr[currentItem].key) score = value;
    else score = likert_scale_en.length - value;

    if (ipip_scale_fr[currentItem].scale == 1) {
        if (ipip_scale_fr[currentItem].subscale == 1) scores.extraversion.enthusiasm += score;
        if (ipip_scale_fr[currentItem].subscale == 2) scores.extraversion.assertiveness += score;

    } else if (ipip_scale_fr[currentItem].scale == 2) {
        if (ipip_scale_fr[currentItem].subscale == 1) scores.agreeableness.compassion += score;
        if (ipip_scale_fr[currentItem].subscale == 2) scores.agreeableness.politeness += score;

    } else if (ipip_scale_fr[currentItem].scale == 3) {
        if (ipip_scale_fr[currentItem].subscale == 1) scores.consciousness.industriousness += score;
        if (ipip_scale_fr[currentItem].subscale == 2) scores.consciousness.orderliness += score;

    } else if (ipip_scale_fr[currentItem].scale == 4) {
        if (ipip_scale_fr[currentItem].subscale == 1) scores.neuroticism.volatility += score;
        if (ipip_scale_fr[currentItem].subscale == 2) scores.neuroticism.withdrawal += score;

    } else if (ipip_scale_fr[currentItem].scale == 5) {
        if (ipip_scale_fr[currentItem].subscale == 1) scores.openness.intellect += score;
        if (ipip_scale_fr[currentItem].subscale == 2) scores.openness.imagination += score;
    }

    console.log(scores);
}

function showResults() {
    const results = document.createElement('div');
    results.className = 'results-box';
    main.appendChild(results);

    const glCanvas = document.createElement('canvas');
    glCanvas.id = 'glCanvas';
    glCanvas.width = '600';
    glCanvas.height = '600';
    results.appendChild(glCanvas);

    const resultsTitle = document.createElement('h2');
    resultsTitle.innerHTML = 'your results';
    results.appendChild(resultsTitle);

    // show dominant trait
    // sort by score

    scores.extraversion.totalScore =
    scores.extraversion.enthusiasm + scores.extraversion.assertiveness;

    scores.agreeableness.totalScore =
    scores.agreeableness.compassion + scores.agreeableness.politeness;

    scores.consciousness.totalScore =
    scores.consciousness.industriousness + scores.consciousness.orderliness;

    scores.neuroticism.totalScore =
    scores.neuroticism.volatility + scores.neuroticism.volatility;

    scores.openness.totalScore =
    scores.openness.intellect + scores.openness.imagination;

    // set highest score
    let highestScore = 0;
    for (const key in scores) {
        for (const innerKey in scores[key]) {
            if (innerKey == 'totalScore') {
                if (scores[key][innerKey] > highestScore) {
                    highestScore = scores[key][innerKey]
                }
            }
        }
    }

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
                dominantTraitBox.innerHTML = `your dominant trait is ${key.toString()}`;
                results.appendChild(dominantTraitBox);
                isChecked = true;
            }
        }
    }

    for (const key in results_desc) {
        if (key == dominantTrait) {
            const dominantDesc = document.createElement('p');
            dominantDesc.innerHTML = results_desc[key];
            dominantTraitBox.appendChild(dominantDesc);
        }
    }

    // display details
    for (const key in scores) {
        const scale1 = document.createElement('div');
        scale1.innerHTML = key.toString() + " : " + scores[key].totalScore;
        scale1.className = 'scale1';
        results.appendChild(scale1);
        for (const innerKey in scores[key]) {
            if (innerKey != 'totalScore') {
                scale2 = document.createElement('div');
                scale2.innerHTML = innerKey.toString() + " : " + scores[key][innerKey] + " ";
                scale2.className = 'scale2';
                scale1.appendChild(scale2);
            }
        }
    }
}

// structure

let main = document.getElementsByTagName( 'main' )[0];

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.innerHTML = 'previous';
    prevButton.value = 'previous'
    main.appendChild(prevButton);
    prevButton.addEventListener('click', previousQuestion);

    // main div p .question-item
    // initializing question values at 0 to be replaced later on
    let testBox = document.createElement('div');
    testBox.className = 'test-box';
    main.appendChild(testBox);

    let itemBox = document.createElement('div');
    itemBox.id = "item-" + (currentItem + 1);
    itemBox.className = "item-box";

    let itemIndicator = document.createElement('p');
    itemIndicator.className = "item-tab";
    itemIndicator.innerHTML = "Item n° " + (currentItem + 1);

    let itemContent = document.createElement('p');
    itemContent.innerHTML = ipip_scale_fr[currentItem].content;
    itemContent.className = "item-content";

    let answersBox = document.createElement('div');
    answersBox.className = 'answers-box';

    testBox.appendChild(itemBox);
    testBox.appendChild(answersBox);
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

            answersBox.appendChild(answerBlock);
            answerBlock.appendChild(likertScaleValue);
            answerBlock.appendChild(likertScaleText);
        }

    

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.innerHTML = 'next';
    nextButton.value = 'next';
    main.appendChild(nextButton);
    nextButton.addEventListener('click', nextQuestion);

     //showResults();

// NOTES
// compiler throws a ReferenceError for likertScaleValue when called in refreshQuestions()
// why does it do it for likertScaleValue but not for likertScaleText?