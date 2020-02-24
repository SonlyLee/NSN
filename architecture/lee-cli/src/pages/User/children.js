import React from 'react';

class Children extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 'MJ116',
            arr: 0,
            messages: [],   //用于保存子div
        }
        this.handle = this.handle.bind(this)
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { arr } = nextProps
        //   当传入的arr发生变化的时候，更新state
        if (arr !== prevState.arr) {
            return {
                arr
            }
        }
        // 否则，对于state不进行任何操作
        return null
    }
    componentDidMount() {
        for (let i = 0; i < 20; i++) {
            this.handleMessage()
        }
        this.timeID = window.setInterval(() => {
            if (this.state.messages.length > 200) {
                window.clearInterval(this.timeID)
                return
            } else {
                // this.handleMessage()
            }
        }, 1000)
    }
    componentWillUnMount() {
        window.clearInterval(this.timeID)
    }
    getSnapshotBeforeUpdate() {
        return this.rootNode.scrollHeight
    }
    componentDidUpdate(preProps, preState, preScrollHeight) {
        console.log(this.rootNode.scrollHeight,this.rootNode.scrollTop,preScrollHeight)
        const curScrollTop = this.rootNode.scrollTop
        if (curScrollTop < 5) return
        this.rootNode.scrollTop = curScrollTop + (this.rootNode.scrollHeight - preScrollHeight)
        // 加上增加的div高度，相当于不动
    }
    handle() {
        this.setState({
            count: '你知道的'
        })
    }
    handleMessage() {//用于增加msg
        this.setState(pre => ({
            messages: [`msg:${pre.messages.length}`, ...pre.messages]
        }))
    }
    render() {
        console.log(1)
        return (
            <div>
                {this.state.arr}
                {this.state.count}
                <button onClick={this.handle}>children</button>
                <br />
                <div style={{height:'100px',width:'200px',overflow:'auto'}} ref={node => (this.rootNode = node)} >
                    {this.state.messages.map(msg => (
                        <div>{msg} </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Children;