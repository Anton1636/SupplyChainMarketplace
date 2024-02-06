import React, { useState, useEffect, useContext } from 'react'
import {
	Table,
	Form,
	Services,
	Profile,
	CompleteShipment,
	GetShipment,
	StartShipment,
} from '../components/index'
import { TrackingContext } from '@/context/Tracking'

const index = () => {
	const {
		currentUser,
		createShipment,
		getAllShipment,
		completeShipment,
		getShipment,
		startShipment,
		getShipmentCount,
	} = useContext(TrackingContext)

	const [createShipmentModel, setCreateShipmentModel] = useState(false)
	const [openProfile, setOpenProfile] = useState(false)
	const [startModal, setStartModal] = useState(false)
	const [completeModal, setCompleteModal] = useState(false)
	const [getModel, setGetModel] = useState(false)
	const [allShipmentsdata, setallShipmentsdata] = useState()

	useEffect(() => {
		const getCampaingsData = getAllShipment()

		return async () => {
			const allData = await getCampaingsData
			setallShipmentsdata(allData)
		}
	}, [])

	return (
		<>
			<Services
				setOpenProfile={setOpenProfile}
				setCompleteModal={setCompleteModal}
				setGetModel={setGetModel}
				setStartModal={setStartModal}
			/>
			<Table
				setCreateShipmentModel={setCreateShipmentModel}
				allShipmentsdata={allShipmentsdata}
			/>
			<Form
				createShipmentModel={createShipmentModel}
				createShipment={createShipment}
				setCreateShipmentModel={setCreateShipmentModel}
			/>
			<Profile
				openProfile={openProfile}
				setOpenProfile={setOpenProfile}
				currentUser={currentUser}
				getShipmentCount={getShipmentCount}
			/>
			<CompleteShipment
				completeModal={completeModal}
				setCompleteModal={setCompleteModal}
				completeShipment={completeShipment}
			/>
			<GetShipment
				getModel={getModel}
				setGetModel={setGetModel}
				getShipment={getShipment}
			/>
			<StartShipment
				startModal={startModal}
				setStartModal={setStartModal}
				startShipment={startShipment}
			/>
		</>
	)
}

export default index
