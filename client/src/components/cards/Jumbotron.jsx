import React from 'react'

export default function Jumbotron({title, subTitle="Welcome to React E-commerce"}) {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div 
          className='col text-center p-5 bg-light jumbotron'
          style={{ margintop: "-8px", height: "200px"}}
        >
            <h1 className='fw-bold'>{title}</h1>
            <p className='lead'>{subTitle}</p>
        </div>
      </div>
    </div>
  )
}
