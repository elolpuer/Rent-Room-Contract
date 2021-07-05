import React from 'react'

class Add extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            description: '',
            price: 0,
            key: 0
        }
        this.handleTextName = this.handleTextName.bind(this)
        this.handleTextDescription = this.handleTextDescription.bind(this)
        this.handlePrice = this.handlePrice.bind(this)
        this.handleKey = this.handleKey.bind(this)
    }

    handleTextName(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleTextDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    handleKey(event) {
        this.setState({
            key: event.target.value
        })
    }

    handlePrice(event) {
        this.setState({
            price: event.target.value
        })
    }

    render(){
        return(
            <form onSubmit={() => this.props.submitForm(this.state.name, this.state.description, this.state.key,this.state.price)}>
                <span>Name</span><input value={this.state.name} onChange={this.handleTextName} required/><br/>
                <span>Description</span><input value={this.state.description} onChange={this.handleTextDescription} required/><br/>
                <span>Key</span><input value={this.state.key} onChange={this.handleKey} required/><br/>
                <span>Month Price в Wei</span><input placeholder="Стоимость" value={this.state.price} onChange={this.handlePrice} required/>
                <span>ETH:{this.state.price/1000000000000000000}</span>
                <br/>
                <button className="btn btn-success" type="submit">Rent Out</button>
            </form>
        )
    }
}

export default Add