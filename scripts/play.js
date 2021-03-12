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

        const word = {
            isLocated: false,
            value: wordsColectionList[raffle]
        };

        result.push(word);
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
const table = createTable(10);

const renderHTML = () => {
    const wordsToHunt = document.getElementById("wordsToHunt");

    for (let i = 0; i < raffledWordsList.length; i++) {
        const li = document.createElement("li");
        li.dataset.value = raffledWordsList[i].value;
        li.innerText = raffledWordsList[i].value;
        wordsToHunt.appendChild(li);
    }

    fillTable(table, raffledWordsList);

    const tableBody = document.getElementById("wordsTable");
    for (let row = 0; row < table.length; row++) {

        const tableRow = table[row];

        for (let column = 0; column < tableRow.length; column++) {
            const letterContainer = document.createElement("div");
            letterContainer.dataset.letter = tableRow[column];
            letterContainer.classList.add("displayFlex");
            letterContainer.classList.add("letterContainer");

            letterContainer.innerText = tableRow[column];
            tableBody.appendChild(letterContainer);
        }

    }




};// renderHTML()

renderHTML();
let seekedWord = "";
const selectedLettersList = [];
const wordsToHuntListElem = document.querySelectorAll("#wordsToHunt > li");

wordsTableElem.addEventListener("click", evt => {
    const target = evt.target;

    if (!target.classList.contains("selected")) {
        target.classList.add("selected");
        seekedWord += target.dataset.letter;

        const wordLocated = raffledWordsList.find(raffleWrod => raffleWrod.value === seekedWord);

        if (!wordLocated.isLocated) {

            wordLocated.isLocated = true;

            wordsToHuntListElem.forEach(word => {
                if (word.dataset.value === wordLocated.value)
                    word.classList.add("located")
            });

            seekedWord = "";
        }
    }
    else {

        target.classList.remove("selected");
        seekedWord = seekedWord.slice(0, seekedWord.length - 1);
    }

    // console.log(raffledWordsList);
    // console.log(selectedLettersWord);
});

