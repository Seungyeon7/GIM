import { Question, Record, StorageUsage } from '../types';

const CONCEPTUAL_KEY = 'conceptual-questions';
const INSTANT_KEY = 'instant-questions';
const RECORDS_KEY = 'practice-records';

const defaultConceptual: Question[] = [
    {
        "id": 1,
        "name": "[2024 기출]",
        "content": "다음 자료를 분석하여 담임교사와 교과교사로서의 노력 방안을 각각 2가지씩 말하시오. (자료: A 학교의 상황: 제거(E): 문해력 저하로 인한 기초학력, 개별화 교육, 감소(R): 학습격차, 교사 개인별 행정 업무의 양, 증가(R): 교사의 에듀테크 활용 역량, 교과별 디지털 활용 수업, 창조(C): 교육공동체의 에듀테크 활용 역량, 교육 행정 지원 에듀테크 개발 및 운영)",
        "image": null
    },
    {
        "id": 2,
        "name": "[2023 기출]",
        "content": "제시문을 참고하여 기초학력 향상을 위한 교과 교육 방안을 말하시오. (제시문: 기초학력 향상을 위해 학교 기반 교육이 중요하며 이를 위해 교육의 새로운 두 축을 활용하겠습니다.)",
        "image": null
    },
    {
        "id": 3,
        "name": "[2023 기출]",
        "content": "최근 처벌 중심 사안 처리가 한계로 지적되고 있다 학교폭력 문제에 대한 다음 상황을 분석하고 담임교사로서 교육적 해결 방안과 이때의 유의 사항을 말하시오. (상황: 학생 A와 학생 B 간의 급식실 언어폭력 및 신체 접촉 사건, 상호 신고)",
        "image": null
    },
    {
        "id": 4,
        "name": "[2023 기출]",
        "content": "다음 환경 분석 결과를 토대로 A 학교의 학교자율과제를 정하고자 한다. 다음 빈칸을 채우고, 이를 실현하기 위한 구체적인 교육 방안을 제시하시오.*학교자율과제: ___ 을/를 통한 ___. (A 학교환경분석결과: 강점(S): 학생의 학교 교육에 대한 높은 신뢰, 교육공동체의 인성교육 필요성 공감. 약점(W): 교과 연계 인성교육 프로그램 미비, 교육공동체 간 배려 부족. 기회(O): 지역 자원 풍부, 인성교육 관련 학교 예산 증가. 위협(T): 가정교육 부재로 기초 생활 습관 미비, 미디어에 무분별하게 노출)",
        "image": null
    },
    {
        "id": 5,
        "name": "[2022 기출]",
        "content": "다음 상황을 보고 진로지도 및 학업 설계에 어려움을 겪는 학생들을 지도할 방안을 3가지 제시하시오.(상황: 고교학점제가 전면 시행되면서 진로가 결정되지 않은 학생은 과목 선택에 어려움을 겪고 있다. 학생들이 희망하는 과목이 교내에 개설되지 않아 학업 역량을 키우는 데 어려움을 겪고 있다. 최소 학업 성취 수준 미도달 학생이 증가하고 있다)",
        "image": null
    },
    {
        "id": 6,
        "name": "[2022 기출]",
        "content": "코로나19로 학생들의 사회성이 많이 떨어졌다. 다음 제시문의 활동으로 학생들의 사회성을 증진시킬 프로그램을 만들고자 한다. 3가지 중 하나를 선택해 그 이유를 말하고, 이를 활용한 구체적인 사회성 증진 프로그램을 제시하시오. (제시문: 1. 또래활동, 2. 창의적체험활동, 3. 주제중심체험활동)",
        "image": null
    },
    {
        "id": 7,
        "name": "[2022 기출]",
        "content": "다음 A, B, C 학생의 상황을 바탕으로 구체적인 학급생활협약 제정 방안을 이야기하시오. (A 학생: 우리 학급의 문제 상황을 해결하기 위해 학급생활협약이 필요해. 우리가 스스로 만들자고 선생님께 건의하자. B 학생: 학급생활협약이 왜 필요한지 모르겠어. 학교 교칙만 지키면 되잖아. C 학생: 작년에 선생님이 일방적으로 정한 규칙 때문에 지각할 때마다 벌 청소를 했어. 청소 좀 안 했으면 좋겠어)",
        "image": null
    },
    {
        "id": 8,
        "name": "[2021 기출]",
        "content": "다음 상황에서 A, B 교사의 의견 중 어느 의견을 지지할지와 그 이유를 말하시오. (상황: A 교사와 B 교사가 함께 교과 연계 융합 수업을 3차시 프로젝트 수업으로 진행하였다. 그 과정을 수행평가로 하기로 했는데, 마지막 3차시 결과물을 제출하는 상황에서 수업 시간 종료 직전에 C 학생이 USB 외부입력장치 오류로 결과물을 제출하지 못하였다. 의견 A 교사: 저는 3차시 결과물은 평가에 반영해선 안 된다고 생각해요. 이전 1, 2차시 제출 내용에 대해서만 평가해야 해요. B 교사: 저는 C 학생의 3차시 결과물도 평가해야 한다고 생각해요)",
        "image": null
    },
    {
        "id": 9,
        "name": "[2021 기출]",
        "content": "다음 상황의 학생들에 대한 지도 방법을 보완하여 종합적으로 어떻게 지도할 것인지 구체적인 방안을 제시하시오. (상황: A 학생: 나는 열심히 하는데 친구들이 내 발표 내용을 인정해주지 않아 속상해. B 학생: 나에게는 어려운 과목이야. 그래서 수행평가를 할 때마다 어떻게 해야 할지 모르겠어. C 학생: 나는 수학을 잘해서 친구들에게 알려주고 싶은데, 친구들이 나를 싫어할까 봐 두려워)",
        "image": null
    },
    {
        "id": 10,
        "name": "[2021 기출]",
        "content": "코로나19 상황에서 원격 수업과 비교할 때대면 수업의 교육적 효과를 학습 지도와 인성 지도 측면에서 각각 말하시오.",
        "image": null
    },
    {
        "id": 11,
        "name": "[2020 기출]",
        "content": "다음은 A 학교의 급식실 질서에 관한 설문조사 결과이다. 설문조사에서 보이는 문제를 해결할 방안을 제시하시오. (설문조사 결과: 급식 질서에 대해 교사, 학생 모두 '매우 안 지켜짐' 또는 '안 지켜짐'이 높은 비율로 나타남)",
        "image": null
    },
    {
        "id": 12,
        "name": "[2020 기출]",
        "content": "A 학생의 상황을 보고, A 학생을 지원할 수 있는 방안을 제시하시오. (A 학생의 상황: 학교생활에 전반적으로 흥미가 없음. 4월 O일: 기초학력검사 결과, 기초학력 미달됨. 6월 O일: 자해 시도함)",
        "image": null
    },
    {
        "id": 13,
        "name": "[2019 기출]",
        "content": "미래교육을 위해 학생들의 창의력과 상상력을 키워주는 것이 중요하다. 학교 공간 중 하나를 선택하여 공간 재구성 방안을 말하시오. 단 다음의 조건을 모두 포함하시오. (조건 1. 공간을 선정한 이유 2. 재구성한 공간의 구체적 모습 3. 활용 방안과 교육적 효과)",
        "image": null
    },
    {
        "id": 14,
        "name": "[2019 기출]",
        "content": "학생들의 참여와 소통이 중요한 가운데, 우리 학급 학생들은 개별 학습은 적극적이고 성취도가 높지만 협동 학습은 참여도가 낮다고 교과 선생님들이 말해주신다. 담임으로서 협동을 활성화 할 방안을 3가지 말하시오.",
        "image": null
    },
    {
        "id": 15,
        "name": "[2019 기출]",
        "content": "학교에서는 수학능력시험 후나 학년말 고사가 끝난 후 다양한 프로그램을 운영하고 있다. 전환기 교육을 운영하는 방안을 말하시오.",
        "image": null
    },
    {
        "id": 16,
        "name": "[2018 기출]",
        "content": "고교학점제를 도입할 경우 학교, 학생 측면에서의 효과를 말하시오.",
        "image": null
    },
    {
        "id": 17,
        "name": "[2018 기출]",
        "content": "담임교사로서 사이버폭력 대처 방안 및 존중과 배려가 있는 학급을 위한 경영 전략을 말하시오.",
        "image": null
    },
    {
        "id": 18,
        "name": "[2017 기출]",
        "content": "제시문의 A 교사 학급 학생들에게 필요한 미래 핵심 역량을 언급하고, 담임교사로서 역량 육성 방안을 말하시오. (제시문: 체육대회 기간에 특정 학생만 남아서 늦게까지 고생하며 준비하였고, 나머지 학생들은 일찍 집에 갔다)",
        "image": null
    },
    {
        "id": 19,
        "name": "[2017 기출]",
        "content": "안전교육 7대 요소 중의 하나를 택하여 교과 연계 방안을 제시하시오. (7대 요소: 생활 안전교육, 교통안전교육, 폭력 예방 및 신변 보호 교육, 약물 및 사이버중독 예방 교육, 재난안전교육, 직업 안전교육, 응급처치 교육)",
        "image": null
    },
    {
        "id": 20,
        "name": "[2016 기출]",
        "content": "수험생 본인의 교육철학과 이를 학교 현장에서 어떻게 실천해 나갈 것인지 말하시오.",
        "image": null
    },
    {
        "id": 21,
        "name": "[2016 기출]",
        "content": "경기 정책 중 공감 가는 것을 한 가지 말하고 실현 방안을 말하시오.",
        "image": null
    }
];

