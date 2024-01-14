fn find_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
    return haystack
        .iter()
        .enumerate()
        .filter(|(_, &b)| b == needle)
        .rfold(None, |_, (i, _)| Some(i));
}

pub fn find_chunks_exact_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
    let chunks = haystack.chunks_exact(32);
    let remainder = chunks.remainder();
    chunks
        .enumerate()
        .find_map(|(i, chunk)| find_branchless(chunk, needle).map(|x| 32 * i + x))
        .or(find_branchless(remainder, needle).map(|x| (haystack.len() & !0x1f) + x))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn find_works() {
        assert_eq!(
            find_chunks_exact_branchless(&[1, 2, 3, 4, 5, 6], 3),
            Some(2)
        );
        for l in 1..128 {
            let slice = &{
                let mut a = vec![0u8; l];
                a[l - 1] = 1;
                a
            };
            assert_eq!(find_chunks_exact_branchless(slice, 1), Some(l - 1));
        }
    }
}
