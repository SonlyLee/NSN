import React,{Component} from 'react'
import "./../assets/count.scss"

export default class Count extends Component{
    constructor(props){
        super(props)
        this.state = {
            count: 0
        }
    }
    handleClick(){
        this.setState({
            count: ++this.state.count
        })
    }
    componentDidMount(){
        console.log(11111111111111)
    }
    render(){
        return(
            <div>
                当前count值: {this.state.count} <br/>
                <button className="borBtn" onClick={()=>this.handleClick()}>增加1</button>
            </div>
        )
    }
}