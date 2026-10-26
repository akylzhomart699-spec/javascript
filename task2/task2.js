// Task 2B - PC configurator
// Each part has a number, strings, a boolean and an array.
const parts = [
    { id: 101, name: "Core i5 Starter", category: "CPU", price: 190, featured: false, tags: ["DDR4", "office"], ramType: "DDR4", score: 40 },
    { id: 102, name: "Ryzen 5 Value", category: "CPU", price: 220, featured: true, tags: ["DDR4", "gaming"], ramType: "DDR4", score: 47 },
    { id: 103, name: "Core i7 Pro", category: "CPU", price: 330, featured: false, tags: ["DDR5", "creator"], ramType: "DDR5", score: 70 },
    { id: 104, name: "Ryzen 7 Creator", category: "CPU", price: 350, featured: true, tags: ["DDR5", "multitasking"], ramType: "DDR5", score: 76 },
    { id: 201, name: "Arc A580", category: "GPU", price: 220, featured: false, tags: ["budget", "gaming"], ramType: null, score: 35 },
    { id: 202, name: "Radeon RX 7600", category: "GPU", price: 280, featured: true, tags: ["1080p", "gaming"], ramType: null, score: 49 },
    { id: 203, name: "GeForce RTX 4060", category: "GPU", price: 340, featured: true, tags: ["graphics", "gaming"], ramType: null, score: 58 },
    { id: 204, name: "GeForce RTX 4070", category: "GPU", price: 530, featured: false, tags: ["creator", "graphics"], ramType: null, score: 85 },
    { id: 301, name: "16GB DDR4 Kit", category: "RAM", price: 65, featured: false, tags: ["DDR4", "16GB"], ramType: "DDR4", score: 15 },
    { id: 302, name: "32GB DDR4 Kit", category: "RAM", price: 110, featured: true, tags: ["DDR4", "32GB"], ramType: "DDR4", score: 24 },
    { id: 303, name: "16GB DDR5 Kit", category: "RAM", price: 95, featured: false, tags: ["DDR5", "16GB"], ramType: "DDR5", score: 22 },
    { id: 304, name: "32GB DDR5 Kit", category: "RAM", price: 160, featured: true, tags: ["DDR5", "32GB"], ramType: "DDR5", score: 33 }
];

const categories = ["CPU", "GPU", "RAM"];
const categoryNames = { CPU: "Processors", GPU: "Graphics cards", RAM: "Memory kits" };
const MIN_BUDGET = 450;
const MAX_BUDGET = 2000;
const MAX_SAVED = 3;

let budget = 900;
let choices = { CPU: null, GPU: null, RAM: null };
let savedBuilds = [];
let nextBuildId = 1;

const app = document.getElementById("builder-app");
const catalog = document.getElementById("catalog");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const budgetInput = document.getElementById("budget");
const notification = document.getElementById("notification");
const selectionBox = document.getElementById("selected-items");
const totalBox = document.getElementById("total");
const savedBox = document.getElementById("saved-builds");
const savedCount = document.getElementById("saved-count");
const comparisonBox = document.getElementById("comparison-table");

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function getPart(id) {
    return parts.find(part => part.id === id);
}

function getTotal(buildChoices) {
    let total = 0;
    for (const category of categories) {
        const part = getPart(buildChoices[category]);
        if (part) total += part.price;
    }
    return total;
}

function getScore(buildChoices) {
    let score = 0;
    for (const category of categories) {
        const part = getPart(buildChoices[category]);
        if (part) score += part.score;
    }
    return score;
}

function message(text, type) {
    notification.textContent = text;
    notification.className = "notice " + type;
}

function checkCompatibility(buildChoices) {
    const cpu = getPart(buildChoices.CPU);
    const ram = getPart(buildChoices.RAM);
    if (cpu && ram && cpu.ramType !== ram.ramType) {
        return `${cpu.name} uses the ${cpu.ramType} profile, but ${ram.name} is ${ram.ramType}. Choose matching memory.`;
    }
    return "";
}

function choosePart(id) {
    const part = getPart(id);
    if (!part) {
        message("This item does not exist.", "error");
        return;
    }
    const newChoices = { ...choices, [part.category]: id };
    const incompatibility = checkCompatibility(newChoices);
    if (incompatibility) {
        message("Incompatible: " + incompatibility, "error");
        return;
    }
    const newTotal = getTotal(newChoices);
    if (newTotal > budget) {
        message(`Budget exceeded: $${newTotal} is above your $${budget} limit. Choose a cheaper part or increase the budget.`, "error");
        return;
    }
    choices = newChoices;
    message(`${part.name} selected. Your total is $${newTotal}.`, "success");
    render();
}

function renderCatalog() {
    catalog.replaceChildren();
    const query = searchInput.value.toLowerCase().trim();
    const categoryFilter = filterSelect.value;
    let found = 0;

    for (const category of categories) {
        if (categoryFilter !== "all" && categoryFilter !== category) continue;

        const group = makeElement("section", "category-group");
        const title = makeElement("h2", "category-title", categoryNames[category]);
        const grid = makeElement("div", "part-grid");
        group.append(title, grid);

        for (const part of parts) {
            if (part.category !== category) continue;
            const searchableText = (part.name + " " + part.tags.join(" ")).toLowerCase();
            if (!searchableText.includes(query)) continue;
            found += 1;

            const isSelected = choices[category] === part.id;
            const card = makeElement("article", "part-card");
            if (isSelected) card.classList.add("selected");
            const badges = makeElement("div", "part-meta");
            badges.append(makeElement("span", "tag", category));
            if (part.featured) badges.append(makeElement("span", "tag featured", "Popular"));
            const name = makeElement("h3", "", part.name);
            const description = makeElement("p", "", `Tags: ${part.tags.join(", ")} · Score: ${part.score}`);
            const bottom = makeElement("div", "part-bottom");
            const price = makeElement("span", "price", `$${part.price}`);
            const button = makeElement("button", "", isSelected ? "Selected" : "Select");
            button.type = "button";
            button.dataset.action = "select";
            button.dataset.id = part.id;
            button.disabled = isSelected;
            bottom.append(price, button);
            card.append(badges, name, description, bottom);
            grid.append(card);
        }
        if (grid.childElementCount > 0) catalog.append(group);
    }
    if (found === 0) {
        catalog.append(makeElement("p", "panel empty", "No parts found. Try another search or filter."));
    }
}

