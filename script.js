async function search() {
  const input = document.getElementById("question").value.trim();
  const answerBox = document.getElementById("answer");

  if (!input) {
    answerBox.textContent = "لطفاً یک سوال وارد کنید.";
    return;
  }

  const res = await fetch("questions.json");
  const questions = await res.json();

  const found = questions.find(q =>
    input.toLowerCase().includes(q.question.toLowerCase())
  );

  answerBox.textContent = found ? found.answer : "پاسخی یافت نشد.";
}