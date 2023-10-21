#!/usr/bin/env bash

clear
echo "Who is best pony?"

best_pony="Pinkie Pie"
best_pony_length=${#best_pony}
cursor=0

while true; do
	stty -icanon -echo
	char=$(dd bs=1 count=1 2> /dev/null)
	stty sane
	case $char in
		"$(printf "\n")")
			if [ $cursor -eq $best_pony_length ]; then
				printf "\nThank you for confirming that %s is the best pony!\n" "$best_pony"
				break
			fi
			;;
		$'\177')
			if [ $cursor -gt 0 ]; then
				cursor=$((cursor - 1))
			fi
			;;
		*)
			if [ $cursor -lt $best_pony_length ]; then
				cursor=$((cursor + 1))
			fi
			;;
	esac
	display_best_pony="${best_pony:0:$cursor}"
	printf "\r\033[K%s" "$display_best_pony"
done
