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
        result.push(wordsColectionList[raffle])
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
        table[line] = raffledWordsList[raffle].split("");

    }

    for (let line = 0; line < table.length; line++) {
        const word = table[line];
        for (let column = 0; column < table.length; column++) {
            if (word[column] === "")
                word[column] = getRandomLetter();
            else if (word.length < table.length) { //in case of if the raffle word size is smaller than the table size:
                for (let letterIndex = word.length; letterIndex < table.length; letterIndex++)
                    word[letterIndex] = getRandomLetter();
            }
        }
    }
    // console.log(table);
};// fillTable(raffledWordsList)
// console.log(fillTable());

/**
 * 
 *  DOM manipulation:
 * 
 **/

const renderHTML = () => {
    const wordsToHunt = document.getElementById("wordsToHunt");
    const raffledWordsList = raffleWords(3);
    const table = createTable(10);

    for (let i = 0; i < raffledWordsList.length; i++) {
        const li = document.createElement("li");
        li.innerText = raffledWordsList[i];
        wordsToHunt.appendChild(li);
    }

    fillTable(table, raffledWordsList);

    const tableBody = document.getElementById("wordsTable");
    for (let row = 0; row < table.length; row++) {

        const tableRow = table[row];

        for (let column = 0; column < tableRow.length; column++) {
            const letterContainer = document.createElement("div");
            letterContainer.classList.add("displayFlex");
            letterContainer.classList.add("letterContainer");

            letterContainer.innerText = tableRow[column];
            tableBody.appendChild(letterContainer);
        }

    }




};// renderHTML()
renderHTML();
