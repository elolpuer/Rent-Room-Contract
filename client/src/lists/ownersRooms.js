import React from 'react'

class OwnersRooms extends React.Component {
    render(){
        //Если существуют комнаты/квартиры, тогда показываем, а иначе пишем что 'ничего нет'
        if (this.props.ownersRooms.length >= 1) {
            return (

                <ul className="roomsList">
                {
                //Проходимся по всему массиву
                this.props.ownersRooms.map((room) => {
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
                            room.TimeDeal !== '0' ? <div><p>TimeDeal: {new Date(Number(room.TimeDeal)*1000).toLocaleString()}</p><p>TimeRentEnded: {new Date(Number(room.TimeRentEnded)*1000).toLocaleString()}</p></div>: <span></span>
                          }
                          <button className="btn btn-dark" type="submit" onClick={() => this.props.getKey(room.ID)}>Get Key</button><br/>
                          <button className="btn btn-dark" type="submit" onClick={() => this.props.changeKey(room.ID)}>Change Key</button><br/>
                          <button className="btn btn-danger" type="submit" onClick={() => this.props.closeRoomOwnerForever(room.ID,room.TimeDeal,room.TimeRentEnded, room.Price)}>Close Room Forever</button><br/>
                          <button className="btn btn-danger" type="submit" onClick={() => this.props.closeRoomOwnerFromThisRenter(room.ID,room.TimeDeal,room.TimeRentEnded, room.Price)}>Close Room From Renter</button>
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

export default OwnersRooms