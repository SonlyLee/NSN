// import '@babel/polyfill'

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './../css/main.scss'
class Index extends Component {
    render() {
        return <h1>Hello,webpack.7878</h1>
    }
}
ReactDOM.render(<Index />, window.document.getElementById('app'))
// "dev": "nodemon --watch webpack.config.js --exec \"webpack-dev-server\"",
    // "build": "webpack --mode production",