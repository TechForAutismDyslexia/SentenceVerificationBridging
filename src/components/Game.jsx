import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Option from './Option';
import Confetti from 'react-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import './game.css';


export default function Game() {
    const [sections, setSections] = useState([]);
    // const [sectionIndex, setSectionIndex] = useState(0);
    const [currentData, setCurrentData] = useState(null);
    const [index, setIndex] = useState(0);
    const [msg, setMsg] = useState("");
    const [color, setColor] = useState("red");
    const [selectedOption, setSelectedOption] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [disablebut, setDisableBut] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Fetch data from your API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/sections');
                setSections(response.data);
                if (response.data['section-1'] && response.data['section-1'].length > 0) {
                    setCurrentData(response.data['section-1'][0]); 
                    setShuffledOptions(shuffleArray(response.data['section-1'][0].options)); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (currentData) {
            const loadImage = async () => {
                if (currentData.url) {
                    const image = (await import(`../assests/images/${currentData.url}`)).default;
                    setImageUrl(image);
                }
            };
            loadImage();
        }
    }, [currentData]);

    const HandleNext = () => {
        if (!currentData) return;

        if (selectedOption === currentData.correctanswer) {
            setShowConfetti(true);
            setIsCorrect(true);
            setDisableBut(true);
            setTimeout(() => {
                setShowConfetti(false);
                setDisableBut(false);
                setIsCorrect(null);
                moveToNextQuestion();
            }, 5000);
        } else {
            setIsCorrect(false);
            setMsg("Incorrect! Try again.");
        }
        setSelectedOption("");
    };

    const moveToNextQuestion = () => {
        const nextIndex = index + 1;
        if (nextIndex < sections['section-1'].length) {
            setIndex(nextIndex);
            setCurrentData(sections['section-1'][nextIndex]);
            setShuffledOptions(shuffleArray(sections['section-1'][nextIndex].options));
        } else {
            setMsg("Congratulations! You've completed the section.");
            // Handle end of section logic
        }
    };

    const handleCheckboxChange = (option) => {
        setSelectedOption(option);
        setMsg("");
    };

    const playAudio = (option) => {
        const utterance = new SpeechSynthesisUtterance(option);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="container">
            <h1 className="text-center my-4" style={{ color: "#3C9099" }}>Sentence Verification Bridging</h1>
            <div className={`text-center p-2 my-3 rounded ${isCorrect ? 'correct-blink' : isCorrect === false ? 'incorrect-blink' : 'transparent'}`} style={{ backgroundColor: "#5FBDB0", border: '4px solid #3C9099' }}>
            {currentData && (
                <div>
                    <img src={imageUrl} className="img-fluid p-1" alt={currentData.caption} style={{ height: '40vh' }} />
    
                    <Option 
                        currentData={currentData} 
                        options={shuffledOptions} 
                        handleCheckboxChange={handleCheckboxChange} 
                        playAudio={playAudio} 
                    />
                    <p style={{ color }}>{msg}</p>
                    <button onClick={HandleNext} disabled={disablebut}>
                        Next
                    </button>
                    {showConfetti && <Confetti />}
                </div>
            )}
            </div>
            
        </div>
    );
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
