// پایگاه داده سوالات
let knowledgeBase = [
  {
    "question": "پایتون چیست؟",
    "answer": "پایتون یک زبان برنامه‌نویسی سطح بالا و ساده برای یادگیری است."
  },
  {
    "question": "جاوااسکریپت چیست؟",
    "answer": "جاوااسکریپت زبان برنامه‌نویسی اصلی وب است که در مرورگر اجرا می‌شود."
  },
  {
    "question": "ریاکت چیست؟",
    "answer": "ریاکت یک کتابخانه جاوااسکریپت برای ساخت رابط کاربری است."
  }
];

// ذخیره در localStorage
function saveKnowledgeBase() {
  localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
}

// بارگیری از localStorage
function loadKnowledgeBase() {
  const savedData = localStorage.getItem('knowledgeBase');
  if (savedData) {
    knowledgeBase = JSON.parse(savedData);
  }
}

// نمایش شمارنده کاراکتر
document.getElementById('question').addEventListener('input', function () {
  document.getElementById('char-count').textContent = this.value.length;
});

// تابع جستجوی پیشرفته با تطابق تقریبی
function search() {
  const questionInput = document.getElementById('question').value.trim();
  const answerElement = document.getElementById('answer');

  if (!questionInput) {
    answerElement.textContent = 'لطفاً یک سوال وارد کنید.';
    return;
  }

  answerElement.textContent = 'در حال جستجوی پاسخ...';
  document.getElementById('answer-box').classList.add('loading');

  setTimeout(() => {
    const exactMatch = knowledgeBase.find(item =>
      item.question.toLowerCase() === questionInput.toLowerCase()
    );

    if (exactMatch) {
      answerElement.textContent = exactMatch.answer;
      document.getElementById('answer-box').classList.remove('loading');
      return;
    }

    const keywords = questionInput.toLowerCase().split(' ');
    const similarQuestions = knowledgeBase.map(item => {
      const itemKeywords = item.question.toLowerCase().split(' ');
      const matches = keywords.filter(keyword =>
        itemKeywords.some(itemKeyword => itemKeyword.includes(keyword))
      );
      return {
        question: item.question,
        answer: item.answer,
        score: matches.length
      };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (similarQuestions.length > 0) {
      const bestMatch = similarQuestions[0];
      answerElement.innerHTML = `
        <p>شاید این پاسخ به کار شما بیاید:</p>
        <p><strong>${bestMatch.question}</strong></p>
        <p>${bestMatch.answer}</p>
        <p class="similarity">(میزان تطابق: ${Math.min(100, bestMatch.score * 30)}%)</p>
      `;
    } else {
      answerElement.innerHTML = `
        <p>پاسخی برای سوال شما یافت نشد.</p>
        <div class="learn-form">
          <p>می‌خواهید به من یاد بدهید چگونه پاسخ دهم؟</p>
          <textarea id="new-answer" placeholder="پاسخ صحیح را وارد کنید..."></textarea>
          <button onclick="learn('${questionInput.replace(/'/g, "\\'")}')">آموختن</button>
        </div>
      `;
    }

    document.getElementById('answer-box').classList.remove('loading');
  }, 1000);
}

// تابع یادگیری سوالات جدید
function learn(question) {
  const newAnswer = document.getElementById('new-answer').value.trim();

  if (!newAnswer) {
    alert('لطفاً پاسخ را وارد کنید.');
    return;
  }

  knowledgeBase.push({ question, answer: newAnswer });
  saveKnowledgeBase();

  document.getElementById('answer').innerHTML = `
    <p>ممنون! پاسخ جدید را یاد گرفتم.</p>
    <p><strong>سوال:</strong> ${question}</p>
    <p><strong>پاسخ:</strong> ${newAnswer}</p>
  `;

  const learnForm = document.querySelector('.learn-form');
  if (learnForm) learnForm.remove();
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function () {
  loadKnowledgeBase();
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('submit-btn').addEventListener('click', search);

  document.getElementById('question').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      search();
    }
  });
});
