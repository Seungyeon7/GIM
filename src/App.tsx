import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { QuestionList } from './pages/QuestionList';
import { Interview } from './pages/Interview';
import { Records } from './pages/Records';
import { PageType, Record } from './types';
import { StorageService } from './services/storage';

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        setRecords(StorageService.getRecords());
    }, [currentPage]);

    const handleNavigate = (page: PageType) => {
        setCurrentPage(page);
    };

    const handleInterviewFinish = (record: Record) => {
        const newRecords = [record, ...records];
        setRecords(newRecords);
        StorageService.saveRecords(newRecords);
        setCurrentPage('records');
    };

    const handleDeleteRecord = (index: number) => {
        if (window.confirm('이 연습 기록을 삭제하시겠습니까?')) {
            const newRecords = records.filter((_, idx) => idx !== index);
            setRecords(newRecords);
            StorageService.saveRecords(newRecords);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <Home
                        onNavigate={handleNavigate}
                        records={records}
                        startInterview={() => setCurrentPage('interview')}
                    />
                );
            case 'conceptual-list':
                return <QuestionList type="conceptual" onNavigate={handleNavigate} />;
            case 'instant-list':
                return <QuestionList type="instant" onNavigate={handleNavigate} />;
            case 'interview':
                return <Interview onNavigate={handleNavigate} onFinish={handleInterviewFinish} />;
            case 'records':
                return <Records onNavigate={handleNavigate} records={records} onDelete={handleDeleteRecord} />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <>
            {currentPage === 'home' ? (
                <Layout>
                    {renderPage()}
                </Layout>
            ) : (
                renderPage()
            )}
        </>
    );
}

export default App;
