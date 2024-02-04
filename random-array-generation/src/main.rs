use rand::{rngs::SmallRng, seq::SliceRandom, Rng, SeedableRng};
use std::iter::*;

fn generate_non_succinct(rng: &mut SmallRng, n: usize, k: usize) -> Vec<i32> {
    let mut array: Vec<i32> = repeat(1).take(k).chain(repeat(0).take(n - k)).collect();
    array.shuffle(rng);
    return array;
}

fn generate_succinct<'a>(rng: &'a mut SmallRng, n: usize, k: usize) -> impl Iterator<Item=i32> + 'a {
    return (0..n).scan(0, move |s, i| {
        let outcome = if rng.gen_range(0..n-i) < k - *s { 1 } else { 0 };
        *s += outcome;
        Some(outcome as i32)
    });
}

fn main() {
    let mut rng = rand::rngs::SmallRng::from_seed([0u8; 32]);
    for _ in 0..10000 {
        println!("non-succinct: {:?}", generate_non_succinct(&mut rng, 5, 3));
    }
    for _ in 0..10000 {
        println!("succinct: {:?}", generate_succinct(&mut rng, 5, 3).collect::<Vec<i32>>());
    }
}
