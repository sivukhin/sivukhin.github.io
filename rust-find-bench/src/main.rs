use std::hint::black_box;

// #[inline(never)]
// pub fn find(haystack: &[u8], needle: u8) -> Option<usize> {
//     haystack.iter().position(|&x| x == needle)
// }

// #[inline(never)]
// pub fn find(haystack: &[u8; 16], needle: u8) -> Option<usize> {
//     let mut position = None;
//     for (i, &b) in haystack.iter().enumerate().rev() {
//         if b == needle {
//             position = Some(i);
//         }
//     }
//     position
// }

fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
    haystack.iter().position(|&x| x == needle)
}

// #[inline(never)]
// fn find_chunks(haystack: &[u8], needle: u8) -> Option<usize> {
//     haystack
//         .chunks(32)
//         .enumerate()
//         .find_map(|(i, chunk)| find_naive(chunk, needle).map(|x| 32 * i + x))
// }

#[inline(never)]
fn find_chunks(haystack: &[u8], needle: u8) -> Option<usize> {
    let chunks = haystack.chunks_exact(32);
    let remainder = chunks.remainder();

    chunks
        .enumerate()
        .find_map(|(i, chunk)| find_naive(chunk, needle).map(|x| 32 * i + x))
        .or(find_naive(remainder, needle))
}

// #[inline(never)]
// pub fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
//     for i in 0..haystack.len() {
//         if haystack[i] == needle {
//             return Some(i);
//         }
//     }
//     None
// }

// pub fn find_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
//     return haystack
//         .iter()
//         .enumerate()
//         .filter(|&(_, &b)| b == needle)
//         .rfold(None, |_, (i, _)| Some(i));
// }

// #[inline(never)]
// pub fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
//     let chunks = haystack.chunks_exact(32);
//     let remainder = chunks.remainder();
//     chunks
//         .enumerate()
//         .find_map(|(i, chunk)| find_branchless(chunk, needle).map(|x| 32 * i + x))
//         .or(find_branchless(remainder, needle).map(|x| (haystack.len() & !0x1f) + x))
// }

// #[inline(never)]
// fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
//     haystack.iter().position(|&x| x == needle)
// }

fn main() {
    // let mut buffer = String::new();
    // std::io::stdin().read_line(&mut buffer).unwrap();
    // let data = buffer128
    //     .split(" ")
    //     .map(|x| x.parse::<u8>().unwrap())
    //     .collect::<Vec<u8>>();
    let result = find_chunks(black_box(&[1u8; 1024]), 0);
    // let result = find_naive2(&data, 0);
    println!("{:?}", result);
    // let mut data = black_box([1, 2, 3, 4, 5]);
    // kek(&mut data);
    // println!("{:?}", data);
}
