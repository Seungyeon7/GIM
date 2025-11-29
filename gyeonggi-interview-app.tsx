import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Clock, Edit2, Home, List, Mic, MicOff, Play, Plus, Trash2, X, Upload, Download } from 'lucide-react';

const InterviewPracticeApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [conceptualQuestions, setConceptualQuestions] = useState([]);
  const [instantQuestions, setInstantQuestions] = useState([]);
  const [interviewStage, setInterviewStage] = useState('planning');
  const [timeLeft, setTimeLeft] = useState(900);
  const [planningTime, setPlanningTime] = useState(0);
  const [interviewTime, setInterviewTime] = useState(0);
  const [selectedConceptual, setSelectedConceptual] = useState([]);
  const [selectedInstant, setSelectedInstant] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimes, setQuestionTimes] = useState({});
  const [records, setRecords] = useState([]);
  const [showInstant1, setShowInstant1] = useState(false);
  const [showInstant2, setShowInstant2] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStates, setButtonStates] = useState({});
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadXLSX = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadXLSX();

    const defaultConceptual = [
      { id: 1, name: '[2025 기출]', content: "학급 자치에서 참여 불균형·무임승차를 줄이는 역할 설계와 공정한 의사결정 규칙을 제시하고 기대 효과를 설명하시오.", image: null },
      { id: 2, name: '[2025 기출]', content: "소수 의견이 배제되지 않도록 회의 절차·의사소통 규범을 설계하고, 갈등 발생 시 조정 흐름도를 제시하시오.", image: null },
      { id: 3, name: '[2025 기출]', content: "회복적 학교문화 정착을 위한 학급 운영 연간 계획(예방-개입-사후회복)과 평가 지표를 설계하시오.", image: null },
      { id: 4, name: '[2024 기출]', content: "'우리 반 인성교육 브랜드'를 공동체적 역량(협력/배려/책임 중 택1)과 연결해 명칭·핵심 메시지·상징·활동 예시를 제시하고, 제작 이유와 의미를 설명하시오.", image: null },
      { id: 5, name: '[2024 기출]', content: "브랜드를 학교 교육과정(자치·동아리·프로젝트)과 연계한 월별 실행 계획과 학생 주도 운영 구조를 설계하시오.", image: null },
      { id: 6, name: '[2024 기출]', content: "브랜드 효과를 확인할 수 있는 성과지표(행동·참여·문화)와 점검 도구를 제시하시오.", image: null },
      { id: 7, name: '[2023 기출]', content: "제시된 SWOT을 근거로 학교 자율과제의 목표·성과지표·추진전략을 설계하고 근거를 설명하시오.", image: null },
      { id: 8, name: '[2023 기출]', content: "이해관계자(학생·학부모·지역) 협력 구조와 참여 유인책, 갈등 예방 장치를 포함한 실행 계획을 작성하시오.", image: null },
      { id: 9, name: '[2023 기출]', content: "중간점검·성과공유·환류 체계를 포함한 평가·개선 계획을 제시하시오.", image: null },
      { id: 10, name: '[2022 기출]', content: "고교학점제 관련 제시문을 기반으로 학생에게 기대되는 변화와 이에 따른 수업·평가·진로지도의 변화 방향을 제시하시오.", image: null },
      { id: 11, name: '[2022 기출]', content: "교과 선택 다양화에 대응한 개별·맞춤형 수업 운영(집중이수·블록형·프로젝트)과 협력적 평가 방안을 설계하시오.", image: null },
      { id: 12, name: '[2022 기출]', content: "학교 차원의 상담·과목 선택 지도 및 교육과정 편성 지원 체계를 제시하시오.", image: null }
    ];

    const defaultInstant = [
      { id: 1, name: '[2025 기출]', content: "학생회 안건 처리에서 편향이 발생할 때 교사의 개입 원칙과 단계별 실행을 말하시오.", image: null },
      { id: 2, name: '[2025 기출]', content: "학급 규칙 위반 학생과 또래 피해 학생을 대상으로 회복적 대화 절차를 어떻게 운영할지 답하시오.", image: null },
      { id: 3, name: '[2024 기출]', content: "학급 자치시간에 학생이 직접 실현할 수 있는 구체 방안 2가지를 제시하시오(역할 순환·또래칭찬/배지·써클).", image: null },
      { id: 4, name: '[2024 기출]', content: "낮은 참여 학생을 포용하기 위한 차등 역할·피드백·격려 전략을 간단히 답하시오.", image: null },
      { id: 5, name: '[2023 기출]', content: "협력 과정에서 발생한 갈등 사례에 대해 중재 절차와 의사소통 원칙을 답하시오.", image: null },
      { id: 6, name: '[2023 기출]', content: "목표 대비 성과 미달 시 지표 재설계와 전략 보완 방법을 간단히 설명하시오.", image: null },
      { id: 7, name: '[2022 기출]', content: "전공 외 자율동아리 지도 요청 시 교사로서의 대응과 안전·윤리 고려사항을 답하시오.", image: null },
      { id: 8, name: '[2022 기출]', content: "1일 진로체험학습을 전공과 연계해 설계하는 방법을 간단히 제시하시오.", image: null }
    ];

    try {
      const savedConceptual = localStorage.getItem('conceptual-questions');
      setConceptualQuestions(savedConceptual ? JSON.parse(savedConceptual) : defaultConceptual);
      
      const savedInstant = localStorage.getItem('instant-questions');
      setInstantQuestions(savedInstant ? JSON.parse(savedInstant) : defaultInstant);
      
      const savedRecords = localStorage.getItem('practice-records');
      if (savedRecords) setRecords(JSON.parse(savedRecords));
      
      if (!savedConceptual) localStorage.setItem('conceptual-questions', JSON.stringify(defaultConceptual));
      if (!savedInstant) localStorage.setItem('instant-questions', JSON.stringify(defaultInstant));
    } catch (e) {
      setConceptualQuestions(defaultConceptual);
      setInstantQuestions(defaultInstant);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && conceptualQuestions.length > 0) {
      localStorage.setItem('conceptual-questions', JSON.stringify(conceptualQuestions));
    }
  }, [conceptualQuestions, isLoading]);

  useEffect(() => {
    if (!isLoading && instantQuestions.length > 0) {
      localStorage.setItem('instant-questions', JSON.stringify(instantQuestions));
    }
  }, [instantQuestions, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('practice-records', JSON.stringify(records));
    }
  }, [records, isLoading]);

  useEffect(() => {
    if (currentPage === 'interview' && (interviewStage === 'planning' || interviewStage === 'interview')) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            if (interviewStage === 'planning') {
              setPlanningTime(900);
            } else {
              setInterviewTime(900);
              setInterviewStage('finished');
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop();
                setIsRecording(false);
              }
            }
            return 0;
          }
          return prev - 1;
        });
        
        if (interviewStage === 'planning') setPlanningTime(prev => prev + 1);
        else if (interviewStage === 'interview') setInterviewTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage, interviewStage, isRecording]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.log('음성 인식 오류:', event.error);
        if (event.error === 'no-speech') {
          console.log('음성이 감지되지 않습니다.');
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording && interviewStage === 'interview') {
          recognitionRef.current.start();
        }
      };
    }
  }, [isRecording, interviewStage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    const shuffled = [...conceptualQuestions].sort(() => 0.5 - Math.random());
    setSelectedConceptual(shuffled.slice(0, 3));
    const shuffledInstant = [...instantQuestions].sort(() => 0.5 - Math.random());
    setSelectedInstant(shuffledInstant.slice(0, 2));
    setCurrentPage('interview');
    setInterviewStage('planning');
    setTimeLeft(900);
    setPlanningTime(0);
    setInterviewTime(0);
    setShowInstant1(false);
    setShowInstant2(false);
    setQuestionTimes({});
    setButtonStates({});
    setQuestionStartTime(null);
    setCurrentQuestionIndex(0);
  };

  const startInterviewPhase = () => {
    setPlanningTime(900 - timeLeft);
    setInterviewStage('interview');
    setTimeLeft(900);
    setQuestionStartTime(Date.now());
    if (recognitionRef.current) {
      setIsRecording(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const finishEarly = () => {
    if (interviewStage === 'planning') {
      setPlanningTime(900 - timeLeft);
      startInterviewPhase();
    } else if (interviewStage === 'interview') {
      if (questionStartTime) {
        const duration = Math.floor((Date.now() - questionStartTime) / 1000);
        if (showInstant1 || showInstant2) {
          setQuestionTimes(prev => ({ ...prev, instant_all: duration }));
        } else if (currentQuestionIndex < 3) {
          setQuestionTimes(prev => ({ ...prev, [`conceptual_${currentQuestionIndex}`]: duration }));
        }
      }
      
      setInterviewTime(900 - timeLeft);
      setInterviewStage('finished');
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const showInstantQuestion = (num) => {
    // 이전 문항 시간 기록
    if (questionStartTime) {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      const questionKey = num === 1 ? 'conceptual_total' : 'instant_1';
      setQuestionTimes(prev => ({ ...prev, [questionKey]: duration }));
    }
    
    // 새 문항 시작
    setQuestionStartTime(Date.now());
    
    if (num === 1) {
      setShowInstant1(true);
      speakText(selectedInstant[0].content);
    } else {
      setShowInstant2(true);
      speakText(selectedInstant[1].content);
    }
  };

  const saveRecord = () => {
    const record = {
      date: new Date().toLocaleString('ko-KR'),
      questions: selectedConceptual,
      instantQuestions: selectedInstant,
      transcript: transcript,
      planningTime: formatTime(planningTime),
      interviewTime: formatTime(interviewTime),
      questionTimes: questionTimes
    };

    console.log('저장되는 기록:', record); // 디버그
    setRecords(prev => [record, ...prev]);
    setCurrentPage('records');
  };

  const addQuestion = (type, name, content, image) => {
    const newQuestion = { id: Date.now(), name, content, image };
    if (type === 'conceptual') {
      setConceptualQuestions(prev => [...prev, newQuestion]);
    } else {
      setInstantQuestions(prev => [...prev, newQuestion]);
    }
  };

  const addMultipleQuestions = (type, questions) => {
    const newQuestions = questions.map((q, idx) => ({
      id: Date.now() + idx,
      name: q.name || '[업로드]',
      content: q.content || '',
      image: null
    }));
    
    if (type === 'conceptual') {
      setConceptualQuestions(prev => [...prev, ...newQuestions]);
    } else {
      setInstantQuestions(prev => [...prev, ...newQuestions]);
    }
  };

  const updateQuestion = (type, id, name, content, image) => {
    if (type === 'conceptual') {
      setConceptualQuestions(prev => prev.map(q => q.id === id ? { ...q, name, content, image } : q));
    } else {
      setInstantQuestions(prev => prev.map(q => q.id === id ? { ...q, name, content, image } : q));
    }
  };

  const deleteQuestion = (type, id) => {
    if (type === 'conceptual') {
      setConceptualQuestions(prev => prev.filter(q => q.id !== id));
    } else {
      setInstantQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const deleteRecord = (index) => {
    if (window.confirm('이 연습 기록을 삭제하시겠습니까?')) {
      setRecords(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const getStorageUsage = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      const usedKB = (totalSize / 1024).toFixed(2);
      const maxKB = 5120; // 5MB
      const percentage = ((totalSize / (maxKB * 1024)) * 100).toFixed(1);
      return { usedKB, maxKB, percentage: Math.min(percentage, 100) };
    } catch (e) {
      return { usedKB: 0, maxKB: 5120, percentage: 0 };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'home') {
    const storageInfo = getStorageUsage();
    const isWarning = parseFloat(storageInfo.percentage) > 80;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-3">경기도 중등 임용고시</h1>
            <h2 className="text-3xl font-bold text-indigo-700">면접 연습 프로그램</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => setCurrentPage('conceptual-list')} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <List className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">구상형 문항</h3>
              <p className="text-gray-600">문항 관리</p>
            </button>
            <button onClick={() => setCurrentPage('instant-list')} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <List className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">즉답형 문항</h3>
              <p className="text-gray-600">문항 관리</p>
            </button>
            <button onClick={startInterview} className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
              <Play className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">면접 연습</h3>
              <p className="text-indigo-100">시작하기</p>
            </button>
          </div>

          {records.length > 0 && (
            <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">최근 연습 기록</h3>
              <div className="space-y-3">
                {records.slice(0, 3).map((record, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setCurrentPage('records')} className="mt-4 w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                전체 기록 보기
              </button>
            </div>
          )}

          <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">💾 저장 공간 사용량</span>
              <span className={`text-xs font-bold ${isWarning ? 'text-red-600' : 'text-gray-600'}`}>
                {storageInfo.usedKB} KB / {storageInfo.maxKB} KB ({storageInfo.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  parseFloat(storageInfo.percentage) > 90 ? 'bg-red-500' : 
                  parseFloat(storageInfo.percentage) > 80 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${storageInfo.percentage}%` }}
              ></div>
            </div>
            {isWarning && (
              <p className="text-xs text-yellow-700 mt-2">⚠️ 저장 공간이 80%를 초과했습니다. 불필요한 기록이나 이미지를 삭제해주세요.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'conceptual-list' || currentPage === 'instant-list') {
    const QuestionListPage = () => {
      const type = currentPage === 'conceptual-list' ? 'conceptual' : 'instant';
      const questions = type === 'conceptual' ? conceptualQuestions : instantQuestions;
      const title = type === 'conceptual' ? '구상형 문항' : '즉답형 문항';

      const [showForm, setShowForm] = useState(false);
      const [editingId, setEditingId] = useState(null);
      const [formName, setFormName] = useState('');
      const [formContent, setFormContent] = useState('');
      const [formImage, setFormImage] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      const fileInputRef = useRef(null);
      const excelInputRef = useRef(null);

      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormImage(reader.result);
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // 첫 행은 헤더로 간주하고 스킵
            const questions = jsonData.slice(1)
              .filter(row => row[0] && row[1]) // 문항명과 내용이 있는 행만
              .map(row => ({
                name: String(row[0] || ''),
                content: String(row[1] || '')
              }));

            if (questions.length > 0) {
              addMultipleQuestions(type, questions);
              alert(`${questions.length}개의 문항이 추가되었습니다.`);
            } else {
              alert('엑셀 파일에서 유효한 문항을 찾을 수 없습니다.\n\n형식: 첫 번째 열(문항명), 두 번째 열(문항내용)');
            }
          } catch (error) {
            alert('엑셀 파일을 읽는 중 오류가 발생했습니다.\n\n지원 형식: .xlsx, .xls\n형식: 첫 번째 열(문항명), 두 번째 열(문항내용)');
          }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = '';
      };

      const downloadExcelTemplate = () => {
        if (typeof XLSX === 'undefined') {
          alert('엑셀 라이브러리 로딩 중입니다. 잠시 후 다시 시도해주세요.');
          return;
        }

        // 템플릿 데이터 생성
        const templateData = [
          ['문항명', '문항내용'],
          ['[2024 기출]', '인성교육의 일환으로 우리 반 인성교육 브랜드를 제작하고자 한다...'],
          ['[2023 기출]', 'SWOT 분석을 근거로 학교 자율과제의 목표를 설계하시오...'],
          ['[예상 문제]', '학급 자치활동 활성화를 위한 방안을 제시하시오...']
        ];

        // 워크북 생성
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(templateData);

        // 열 너비 설정
        ws['!cols'] = [
          { wch: 15 },  // 문항명 열 너비
          { wch: 80 }   // 문항내용 열 너비
        ];

        // 워크시트를 워크북에 추가
        XLSX.utils.book_append_sheet(wb, ws, '문항');

        // 파일 다운로드
        const fileName = type === 'conceptual' ? '구상형_문항_템플릿.xlsx' : '즉답형_문항_템플릿.xlsx';
        XLSX.writeFile(wb, fileName);
      };

      const openEditForm = (question) => {
        setEditingId(question.id);
        setFormName(question.name);
        setFormContent(question.content);
        setFormImage(question.image);
        setImagePreview(question.image);
        setShowForm(true);
      };

      const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormName('');
        setFormContent('');
        setFormImage(null);
        setImagePreview(null);
      };

      const handleSubmit = () => {
        if (formName && formContent) {
          if (editingId) {
            updateQuestion(type, editingId, formName, formContent, formImage);
          } else {
            addQuestion(type, formName, formContent, formImage);
          }
          resetForm();
        }
      };

      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button onClick={() => setCurrentPage('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
                <ArrowLeft className="w-5 h-5 mr-2" />
                뒤로가기
              </button>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">{title} 리스트</h2>
                <div className="flex gap-2">
                  <button onClick={downloadExcelTemplate} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Download className="w-5 h-5 mr-2" />
                    템플릿 다운로드
                  </button>
                  <input type="file" ref={excelInputRef} accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
                  <button onClick={() => excelInputRef.current?.click()} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <Upload className="w-5 h-5 mr-2" />
                    엑셀 업로드
                  </button>
                  <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <Plus className="w-5 h-5 mr-2" />
                    추가
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">📊 엑셀 업로드 방법</p>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. "템플릿 다운로드" 버튼으로 예시 파일 받기</li>
                <li>2. 엑셀에서 문항명과 문항내용 작성</li>
                <li>3. "엑셀 업로드" 버튼으로 파일 업로드</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">※ 첫 행(헤더)은 자동으로 스킵됩니다</p>
            </div>

            {showForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4">{editingId ? '문항 수정' : '문항 추가'}</h3>
                <input type="text" placeholder="문항명 (예: [2024 기출])" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full p-3 border rounded-lg mb-3" />
                <textarea placeholder="문항 내용" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="w-full p-3 border rounded-lg mb-3 h-32" />
                
                <div className="mb-3">
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                    이미지 업로드
                  </button>
                </div>

                {imagePreview && (
                  <div className="mb-3 relative">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-64 rounded-lg" />
                    <button type="button" onClick={() => { setFormImage(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                    {editingId ? '수정' : '저장'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                    취소
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">{q.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditForm(q)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-5 h-5" /></button>
                      <button type="button" onClick={() => deleteQuestion(type, q.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap text-base font-medium leading-relaxed mb-3">{q.content}</p>
                  {q.image && <img src={q.image} alt="문항 이미지" className="max-w-full h-auto max-h-64 rounded-lg mt-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <QuestionListPage />;
  }

  if (currentPage === 'interview') {
    const handleShowInstant = () => {
      if (questionStartTime && currentQuestionIndex < 3) {
        const duration = Math.floor((Date.now() - questionStartTime) / 1000);
        setQuestionTimes(prev => ({ ...prev, [`conceptual_${2}`]: duration }));
      }
      setShowInstant1(true);
      setShowInstant2(true);
      setQuestionStartTime(Date.now());
      setCurrentQuestionIndex(3);
      if (selectedInstant[0] && selectedInstant[1]) {
        speakText(selectedInstant[0].content + '. ' + selectedInstant[1].content);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setCurrentPage('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로가기
          </button>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-indigo-900 mb-4">
                {interviewStage === 'planning' ? '구상 시간' : interviewStage === 'interview' ? '면접 시간' : '면접 종료'}
              </h2>
              {interviewStage === 'interview' && (
                <div className="flex items-center gap-2 mb-4">
                  {isRecording ? <Mic className="w-6 h-6 text-red-500 animate-pulse" /> : <MicOff className="w-6 h-6 text-gray-400" />}
                  <span className="text-sm text-gray-600 font-medium">{isRecording ? '녹음 중' : '녹음 대기'}</span>
                </div>
              )}
            </div>

            {interviewStage === 'finished' && (
              <div className="text-center py-12">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">모의 면접이 종료되었습니다</h3>
                  <p className="text-green-700">인사와 마무리까지 제대로 연습해보세요</p>
                </div>
                <button onClick={saveRecord} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                  결과 보기
                </button>
              </div>
            )}

            {interviewStage !== 'finished' && (
              <>
                <div className="space-y-6 mb-8">
                  {selectedConceptual.map((q, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm">구상형 {idx + 1}</span>
                          <span className="text-gray-700 font-semibold">{q.name}</span>
                        </div>
                        {interviewStage === 'interview' && !showInstant1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              console.log('🖱️ 버튼 클릭 - 구상형', idx);
                              markQuestionComplete('conceptual', idx);
                            }}
                            disabled={buttonStates[`conceptual_${idx}`] === true}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                              buttonStates[`conceptual_${idx}`] === true
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

                {interviewStage === 'planning' && timeLeft === 0 && (
                  <div className="text-center bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                    <p className="text-xl text-yellow-800 font-semibold mb-4">구상이 종료되었습니다. 면접 준비가 되었다면 다음 버튼을 눌러주세요.</p>
                    <button type="button" onClick={startInterviewPhase} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                      다음 (면접 시작)
                    </button>
                  </div>
                )}

                {interviewStage === 'interview' && (
                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={handleShowInstant} 
                        disabled={showInstant1}
                        className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
                          showInstant1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        즉답형 문제 보기
                      </button>
                    </div>

                    {showInstant1 && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm">즉답형 1</span>
                              <span className="text-gray-700 font-semibold">{selectedInstant[0]?.name}</span>
                            </div>
                            {!questionTimes.instant_all && (
                              <button 
                                type="button"
                                onClick={() => {
                                  console.log('버튼 클릭 - 즉답형 0');
                                  markQuestionComplete('instant', 0);
                                }}
                                disabled={questionTimes && questionTimes.instant_0 !== undefined}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                  questionTimes && questionTimes.instant_0 !== undefined
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75' 
                                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                                }`}
                              >
                                {questionTimes && questionTimes.instant_0 !== undefined
                                  ? `완료 ${formatTime(questionTimes.instant_0)}` 
                                  : '완료 (시간측정)'}
                              </button>
                            )}
                          </div>
                          <p className="text-gray-900 text-lg font-bold whitespace-pre-wrap leading-relaxed mb-3">{selectedInstant[0]?.content}</p>
                          {selectedInstant[0]?.image && <img src={selectedInstant[0].image} alt="문항 이미지" className="max-w-full h-auto max-h-96 rounded-lg mt-3" />}
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm">즉답형 2</span>
                              <span className="text-gray-700 font-semibold">{selectedInstant[1]?.name}</span>
                            </div>
                            {!questionTimes.instant_all && (
                              <button 
                                type="button"
                                onClick={() => {
                                  console.log('버튼 클릭 - 즉답형 1');
                                  markQuestionComplete('instant', 1);
                                }}
                                disabled={questionTimes && questionTimes.instant_1 !== undefined}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                  questionTimes && questionTimes.instant_1 !== undefined
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75' 
                                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                                }`}
                              >
                                {questionTimes && questionTimes.instant_1 !== undefined
                                  ? `완료 ${formatTime(questionTimes.instant_1)}` 
                                  : '완료 (시간측정)'}
                              </button>
                            )}
                          </div>
                          <p className="text-gray-900 text-lg font-bold whitespace-pre-wrap leading-relaxed mb-3">{selectedInstant[1]?.content}</p>
                          {selectedInstant[1]?.image && <img src={selectedInstant[1].image} alt="문항 이미지" className="max-w-full h-auto max-h-96 rounded-lg mt-3" />}
                        </div>
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
                  <button type="button" onClick={finishEarly} className="bg-green-600 text-white px-6 py-8 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                    완료
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'records') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button onClick={() => setCurrentPage('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
              <ArrowLeft className="w-5 h-5 mr-2" />
              뒤로가기
            </button>
            <h2 className="text-2xl font-bold text-gray-800">연습 기록</h2>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">아직 연습 기록이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-6">
              {records.map((record, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4 pb-4 border-b flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{record.date}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                          구상 시간: {record.planningTime}
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          답변 시간: {record.interviewTime}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteRecord(idx)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold">
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3">📝 구상형 문항</h4>
                      {record.questions.map((q, qIdx) => (
                        <div key={qIdx} className="mb-3 last:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {q.name}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap font-medium">{q.content}</p>
                        </div>
                      ))}
                    </div>

                    {record.instantQuestions && record.instantQuestions.length > 0 && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-3">💬 즉답형 문항</h4>
                        {record.instantQuestions.map((q, qIdx) => (
                          <div key={qIdx} className="mb-3 last:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {q.name}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap font-medium">{q.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-3">⏱️ 문항별 답변 시간</h4>
                      <div className="space-y-2">
                        {[0, 1, 2].map(idx => (
                          record.questionTimes?.[`conceptual_${idx}`] && (
                            <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded">
                              <span className="text-sm text-gray-700 font-medium">구상형 {idx + 1}번</span>
                              <span className="text-sm font-bold text-indigo-600">{formatTime(record.questionTimes[`conceptual_${idx}`])}</span>
                            </div>
                          )
                        ))}
                        {record.questionTimes?.instant_0 && (
                          <div className="flex justify-between items-center bg-white px-3 py-2 rounded">
                            <span className="text-sm text-gray-700 font-medium">즉답형 1번</span>
                            <span className="text-sm font-bold text-purple-600">{formatTime(record.questionTimes.instant_0)}</span>
                          </div>
                        )}
                        {record.questionTimes?.instant_1 && (
                          <div className="flex justify-between items-center bg-white px-3 py-2 rounded">
                            <span className="text-sm text-gray-700 font-medium">즉답형 2번</span>
                            <span className="text-sm font-bold text-purple-600">{formatTime(record.questionTimes.instant_1)}</span>
                          </div>
                        )}
                        {record.questionTimes?.instant_all && (
                          <div className="flex justify-between items-center bg-white px-3 py-2 rounded">
                            <span className="text-sm text-gray-700 font-medium">즉답형 전체</span>
                            <span className="text-sm font-bold text-purple-600">{formatTime(record.questionTimes.instant_all)}</span>
                          </div>
                        )}
                        {!record.questionTimes || Object.keys(record.questionTimes).length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-2">시간 측정 기록이 없습니다</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2">🎙️ 내가 한 답변</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{record.transcript || '녹음된 답변이 없습니다.'}</p>
                      {record.transcript && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs text-green-700">답변 글자 수: {record.transcript.length}자</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default InterviewPracticeApp;