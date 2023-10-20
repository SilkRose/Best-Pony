import { exit } from "process";
import * as rl from "readline";

async function get_best_pony() {
	const question = "Who is best Pony? :";
	const answer = "Pinkie Pie";
	rl.emitKeypressEvents(process.stdin);
	if (process.stdin.isTTY) process.stdin.setRawMode(true);
	process.stdin.write(question);
	let i = 0;
	while (i < answer.length) {
		i = await assert_best_pony(question, answer, i);
	}
	const question2 = `Please confirm that ${answer} is indeed best pony. :`;
	const answer2 = "Yes!";
	process.stdin.write("\n" + question2);
	i = 0;
	while (i < answer2.length) {
		i = await assert_best_pony(question2, answer2, i);
	}
	console.log();
	process.stdin.setRawMode(false);
	exit(0);
}

function assert_best_pony(question: string, answer: string, i: number) {
	return new Promise<number>((res) => {
		process.stdin.once("keypress", (_, key) => {
			let rv;
			if (key.name === "backspace" || key.name === "delete") rv = i - 1;
			else rv = i + 1;
			if (rv < 0) rv = 0;
			let text = question + answer.slice(0, rv);
			process.stdout.write("\r");
			process.stdout.write(" ".repeat(process.stdout.columns));
			process.stdout.write("\r");
			process.stdout.write(text);
			res(rv);
		});
	});
}

get_best_pony();
