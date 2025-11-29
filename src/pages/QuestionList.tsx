import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Upload, Plus, Edit2, Trash2, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PageType, Question } from '../types';
import { StorageService } from '../services/storage';

interface QuestionListProps {
    type: 'conceptual' | 'instant';
    onNavigate: (page: PageType) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ type, onNavigate }) => {
    const [questions, setQuestions] = useState<Question[]>(() =>
        type === 'conceptual' ? StorageService.getConceptualQuestions() : StorageService.getInstantQuestions()
    );

    const title = type === 'conceptual' ? '구상형 문항' : '즉답형 문항';

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formImage, setFormImage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const excelInputRef = useRef<HTMLInputElement>(null);

    const saveQuestions = (newQuestions: Question[]) => {
        setQuestions(newQuestions);
        if (type === 'conceptual') {
            StorageService.saveConceptualQuestions(newQuestions);
        } else {
            StorageService.saveInstantQuestions(newQuestions);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormImage(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

                // 첫 행은 헤더로 간주하고 스킵
                const newQuestions = jsonData.slice(1)
                    .filter(row => row[0] && row[1]) // 문항명과 내용이 있는 행만
                    .map((row, idx) => ({
                        id: Date.now() + idx,
                        name: String(row[0] || ''),
                        content: String(row[1] || ''),
                        image: null
                    }));

                if (newQuestions.length > 0) {
                    saveQuestions([...questions, ...newQuestions]);
                    alert(`${newQuestions.length}개의 문항이 추가되었습니다.`);
                } else {
                    alert('엑셀 파일에서 유효한 문항을 찾을 수 없습니다.\n\n형식: 첫 번째 열(문항명), 두 번째 열(문항내용)');
                }
            } catch (error) {
                alert('엑셀 파일을 읽는 중 오류가 발생했습니다.\n\n지원 형식: .xlsx, .xls\n형식: 첫 번째 열(문항명), 두 번째 열(문항내용)');
            }
        };
        reader.readAsArrayBuffer(file);
        if (e.target) e.target.value = '';
    };

    const downloadExcelTemplate = () => {
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

    const openEditForm = (question: Question) => {
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
                const updated = questions.map(q => q.id === editingId ? { ...q, name: formName, content: formContent, image: formImage } : q);
                saveQuestions(updated);
            } else {
                const newQuestion = { id: Date.now(), name: formName, content: formContent, image: formImage };
                saveQuestions([...questions, newQuestion]);
            }
            resetForm();
        }
    };

    const deleteQuestion = (id: number) => {
        if (window.confirm('이 문항을 삭제하시겠습니까?')) {
            saveQuestions(questions.filter(q => q.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button onClick={() => onNavigate('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
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
                                    <button type="button" onClick={() => deleteQuestion(q.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
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
