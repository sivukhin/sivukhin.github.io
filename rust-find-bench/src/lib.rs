pub fn find_naive(haystack: &[u8], needle: u8) -> Option<usize> {
    for i in 0..haystack.len() {
        if haystack[i] == needle {
            return Some(i);
        }
    }
    None
}

pub fn find_naive2(haystack: &[u8], needle: u8) -> Option<usize> {
    let mut pos = None;
    for i in (0..haystack.len()).rev() {
        if haystack[i] == needle {
            pos = Some(i);
        }
    }
    pos
}

fn find_branchless(haystack: &[u8], needle: u8) -> Option<usize> {
    return haystack
        .iter()
        .enumerate()
        .filter(|&(_, &b)| b == needle)
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
