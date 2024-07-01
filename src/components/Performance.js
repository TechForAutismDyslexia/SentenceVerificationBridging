import React from 'react'

export default function Performance(props) {
  return (

    <div >      
                            
        {props.sections.map((section, sectionIdx) => (
            <div style={{"marginTop":"3%","marginBottom":"3%"}} key={sectionIdx}>
                <h5>Section {sectionIdx + 1}</h5>
                {props.file[section].map((_, questionIdx) => (
                <p key={questionIdx}>
                Question {questionIdx + 1}:  Attempts:{props.attempts[section][questionIdx]} attempts , Time-Taken:{props.time[section][questionIdx]} seconds
                </p>


                ))}
            </div>
            ))}
    </div>

  )
}
