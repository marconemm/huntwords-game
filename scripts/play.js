import { wordsColectionList, lettersCollection } from "./wordsDB.js";

const getRandomValue = limit => {
    // console.log(limit);
    return Math.round((Math.random() * limit));
}

const getRandomValueIntoList = array =>
    (getRandomValue(array.length - 1) - 1) + 1; // Getting a random line between 0 and ("table" length - 1).

const raffleWords = (qty) => {

    const result = [];
    const wordsToHuntCountEl = document.querySelector('span[data-js="word-count"]');

    for (let i = 0; i < qty; i++) {
        const raffle = getRandomValue(wordsColectionList.length);
        result.push(wordsColectionList[raffle]);
    }

    wordsToHuntCountEl.innerText = qty;
    return result;
};// raffleWords(qty)

const createTable = size => {
    const result = [];

    for (let line = 0; line < size; line++) {
        const columList = [];
        for (let column = 0; column < size; column++) {
            columList.push("");
        }
        result.push(columList);
    }

    return result;
};// createTable(size)

const getRandomLetter = () => {
    const randomValue = getRandomValueIntoList(lettersCollection);

    return lettersCollection[randomValue];
};//getRandomLetter()

// const selectDifficulty = level => {
/**
 * 
 *  (to be implemented...)
 * 
 *  */
// };// selectDifficulty(level)

const insertWordsInTable = (table, raffledWordsList) => {
    const raffledLinesList = [];

    while (raffledLinesList.length < raffledWordsList.length) { //ensures that the "lines raffling" never will contains double values.
        const raffledLine = getRandomValueIntoList(table);

        if (raffledLinesList.includes(raffledLine))
            continue;
        else
            raffledLinesList.push(raffledLine);
    }

    for (let raffle = 0; raffle < raffledWordsList.length; raffle++) {

        const line = raffledLinesList[raffle];
        table[line] = raffledWordsList[raffle].value.split("");
        table[line] = table[line].map(letter => {

            return { wordId: raffledWordsList[raffle].id, value: letter };

        });
    }
};// insertWordsInTable(table, raffledWordsList)

const fufillTable = (table) => {

    for (let row = 0; row < table.length; row++) {

        const tableRow = table[row];

        for (let column = 0; column < table.length; column++) {

            if (tableRow[column] === "")
                tableRow[column] = getRandomLetter();

            else if (tableRow.length < table.length) { //in case of if the raffle word size is smaller than the table size:

                do {
                    if (getRandomValue(tableRow.length) % 2 === 0)
                        tableRow.push(getRandomLetter()); // inserts at end.
                    else
                        tableRow.unshift(getRandomLetter()); // inserts at begin.

                } while (tableRow.length < table.length);
            }
            else
                break;
        }
    }
    // console.log(table);
};// fillTable(raffledWordsList)

const removeChildNodes = (element) => {

    while (element.lastChild) {

        if (element.lastChild.dataset && element.lastChild.dataset.js === "endScreen")
            return;

        element.removeChild(element.lastChild);
    }
}// removeChildNodes(element)

/**
 * 
 *  DOM manipulation - BEFORE RENDERING:
 * 
 **/
const raffledWordsList = isMobile() ? raffleWords(4) : raffleWords(20);
const btnRestartEl = document.querySelector('button[data-js="restart"]');
const btnShadowEl = document.querySelector('div[data-js="btn__shadow"]');

btnRestartEl.addEventListener("mouseenter", () => {
    btnShadowEl.classList.add("btn__shadow--show");
});

btnRestartEl.addEventListener("mouseleave", () => {
    btnShadowEl.classList.remove("btn__shadow--show");
});

btnRestartEl.addEventListener("click", () => {
    location.reload();
});


function isMobile() {

    if (window.outerWidth <= 800)
        return true;

    return false;

};//isMobile()

