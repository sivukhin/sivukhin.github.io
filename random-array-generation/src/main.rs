use rand::{rngs::SmallRng, Rng, SeedableRng};

pub fn generate_non_succinct(rng: &mut SmallRng, n: i32, k: i32) -> Vec<i32> {
    let mut array: Vec<i32> = std::iter::repeat(1).take(k as usize).chain(std::iter::repeat(0).take((n - k) as usize)).collect();
    for i in 0..n as usize {
        let j = rng.gen_range(0..i + 1);
        (array[i], array[j]) = (array[j], array[i]);
    }
    return array;
}

fn main() {
    for _ in 0..10000 {
        let mut rng = rand::rngs::SmallRng::from_entropy();
        println!("non-succinct: {:?}", generate_non_succinct(&mut rng, 5, 3));
    }
}
