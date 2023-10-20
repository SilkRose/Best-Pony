import "@total-typescript/ts-reset";

const best_pony = "Pinkie Pie" as const;

enum InputType {
	text = "text",
	number = "number",
	radio = "radio",
}

const game_content = document.getElementById("game-content")!;

await get_best_pony();

function append_element(element: string) {
	const new_element = document.createElement("div");
	new_element.className = "content";
	new_element.innerHTML = `${element}`;
	game_content.appendChild(new_element);
	new_element.scrollIntoView();
}

async function get_best_pony() {
	const question = "Who is best Pony?";
	append_element(question);
	await assert_best_pony(best_pony);
	game_content.removeChild(game_content.lastChild!);
	const question2 = `Please confirm that ${best_pony} is indeed best pony.`;
	append_element(question2);
	await assert_best_pony("Yes!");
	game_content.removeChild(game_content.lastChild!);
}

async function assert_best_pony(answer: string) {
	const input_field = create_text_input_field(InputType.text, false);
	const button = create_button_element("submit", "Enter");
	game_content.appendChild(input_field);
	const input = document.getElementById("input") as HTMLInputElement;
	input.focus();
	input.scrollIntoView();
	on_paste_event_override(input, answer);
	await Promise.resolve(
		get_promise_from_input_event_override(input, "keydown", answer, button)
	);
}

function get_promise_from_input_event_override(
	item: HTMLInputElement,
	event: string,
	answer: string,
	button: HTMLButtonElement
) {
	return new Promise<void>((resolve) => {
		const listener = () => {
			item.onkeyup = function (key) {
				const cursor_position = item.selectionStart;
				item.value = answer.slice(0, item.value.length);
				item.setSelectionRange(cursor_position, cursor_position);
				if (item.value !== answer && document.contains(button)) {
					button.remove();
				}
				if (item.value.length > 0) {
					if (item.value === answer) {
						if (key.key === "Enter") {
							item.removeEventListener(event, listener);
							resolve();
						} else {
							item.parentElement!.appendChild(button);
							button.onclick = function () {
								item.removeEventListener(event, listener);
								resolve();
							};
						}
					}
				}
			};
		};
		item.addEventListener(event, listener);
	});
}

function on_paste_event_override(input: HTMLInputElement, answer: string) {
	input.addEventListener("paste", (event) => {
		event.preventDefault();
		let text = event.clipboardData!.getData("text");
		if (input.value.length > answer.length) {
			input.value = answer;
		} else {
			input.value = answer.slice(0, text.length);
		}
	});
}

function create_text_input_field(type: InputType, button: boolean) {
	const new_element = create_div_element(["content"], "input_field");
	new_element.appendChild(
		create_text_input_element("input", type, "Enter response...")
	);
	if (button) {
		new_element.appendChild(create_button_element("submit", "Enter"));
	}
	return new_element;
}

function create_text_input_element(
	id: string,
	type: InputType,
	placeholder: string,
	value?: string
) {
	const input = document.createElement("input");
	input.type = type;
	input.id = id;
	input.placeholder = placeholder;
	if (value) input.value = value;
	return input;
}

function create_button_element(id: string, text: string) {
	const button = document.createElement("button");
	button.id = id;
	button.innerText = text;
	return button;
}

function create_div_element(classes?: string[], id?: string) {
	const div = document.createElement("div");
	if (classes) div.className = classes.join(" ");
	if (id) div.id = id;
	return div;
}
