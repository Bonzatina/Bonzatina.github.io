export const encrypt_code = `
    const formatted = text.replace(/ /g, '_').split('');
    const number_of_rows = key.length;
    const rows = []
    for (let i = 0; i < key.length; i++) {
        rows[i] = []
    }
    formatted.map((el, ind, arr) => {
        const cycle = number_of_rows * 2 - 2;
        if (ind < arr.length) {
            if (ind % cycle < number_of_rows) {
                rows[ind % cycle].push(el)
            }
            else {
                rows[cycle - ind % cycle].push(el)
            }
        }
    });
`;


export const recursive_ecrypt = `
const recursiveDecrypt = (plain_text, cipherRows, firstRow = true) => {
    const totalLength = [].concat.apply([], cipherRows).join('').length;
    console.log(totalLength)
    if (firstRow) {
        for (let i = 0; i < cipherRows.length; i++) {
            plain_text.push(cipherRows[i][0])
            cipherRows[i] = cipherRows[i].slice(1)
        }
    }
    else {
        const tmpSlicedCipherRows = cipherRows.slice(1);
        for (let i = 0; i < tmpSlicedCipherRows.length; i++) {
            tmpSlicedCipherRows[i][0] && plain_text.push(tmpSlicedCipherRows[i][0])
            cipherRows[i + 1] = cipherRows[i + 1] && cipherRows[i + 1].slice(1)
        }
    }
    if (totalLength > 0) {
        return recursiveDecrypt(plain_text, cipherRows.reverse(), false)
    }
};`;

export const slice_cipher_ext =`
const sliceCipherText = (cipher_text, key) => {
    const result = [];
    const cycle = key.length * 2 - 2;
    let rowsLength = [];
    const firstRowLength = Math.floor(cipher_text.length / cycle);

    const middleRowsLength = Math.floor(cipher_text.length / cycle) * 2;
    const numberOfMiddleRows = key.length - 2;

    rowsLength.push(firstRowLength);
    for (let i = 0; i < numberOfMiddleRows; i++) {
        rowsLength.push(middleRowsLength)
    }
    if (cipher_text.length % cycle) {
        rowsLength = rowsLength.map((el, ind) => {
            if (ind < cipher_text.length - 1) {
                el += 1;
            }
            return rowsLength[ind] = el;
        })
    }
    const lastRowLength = cipher_text.length - rowsLength.reduce((acc, currentValue)
        => acc + currentValue);
    rowsLength.push(lastRowLength);

    const sortingKeys = key.split('');
    const sortedRowsLength = [];
    for (let i = 0; i < sortingKeys.length; i++) {
        sortedRowsLength[i] = rowsLength[sortingKeys[i] - 1];
    }


    sortedRowsLength.reduce((acc, currentValue) => {
        // console.log(acc)
        const row = cipher_text.slice(acc, acc + currentValue);
        // console.log(row)
        result.push(row);
        return acc + currentValue
    }, 0);

    const sortedResult = [];
    for (let i = 0; i < sortingKeys.length; i++) {
        sortedResult[sortingKeys[i] - 1] = result[i];
    }

    return sortedResult;
};
`;