const defaultInstant: Question[] = [
    {
        "id": 1,
        "name": "[2022 중등 기출]",
        "content": "수험생이 다음 상황의 교사라고 가정하고, 교사로서 바람직한 답변을 시연한 뒤 그렇게 답변한 이유를 설명하시오. (수업 시간에 규민이가 영철이랑 떠들자, 교사가 규민이를 따로 불러서 왜 수업 시간에 집중하지 않느냐고 물었다. 그러자 규민이는 “영철이도 같이 떠들었는데 왜 저만 혼내세요?”라고 되물었다)",
        "image": null
    },
    {
        "id": 2,
        "name": "[2022 중등 기출]",
        "content": "교육 실습생 시절 가장 어려움을 느꼈던 구체적 경험을 말하고, 이를 해결하기 위한 역량과 그 역량을 키울 수 있는 노력 방안에 대해 각각 2가지씩 말하시오.",
        "image": null
    },
    {
        "id": 3,
        "name": "[2022 중등 기출]",
        "content": "두 교사의 상황을 고려하여 대처 방안을 마련하시오. (A 교사: 학생에게 지속적으로 이야기했음에도 불구하고 수업 중 소란을 피운다. A 교사는 학생이 교사의 권위를 무시하고, 다른 학생들의 학습권을 침해하고 있다고 생각한다. B 교사: 학교에 발령 나고 학교폭력 업무에 배정되어 업무가 과중하다고 생각한다. 다음 해에는 담임교사를 하고 싶어, 이를 요청했으나 인력이 부족하여 한 해 더 업무를 맡아야 하는 상황이 되었다.)",
        "image": null
    },
    {
        "id": 4,
        "name": "[2021 중등 기출]",
        "content": "학생들이 자신의 경험을 매체로 표현하는 독서교육을 한다고 할 때, 이와 관련한 교과 연계 교육 방안을 말하시오.",
        "image": null
    },
    {
        "id": 5,
        "name": "[2021 중등 기출]",
        "content": "다음 상황에 처한 A 교사의 대처 방안을 말하시오. (B 교사가 자신의 업무인 진로 체험 활동 업무를 맡아달라고 부탁하였다. A 교사는 이미 업무 분장이 다 끝난 상태에서 자신의 업무가 정해져 있고, 진로 체험 활동 관련 업무도 해본 적이 없어 난감한 상황이다.)",
        "image": null
    },
    {
        "id": 6,
        "name": "[2020 중등 기출]",
        "content": "학생의 인적사항 공유, 학부모 동의 없는 정보 공유, 가명 처리 정보 공유 사례를 통해 개인정보 보호법 위반 여부를 판단하고, 청렴을 지키기 위한 계획 3가지를 말하시오.",
        "image": null
    },
    {
        "id": 7,
        "name": "[2020 중등 기출]",
        "content": "모둠 활동 시 무임승차가 발생하는 문제점을 분석하고 예방할 방안을 3가지 제시하시오.",
        "image": null
    },
    {
        "id": 8,
        "name": "[2019 중등 기출]",
        "content": "학생과 함께하는 민주시민교육 방안을 학급 활동과 교과교육 측면에서 각각 1가지씩 제시하시오.",
        "image": null
    },
    {
        "id": 9,
        "name": "[2019 중등 기출]",
        "content": "독서교육의 필요성과 교과와 연계한 독서교육 활성화 방안을 말하시오.",
        "image": null
    },
    {
        "id": 10,
        "name": "[2018 중등 기출]",
        "content": "교육과정-수업-평가-기록의 일체화 방안을 2가지 제시하시오.",
        "image": null
    },
    {
        "id": 11,
        "name": "[2018 중등 기출]",
        "content": "학업 중단 위기 학생을 지도할 방안을 2가지 제시하시오.",
        "image": null
    },
    {
        "id": 12,
        "name": "[2017 중등 기출]",
        "content": "교사가 되고 싶은 제자에게 자신의 교직 선택 계기 및 경험을 말하고, 현실적인 조언을 해줄 방안을 제시하시오.",
        "image": null
    },
    {
        "id": 13,
        "name": "[2017 중등 기출]",
        "content": "자유학년제로 인한 학력 저하 문제를 우려하는 학부모를 설득할 방안을 말하시오.",
        "image": null
    },
    {
        "id": 14,
        "name": "[2016 중등 기출]",
        "content": "교육 봉사를 통해 깨달은 점을 말하시오.",
        "image": null
    },
    {
        "id": 15,
        "name": "[2016 중등 기출]",
        "content": "배움에 흥미와 의지가 없는 학생을 위해 어떠한 노력을 할 것인지 말하시오.",
        "image": null
    },
    {
        "id": 16,
        "name": "[2016 중등 기출]",
        "content": "인생에서 슬펐거나 실패한 경험을 말하고, 이를 통해 얻은 경험이 앞으로의 교직 생활에 어떤 도움이 될지 말하시오.",
        "image": null
    },
    {
        "id": 17,
        "name": "[2016 중등 기출]",
        "content": "학교에 관심 없는 학부모들이 있는 학교에서 학부모를 학교공동체에 참여시킬 수 있는 방안을 말하시오.",
        "image": null
    }
];

export const StorageService = {
    getConceptualQuestions: (): Question[] => {
        try {
            const saved = localStorage.getItem(CONCEPTUAL_KEY);
            return saved ? JSON.parse(saved) : defaultConceptual;
        } catch {
            return defaultConceptual;
        }
    },

    saveConceptualQuestions: (questions: Question[]) => {
        localStorage.setItem(CONCEPTUAL_KEY, JSON.stringify(questions));
    },

    getInstantQuestions: (): Question[] => {
        try {
            const saved = localStorage.getItem(INSTANT_KEY);
            return saved ? JSON.parse(saved) : defaultInstant;
        } catch {
            return defaultInstant;
        }
    },

    saveInstantQuestions: (questions: Question[]) => {
        localStorage.setItem(INSTANT_KEY, JSON.stringify(questions));
    },

    getRecords: (): Record[] => {
        try {
            const saved = localStorage.getItem(RECORDS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    },

    saveRecords: (records: Record[]) => {
        localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    },

    getStorageUsage: (): StorageUsage => {
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
            return { usedKB, maxKB, percentage: Math.min(parseFloat(percentage), 100).toFixed(1) };
        } catch (e) {
            return { usedKB: '0', maxKB: 5120, percentage: '0' };
        }
    }
};
