import React from 'react'

const d = new Date()
const d1 = new Date()

class RentedRooms extends React.Component {

    render(){
        //Если существуют комнаты/квартиры, тогда показываем, а иначе пишем что 'ничего нет'
        if (this.props.rentedRooms.length >= 1) {
            return (
                <ul className="roomsList">
                {
                //Проходимся по всему массиву
                this.props.rentedRooms.map((room) => {
                    return (              
                      <li>
                          <hr/>
                          <p>Name:{room.Name}</p>	
                          <p>Description: {room.Description}</p>
                          <p>Owner:{room.Owner}</p>	
                          <p>RentOwner:{room.RentOwner}</p>	
                          <p>Price: {room.Price}</p>
                          {
                            //Если есть сделка, тогда отображаем дату заключения и окончания
                            room.TimeDeal !== 0 ? <div><p>TimeDeal: {new Date(Number(room.TimeDeal)*1000).toLocaleString()}</p><p>TimeRentEnded: {new Date(Number(room.TimeRentEnded)*1000).toLocaleString()}</p></div>: <span></span>
                          }
                          <button className="btn btn-dark" type="submit" onClick={() => this.props.getKey(room.ID)}>Key</button>
                          <button className="btn btn-danger" type="submit" onClick={() => this.props.closeRoomRenter(room.ID,room.TimeDeal,room.TimeRentEnded, room.Price)}>Close Room</button>
                          <hr/>
                      </li>
                    )
                  })}
                  </ul>
            )
        } else {
            return (
                <h2>Nothing</h2>
            )
        }
        
    }
}

export default RentedRooms;