const renderHTML = () => {

    const wordsTable = isMobile() ? createTable(14) : createTable(40);
    const wordsToHuntEl = document.getElementById("wordsToHunt");
    const wordsTableEl = document.getElementById("wordsTable");

    removeChildNodes(wordsToHuntEl);
    removeChildNodes(wordsTableEl);

    if (isMobile()) {
        wordsTableEl.classList.add("displayGrid--mobile");
        wordsTableEl.classList.remove("displayGrid--desktop");
    } else {
        wordsTableEl.classList.add("displayGrid--desktop");
        wordsTableEl.classList.remove("displayGrid--mobile");
    }

    for (let i = 0; i < raffledWordsList.length; i++) {
        const li = document.createElement("li");
        li.dataset.id = raffledWordsList[i].id;
        li.dataset.islocated = raffledWordsList[i].isLocated;
        li.innerText = raffledWordsList[i].value;
        wordsToHuntEl.appendChild(li);
    }

    insertWordsInTable(wordsTable, raffledWordsList);
    fufillTable(wordsTable);

    for (let row = 0; row < wordsTable.length; row++) {

        const tableRow = wordsTable[row];
        // console.log(tableRow);

        for (let column = 0; column < tableRow.length; column++) {

            const letter = tableRow[column];
            const letterContainerEl = document.createElement("div");
            // console.log(letter);

            if (letter.wordId)
                letterContainerEl.dataset.word = letter.wordId;

            // letterContainerEl.classList.add("displayFlex");
            letterContainerEl.classList.add("letterContainer");
            letterContainerEl.innerText = letter.value;

            wordsTableEl.appendChild(letterContainerEl);
        }
    }
};// renderHTML()

renderHTML();

let storedTimeStamp = 0;
window.addEventListener("resize", evt => {

    const delay = Math.abs(Math.round(storedTimeStamp - evt.timeStamp));

    if ((delay > 10000))  // when the difference between the events triggered is greater than 10s.
        location.reload();


    storedTimeStamp = evt.timeStamp;
});

/**
 * 
 *  DOM manipulation - AFTER RENDERING:
 * 
 **/
const letterContainers = document.querySelectorAll("#wordsTable > div");

const fetchWord = (pickedLetters, wordElId) => {

    let result;

    if (!wordElId)
        return undefined;

    const wordsToHuntList = document.querySelectorAll("#wordsToHunt > li");
    // console.log(wordsToHuntList);

    wordsToHuntList.forEach(wordEl => {

        if (Number(wordEl.dataset.id) === wordElId) {

            if (pickedLetters.length === wordEl.innerText.length) {

                let wordLettersList = wordEl.innerText.toLowerCase();
                pickedLetters = pickedLetters.toLowerCase();

                wordLettersList = wordLettersList.split("");
                pickedLetters = pickedLetters.split("");

                wordLettersList = wordLettersList.sort();
                pickedLetters = pickedLetters.sort();

                wordLettersList = wordLettersList.join("");
                pickedLetters = pickedLetters.join("");

                if (pickedLetters === wordLettersList) {
                    raffledWordsList.forEach(word => {
                        if (word.id === wordElId) {

                            word.isLocated = true;
                            wordEl.dataset.islocated = word.isLocated;
                            wordEl.classList.add("located");
                            result = word.value;
                        }
                    });
                }
            }
        }
    });

    return result;
};// fetchWord(pickedLetters, wordId)

// const testLog = (isLocated, pickedLetters) => {

//     if (isLocated) {
//         console.log(`Legal! Voc?? encontrou: "${isLocated}"!`);
//     } else
//         console.log(`Voc?? selecionou: "${pickedLetters}". Continue procurando...`);

// }; // testLog(isLocated, pickedLetters)

const checkResult = () => {
    const score = raffledWordsList.reduce((acc, word) => {
        if (word.isLocated)
            acc++;

        return acc;
    }, 0);

    if (score === raffledWordsList.length)
        return true;

    return false;

};// checkResult()

/**
 * 
 *  DOM manipulation - EVENT LISTENERS:
 * 
 **/

let pickedLetters = "";

letterContainers.forEach(container => {
    // console.log(container);

    container.addEventListener("click", () => {

        if (!container.classList.contains("selected")) {

            pickedLetters += container.innerText;

            const wordId = parseInt(container.dataset.word);
            const isLocated = fetchWord(pickedLetters, wordId);

            if (isLocated) {

                if (checkResult()) {
                    const endScreenEl = document.querySelector('div[data-js="endScreen"]');
                    endScreenEl.classList.remove("hidden");
                    endScreenEl.focus();
                }

                pickedLetters = "";
            }

            if (container.dataset.js !== "endScreen")
                container.classList.add("selected");

        }
        else {

            const index = pickedLetters.indexOf(container.innerText);

            pickedLetters = pickedLetters.split("");
            pickedLetters[index] = "";
            pickedLetters = pickedLetters.join("");
            // console.log(pickedLetters);

            container.classList.remove("selected");
        }
    });
});
