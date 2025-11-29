import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { PageType, Record } from '../types';
import { formatTime } from '../utils/time';

interface RecordsProps {
    onNavigate: (page: PageType) => void;
    records: Record[];
    onDelete: (index: number) => void;
}

export const Records: React.FC<RecordsProps> = ({ onNavigate, records, onDelete }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <button onClick={() => onNavigate('home')} className="flex items-center bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 font-semibold mb-4 shadow-md">
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
                                    <button onClick={() => onDelete(idx)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold">
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
                                            {(!record.questionTimes || Object.keys(record.questionTimes).length === 0) && (
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
};
