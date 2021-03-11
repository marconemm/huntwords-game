import { wordsColectionList, lettersCollection } from "./wordsDB.js";

const getRandomValue = limit =>
    Math.round((Math.random() * limit));

const getRandomValueIntoList = array =>
    (getRandomValue(array.length - 1) - 1) + 1; // Getting a random line between 0 and ("table" length - 1).

const raffleWords = (qty) => {
    const result = [];
    for (let i = 0; i < qty; i++) {
        const raffle = getRandomValue(1000);
        result.push(wordsColectionList[raffle])
    }
    return result;
}// raffleWords(qty)

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
}// createTable(size)

const selectDifficulty = level => {

}// selectDifficulty(level)

const fillTable = (table, raffledWordsList) => {
    // const table = createTable(10);
    // const raffledWordsList = raffleWords(3);
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
        for (let column = 0; column < word.length; column++) {
            if (word[column] === "") {
                const randomValue = getRandomValueIntoList(lettersCollection);
                word[column] = lettersCollection[randomValue];
            }
        }
    }
    // console.log(table);
}// fillTable(raffledWordsList)
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




}// renderHTML()
renderHTML();
