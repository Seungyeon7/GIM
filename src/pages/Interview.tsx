import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, CheckCircle } from 'lucide-react';
import { PageType, Question, Record } from '../types';
import { formatTime } from '../utils/time';
import { StorageService } from '../services/storage';

interface InterviewProps {
    onNavigate: (page: PageType) => void;
    onFinish: (record: Record) => void;
}

export const Interview: React.FC<InterviewProps> = ({ onNavigate, onFinish }) => {
    const [stage, setStage] = useState<'planning' | 'interview' | 'finished'>('planning');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
    const [planningTime, setPlanningTime] = useState(0);
    const [interviewTime, setInterviewTime] = useState(0);

    const [conceptualQuestions, setConceptualQuestions] = useState<Question[]>([]);
    const [instantQuestions, setInstantQuestions] = useState<Question[]>([]);

    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const [showInstant1, setShowInstant1] = useState(false);
    const [showInstant2, setShowInstant2] = useState(false);

    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [questionTimes, setQuestionTimes] = useState<{ [key: string]: number }>({});
    const [buttonStates, setButtonStates] = useState<{ [key: string]: boolean }>({});

    const recognitionRef = useRef<any>(null);
    const [showStartInterviewModal, setShowStartInterviewModal] = useState(false);

    useEffect(() => {
        // Initialize questions
        const allConceptual = StorageService.getConceptualQuestions();
        const allInstant = StorageService.getInstantQuestions();

        setConceptualQuestions([...allConceptual].sort(() => 0.5 - Math.random()).slice(0, 3));
        setInstantQuestions([...allInstant].sort(() => 0.5 - Math.random()).slice(0, 2));
    }, []);

    useEffect(() => {
        if (stage === 'finished') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    if (stage === 'planning') {
                        if (!showStartInterviewModal) {
                            setShowStartInterviewModal(true);
                        }
                        return 0;
                    } else {
                        finishInterview();
                        return 0;
                    }
                }
                return prev - 1;
            });

            if (stage === 'planning' && !showStartInterviewModal) setPlanningTime(prev => prev + 1);
            else if (stage === 'interview') setInterviewTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, showStartInterviewModal]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'ko-KR';
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript) setTranscript(prev => prev + finalTranscript);
            };

            recognitionRef.current.onend = () => {
                if (isRecording && stage === 'interview') {
                    recognitionRef.current.start();
                }
            };
        }
    }, [isRecording, stage]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const startInterviewPhase = () => {
        setShowStartInterviewModal(false);
        setPlanningTime(900 - timeLeft);
        setStage('interview');
        setTimeLeft(900);
        setQuestionStartTime(Date.now());

        if (recognitionRef.current) {
            setIsRecording(true);
            setTranscript('');
            recognitionRef.current.start();
        }
    };

    const finishInterview = () => {
        if (stage === 'planning') {
            setShowStartInterviewModal(true);
        } else if (stage === 'interview') {
            // Record time for the last question
            if (questionStartTime) {
                const duration = Math.floor((Date.now() - questionStartTime) / 1000);
                if (showInstant1 || showInstant2) {
                    setQuestionTimes(prev => ({ ...prev, instant_all: duration }));
                } else {
                    // Assuming we are on the last conceptual question or just finishing up
                    // This logic was a bit loose in the original, but let's keep it safe
                }
            }

            setInterviewTime(900 - timeLeft);
            setStage('finished');

            if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop();
                setIsRecording(false);
            }
            window.speechSynthesis.cancel();
        }
    };

    const speakText = (text: string) => {
        window.speechSynthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const markQuestionComplete = (type: 'conceptual' | 'instant', index: number) => {
        const key = `${type}_${index}`;
        if (questionStartTime) {
            const duration = Math.floor((Date.now() - questionStartTime) / 1000);
            setQuestionTimes(prev => ({ ...prev, [key]: duration }));
        }
        setButtonStates(prev => ({ ...prev, [key]: true }));
        setQuestionStartTime(Date.now());

        // If Instant Question 1 is completed, read Instant Question 2
        if (type === 'instant' && index === 0 && instantQuestions[1]) {
            speakText(instantQuestions[1].content);
        }
    };

    const handleShowInstant = () => {
        // Record time for the last conceptual question (assumed to be the 3rd one if we are moving to instant)
        if (questionStartTime) {
            const duration = Math.floor((Date.now() - questionStartTime) / 1000);
            setQuestionTimes(prev => ({ ...prev, [`conceptual_${2}`]: duration }));
        }

        setShowInstant1(true);
        setShowInstant2(true);
        setQuestionStartTime(Date.now());

        if (instantQuestions[0]) {
            speakText(instantQuestions[0].content);
        }
    };

    const saveRecord = () => {
        const record: Record = {
            date: new Date().toLocaleString('ko-KR'),
            questions: conceptualQuestions,
            instantQuestions: instantQuestions,
            transcript: transcript,
            planningTime: formatTime(planningTime),
            interviewTime: formatTime(interviewTime),
            questionTimes: questionTimes
        };
        onFinish(record);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 relative">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => onNavigate('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    뒤로가기
                </button>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-indigo-900 mb-4">
                            {stage === 'planning' ? '구상 시간' : stage === 'interview' ? '면접 시간' : '면접 종료'}
                        </h2>
                        {stage === 'interview' && (
                            <div className="flex items-center gap-2 mb-4">
                                {isRecording ? <Mic className="w-6 h-6 text-red-500 animate-pulse" /> : <MicOff className="w-6 h-6 text-gray-400" />}
                                <span className="text-sm text-gray-600 font-medium">{isRecording ? '녹음 중' : '녹음 대기'}</span>
                            </div>
                        )}
                    </div>

                    {stage === 'finished' ? (
                        <div className="text-center py-12">
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-6">
                                <h3 className="text-2xl font-bold text-green-800 mb-3">모의 면접이 종료되었습니다</h3>
                                <p className="text-green-700">인사와 마무리까지 제대로 연습해보세요</p>
                            </div>
                            <button onClick={saveRecord} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                                결과 보기
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6 mb-8">
                                {conceptualQuestions.map((q, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm">구상형 {idx + 1}</span>
                                                <span className="text-gray-700 font-semibold">{q.name}</span>
                                            </div>
                                            {stage === 'interview' && !showInstant1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => markQuestionComplete('conceptual', idx)}
                                                    disabled={buttonStates[`conceptual_${idx}`] === true}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${buttonStates[`conceptual_${idx}`] === true
                                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                                                        : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md hover:shadow-lg'
                                                        }`}
                                                >
                                                    {buttonStates[`conceptual_${idx}`] === true && questionTimes[`conceptual_${idx}`]
                                                        ? `완료 ${formatTime(questionTimes[`conceptual_${idx}`])}`
                                                        : '완료 (시간측정)'}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-900 text-lg font-bold whitespace-pre-wrap leading-relaxed mb-3">{q.content}</p>
                                        {q.image && <img src={q.image} alt="문항 이미지" className="max-w-full h-auto max-h-96 rounded-lg mt-3" />}
                                    </div>
                                ))}
                            </div>

                            {stage === 'planning' && timeLeft === 0 && !showStartInterviewModal && (
                                <div className="text-center bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                                    <p className="text-xl text-yellow-800 font-semibold mb-4">구상이 종료되었습니다. 면접 준비가 되었다면 다음 버튼을 눌러주세요.</p>
                                    <button type="button" onClick={() => setShowStartInterviewModal(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                                        다음 (면접 시작)
                                    </button>
                                </div>
                            )}

                            {stage === 'interview' && (
                                <div className="space-y-4 mb-8">
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handleShowInstant}
                                            disabled={showInstant1}
                                            className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${showInstant1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
                                                }`}
                                        >
                                            즉답형 문제 보기
                                        </button>
                                    </div>

                                    {showInstant1 && (
                                        <div className="space-y-4">
                                            {instantQuestions.map((q, idx) => (
                                                <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm">즉답형 {idx + 1}</span>
                                                            <span className="text-gray-700 font-semibold">{q.name}</span>
                                                        </div>
                                                        {!questionTimes.instant_all && (
                                                            <button
                                                                type="button"
                                                                onClick={() => markQuestionComplete('instant', idx)}
                                                                disabled={questionTimes[`instant_${idx}`] !== undefined}
                                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionTimes[`instant_${idx}`] !== undefined
                                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                                                                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                                                                    }`}
                                                            >
                                                                {questionTimes[`instant_${idx}`] !== undefined
                                                                    ? `완료 ${formatTime(questionTimes[`instant_${idx}`])}`
                                                                    : '완료 (시간측정)'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-900 text-lg font-bold whitespace-pre-wrap leading-relaxed mb-3">{q.content}</p>
                                                    {q.image && <img src={q.image} alt="문항 이미지" className="max-w-full h-auto max-h-96 rounded-lg mt-3" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 items-center">
                                <div className="flex-1 bg-black px-8 py-8 rounded-2xl">
                                    <div className="text-6xl font-bold text-red-600 font-mono tracking-wider text-center">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                                <button type="button" onClick={finishInterview} className="bg-green-600 text-white px-6 py-8 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg">
                                    <CheckCircle className="w-6 h-6" />
                                    완료
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showStartInterviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-4">면접시작 안내</h3>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed text-left break-keep">
                            '면접시작' 버튼을 누르면 바로 시간측정이 시작됩니다.<br />
                            인사와 앉기 연습 후 <span className="font-bold text-indigo-600">"면접시작"</span> 버튼을 눌러주세요.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={startInterviewPhase}
                                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                면접시작
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
