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
    "Tout à fait d'accord"];

// settings

let lang;
let test_version;

// structure

let main = document.getElementsByTagName( 'main' )[0];

    // main div p .question-item
    // initializing question values at 0 to be replaced later on

    let currentItem = 0;

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
            likertScaleValue.name = 'item-' + (currentItem + 1) + " value";
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

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.innerHTML = 'next';
    nextButton.value = 'next';
    main.appendChild(nextButton);

