import React, { useEffect, useState } from 'react';
import axios from 'axios';
import file from '../assests/questions.json';
import Option from './Option';
import Confetti from 'react-confetti';
import { shuffleArray } from '../utils/shuffleArray.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './game.css';
import {Link}  from "react-router-dom"

export default function Game() {
    const sections = Object.keys(file.images);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [currentData, setCurrentData] = useState(file.images[sections[0]][0]);
    const [index, setIndex] = useState(0);
    const [msg, setMsg] = useState("");
    const [img, setImg] = useState(false);
    const [AudioOption, setAudioOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [color, setColor] = useState("red");
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [PlayAgain, setPlayAgain] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [attempts, setAttempts] = useState(
        sections.reduce((acc, section) => {
            acc[section] = Array(file.images[section].length).fill(1);
            return acc;
        }, {})
    );
    const [time, setTime] = useState(
        sections.reduce((acc, section) => {
            acc[section] = Array(file.images[section].length).fill(0);
            return acc;
        }, {})
    );
    const [startTime, setStartTime] = useState(Date.now());
    const [nextBut, setNextbut] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [disablebut, setDisableBut] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            if (currentData && currentData.url) {
                const image = (await import(`../assests/images/${currentData.url}`)).default;
                setImageUrl(image);
            }
        };

        loadImage();
    }, [currentData]);
   
    useEffect(() => {
        if (sections.length > 0) {
            const initialData = file.images[sections[0]][0];
            setCurrentData(initialData);
            setShuffledOptions(shuffleArray(initialData.options));
        }
    }, []);

    useEffect(() => {
        setStartTime(Date.now());
    }, [currentData]);
    const client=axios.create({
        baseURL:"https://jwlgamesbackend.vercel.app/api/caretaker",
    })

    const sendFinalData = async (notries,notimer) => {
        try {
            client.post("/sendgamedata", {
                gameId:14,
                tries:notries,
                timer:notimer,
                status:true
            })
            
        } catch (err) {
            console.error("Error saving final game data:", err);
        }
    };

    

    const logAllPerformanceData = () => {
        console.log("Logging all performance data:");
        let totalAttemptsFromJSON = 0;
        let totalTimeFromJSON = 0;
    
        sections.forEach((sectionKey) => {
            console.log(`Section: ${sectionKey}`);
            file.images[sectionKey].forEach((question, idx) => {
                console.log(`Question ${idx + 1}: Attempts: ${question.attempts}, Time Taken: ${question.timetaken} seconds`);
                totalAttemptsFromJSON += question.attempts;
                totalTimeFromJSON += question.timetaken;
            });
        });
    
        console.log(`Total Attempts from JSON: ${totalAttemptsFromJSON}`);
        console.log(`Total Time from JSON: ${totalTimeFromJSON}`);
    
        return { totalAttemptsFromJSON, totalTimeFromJSON };
    };
    

    const HandleNext = () => {
        if (!currentData) return;
        const sectionKey = sections[sectionIndex];
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
        } else if (selectedOption === "") {
            setMsg("Please select an option");
        } else {
            setIsCorrect(false);
            const newAttempts = { ...attempts };
            newAttempts[sectionKey][index]++;
            setAttempts(newAttempts);
            setMsg("Incorrect! Try again.");
        }
        setSelectedOption("");
        setSelectedOptionIndex(null);
    };

    const moveToNextQuestion = () => {
        const sectionKey = sections[sectionIndex];
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const newTime = { ...time };
        newTime[sectionKey][index] += timeTaken;
        setTime(newTime);
        file.images[sectionKey][index].attempts = attempts[sectionKey][index];
        file.images[sectionKey][index].timetaken = newTime[sectionKey][index];
        if (index === file.images[sectionKey].length - 1) {
            
            if (sectionIndex === sections.length - 1) {
                setNextbut(false);
                setColor("green");
                setPlayAgain(true);
                setMsg("CONGRATULATIONS! YOU HAVE COMPLETED ALL SECTIONS");
                setCurrentData(null);
                logAllPerformanceData();
                const { totalAttemptsFromJSON, totalTimeFromJSON } = logAllPerformanceData();
                console.log(totalAttemptsFromJSON);
                console.log(totalTimeFromJSON)
                sendFinalData(totalAttemptsFromJSON, totalTimeFromJSON);
            } else {
                const nextSectionIndex = sectionIndex + 1;
                const nextData = file.images[sections[nextSectionIndex]][0];
                setSectionIndex(nextSectionIndex);
                setCurrentData(nextData);
                setIndex(0);
                setShuffledOptions(shuffleArray(nextData.options));
            }
        } else {
            const newIndex = index + 1;
            const nextData = file.images[sectionKey][newIndex];
            setIndex(newIndex);
            setCurrentData(nextData);
            setShuffledOptions(shuffleArray(nextData.options));
        }
    };

    const handleCheckboxChange = (option, key) => {
        setMsg("");
        setSelectedOption(option);
        setSelectedOptionIndex(key);
    };
    const playAudio = (option) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setDisableBut(false);
            setImg(false);
            setAudioOption(null);
        } else {
            const utterance = new SpeechSynthesisUtterance(option);
            utterance.onstart = () => {
                setIsSpeaking(true);
                setDisableBut(true);
                setImg(true);
                setAudioOption(option);
            };
            utterance.onend = () => {
                setIsSpeaking(false);
                setDisableBut(false);
                setImg(false);
                setAudioOption(null);
            };
            window.speechSynthesis.speak(utterance);
        }
    };
    useEffect(() => {
        if (isCorrect) {
            const utterance = new SpeechSynthesisUtterance("Correct");
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [isCorrect]);

    useEffect(() => {
        if (msg.includes('CONGRATULATIONS') || msg.includes('Incorrect! Try again.') || msg.includes('Please select an option')) {
            const utterance = new SpeechSynthesisUtterance(msg);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [msg]);

    const playAgain = () => {
        setIndex(0);
        setSectionIndex(0);
        const initialData = file.images[sections[0]][0];
        setCurrentData(initialData);
        setShuffledOptions(shuffleArray(initialData.options));
        setNextbut(true);
        setMsg("");
        setPlayAgain(false);
        setColor("red");
    };

    return (
        <div className="container">
            <h1 className="text-center my-4" style={{ color: "#3C9099" }}>Sentence Verification Bridging</h1>
            {nextBut && <p className="text-center" style={{ color: "#5FBDB0", fontWeight: "bold" }}>Choose the correct sentence that is related to the below picture.</p>}
            <div className={`text-center p-2 my-3 rounded ${isCorrect ? 'correct-blink' : isCorrect === false ? 'incorrect-blink' : 'transparent'}`} style={{ backgroundColor: "#5FBDB0", border: '4px solid #3C9099' }}>
                {
                    currentData && (
                        
                        <div className="row">
                            <div className="col-md-6 col-s-4 text-left">
                            {imageUrl && (
                        <img src={imageUrl} className="img-fluid p-1" alt={currentData.caption} style={{ height: '40vh' }} />
                         )}
                            </div>
                            <div className="col-md-6 col-s-4 d-flex align-items-center">
                                <Option currentData={currentData} msg={msg} options={shuffledOptions} handleCheckboxChange={handleCheckboxChange} showConfetti={showConfetti} img={img} AudioOption={AudioOption} playAudio={playAudio} isSpeaking={isSpeaking} isCorrect={isCorrect} selectedOptionIndex={selectedOptionIndex} />
                            </div>
                        </div>
                    )
                }
                {msg && <div>
                  <p className="font-weight-bold my-1" style={{ color: color }}>{msg}</p>
                     {PlayAgain && <button onClick={playAgain} className="btn btn-primary my-2" style={{ border: '1px solid #E3E2C3', backgroundColor: '#3C9099', color: '#F0EFE2' ,margin:2}}>PLAY AGAIN</button>}
                     <Link to="https://joywithlearning.com/games">
                     {PlayAgain && <button onClick={playAgain} className="btn btn-primary my-2" style={{ border: '1px solid #E3E2C3', backgroundColor: '#3C9099', color: '#F0EFE2',margin:2 }}>GO TO HOME</button>}
                     </Link>
                 </div>}
                 {nextBut && <button onClick={HandleNext} disabled={disablebut} className={`btn btn-${showConfetti ? 'success' : 'primary'} my-2`} style={{ border: '1px solid #E3E2C3', backgroundColor: '#3C9099', color: '#F0EFE2' }}>{showConfetti ? 'CORRECT' : 'NEXT'}</button>}
            </div>
            {showConfetti && <Confetti />}
        </div>
    );
}
