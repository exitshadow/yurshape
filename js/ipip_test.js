let config = {
    type: Phaser.AUTO,
    width: 710,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);


//#region data
let items;// json array
let itemContent; // string
let itemContentBox; // box object that surrounds the question
let itemIndexBox; // box object that indicates the current index
let itemIndexBoxText // text inside
//#endregion

//#region answers management
let options = [
    "Tout à fait d’accord",
    "Assez d’accord",
    "Neutre",
    "Pas vraiment d’accord",
    "Pas du tout d’accord"
]; // array of options
let optionsText; // text object that displays the strings in the array
let optionsBox; // box object that surrounds the options
let optionsCheckBox; // box object that surrounds the checker of options
let isColorChanged = false;
//#endregion

//#region navigation
let itemIndex = 0; // keeps track of items index
let nextItemBox; // container for next item trigger
let nextItem; // trigger to next item
let nextItemText;
let check;
let indexChosen = 0;
//#endregion

//#region scores
// primary scores
let s1_scores = {
    "extraversion" : 0,
    "amability" : 0,
    "organisation" : 0,
    "neuroticism" : 0,
    "invention" : 0
}

let dominantTrait; // dominant scale / dimension

// subscores
let ss_1_1 = 0; // enthusiasm
let ss_1_2 = 0; // assertion
let ss_2_1 = 0; // compassion
let ss_2_2 = 0; // politeness
let ss_3_1 = 0; // industriousness
let ss_3_2 = 0; // orderliness
let ss_4_1 = 0; // volatility
let ss_4_2 = 0; // withdrawal
let ss_5_1 = 0; // intellect
let ss_5_2 = 0; // imagination
//#endregion

//#region setup design grid
let quizzOrigin = 30;
let titleBoxHeight = 180;

let quizzAnchorX = 30;
let quizzAnchorY = quizzOrigin + titleBoxHeight + 20;


let quizzWidth = 650;
let optionsWidth = 400;
let optionsHeight = 40;

let itemBoxHeight = 20;
let contentBoxHeight = optionsHeight * 2;

let checkWidth = quizzWidth - optionsWidth;
//#endregion

let isFinished = false; // test & state bool

function changeColor(target) {
    if (isColorChanged) {
        for (i = 0; i < optionsCheckBox.length; i++) {
            optionsCheckBox[i].setFillStyle(0xfffbfa, 1);
        }
        isColorChanged = false;
    } else {
        target.setFillStyle(0xded8d7, .9);
        isColorChanged = true;
    }
}

function setAnswer(i) {
    indexChosen = i;
    console.log(indexChosen);
    check.y = quizzAnchorY + itemBoxHeight + contentBoxHeight + (optionsHeight * indexChosen);
    check.setVisible(true);
    nextItem.setVisible(true);
}

function nextQuestion() {
    registerAnswer();
    check.setVisible(false);
    nextItem.setVisible(false);
    itemIndex++;
    
    if (itemIndex < items.ipip_scale_fr.length) {
        console.log(items.ipip_scale_fr.length);
        console.log(itemIndex);
        itemContent.setText(items.ipip_scale_fr[itemIndex].content);
        itemIndexBoxText.setText(`ITEM N°${itemIndex + 1}`);
    } else {
        showResults();
    }
}

function registerAnswer() {
    let i = indexChosen;
    console.log(items.ipip_scale_fr[itemIndex].scale);
    if (items.ipip_scale_fr[itemIndex].scale == 1) {
        if(items.ipip_scale_fr[itemIndex].key) {
            s1_scores.extraversion += options.length - i;
            console.log(true);
        } else {
            s1_scores.extraversion += i + 1;
            console.log("false")
        }
    } else if (items.ipip_scale_fr[itemIndex].scale == 2) {
        if(items.ipip_scale_fr[itemIndex].key) {
            s1_scores.amability += options.length - i;
        } else {
            s1_scores.amability += i + 1;
        }
    } else if (items.ipip_scale_fr[itemIndex].scale == 3) {
        if(items.ipip_scale_fr[itemIndex].key) {
            s1_scores.organisation += options.length - i;
        } else {
            s1_scores.organisation += i + 1;
        }
    } else if (items.ipip_scale_fr[itemIndex].scale == 4) {
        if(items.ipip_scale_fr[itemIndex].key) {
            s1_scores.neuroticism += options.length - i;
        } else {
            s1_scores.neuroticism += i + 1;
        }
    } else if (items.ipip_scale_fr[itemIndex].scale == 5) {
        if(items.ipip_scale_fr[itemIndex].key) {
            s1_scores.invention += options.length - i;
        } else {
            s1_scores.invention += i + 1;
        }
    }

    console.log(s1_scores);
    
}

function showResults() {

    console.log("show results");
    isFinished = true;
    itemIndex = 0; // resets

// masks all questions
    itemContent.setVisible(false);
    itemContentBox.setVisible(false);

    itemIndexBox.setVisible(false);
    itemIndexBoxText.setVisible(false);

    for (i=0; i < optionsText.length; i++) {
        optionsText[i].setVisible(false);
        optionsBox[i].setVisible(false);
        optionsCheckBox[i].setVisible(false);
    }

    nextItem.setVisible(false);
    nextItemBox.setVisible(false);
    nextItemText.setVisible(false);

// sorts results by highest
    let s_max = 0;

    // sorts the highest score
    Object.keys(s1_scores).forEach(key => {
        if (s_max < s1_scores[key]) s_max = s1_scores[key];
    });

    // matches score with property
    Object.values(s1_scores).forEach(val => {
        // assigns key property to dominant trait
        if (s_max == s1_scores[val]) dominantTrait = s1_scores[val];
        // beware the present code doesn’t handle
        // scores that are ex-aequo
    });

// display results
    // do something
}

