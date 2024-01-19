import React,  { useState } from 'react'

import Layout from '../../components/Layout'

const TrainingModule = () => {
    const [input, setInput] = useState('')
    const [score, setScore] = useState(0)
    const [wrongCount, setWrongCount] = useState(3)
    const [qNumber, setQNumber] = useState(1)
    const [isCorrect, setIsCorrect] = useState(false)
    const [messages, setMessages] = useState([
        { text: 'What is my name?', sender: 'bot' }
    ])

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        handleBotResponse(input)
        setInput('')
    }

    const handleNextQuestion = () => {
        setIsCorrect(false)
        setWrongCount(3)
        if (qNumber === 2) {
            setMessages([
                { text: 'Where do I work?', sender: 'bot' }
            ])
        } else if (qNumber === 3) {
            setMessages([
                { text: 'What is the meaning of GADIS?', sender: 'bot' }
            ])
        }
    }

    const handleBotResponse = (answer) => {
        let userInput = answer.trim()
        let response = "That's the wrong answer"
        if (qNumber === 1) {   
            if (userInput.toLowerCase().includes('jason')) {
                response = 'That is correct'
                setIsCorrect(true)
                setQNumber(qNumber + 1)
                setScore(score + 1)
            } else if (userInput.toLowerCase().includes(`i don't know`)) {
                response = "Hint - it starts with the letter 'J'"
            } else if (userInput.toLowerCase().includes(`i dont know`)) {
                response = "Hint - it starts with the letter 'J'"
            } else if (userInput.toLowerCase().includes('?')) {
                response = "I'm the one asking you"
            } else {
                setWrongCount(wrongCount - 1)
                if (wrongCount == 1) {
                    response = "Out of tries, The correct answer is 'Jason'"
                    setQNumber(qNumber + 1)
                }
            }
            setMessages([...messages, {text: input, sender: 'you'}, {text: response, sender: 'bot'}])
        } else if (qNumber === 2) {
            if (userInput.toLowerCase().includes('sei')) {
                response = 'That is correct'
                setIsCorrect(true)
                setQNumber(qNumber + 1)
                setScore(score + 1)
            } else if (userInput.toLowerCase().includes(`i don't know`)) {
                response = "Hint - it's one of DOST's Agency"
            } else if (userInput.toLowerCase().includes(`i dont know`)) {
                response = "Hint - it's one of DOST's Agency"
            } else if (userInput.toLowerCase() == "dost") {
                response = "What agency from DOST? Please specify."
            } else if (userInput.toLowerCase().includes('?')) {
                response = "I'm the one asking you"
                setWrongCount(wrongCount - 1)
            } else {
                setWrongCount(wrongCount - 1)
                if (wrongCount == 1) {
                    response = "Out of tries, The correct answer is 'DOST SEI or SEI'"
                    setQNumber(qNumber + 1)
                }
            }
            setMessages([...messages, {text: input, sender: 'you'}, {text: response, sender: 'bot'}])
        } else if (qNumber === 3) {
            if (userInput.toLowerCase().includes('gender and development information system')) {
                response = 'That is correct'
                setIsCorrect(true)
                setQNumber(qNumber + 1)
                setScore(score + 1)
            } else if (userInput.toLowerCase().includes(`i don't know`)) {
                response = "Hint - GAD is an abbreviation"
            } else if (userInput.toLowerCase().includes(`i dont know`)) {
                response = "Hint - GAD is an abbreviation"
            } else if (userInput.toLowerCase().includes('?')) {
                response = "I'm the one asking you"
            } else {
                setWrongCount(wrongCount - 1)
                if (wrongCount == 1) {
                    response = "Out of tries, The correct answer is 'Gender And Development Information System'"
                    setTimeout(() => {
                        setQNumber(qNumber + 1)
                    }, 3000)
                }
            }
            setMessages([...messages, {text: input, sender: 'you'}, {text: response, sender: 'bot'}])
        }
    }

    if (qNumber == 4) {
        return (
            <Layout title={"/ GAD Training Module"} >
                <div className='border min-h-[200px] p-[10px] mb-[20px]'>
                    <div className='mb-[10px] text-2xl text-center'>
                        Your Score is {score}/3
                    </div>
                </div>
            </Layout>
        )
    }
    return (
        <Layout title={"/ GAD Training Module"} >
            <div className="float-right me-1 text-lg text-gray-500"> Number of tries allowed: <span/>
                {wrongCount == 3 ?
                    <span>
                        <i className="text-red-500 fas fa-heart"></i>
                        <i className="text-red-500 fas fa-heart"></i>
                        <i className="text-red-500 fas fa-heart"></i>
                    </span> :
                wrongCount == 2 ?
                    <span>
                        <i className="text-red-500 fas fa-heart"></i>
                        <i className="text-red-500 fas fa-heart"></i>
                        <i className="text-red-950 fas fa-heart"></i>
                    </span> :
                wrongCount == 1 ?
                    <span>
                        <i className="text-red-500 fas fa-heart"></i>
                        <i className="text-red-950 fas fa-heart"></i>
                        <i className="text-red-950 fas fa-heart"></i>
                    </span> :
                wrongCount == 0 ?
                    <span>
                        <i className="text-red-950 fas fa-heart"></i>
                        <i className="text-red-950 fas fa-heart"></i>
                        <i className="text-red-950 fas fa-heart"></i>
                    </span> : ""
                }
            </div>
            <div className='border min-h-[200px] p-[10px] mb-[20px]'>
                {messages.map((message, index) => 
                    <div className='mb-[10px] text-2xl' key={index} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right' }}>
                        <strong>{message.sender === 'bot' ? 'Bot' : 'You'}:</strong> {message.text}
                    </div>
                )}
            </div>
            {wrongCount == 0 ? 
                <div className="d-flex">
                    <div className='w-75 text-2xl text-red-500'> Wrong answer click next to continue </div>
                    <button className="w-25 bg-green-500 px-5 py-2 text-white hover:shadow-2xl"
                        onClick={handleNextQuestion}
                    >
                        Next
                        <i className="fas fa-step-forward ms-2"></i>
                    </button>
                </div>
                :
                <div className="d-flex">
                    {isCorrect == true ? 
                        <div className='w-75 text-2xl text-green-500'> Good Job! </div> :
                        <form className='w-75 createForms' onSubmit={handleSendMessage}>
                            <input className='border me-2 w-75 text-xl p-1' type="text" placeholder='Answer Here' value={input} onChange={handleInputChange} />
                            <input  className='bg-success text-lg text-white p-1' type='submit' value={"Send"}></input>
                        </form>
                    }
                    {isCorrect == true ? 
                        <button className="w-25 bg-green-500 px-5 py-2 text-white hover:shadow-2xl"
                            onClick={handleNextQuestion}
                        >
                            Next
                            <i className="fas fa-step-forward ms-2"></i>
                        </button> : ""
                    }
                </div>
            }
        </Layout>
    )
}

export default TrainingModule