let notes = []; // الملاحظات
let archivedNotes = []; // الملاحظات المؤرشفة

// تفعيل الوضع المظلم (Dark Mode)
const toggleThemeButton = document.getElementById('toggle-theme');
toggleThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// تغيير اللغة
const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  alert(`تم تغيير اللغة إلى: ${selectedLanguage}`);
  // هنا يمكن إضافة الوظائف الفعلية لتغيير اللغة مثل تغيير النصوص المعروضة بناءً على اللغة المحددة
});

// تخصيص لون الملاحظات
const noteColorPicker = document.getElementById('note-color');
noteColorPicker.addEventListener('input', (event) => {
  const noteColor = event.target.value;
  document.documentElement.style.setProperty('--note-color', noteColor);
});

// دالة لحفظ الملاحظات
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
}

// دالة لعرض الملاحظات
function renderNotes(filter = "all") {
  const container = document.getElementById("notes");
  container.innerHTML = "";
  
  const filteredNotes = filter === "all" ? notes.filter(note => !note.archived) : notes.filter(note => note.category === filter && !note.archived);
  filteredNotes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note" + (note.done ? " done" : "");
    div.style.backgroundColor = note.color;
    div.setAttribute("draggable", true); // إضافة خاصية السحب
    div.setAttribute("data-index", index); // تعيين رقم الملاحظة
    div.innerHTML = `
      <div>
        <span>${note.text}</span><br>
        <span style="font-size: 0.8rem;">${note.timestamp}</span>
      </div>
      <div>
        <button onclick="toggleDone(${index})">✔️</button>
        <button onclick="archiveNote(${index})">📦 أرشفة</button>
        <button onclick="deleteNote(${index})">🗑️ حذف</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// دالة أرشفة الملاحظة
function archiveNote(index) {
  const note = notes.splice(index, 1)[0];
  note.archived = true;
  archivedNotes.push(note);
  saveNotes();
  renderNotes();
}

// دالة حذف الملاحظة نهائيًا
function deleteNote(index) {
  const confirmDelete = confirm("هل أنت متأكد من أنك تريد حذف هذه الملاحظة نهائيًا؟");
  if (confirmDelete) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  }
}

// دالة لعرض الملاحظات المؤرشفة
function renderArchivedNotes() {
  const container = document.getElementById("archived-notes");
  container.innerHTML = "";
  
  archivedNotes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note" + (note.done ? " done" : "");
    div.style.backgroundColor = note.color;
    div.innerHTML = `
      <div>
        <span>${note.text}</span><br>
        <span style="font-size: 0.8rem;">${note.timestamp}</span>
      </div>
      <div>
        <button onclick="restoreNote(${index})">🔄 استعادة</button>
        <button onclick="deleteArchivedNote(${index})">🗑️ حذف نهائي</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// دالة استعادة الملاحظة من الأرشيف
function restoreNote(index) {
  const note = archivedNotes.splice(index, 1)[0];
  note.archived = false;
  notes.push(note);
  saveNotes();
  renderNotes();
  renderArchivedNotes();
}

// دالة لحذف الملاحظة المؤرشفة نهائيًا
function deleteArchivedNote(index) {
  const confirmDelete = confirm("هل أنت متأكد من أنك تريد حذف هذه الملاحظة المؤرشفة نهائيًا؟");
  if (confirmDelete) {
    archivedNotes.splice(index, 1);
    saveNotes();
    renderArchivedNotes();
  }
}

// تحميل الملاحظات من localStorage عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const storedNotes = localStorage.getItem("notes");
  const storedArchivedNotes = localStorage.getItem("archivedNotes");

  if (storedNotes) {
    notes = JSON.parse(storedNotes);
  }
  if (storedArchivedNotes) {
    archivedNotes = JSON.parse(storedArchivedNotes);
  }

  renderNotes();
  renderArchivedNotes();
});
