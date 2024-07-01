
import React from 'react';
import playIcon from './playIcon.png';
import playIconClicked from './playIconClicked.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './game.css'; 

export default function Option(props) {
    const getBgClass = (key, option) => {
        if (props.msg === 'Incorrect! Try again.' && key === props.selectedOptionIndex) {
            return 'option-incorrect';
        }
        else if (props.showConfetti && props.isCorrect && props.currentData.correctanswer === option) {
            return 'option-correct';
        }  else {
            return '#E3E2C3b';
        }
    };
    const toggleAudio = (option) => {
        if (props.AudioOption === option && props.img) {
            props.playAudio(""); 
        } else {
            props.playAudio(option); 
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
                            onClick={() => toggleAudio(option)}
                            style={{ cursor: "pointer", marginRight: "10px", height: "20px", width: "20px"}}
                            disabled={props.isSpeaking}
                            alt='audio'
                        />
                        <input
                            type='radio'
                            key={key}
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


