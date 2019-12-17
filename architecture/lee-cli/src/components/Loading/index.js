/**
 * Created by haiwang on 2017/6/8.
 * Description: Loading animation by css
 */
import React, { Component } from 'react'
import './Loading.css'

export class Loading extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...props
    }
  }
  render () {
    return (
      <div className="LoadingContainer">
        <div className="loadingPointGroup">
          <div className="loading-point loading-point-1" />
          <div className="loading-point loading-point-2" />
          <div className="loading-point loading-point-3" />
          <div className="loading-point loading-point-4" />
          <div className="loading-point loading-point-5" />
          <p>{this.state.loadingText || '加载中...'}</p>
        </div>
      </div>
    )
  }
}
export default Loading
