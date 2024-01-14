use std::fs;
use criterion::{criterion_group, criterion_main, Criterion};

fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
    haystack.iter().position(|&x| x == needle)
}

fn find_chunks(haystack: &[u8], needle: u8) -> Option<usize> {
    haystack
        .chunks(32)
        .enumerate()
        .find_map(|(i, chunk)| { find_naive(chunk, needle).map(|x| 32 * i + x) })
}

fn find_chunks_exact(haystack: &[u8], needle: u8) -> Option<usize> {
    let chunks = haystack.chunks_exact(32);
    let remainder = chunks.remainder();

    chunks.enumerate()
        .find_map(|(i, chunk)| { find_naive(chunk, needle).map(|x| 32 * i + x) })
        .or(find_naive(remainder, needle))
}

pub fn find_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
    return haystack
        .iter()
        .enumerate()
        .filter(|(_, &b)| b == needle)
        .rfold(None, |_, (i, _)| Some(i))
}

pub fn find_chunks_exact_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
    let chunks = haystack.chunks_exact(32);
    let remainder = chunks.remainder();
    chunks
        .enumerate()
        .find_map(|(i, chunk)| find_branchless(chunk, needle).map(|x| 32 * i + x))
        .or(find_branchless(remainder, needle).map(|x| (haystack.len() & !0x1f) + x))
}

fn find_naive_bench(c: &mut Criterion) {
    let input = fs::read("benches/data.bin").unwrap();
    c.bench_function("find_naive", |b| { b.iter(|| find_naive(&input, b'\0' )) });
}

fn find_chunks_bench(c: &mut Criterion) {
    let input = fs::read("benches/data.bin").unwrap();
    c.bench_function("find_chunks", |b| { b.iter(|| find_chunks(&input, b'\0') ); });
}

fn find_chunks_exact_bench(c: &mut Criterion) {
    let input = fs::read("benches/data.bin").unwrap();
    c.bench_function("find_chunks_exact", |b| { b.iter(|| find_chunks_exact(&input, b'\0') ); });
}

fn find_branchless_bench(c: &mut Criterion) {
    let input = fs::read("benches/data.bin").unwrap();
    c.bench_function("find_branchless", |b| { b.iter(|| find_branchless(&input, b'\0') ); });
}

fn find_chunks_exact_branchless_bench(c: &mut Criterion) {
    let input = fs::read("benches/data.bin").unwrap();
    c.bench_function("find_chunks_exact_branchless", |b| { b.iter(|| find_chunks_exact_branchless(&input, b'\0') ); });
}

criterion_group!(benches, find_naive_bench, find_chunks_bench, find_chunks_exact_bench, find_branchless_bench, find_chunks_exact_branchless_bench);
criterion_main!(benches);

