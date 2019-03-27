import React, {Component} from 'react';
import './App.css';
import {encrypt, validate, decrypt} from './RedefenceScripts'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            encrypt: {
                task_text: '',
                result_text: '',
                key: '',
            },
            decrypt: {
                task_text: '',
                result_text: '',
                key: '',
            },
            error: false
        };
        this.updatePlainText = this.updatePlainText.bind(this);
        this.updateCipherText = this.updateCipherText.bind(this);
        this.cryptHandler = this.cryptHandler.bind(this);
        this.updatePlainKey = this.updatePlainKey.bind(this);
        this.updateCipherKey = this.updateCipherKey.bind(this);
    }

    updatePlainText(event) {
        this.setState({
            encrypt: {
                ...this.state.encrypt,
                task_text: event.target.value
            }
        });
    }

    updateCipherText(event) {
        this.setState({
            decrypt: {
                ...this.state.decrypt,
                task_text: event.target.value
            }
        });
    }

    updatePlainKey(event) {
        this.setState({
            encrypt: {
                ...this.state.encrypt,
                key: event.target.value
            }
        });
    }

    updateCipherKey(event) {
        this.setState({
            decrypt: {
                ...this.state.decrypt,
                key: event.target.value
            }
        });
    }

    cryptHandler(type) {
        const data = {text: this.state[type].task_text, key: this.state[type].key};
        // console.log(data)
        const validationResult = validate(data);
        if (!validationResult) {
            const crypt = type === 'encrypt' ? encrypt : decrypt;
            const cryptText = crypt(this.state[type].task_text, this.state[type].key);
            console.log(cryptText)
            this.setState({
                [type]: {
                    ...this.state[type],
                    result_text: cryptText,
                    error: false
                }
            })
        }
        else {
            this.setState({
                [type]: {
                    ...this.state[type],
                    error: validationResult
                },
            })
        }
    }

    renderZigZag(result_text, key) {
        const divs = [];
        const sortingKeys = key.split('');
        const sortedRows = [];
        for (let i = 0; i < sortingKeys.length; i++) {
            sortedRows[sortingKeys[i] - 1] = result_text[i];
        }
        console.log(sortedRows)
        sortedRows.map((el, ind_parent, arr_parent) => {
            const divsRow = [];
            el.map((el_child, ind_child, arr_child) => {
                const cycle = (arr_parent.length * 2 - 2) - 1;
                console.log(ind_child % 2);
                if (ind_child === 0) {
                    // console.log(ind_child, el_child)
                    for (let i = 0; i < ind_parent; i++) {
                        divsRow.push(<div className="zigzag_cell"></div>)
                    }
                    divsRow.push(<div className="zigzag_cell">{el_child}</div>)
                }
                else if (ind_child % 2 && ind_parent !== arr_parent.length - 1) {
                    // console.log('TYT');
                    for (let i = 0; i < cycle - ind_parent * 2; i++) {
                        divsRow.push(<div className="zigzag_cell"></div>)
                    }

                    divsRow.push(<div className="zigzag_cell">{el_child}</div>)
                }
                else if (ind_child % 2 === 0 && ind_parent === 0) {
                    for (let i = 0; i < cycle - ind_parent * 2; i++) {
                        divsRow.push(<div className="zigzag_cell"></div>)
                    }
                    divsRow.push(<div className="zigzag_cell">{el_child}</div>)
                }
                else {
                    for (let i = 0; i < ind_parent * 2 - 1; i++) {
                        divsRow.push(<div className="zigzag_cell"></div>)
                    }
                    divsRow.push(<div className="zigzag_cell">{el_child}</div>)
                }
                if (ind_child === arr_child.length - 1) {
                    const totalLength = [].concat.apply([], result_text).join('').length;
                    // console.log('Round', totalLength, divsRow.length)
                    for (let i = divsRow.length; i < totalLength; i++) {
                        divsRow.push(<div className="zigzag_cell"></div>)
                    }
                }
            });
            divs.push(<div className="zigzag_row">{divsRow}</div>)
        });
        return divs
    }

    render() {
        return (
            <div className="App">
                <header className="main">

                    <div className="encrypt_block">
                        <p>read this please</p>
                        <input placeholder="Type plain text" value={this.state.encrypt.task_text}
                               onChange={this.updatePlainText}/>
                        <input placeholder="Type key" value={this.state.encrypt.key} onChange={this.updatePlainKey}/>
                        <button onClick={() => this.cryptHandler('encrypt')}>Encrypt</button>
                        {this.state.encrypt.error && <div className="error">{this.state.encrypt.error}</div>}
                        <div className="result_text">{this.state.encrypt.result_text}</div>

                        <div className="zigzag_text">
                            {this.state.encrypt.result_text && this.renderZigZag(this.state.encrypt.result_text, this.state.encrypt.key)}
                        </div>

                        <div>
              <pre>{`
    const formatted = text.replace(/ /g, '_').split('');
    const number_of_rows = key.length;
    const rows = []
    for (let i = 0; i < key.length; i++) {
        rows[i] = []
    }
    formatted.map((el, ind, arr) => {
        const cycle = number_of_rows * 2 - 2;
        if (ind < arr.length && ind % cycle < cycle) {
            if (ind % cycle < number_of_rows) {
                rows[ind % cycle].push(el)
            }
            else {
                rows[cycle - ind % cycle].push(el)
            }
        }
    });
`}</pre>
                        </div>

                    </div>
                    <div className="decrypt_block">
                        <p className="false_dot"> .</p>
                        <input placeholder="Type cipher text" value={this.state.decrypt.task_text}
                               onChange={this.updateCipherText}/>
                        <input placeholder="Type key" value={this.state.decrypt.key} onChange={this.updateCipherKey}/>
                        <button onClick={() => this.cryptHandler('decrypt')}>Decrypt</button>
                        {this.state.decrypt.error && <div className="error">{this.state.decrypt.error}</div>}
                        <div className="result_text">{this.state.decrypt.result_text}</div>
                        <div className="zigzag_text">

                        </div>

                        <div>
              <pre>{`
const recursiveDecrypt = (plain_text, cipherRows, count) => {
    if (count === 0) {
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
    if (count < 7) {
        return recursiveDecrypt(plain_text, cipherRows.reverse(), count + 1)
    }
};


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
`}</pre>
                        </div>

                        <div>

                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
