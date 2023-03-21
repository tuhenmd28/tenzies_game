import React from 'react'

export default function Die({value,isHold,holdFunction}) {
  return (
    <div className='die_box' onClick={holdFunction} style={{background:isHold?"#48BF53":"white"}}>
      <h3>{value}</h3>
    </div>
  )
}
