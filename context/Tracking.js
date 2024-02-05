import React, { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import tracking from '../context/Tracking.json'

const ContractAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
const ContractABI = tracking.abi
const fetchContract = signerOrProvider =>
	new ethers.Contract(ContractAddress, ContractABI, signerOrProvider)

export const TrackingContext = React.createContext()

export const TrackingProvider = ({ children }) => {
	const DappName = 'Product Tracking Dapp'
	const [currentUser, setCurrentUser] = useState('')

	const createShipment = async items => {
		console.log(items)
		const { receiver, pickupTime, distance, price } = items

		try {
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()
			const contract = fetchContract(signer)
			const createItem = await contract.createShipment(
				receiver,
				new Date(pickupTime).getTime(),
				distance,
				ethers.utils.parseUnits(price, 18),
				{
					value: ethers.utils.parseUnits(price, 18),
				}
			)

			await createItem.wait()
			console.log(createItem)
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	const getAllShipment = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider()
			const contract = fetchContract(provider)
			const shipments = await contract.getAllTransactions()

			const allShipments = shipments.map(shipment => ({
				sender: shipment.sender,
				receiver: shipment.receiver,
				price: ethers.utils.formatEther(shipment.price.toString()),
				pickupTime: shipment.pickupTime.toNumber(),
				deliveryTime: shipment.deliveryTime.toNumber(),
				distance: shipment.distance.toNumber(),
				isPaid: shipment.isPaid,
				status: shipment.status,
			}))

			return allShipments
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	const getShipmentsCount = async () => {
		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({ method: 'eth_accounts' })
			const provider = new ethers.providers.JsonRpcProvider()
			const contract = fetchContract(provider)
			const shipmentsCount = await contract.getShipmentsCount(accounts[0])

			return shipmentsCount.toNumber()
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	const completeShipment = async completeShip => {
		console.log(completeShip)

		const { receiver, index } = completeShip

		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({ method: 'eth_accounts' })
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()
			const contract = fetchContract(signer)
			const transaction = await contract.completeShipment(
				accounts[0],
				receiver,
				index,
				{
					gasLimit: 300000,
				}
			)

			transaction.wait()
			console.log(transaction)
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	const getShipment = async index => {
		console.log(index * 1)

		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({ method: 'eth_accounts' })
			const provider = new ethers.providers.Web3Provider(connection)
			const contract = fetchContract(provider)
			const shipment = await contract.getShipment(accounts[0], index * 1)

			const SingleShipment = {
				sender: shipment[0],
				receiver: shipment[1],
				pickupTime: shipment[2].toNumber(),
				deliveryTime: shipment[3].toNumber(),
				distance: shipment[4].toNumber(),
				price: ethers.utils.formatEther(shipment[5].toString()),
				status: shipment[6],
				isPaid: shipment[7],
			}

			return SingleShipment
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	const startShipment = async getProduct => {
		const { receiver, index } = getProduct

		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({
				method: 'eth_accounts',
			})
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()
			const contract = fetchContract(signer)
			const shipment = await contract.startShipment(
				accounts[0],
				receiver,
				index * 1
			)

			shipment.wait()
			console.log(shipment)
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	//CHECK WALLET CONNECTED
	const checkIfWalletConnected = async () => {
		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({
				method: 'eth_accounts',
			})

			if (accounts.length) {
				setCurrentUser(accounts[0])
			} else {
				return 'No account'
			}
		} catch (e) {
			console.log('not connected', e)
		}
	}

	//CONNECT WALLET FUNC
	const connectWallet = async () => {
		try {
			if (!window.ethereum) return 'Install metamask'

			const accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			})

			setCurrentUser(accounts[0])
		} catch (e) {
			console.log('Some want wrong ', e)
		}
	}

	useEffect(() => {
		checkIfWalletConnected()
	}, [])

	return (
		<TrackingContext.Provider
			value={{
				connectWallet,
				createShipment,
				getAllShipment,
				completeShipment,
				getShipment,
				startShipment,
				getShipmentsCount,
				DappName,
				currentUser,
			}}
		>
			{children}
		</TrackingContext.Provider>
	)
}
