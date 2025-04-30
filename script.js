let knowledgeBase = [
  {
    question: "پایتون چیست؟",
    answer: "پایتون یک زبان برنامه‌نویسی سطح بالا و ساده برای یادگیری است."
  },
  {
    question: "جاوااسکریپت چیست؟",
    answer: "جاوااسکریپت زبان برنامه‌نویسی اصلی وب است که در مرورگر اجرا می‌شود."
  }
];

// ذخیره در localStorage
function saveKnowledgeBase() {
  localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
}

// بارگیری از localStorage
function loadKnowledgeBase() {
  const saved = localStorage.getItem('knowledgeBase');
  if (saved) knowledgeBase = JSON.parse(saved);
}

document.getElementById('question').addEventListener('input', function () {
  document.getElementById('char-count').textContent = this.value.length;
});

function search() {
  const input = document.getElementById('question').value.trim();
  const answerBox = document.getElementById('answer');
  if (!input) {
    answerBox.textContent = 'لطفاً سوالی وارد کنید.';
    return;
  }

  answerBox.textContent = 'در حال جستجو...';

  setTimeout(() => {
    const exact = knowledgeBase.find(q =>
      q.question.toLowerCase() === input.toLowerCase()
    );

    if (exact) {
      answerBox.innerHTML = `<p>${exact.answer}</p>`;
    } else {
      const keywords = input.toLowerCase().split(' ');
      const similar = knowledgeBase.map(item => {
        const itemWords = item.question.toLowerCase().split(' ');
        const score = keywords.filter(k => itemWords.includes(k)).length;
        return { ...item, score };
      }).filter(q => q.score > 0).sort((a, b) => b.score - a.score);

      if (similar.length > 0) {
        answerBox.innerHTML = `
          <p>شاید منظورت این بود:</p>
          <p><strong>${similar[0].question}</strong></p>
          <p>${similar[0].answer}</p>
          <p class="similarity">تطابق: ${Math.min(100, similar[0].score * 25)}%</p>
        `;
      } else {
        answerBox.innerHTML = `
          <p>پاسخی برای این سوال پیدا نشد.</p>
          <div class="learn-form">
            <textarea id="new-answer" placeholder="پاسخ صحیح را وارد کنید..."></textarea>
            <button onclick="learn('${input.replace(/'/g, "\\'")}')">یاد بگیر</button>
          </div>
        `;
      }
    }
  }, 800);
}

function learn(question) {
  const newAnswer = document.getElementById('new-answer').value.trim();
  if (!newAnswer) {
    alert('لطفاً پاسخ را وارد کنید.');
    return;
  }

  knowledgeBase.push({ question, answer: newAnswer });
  saveKnowledgeBase();

  document.getElementById('answer').innerHTML = `
    <p>ممنون! یاد گرفتم:</p>
    <p><strong>${question}</strong></p>
    <p>${newAnswer}</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadKnowledgeBase();
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('submit-btn').addEventListener('click', search);
  document.getElementById('question').addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      search();
    }
  });
});
