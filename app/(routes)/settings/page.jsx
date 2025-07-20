'use client'
import React from 'react'
import { useSelector } from 'react-redux'

function UserSettings() {
  const {email} = useSelector(state=>state.user)
  return (
    <div>
      {email}
    </div>
  )
}

export default UserSettings