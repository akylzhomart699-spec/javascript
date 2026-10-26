// Task 3B - Character creator with live validation
const TOTAL_POINTS = 20;
const MIN_SKILL = 1;
const MAX_SKILL = 10;
const CLASS_MINIMUM = 6;
const MAX_SKILL_DIFFERENCE = 6;
const NUMBER_START = 10000;
const NUMBER_END = 99999;

const takenNames = ["alex", "nova", "shadow"];
const classMainSkills = { Warrior: "strength", Mage: "magic", Ranger: "agility" };
const skills = ["strength", "magic", "agility", "intelligence"];
const fields = ["hero-name", "hero-class", "hero-color", ...skills];

const form = document.getElementById("character-form");
const summary = document.getElementById("error-summary");
const resultArea = document.getElementById("result-area");
const previewCard = document.getElementById("preview-card");
const previewName = document.getElementById("preview-name");
const previewClass = document.getElementById("preview-class");
const previewSkills = document.getElementById("preview-skills");
const pointsStatus = document.getElementById("points-status");
const resetButton = document.getElementById("reset-button");

const touched = new Set();
let triedToSubmit = false;

// Browser popup messages are off, but required/min/max are still checked.
form.noValidate = true;

function inputValue(id) {
    return document.getElementById(id).value;
}

function getNumbers() {
    const values = {};
    for (const skill of skills) {
        const input = document.getElementById(skill);
        values[skill] = input.value === "" ? NaN : Number(input.value);
    }
    return values;
}

function getProblems() {
    const problems = {};
    for (const id of fields) problems[id] = [];

    const nameInput = document.getElementById("hero-name");
    const name = nameInput.value.trim();
    if (!name) problems["hero-name"].push("Please enter a character name.");
    else if (name.length < 3 || name.length > 20 || !nameInput.checkValidity()) {
        problems["hero-name"].push("Name must be 3 to 20 characters long.");
    } else if (takenNames.includes(name.toLowerCase())) {
        problems["hero-name"].push("This name is already taken. Try another one.");
    }

    const heroClass = inputValue("hero-class");
    const heroColor = inputValue("hero-color");
    if (!heroClass) problems["hero-class"].push("Choose a character class.");
    if (!heroColor) problems["hero-color"].push("Choose a character color.");

    const numbers = getNumbers();
    let validSkills = true;
    let total = 0;
    for (const skill of skills) {
        const input = document.getElementById(skill);
        const value = numbers[skill];
        if (!Number.isInteger(value) || value < MIN_SKILL || value > MAX_SKILL || !input.checkValidity()) {
            problems[skill].push(`Enter a whole number from ${MIN_SKILL} to ${MAX_SKILL}.`);
            validSkills = false;
        } else {
            total += value;
        }
    }

    if (validSkills) {
        // JS-only rule 1: all four skills together must be exactly 20.
        if (total !== TOTAL_POINTS) {
            problems.intelligence.push(`Total must be ${TOTAL_POINTS} points. You used ${total}.`);
        }

        // JS-only rule 2: the class decides which skill must be at least 6.
        const requiredSkill = classMainSkills[heroClass];
        if (requiredSkill && numbers[requiredSkill] < CLASS_MINIMUM) {
            problems["hero-class"].push(`${heroClass} requires ${requiredSkill} ${CLASS_MINIMUM} or higher.`);
        }

        // JS-only rule 3: the strongest and weakest skills must be balanced.
        const values = skills.map(skill => numbers[skill]);
        const difference = Math.max(...values) - Math.min(...values);
        if (difference > MAX_SKILL_DIFFERENCE) {
            problems.intelligence.push(`Skill difference must be ${MAX_SKILL_DIFFERENCE} or less (now ${difference}).`);
        }
    }

    // JS-only rule 4: name must be unique (checked with the array above).
    return problems;
}

