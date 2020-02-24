import React from 'react';
import Children from './children.js'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      num: 0,
      arr: 5
    }
    this.handle = this.handle.bind(this)
    this.handle2 = this.handle2.bind(this)
  }
  handle (){
    this.setState({
      num: this.state.num+2
    })
  }
  handle2 (){
    this.setState({
      arr: ++this.state.arr
    })
  }
  render() {
    return (
      <div>
        content<br/>
          {this.state.num}
        <button onClick={this.handle}>farther</button>
        <button onClick={this.handle2}>farther2</button>
        <Children arr={this.state.arr} />
      </div>
    )
  }
}

export default User;