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

const fillTable = () => {
    const table = createTable(10);
    const raffledWordsList = raffleWords(3);
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
        const splitedWord = raffledWordsList[raffle].split("");

        table[line] = splitedWord;
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

    console.log(table);

}// fillTable()

console.log(fillTable());
// console.log((getRandomValue(9) - 1) + 1);
// console.log(createTable(100));