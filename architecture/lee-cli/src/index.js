import React from "react"
import ReactDom from "react-dom"
import { HashRouter as Router } from 'react-router-dom'
import App from "./pages/App"

ReactDom.render(
    <Router hashType="noslash">
        <App/>
    </Router>    
    ,
    document.getElementById("root")
)