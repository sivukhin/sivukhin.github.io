build:
	cargo build
test:
	cargo test
run-non-succinct:
	cargo run | grep -P '^non-succinct' | sort | uniq -c | sort -h
run-succinct:
	cargo run | grep -P '^succinct' | sort | uniq -c | sort -h
