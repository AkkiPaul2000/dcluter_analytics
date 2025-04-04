import React from 'react'
import CardDatas from './cardDatas'
import TableDatas from './tableDatas'
function dataContent() {
  return (
    <div className='flex flex-col gap-4 bg-[#f8f8f8] h-full p-6'>
      <CardDatas />
      <TableDatas />
    </div>
  )
}

export default dataContent