function preload() {
    this.load.json('items', 'data/ipip_50_fr.json');
    this.load.image('bg', 'sprites/background_dusk.jpg');
    this.load.image('check', 'sprites/check.png');
    this.load.image('next', 'sprites/next.png');
    //this.load.font('kh', 'fonts/Kh-Kangrey.ttf' );
}

function create() {
    
    items = this.cache.json.get('items');
    
    let bg = this.add.image(0,0,'bg');
    bg.setOrigin(0,0);
    bg.setScale(.5,.5);

    //#region header
    let bgBox = this.add.rectangle(config.width/2, config.height/2, config.width - 2, config.height - 2);
    bgBox.setStrokeStyle(3, 0x050505);

    let titleBox = this.add.rectangle(quizzOrigin, quizzOrigin, quizzWidth, titleBoxHeight, 0x050505);
    titleBox.setOrigin(0,0);
    titleBox.setStrokeStyle(1, 0x050505);

    let titleText = this.add.text(quizzOrigin + 15, quizzOrigin + 15, "TEST DE PERSONNALITÉ BIG-5", {
        fontFamily: 'courier',
        fontSize: 28,
        color: '#ffffff'
    });

    let descText = this.add.text(quizzOrigin + 40, quizzOrigin + 15 + 28 + 22, "Décrivez-vous comme vous êtes maintenant, \npas comme vous aimeriez être dans le futur. \nEssayez de vous décrire le plus honnêtement possible, \néventuellement en vous comparant aux gens que \nvous connaissez du même âge, genre ou situation.", {
        fontFamily: 'courier',
        fontSize: 16,
        color: '#ffffff'
    });
    //#endregion
    
    //#region question box
    itemIndexBox = this.add.rectangle(quizzAnchorX, quizzAnchorY, quizzWidth, itemBoxHeight, 0x050505);
    itemIndexBox.setOrigin(0,0);
    itemIndexBox.setStrokeStyle(1, 0x050505);
    
    itemIndexBoxText = this.add.text(quizzAnchorX + 3, quizzAnchorY +3, `ITEM N°${itemIndex + 1}`, {
        fontFamily: 'courier',
        fontSize: 14,
        color: '#ffffff'
    });
    
    itemContentBox = this.add.rectangle(quizzAnchorX, quizzAnchorY + itemBoxHeight, quizzWidth, contentBoxHeight, 0xfffbfa);
    itemContentBox.setOrigin(0,0);
    itemContentBox.setStrokeStyle(1, 0x050505);
    
    itemContent = this.add.text(quizzAnchorX + 30, quizzAnchorY + itemBoxHeight + 20, items.ipip_scale_fr[itemIndex].content, {
        fontFamily: 'courier',
        fontSize: 20,
        color: '#050505'
    });
    //#endregion
    
    //#region answers options
    optionsText = [];
    optionsBox = [];
    optionsCheckBox = [];
    for (let i = 0; i < options.length; i++) {

        optionsBox[i] = this.add.rectangle(quizzAnchorX, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight*i, optionsWidth, optionsHeight, 0xfffbfa);
        optionsBox[i].setStrokeStyle(1, 0x050505);
        optionsBox[i].setOrigin(0,0);
        
        optionsText[i] = this.add.text(quizzAnchorX + 60, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight*i + 13, options[i], {
            fontFamily: 'courier',
            fontSize: 16,
            color: '#050505'
        });

        optionsCheckBox[i] = this.add.rectangle(optionsWidth + quizzAnchorX, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight*i, checkWidth, optionsHeight, 0xfffbfa);
        optionsCheckBox[i].setStrokeStyle(1, 0x050505);
        optionsCheckBox[i].setOrigin(0,0);
        optionsCheckBox[i].setInteractive();
        optionsCheckBox[i].on('pointerover', ()=> {changeColor(optionsCheckBox[i])});
        optionsCheckBox[i].on('pointerdown', ()=> {setAnswer(i)});

    }
    //#endregion

    //#region navigation
    nextItemBox = this.add.rectangle(quizzAnchorX, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight * options.length, quizzWidth, optionsHeight, 0x050505);
    nextItemBox.setStrokeStyle(1, 0x050505);
    nextItemBox.setOrigin(0,0);
    
    nextItem = this.add.image(quizzWidth - quizzOrigin + 15, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight * options.length - 3, 'next');
    nextItem.setOrigin(0,0);
    nextItem.setScale(.08,.08);
    nextItem.setTintFill(0xffffff);
    nextItem.setVisible(false);
    nextItem.setInteractive();
    nextItem.on('pointerdown', () => {nextQuestion()});
    
    nextItemText = this.add.text(quizzWidth - checkWidth + quizzOrigin + 80, quizzAnchorY + itemBoxHeight + contentBoxHeight + optionsHeight * options.length + 11, "ITEM SUIVANT", {
        fontFamily: 'courier',
        fontSize: 18,
        color: '#ffffff'
    });
    //#endregion

    check = this.add.image(560, quizzAnchorY + itemBoxHeight + contentBoxHeight, 'check');
    check.setScale(.12,.12);
    //check.setOrigin(0,0);
    check.setVisible(false);
    
}

function update() {

}