# Assignment 5 — JavaScript Basics (Tasks 1A, 2B, 3B)

This project contains three independent pages with **HTML + CSS + vanilla JavaScript**.

## How to run

1. Unzip the folder.
2. Open the **root `index.html`** in a browser.
3. Choose a task (1, 2 or 3). No installation or external library is required.
4. For GitHub Pages, upload the entire folder content (including the root index.html) into one repository.

## Files

- `index.html` — three-task start page
- `task1/index.html`, `task1/style.css`, `task1/task1.js` — Higher or Lower (Task 1A)
- `task2/index.html`, `task2/style.css`, `task2/task2.js` — PC Configurator (Task 2B)
- `task3/index.html`, `task3/style.css`, `task3/task3.js` — Character Creator (Task 3B)

## Task 1A — what to demonstrate

1. Guess Higher / Lower, observe the lives and streak.
2. An equal number counts as correct.
3. Do not select an option: the move is rejected and the state does not change.
4. After five correct answers in a row you win, or after three mistakes you lose.
5. Restart without reloading; Best Streak is kept.

**Explain:** `Math.floor(Math.random())`, strict equality (`===`), AND (`&&`), OR (`||`), conditions, `addEventListener`, constants and DOM updates.

## Task 2B — what to demonstrate

1. Search for "DDR5" and filter category "Memory kits"; search for random text to show the empty state.
2. Select CPU, GPU and RAM. A DDR4 CPU and DDR5 RAM are incompatible — the reason is shown, and the selection stays unchanged.
3. Try a more expensive part than the current budget; it is rejected.
4. Select three compatible parts and click Save build. Save two or three builds and compare them.
5. Attempt to save a fourth build to see the limit and remove a saved build to free a place.

**Explain:** The 12 objects have an `id` (number), `name` (string), `featured` (boolean), `tags` (array), and other fields. All part cards come from `document.createElement()` (not HTML strings); `render()` rebuilds them whenever the data changes. `getTotal()` calculates the sum using `for...of`. Event delegation uses one `click` listener on the parent element with `button[data-action]`.

## Task 3B — what to demonstrate

1. Change name, class, color and stats — the preview updates live.
2. Enter a taken name: Alex, Nova or Shadow. A name check happens after blur, then on subsequent typing.
3. Give a class an insufficient main skill: Warrior needs Strength 6, Mage Magic 6 and Ranger Agility 6.
4. Use a wrong skill total (not 20).
5. Use an unbalanced spread (highest minus lowest > 6).
6. Submit invalid data: error count appears at top and focus moves to the first invalid input.
7. Fill valid data, create the character, observe confirmation and form reset.

**The four JavaScript-only validation rules for your report:**

| Field / fields | Rule | Valid example | Invalid example |
| --- | --- | --- | --- |
| Character name | The name (case-insensitive) must not be in `takenNames` or already created. | Aria | Alex |
| Four skills | Exactly 20 points in total. | 6, 6, 4, 4 | 6, 6, 5, 4 |
| Class + its main skill | Warrior: Strength ≥ 6; Mage: Magic ≥ 6; Ranger: Agility ≥ 6. | Mage with Magic = 6 | Mage with Magic = 5 |
| Four skills | Max skill − min skill ≤ 6. | 6, 6, 4, 4 | 10, 8, 1, 1 |

Other validations (required fields, skill 1–10, name length) use HTML attributes and JavaScript. The JavaScript sets `form.noValidate = true`, but uses `checkValidity()`.

## Submission checklist

- [ ] Upload all HTML, CSS and separate JS files to your **own** GitHub repository.
- [ ] Create report named `Assignment5_YourName.docx` or `.pdf`.
- [ ] Include your name and group, option names (1A / 2B / 3B), screenshots, short explanations, Task 3 rule table (above), conclusion and GitHub URL.
- [ ] Add GitHub Pages URL if these pages are included in your site project.
- [ ] Check layouts on 375px and 1280px and prepare for live defense and live coding.
- [ ] Personalize and fully understand your work. Per the assignment, identical submissions or inability to explain your code may receive zero.
