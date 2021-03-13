import { wordsColectionList, lettersCollection } from "./wordsDB.js";

const getRandomValue = limit => {
    // console.log(limit);
    return Math.round((Math.random() * limit));
}

const getRandomValueIntoList = array =>
    (getRandomValue(array.length - 1) - 1) + 1; // Getting a random line between 0 and ("table" length - 1).

const raffleWords = (qty) => {
    const result = [];
    for (let i = 0; i < qty; i++) {
        const raffle = getRandomValue(wordsColectionList.length);

        // const word = {
        //     isLocated: false,
        //     value: wordsColectionList[raffle]
        // };

        // result.push(word);
        result.push(wordsColectionList[raffle]);

    }
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

const fillTable = (table, raffledWordsList) => {
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

    for (let row = 0; row < table.length; row++) {

        for (let column = 0; column < table.length; column++) {

            if (table[row][column] === "")
                table[row][column] = getRandomLetter();

            else if (table[row].length < table.length) { //in case of if the raffle word size is smaller than the table size:

                do {
                    if (getRandomValue(table[row].length) % 2 === 0)
                        table[row].push(getRandomLetter());
                    else
                        table[row] = [getRandomLetter(), ...table[row]];

                } while (table[row].length < table.length);
            }
            else
                break;
        }
    }
    // console.log(table);
};// fillTable(raffledWordsList)

/**
 * 
 *  DOM manipulation - BEFORE RENDER:
 * 
 **/
const raffledWordsList = raffleWords(3);
const btnRestartEl = document.querySelector('button[data-js="restart"]');

btnRestartEl.addEventListener("click", () => {
    location.reload(); 
});

const renderHTML = () => {

    const wordsTable = createTable(10);
    const wordsTableEl = document.getElementById("wordsTable");
    const wordsToHuntEl = document.getElementById("wordsToHunt");

    for (let i = 0; i < raffledWordsList.length; i++) {
        const li = document.createElement("li");
        li.dataset.id = raffledWordsList[i].id;
        li.dataset.islocated = raffledWordsList[i].isLocated;
        li.innerText = raffledWordsList[i].value;
        wordsToHuntEl.appendChild(li);
    }

    fillTable(wordsTable, raffledWordsList);

    for (let row = 0; row < wordsTable.length; row++) {

        const tableRow = wordsTable[row];
        // console.log(tableRow);

        for (let column = 0; column < tableRow.length; column++) {

            const letter = tableRow[column];
            const letterContainerEl = document.createElement("div");
            // console.log(letter);

            if (letter.wordId)
                letterContainerEl.dataset.word = letter.wordId;

            letterContainerEl.classList.add("displayFlex");
            letterContainerEl.classList.add("letterContainer");
            letterContainerEl.innerText = letter.value;

            wordsTableEl.appendChild(letterContainerEl);
        }

    }
};// renderHTML()

renderHTML();
/**
 * 
 *  DOM manipulation - AFTER RENDER:
 * 
 **/
const letterContainers = document.querySelectorAll("#wordsTable > div");
// let seekedWord = "";

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

const testLog = (isLocated, pickedLetters) => {

    if (isLocated) {
        console.log(`Legal! Você encontrou: "${isLocated}"!`);
    } else
        console.log(`Você selecionou: "${pickedLetters}". Continue procurando...`);

}; // testLog(isLocated, pickedLetters)

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
                }

                pickedLetters = "";
            }

            container.classList.add("selected");

        }
        else {

            const index = pickedLetters.indexOf(container.innerText);

            pickedLetters = pickedLetters.split("");
            pickedLetters[index] = "";
            pickedLetters = pickedLetters.join("");
            console.log(pickedLetters);

            container.classList.remove("selected");
        }
    });
});


