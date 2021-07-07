import React, { Component } from "react";
import OwnersRooms from "./lists/ownersRooms";
import AllRooms from "./lists/allRooms";
import RentedRooms from "./lists/rentedRooms";
import Add from "./add/add";
import RentContract from './contracts/Rent.json'
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    rooms: [],
    myRooms: [],
    rentedRooms: [],
    roomsLength: 0,
    web3: null, 
    accounts: null, 
    contract: null,
  };

  submitForm = this.submitForm.bind(this)
  clickRentRoom = this.clickRentRoom.bind(this)
  closeRoomOwnerForever = this.closeRoomOwnerForever.bind(this)
  closeRoomOwnerFromThisRenter = this.closeRoomOwnerFromThisRenter.bind(this)
  closeRoomRenter = this.closeRoomRenter.bind(this)
  getKey = this.getKey.bind(this)
  changeKey = this.changeKey.bind(this)

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RentContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RentContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      instance.options.address = '0xb1968c7Bb78c4Ca90Ce3CF8c01E13e2D720500a7'

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    } 
  };

  runExample = async () => {
    const { accounts,contract } = this.state;
    const ownersRooms = []
    const rentedRooms = []
    const response = await contract.methods.getAllRooms().call();
    let rLength = response.length
    
    for (let i = 0; i < response.length; i++) {
      //Получаем комнаты/квартиры нынешнего пользователя как владельца
      //Общую сумму уменьшаем чтобы свои комнаты/квартиры не отображались в поле AllRooms
      if (response[i].Owner === accounts[0]) {
        ownersRooms.push(response[i])
        rLength -= 1
      }
      //Получаем комнаты/квартиры нынешнего пользователя как арендующего
      if (response[i].RentOwner === accounts[0]) {
        rentedRooms.push(response[i])
        rLength -= 1
      }
    }
    this.setState(
      { 
        rooms: response,      
        myRooms: ownersRooms,
        rentedRooms,
        roomsLength: rLength
      }
    );
  };

  //Выставляем комнату/квартиру для аренды
  async submitForm(name, description, key, price, event) {
    const { accounts, contract } = this.state;
    await contract.methods.sellRoom(name, description, key, price).send({from: accounts[0]})
  }

  //Арендуем комнату/квартиру
  //Сумма отправки = цена за месяц * (количество месяцев аренды + депозит(цена за 1 месяц))
  async clickRentRoom(id, price, rentMonth,event) {
    const { accounts, contract } = this.state
    await contract.methods.rentRoom(id).send({from: accounts[0], value: Number(price) * (Number(rentMonth)+1)})
  }

  //Навсегда закрываем комнату/квартиру навсегда от лица владельца
  //При этом если остается время до закрытия сделки, скидываем оставшиеся деньги арендующему
  async closeRoomOwnerForever(id, timeDeal, timeRentEnded, monthPrice, event) {
    const { accounts, contract } = this.state
    //Количество дней до конца сделки
    const amountDaysToEndDeal = (timeRentEnded - timeDeal)/ 60 / 60 / 24
    //Сумма ежедневного платежа
    //Нужна чтобы посчитать общую сумму платежа
    const daysPrice = parseFloat(monthPrice / 30)
    await contract.methods.closeRoomOwnerForever(id).send({from:accounts[0], value: daysPrice*amountDaysToEndDeal})
  }

  //Закрываем комнату/квартиру от этого рентера от лица владельца
  //При этом если остается время до закрытия сделки, скидываем оставшиеся деньги арендующему
  async closeRoomOwnerFromThisRenter(id, timeDeal, timeRentEnded, monthPrice, event) {
    const { accounts, contract } = this.state
    const amountDaysToEndDeal = (timeRentEnded - timeDeal)/ 60 / 60 / 24
    const daysPrice = parseInt(monthPrice / 30)
    await contract.methods.closeRoomOwnerFromThisRenter(id).send({from:accounts[0], value: daysPrice*amountDaysToEndDeal})
  }

  //Закрываем комнату/квартиру от лица арендующего при этом отправляем депозит
  async closeRoomRenter(id, event) {
    const { accounts, contract } = this.state
    await contract.methods.closeRoomRenter(id).send({from:accounts[0]})
  }

  //Получаем ключ от комнаты/квартиры
  //Может отправить только владелец или арендующий
  async getKey(id, event) {
    const { accounts,contract } = this.state;
    const key = await contract.methods.getKey(id).call({from: accounts[0]})
    alert(`Your key: ${key}`)
  }

  //Меняем ключ от комнаты/квартиры
  //Может отправить только владелец
  async changeKey(id, event) {
    const { accounts, contract } = this.state;
    const newKey = prompt('New key:')
    await contract.methods.changeKey(id, newKey).send({from: accounts[0]})
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Rent Out</h1>
            <Add submitForm={this.submitForm}/>
        <br/>  
        <div>
          <details>
            <summary><h2>My Rent Out Rooms</h2></summary>
            <OwnersRooms 
              ownersRooms={this.state.myRooms} 
              closeRoomOwnerForever={this.closeRoomOwnerForever} 
              getKey={this.getKey}
              changeKey={this.changeKey}
              closeRoomOwnerFromThisRenter={this.closeRoomOwnerFromThisRenter}
              />
          </details>
        </div>
        <div>
          <details>
            <summary><h2>My Rented Rooms</h2></summary>
            <RentedRooms rentedRooms={this.state.rentedRooms} closeRoomRenter={this.closeRoomRenter} getKey={this.getKey}/>
          </details>
        </div>
        <h1>Rent Ad</h1>  
        <div>
            <AllRooms clickRentRoom={this.clickRentRoom} rooms={this.state.rooms} roomsLength={this.state.roomsLength}/>
        </div>
      </div>
    );
  }
}

export default App;
