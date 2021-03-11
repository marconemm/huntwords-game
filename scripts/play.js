import wordsColectionList from "./wordsDB.js";

const raffledWords = [];
for (let i = 0; i < 3; i++) {
    const raffle = Math.round((Math.random() * 1000));
    raffledWords.push(wordsColectionList[raffle])
}

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


}
const splitedWord = raffledWords[0].split("");

// console.log(createTable(100));
console.log(splitedWord);