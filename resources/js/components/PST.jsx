import React, {Component} from 'react'
import moment from 'moment/moment'

class PST extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            date: new Date() ,
        }
    }

    tick() {
        this.setState({ date: new Date() })
    }

    // componentDidMount() {
    //     this.interval = setInterval(this.tick, 1000)
    // }

    componentDidMount() {
        this.interval = setInterval(this.tick.bind(this), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <div id="foot" className="cursor-default min-w-[305px]">
                {moment(this.state.date).format('dddd, LL, h:mm:ss A')}
            </div>
        )
    }
}

export default PST