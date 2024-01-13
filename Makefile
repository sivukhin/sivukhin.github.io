build:
	cd godjotblog && go mod tidy
	cd godjotblog && go run main.go -dir ../ -root index.html -title "naming is hard" -author "Nikita Sivukhin" -mode build
serve:
	cd godjotblog && go mod tidy
	cd godjotblog && go run main.go -dir ../ -root index.html -title "naming is hard" -author "Nikita Sivukhin" -mode serve
