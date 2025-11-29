import React, { useState } from 'react';
import { List, Play } from 'lucide-react';
import { PageType, Record } from '../types';

interface HomeProps {
    onNavigate: (page: PageType) => void;
    records: Record[];
    startInterview: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, records, startInterview }) => {
    const [showModal, setShowModal] = useState(false);

    const handleStartClick = () => {
        setShowModal(true);
    };

    const handleConfirmStart = () => {
        setShowModal(false);
        startInterview();
    };

    return (
        <div className="text-center mb-12 mt-8 relative">
            <h1 className="text-4xl font-bold text-indigo-900 mb-3">경기도 중등 임용고시</h1>
            <h2 className="text-3xl font-bold text-indigo-700">면접 연습 프로그램</h2>

            <div className="mt-12 mb-12">
                <button onClick={handleStartClick} className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white flex flex-col items-center justify-center group">
                    <Play className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-3xl font-bold mb-2">면접 연습 시작하기</h3>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-4">구상시작 안내</h3>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed text-left break-keep">
                            '구상시작'버튼을 누르면 바로 시간측정이 시작됩니다.<br />
                            구상할 펜과 종이를 준비해주세요.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all"
                            >
                                구상시작
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {records.length > 0 && (
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">최근 연습 기록</h3>
                    <div className="space-y-3">
                        {records.slice(0, 3).map((record, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                <p className="text-sm text-gray-600 font-medium">{record.date}</p>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                    {record.interviewTime}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onNavigate('records')} className="mt-4 w-full py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-semibold">
                        전체 기록 보기
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <button onClick={() => onNavigate('conceptual-list')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-indigo-100">
                    <List className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">구상형 문항 관리</h3>
                </button>
                <button onClick={() => onNavigate('instant-list')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-purple-100">
                    <List className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">즉답형 문항 관리</h3>
                </button>
            </div>
        </div>
    );
};