function updateValidation() {
    const problems = getProblems();
    for (const id of fields) {
        const input = document.getElementById(id);
        const errorText = document.getElementById("error-" + id);
        const shouldShow = touched.has(id) || triedToSubmit;
        errorText.textContent = shouldShow ? problems[id].join(" ") : "";
        input.setAttribute("aria-invalid", shouldShow && problems[id].length > 0 ? "true" : "false");
    }

    if (triedToSubmit) {
        let count = 0;
        for (const id of fields) count += problems[id].length;
        if (count > 0) {
            summary.hidden = false;
            summary.textContent = `Please fix ${count} error(s) before creating your character.`;
        } else {
            summary.hidden = true;
            summary.textContent = "";
        }
    }
    return problems;
}

function renderPreview() {
    const name = inputValue("hero-name").trim();
    const heroClass = inputValue("hero-class");
    const color = inputValue("hero-color");
    previewName.textContent = name || "Your hero";
    previewClass.textContent = heroClass || "Choose a class";
    previewCard.className = "preview-card " + (color ? "theme-" + color : "theme-neutral");

    previewSkills.replaceChildren();
    let total = 0;
    let incomplete = false;
    for (const skill of skills) {
        const raw = inputValue(skill);
        const value = Number(raw);
        const box = document.createElement("div");
        box.className = "preview-skill";
        const label = document.createElement("span");
        label.textContent = skill.charAt(0).toUpperCase() + skill.slice(1);
        const numberText = document.createElement("strong");
        numberText.textContent = raw === "" ? "–" : raw;
        box.append(label, numberText);
        previewSkills.append(box);
        if (raw === "" || !Number.isFinite(value)) incomplete = true;
        else total += value;
    }
    if (incomplete) {
        pointsStatus.textContent = "Enter all four skills to calculate points.";
        pointsStatus.className = "points under";
    } else {
        const remaining = TOTAL_POINTS - total;
        pointsStatus.textContent = `Points remaining: ${remaining}`;
        pointsStatus.className = "points";
        if (remaining < 0) pointsStatus.classList.add("over");
        else if (remaining > 0) pointsStatus.classList.add("under");
    }
}

function clearValidation() {
    touched.clear();
    triedToSubmit = false;
    summary.hidden = true;
    summary.textContent = "";
    for (const id of fields) {
        document.getElementById("error-" + id).textContent = "";
        document.getElementById(id).setAttribute("aria-invalid", "false");
    }
}

function makeResult(name, heroClass, color, numbers) {
    const code = Math.floor(Math.random() * (NUMBER_END - NUMBER_START + 1)) + NUMBER_START;
    const card = document.createElement("article");
    card.className = "result-card";
    const title = document.createElement("h2");
    title.textContent = "Character created successfully!";
    const info = document.createElement("p");
    info.textContent = `Character #${code}: ${name} · ${heroClass} · ${color}`;
    const stats = document.createElement("p");
    stats.textContent = skills.map(skill => `${skill}: ${numbers[skill]}`).join(" | ");
    const note = document.createElement("p");
    note.textContent = "Your character is saved for this page session. This name is now taken.";
    card.append(title, info, stats, note);
    resultArea.replaceChildren(card);
}

function submitForm(event) {
    event.preventDefault();
    triedToSubmit = true;
    const problems = updateValidation();
    const firstInvalid = fields.find(id => problems[id].length > 0);
    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        return;
    }
    const name = inputValue("hero-name").trim();
    const heroClass = inputValue("hero-class");
    const color = inputValue("hero-color");
    const numbers = getNumbers();
    makeResult(name, heroClass, color, numbers);
    takenNames.push(name.toLowerCase());
    form.reset();
    clearValidation();
    renderPreview();
}

// First blur shows an error; later input immediately updates it.
form.addEventListener("blur", function (event) {
    if (!fields.includes(event.target.id)) return;
    touched.add(event.target.id);
    updateValidation();
}, true);

form.addEventListener("input", function () {
    renderPreview();
    updateValidation();
});
form.addEventListener("change", function () {
    renderPreview();
    updateValidation();
});
form.addEventListener("submit", submitForm);
resetButton.addEventListener("click", function () {
    form.reset();
    clearValidation();
    resultArea.replaceChildren();
    renderPreview();
});

renderPreview();
