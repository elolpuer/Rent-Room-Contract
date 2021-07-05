import React from 'react'

class AllRooms extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            monthRent: 0
        }
        this.changeMonthRent = this.changeMonthRent.bind(this)
    }

    async changeMonthRent(event) {
        this.setState({
            monthRent: event.target.value
        })
    }

    render(){
        //Если существуют комнаты/квартиры, тогда показываем, а иначе пишем что 'ничего нет'
        if (this.props.roomsLength >= 1) {
            return (
                <ul className="roomsList">
                    {
                    //Проходимся по всему массиву
                    this.props.rooms.map((room) => {
                            //Если комнаты/квартиры сданы, то их не показываем
                            if (room.Rented){
                                return null;
                            } else {
                                return (              
                                    <li>
                                        <form onSubmit={() => this.props.clickRentRoom(room.ID, room.Price, this.state.monthRent)}>
                                        <hr/>
                                        <p>Name:{room.Name}</p>	
                                        <p>Description: {room.Description}</p>
                                        <p>Owner:{room.Owner}</p>	
                                        <p>RentOwner:{room.RentOwner}</p>	
                                        <p>Price: {room.Price}</p>
                                        <p>Deposit = 1 monthPrice, that means to all amount + 1 monthPrice (will come back to you after closing room)</p>
                                        <span>Количество месяцев</span><input placeholder="Количество месяцев" value={this.state.monthRent} onChange={this.changeMonthRent} required/>
                                        <button className="btn btn-success" type="submit">Rent</button>
                                        <hr/>
                                        </form>
                                    </li>
                                )
                            }
                        }
                    )
                    }
                </ul>
            )
        } else {
            return (
                <h2>Nothing(maybe this is because we don't show your rooms to you here, but others can see them)</h2>
            )
        }
        
    }
}

export default AllRooms;