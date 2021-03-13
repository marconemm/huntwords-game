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

const selectDifficulty = level => {

};// selectDifficulty(level)

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
 *  DOM manipulation:
 * 
 **/
const wordsTableElem = document.getElementById("wordsTable");
const raffledWordsList = raffleWords(3);
const wordsTable = createTable(10);

const renderHTML = () => {

    const wordsToHunt = document.getElementById("wordsToHunt");

    for (let i = 0; i < raffledWordsList.length; i++) {
        const li = document.createElement("li");
        li.dataset.id = raffledWordsList[i].id;
        li.innerText = raffledWordsList[i].value;
        wordsToHunt.appendChild(li);
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

            wordsTableElem.appendChild(letterContainerEl);
        }

    }
};// renderHTML()

renderHTML();
let seekedWord = "";

const checkResult = () => {

    const score = raffledWordsList.reduce((accumulator, word) => {
        if (word.isLocated)
            accumulator++;

        return accumulator;
    }, 0);

    if (score === raffledWordsList.length)
        return true;

    return false;

};// checkResult()

wordsTableElem.addEventListener("click", evt => {
    const wordsToHuntListElem = document.querySelectorAll("#wordsToHunt > li");
    const target = evt.target;

    if (!target.classList.contains("selected")) {
        target.classList.add("selected");
        seekedWord += target.dataset.letter;

        const wordLocated = raffledWordsList.find(raffleWrod => raffleWrod.value === seekedWord);

        if (wordLocated && !wordLocated.isLocated) {

            wordLocated.isLocated = true;

            wordsToHuntListElem.forEach(word => {
                if (word.dataset.value === wordLocated.value)
                    word.classList.add("located")
            });

            seekedWord = "";

            if (checkResult()) {
                const endScreenElem = document.querySelector('div[data-js="endScreen"]');
                endScreenElem.classList.toggle("hidden");
            }
        }
    }
    else {

        target.classList.remove("selected");
        seekedWord = seekedWord.slice(0, seekedWord.length - 1);
    }
});

