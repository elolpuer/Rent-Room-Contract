const Rent = artifacts.require('../contracts/Rent.sol')
const { assert } = require('chai')
const chai = require('chai')

contract('Rent', async (accounts)=>{
    let instance;
    beforeEach('should setup the contract instance', async () => {
        instance = await Rent.deployed();
        await instance.sellRoom('name','describe', 12345, 10,{'from': accounts[8]})
    });

    it("should return length 1", async()=>{
        const allRooms = await instance.getAllRooms()
    
        assert.equal(allRooms.length, 1)
    })
   
    it('should rent Room 1 month', async()=>{
        const balanceOwnerBefore = await instance.getAnotherBalance(accounts[8])
        let price = 10
        //price * 2 значит что мы отправили ежемесячную плату + депозит в размере 1 месяца
        await instance.rentRoom(0, {'from': accounts[9], 'value': price * 2})
        const allRooms = await instance.getAllRooms()
        const balanceOwnerAfter = await instance.getAnotherBalance(accounts[8])

        assert.equal(allRooms[0].Rented, true)
        //это значит что мы отправили плату владельцу
        assert.equal(Number(balanceOwnerBefore) + price, Number(balanceOwnerAfter) + 0)
    })
    it('should close room renter', async ()=> {
        let depositBefore = await instance.getDeposit(0)
        let price = 10
        await instance.closeRoomRenter(0, {'from': accounts[9]})
        const allRooms = await instance.getAllRooms()
        let depositAfter = await instance.getDeposit(0)

        assert.equal(allRooms[0].Rented, false)
        //это значит что мы отправили депозит тому кто арендавал до этого
        assert.equal(Number(depositBefore)+0, Number(depositAfter) + price)
    })
    it('should close room owner forever', async ()=> {
        let price = 10
        await instance.rentRoom(0, {'from': accounts[9], 'value': price * 2})
        const allRoomsBefore = await instance.getAllRooms()
        const amountDaysToEndDeal = (Number(allRoomsBefore[0].TimeRentEnded) - Number(allRoomsBefore[0].TimeDeal))/ 60 / 60 / 24
        const daysPrice = parseFloat(price / 30)
        const balanceRenterBefore = await instance.getAnotherBalance(accounts[9])
        await instance.closeRoomOwnerForever(0, {'from': accounts[8], 'value': amountDaysToEndDeal*daysPrice})
        const allRoomsAfter = await instance.getAllRooms()
        const balanceRenterAfter = await instance.getAnotherBalance(accounts[9])

        assert.equal(Number(balanceRenterBefore) + 0, Number(balanceRenterAfter) + amountDaysToEndDeal*daysPrice + price)
        assert.equal(allRoomsBefore.length-1, allRoomsAfter.length)
    })
    it('should close room owner from this renter', async ()=> {
        let price = 10
        await instance.rentRoom(0, {'from': accounts[9], 'value': price * 2})
        const allRoomsBefore = await instance.getAllRooms()
        const amountDaysToEndDeal = (Number(allRoomsBefore[0].TimeRentEnded) - Number(allRoomsBefore[0].TimeDeal))/ 60 / 60 / 24
        const daysPrice = parseFloat(price / 30)
        const balanceRenterBefore = await instance.getAnotherBalance(accounts[9])
        await instance.closeRoomOwnerForever(0, {'from': accounts[8], 'value': amountDaysToEndDeal*daysPrice})
        const balanceRenterAfter = await instance.getAnotherBalance(accounts[9])
        const allRoomsAfter = await instance.getAllRooms()

        assert.equal(Number(balanceRenterBefore) + 0, Number(balanceRenterAfter) + amountDaysToEndDeal*daysPrice + price)
        assert.equal(allRoomsBefore[0].Rented, !allRoomsAfter[0].Rented)
    })
    it('should change key', async ()=>{
        let newKeyBefore = 54321
        await instance.changeKey(0, newKeyBefore, {'from': accounts[8]})
        let newKeyAfter = await instance.getKey(0, {'from': accounts[8]})

        assert.equal(newKeyBefore, newKeyAfter)
    })
})