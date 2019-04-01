import React, {Component} from 'react';
import './App.css';
import {encrypt, validate, decrypt} from './RedefenceScripts'
import {encrypt_code, recursive_ecrypt, slice_cipher_ext } from './code_examples'

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
            error: false,
            zigzag_text: ''
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
            // console.log(cryptText)
            this.setState({
                [type]: {
                    ...this.state[type],
                    result_text: cryptText,
                    error: false
                }
            }, () => this.setState({zigzag_text: this.renderZigZag(this.state.encrypt.result_text, this.state.encrypt.key)}))
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

        // console.log(sortedRows)
        sortedRows.map((el, ind_parent, arr_parent) => {
            const divsRow = [];
            el.map((el_child, ind_child, arr_child) => {
                const cycle = (arr_parent.length * 2 - 2) - 1;
                // console.log(ind_child % 2);
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
                <div className="sample">
                    <p>read this please</p>
                </div>
                <div className="main">
                    <div className="encrypt_block">

                        <input placeholder="Type plain text" value={this.state.encrypt.task_text}
                               onChange={this.updatePlainText}/>
                        <input placeholder="Type key" value={this.state.encrypt.key} onChange={this.updatePlainKey}/>
                        <button onClick={() => this.cryptHandler('encrypt')}>Encrypt</button>
                        {this.state.encrypt.error && <div className="error">{this.state.encrypt.error}</div>}
                        <div className="result_text">{this.state.encrypt.result_text}</div>

                        <div className="zigzag_text">
                            {this.state.zigzag_text && this.state.zigzag_text}
                        </div>
                    </div>
                    <div className="decrypt_block">
                        <input placeholder="Type cipher text" value={this.state.decrypt.task_text}
                               onChange={this.updateCipherText}/>
                        <input placeholder="Type key" value={this.state.decrypt.key} onChange={this.updateCipherKey}/>
                        <button onClick={() => this.cryptHandler('decrypt')}>Decrypt</button>
                        {this.state.decrypt.error && <div className="error">{this.state.decrypt.error}</div>}
                        <div className="result_text">{this.state.decrypt.result_text}</div>
                        <div className="zigzag_text">
                        </div>
                    </div>
                </div>
                <div className="code_examples">
                    <div>
                        <pre>{encrypt_code}</pre>
                    </div>
                    <div>
                        <pre>{recursive_ecrypt}</pre>
                        <pre>{slice_cipher_ext}</pre>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
