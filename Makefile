build: clean
	cd godjotblog && go mod tidy
	cd godjotblog && go run main.go -dir ../ -root index.html -title "naming is hard" -author "Nikita Sivukhin" -mode build
serve: clean
	cd godjotblog && go mod tidy
	cd godjotblog && go run main.go -dir ../ -root index.html -title "naming is hard" -author "Nikita Sivukhin" -mode serve
clean:
	find . -name '*.html' | grep -v godjotblog | xargs -r -- rm
