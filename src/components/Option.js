
import React from 'react';
import playIcon from './playIcon.png';
import playIconClicked from './playIconClicked.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './game.css'; 

export default function Option(props) {
    const getBgClass = (key, option) => {
        
        if (props.showConfetti && props.isCorrect && props.currentData.correctanswer === option) {
            return 'option-correct';
        } else if (props.msg && !props.isCorrect && props.selectedOptionIndex === key && props.currentData.correctanswer !== option) {
            return 'option-incorrect';
        } else {
            return '#E3E2C3b';
        }
    };

    return (
        <div className="text-left my-2">
            {
                props.options.map((option, key) => (
                    <div 
                        className={`option-container p-2 rounded my-2 ${getBgClass(key, option)}`} 
                        
                        key={key}
                    >
                        <img
                            src={props.AudioOption === option && props.img ? playIcon : playIconClicked}
                            onClick={() => props.playAudio(option)}
                            style={{ cursor: "pointer", marginRight: "10px", height: "20px", width: "20px"}}
                            disabled={props.isSpeaking}
                            alt='audio'
                        />
                        <input
                            type='radio'
                            id={`option${props.index + 1}`}
                            name={`option${props.index + 1}`}
                            className="form-check-input ml-2"
                            disabled={props.isSpeaking}
                            checked={props.selectedOptionIndex === key}
                            onChange={() => props.handleCheckboxChange(option, key)}
                        />
                        <label htmlFor={`option${props.index + 1}`} className="ml-2" style={{ color: "black", marginLeft: "5px" }} disabled={props.isSpeaking}>
                            {option}
                        </label>
                    </div>
                ))
            }
        </div>
    )
}