function renderSelection() {
    selectionBox.replaceChildren();
    for (const category of categories) {
        const part = getPart(choices[category]);
        const row = makeElement("div", "selection-row");
        row.append(makeElement("strong", "", category));
        row.append(makeElement("span", "selection-name", part ? part.name : "Not selected"));
        selectionBox.append(row);
    }
    totalBox.replaceChildren();
    const total = getTotal(choices);
    const headline = makeElement("div", "total-main");
    headline.append(makeElement("span", "", "Total price"), makeElement("strong", "", `$${total}`));
    totalBox.append(headline);
    totalBox.append(makeElement("p", "total-small", `$${budget - total} remaining from your $${budget} budget`));
}

function saveBuild() {
    if (savedBuilds.length >= MAX_SAVED) {
        message(`Only ${MAX_SAVED} builds can be saved. Remove one to make space.`, "error");
        return;
    }
    for (const category of categories) {
        if (choices[category] === null) {
            message(`Select a ${category} before saving a complete build.`, "error");
            return;
        }
    }
    const incompatibility = checkCompatibility(choices);
    if (incompatibility) {
        message("Cannot save: " + incompatibility, "error");
        return;
    }
    if (getTotal(choices) > budget) {
        message("Cannot save: your selected parts cost more than your budget.", "error");
        return;
    }
    savedBuilds.push({ id: nextBuildId, items: { ...choices }, budget: budget });
    message(`Build ${nextBuildId} saved. You can compare it below.`, "success");
    nextBuildId += 1;
    render();
}

function removeBuild(id) {
    const before = savedBuilds.length;
    savedBuilds = savedBuilds.filter(build => build.id !== id);
    if (savedBuilds.length === before) return;
    message(`Build ${id} removed.`, "info");
    render();
}

function renderSaved() {
    savedBox.replaceChildren();
    savedCount.textContent = `${savedBuilds.length}/${MAX_SAVED}`;
    if (savedBuilds.length === 0) {
        savedBox.append(makeElement("p", "empty", "Nothing saved yet. Choose three parts and press Save build."));
        return;
    }
    for (const build of savedBuilds) {
        const card = makeElement("div", "saved-card");
        card.append(makeElement("strong", "", `Build ${build.id}`));
        card.append(makeElement("p", "", `$${getTotal(build.items)} total · Score ${getScore(build.items)} · Budget $${build.budget}`));
        const button = makeElement("button", "", "Remove");
        button.type = "button";
        button.dataset.action = "remove";
        button.dataset.id = build.id;
        card.append(button);
        savedBox.append(card);
    }
}

function renderComparison() {
    comparisonBox.replaceChildren();
    if (savedBuilds.length === 0) {
        comparisonBox.append(makeElement("p", "empty", "Save at least one build to see a comparison. Save two or three to compare side by side."));
        return;
    }
    const wrapper = makeElement("div", "table-wrap");
    const table = document.createElement("table");
    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.append(makeElement("th", "", "Component"));
    for (const build of savedBuilds) headerRow.append(makeElement("th", "", `Build ${build.id}`));
    head.append(headerRow);
    const body = document.createElement("tbody");
    for (const category of [...categories, "Total", "Score"]) {
        const row = document.createElement("tr");
        row.append(makeElement("th", "", category));
        for (const build of savedBuilds) {
            let value = "";
            if (category === "Total") value = `$${getTotal(build.items)}`;
            else if (category === "Score") value = String(getScore(build.items));
            else value = getPart(build.items[category]).name;
            row.append(makeElement("td", "", value));
        }
        body.append(row);
    }
    table.append(head, body);
    wrapper.append(table);
    comparisonBox.append(wrapper);
}

function render() {
    renderCatalog();
    renderSelection();
    renderSaved();
    renderComparison();
}

// Event delegation: one click listener handles ALL item buttons.
app.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button || !app.contains(button)) return;
    const action = button.dataset.action;
    if (action === "select") choosePart(Number(button.dataset.id));
    else if (action === "save") saveBuild();
    else if (action === "clear") {
        choices = { CPU: null, GPU: null, RAM: null };
        message("Current selection cleared. Saved builds are kept.", "info");
        render();
    }
    else if (action === "remove") removeBuild(Number(button.dataset.id));
});

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
budgetInput.addEventListener("change", function () {
    const nextBudget = Number(budgetInput.value);
    if (!Number.isInteger(nextBudget) || nextBudget < MIN_BUDGET || nextBudget > MAX_BUDGET) {
        budgetInput.value = budget;
        message(`Enter a whole-number budget from $${MIN_BUDGET} to $${MAX_BUDGET}.`, "error");
        return;
    }
    if (getTotal(choices) > nextBudget) {
        budgetInput.value = budget;
        message("This budget is below your selected parts' total. Change parts first.", "error");
        return;
    }
    budget = nextBudget;
    message(`Budget updated to $${budget}.`, "info");
    render();
});

render();
