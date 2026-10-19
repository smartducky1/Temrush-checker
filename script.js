// ---- Edit your popup content here ----
const RESULTS = {
  eligible: {
    image: "assets/eligible.jpg",
    html: 'You are <span class="hl">TemListed</span>',
    cls: "yes",
  },
  notEligible: {
    image: "assets/not-eligible.jpg",
    html: "Oops sorry you didn\u2019t make it.",
    cls: "no",
  },
};
// --------------------------------------

const input = document.getElementById("wallet");
const checkBtn = document.getElementById("check");
const hint = document.getElementById("hint");
const overlay = document.getElementById("overlay");
const modal = overlay.querySelector(".modal");
const modalImg = document.getElementById("modal-img");
const modalText = document.getElementById("modal-text");

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

function showResult(r) {
  modal.className = "modal " + r.cls;
  modalText.innerHTML = r.html;
  modalImg.hidden = false;
  modalImg.onerror = () => { modalImg.hidden = true; };
  modalImg.src = r.image;
  overlay.hidden = false;
  document.getElementById("ok").focus();
}

function closeModal() {
  overlay.hidden = true;
  input.focus();
}

async function check() {
  const address = input.value.trim();
  hint.textContent = "";

  if (!ADDRESS_RE.test(address)) {
    hint.textContent = "Enter a valid wallet address starting with 0x.";
    input.focus();
    return;
  }

  checkBtn.disabled = true;
  const label = checkBtn.textContent;
  checkBtn.textContent = "CHECKING...";

  try {
    const res = await fetch("/api/check?address=" + encodeURIComponent(address));
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    showResult(data.eligible ? RESULTS.eligible : RESULTS.notEligible);
  } catch (e) {
    hint.textContent = "Could not check right now. Please try again.";
  } finally {
    checkBtn.disabled = false;
    checkBtn.textContent = label;
  }
}

checkBtn.addEventListener("click", check);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
document.getElementById("ok").addEventListener("click", closeModal);
document.getElementById("close").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});
